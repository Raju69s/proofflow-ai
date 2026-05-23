"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Target, Award, Users, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import MarketingNavbar from '../../components/ui/MarketingNavbar';
import MarketingFooter from '../../components/ui/MarketingFooter';

export default function AboutPage() {
  const pillars = [
    {
      icon: Target,
      title: 'Our Mission',
      desc: 'To empower local service tradesmen by translating their physical field execution into highly polished, digital marketing success without adding manual admin labor.',
      color: 'text-purple-400'
    },
    {
      icon: Award,
      title: 'Building Unbreakable Trust',
      desc: 'We believe proof of work is the ultimate marketing engine. By compiling instant before/after certificates, we help plumbers, roofers, and builders validate their quality instantly.',
      color: 'text-pink-400'
    },
    {
      icon: Users,
      title: 'Built for Hardworking Owners',
      desc: 'Local owners do not have hours to write blog posts or edit PDFs. ProofFlow is designed as a mobile-first, one-click experience that fits perfectly in a pocket.',
      color: 'text-indigo-400'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between overflow-x-hidden">
      <MarketingNavbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Header */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-16 animate-slide-up">
          <Badge variant="pro" className="mb-4 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1">
            Our Vision
          </Badge>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-tight mb-6">
            Making Local Trade Excellence <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">Visible & Verifiable</span>
          </h1>
          <p className="text-slate-300 font-sans text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            ProofFlow AI was born from a simple realization: local tradesmen do incredible, highly specialized work every day, but rarely have the time or tools to leverage that work into digital marketing and Google SEO visibility.
          </p>
        </section>

        {/* Vision Pillars Grid */}
        <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <Card key={idx} variant="glass" className="p-6 flex flex-col items-center text-center">
                <div className={`p-3 rounded-2xl bg-white/[0.02] border border-white/5 ${p.color} mb-6`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-3">{p.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-sans">{p.desc}</p>
              </Card>
            );
          })}
        </section>

        {/* Why ProofFlow AI - Two Column Feature Section */}
        <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          {/* Text content */}
          <div className="space-y-6">
            <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">The ProofFlow Difference</Badge>
            <h2 className="font-display font-bold text-3xl text-white tracking-tight">
              Bridging the Gap Between Manual Craft & Digital Rankings
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              Traditional marketing tools expect you to sit at a desk for hours typing blogs or building complex social post pipelines. ProofFlow AI completely flips the script.
            </p>

            <ul className="space-y-3.5 text-xs text-slate-300 font-sans">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                <span>One-click mobile-responsive image uploads</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                <span>Gemini-powered instant neighborhood SEO mapping</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                <span>Branded, compliance-safe customer trust warranties</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link href="/register">
                <Button variant="primary" className="py-3 px-6 text-xs font-bold bg-purple-600 hover:bg-purple-500 flex items-center gap-2 font-display">
                  Get Started Free Today <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-500 opacity-20 blur-xl" />
            <Card variant="glass" className="p-8 relative border border-white/10 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg text-white">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">ProofFlow.nl</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold font-sans">AI Trade Marketing System</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-3 font-sans text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-slate-400">Total PDF Reports Created</span>
                  <span className="font-bold text-white">10,248</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-slate-400">Target SEO Neighborhoods mapped</span>
                  <span className="font-bold text-purple-400">4,820</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Registered Local Trade Specialists</span>
                  <span className="font-bold text-emerald-400">1,248</span>
                </div>
              </div>

              <p className="text-slate-400 text-xs italic font-sans">
                "Our vision is simple: Let tradesmen focus entirely on doing elite work, while our system handles compiling proof, ranking pages, and winning brand loyalty."
              </p>
            </Card>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
