import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ label = 'Loading CivicRoute Data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      <span className="text-xs font-semibold text-slate-400 animate-pulse">{label}</span>
    </div>
  );
};

export default Loader;
