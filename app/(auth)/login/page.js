import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Mail, Lock } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 left-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white uppercase tracking-wider transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-gradient-to-tr from-primary to-emerald-500 rounded-xl text-white">
            <ShieldCheck size={28} className="animate-pulse-slow" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold font-display text-white tracking-tight">
          Welcome back to ProofFlow
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Or{' '}
          <Link href="/register" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
            register your trade company
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card variant="glass" className="border border-white/10 shadow-2xl">
          <CardBody className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Business Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. info@johnsplumbing.nl" 
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Secure Password
                </label>
                <a href="#" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <a href="/dashboard">
                <Button variant="accent" type="submit" className="w-full py-3.5 font-bold shadow-md shadow-emerald-500/10">
                  Access Portal
                </Button>
              </a>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs font-medium uppercase tracking-wider">Demo Quick Access</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <div>
              <a href="/dashboard">
                <Button variant="outline" className="w-full py-3 font-semibold gap-1.5 border-dashed border-white/10 hover:border-white/20">
                  Sign In as Demo Tradesman
                </Button>
              </a>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
