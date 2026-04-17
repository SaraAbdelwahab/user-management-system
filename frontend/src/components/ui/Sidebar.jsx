import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Sidebar = ({ collapsed = false, onToggle }) => {
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users',     href: '/users',     icon: Users,            adminOnly: true },
    { name: 'Profile',   href: '/profile',   icon: User },
    { name: 'Settings',  href: '/settings',  icon: Settings },
  ];

  const filtered = navItems.filter((item) => !item.adminOnly || user?.isAdmin);

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <aside
      className={`
        relative h-full bg-white flex flex-col flex-shrink-0
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        shadow-sidebar border-r border-slate-100
        ${collapsed ? 'w-[68px]' : 'w-[220px]'}
      `}
    >
      {/* ── Brand ── */}
      <div
        className={`
          flex items-center h-[60px] px-4 border-b border-slate-100 flex-shrink-0
          ${collapsed ? 'justify-center' : 'gap-3'}
        `}
      >
        <div className="w-8 h-8 bg-primary-500 rounded-[10px] flex items-center justify-center flex-shrink-0 shadow-btn-primary">
          <Zap className="w-[15px] h-[15px] text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="text-[15px] font-semibold text-gray-900 tracking-[-0.02em] truncate">
            UserFlow
          </span>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {/* Nav group label */}
        {!collapsed && (
          <p className="label-caps px-2.5 mb-2 mt-1">Menu</p>
        )}

        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) => `
                flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-[13.5px] font-medium
                transition-all duration-150 group relative
                ${collapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-500 hover:bg-slate-50 hover:text-gray-800'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  {isActive && !collapsed && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary-500 rounded-r-full" />
                  )}
                  <Icon
                    className={`flex-shrink-0 transition-colors
                      ${collapsed ? 'w-5 h-5' : 'w-[17px] h-[17px]'}
                      ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-600'}
                    `}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="border-t border-slate-100 p-2.5 space-y-0.5 flex-shrink-0">
        {/* User row */}
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl mb-0.5">
            <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs">
              <span className="text-white text-[11px] font-bold">{initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-gray-900 truncate leading-tight">
                {user?.fullName}
              </p>
              <p className="text-[11px] text-gray-400 truncate leading-tight">
                {user?.isAdmin ? 'Administrator' : 'Member'}
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          title={collapsed ? 'Sign out' : undefined}
          className={`
            flex items-center gap-3 w-full px-2.5 py-2.5 text-[13.5px] font-medium
            text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600
            transition-all duration-150 group
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut
            className={`flex-shrink-0 group-hover:text-red-500 transition-colors
              ${collapsed ? 'w-5 h-5' : 'w-[17px] h-[17px]'}
            `}
            strokeWidth={1.8}
          />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={onToggle}
        className="
          absolute -right-[13px] top-[72px] z-20
          w-[26px] h-[26px] bg-white border border-slate-200 rounded-full
          flex items-center justify-center
          shadow-card hover:shadow-card-md hover:border-primary-300
          transition-all duration-200
        "
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3 text-gray-500" strokeWidth={2.5} />
          : <ChevronLeft  className="w-3 h-3 text-gray-500" strokeWidth={2.5} />
        }
      </button>
    </aside>
  );
};

export default Sidebar;
