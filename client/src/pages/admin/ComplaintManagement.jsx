import React, { useState, useEffect } from 'react';
import { getComplaintsApi, deleteComplaintApi } from '../../services/complaintService';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import StatusBadge from '../../components/ui/StatusBadge';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';
import { Search, Trash2, Eye, ShieldAlert, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [search, category, status]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await getComplaintsApi({ search, category, status });
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint? This cannot be undone.')) return;
    try {
      const res = await deleteComplaintApi(id);
      if (res.success) {
        toast.success('Complaint record deleted');
        fetchAll();
      }
    } catch (err) {
      toast.error('Failed to delete complaint');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDashboard={true} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          <div>
            <h1 className="text-2xl font-extrabold text-white">Global Complaints Oversight</h1>
            <p className="text-xs text-slate-400 mt-1">Inspect all citizen tickets, re-route departments, or remove spam</p>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search complaint..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900"
            >
              <option value="">All Categories</option>
              <option value="Road">Road</option>
              <option value="Drainage">Drainage</option>
              <option value="Garbage">Garbage</option>
              <option value="Street Light">Street Light</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Traffic">Traffic</option>
              <option value="Public Property">Public Property</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900"
            >
              <option value="">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-slate-800 overflow-x-auto">
            {loading ? (
              <Loader label="Loading all ticket records..." />
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Ticket Title</th>
                    <th className="p-3.5">Citizen</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {complaints.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3.5 font-bold text-white max-w-xs truncate">{item.title}</td>
                      <td className="p-3.5 text-slate-300">{item.citizenId?.name || 'Citizen'}</td>
                      <td className="p-3.5 text-indigo-300">{item.departmentName}</td>
                      <td className="p-3.5"><StatusBadge status={item.priority} type="priority" /></td>
                      <td className="p-3.5"><StatusBadge status={item.status} /></td>
                      <td className="p-3.5 text-right space-x-2">
                        <Link
                          to={`/citizen/complaint/${item._id}`}
                          className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 inline-flex items-center"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 inline-flex items-center"
                          title="Delete Complaint"
                        >
                          <Trash2 size={16} />
                        </button>
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

export default ComplaintManagement;
