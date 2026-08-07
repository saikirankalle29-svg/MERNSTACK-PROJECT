import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComplaintsApi } from '../../services/complaintService';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Loader from '../../components/ui/Loader';
import { CheckCircle2, Clock, FileText, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const OfficerDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchOfficerData();
  }, []);

  const fetchOfficerData = async () => {
    try {
      const res = await getComplaintsApi();
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      console.error('Failed to load officer complaints', err);
    } finally {
      setLoading(false);
    }
  };

  const assigned = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Submitted' || c.status === 'Assigned').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const completed = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDashboard={true} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                <ShieldCheck size={16} />
                <span>Department Officer Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Officer Workstation</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Manage assigned municipal tickets, update resolution status & upload proof evidence.
              </p>
            </div>
            <Link
              to="/officer/complaints"
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center space-x-2"
            >
              <CheckCircle2 size={18} />
              <span>Manage Assigned Queue</span>
            </Link>
          </div>

          {/* Officer Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Assigned" value={assigned} icon={FileText} color="indigo" />
            <StatCard title="Pending Action" value={pending} icon={Clock} color="amber" />
            <StatCard title="Work In Progress" value={inProgress} icon={Clock} color="sky" />
            <StatCard title="Completed" value={completed} icon={CheckCircle2} color="emerald" />
          </div>

          {/* Assigned Queue Quick List */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Department Tickets</h3>
              <Link to="/officer/complaints" className="text-xs text-indigo-400 font-bold hover:underline flex items-center space-x-1">
                <span>View Full Queue</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <Loader label="Fetching assigned tickets..." />
            ) : complaints.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No tickets currently assigned to your department queue.
              </div>
            ) : (
              <div className="space-y-3">
                {complaints.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-white">{item.title}</h4>
                        <StatusBadge status={item.priority} type="priority" />
                      </div>
                      <p className="text-[11px] text-slate-400">{item.location} • Filed by {item.citizenId?.name || 'Citizen'}</p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <StatusBadge status={item.status} />
                      <Link
                        to="/officer/complaints"
                        className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-[11px]"
                      >
                        Action Ticket
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default OfficerDashboard;
