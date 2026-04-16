import { useEffect, useState } from 'react';
import api from '../services/api';



const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/users/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  <div className="text-6xl text-red-600 font-bold">
  STRIPE UI LOADED
</div>

  const statCards = stats
    ? [
        { label: 'Total Users', value: stats.total, color: 'bg-blue-500' },
        { label: 'Active Users', value: stats.active, color: 'bg-green-500' },
        { label: 'Inactive Users', value: stats.inactive, color: 'bg-yellow-500' },
        { label: 'Verified Users', value: stats.verified, color: 'bg-purple-500' },
      ]
    : [];

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Overview of your system performance and user activity
          </p>
        </div>

        <div className="px-4 py-2 rounded-full bg-black text-white text-sm shadow-sm">
          Live System
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{stat.label}</p>

              <span className={`w-2.5 h-2.5 rounded-full ${stat.color}`} />
            </div>

            <div className="mt-4 flex items-end justify-between">
              <h2 className="text-3xl font-semibold text-gray-900">
                {stat.value}
              </h2>

              <div className="text-xs text-gray-400 group-hover:text-gray-600 transition">
                +12% this week
              </div>
            </div>

            {/* subtle progress bar */}
            <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gray-900 rounded-full" />
            </div>
          </div>
        ))}

      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ACTIVITY CARD */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>

            <button className="text-sm text-gray-500 hover:text-gray-900">
              View all
            </button>
          </div>

          <div className="space-y-4">

            {['User created', 'Profile updated', 'New login', 'User deleted'].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item}
                  </p>
                  <p className="text-xs text-gray-500">
                    Just now
                  </p>
                </div>

                <div className="w-2 h-2 rounded-full bg-gray-300" />
              </div>
            ))}

          </div>
        </div>

        {/* SIDEBAR PANEL */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            System Health
          </h2>

          <div className="space-y-4">

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">API Status</span>
                <span className="text-green-600">Healthy</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-[90%] bg-green-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Database</span>
                <span className="text-blue-600">Stable</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-[75%] bg-blue-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Auth System</span>
                <span className="text-purple-600">Secure</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-[95%] bg-purple-500 rounded-full" />
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;