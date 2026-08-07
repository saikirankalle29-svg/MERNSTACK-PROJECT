import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Password reset link has been dispatched to your email.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl glass-card border border-slate-800 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Mail size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-white">Forgot Password?</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your registered email address to receive reset instructions.</p>

          {submitted ? (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed">
              Check your inbox! We sent a password recovery token link to <span className="font-bold text-white">{email}</span>.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@civicroute.gov"
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
              >
                <Send size={16} />
                <span>Send Reset Token</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800">
            <Link to="/login" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition">
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
