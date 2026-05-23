"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  CreditCard, 
  Cpu, 
  HardDrive, 
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileText,
  Activity
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { createClient } from '../../lib/supabase/client';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentGenerations, setRecentGenerations] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        // Let's load some mock/live metrics to present a highly premium UI
        // In production, these would be fetched from Supabase tables
        setRecentUsers([
          { id: '1', email: 'johan.plumbing@gmail.com', name: 'Johan DeVries', trade: 'Plumber', plan: 'pro', status: 'active', joined: '2 hours ago' },
          { id: '2', email: 'service@brabant-electric.nl', name: 'Mark Janssen', trade: 'Electrician', plan: 'pro', status: 'active', joined: '5 hours ago' },
          { id: '3', email: 'info@roofclean-amsterdam.nl', name: 'Sven Bakker', trade: 'Roofer', plan: 'free', status: 'active', joined: '1 day ago' },
          { id: '4', email: 'rotterdam.movers@outlook.com', name: 'Piet de Jong', trade: 'Mover', plan: 'free', status: 'pending', joined: '2 days ago' },
        ]);

        setRecentGenerations([
          { id: 'g1', user: 'Johan DeVries', type: 'Before/After Report', tokens: '1,450', status: 'success', time: '10 mins ago' },
          { id: 'g2', user: 'Mark Janssen', type: 'Instagram Post script', tokens: '680', status: 'success', time: '34 mins ago' },
          { id: 'g3', user: 'Sven Bakker', type: 'SEO GMB Post', tokens: '920', status: 'success', time: '1 hour ago' },
          { id: 'g4', user: 'Johan DeVries', type: 'Knowledge Base PDF sync', tokens: '3,200', status: 'success', time: '3 hours ago' },
        ]);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-4 animate-pulse">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500 border-r-2 border-purple-500/20"></div>
        <p className="text-slate-400 text-[10px] tracking-widest uppercase font-semibold">Synchronizing secure admin metrics panel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-purple-400" size={26} />
            System Control Center
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-sans">
            Real-time analytics, user distribution, billing operations, and system health controls.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="pro" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs py-1 px-3">
            System Online
          </Badge>
          <Badge variant="info" className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs py-1 px-3">
            v1.2.0-beta
          </Badge>
        </div>
      </div>

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

      {/* Main Grid: Lists & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Recent Registered Tradesmen */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="glass">
            <CardHeader className="flex items-center justify-between bg-purple-950/10 border-b border-purple-500/10">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-purple-400" />
                <h3 className="font-display font-bold text-white text-base">Recent Registered Tradesmen</h3>
              </div>
              <Link href="/admin/users" className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-slate-400 bg-slate-900/40">
                      <th className="py-3 px-5 font-semibold">User</th>
                      <th className="py-3 px-5 font-semibold">Trade Specialty</th>
                      <th className="py-3 px-5 font-semibold">Plan Status</th>
                      <th className="py-3 px-5 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-semibold text-white">{user.name}</div>
                          <div className="text-[10px] text-slate-500 font-sans">{user.email}</div>
                        </td>
                        <td className="py-4 px-5 font-sans">
                          <Badge variant="info" className="text-[10px]">{user.trade}</Badge>
                        </td>
                        <td className="py-4 px-5 font-sans">
                          <Badge 
                            variant={user.plan === 'pro' ? 'pro' : 'secondary'} 
                            className="text-[10px] uppercase font-bold"
                          >
                            {user.plan}
                          </Badge>
                        </td>
                        <td className="py-4 px-5 font-sans text-slate-400 text-[11px]">{user.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Side: AI Generation Logs & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="glass">
            <CardHeader className="flex items-center justify-between bg-purple-950/10 border-b border-purple-500/10">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-purple-400" />
                <h3 className="font-display font-bold text-white text-base">AI Engine Activity Logs</h3>
              </div>
              <Badge variant="pro" className="text-[9px]">Live Logs</Badge>
            </CardHeader>
            <CardBody className="p-4 space-y-4">
              <div className="space-y-3">
                {recentGenerations.map((gen) => (
                  <div key={gen.id} className="p-3 rounded-lg bg-slate-900/60 border border-white/5 flex items-center justify-between gap-4 hover:border-purple-500/10 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{gen.user}</span>
                        <span className="text-[9px] text-slate-500 font-sans">{gen.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">{gen.type}</p>
                    </div>
                    <div className="text-right font-sans shrink-0">
                      <span className="text-xs font-bold text-purple-400 block">{gen.tokens} tkn</span>
                      <span className="text-[9px] text-emerald-500 font-semibold">Success</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/admin/ai-usage" className="block">
                <Button variant="outline" className="w-full text-xs py-2 bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                  Analyze AI Engine Metrics <ArrowRight size={12} className="ml-1" />
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Quick Shortcuts */}
          <Card variant="glass" className="p-5">
            <h3 className="font-display font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Zap className="text-purple-400" size={16} />
              Quick Administrative Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/modules" className="p-3 rounded-xl bg-purple-950/20 hover:bg-purple-950/30 border border-purple-500/10 hover:border-purple-500/25 transition-all text-center flex flex-col items-center justify-center gap-1.5 group">
                <Cpu size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-white tracking-wide">Configure Plugins</span>
              </Link>
              <Link href="/admin/users" className="p-3 rounded-xl bg-indigo-950/20 hover:bg-indigo-950/30 border border-indigo-500/10 hover:border-indigo-500/25 transition-all text-center flex flex-col items-center justify-center gap-1.5 group">
                <Users size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-white tracking-wide">User Management</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
