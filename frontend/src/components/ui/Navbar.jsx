import { useEffect, useRef, useState } from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Sidebar toggle + Search */}
          <div className="flex items-center gap-3 flex-1">
            
            {/* Sidebar toggle button */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                ☰
              </button>
            )}

            {/* Search */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* Right: Notifications + User */}
          <div className="flex items-center gap-3">

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-xl transition"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>

                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email}
                  </p>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    showDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Profile
                  </a>

                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Settings
                  </a>

                  <div className="my-1 border-t border-gray-100" />

                  <button
                    onClick={() =>
                      useAuthStore.getState().logout()
                    }
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;