"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  PlusCircle, 
  Eye, 
  Compass,
  HardDrive,
  Download,
  Calendar,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Toast } from '../../components/ui/Toast';
import { createClient } from '../../lib/supabase/client';
import { jsPDF } from 'jspdf';

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("John's Emergency Plumbing");
  const [ownerName, setOwnerName] = useState("John Brown");
  const [seoProgress, setSeoProgress] = useState(0);
  const [seoAnsweredCount, setSeoAnsweredCount] = useState(0);
  
  const [kbCount, setKbCount] = useState(0);
  const [kbStorageMb, setKbStorageMb] = useState(0);
  
  const [generationsUsed, setGenerationsUsed] = useState(0);
  const [currentPlan, setCurrentPlan] = useState("free");
  
  const [recentReports, setRecentReports] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  
  const supabase = createClient();
  const maxGenerations = 5;

  // Load and calculate analytics metrics dynamically from PostgreSQL
  useEffect(() => {
    async function loadDashboardHomeMetrics() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Fetch User Profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          setCompanyName(profile.company_name || "My Trade Brand");
          setOwnerName(profile.owner_name || "Lead Technician");
        }

        // 2. Fetch SEO Wizard Answers & compute exact completion percentage
        const { data: seo } = await supabase
          .from('seo_settings')
          .select('answers')
          .eq('user_id', user.id)
          .maybeSingle();

        if (seo?.answers) {
          const answersObj = seo.answers;
          const totalKeys = 25; // Setup has exactly 25 config keys
          const filledKeys = Object.values(answersObj).filter(v => v && v.toString().trim() !== "").length;
          
          setSeoAnsweredCount(filledKeys);
          setSeoProgress(Math.round((filledKeys / totalKeys) * 100));
        } else {
          setSeoAnsweredCount(0);
          setSeoProgress(0);
        }

        // 3. Fetch Knowledge Base Document uploads
        const { data: kbFiles } = await supabase
          .from('knowledge_base')
          .select('file_size_bytes')
          .eq('user_id', user.id);

        if (kbFiles) {
          setKbCount(kbFiles.length);
          const totalBytes = kbFiles.reduce((acc, f) => acc + (f.file_size_bytes || 0), 0);
          setKbStorageMb(parseFloat((totalBytes / (1024 * 1024)).toFixed(2)));
        }

        // 4. Fetch subscription usage quota
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('plan_type, monthly_generations_used')
          .eq('user_id', user.id)
          .maybeSingle();

        if (sub) {
          setCurrentPlan(sub.plan_type || 'free');
          setGenerationsUsed(sub.monthly_generations_used || 0);
        }

        // 5. Query dynamic recent job reports logs
        const { data: reports } = await supabase
          .from('job_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        setRecentReports(reports || []);

      } catch (err) {
        console.error("Dashboard home load failure:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardHomeMetrics();
  }, []);

  /**
   * Fast client-side dynamic compiler allowing instant PDF retrieval directly from the dashboard home list!
   */
  const handleFastDownloadPdf = async (report) => {
    setToastMessage({ message: "Compiling branded PDF components...", type: "success" });
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const primaryColor = [16, 185, 129];
      const secondaryColor = [30, 41, 59];

      // Draw Header elements
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 8, 'F');

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(companyName.toUpperCase(), 15, 22);

      doc.setFont("Helvetica", "oblique");
      doc.setFontSize(9);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("ProofFlow AI Certified Work Proof", 15, 27);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Date: ${new Date(report.created_at).toLocaleDateString()}`, 150, 20);
      doc.text(`Report ID: PF-${report.id.substring(0, 8).toUpperCase()}`, 150, 24);

      doc.line(15, 33, 195, 33);

      // Section 1: Work Summary
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(51, 65, 85);
      doc.text("TECHNICIAN SPECIFICATION SUMMARY", 15, 42);

      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(255, 255, 255);
      doc.rect(15, 46, 180, 75, 'FD');

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Lead Technician: ${report.technician_name || ownerName}`, 20, 52);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      
      const splitText = doc.splitTextToSize(report.work_description || "", 170);
      doc.text(splitText, 20, 58);

      // Guarantees box
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(51, 65, 85);
      doc.text("SIGNATURE TRADE GUARANTEES", 15, 132);

      doc.setDrawColor(16, 185, 129);
      doc.setFillColor(240, 253, 250);
      doc.rect(15, 136, 180, 25, 'FD');
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(16, 185, 129);
      doc.text("100% Quality & Compliance Guarantee", 20, 143);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(79, 94, 113);
      doc.text("Full operational test passed. No pipeline blockages or structural defects detected.", 20, 149);
      doc.text("Work complies with standard European plumbing and construction directives.", 20, 153);

      // Photos summary
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(51, 65, 85);
      doc.text("PROJECT VISUAL PHOTO REFERENCES", 15, 172);

      doc.setDrawColor(241, 245, 249);
      doc.setFillColor(248, 250, 252);
      doc.rect(15, 176, 86, 45, 'FD');
      doc.rect(109, 176, 86, 45, 'FD');

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(239, 68, 68);
      doc.text("BEFORE COMPLETED STATE", 20, 182);
      doc.setTextColor(16, 185, 129);
      doc.text("AFTER WORK FINISHED", 114, 182);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text("[Image attachment rendered in main app]", 25, 202);
      doc.text("[Image attachment rendered in main app]", 119, 202);

      doc.text("ProofFlow AI Certificate — Turn Completed Work Into Marketing Gold.", 15, 275);
      doc.text("Verify this document authenticity at: https://proofflow.nl/verify", 15, 279);

      // Diagonal Watermark overlay for Free plans
      if (report.is_watermarked || currentPlan === 'free') {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(32);
        doc.setTextColor(239, 68, 68, 0.12);
        for (let y = 60; y <= 240; y += 60) {
          doc.text("PROOFFLOW AI FREE PLAN", 25, y, { angle: 18 });
        }
      }

      doc.save(`Proof_Report_${report.id.substring(0, 8).toUpperCase()}.pdf`);
      setToastMessage({ message: "PDF successfully compiled and downloaded!", type: "success" });
    } catch (err) {
      console.error(err);
      setToastMessage({ message: "Failed to assemble report PDF: " + err.message, type: "error" });
    }
  };

  // 1. Premium Skeletons loading fallback
  if (loading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Banner Skeleton */}
        <Card className="p-6 h-36 flex flex-col justify-between border border-white/5 bg-slate-900/30 animate-pulse">
          <div className="space-y-2">
            <div className="h-6 bg-white/5 rounded w-1/3 animate-pulse" />
            <div className="h-3.5 bg-white/5 rounded w-1/2 animate-pulse" />
          </div>
          <div className="h-9 bg-white/5 rounded w-28 animate-pulse self-end" />
        </Card>

        {/* Widgets skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-5 h-28 flex flex-col justify-between border border-white/5">
              <div className="flex justify-between items-center">
                <div className="h-3.5 bg-white/5 rounded w-20 animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-12 animate-pulse" />
              </div>
              <div className="h-6 bg-white/5 rounded w-24 animate-pulse" />
              <div className="h-1.5 bg-white/5 rounded w-full animate-pulse" />
            </Card>
          ))}
        </div>

        {/* Actions panel skeleton */}
        <div className="space-y-3">
          <div className="h-5 bg-white/5 rounded w-32 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 h-28 border border-white/5" />
            <Card className="p-6 h-28 border border-white/5" />
          </div>
        </div>

        {/* Activity skeleton */}
        <Card className="p-6 h-48 border border-white/5" />
      </div>
    );
  }

  const isGenerationsLow = currentPlan === 'free' && (5 - generationsUsed <= 1);

  return (
    <div className="space-y-8 animate-slide-up max-w-5xl mx-auto">
      {/* 1. Welcoming Hero Banner */}
      <div className="p-6 rounded-2xl glass-premium border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 h-48 w-48 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />
        
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-none mb-2">
            Welcome back, <span className="text-gradient-emerald">{ownerName.split(" ")[0]}</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg font-sans leading-relaxed">
            Ready to turn completed trade work into marketing assets? Upload photos from today's jobs to instantly boost trust and rankings for <strong>{companyName}</strong>.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
          <Link href="/dashboard/reports" className="w-full md:w-auto">
            <Button variant="accent" className="font-bold gap-2 py-3 px-5 text-xs w-full shadow-md shadow-emerald-500/10 hover:scale-[1.01] transition-transform">
              <PlusCircle size={15} /> New Proof Report
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Metric 1: SEO progress */}
        <Card variant="glass" className="p-5 flex flex-col justify-between border border-white/5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
            <span>SEO Wizard Setup</span>
            <Badge variant={seoProgress === 100 ? "success" : "warning"}>{seoProgress}% Done</Badge>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-3xl font-extrabold font-display text-white">{seoAnsweredCount}</span>
            <span className="text-slate-500 text-xs font-medium">/ 25 parameters</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"
              style={{ width: `${seoProgress}%` }}
            />
          </div>
        </Card>

        {/* Metric 2: KB Storage */}
        <Card variant="glass" className="p-5 flex flex-col justify-between border border-white/5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
            <span>Memory KB Storage</span>
            <Badge variant={kbCount > 0 ? "success" : "secondary"}>{kbCount} {kbCount === 1 ? 'file' : 'files'}</Badge>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-3xl font-extrabold font-display text-white">{kbStorageMb.toFixed(1)}</span>
            <span className="text-slate-500 text-xs font-medium">/ {currentPlan === 'free' ? '1.0' : '10.0'} MB used</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              style={{ width: `${(kbStorageMb / (currentPlan === 'free' ? 1.0 : 10.0)) * 100}%` }}
            />
          </div>
        </Card>

        {/* Metric 3: Generations */}
        <Card variant="glass" className="p-5 flex flex-col justify-between border border-white/5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
            <span>Generations Used</span>
            <Badge variant={isGenerationsLow ? "danger" : "primary"}>
              {currentPlan === 'free' ? `${generationsUsed}/5` : 'Unlimited'}
            </Badge>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-3xl font-extrabold font-display text-white">
              {currentPlan === 'free' ? Math.max(0, 5 - generationsUsed) : '∞'}
            </span>
            <span className="text-slate-500 text-xs font-medium">runs remaining</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className={`h-full rounded-full ${isGenerationsLow ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}
              style={{ width: `${currentPlan === 'free' ? (generationsUsed / maxGenerations) * 100 : 10}%` }}
            />
          </div>
        </Card>
      </div>

      {/* 3. Main Actions Dashboard Grid */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-base text-white">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Action 1 */}
          <Link href="/dashboard/reports" className="group block">
            <Card variant="glass" className="p-6 border border-white/5 hover:border-emerald-500/20 hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-semibold text-white group-hover:text-emerald-400 transition-colors text-sm">
                    Upload Before & After Photos
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans">
                    Create beautiful PDF proof sheets detailing your job, location parameters, and warranty tags to immediately hand off to customers.
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Action 2 */}
          <Link href="/dashboard/social-posts" className="group block">
            <Card variant="glass" className="p-6 border border-white/5 hover:border-purple-500/20 hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Sparkles size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-semibold text-white group-hover:text-purple-400 transition-colors text-sm">
                    Generate Localized SEO Posts
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans">
                    Generate highly optimized updates for GBP, Facebook, Instagram, LinkedIn, and Nextdoor configured with neighborhoods.
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* 4. Recent Activity and Project Logs */}
      <Card variant="glass" className="border border-white/5 shadow-xl">
        <CardHeader className="bg-black/10 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-white text-base">Recent Work Projects</h3>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Active Database Logs</span>
          </div>
        </CardHeader>
        <CardBody className="p-0 font-sans">
          {recentReports.length === 0 ? (
            <div className="p-12 text-center space-y-4 max-w-sm mx-auto">
              <Compass size={32} className="text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-white">No work compiled yet</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Turn your daily completed trade jobs into marketing assets. Upload your first before/after comparison now!
              </p>
              <Link href="/dashboard/reports" className="inline-block pt-1">
                <Button variant="accent" size="sm" className="font-bold gap-1">
                  <PlusCircle size={14} /> Upload First Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentReports.map((report) => (
                <div 
                  key={report.id} 
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        {report.work_description ? report.work_description.substring(0, 65) + "..." : "Emergency Trade Repair"}
                      </h4>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500 font-sans items-center">
                        <span className="flex items-center gap-1"><MapPin size={10} /> Amsterdam Zuid</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(report.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <Badge variant={report.is_watermarked ? "warning" : "success"}>
                      {report.is_watermarked ? "Watermarked" : "Branded Premium"}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleFastDownloadPdf(report)}
                      className="gap-1 px-3 py-1.5 text-xs font-semibold hover:border-emerald-500/20 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
                    >
                      <Download size={12} /> Download PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Render notifications */}
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
