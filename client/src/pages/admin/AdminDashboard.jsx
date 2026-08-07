import React, { useState, useEffect } from 'react';
import { getAdminStatsApi } from '../../services/adminService';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import StatCard from '../../components/ui/StatCard';
import Loader from '../../components/ui/Loader';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Users, FileText, CheckCircle2, Clock, Building2, TrendingUp, ShieldAlert } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await getAdminStatsApi();
      if (res.success) {
        setStats(res.stats);
        setCharts(res.charts);
      }
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Loader label="Gathering municipal analytics & stats..." />
      </div>
    );
  }

  const categoryLabels = charts?.categoryStats?.map((c) => c._id) || ['Garbage', 'Street Light', 'Road', 'Water Supply'];
  const categoryCounts = charts?.categoryStats?.map((c) => c.count) || [4, 3, 2, 2];

  const categoryData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Total Complaints',
        data: categoryCounts,
        backgroundColor: ['#6366f1', '#38bdf8', '#10b981', '#f59e0b', '#f43f5e', '#a855f7'],
        borderRadius: 8
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDashboard={true} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldAlert size={16} />
              <span>Super Administrator Command Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Analytics & Controls</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Global civic complaint metrics, department oversight & user access control.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Registered Users" value={stats?.totalUsers || 0} icon={Users} color="indigo" />
            <StatCard title="Active Departments" value={stats?.totalDepartments || 0} icon={Building2} color="sky" />
            <StatCard title="Total Complaints" value={stats?.totalComplaints || 0} icon={FileText} color="amber" />
            <StatCard title="Global Resolution Rate" value={`${stats?.resolutionRate || 0}%`} icon={CheckCircle2} color="emerald" />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Bar Chart */}
            <div className="p-6 rounded-3xl glass-card border border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Complaint Volume by Category Sector</h3>
              <div className="h-64">
                <Bar
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
                      y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
                    }
                  }}
                />
              </div>
            </div>

            {/* Department Breakdown list */}
            <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Department Resolution Efficiency</h3>
              <div className="space-y-3">
                {charts?.departmentStats?.map((dept, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-white">{dept._id}</h4>
                      <p className="text-[11px] text-slate-400">{dept.count} total tickets</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-400">{dept.resolved} Resolved</span>
                      <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${dept.count > 0 ? (dept.resolved / dept.count) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
