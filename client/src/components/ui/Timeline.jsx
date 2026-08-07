import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, FileCheck, XCircle } from 'lucide-react';

const Timeline = ({ items = [] }) => {
  return (
    <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
      {items.map((item, index) => {
        const isResolved = item.status === 'Resolved' || item.status === 'Closed';
        const isRejected = item.status === 'Rejected';

        return (
          <div key={index} className="relative group">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition ${
                isResolved
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                  : isRejected
                  ? 'bg-rose-950 border-rose-500 text-rose-400'
                  : 'bg-indigo-950 border-indigo-500 text-indigo-400'
              }`}
            >
              {isResolved ? (
                <CheckCircle2 size={14} />
              ) : isRejected ? (
                <XCircle size={14} />
              ) : (
                <Clock size={14} />
              )}
            </div>

            {/* Content */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{item.status}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-medium mt-1">
                Updated by: {item.updatedBy}
              </p>
              {item.note && (
                <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
