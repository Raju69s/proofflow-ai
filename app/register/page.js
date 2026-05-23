import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Mail, Lock, Building, User } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function RegisterPage() {
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
          Create trade account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Or{' '}
          <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
            sign in to active business
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card variant="glass" className="border border-white/10 shadow-2xl">
          <CardBody className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Company / Brand Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Building size={16} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. JB Painting & Decorating" 
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Owner / Contact Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Brown" 
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

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
                  placeholder="e.g. info@jbpainting.nl" 
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Create Secure Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="Minimum 8 characters" 
                  className="w-full bg-slate-950/60 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <a href="/dashboard">
                <Button variant="accent" type="submit" className="w-full py-3.5 font-bold shadow-md shadow-emerald-500/10">
                  Create Trade Account
                </Button>
              </a>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
