import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfileApi } from '../../services/authService';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, ShieldCheck, Save, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await updateProfileApi(formData);
      if (res.success) {
        setUser(res.user);
        toast.success('Profile information updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDashboard={true} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-6 sm:p-8 max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-white">Account Profile</h1>
            <p className="text-xs text-slate-400 mt-1">Manage your identity and contact parameters</p>
          </div>

          <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
            
            {/* Header Badge */}
            <div className="flex items-center space-x-4 pb-6 border-b border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-2xl">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{user?.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {user?.role}
                  </span>
                  <span className="text-xs text-slate-400">{user?.email}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs bg-slate-900/80 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Locality / Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street / Colony / Landmark"
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-2"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                <span>Save Changes</span>
              </button>
            </form>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
