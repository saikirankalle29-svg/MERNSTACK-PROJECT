import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Building2, Sparkles } from 'lucide-react';

const QuickDemoLogin = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async (role) => {
    const res = await demoLogin(role);
    if (res.success) {
      if (role === 'Citizen') navigate('/citizen/dashboard');
      else if (role === 'Department Officer') navigate('/officer/dashboard');
      else if (role === 'Admin') navigate('/admin/dashboard');
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 backdrop-blur-md">
      <div className="flex items-center space-x-2 mb-3">
        <Sparkles size={16} className="text-amber-400" />
        <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
          One-Click Demo Account Login
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleDemo('Citizen')}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-300 border border-sky-500/20 transition"
        >
          <User size={14} />
          <span>Citizen Demo</span>
        </button>
        <button
          type="button"
          onClick={() => handleDemo('Department Officer')}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 border border-emerald-500/20 transition"
        >
          <ShieldCheck size={14} />
          <span>Officer Demo</span>
        </button>
        <button
          type="button"
          onClick={() => handleDemo('Admin')}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 border border-indigo-500/20 transition"
        >
          <Building2 size={14} />
          <span>Admin Demo</span>
        </button>
      </div>
    </div>
  );
};

export default QuickDemoLogin;
