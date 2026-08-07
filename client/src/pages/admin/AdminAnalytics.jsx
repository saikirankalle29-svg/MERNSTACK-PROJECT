import React, { useState, useEffect } from 'react';
import { getAdminStatsApi } from '../../services/adminService';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Loader from '../../components/ui/Loader';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { BarChart3, TrendingUp, ShieldCheck } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getAdminStatsApi();
      if (res.success) {
        setStats(res.stats);
        setCharts(res.charts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Loader label="Loading system intelligence metrics..." />
      </div>
    );
  }

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Filed Complaints Trend',
        data: [12, 19, 15, 25, 22, 30, stats?.totalComplaints || 35],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDashboard={true} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          <div>
            <h1 className="text-2xl font-extrabold text-white">System Analytics & Trends</h1>
            <p className="text-xs text-slate-400 mt-1">Analytical models for municipal planning & resolution speed</p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Monthly Incident Inflow Trend</h3>
            <div className="h-72">
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
                  }
                }}
              />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;
