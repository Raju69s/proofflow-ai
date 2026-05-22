import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Menu } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function MarketingLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium glass header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-primary to-emerald-500 rounded-lg text-white">
              <ShieldCheck size={20} className="animate-pulse-slow" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              ProofFlow<span className="text-emerald-400">.ai</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
            <a href="#demo" className="hover:text-emerald-400 transition-colors">Interactive Demo</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors">
              Login
            </a>
            <a href="/register">
              <Button variant="accent" size="sm" className="hidden sm:inline-flex gap-1.5 font-semibold">
                Get Started <ArrowRight size={14} />
              </Button>
            </a>
            <button className="md:hidden p-2 hover:bg-white/5 rounded-lg text-slate-300">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Branded footer */}
      <footer className="border-t border-white/5 bg-black/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-white">
              ProofFlow<span className="text-emerald-400">.ai</span>
            </span>
            <span className="text-xs text-slate-500">© 2026 ProofFlow.nl. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
