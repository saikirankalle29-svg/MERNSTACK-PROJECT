import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../common/NotificationBell';
import { Building2, User, LogOut, Menu, X, ShieldAlert, Sparkles, PlusCircle } from 'lucide-react';

const Navbar = ({ onToggleSidebar, isDashboard = false }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Sidebar Toggle */}
        <div className="flex items-center space-x-3">
          {isDashboard && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle Navigation"
            >
              <Menu size={22} />
            </button>
          )}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Building2 size={22} />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                CivicRoute
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                AI Powered
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        {!isDashboard && (
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <Link to="/" className={`hover:text-indigo-400 transition ${location.pathname === '/' ? 'text-indigo-400 font-semibold' : ''}`}>
              Home
            </Link>
            <a href="#how-it-works" className="hover:text-indigo-400 transition">How it Works</a>
            <a href="#categories" className="hover:text-indigo-400 transition">Categories</a>
            <a href="#features" className="hover:text-indigo-400 transition">Features</a>
            <a href="#contact" className="hover:text-indigo-400 transition">Contact</a>
          </nav>
        )}

        {/* Right CTA / Auth Controls */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Report Issue Quick CTA */}
              {user.role === 'Citizen' && (
                <Link
                  to="/citizen/create-complaint"
                  className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
                >
                  <PlusCircle size={16} />
                  <span>Report Issue</span>
                </Link>
              )}

              {/* Notification Bell */}
              <NotificationBell />

              {/* User Dropdown / Role Pill */}
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
                <Link
                  to={
                    user.role === 'Citizen'
                      ? '/citizen/dashboard'
                      : user.role === 'Department Officer'
                      ? '/officer/dashboard'
                      : '/admin/dashboard'
                  }
                  className="flex items-center space-x-2 text-sm text-slate-200 hover:text-white group"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500/50 transition">
                    <User size={16} />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold leading-tight">{user.name}</p>
                    <p className="text-[10px] text-indigo-400">{user.role}</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 shadow-md shadow-indigo-600/20 transition"
              >
                Register Complaint
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
