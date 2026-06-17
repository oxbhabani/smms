// Main app layout with sidebar navigation, top navbar, and content area

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiMenu, FiX, FiLogOut, FiUser, FiChevronDown,
  FiHome, FiTool, FiCalendar, FiClipboard, FiClock, FiActivity, FiBell
} from 'react-icons/fi';

// Reusable sidebar link item — highlights when active
const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-gray-600 hover:bg-gray-50'
      }`
    }
  >
    <Icon size={20} />
    <span>{label}</span>
  </NavLink>
);

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Toggle sidebar on mobile
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Overlay backdrop when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden off-screen on mobile, always visible on desktop */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600">SMMS</h1>
        </div>

        <nav className="mt-4 px-3 space-y-1">
          <NavItem to="/dashboard" icon={FiHome} label="Dashboard" />
          <NavItem to="/machines" icon={FiTool} label="Machines" />
          <NavItem to="/schedules" icon={FiCalendar} label="Schedules" />
          <NavItem to="/work-orders" icon={FiClipboard} label="Work Orders" />
          <NavItem to="/history" icon={FiClock} label="History" />
          <NavItem to="/logs" icon={FiActivity} label="Activity Logs" />
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top navbar with hamburger menu and user info */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiMenu size={22} />
          </button>

          <div className="flex items-center space-x-4 ml-auto">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{user?.role}</span>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page content rendered here */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
