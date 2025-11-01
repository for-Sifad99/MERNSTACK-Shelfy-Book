import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import {
  FaChevronLeft,
  FaChevronRight,
  FaTachometerAlt,
  FaBook,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import useAuth from '../hooks/UseAuth';
import NotificationBell from '../components/NotificationBell';

// Admin dashboard layout component with enhanced security and sidebar navigation
const AdminDashboardLayout = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState(() => {
    return localStorage.getItem('sidebarPosition') || 'left';
  });

  useEffect(() => {
    const handlePositionChange = (e) => {
      setSidebarPosition(e.detail);
    };
    window.addEventListener('sidebarPositionChange', handlePositionChange);
    return () => {
      window.removeEventListener('sidebarPositionChange', handlePositionChange);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      // Redirect to login page after successful sign out
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Navigation items for admin dashboard
  const navItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/admin-dashboard' },
    { name: 'Manage Books', icon: <FaBook />, path: '/admin-dashboard/manage-books' },
    { name: 'Manage Users', icon: <FaUsers />, path: '/admin-dashboard/manage-users' },
    { name: 'Profile', icon: <FaUser />, path: '/admin-dashboard/profile' },
    { name: 'Settings', icon: <FaCog />, path: '/admin-dashboard/settings' },
  ];

  // Helper functions to get user display information
  const getUserDisplayName = () => (user ? user.displayName || user.email || 'Admin' : 'Admin');
  const getUserEmail = () => (user?.email ? user.email : 'admin@example.com');

  return (
    <div
      className={`flex h-screen bg-gray-100 dark:bg-[var(--color-bg)] ${
        sidebarPosition === 'right' ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          style={{ overflow: 'hidden' }}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 ${
          sidebarPosition === 'left' ? 'left-0' : 'right-0'
        } z-50 bg-[var(--color-dark-secondary)] text-white transform transition-all duration-300 ease-in-out 
                lg:translate-x-0 lg:static lg:inset-0
                ${
                  sidebarOpen
                    ? 'translate-x-0'
                    : sidebarPosition === 'left'
                    ? '-translate-x-full'
                    : 'translate-x-full'
                }`}
        style={{
          width: sidebarCollapsed ? '80px' : '256px',
          overflow: 'hidden',
        }}
      >
        {/* Logo Section */}
        <div
          className={`flex items-center p-4 border-b border-gray-700 ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
        >
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            {!sidebarCollapsed && (
              <div className="ml-2">
                <span className="text-xl font-bold block">SHELFY</span>
                <span className="text-xs block">ADMIN PANEL</span>
              </div>
            )}
          </Link>
        </div>

        {!sidebarCollapsed && (
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Navigation
          </div>
        )}

        {/* Sidebar Nav */}
        <nav className="mt-2">
          <ul>
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index} className="mb-1">
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      sidebarCollapsed ? 'justify-center' : 'justify-start'
                    } ${
                      isActive
                        ? 'bg-[var(--color-primary-orange)] text-white'
                        : 'text-gray-300 hover:bg-[var(--color-primary-orange)] hover:text-white'
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    <span
                      className={`text-lg flex-shrink-0 flex items-center justify-center ${
                        sidebarCollapsed ? '' : 'mr-3'
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!sidebarCollapsed && <span className="flex-grow text-left truncate">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button
            onClick={handleSignOut}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              sidebarCollapsed ? 'justify-center' : 'justify-start'
            } text-white hover:bg-red-600`}
            style={{ borderRadius: 0 }}
          >
            <FaSignOutAlt className={`text-lg flex-shrink-0 ${sidebarCollapsed ? '' : 'mr-3'}`} />
            {!sidebarCollapsed && <span className="flex-grow text-left">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white dark:bg-[var(--color-dark-secondary)] shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Sidebar Toggle */}
            <button
              className="rounded-full bg-white dark:bg-gray-700 p-2 text-[var(--color-dark-secondary)] dark:text-white shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <FaChevronRight size={18} /> : <FaChevronLeft size={18} />}
            </button>

            {/* Notification & Profile */}
            <div className="flex items-center space-x-4">
              <NotificationBell />
                            
              <div className="flex items-center space-x-2">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary-orange)] flex items-center justify-center text-white">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-[var(--color-dark-secondary)] dark:text-white">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">{getUserEmail()}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-[#1a1d24]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
