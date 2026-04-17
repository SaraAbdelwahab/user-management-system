import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, ChevronDown, Settings, User, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Navbar = () => {
  const { user } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="h-[60px] bg-white border-b border-slate-100 flex items-center px-6 gap-4 flex-shrink-0 z-30">

      {/* ── Search ── */}
      <div className="relative flex-1 max-w-xs">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-gray-400 pointer-events-none"
          strokeWidth={2}
        />
        <input
          type="text"
          placeholder="Search…"
          className="
            w-full pl-9 pr-4 py-2 text-[13.5px] bg-slate-50 border border-slate-200
            rounded-xl placeholder:text-gray-400 text-gray-900
            focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400
            focus:bg-white transition-all duration-150
          "
        />
      </div>

      {/* ── Right cluster ── */}
      <div className="flex items-center gap-1 ml-auto">

        {/* Bell */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-xl
            text-gray-500 hover:bg-slate-50 hover:text-gray-800 transition-colors duration-150"
          aria-label="Notifications"
        >
          <Bell className="w-[17px] h-[17px]" strokeWidth={1.8} />
          <span className="absolute top-[9px] right-[9px] w-[7px] h-[7px] bg-red-500 rounded-full ring-[1.5px] ring-white" />
        </button>

        {/* Separator */}
        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-xl
              hover:bg-slate-50 transition-colors duration-150"
          >
            {/* Avatar */}
            <div className="w-[30px] h-[30px] bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs">
              <span className="text-white text-[11px] font-bold">{initials}</span>
            </div>

            {/* Name */}
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-[13px] font-semibold text-gray-900 truncate max-w-[110px]">
                {user?.fullName || 'User'}
              </p>
              <p className="text-[11px] text-gray-400 leading-tight">
                {user?.isAdmin ? 'Administrator' : 'Member'}
              </p>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
              strokeWidth={2.5}
            />
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="
              absolute right-0 mt-2 w-52 bg-white rounded-2xl
              shadow-dropdown border border-slate-100 py-1.5 z-50
              animate-fade-in-up
            ">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-[13px] font-semibold text-gray-900 truncate">{user?.fullName}</p>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700
                    hover:bg-slate-50 transition-colors"
                >
                  <User className="w-[15px] h-[15px] text-gray-400" strokeWidth={1.8} />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700
                    hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-[15px] h-[15px] text-gray-400" strokeWidth={1.8} />
                  Settings
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => { setShowDropdown(false); useAuthStore.getState().logout(); }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px]
                    text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-[15px] h-[15px]" strokeWidth={1.8} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
