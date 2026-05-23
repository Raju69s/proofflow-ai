"use client";

import React, { useState, useEffect } from 'react';
import { 
  Building, 
  MapPin, 
  Tag, 
  Heart, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Toast } from '../../../components/ui/Toast';
import { createClient } from '../../../lib/supabase/client';

export default function SeoSetupPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState({
    // Category 1: Business Basics (6)
    companyName: "",
    ownerName: "",
    websiteUrl: "",
    phone: "",
    email: "",
    slogan: "",

    // Category 2: Services & Expertise (4)
    services: "",
    specialization: "",
    tradeCategory: "",
    tradeType: "",

    // Category 3: Locations (3)
    primaryLocation: "",
    targetLocations: "",
    expansionTerritory: "",

    // Category 4: Keywords (3)
    targetKeywords: "",
    secondaryKeywords: "",
    hashtagPresets: "",

    // Category 5: Branding Tone (3)
    brandingStyle: "",
    tone: "",
    customerValues: "",

    // Category 6: Trust & CTAs (4)
    signatureGuarantee: "",
    warrantyDuration: "",
    ctaText: "",
    contactLink: "",

    // Category 7: Social links (2)
    facebookUrl: "",
    gbpUrl: ""
  });

  const [toastMessage, setToastMessage] = useState(null);
  const supabase = createClient();

  // Load answers from Supabase DB on mount
  useEffect(() => {
    async function loadSeoAnswers() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('seo_settings')
          .select('answers')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data?.answers) {
          setAnswers(prev => ({ ...prev, ...data.answers }));
        } else {
          // Check localStorage as fallback/migration cache
          const localSaved = localStorage.getItem('proofflow_seo_answers');
          if (localSaved) {
            setAnswers(prev => ({ ...prev, ...JSON.parse(localSaved) }));
          }
        }
      } catch (err) {
        console.error("Failed to load database SEO settings:", err);
        setToastMessage({ message: "Unable to sync with database. Showing local offline data.", type: "warning" });
      } finally {
        setLoading(false);
      }
    }

    loadSeoAnswers();
  }, []);

  const handleInputChange = (key, val) => {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);
    localStorage.setItem('proofflow_seo_answers', JSON.stringify(updated));
  };

  const saveToDatabase = async (updatedAnswers) => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setToastMessage({ message: "Authentication required to save.", type: "error" });
        return false;
      }

      const { error } = await supabase
        .from('seo_settings')
        .upsert({
          user_id: user.id,
          answers: updatedAnswers,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      // Update core user profile fields (Company Name)
      await supabase
        .from('profiles')
        .update({
          company_name: updatedAnswers.companyName,
          phone: updatedAnswers.phone,
          website: updatedAnswers.websiteUrl,
          owner_name: updatedAnswers.ownerName
        })
        .eq('id', user.id);

      return true;
    } catch (err) {
      console.error("Error saving SEO profile:", err);
      setToastMessage({ message: "Failed to persist changes to server. Saved offline.", type: "error" });
      return false;
    } finally {
      setSaving(false);
    }
  };


  // 25 Questions segmented into 5 logical categories for non-technical users
  const steps = [
    {
      title: "Business Basics",
      icon: <Building size={16} />,
      questions: [
        { label: "Business/Brand Name", key: "companyName", placeholder: "e.g. John's Emergency Plumbing", type: "text" },
        { label: "Owner/Contact Name", key: "ownerName", placeholder: "e.g. John Brown", type: "text" },
        { label: "Website URL", key: "websiteUrl", placeholder: "e.g. https://johnsplumbing.nl", type: "url" },
        { label: "Company Phone Number", key: "phone", placeholder: "e.g. +31 6 12345678", type: "text" },
        { label: "Business Email", key: "email", placeholder: "e.g. info@johnsplumbing.nl", type: "email" },
        { label: "Main Slogan", key: "slogan", placeholder: "e.g. Turn Every Job Into Proof", type: "text" }
      ]
    },
    {
      title: "Trade & Services",
      icon: <Sparkles size={16} />,
      questions: [
        { label: "Core Services list (Comma separated)", key: "services", placeholder: "e.g. pipe leaks, boiler installs, radiator checks", type: "textarea" },
        { label: "Primary Specialized Area", key: "specialization", placeholder: "e.g. emergency water leak repairs", type: "text" },
        { label: "Trade Sub-Category", key: "tradeCategory", placeholder: "e.g. Residential & Light Commercial Plumber", type: "text" },
        { label: "Trade Type", key: "tradeType", placeholder: "Plumber, Mover, HVAC, Electrician, Cleaner, etc.", type: "text" }
      ]
    },
    {
      title: "Service Areas & Keywords",
      icon: <MapPin size={16} />,
      questions: [
        { label: "Primary Service Area (City/Neighborhood)", key: "primaryLocation", placeholder: "e.g. Amsterdam Zuid", type: "text" },
        { label: "Target Surrounding Neighborhoods", key: "targetLocations", placeholder: "e.g. Amstelveen, Amsterdam West, De Pijp", type: "textarea" },
        { label: "Future Expansion Territory", key: "expansionTerritory", placeholder: "e.g. Utrecht East", type: "text" },
        { label: "Primary SEO Keywords (separated by commas)", key: "targetKeywords", placeholder: "e.g. plumber amsterdam, cheap emergency pipe replacement", type: "textarea" },
        { label: "Secondary Keywords", key: "secondaryKeywords", placeholder: "e.g. amsterdam plumber near me, local boiler fixer", type: "textarea" },
        { label: "Predefined Social Hashtags", key: "hashtagPresets", placeholder: "e.g. tradequality, localplumbing, amsterdamzuid", type: "text" }
      ]
    },
    {
      title: "Branding Style",
      icon: <Heart size={16} />,
      questions: [
        { label: "Branding Persona Style", key: "brandingStyle", placeholder: "e.g. Friendly Local Neighbor, High-End Commercial Expert", type: "text" },
        { label: "Desired Communication Tone", key: "tone", placeholder: "e.g. professional, trustworthy, and neighborly", type: "text" },
        { label: "Core Values for Customers", key: "customerValues", placeholder: "e.g. fast arrival, SPOTLESS cleanup, upfront rates", type: "textarea" }
      ]
    },
    {
      title: "Trust & CTAs",
      icon: <ShieldCheck size={16} />,
      questions: [
        { label: "Signature Company Guarantee Title", key: "signatureGuarantee", placeholder: "e.g. 100% Spotless-Cleanup Guarantee", type: "text" },
        { label: "Standard Warranty Period details", key: "warrantyDuration", placeholder: "e.g. 12-month parts and labor guarantee", type: "text" },
        { label: "Standard Call-To-Action (CTA) text", key: "ctaText", placeholder: "e.g. Leak backing up? Contact John brown directly for 30-min arrival!", type: "textarea" },
        { label: "Contact Booking Link", key: "contactLink", placeholder: "e.g. https://johnsplumbing.nl/book", type: "url" },
        { label: "Facebook Page URL", key: "facebookUrl", placeholder: "e.g. https://facebook.com/johnsplumbing", type: "url" },
        { label: "Google Business Profile Link", key: "gbpUrl", placeholder: "e.g. https://g.co/johnsplumbing", type: "url" }
      ]
    }
  ];

  // Calculate overall answers filled percentage
  const totalKeys = Object.keys(answers).length;
  const filledKeys = Object.values(answers).filter(val => val && val.trim() !== "").length;
  const progressPercent = Math.round((filledKeys / totalKeys) * 100);

  const handleNext = async () => {
    const isSaved = await saveToDatabase(answers);
    if (!isSaved) return;

    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      setToastMessage({ message: "Section answers saved to database!", type: "success" });
    } else {
      setToastMessage({ message: "SEO Setup profile 100% complete and synchronized with database!", type: "success" });
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 border-r-2 border-emerald-500/20"></div>
        <p className="text-slate-400 text-[10px] tracking-widest uppercase font-semibold">Synchronizing with Secure Supabase Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl mx-auto">

      {/* 1. Header progress status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
            SEO Audit Setup Wizard
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Configure your 25 key business points. ProofFlow AI automatically injects these into reports & captions to boost local Google visibility.
          </p>
        </div>
        <Badge variant={progressPercent === 100 ? "success" : "warning"} className="self-start">
          {progressPercent}% Complete
        </Badge>
      </div>

      {/* Progress Bar indicator */}
      <div className="w-full h-2 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 2. Step Navigator tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {steps.map((st, i) => (
          <button
            key={st.title}
            onClick={() => setActiveStep(i)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider shrink-0 transition-all border
              ${activeStep === i 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-md shadow-emerald-500/5' 
                : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}
            `}
          >
            {st.icon}
            <span>{st.title}</span>
          </button>
        ))}
      </div>

      {/* 3. Main Form card */}
      <Card variant="glass" className="border border-white/10 shadow-2xl">
        <CardHeader className="bg-emerald-950/10 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-display font-bold text-white text-base">
            {steps[activeStep].title} Configuration
          </h3>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
            Step {activeStep + 1} of {steps.length}
          </span>
        </CardHeader>

        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps[activeStep].questions.map((q) => (
              <div key={q.key} className={q.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  {q.label}
                  <span className="text-red-500/70">*</span>
                </label>

                {q.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={answers[q.key]}
                    placeholder={q.placeholder}
                    onChange={(e) => handleInputChange(q.key, e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700"
                  />
                ) : (
                  <input
                    type={q.type}
                    value={answers[q.key]}
                    placeholder={q.placeholder}
                    onChange={(e) => handleInputChange(q.key, e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700"
                  />
                )}
              </div>
            ))}
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between bg-black/20">
          <Button 
            variant="outline" 
            onClick={handlePrev}
            disabled={activeStep === 0}
            className="gap-1.5"
          >
            <ArrowLeft size={16} /> Back
          </Button>

          <Button 
            variant="accent" 
            onClick={handleNext}
            className="gap-1.5 font-bold"
          >
            {activeStep === steps.length - 1 ? "Complete Setup" : "Next Section"} <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>

      {/* Quick notice block */}
      <div className="p-4 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 flex items-start gap-3">
        <HelpCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          <strong>Auto-Save is active:</strong> All configuration points are cached in real time. Completed items will automatically format technician proof reports and social posts in later tools.
        </p>
      </div>

      {/* Render custom toasts */}
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
