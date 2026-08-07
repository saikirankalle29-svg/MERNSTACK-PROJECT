import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComplaintsApi } from '../../services/complaintService';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Loader from '../../components/ui/Loader';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { FileText, Clock, CheckCircle2, AlertCircle, PlusCircle, ArrowRight, Sparkles } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const CitizenDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getComplaintsApi();
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      console.error('Failed to load citizen complaints', err);
    } finally {
      setLoading(false);
    }
  };

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Submitted' || c.status === 'Assigned').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const rejected = complaints.filter((c) => c.status === 'Rejected').length;

  // Category Chart Data
  const categoriesMap = {};
  complaints.forEach((c) => {
    categoriesMap[c.category] = (categoriesMap[c.category] || 0) + 1;
  });

  const doughnutData = {
    labels: Object.keys(categoriesMap).length ? Object.keys(categoriesMap) : ['Garbage', 'Street Light', 'Water Supply'],
    datasets: [
      {
        data: Object.values(categoriesMap).length ? Object.values(categoriesMap) : [2, 1, 1],
        backgroundColor: ['#6366f1', '#38bdf8', '#10b981', '#f59e0b', '#f43f5e', '#a855f7'],
        borderColor: '#0f172a',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDashboard={true} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Citizen Command Dashboard</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Track civic issues, AI auto-routing dispatch & resolution updates.
              </p>
            </div>
            <Link
              to="/citizen/create-complaint"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center space-x-2"
            >
              <PlusCircle size={18} />
              <span>Report New Issue</span>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard title="Total Filed" value={total} icon={FileText} color="indigo" />
            <StatCard title="Pending" value={pending} icon={Clock} color="amber" />
            <StatCard title="In Progress" value={inProgress} icon={Clock} color="sky" />
            <StatCard title="Resolved" value={resolved} icon={CheckCircle2} color="emerald" />
            <StatCard title="Rejected" value={rejected} icon={AlertCircle} color="rose" />
          </div>

          {/* Charts & Highlights Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Doughnut Chart */}
            <div className="p-6 rounded-3xl glass-card border border-slate-800 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Complaints by Category</h3>
              <div className="w-48 h-48 mx-auto flex items-center justify-center">
                <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1', font: { size: 10 } } } } }} />
              </div>
            </div>

            {/* Quick Recent Activity List */}
            <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Complaints</h3>
                <Link to="/citizen/my-complaints" className="text-xs text-indigo-400 font-bold hover:underline flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {loading ? (
                <Loader label="Fetching records..." />
              ) : complaints.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No complaints filed yet. Click "Report New Issue" to get started!
                </div>
              ) : (
                <div className="space-y-3">
                  {complaints.slice(0, 4).map((item) => (
                    <Link
                      key={item._id}
                      to={`/citizen/complaint/${item._id}`}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">{item.title}</h4>
                          <StatusBadge status={item.priority} type="priority" />
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-md">{item.location}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={item.status} />
                        <span className="text-[10px] text-slate-500 block mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default CitizenDashboard;
