"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, Mail, Lock, Sparkles } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { createClient } from '../../lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setToastMessage({ message: 'Please enter both your email and password.', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) throw error;

      setToastMessage({ message: 'Authentication successful! Redirecting to dashboard...', type: 'success' });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err) {
      console.error('Login error:', err);
      setToastMessage({ message: err.message || 'Invalid login credentials.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    const demoEmail = 'demo@proofflow.nl';
    const demoPassword = 'demo123456password';

    try {
      // 1. Try to login directly
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword
      });

      if (!signInError && signInData?.session) {
        setToastMessage({ message: 'Welcome to the Demo Portal! Loading trade workspace...', type: 'success' });
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
        return;
      }

      // 2. If login fails (user does not exist), auto-provision the demo tradesman
      setToastMessage({ message: 'Provisioning initial demo trade sandbox user...', type: 'info' });
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          data: {
            company_name: 'DeVries Plumbing NL',
            owner_name: 'Johan DeVries'
          }
        }
      });

      if (signUpError) throw signUpError;

      // 3. Try to sign in again after registration
      const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword
      });

      if (retryError) {
        // If confirmation is required, inform user
        setToastMessage({ 
          message: 'Demo account provisioned successfully! Check email verification settings in Supabase to login.', 
          type: 'warning' 
        });
      } else if (retryData?.session) {
        setToastMessage({ message: 'Demo portal provisioned and authenticated successfully! Redirecting...', type: 'success' });
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      }
    } catch (err) {
      console.error('Demo auto-provisioning failure:', err);
      setToastMessage({ message: err.message || 'Failed to initialize demo tradesman session.', type: 'error' });
    } finally {
      setDemoLoading(false);
    }
  };

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
          Welcome back to ProofFlow
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400 font-sans">
          Or{' '}
          <Link href="/register" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
            register your trade company
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card variant="glass" className="border border-white/10 shadow-2xl">
          <CardBody>
            <form onSubmit={handleLogin} className="space-y-6">
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

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-display">
                    Secure Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    placeholder="••••••••" 
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
                  className="w-full py-3.5 font-bold shadow-md shadow-purple-600/10 bg-purple-600 hover:bg-purple-500 flex items-center justify-center gap-2 font-display animate-pulse-slow"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                  ) : (
                    <>Access Portal <Sparkles size={14} /></>
                  )}
                </Button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest font-display">Demo Quick Access</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <div>
                <Button 
                  type="button"
                  variant="outline" 
                  disabled={demoLoading}
                  onClick={handleDemoLogin}
                  className="w-full py-3 font-semibold gap-1.5 border-dashed border-white/10 hover:border-white/20 text-xs font-display"
                >
                  {demoLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-slate-300" />
                  ) : (
                    <>Sign In as Demo Tradesman</>
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
