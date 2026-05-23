"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Grid, 
  FileText, 
  Sparkles, 
  BookOpen, 
  Lock, 
  ShieldCheck, 
  Check, 
  MessageSquare,
  Zap,
  HelpCircle,
  FileCheck,
  Video,
  Globe,
  Camera,
  Settings2
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { createClient } from '../../../lib/supabase/client';
import { getDashboardTools, DEFAULT_MODULES } from '../../../lib/services/modules';

export default function AllToolsPage() {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [modules, setModules] = useState([]);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadTools() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        let userPlan = 'free';
        if (user) {
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('plan_type')
            .eq('user_id', user.id)
            .maybeSingle();
          if (sub?.plan_type) {
            userPlan = sub.plan_type;
          }
        }
        setCurrentPlan(userPlan);
        
        const toolsList = await getDashboardTools(supabase, userPlan);
        setModules(toolsList);
      } catch (err) {
        console.error("Failed to load tools from database:", err);
        // Fallback to offline defaults
        setModules(DEFAULT_MODULES);
      } finally {
        setLoading(false);
      }
    }
    loadTools();
  }, []);

  const icons = {
    'reports': <FileCheck size={20} />,
    'social-posts': <FileText size={20} />,
    'seo-wizard': <Settings2 size={20} />,
    'kb-facts': <BookOpen size={20} />,
    'review-reply': <MessageSquare size={20} />,
    'reel-hooks': <Video size={20} />,
    'website-copy': <Globe size={20} />,
    'auto-watermark': <Camera size={20} />
  };

  // Helper inside loop since Lucide names vary
  const getIcon = (key) => {
    return icons[key] || <Sparkles size={20} />;
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="space-y-2">
          <div className="h-7 bg-white/5 rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-1/3 animate-pulse animate-pulse-slow" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6 h-48 flex flex-col justify-between border border-white/5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-white/5 rounded-lg animate-pulse" />
                  <div className="h-5 bg-white/5 rounded w-16 animate-pulse" />
                </div>
                <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-white/5 rounded w-5/6 animate-pulse" />
              </div>
              <div className="h-9 bg-white/5 rounded w-full animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-6xl mx-auto">
      {/* 1. Page Header */}
      <div>
        <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
          AI Tools Marketplace
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          A WordPress-style plugin system. Explore active tools or upgrade to unlock advanced premium modules.
        </p>
      </div>

      {/* 2. Grid list of modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules
          .filter(m => m.is_active !== false) // Only show active modules
          .map((m) => {
            const isProTool = m.plan_access === 'pro';
            const isLocked = isProTool && currentPlan === 'free';
            
            return (
              <Card 
                key={m.key} 
                variant={isLocked ? "outline" : "glass"}
                className={`p-6 border flex flex-col justify-between h-full relative ${isLocked ? 'border-white/5 bg-slate-950/20' : 'border-white/5'}`}
              >
                <div>
                  {/* Top indicators */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`
                      h-10 w-10 rounded-lg flex items-center justify-center shrink-0
                      ${isLocked 
                        ? 'bg-slate-900 text-slate-500 border border-white/5' 
                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}
                    `}>
                      {getIcon(m.key)}
                    </div>

                    <Badge variant={isProTool ? "pro" : "success"}>
                      {isProTool ? "Pro SaaS" : "Free Access"}
                    </Badge>
                  </div>

                  {/* Body details */}
                  <h3 className={`font-display font-bold text-base mb-1 ${isLocked ? 'text-slate-400' : 'text-white'}`}>
                    {m.name}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans mb-6">
                    {m.description}
                  </p>
                </div>

                {/* Dynamic Actions button */}
                <div>
                  {isLocked ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setUpgradeModalOpen(true)}
                      className="w-full py-2.5 text-xs gap-1.5 font-bold border-dashed border-white/10 hover:border-white/20"
                    >
                      <Lock size={12} /> Unlock Premium
                    </Button>
                  ) : (
                    <Link href={`/dashboard/${m.key === 'kb-facts' ? 'kb' : m.key === 'seo-wizard' ? 'seo-setup' : m.key}`}>
                      <Button variant="secondary" size="sm" className="w-full py-2.5 text-xs font-semibold">
                        Launch Tool
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
      </div>

      {/* 3. Global active banner */}
      <div className="p-4 rounded-xl bg-indigo-500/[0.02] border border-indigo-500/10 flex items-start gap-3">
        <HelpCircle size={16} className="text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          <strong>Modular Architecture:</strong> Administrators can globally activate future plugins (e.g. review reply, reel script engines) from the Admin control panel. Activated plugins show up here automatically.
        </p>
      </div>

      {/* Upgrade Modal overlay */}
      <Modal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Upgrade to Pro SaaS"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <Sparkles size={18} />
            <span className="text-xs font-bold font-display uppercase tracking-wider">Expand your trade toolkit</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed font-sans">
            Unlocked features include: watermark-free PDF job reports, smart local review auto-responders, dynamic AI reel hook generators, unlimited marketing generations, and 10MB memory uploads.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="/dashboard/billing" className="w-full">
              <Button variant="accent" className="w-full py-3.5 font-bold shadow-md shadow-emerald-500/10">
                Upgrade for $29/Month
              </Button>
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}
