import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Sidebar = ({ collapsed = false }) => {
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users, adminOnly: true },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || user?.isAdmin
  );

  return (
    <div
      className={`h-full bg-[#0f172a] border-r border-white/10 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-white/10">
        {!collapsed ? (
          <h1 className="text-lg font-semibold text-white tracking-tight">
            ⚡ UserFlow
          </h1>
        ) : (
          <div className="w-8 h-8 bg-indigo-500 rounded-lg mx-auto" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />

              {!collapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-400 rounded-xl hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;