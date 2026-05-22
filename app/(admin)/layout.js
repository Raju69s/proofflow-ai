"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  FolderLock, 
  Cpu, 
  HardDrive, 
  Menu, 
  X, 
  ArrowLeft,
  Settings2,
  TrendingUp
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 glass-premium border-r border-white/5 flex flex-col justify-between
        transition-transform duration-300 md:translate-x-0 md:static md:h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col flex-grow">
          {/* Admin Header logo */}
          <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-purple-950/20">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg text-white">
                <ShieldCheck size={18} />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                ProofFlow<span className="text-purple-400">.admin</span>
              </span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp size={18} />
              <span>Overview</span>
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <Users size={18} />
              <span>Users Directory</span>
            </Link>
            <Link href="/admin/payments" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <CreditCard size={18} />
              <span>Payments</span>
            </Link>
            <Link href="/admin/modules" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <FolderLock size={18} />
              <span>Modules & Plugins</span>
            </Link>
            <Link href="/admin/plans" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <Settings2 size={18} />
              <span>Plans & Access</span>
            </Link>
            <Link href="/admin/ai-usage" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <Cpu size={18} />
              <span>AI Engine Metrics</span>
            </Link>
            <Link href="/admin/storage" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <HardDrive size={18} />
              <span>Storage Metrics</span>
            </Link>
          </nav>
        </div>

        {/* Back Gateway Link */}
        <div className="p-4 border-t border-white/5 bg-black/40">
          <Link href="/dashboard" className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-800 transition-all uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to User Portal
          </Link>
        </div>
      </aside>

      {/* Main Admin Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header navbar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-950/40 backdrop-blur">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-white/5 rounded-lg text-slate-300"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <Badge variant="pro" className="bg-purple-600/20 text-purple-300 border border-purple-500/30">
              System Admin
            </Badge>
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
