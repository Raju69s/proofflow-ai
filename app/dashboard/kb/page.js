"use client";

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FileText, 
  Trash2, 
  UploadCloud, 
  Search, 
  HardDrive, 
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Toast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { createClient } from '../../../lib/supabase/client';
import { uploadKBDocument, deleteStorageFile } from '../../../lib/services/storage';
import { checkPlanLimits } from '../../../lib/utils/plan-guard';

export default function KnowledgeBasePage() {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [subscription, setSubscription] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const supabase = createClient();

  // Load user data, subscription details, and files list
  async function loadKBData() {
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Subscription Info
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subError) throw subError;
      
      const activeSub = subData || { plan_type: 'free', monthly_generations_used: 0, status: 'active' };
      setSubscription(activeSub);
      setCurrentPlan(activeSub.plan_type);

      // 2. Fetch Knowledge Base Records
      const { data: kbFiles, error: kbError } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (kbError) throw kbError;
      setFiles(kbFiles || []);

    } catch (err) {
      console.error("Failed to load Knowledge Base components:", err);
      setToastMessage({ message: "Database connection failed. Showing offline fallback list.", type: "warning" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKBData();
  }, []);

  // Calculate cumulative storage in bytes
  const totalStorageBytes = files.reduce((acc, f) => acc + f.file_size_bytes, 0);
  const storageLimit = currentPlan === 'free' ? 1 * 1024 * 1024 : 10 * 1024 * 1024;
  const storagePercentage = (totalStorageBytes / storageLimit) * 100;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Enforce Plan limits before hitting storage buckets
    const limitCheck = checkPlanLimits(
      subscription || { plan_type: currentPlan, status: 'active' },
      'knowledge_base_size',
      { currentBytes: totalStorageBytes, uploadingBytes: file.size }
    );

    if (!limitCheck.allowed) {
      setToastMessage({ message: limitCheck.reason, type: 'error' });
      setUpgradeModalOpen(true);
      return;
    }

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setToastMessage({ message: "Authentication required to upload.", type: "error" });
        return;
      }

      // 1. Upload to Supabase Storage bucket
      const uploadRes = await uploadKBDocument(
        supabase,
        file,
        user.id,
        totalStorageBytes,
        currentPlan
      );

      // 2. Save metadata record to PostgreSQL knowledge_base table
      const { data: insertedRecord, error: dbError } = await supabase
        .from('knowledge_base')
        .insert({
          user_id: user.id,
          file_name: uploadRes.fileName,
          file_path: uploadRes.filePath,
          file_size_bytes: uploadRes.sizeBytes,
          file_type: uploadRes.fileType
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setFiles(prev => [insertedRecord, ...prev]);
      setToastMessage({ message: `"${file.name}" synchronized into AI memory successfully.`, type: 'success' });

    } catch (err) {
      console.error("Upload process error:", err);
      setToastMessage({ message: err.message || "Failed to upload document. Please verify structure.", type: 'error' });
    } finally {
      setUploading(false);
      // Reset input element
      e.target.value = "";
    }
  };

  const handleDeleteFile = async (id, name, filePath) => {
    try {
      setLoading(true);
      // 1. Remove from Storage Bucket
      await deleteStorageFile(supabase, 'knowledge-base', filePath);

      // 2. Remove from database table
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFiles(prev => prev.filter(f => f.id !== id));
      setToastMessage({ message: `"${name}" removed from business memory.`, type: 'info' });
    } catch (err) {
      console.error("Delete process error:", err);
      setToastMessage({ message: `Failed to delete file: ${err.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter(f => 
    f.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 border-r-2 border-emerald-500/20"></div>
        <p className="text-slate-400 text-[10px] tracking-widest uppercase font-semibold">Synchronizing Knowledge Base memory facts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-5xl mx-auto">
      {/* 1. Header & Storage Meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
            Business Memory KB
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Feed your company brochures, warranties, or rates. ProofFlow AI automatically references these facts to ensure generations are 100% accurate.
          </p>
        </div>

        <Badge variant={currentPlan === 'pro' ? 'pro' : 'primary'}>
          {currentPlan === 'pro' ? 'Pro 10MB Limit' : 'Free 1MB Limit'}
        </Badge>
      </div>

      {/* Storage Gauge */}
      <Card variant="glass" className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <HardDrive size={16} className="text-emerald-400" />
            <span>Active Knowledge Base Storage</span>
          </div>
          <span className="text-xs font-semibold text-slate-200">
            {(totalStorageBytes / 1024).toFixed(1)}KB used / {currentPlan === 'free' ? '1,024KB' : '10,240KB'} max
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-900 border border-white/5 rounded-full overflow-hidden mb-1">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(storagePercentage, 100)}%` }}
          />
        </div>

        {currentPlan === 'free' && (
          <p className="text-[10px] text-slate-400 mt-2">
            Running low? <button onClick={() => setUpgradeModalOpen(true)} className="text-emerald-400 hover:text-emerald-300 font-semibold underline transition-colors">Upgrade to Pro</button> for 10x more storage and priority document indexing.
          </p>
        )}
      </Card>

      {/* 2. Drag & Drop Upload Zone */}
      <div className="relative">
        <input 
          type="file" 
          id="kb-uploader"
          onChange={handleFileUpload}
          disabled={uploading || loading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:pointer-events-none"
        />
        <div className="p-8 rounded-xl border border-dashed border-white/10 hover:border-emerald-500/20 bg-slate-950/20 flex flex-col items-center justify-center text-center transition-all duration-200">
          <div className="h-12 w-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <UploadCloud size={24} />
          </div>
          
          <h4 className="text-sm font-semibold text-white mb-1">
            {uploading ? `Uploading & Indexing document...` : "Upload Business Memory Documents"}
          </h4>
          <p className="text-xs text-slate-500 font-sans leading-relaxed max-w-sm">
            Drag & drop or click to upload. Supports PDF, TXT, DOCX, HTML, or XLSX up to current plan limits.
          </p>

          {/* Upload progress indicator */}
          {uploading && (
            <div className="w-full max-w-xs h-1 bg-slate-900 border border-white/5 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-emerald-500 rounded-full animate-pulse style={{ width: '100%' }}" />
            </div>
          )}
        </div>
      </div>

      {/* 3. Search and Document Listing */}
      <Card variant="glass">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 bg-black/10">
          <h3 className="font-display font-bold text-white text-base">
            Uploaded Memory Files
          </h3>
          
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search size={14} />
            </div>
            <input 
              type="text"
              value={searchQuery}
              placeholder="Search file name..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/5 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {filteredFiles.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching files found. Upload a file above to add memory.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredFiles.map((file) => (
                <div key={file.id} className="p-4 flex items-center justify-between gap-4 animate-slide-up">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{file.file_name}</h4>
                      <p className="text-[10px] text-slate-500">
                        {((file.file_size_bytes) / 1024).toFixed(1)}KB • Uploaded on {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteFile(file.id, file.file_name, file.file_path)}
                    className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Help block */}
      <div className="p-4 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 flex items-start gap-3">
        <HelpCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          <strong>AI Memory Integration:</strong> Files uploaded here act as static contexts injected directly into generations. Upload rate sheets to ensure generated post pricing matches standard policies.
        </p>
      </div>

      {/* Upgrade popup */}
      <Modal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Pro SaaS Upgrade Required"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <Sparkles size={18} />
            <span className="text-xs font-bold font-display uppercase tracking-wider">Unrestricted Access awaits</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed font-sans">
            You have hit the storage limit for Free users (1MB). Upgrading to Pro ($29/month) instantly expands your capacity to 10MB, unlocks watermark removal, and provides priority AI processing pipelines.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="/dashboard/billing" className="w-full">
              <Button variant="accent" className="w-full py-3.5 font-bold shadow-md shadow-emerald-500/10">
                Unlock Pro SaaS Access
              </Button>
            </a>
          </div>
        </div>
      </Modal>

      {/* Toast notifies */}
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
