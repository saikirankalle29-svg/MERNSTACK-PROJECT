import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-slate-800 p-4 z-50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-semibold">
              {unreadCount} Unread
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {notifications.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">No notifications yet</p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => markAsRead(item._id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    item.read
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                      : 'bg-slate-800/60 border-indigo-500/30 text-slate-200'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    {item.type === 'success' ? (
                      <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    ) : item.type === 'warning' ? (
                      <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                    ) : (
                      <Info size={16} className="text-sky-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <h5 className="font-bold text-white text-xs">{item.title}</h5>
                      <p className="mt-0.5 leading-relaxed">{item.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
