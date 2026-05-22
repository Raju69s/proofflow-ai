"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CreditCard,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Toast } from '../../../components/ui/Toast';

import { createClient } from '../../../lib/supabase/client';

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState('free'); // 'free' | 'pro'
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadSubscriptionPlan() {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('plan_type')
          .eq('user_id', user.id)
          .maybeSingle();

        if (sub?.plan_type) {
          setCurrentPlan(sub.plan_type);
          localStorage.setItem('proofflow_user_plan', sub.plan_type);
        }
      } catch (err) {
        console.error("Failed to load subscription status from database:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSubscriptionPlan();
  }, []);

  const handleTogglePlan = async (plan) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setToastMessage({ message: "Authentication required to switch plans.", type: 'error' });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan_type: plan,
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      setCurrentPlan(plan);
      localStorage.setItem('proofflow_user_plan', plan);
      
      const msg = plan === 'pro' 
        ? "Successfully upgraded to Pro Plan! Enjoy unlimited Generations and Watermark removal." 
        : "Downgraded to Free Tier. Custom branding and long copywriting are now locked.";
      
      setToastMessage({ message: msg, type: plan === 'pro' ? 'success' : 'info' });
      
      // Dispatch custom event to update sidebar and global states in real time
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('pf_state_sync'));
    } catch (err) {
      console.error("Failed to switch subscription plan:", err);
      setToastMessage({ message: "Unable to update billing plan. Please try again.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 border-r-2 border-emerald-500/20"></div>
        <p className="text-slate-400 text-[10px] tracking-widest uppercase font-semibold">Contacting secure membership network...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl mx-auto">
      {/* 1. Page Header */}
      <div>
        <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
          Membership Plan
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Manage your trade subscription. Switch plans instantly to unlock advanced content tools and custom watermarks.
        </p>
      </div>

      {/* Current plan status banner */}
      <div className="p-6 rounded-2xl glass-premium border border-white/5 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 h-48 w-48 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />
        
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Your Active Subscription</span>
          <h2 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
            {currentPlan === 'pro' ? "Pro SaaS Member" : "Free Plan Access"}
            <Badge variant={currentPlan === 'pro' ? 'pro' : 'primary'}>
              {currentPlan === 'pro' ? 'Active Pro' : 'Free Limits'}
            </Badge>
          </h2>
          <p className="text-slate-400 text-xs mt-2 font-sans max-w-md">
            {currentPlan === 'pro' 
              ? "You have full commercial credentials. Unlimited PDF reports, no watermarks, and full platforms SEO post copy access."
              : "You are limited to 5 AI generations per month, watermarked reports, and 1MB knowledge base capacity."}
          </p>
        </div>

        <div className="shrink-0">
          <Badge variant="success">Stripe Billing Active</Badge>
        </div>
      </div>

      {/* 2. Billing Matrix Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <Card variant="glass" className="p-8 border border-white/5 flex flex-col justify-between h-full relative">
          <div>
            <h3 className="font-display font-bold text-xl text-white mb-2">Free Plan</h3>
            <p className="text-slate-400 text-xs mb-6">Experience ProofFlow and start sharing jobs.</p>
            <div className="flex items-baseline text-white gap-1 mb-8">
              <span className="text-4xl font-extrabold font-display">$0</span>
              <span className="text-slate-500 text-sm">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>5 AI Generations/Month</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>Before & After PDF (Watermarked)</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>1MB Knowledge Base Limit</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>Short-length social posts only</span>
              </li>
            </ul>
          </div>
          
          <Button 
            variant={currentPlan === 'free' ? 'outline' : 'secondary'} 
            disabled={currentPlan === 'free' || isLoading}
            onClick={() => handleTogglePlan('free')}
            className="w-full py-3 font-semibold"
          >
            {currentPlan === 'free' ? 'Your Active Plan' : 'Downgrade to Free'}
          </Button>
        </Card>

        {/* Pro Plan */}
        <Card variant="glass" className="p-8 border-2 border-emerald-500/30 flex flex-col justify-between h-full relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-bold font-display text-[10px] tracking-wider uppercase px-3 py-1 rounded-bl-lg">
            Most Popular
          </div>

          <div>
            <h3 className="font-display font-bold text-xl text-white mb-2">Pro SaaS</h3>
            <p className="text-slate-400 text-xs mb-6">Complete local marketing machine for trades.</p>
            <div className="flex items-baseline text-white gap-1 mb-8">
              <span className="text-4xl font-extrabold font-display text-gradient-emerald">$29</span>
              <span className="text-slate-500 text-sm">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-slate-200">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span className="font-semibold">Unlimited generations</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-200">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>Remove all PDF Watermarks</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-200">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>10MB Knowledge Base Limit</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-200">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>All platform posts (unlimited lengths)</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-200">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>Priority AI queueing & support</span>
              </li>
            </ul>
          </div>

          <Button 
            variant="accent" 
            disabled={currentPlan === 'pro' || isLoading}
            onClick={() => handleTogglePlan('pro')}
            className="w-full py-3 font-bold shadow-md shadow-emerald-500/10"
          >
            {currentPlan === 'pro' ? 'Your Active Plan' : 'Upgrade to Pro'}
          </Button>
        </Card>
      </div>

      {/* Payment providers security indicator */}
      <div className="p-5 rounded-xl bg-slate-950 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Secure Encrypted Payments</h4>
            <p className="text-[10px] text-slate-500 font-sans">Processed securely via Stripe & PayPal merchant platforms.</p>
          </div>
        </div>
        <div className="flex gap-4 items-center opacity-60 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Stripe</span>
          <span className="border-l border-white/10 h-4" />
          <span>PayPal</span>
        </div>
      </div>

      {/* Custom toasts */}
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
