"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Check, 
  Copy, 
  RefreshCw, 
  Mic, 
  Globe, 
  ShieldAlert, 
  Lock,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  FileText,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Toast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { createClient } from '../../../lib/supabase/client';
import { checkPlanLimits } from '../../../lib/utils/plan-guard';

export default function SocialPostsPage() {
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [generationsUsed, setGenerationsUsed] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState('Google Business Profile');
  const [contentLength, setContentLength] = useState('short'); // 'short' | 'medium' | 'long'
  const [injectKeywords, setInjectKeywords] = useState(true);
  const [workDescription, setWorkDescription] = useState('Replaced emergency burst pipe in a family bathroom in under 45 minutes with full water sweep.');
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [generatedPost, setGeneratedPost] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [seoSettings, setSeoSettings] = useState({});
  const supabase = createClient();

  useEffect(() => {
    async function loadSocialWorkspaceData() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch subscriptions & plan metadata
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('plan_type, monthly_generations_used')
          .eq('user_id', user.id)
          .maybeSingle();

        if (sub) {
          setCurrentPlan(sub.plan_type || 'free');
          setGenerationsUsed(sub.monthly_generations_used || 0);
        }

        // Fetch active SEO settings answers to display details
        const { data: seo } = await supabase
          .from('seo_settings')
          .select('answers')
          .eq('user_id', user.id)
          .maybeSingle();

        if (seo?.answers) {
          setSeoSettings(seo.answers);
        }
      } catch (err) {
        console.error("Failed to load database state for social-posts workspace:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSocialWorkspaceData();
  }, []);

  const handleLengthSelect = (len) => {
    // Check limits for Pro lengths using plan guard
    const limitCheck = checkPlanLimits(
      { plan_type: currentPlan, status: 'active' },
      'social_length',
      { length: len }
    );

    if (!limitCheck.allowed) {
      setToastMessage({ message: limitCheck.reason, type: 'error' });
      setUpgradeModalOpen(true);
      return;
    }

    setContentLength(len);
  };

  const handleGenerate = async () => {
    if (!workDescription.trim()) {
      setToastMessage({ message: "Please describe the job details to write content.", type: "warning" });
      return;
    }

    setIsGenerating(true);
    setGeneratedPost(null);
    
    try {
      const response = await fetch('/api/generate/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform: selectedPlatform,
          length: contentLength,
          workDescription
        })
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || "Failed to generate social post copy.");
      }

      setGeneratedPost(res.text);
      if (res.generationsUsed !== undefined) {
        setGenerationsUsed(res.generationsUsed);
      }
      
      setToastMessage({ message: "AI copy compiled and optimized!", type: "success" });

      // Trigger structural layout update to reload generations remaining metric instantly
      window.dispatchEvent(new Event('pf_state_sync'));
    } catch (err) {
      setToastMessage({ message: err.message, type: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPost) return;
    navigator.clipboard.writeText(generatedPost);
    setToastMessage({ message: "Social post copy copied to clipboard!", type: "success" });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setToastMessage({ message: "Listening... speak about your project details.", type: "info" });
      setTimeout(() => {
        setWorkDescription((prev) => prev + " Plumbed new brass compression fittings and pressurized copper pipelines.");
        setIsRecording(false);
        setToastMessage({ message: "Voice description transcribed successfully!", type: "success" });
      }, 3000);
    }
  };

  const platforms = [
    { name: 'Google Business Profile', color: 'bg-blue-600/10 text-blue-400 border-blue-500/20' },
    { name: 'Facebook', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { name: 'Instagram', color: 'bg-pink-600/10 text-pink-400 border-pink-500/20' },
    { name: 'LinkedIn', color: 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' },
    { name: 'X/Twitter', color: 'bg-slate-800 text-slate-300 border-white/5' },
    { name: 'Pinterest', color: 'bg-red-600/10 text-red-400 border-red-500/20' },
    { name: 'Nextdoor', color: 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 border-r-2 border-emerald-500/20"></div>
        <p className="text-slate-400 text-[10px] tracking-widest uppercase font-semibold">Synchronizing with Secure Supabase Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-5xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
            SEO Social Content Writer
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Turn work summaries and SEO answering wizard metrics into targeted platform posts with neighborhood tags.
          </p>
        </div>
        <Badge variant={currentPlan === 'pro' ? 'pro' : 'primary'}>
          {currentPlan === 'pro' ? 'Pro SaaS Unlocked' : 'Free Short Only'}
        </Badge>
      </div>

      {/* 2. Generation Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Settings side */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="glass" className="p-5 space-y-6">
            {/* Platform selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Select Platform Outlets
              </label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPlatform(p.name)}
                    className={`
                      px-3 py-2 rounded-lg text-xs font-medium border transition-all
                      ${selectedPlatform === p.name 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold' 
                        : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}
                    `}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Length selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                <span>Post Content Length</span>
                {currentPlan === 'free' && <span className="text-[10px] text-purple-400 font-bold">Pro levels unlocked</span>}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['short', 'medium', 'long'].map((len) => {
                  const isLocked = len !== 'short' && currentPlan === 'free';
                  return (
                    <button
                      key={len}
                      onClick={() => handleLengthSelect(len)}
                      className={`
                        px-4 py-2.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all
                        ${contentLength === len 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold' 
                          : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}
                        ${isLocked ? 'opacity-50' : ''}
                      `}
                    >
                      {isLocked && <Lock size={10} />}
                      <span className="capitalize">{len}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SEO Switch toggles */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Inject Target Local Keywords</span>
              <input 
                type="checkbox" 
                checked={injectKeywords}
                onChange={() => setInjectKeywords(!injectKeywords)}
                className="h-4 w-4 rounded border-white/5 bg-slate-950 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Audio Voice Input simulator */}
            <div className="border-t border-white/5 pt-4 space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Voice Note Transcriber
              </label>
              <Button 
                variant={isRecording ? "danger" : "outline"}
                onClick={toggleRecording}
                className="w-full gap-2 text-xs font-semibold"
              >
                <Mic size={14} className={isRecording ? "animate-pulse" : ""} />
                {isRecording ? "Recording... Click to Stop" : "Record Job Details in Field"}
              </Button>
            </div>

            {/* Description Textarea */}
            <div className="border-t border-white/5 pt-4">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Describe Work Accomplished
              </label>
              <textarea
                rows={3}
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                placeholder="Describe your job highlights..."
                className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all font-sans placeholder:text-slate-700"
              />
            </div>

            <Button 
              variant="accent" 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 font-bold gap-2 text-sm shadow-md shadow-emerald-500/10"
            >
              <Sparkles size={16} /> {isGenerating ? "AI Writing Posts..." : "Generate AI Copy"}
            </Button>
          </Card>
        </div>

        {/* Right Preview side */}
        <div className="lg:col-span-7 space-y-6">
          {/* Skeleton Loaders */}
          {isGenerating && (
            <Card variant="glass" className="p-6 space-y-4">
              <div className="h-4 bg-white/5 rounded w-1/3 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 bg-white/5 rounded animate-pulse" />
                <div className="h-3 bg-white/5 rounded w-5/6 animate-pulse" />
                <div className="h-3 bg-white/5 rounded w-4/5 animate-pulse" />
              </div>
            </Card>
          )}

          {/* Core Output card */}
          {generatedPost && (
            <Card variant="glass" className="border border-white/10 shadow-2xl relative">
              {/* Native App Preview frame header */}
              <div className="p-4 border-b border-white/5 bg-slate-950/40 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-emerald-400">
                  {selectedPlatform} Native Preview
                </span>
                <span className="font-sans">PF-AI Generator</span>
              </div>

              {/* Rendering native visual shell mockup */}
              <CardBody className="p-6 space-y-4 bg-black/20 font-sans">
                {/* Platform Profile wrapper */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    J
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">John's Emergency Plumbing</h4>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Globe size={10} /> 1 min ago • {selectedPlatform}
                    </p>
                  </div>
                </div>

                {/* AI Written Content */}
                <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed border-l-2 border-emerald-500/30 pl-4 py-1">
                  {generatedPost}
                </div>
              </CardBody>

              {/* Toolbar */}
              <CardFooter className="bg-slate-950/40 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-sans">Optimized with Amsterdam Zuid keywords</span>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleGenerate} className="gap-1.5">
                    <RefreshCw size={12} /> Regenerate
                  </Button>
                  <Button variant="accent" size="sm" onClick={handleCopy} className="gap-1.5 font-bold">
                    <Copy size={12} /> Copy Post
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* Empty state details */}
          {!generatedPost && !isGenerating && (
            <Card variant="glass" className="p-8 text-center border border-dashed border-white/10 bg-slate-950/10">
              <FileText size={32} className="text-slate-500 mx-auto mb-4" />
              <h4 className="text-sm font-semibold text-white mb-1">Generate Local SEO Updates</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-sm mx-auto">
                Select your platform, adjust the length options, and write a summary. ProofFlow AI will weave your keywords and files into professional copies.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Upgrade popup */}
      <Modal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Unlock Advanced AI Copy lengths"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <Sparkles size={18} />
            <span className="text-xs font-bold font-display uppercase tracking-wider">Unbind Copy limits</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed font-sans">
            Free accounts are restricted to Short generations only. Upgrading to Pro ($29/month) instantly unlocks Medium and Long platforms-specific copywriting configurations, in addition to watermark-free PDF exports.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="/dashboard/billing" className="w-full">
              <Button variant="accent" className="w-full py-3.5 font-bold shadow-md shadow-emerald-500/10">
                Unlock Pro Plan Access
              </Button>
            </a>
          </div>
        </div>
      </Modal>

      {/* Toast notifications */}
      {toastMessage && (
        <Toast 
          message={toastMessage.message} 
          type={toastMessage.type} 
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
