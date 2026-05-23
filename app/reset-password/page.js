"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { createClient } from '../../lib/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!password.trim() || !confirmPassword.trim()) {
      setToastMessage({ message: 'Please enter both password fields.', type: 'warning' });
      return;
    }

    if (password.length < 8) {
      setToastMessage({ message: 'Password must be at least 8 characters long.', type: 'warning' });
      return;
    }

    if (password !== confirmPassword) {
      setToastMessage({ message: 'Passwords do not match.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: password.trim() });
      if (error) throw error;

      setToastMessage({ message: 'Password successfully updated! Redirecting to your dashboard...', type: 'success' });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Password update failure:', err);
      setToastMessage({ message: err.message || 'Failed to update password.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white">
            <ShieldCheck size={28} />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold font-display text-white tracking-tight">
          Enter new password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400 font-sans">
          Configure a secure, private credential boundary for your trade business account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card variant="glass" className="border border-white/10 shadow-2xl">
          <CardBody>
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-display">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    placeholder="Minimum 8 characters" 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-600 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-display">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    placeholder="Confirm new password" 
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <>Update Password & Log In <Sparkles size={14} /></>
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
