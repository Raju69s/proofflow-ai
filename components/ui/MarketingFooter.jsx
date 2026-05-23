"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Heart } from 'lucide-react';

export default function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-white/5 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Branding Info */}
        <div className="space-y-4 md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg text-white">
              <ShieldCheck size={18} />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              ProofFlow<span className="text-purple-400">.ai</span>
            </span>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-sans">
            AI-powered local marketing and client trust warranty generator. Helping plumbers, electricians, cleaners, roofers, and local trades grow their Google ranking and business reputation.
          </p>
          <div className="text-[10px] uppercase font-semibold tracking-widest text-slate-500 font-sans">
            Targeting: NL & EU Service Businesses
          </div>
        </div>

        {/* Sitemap Links */}
        <div>
          <h4 className="text-slate-200 font-display font-bold text-xs uppercase tracking-widest mb-4">Navigation</h4>
          <ul className="space-y-2.5 text-xs text-slate-400 font-sans">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing Plans</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Our Vision</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Portal Shortcuts */}
        <div>
          <h4 className="text-slate-200 font-display font-bold text-xs uppercase tracking-widest mb-4">Gateways</h4>
          <ul className="space-y-2.5 text-xs text-slate-400 font-sans">
            <li><Link href="/login" className="hover:text-white transition-colors flex items-center gap-1">Log In <ArrowRight size={10} /></Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors flex items-center gap-1">Register Free <ArrowRight size={10} /></Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard Portal</Link></li>
            <li><Link href="/admin" className="hover:text-white transition-colors text-purple-400 hover:text-purple-300 font-medium">Admin Gateway</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500 font-sans">
        <p>&copy; {currentYear} ProofFlow.nl. All rights reserved. Registered trademark of ProofFlow AI.</p>
        <p className="flex items-center justify-center gap-1">
          Crafted with <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" /> for local service providers.
        </p>
      </div>
    </footer>
  );
}
