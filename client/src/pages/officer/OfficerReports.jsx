import React, { useState, useEffect } from 'react';
import { getComplaintsApi } from '../../services/complaintService';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Loader from '../../components/ui/Loader';
import { BarChart3, CheckCircle2, Clock, FileText } from 'lucide-react';

const OfficerReports = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await getComplaintsApi();
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resolved = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDashboard={true} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          <div>
            <h1 className="text-2xl font-extrabold text-white">Department Performance Reports</h1>
            <p className="text-xs text-slate-400 mt-1">Resolution metrics and SLA completion compliance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl glass-card border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Resolved Reports</span>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">{resolved}</h3>
            </div>
            <div className="p-6 rounded-3xl glass-card border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Active Maintenance</span>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{inProgress}</h3>
            </div>
            <div className="p-6 rounded-3xl glass-card border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Average Resolution SLA</span>
              <h3 className="text-3xl font-extrabold text-indigo-400 mt-1">1.8 Days</h3>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default OfficerReports;
