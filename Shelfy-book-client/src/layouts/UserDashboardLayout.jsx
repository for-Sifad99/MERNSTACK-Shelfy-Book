import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaTachometerAlt,
  FaBook,
  FaCog,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import useAuth from '../hooks/UseAuth';
import NotificationBell from '../components/NotificationBell';

// User dashboard layout component with enhanced security and sidebar navigation
const UserDashboardLayout = () => {
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

  // Navigation items for user dashboard
  const navItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/user-dashboard' },
    { name: 'My Library', icon: <FaBook />, path: '/user-dashboard/my-library' },
    { name: 'Profile', icon: <FaUser />, path: '/user-dashboard/profile' },
    { name: 'Settings', icon: <FaCog />, path: '/user-dashboard/settings' },
  ];

  // Helper functions to get user display information
  const getUserDisplayName = () => (user ? user.displayName || user.email || 'User' : 'User');
  const getUserEmail = () => (user?.email ? user.email : 'user@example.com');

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
        <Link
          to="/"
          className={`flex items-center p-4 border-b border-gray-700 ${
            sidebarCollapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          {!sidebarCollapsed && (
            <div className="ml-2">
              <span className="text-xl font-bold block">SHELFY</span>
              <span className="text-xs block">USER PANEL</span>
            </div>
          )}
        </Link>

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

        {/* Sign out */}
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

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white dark:bg-[var(--color-dark-secondary)] shadow-sm">
          {sidebarPosition === 'left' ? (
            <div className="flex items-center justify-between px-4 py-3">
              {/* Sidebar Toggle */}
              <button
                className="rounded-full bg-white dark:bg-gray-700 p-2 text-[var(--color-dark-secondary)] dark:text-white shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? (
                  <FaAngleDoubleRight size={18} />
                ) : (
                  <FaAngleDoubleLeft size={18} />
                )}
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
          ) : (
            <div className="flex items-center justify-between px-4 py-3">
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

              {/* Sidebar Toggle */}
              <button
                className="rounded-full bg-white dark:bg-gray-700 p-2 text-[var(--color-dark-secondary)] dark:text-white shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? (
                  <FaAngleDoubleLeft size={18} />
                ) : (
                  <FaAngleDoubleRight size={18} />
                )}
              </button>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100 dark:bg-[var(--color-bg)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
