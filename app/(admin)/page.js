"use client";

import React, { useState, useEffect } from 'react';
import { 
  FolderLock, 
  Users, 
  CreditCard, 
  Cpu, 
  HardDrive, 
  Settings2, 
  Sparkles, 
  Check, 
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Switch } from '../../components/ui/Switch';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { DEFAULT_MODULES } from '../../lib/services/modules';
import { createClient } from '../../lib/supabase/client';

export default function AdminPage() {
  const [modules, setModules] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Create module form state
  const [newKey, setNewKey] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPlan, setNewPlan] = useState('free');
  const [newStatus, setNewStatus] = useState('active'); // 'active' | 'coming_soon'
  const supabase = createClient();

  // Load modules registry on mount
  useEffect(() => {
    async function fetchModules() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('modules')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setModules(data);
          localStorage.setItem('proofflow_modules', JSON.stringify(data));
        } else {
          setModules(DEFAULT_MODULES);
          localStorage.setItem('proofflow_modules', JSON.stringify(DEFAULT_MODULES));
        }
      } catch (err) {
        console.error("Failed to load modules from DB:", err);
        // Fallback to local storage
        const saved = localStorage.getItem('proofflow_modules');
        if (saved) {
          setModules(JSON.parse(saved));
        } else {
          setModules(DEFAULT_MODULES);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchModules();
  }, []);

  const handleToggleModule = async (key, val) => {
    try {
      const { error } = await supabase
        .from('modules')
        .update({ is_active: val })
        .eq('key', key);

      if (error) throw error;

      const updated = modules.map(m => m.key === key ? { ...m, is_active: val } : m);
      setModules(updated);
      localStorage.setItem('proofflow_modules', JSON.stringify(updated));
      setToastMessage({ message: `Module status updated in database.`, type: 'success' });
    } catch (err) {
      console.error("Failed to toggle module status:", err);
      setToastMessage({ message: `Database error. Toggle saved offline.`, type: 'warning' });
      const updated = modules.map(m => m.key === key ? { ...m, is_active: val } : m);
      setModules(updated);
      localStorage.setItem('proofflow_modules', JSON.stringify(updated));
    }
  };

  const handleChangeAccess = async (key, plan) => {
    try {
      const { error } = await supabase
        .from('modules')
        .update({ plan_access: plan })
        .eq('key', key);

      if (error) throw error;

      const updated = modules.map(m => m.key === key ? { ...m, plan_access: plan } : m);
      setModules(updated);
      localStorage.setItem('proofflow_modules', JSON.stringify(updated));
      setToastMessage({ message: `Access boundary updated in database.`, type: 'info' });
    } catch (err) {
      console.error("Failed to update plan access:", err);
      setToastMessage({ message: `Database error. Access saved offline.`, type: 'warning' });
      const updated = modules.map(m => m.key === key ? { ...m, plan_access: plan } : m);
      setModules(updated);
      localStorage.setItem('proofflow_modules', JSON.stringify(updated));
    }
  };

  const handleChangeStatus = (key, status) => {
    const updated = modules.map(m => m.key === key ? { ...m, coming_soon: status === 'coming_soon' } : m);
    setModules(updated);
    localStorage.setItem('proofflow_modules', JSON.stringify(updated));
    setToastMessage({ message: `Module flag updated.`, type: 'info' });
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!newKey.trim() || !newName.trim()) {
      setToastMessage({ message: "Please fill in all module metadata fields.", type: "warning" });
      return;
    }

    // Check duplicate
    if (modules.find(m => m.key === newKey.trim())) {
      setToastMessage({ message: "A module with this key already exists.", type: "error" });
      return;
    }

    const created = {
      key: newKey.trim(),
      name: newName.trim(),
      description: newDesc.trim(),
      is_active: true,
      plan_access: newPlan,
      coming_soon: newStatus === 'coming_soon'
    };

    try {
      const { error } = await supabase
        .from('modules')
        .insert({
          key: created.key,
          name: created.name,
          description: created.description,
          is_active: created.is_active,
          plan_access: created.plan_access
        });

      if (error) throw error;

      const updated = [...modules, created];
      setModules(updated);
      localStorage.setItem('proofflow_modules', JSON.stringify(updated));
      setToastMessage({ message: `Successfully registered new module "${newName}" in DB!`, type: "success" });
    } catch (err) {
      console.error("Failed to create module:", err);
      setToastMessage({ message: `Database error. Module registered offline.`, type: 'warning' });
      const updated = [...modules, created];
      setModules(updated);
      localStorage.setItem('proofflow_modules', JSON.stringify(updated));
    }

    // Reset form
    setNewKey('');
    setNewName('');
    setNewDesc('');
    setNewPlan('free');
    setNewStatus('active');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500 border-r-2 border-purple-500/20"></div>
        <p className="text-slate-400 text-[10px] tracking-widest uppercase font-semibold">Synchronizing with secure system registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* 1. KPIs Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Users size={16} />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Active Trades</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-display text-white">1,248</span>
            <span className="text-emerald-500 text-xs font-bold">+12%</span>
          </div>
        </Card>

        {/* KPI 2 */}
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CreditCard size={16} />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Active MRR</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-display text-white">$18,450</span>
            <span className="text-emerald-500 text-xs font-bold">+8%</span>
          </div>
        </Card>

        {/* KPI 3 */}
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Cpu size={16} />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">AI Token Usage</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-display text-white">4.8M</span>
            <span className="text-slate-500 text-xs font-medium">/ 10M cap</span>
          </div>
        </Card>

        {/* KPI 4 */}
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg">
              <HardDrive size={16} />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">KB Storage Size</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-display text-white">4.2GB</span>
            <span className="text-slate-500 text-xs font-medium">/ 50GB cap</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left side: Modules List */}
        <div className="lg:col-span-8">
          <Card variant="glass">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-purple-950/10 border-b border-purple-500/10">
              <div>
                <h3 className="font-display font-extrabold text-white text-lg flex items-center gap-2">
                  <FolderLock className="text-purple-400" size={20} />
                  Modular Plugin Switchboard
                </h3>
                <p className="text-slate-400 text-xs font-sans mt-1">
                  Adjust plan access, toggle active flags, or assign coming soon status. Changes map instantly to tradesmen views.
                </p>
              </div>
              <Badge variant="pro">SaaS Module Manager</Badge>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-white/5">
                {modules.map((m) => (
                  <div 
                    key={m.key} 
                    className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-150 ${m.is_active ? 'bg-transparent' : 'bg-red-500/[0.02]'}`}
                  >
                    {/* Info */}
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-xs font-bold transition-colors duration-150 ${m.is_active ? 'text-white' : 'text-slate-500 line-through'}`}>
                          {m.name}
                        </h4>
                        {m.coming_soon && (
                          <Badge variant="warning" className="text-[8px] font-bold">Coming Soon</Badge>
                        )}
                        {!m.is_active && (
                          <Badge variant="danger" className="text-[8px] font-bold">Disabled</Badge>
                        )}
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed font-sans">{m.description}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-4 shrink-0">
                      {/* Access selector */}
                      <select
                        value={m.plan_access}
                        disabled={!m.is_active}
                        onChange={(e) => handleChangeAccess(m.key, e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-purple-500 disabled:opacity-30 transition-all"
                      >
                        <option value="free">Free Access</option>
                        <option value="pro">Pro SaaS Only</option>
                      </select>

                      {/* Coming Soon status */}
                      <select
                        value={m.coming_soon ? 'coming_soon' : 'active'}
                        disabled={!m.is_active}
                        onChange={(e) => handleChangeStatus(m.key, e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-purple-500 disabled:opacity-30 transition-all"
                      >
                        <option value="active">Live Tool</option>
                        <option value="coming_soon">Coming Soon</option>
                      </select>

                      {/* Switch */}
                      <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                        <Switch
                          checked={m.is_active}
                          onChange={(val) => handleToggleModule(m.key, val)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right side: Register New Module Form */}
        <div className="lg:col-span-4">
          <Card variant="glass" className="p-5 border border-white/10">
            <CardHeader className="p-0 border-none mb-4">
              <h3 className="font-display font-extrabold text-white text-base flex items-center gap-2">
                <PlusCircle className="text-purple-400" size={18} />
                Register New SaaS Plugin
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Append fresh trade AI features dynamically to the system catalog.
              </p>
            </CardHeader>

            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                  Unique Tool Key
                </label>
                <input 
                  type="text" 
                  value={newKey}
                  placeholder="e.g. video-reels"
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                  Plugin Public Name
                </label>
                <input 
                  type="text" 
                  value={newName}
                  placeholder="e.g. AI Reel Script Generator"
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                  Description
                </label>
                <textarea 
                  rows={2}
                  value={newDesc}
                  placeholder="Describe what the trade tool accomplishes..."
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-all font-sans placeholder:text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                    Plan Group
                  </label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="free">Free Plan</option>
                    <option value="pro">Pro Plan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                    Initial Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="active">Live Tool</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>

              <Button 
                variant="accent" 
                type="submit" 
                className="w-full py-3 text-xs font-bold bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/10 mt-2"
              >
                Register Module
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* RLS notice */}
      <div className="p-4 rounded-xl bg-purple-500/[0.03] border border-purple-500/10 flex items-start gap-3">
        <AlertCircle size={16} className="text-purple-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          <strong>Security Note:</strong> Trigger profiles are configured. Modifying access configurations will immediately write to localStorage registry, filtering accessible tabs inside tradesmen dashboard portals.
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
