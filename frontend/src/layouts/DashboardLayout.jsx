import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Navbar from '../components/ui/Navbar';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen flex bg-[#0b0f19] text-white overflow-hidden">

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Navbar */}
        <Navbar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-8 py-6 bg-[#0b0f19]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;