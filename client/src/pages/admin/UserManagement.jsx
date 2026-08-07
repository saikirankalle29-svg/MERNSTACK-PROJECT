import React, { useState, useEffect } from 'react';
import { getUsersApi, updateUserRoleApi } from '../../services/adminService';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';
import { Search, Shield, User, Edit, Building2 } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsersApi({ search, role: roleFilter });
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      toast.error('Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await updateUserRoleApi(userId, { role: newRole });
      if (res.success) {
        toast.success(`User role updated to ${newRole}`);
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDashboard={true} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          <div>
            <h1 className="text-2xl font-extrabold text-white">System User Management</h1>
            <p className="text-xs text-slate-400 mt-1">Manage accounts, assign department officer privileges & roles</p>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900"
            >
              <option value="">All System Roles</option>
              <option value="Citizen">Citizen</option>
              <option value="Department Officer">Department Officer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-slate-800 overflow-x-auto">
            {loading ? (
              <Loader label="Loading user registry..." />
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">User Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Current Role</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5 text-right rounded-r-xl">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3.5 font-bold text-white">{item.name}</td>
                      <td className="p-3.5 text-slate-300">{item.email}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {item.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">{item.phone || '-'}</td>
                      <td className="p-3.5 text-right">
                        <select
                          value={item.role}
                          onChange={(e) => handleRoleChange(item._id, e.target.value)}
                          className="px-2.5 py-1 rounded-xl glass-input text-xs bg-slate-900 border border-slate-700"
                        >
                          <option value="Citizen">Citizen</option>
                          <option value="Department Officer">Department Officer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default UserManagement;
