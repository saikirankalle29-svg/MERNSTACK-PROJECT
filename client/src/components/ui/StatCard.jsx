import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtext }) => {
  const colorStyles = {
    indigo: 'from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/20',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20',
    rose: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/20',
    sky: 'from-sky-500/20 to-sky-600/5 text-sky-400 border-sky-500/20'
  };

  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <div className={`p-5 rounded-2xl glass-card border bg-gradient-to-br ${style}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{value}</h3>
          {subtext && <p className="text-[11px] text-slate-400 mt-1">{subtext}</p>}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center">
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
