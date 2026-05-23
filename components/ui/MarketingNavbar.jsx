"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './Button';

export default function MarketingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <nav className="max-w-6xl mx-auto glass-premium border border-white/5 rounded-2xl h-16 flex items-center justify-between px-6 bg-slate-950/40 backdrop-blur-md shadow-lg shadow-black/20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg text-white">
            <ShieldCheck size={18} />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            ProofFlow<span className="text-purple-400">.ai</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive ? 'text-purple-400 font-semibold' : 'text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" className="text-xs font-semibold py-2 px-4 bg-transparent border-white/10 hover:bg-white/5 hover:text-white">
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" className="text-xs font-bold py-2 px-4 bg-purple-600 hover:bg-purple-500 gap-1">
              Start Free <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 z-40 p-5 glass-premium border border-white/5 rounded-2xl bg-slate-950/95 backdrop-blur-xl shadow-2xl flex flex-col gap-4 md:hidden animate-slide-up">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium py-2 border-b border-white/5 transition-colors hover:text-white ${
                    isActive ? 'text-purple-400 font-semibold pl-2 border-l-2 border-purple-500' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="outline" className="w-full py-2.5 bg-slate-900 border-white/10 text-slate-300">
                Log In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="primary" className="w-full py-2.5 bg-purple-600 text-white font-semibold">
                Start Free Platform Access
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
