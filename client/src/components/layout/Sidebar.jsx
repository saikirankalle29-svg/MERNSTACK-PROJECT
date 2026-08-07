import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Bell,
  User,
  Settings,
  LogOut,
  Building2,
  Users,
  BarChart3,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (user?.role === 'Citizen') {
      return [
        { name: 'Dashboard', path: '/citizen/dashboard', icon: LayoutDashboard },
        { name: 'Create Complaint', path: '/citizen/create-complaint', icon: PlusCircle },
        { name: 'My Complaints', path: '/citizen/my-complaints', icon: FileText },
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings }
      ];
    }

    if (user?.role === 'Department Officer') {
      return [
        { name: 'Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
        { name: 'Assigned Complaints', path: '/officer/complaints', icon: CheckCircle2 },
        { name: 'Reports & Analytics', path: '/officer/reports', icon: BarChart3 },
        { name: 'Profile', path: '/profile', icon: User }
      ];
    }

    if (user?.role === 'Admin') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Manage Users', path: '/admin/users', icon: Users },
        { name: 'Departments', path: '/admin/departments', icon: Building2 },
        { name: 'All Complaints', path: '/admin/complaints', icon: FileText },
        { name: 'System Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Profile', path: '/profile', icon: User }
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 glass-panel border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-between p-4">
          
          {/* User Info Header */}
          <div>
            <div className="p-3 mb-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-slate-100 truncate">{user?.name}</h4>
                <span className="text-[11px] font-medium text-indigo-400 capitalize">{user?.role}</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
