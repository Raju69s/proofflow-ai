"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, HelpCircle, ArrowRight, ShieldCheck, Sparkles, Zap, Heart } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import MarketingNavbar from '../../components/ui/MarketingNavbar';
import MarketingFooter from '../../components/ui/MarketingFooter';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'yearly'

  const plans = [
    {
      name: 'Free Plan',
      description: 'Ideal for getting started and experiencing the core workflow.',
      price: 0,
      period: 'forever',
      features: [
        '5 AI Generations per month',
        'Before & After PDF (Watermarked)',
        '1MB Knowledge Base upload limit',
        'Google Business Profile integration',
        'Basic local neighborhood targeting',
        'Community forum support'
      ],
      cta: 'Start Free Access',
      href: '/register',
      variant: 'outline',
      highlight: false
    },
    {
      name: 'Pro Plan',
      description: 'A complete AI local marketing & proof engine for growing trades.',
      price: billingPeriod === 'monthly' ? 29 : 24,
      period: billingPeriod === 'monthly' ? 'month' : 'month, billed annually',
      features: [
        'Unlimited AI Generations',
        'Before & After PDF (Clean, No Watermark)',
        '10MB Knowledge Base upload limit',
        'Instagram, Facebook & TikTok copy support',
        'Advanced location-scoped SEO keywords',
        'Custom brand styling & layout options',
        'Priority AI text & image analysis queuing',
        'Premium email & live chat support'
      ],
      cta: 'Upgrade to Pro System',
      href: '/register',
      variant: 'accent',
      highlight: true
    }
  ];

  const faqs = [
    {
      q: 'Will my PDF reports remain watermarked on the Pro Plan?',
      a: 'Absolutely not. Upgrading to the Pro Plan immediately removes the ProofFlow brand watermark from all generated before-and-after reports, allowing you to showcase your logo exclusively.'
    },
    {
      q: 'How does local SEO keyword targeting work?',
      a: 'When describing your job, the AI matches your service location with micro-neighborhoods and maps target keywords (e.g. "emergency pipe repair", "kitchen repiping") to structure posts that rank higher on local Google maps.'
    },
    {
      q: 'Can I cancel or change my plan at any time?',
      a: 'Yes. ProofFlow AI operates with zero contract lock-ins. You can upgrade, downgrade, or cancel your plan at any time directly through your dashboard settings.'
    },
    {
      q: 'What is the Business Memory Knowledge Base?',
      a: 'The Knowledge Base allows you to upload brochures, service guides, or warranty sheets. The AI scans this context to write highly accurate posts matching your company policies, tone, and brand.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between overflow-x-hidden">
      <MarketingNavbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Header */}
        <section className="text-center max-w-3xl mx-auto px-6 mb-12 animate-slide-up">
          <Badge variant="pro" className="mb-4 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1">
            Predictable Pricing
          </Badge>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-tight mb-4">
            Plans Built for Tradesmen <br />& Local Service Providers
          </h1>
          <p className="text-slate-400 font-sans text-sm sm:text-base max-w-xl mx-auto">
            Choose the perfect tier to start building client trust, compiling location-optimized proof, and ranking in local community searches.
          </p>

          {/* Billing Switch */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6.5 rounded-full bg-slate-900 border border-white/10 relative p-1 transition-all"
            >
              <div className={`w-4 h-4 rounded-full bg-purple-500 absolute top-1 transition-all ${billingPeriod === 'yearly' ? 'right-1' : 'left-1'}`} />
            </button>
            <span className={`text-xs font-semibold ${billingPeriod === 'yearly' ? 'text-white' : 'text-slate-500'} flex items-center gap-1.5`}>
              Yearly <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded-md uppercase">Save 15%</span>
            </span>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              variant="glass" 
              className={`p-8 flex flex-col justify-between h-full relative ${
                plan.highlight 
                  ? 'border-2 border-purple-500/35 shadow-2xl shadow-purple-500/[0.03]' 
                  : 'border border-white/5'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-purple-600 text-white font-bold font-display text-[9px] tracking-wider uppercase px-3 py-1.5 rounded-bl-lg">
                  Grow Fast
                </div>
              )}

              <div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-xs mb-6 font-sans leading-relaxed">{plan.description}</p>
                <div className="flex items-baseline text-white gap-1 mb-8">
                  <span className="text-5xl font-extrabold font-display">${plan.price}</span>
                  <span className="text-slate-500 text-xs font-sans">/{plan.period}</span>
                </div>

                <div className="border-t border-white/5 pt-6 mb-8">
                  <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4 font-display">What's Included:</h4>
                  <ul className="space-y-4 font-sans text-xs">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-slate-300">
                        <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link href={plan.href} className="mt-auto block">
                <Button 
                  variant={plan.variant} 
                  className={`w-full py-3.5 font-bold font-display ${
                    plan.highlight 
                      ? 'bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/10' 
                      : 'border-white/10 hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </section>

        {/* Feature Comparison Matrix Table */}
        <section className="max-w-4xl mx-auto px-6 mb-24">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-2xl text-white tracking-tight">Full System Comparison</h2>
            <p className="text-slate-400 text-xs mt-1">Review granular technical parameters for deep workflows.</p>
          </div>
          <Card variant="glass" className="overflow-hidden">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/40 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  <th className="p-4 sm:p-5">Capability</th>
                  <th className="p-4 sm:p-5 text-center">Free</th>
                  <th className="p-4 sm:p-5 text-center">Pro SaaS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Monthly AI Limit</td>
                  <td className="p-4 sm:p-5 text-center text-slate-400">5 Jobs</td>
                  <td className="p-4 sm:p-5 text-center text-purple-400 font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">PDF Report Branding</td>
                  <td className="p-4 sm:p-5 text-center text-slate-400">ProofFlow Branded</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-400 font-semibold">100% White-labeled</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Knowledge Base Limit</td>
                  <td className="p-4 sm:p-5 text-center text-slate-400">1 MB</td>
                  <td className="p-4 sm:p-5 text-center text-white">10 MB</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Multimodal Vision Upload</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-500">✔ Included</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-500">✔ Included</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Neighborhood SEO Matrix</td>
                  <td className="p-4 sm:p-5 text-center text-slate-500">❌ Not Included</td>
                  <td className="p-4 sm:p-5 text-center text-emerald-500">✔ Included</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </section>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-2xl text-white tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="text-purple-400" size={22} /> Pricing FAQs
            </h2>
            <p className="text-slate-400 text-xs mt-1">Have any questions about billing or limits? Find answers below.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <Card key={faq.q} variant="glass" className="p-5 border border-white/5 hover:border-purple-500/10 transition-colors">
                <h4 className="font-display font-bold text-sm text-white mb-2">{faq.q}</h4>
                <p className="text-slate-400 text-xs leading-relaxed font-sans">{faq.a}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
