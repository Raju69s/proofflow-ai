import React from 'react';
import { ArrowRight, Image as ImageIcon, Sparkles, Check, Zap } from 'lucide-react';
import Link from 'next/link';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import MarketingNavbar from '../components/ui/MarketingNavbar';
import MarketingFooter from '../components/ui/MarketingFooter';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between overflow-x-hidden">
      <MarketingNavbar />
      
      <main className="flex-grow pt-24">
        {/* 1. Hero Section */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-6 animate-pulse">
              <Sparkles size={12} /> Transform Daily Work Into SEO Gold
            </div>
            
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[1.1] mb-6">
              Turn Every Job Into <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">Proof, Trust & Marketing.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-sans">
              Designed for trades & local service businesses. Upload before-and-after photos, describe your job in seconds, and let AI instantly compile professional PDF reports & location-based SEO social posts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto py-3.5 px-8 text-base font-bold bg-purple-600 hover:bg-purple-500 gap-2 font-display shadow-lg shadow-purple-600/10">
                  Start Growing Free <ArrowRight size={18} />
                </Button>
              </Link>
              <a href="#demo" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto py-3.5 px-8 text-base font-medium border-white/10 hover:bg-white/5">
                  Try Interactive Demo
                </Button>
              </a>
            </div>
            
            {/* Trust badges */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-display">
              <span>PLUMBERS</span>
              <span>MOVERS</span>
              <span>ELECTRICIANS</span>
              <span>PAINTERS</span>
              <span>ROOFERS</span>
              <span>CLEANERS</span>
            </div>
          </div>
        </section>

        {/* 2. Visual Features Grid */}
        <section id="features" className="py-20 bg-slate-900/20 border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mb-4">
                AI Tools Built for Busy Business Owners
              </h2>
              <p className="text-slate-400 font-sans text-sm sm:text-base">
                No technical expertise required. Designed to work beautifully on mobile phones directly in the field.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <Card variant="glass" className="p-6">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                  <ImageIcon size={22} />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">AI Before & After Reports</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-sans">
                  Instantly generate professional PDF proof sheets. Includes technician summaries, material tags, and customer trust warranties automatically.
                </p>
              </Card>

              {/* Feature 2 */}
              <Card variant="glass" className="p-6">
                <div className="h-12 w-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-6">
                  <Sparkles size={22} />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">SEO Social Post Generator</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-sans">
                  Generate highly optimized updates for Google Business Profile, Facebook, and Instagram, target-configured with service keywords and local neighborhoods.
                </p>
              </Card>

              {/* Feature 3 */}
              <Card variant="glass" className="p-6">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                  <Zap size={22} />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">Business Memory KB</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-sans">
                  Upload business guides or brochures. The AI learns your branding style, warranty guidelines, and custom parameters to keep all generation 100% accurate.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* 3. Interactive Teaser Demo */}
        <section id="demo" className="py-20 relative">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <Badge variant="success" className="mb-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Live Interactive Teaser</Badge>
              <h2 className="font-display font-bold text-3xl text-white tracking-tight mb-4">
                See the Flow in Action
              </h2>
              <p className="text-slate-400 text-sm font-sans">
                Answer one setup parameter to immediately see how ProofFlow AI structures trade marketing.
              </p>
            </div>

            <Card variant="glass" className="p-8 border border-white/10 shadow-2xl relative">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-display">
                    Select Your Trade Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
                    {['Plumber', 'Electrician', 'Mover', 'Painter'].map((trade) => (
                      <button 
                        key={trade}
                        className="px-4 py-3 rounded-lg text-sm font-medium border border-white/5 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-center focus:outline-none focus:border-purple-500"
                      >
                        {trade}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-display">
                    Enter Job Location (City/Neighborhood)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. downtown Amsterdam, Utrecht East" 
                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 font-sans"
                  />
                </div>

                <div className="pt-2">
                  <Link href="/register">
                    <Button variant="accent" className="w-full py-3.5 font-bold gap-2 bg-purple-600 hover:bg-purple-500 font-display">
                      Create My First Report <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 4. Pricing Matrix */}
        <section id="pricing" className="py-20 bg-slate-900/20 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mb-4">
                Simple, Predictable Pricing
              </h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto font-sans">
                Start building trust for free. Upgrade to Pro to remove report watermarks and unlock advanced AI copywriting tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free plan */}
              <Card variant="glass" className="p-8 border border-white/5 flex flex-col justify-between h-full relative">
                <div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">Free Plan</h3>
                  <p className="text-slate-400 text-xs mb-6 font-sans">Experience ProofFlow and start sharing jobs.</p>
                  <div className="flex items-baseline text-white gap-1 mb-8">
                    <span className="text-4xl font-extrabold font-display">$0</span>
                    <span className="text-slate-500 text-sm font-sans">/month</span>
                  </div>

                  <ul className="space-y-4 mb-8 font-sans">
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
                
                <Link href="/register">
                  <Button variant="outline" className="w-full py-3 font-semibold border-white/10 hover:bg-white/5">
                    Get Started Free
                  </Button>
                </Link>
              </Card>

              {/* Pro plan */}
              <Card variant="glass" className="p-8 border-2 border-purple-500/30 flex flex-col justify-between h-full relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 bg-purple-600 text-white font-bold font-display text-[9px] tracking-wider uppercase px-3 py-1.5 rounded-bl-lg">
                  Most Popular
                </div>

                <div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">Pro SaaS</h3>
                  <p className="text-slate-400 text-xs mb-6 font-sans">Complete local marketing machine for trades.</p>
                  <div className="flex items-baseline text-white gap-1 mb-8">
                    <span className="text-4xl font-extrabold font-display bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">$29</span>
                    <span className="text-slate-500 text-sm font-sans">/month</span>
                  </div>

                  <ul className="space-y-4 mb-8 font-sans">
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

                <Link href="/register">
                  <Button variant="accent" className="w-full py-3 font-bold bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/10 font-display">
                    Upgrade to Pro
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
