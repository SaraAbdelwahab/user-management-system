import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, BadgeCheck, ArrowUpRight, Activity } from 'lucide-react';
import api from '../services/api';

/* ── Stat card ── */
const StatCard = ({ label, value, icon: Icon, accent, trend }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card hover:shadow-card-md hover:-translate-y-px transition-all duration-200">
    <div className="flex items-start justify-between mb-5">
      <div className={`w-10 h-10 ${accent.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-[18px] h-[18px] ${accent.icon}`} strokeWidth={1.8} />
      </div>
      {trend && (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
          <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
          {trend}
        </span>
      )}
    </div>
    <p className="text-[2rem] font-bold text-gray-900 tracking-[-0.03em] leading-none">
      {value ?? <span className="text-gray-300">—</span>}
    </p>
    <p className="text-[13px] text-gray-500 font-medium mt-1.5">{label}</p>
  </div>
);

/* ── Activity row ── */
const ActivityRow = ({ label, time, dot }) => (
  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
    <div className="flex items-center gap-3">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
      <p className="text-[13.5px] font-medium text-gray-800">{label}</p>
    </div>
    <p className="text-[12px] text-gray-400 group-hover:text-gray-500 transition-colors">{time}</p>
  </div>
);

/* ── Health bar ── */
const HealthBar = ({ label, status, pct, barColor, textColor }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <span className="text-[13px] font-medium text-gray-700">{label}</span>
      <span className={`text-[12px] font-semibold ${textColor}`}>{status}</span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${barColor} rounded-full transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/users/stats');
      setStats(res.data.data);
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-[2.5px] border-slate-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = stats ? [
    { label: 'Total Users',    value: stats.total,    icon: Users,      accent: { bg: 'bg-primary-50',  icon: 'text-primary-500'  }, trend: '+12%' },
    { label: 'Active Users',   value: stats.active,   icon: UserCheck,  accent: { bg: 'bg-emerald-50', icon: 'text-emerald-500' }, trend: '+8%'  },
    { label: 'Inactive Users', value: stats.inactive, icon: UserX,      accent: { bg: 'bg-amber-50',   icon: 'text-amber-500'   } },
    { label: 'Verified Users', value: stats.verified, icon: BadgeCheck, accent: { bg: 'bg-violet-50',  icon: 'text-violet-500'  } },
  ] : [];

  const activities = [
    { label: 'New user registered',  time: '2 min ago',  dot: 'bg-emerald-400' },
    { label: 'Profile updated',      time: '18 min ago', dot: 'bg-primary-400' },
    { label: 'Admin login detected', time: '1 hr ago',   dot: 'bg-violet-400'  },
    { label: 'User deactivated',     time: '3 hr ago',   dot: 'bg-amber-400'   },
    { label: 'Password changed',     time: '5 hr ago',   dot: 'bg-slate-400'   },
  ];

  const health = [
    { label: 'API Status',  status: 'Healthy', pct: 90, barColor: 'bg-emerald-500', textColor: 'text-emerald-600' },
    { label: 'Database',    status: 'Stable',  pct: 75, barColor: 'bg-primary-500', textColor: 'text-primary-600' },
    { label: 'Auth System', status: 'Secure',  pct: 95, barColor: 'bg-violet-500',  textColor: 'text-violet-600'  },
  ];

  return (
    <div className="space-y-7">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your system performance and user activity</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
          bg-emerald-50 text-emerald-700 text-[12px] font-semibold border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* ── Content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center">
                <Activity className="w-[14px] h-[14px] text-primary-500" strokeWidth={2} />
              </div>
              <h2 className="section-title">Recent Activity</h2>
            </div>
            <button className="text-[12px] font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              View all →
            </button>
          </div>
          <div className="px-3 py-3">
            {activities.map((item, i) => <ActivityRow key={i} {...item} />)}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-card">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <h2 className="section-title">System Health</h2>
          </div>
          <div className="px-6 py-5 space-y-5">
            {health.map((item) => <HealthBar key={item.label} {...item} />)}
          </div>

          {/* Uptime callout */}
          <div className="mx-4 mb-4 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <p className="text-[12px] font-semibold text-emerald-700">99.9% uptime</p>
            <p className="text-[11px] text-emerald-600 mt-0.5">All systems operational</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
