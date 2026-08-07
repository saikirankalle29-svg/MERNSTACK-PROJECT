import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import QuickDemoLogin from '../../components/common/QuickDemoLogin';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Building2,
  MapPin,
  FileText,
  Clock,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Lightbulb,
  AlertTriangle,
  Droplet,
  Trash2,
  ZapOff,
  Car,
  ShieldAlert
} from 'lucide-react';

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { title: 'Roads & Potholes', icon: AlertTriangle, desc: 'Damage, potholes, tar repairs & footpath hazards', color: 'text-amber-400 border-amber-500/20 bg-amber-500/10' },
    { title: 'Drainage & Sewage', icon: Droplet, desc: 'Overflowing drains, blocked pipelines & flooding', color: 'text-sky-400 border-sky-500/20 bg-sky-500/10' },
    { title: 'Garbage & Waste', icon: Trash2, desc: 'Uncollected trash, illegal dumping & cleanliness', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
    { title: 'Street Light', icon: ZapOff, desc: 'Non-functional lamps, flickering bulbs & dark zones', color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10' },
    { title: 'Water Supply', icon: Droplet, desc: 'Pipeline leaks, contaminated water & supply cuts', color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' },
    { title: 'Electricity', icon: Zap, desc: 'Hanging wires, transformer repairs & outages', color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' },
    { title: 'Traffic Management', icon: Car, desc: 'Signal failures, congestion points & road signs', color: 'text-rose-400 border-rose-500/20 bg-rose-500/10' },
    { title: 'Public Property', icon: Building2, desc: 'Park upkeep, public toilet damage & municipal assets', color: 'text-teal-400 border-teal-500/20 bg-teal-500/10' }
  ];

  const features = [
    {
      title: 'Groq AI Complaint Analysis',
      desc: 'Llama 3.3 LLM analyzes raw citizen complaint text, generates polished official summaries, and determines priority automatically.',
      icon: Sparkles
    },
    {
      title: 'Automated Department Routing',
      desc: 'Instantly routes complaints to the exact municipal department (Sanitation, Electrical, Water Works) without manual intervention.',
      icon: Zap
    },
    {
      title: 'Real-Time Audit Tracking',
      desc: 'Transparent live status tracking from Submitted → Assigned → In Progress → Resolved with timestamped official audit logs.',
      icon: Clock
    },
    {
      title: 'Verified Resolution Proof',
      desc: 'Department officers upload resolution image proof and officer notes before closing civic tickets.',
      icon: CheckCircle2
    }
  ];

  const faqs = [
    { q: 'How does Groq AI process my complaint?', a: 'When you submit a complaint title & description, our integrated Groq Llama AI reads the text, identifies the core category, auto-assigns the relevant government department, sets urgency priority, and refines the description for municipal work orders.' },
    { q: 'Can I track my complaint progress in real time?', a: 'Yes! Every complaint receives a unique tracking ID and step-by-step progress timeline accessible on your Citizen Dashboard.' },
    { q: 'How do officers verify complaint resolution?', a: 'Department officers must inspect the issue site, attach resolution remarks, upload proof image evidence, and mark the complaint resolved. You can then rate the work and close the ticket.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-6 animate-float">
            <Sparkles size={14} className="text-amber-400" />
            <span>CivicRoute Smart Governance v2.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Report Civic Issues Easily. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              AI Routes & Resolves Them Fast.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Empowering citizens to log garbage, street light, road & water issues. Powered by Groq AI to instantly structure reports and dispatch municipal officers.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Register Complaint</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-slate-800 text-slate-200 font-bold text-sm transition flex items-center justify-center space-x-2"
            >
              <ShieldCheck size={18} className="text-indigo-400" />
              <span>Officer / Admin Login</span>
            </Link>
          </div>

          {/* Quick Demo Login Widget */}
          <div className="mt-12 max-w-2xl mx-auto">
            <QuickDemoLogin />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">How CivicRoute Works</h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              Four seamless steps from citizen submission to verified government resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Citizen Reports', desc: 'Citizen fills out simple complaint details and uploads an optional photo.', icon: FileText },
              { step: '02', title: 'Groq AI Analysis', desc: 'Llama 3.3 AI auto-categorizes, sets urgency priority & generates summary.', icon: Sparkles },
              { step: '03', title: 'Department Routed', desc: 'Assigned to municipal officer with real-time audit notifications.', icon: Building2 },
              { step: '04', title: 'Verified Resolution', desc: 'Officer completes repair, uploads photo proof, and citizen closes ticket.', icon: CheckCircle2 }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl glass-card relative border border-slate-800">
                  <span className="text-3xl font-extrabold text-indigo-500/20 absolute top-4 right-4">{item.step}</span>
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Smart Governance Features</h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              Built for speed, transparency, and high civic satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-8 rounded-3xl glass-card flex items-start space-x-5 border border-slate-800">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Complaint Categories Section */}
      <section id="categories" className="py-16 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white">Supported Complaint Sectors</h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              Automated routing to specialized department workforces.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-indigo-500/40 transition">
                  <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center mb-3 border`}>
                    <Icon size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-white">{cat.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Counter Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-950/40 via-slate-950 to-indigo-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-white">12,480+</h3>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mt-2">Complaints Resolved</p>
          </div>
          <div>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-emerald-400">94.8%</h3>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mt-2">Resolution Rate</p>
          </div>
          <div>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-sky-400">&lt; 24 hrs</h3>
            <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mt-2">Avg Officer Dispatch</p>
          </div>
          <div>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-amber-400">99.2%</h3>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mt-2">Groq AI Categorization</p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">Everything you need to know about CivicRoute platform.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl glass-card border border-slate-800 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-white hover:text-indigo-400 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
