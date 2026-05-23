"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, Mail, Lock, Building, User, Sparkles } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { createClient } from '../../lib/supabase/client';

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [successVerification, setSuccessVerification] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !ownerName.trim() || !email.trim() || !password.trim()) {
      setToastMessage({ message: 'Please fill in all registration fields.', type: 'warning' });
      return;
    }

    if (password.length < 8) {
      setToastMessage({ message: 'Password must be at least 8 characters long.', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            company_name: companyName.trim(),
            owner_name: ownerName.trim()
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
        }
      });

      if (error) throw error;

      // Check if session was automatically created (email confirmation is off)
      if (data?.session) {
        setToastMessage({ message: 'Registration successful! Opening dashboard...', type: 'success' });
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        // Email confirmation is on
        setSuccessVerification(true);
        setToastMessage({ 
          message: 'Account created! Please check your email inbox to verify your account.', 
          type: 'success' 
        });
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setToastMessage({ message: err.message || 'Failed to register account.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (successVerification) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white animate-bounce">
              <Mail size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
            Verify Your Trade Account
          </h2>
          <Card variant="glass" className="p-6 border border-white/10 max-w-sm mx-auto">
            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              We've dispatched a secure activation link to <strong className="text-white">{email}</strong>. 
              Please click the link inside to fully enable and access your local SEO marketing dashboard.
            </p>
            <div className="mt-6">
              <Link href="/login">
                <Button variant="outline" className="w-full text-xs font-semibold py-2.5 bg-transparent border-white/10 text-slate-300 hover:text-white">
                  Back to Login
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      
      <div className="absolute top-6 left-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white uppercase tracking-wider transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white">
            <ShieldCheck size={28} />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold font-display text-white tracking-tight">
          Create trade account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400 font-sans">
          Or{' '}
          <Link href="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
            sign in to active business
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card variant="glass" className="border border-white/10 shadow-2xl">
          <CardBody>
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-display">
                  Company / Brand Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Building size={16} />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={companyName}
                    placeholder="e.g. JB Painting & Decorating" 
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-600 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-display">
                  Owner / Contact Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User size={16} />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={ownerName}
                    placeholder="e.g. John Brown" 
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-600 font-sans"
                  />
                </div>
              </div>

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
                    placeholder="e.g. info@jbpainting.nl" 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-600 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-display">
                  Create Secure Password
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

              <div className="pt-2">
                <Button 
                  variant="accent" 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 font-bold shadow-md shadow-purple-600/10 bg-purple-600 hover:bg-purple-500 flex items-center justify-center gap-2 font-display"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                  ) : (
                    <>Create Trade Account <Sparkles size={14} /></>
                  )}
                </Button>
              </div>
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
