import React from 'react';

const StatusBadge = ({ status, type = 'status' }) => {
  if (type === 'priority') {
    const priorityColors = {
      Low: 'bg-slate-800 text-slate-300 border-slate-700',
      Medium: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      High: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    };

    return (
      <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${priorityColors[status] || priorityColors.Medium}`}>
        {status}
      </span>
    );
  }

  const statusColors = {
    Submitted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Assigned: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'In Progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Closed: 'bg-slate-800 text-slate-400 border-slate-700'
  };

  return (
    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${statusColors[status] || statusColors.Submitted}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
