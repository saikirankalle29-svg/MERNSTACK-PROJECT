import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComplaintsApi } from '../../services/complaintService';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import StatusBadge from '../../components/ui/StatusBadge';
import Loader from '../../components/ui/Loader';
import { Search, Filter, PlusCircle, Calendar, MapPin, Eye, ArrowUpDown } from 'lucide-react';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [search, category, status, priority]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getComplaintsApi({ search, category, status, priority });
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDashboard={true} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white">My Complaints History</h1>
              <p className="text-xs text-slate-400 mt-1">Review live resolution progress & officer action logs</p>
            </div>
            <Link
              to="/citizen/create-complaint"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-2 shrink-0"
            >
              <PlusCircle size={16} />
              <span>Report Issue</span>
            </Link>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search complaint title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            {/* Category Filter */}
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

            {/* Status Filter */}
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

            {/* Priority Filter */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

          </div>

          {/* Table Container */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 overflow-x-auto">
            {loading ? (
              <Loader label="Loading complaint catalog..." />
            ) : complaints.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No matching complaints found.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Complaint Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Filed On</th>
                    <th className="p-3.5 text-right rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {complaints.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3.5 font-bold text-white max-w-xs truncate">{item.title}</td>
                      <td className="p-3.5 font-medium text-slate-300">{item.category}</td>
                      <td className="p-3.5 text-indigo-300">{item.departmentName}</td>
                      <td className="p-3.5"><StatusBadge status={item.priority} type="priority" /></td>
                      <td className="p-3.5"><StatusBadge status={item.status} /></td>
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          to={`/citizen/complaint/${item._id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-[11px] transition"
                        >
                          <Eye size={14} />
                          <span>Track Details</span>
                        </Link>
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

export default MyComplaints;
