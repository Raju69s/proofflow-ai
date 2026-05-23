"use client";

import React, { useState } from 'react';
import { Mail, MessageSquare, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Toast } from '../../components/ui/Toast';
import MarketingNavbar from '../../components/ui/MarketingNavbar';
import MarketingFooter from '../../components/ui/MarketingFooter';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setToastMessage({ message: 'Please fill in all required form fields.', type: 'warning' });
      return;
    }

    setSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setToastMessage({ message: 'Thank you! Your message has been sent successfully. Our support desk will reply within 4 hours.', type: 'success' });
      setName('');
      setEmail('');
      setSubject('general');
      setMessage('');
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between overflow-x-hidden">
      <MarketingNavbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Header */}
        <section className="text-center max-w-3xl mx-auto px-6 mb-12 animate-slide-up">
          <Badge variant="pro" className="mb-4 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1">
            Support Gateways
          </Badge>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-tight mb-4">
            Connect With Our <br />Product Support Team
          </h1>
          <p className="text-slate-400 font-sans text-sm sm:text-base max-w-xl mx-auto">
            Need help with your Supabase auth, setting up API keys, or optimizing PDF templates? Drop us a line below.
          </p>
        </section>

        {/* Two-Column Form & Direct Support */}
        <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Side: Contact Form */}
          <div className="lg:col-span-7">
            <Card variant="glass" className="p-6 sm:p-8 border border-white/5 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-5 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 font-display">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      placeholder="e.g. Mark Janssen"
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-all font-sans placeholder:text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 font-display">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      placeholder="e.g. mark@brabant-electric.nl"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-all font-sans placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 font-display">
                    Subject Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-all font-sans"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support / DB Connectivity</option>
                    <option value="billing">Plan Subscriptions & Billing</option>
                    <option value="partnership">API Partnerships</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 font-display">
                    Detailed Message *
                    </label>
                  <textarea 
                    rows={4}
                    required
                    value={message}
                    placeholder="Describe your inquiry or question in detail..."
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-all font-sans placeholder:text-slate-700 leading-relaxed"
                  />
                </div>

                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-3.5 font-bold font-display bg-purple-600 hover:bg-purple-500 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/10 disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                  ) : (
                    <>Send Support Ticket <ArrowRight size={14} /></>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Side: Direct Details */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="glass" className="p-6">
              <h3 className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
                <Mail className="text-purple-400" size={18} /> Direct Support Channels
              </h3>
              <div className="space-y-4 font-sans text-xs text-slate-300">
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-white/5">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-widest block mb-1">Email Support desk</span>
                  <a href="mailto:support@proofflow.nl" className="font-bold text-white hover:text-purple-400 transition-colors">
                    support@proofflow.nl
                  </a>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-white/5">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-widest block mb-1">Operating Hours</span>
                  <p className="font-bold text-white">Monday - Friday: 08:30 - 18:30 CET</p>
                  <p className="text-[10px] text-slate-400 mt-1">Saturday Support: Emergency channels only</p>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-6">
              <h3 className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
                <HelpCircle className="text-purple-400" size={18} /> Enterprise Guarantee
              </h3>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">
                Need customized enterprise SLA guidelines, private API endpoints for automated franchise syncs, or custom database configurations? Get in touch with our team at{' '}
                <a href="mailto:enterprise@proofflow.nl" className="text-purple-400 hover:underline">
                  enterprise@proofflow.nl
                </a>.
              </p>
            </Card>
          </div>
        </section>
      </main>

      {/* Toast notification */}
      {toastMessage && (
        <Toast 
          message={toastMessage.message} 
          type={toastMessage.type} 
          onClose={() => setToastMessage(null)}
        />
      )}

      <MarketingFooter />
    </div>
  );
}
