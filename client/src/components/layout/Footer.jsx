import React from 'react';
import { Building2, Heart, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Building2 size={20} />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">CivicRoute</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-Driven Smart Civic Complaint Routing & Resolution Platform powering cleaner, safer, and smarter communities.
          </p>
          <div className="flex items-center space-x-2 text-xs text-indigo-400">
            <ShieldCheck size={16} />
            <span>Gov Digital Innovation Compliant</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Portals</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/login" className="hover:text-indigo-400 transition">Citizen Portal</Link></li>
            <li><Link to="/login" className="hover:text-indigo-400 transition">Department Officer Panel</Link></li>
            <li><Link to="/login" className="hover:text-indigo-400 transition">Admin Dashboard</Link></li>
            <li><a href="#how-it-works" className="hover:text-indigo-400 transition">Workflow System</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Service Sectors</h4>
          <ul className="space-y-2 text-xs">
            <li>Roads & Infrastructure</li>
            <li>Sanitation & Waste</li>
            <li>Water Supply & Sewage</li>
            <li>Street Lighting & Power</li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Contact Support</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center space-x-2"><Mail size={14} className="text-indigo-400" /><span>help@civicroute.gov</span></li>
            <li className="flex items-center space-x-2"><Phone size={14} className="text-indigo-400" /><span>Toll Free: 1800-CIVIC-AI</span></li>
            <li className="flex items-center space-x-2"><MapPin size={14} className="text-indigo-400" /><span>Municipal HQ, Smart City Tower</span></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} CivicRoute System. All rights reserved.</p>
        <p className="flex items-center space-x-1 mt-2 md:mt-0">
          <span>Engineered with</span>
          <Heart size={12} className="text-rose-500 fill-rose-500 inline" />
          <span>for Smart Governance</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
