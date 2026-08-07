import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import QuickDemoLogin from '../../components/common/QuickDemoLogin';
import { Building2, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (res.role === 'Citizen') navigate('/citizen/dashboard');
      else if (res.role === 'Department Officer') navigate('/officer/dashboard');
      else if (res.role === 'Admin') navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-6">
          
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30 mb-4">
              <Building2 size={26} />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Sign In to CivicRoute</h2>
            <p className="text-xs text-slate-400 mt-1">Access Citizen, Officer, or Admin workspace</p>
          </div>

          {/* Quick Demo Login */}
          <QuickDemoLogin />

          {/* Form */}
          <div className="p-8 rounded-3xl glass-card border border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@civicroute.gov"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-indigo-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Don't have a citizen account?{' '}
              <Link to="/register" className="text-indigo-400 font-bold hover:underline">
                Register here
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
