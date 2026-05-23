"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Mail, Sparkles } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { createClient } from '../../lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const supabase = createClient();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setToastMessage({ message: 'Please enter your email address.', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) throw error;

      setToastMessage({ 
        message: 'Password reset link sent! Please check your email inbox and spam folder.', 
        type: 'success' 
      });
      setEmail('');
    } catch (err) {
      console.error('Password reset request error:', err);
      setToastMessage({ message: err.message || 'Failed to dispatch reset link.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative bg-slate-950">
      {/* Background radial effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="absolute top-6 left-6">
        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white uppercase tracking-wider transition-colors">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white">
            <ShieldCheck size={28} />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold font-display text-white tracking-tight">
          Reset business password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400 font-sans">
          Enter your registered email address below, and we will send you a secure link to update your credentials.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card variant="glass" className="border border-white/10 shadow-2xl">
          <CardBody>
            <form onSubmit={handleResetRequest} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-display">
                  Business Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail size={16} />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    placeholder="e.g. info@johnsplumbing.nl" 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-600 font-sans"
                  />
                </div>
              </div>

              <Button 
                variant="accent" 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 font-bold shadow-md shadow-purple-600/10 bg-purple-600 hover:bg-purple-500 flex items-center justify-center gap-2 font-display"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                ) : (
                  <>Send Reset Link <Sparkles size={14} /></>
                )}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

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
