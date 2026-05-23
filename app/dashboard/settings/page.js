"use client";

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Building, 
  Phone, 
  Globe, 
  User, 
  Check, 
  HelpCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Toast } from '../../../components/ui/Toast';
import { createClient } from '../../../lib/supabase/client';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    companyName: "",
    ownerName: "",
    phone: "",
    websiteUrl: "",
    tradeType: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const supabase = createClient();

  // Load settings from Supabase database
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Query profiles table
        const { data: dbProfile, error: profError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profError) throw profError;

        // Query seo_settings table for tradeType fallback
        const { data: dbSeo } = await supabase
          .from('seo_settings')
          .select('answers')
          .eq('user_id', user.id)
          .maybeSingle();

        setProfile({
          companyName: dbProfile?.company_name || "",
          ownerName: dbProfile?.owner_name || "",
          phone: dbProfile?.phone || "",
          websiteUrl: dbProfile?.website || "",
          tradeType: dbSeo?.answers?.tradeType || "General Trade"
        });
      } catch (err) {
        console.error("Failed to load settings from Supabase:", err);
        setToastMessage({ message: "Failed to connect to server. Showing local cache.", type: "warning" });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleInputChange = (key, val) => {
    setProfile(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setToastMessage({ message: "Authentication required to update profile.", type: "error" });
        return;
      }

      // 1. Update profiles table
      const { error: profError } = await supabase
        .from('profiles')
        .update({
          company_name: profile.companyName,
          owner_name: profile.ownerName,
          phone: profile.phone,
          website: profile.websiteUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profError) throw profError;

      // 2. Fetch and synchronize seo_settings to keep in complete sync
      const { data: dbSeo } = await supabase
        .from('seo_settings')
        .select('answers')
        .eq('user_id', user.id)
        .maybeSingle();

      const existingAnswers = dbSeo?.answers || {};
      const newAnswers = {
        ...existingAnswers,
        companyName: profile.companyName,
        ownerName: profile.ownerName,
        phone: profile.phone,
        websiteUrl: profile.websiteUrl,
        tradeType: profile.tradeType
      };

      const { error: seoError } = await supabase
        .from('seo_settings')
        .upsert({
          user_id: user.id,
          answers: newAnswers,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (seoError) throw seoError;

      // Update local storage just as offline cache
      localStorage.setItem('proofflow_seo_answers', JSON.stringify(newAnswers));

      setToastMessage({ message: "Business profile details synchronized successfully!", type: "success" });
      
      // Dispatch global sync event to notify layout headers to update
      window.dispatchEvent(new Event('pf_state_sync'));
    } catch (err) {
      console.error("Save settings failure:", err);
      setToastMessage({ message: "Failed to persist updates to database: " + err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="space-y-2">
          <div className="h-7 bg-white/5 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse animate-pulse-slow" />
        </div>
        <Card variant="glass" className="p-6 border border-white/5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-white/5 rounded w-1/4 animate-pulse" />
                <div className="h-10 bg-white/5 rounded w-full animate-pulse" />
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4 border-t border-white/5">
            <div className="h-10 bg-white/5 rounded w-32 animate-pulse" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl mx-auto">
      {/* 1. Header */}
      <div>
        <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
          Business Settings
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Adjust your trade profile configurations. Update parameters are referenced in custom proof documents.
        </p>
      </div>

      {/* 2. Main Config Card */}
      <Card variant="glass" className="border border-white/10 shadow-2xl">
        <CardHeader className="bg-emerald-950/10 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-display font-bold text-white text-base">Profile Setup</h3>
          <Badge variant="success">Synchronized</Badge>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Field 1 */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Building size={12} className="text-emerald-400" />
                  <span>Company Name</span>
                </label>
                <input 
                  type="text" 
                  value={profile.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Field 2 */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <User size={12} className="text-emerald-400" />
                  <span>Owner Name</span>
                </label>
                <input 
                  type="text" 
                  value={profile.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Field 3 */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Phone size={12} className="text-emerald-400" />
                  <span>Business Phone</span>
                </label>
                <input 
                  type="text" 
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Field 4 */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Globe size={12} className="text-emerald-400" />
                  <span>Website URL</span>
                </label>
                <input 
                  type="url" 
                  value={profile.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Field 5 */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Sparkles size={12} className="text-emerald-400" />
                  <span>Primary Trade Category</span>
                </label>
                <input 
                  type="text" 
                  value={profile.tradeType}
                  onChange={(e) => handleInputChange('tradeType', e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <Button 
                variant="accent" 
                type="submit" 
                disabled={saving}
                className="font-bold py-3 px-6 gap-1.5"
              >
                <Check size={16} /> {saving ? "Saving Changes..." : "Save Profiles"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Info notice */}
      <div className="p-4 rounded-xl bg-slate-950 border border-white/5 flex items-start gap-3">
        <HelpCircle size={16} className="text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
          <strong>Database Synchronization:</strong> Profile settings are written directly to profiles table under multi-tenant RLS guards. Values are retrieved when generating proof sheets.
        </p>
      </div>

      {/* Toast popup */}
      {toastMessage && (
        <Toast 
          message={toastMessage.message} 
          type={toastMessage.type} 
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
