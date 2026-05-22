"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Grid, 
  BookOpen, 
  Settings, 
  Menu, 
  X, 
  User, 
  Zap, 
  FileText,
  FileCheck, 
  Settings2,
  HardDrive
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { createClient } from '../../lib/supabase/client';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free'); // 'free' | 'pro'
  const [generationsUsed, setGenerationsUsed] = useState(0);
  const [companyName, setCompanyName] = useState("John's Plumbing");
  const [storageUsed, setStorageUsed] = useState(0.2); // Default mock fallback
  const maxGenerations = 5;
  const supabase = createClient();

  useEffect(() => {
    async function loadUserSessionAndDetails() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch Profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_name')
          .eq('id', user.id)
          .maybeSingle();
        if (profile?.company_name) {
          setCompanyName(profile.company_name);
        }

        // Fetch Subscription
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('plan_type, monthly_generations_used')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (sub) {
          setCurrentPlan(sub.plan_type || 'free');
          setGenerationsUsed(sub.monthly_generations_used || 0);
          localStorage.setItem('proofflow_user_plan', sub.plan_type || 'free');
        }

        // Fetch Storage volume
        const { data: kbFiles } = await supabase
          .from('knowledge_base')
          .select('file_size_bytes')
          .eq('user_id', user.id);
        
        if (kbFiles) {
          const totalBytes = kbFiles.reduce((acc, f) => acc + (f.file_size_bytes || 0), 0);
          const totalMb = Math.max(0.1, parseFloat((totalBytes / (1024 * 1024)).toFixed(2)));
          setStorageUsed(totalMb);
        }
      } catch (err) {
        console.error("Failed to load sidebar metrics from database:", err);
      }
    }

    loadUserSessionAndDetails();

    // Listen for custom trigger to reload state (e.g. from post-generation or upgrades)
    const handleStorageChange = () => {
      loadUserSessionAndDetails();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('pf_state_sync', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('pf_state_sync', handleStorageChange);
    };
  }, []);

  const storageLimit = currentPlan === 'free' ? 1.0 : 10.0;
  const storagePercentage = Math.min(100, (storageUsed / storageLimit) * 100);

  return (
    <div className="min-h-screen flex bg-background/95">
      {/* 1. Responsive mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Sidebar panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 glass border-r border-white/5 flex flex-col justify-between
        transition-transform duration-300 md:translate-x-0 md:static md:h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col flex-grow">
          {/* Header brand logo */}
          <div className="h-16 border-b border-white/5 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-tr from-primary to-emerald-500 rounded-lg text-white">
                <ShieldCheck size={18} />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                ProofFlow<span className="text-emerald-400">.ai</span>
              </span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/tools" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <Grid size={18} />
              <span>All Tools</span>
            </Link>
            <Link href="/dashboard/reports" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <FileCheck size={18} />
              <span>Before & After Reports</span>
            </Link>
            <Link href="/dashboard/social-posts" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <FileText size={18} />
              <span>AI Social Posts</span>
            </Link>
            <Link href="/dashboard/kb" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <BookOpen size={18} />
              <span>Knowledge Base</span>
            </Link>
            <Link href="/dashboard/seo-setup" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <Settings2 size={18} />
              <span>SEO Setup</span>
            </Link>
            <Link href="/dashboard/billing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <Zap size={18} />
              <span>Membership Plan</span>
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar footer metrics */}
        <div className="p-4 border-t border-white/5 bg-black/20 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold uppercase tracking-wider">Active Plan</span>
              <Badge variant={currentPlan === 'pro' ? 'pro' : 'primary'}>
                {currentPlan === 'pro' ? 'Pro SaaS' : 'Free Tier'}
              </Badge>
            </div>
            
            {/* Generation indicator */}
            {currentPlan === 'free' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Generations Used</span>
                  <span>{generationsUsed} / {maxGenerations}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    style={{ width: `${(generationsUsed / maxGenerations) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Storage indicator */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1"><HardDrive size={10} /> Storage Used</span>
                <span>{storageUsed.toFixed(1)}MB / {storageLimit}MB</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>
            </div>
          </div>

          {currentPlan === 'free' && (
            <Button variant="accent" size="sm" className="w-full gap-1 text-[11px] font-bold shadow-md shadow-emerald-500/10">
              <Zap size={12} /> Upgrade to Pro
            </Button>
          )}

          {/* Admin panel quick gateway */}
          <Link href="/admin" className="block text-center text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest pt-1">
            Access System Admin
          </Link>
        </div>
      </aside>

      {/* 3. Main dashboard wrapper */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-950/30 backdrop-blur">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-white/5 rounded-lg text-slate-300"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            {/* Real profile widget */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {companyName ? companyName.charAt(0).toUpperCase() : 'P'}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline-block">{companyName}</span>
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-grow p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
