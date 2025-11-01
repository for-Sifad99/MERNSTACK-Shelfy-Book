import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaSun, FaMoon, FaLanguage, FaPalette, FaArrowsAltH } from 'react-icons/fa';

const Settings = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });
    const [language, setLanguage] = useState('en');
    const [sidebarPosition, setSidebarPosition] = useState('left');

    // Initialize theme and sidebar position from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedPosition = localStorage.getItem('sidebarPosition') || 'left';
        
        setTheme(savedTheme);
        setSidebarPosition(savedPosition);
        
        // Apply theme
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    // Handle theme change
    const handleThemeChange = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    // Handle language change
    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    // Handle sidebar position change
    const handleSidebarPositionChange = (position) => {
        setSidebarPosition(position);
        localStorage.setItem('sidebarPosition', position);
        // Dispatch a custom event to notify the layout component
        window.dispatchEvent(new CustomEvent('sidebarPositionChange', { detail: position }));
    };

    return (
        <>
            {/* Helmet for SEO */}
            <Helmet>
                <title>Settings - Shelfy Admin</title>
                <meta name="description" content="Admin settings for Shelfy book library" />
            </Helmet>

            <div className="space-y-6">
                {/* Page header */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-[var(--color-dark-secondary)] dark:text-white">
                        Settings
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Manage your admin dashboard preferences
                    </p>
                </div>

                {/* Theme settings */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-[var(--color-dark-secondary)] dark:text-white mb-4">
                        Theme Settings
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FaPalette className="text-[var(--color-primary-orange)] mr-3" />
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Switch between light and dark themes
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleThemeChange}
                                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <span
                                    className={`${
                                        theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                >
                                    {theme === 'dark' ? (
                                        <FaMoon className="text-gray-800 mt-0.5 ml-0.5" size={10} />
                                    ) : (
                                        <FaSun className="text-yellow-500 mt-0.5 ml-0.5" size={10} />
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Layout settings */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-[var(--color-dark-secondary)] dark:text-white mb-4">
                        Layout Settings
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FaArrowsAltH className="text-[var(--color-primary-orange)] mr-3" />
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Sidebar Position</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Choose sidebar position (Left or Right)
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleSidebarPositionChange('left')}
                                    className={`px-4 py-2 text-sm rounded-md ${
                                        sidebarPosition === 'left'
                                            ? 'bg-[var(--color-primary-orange)] text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    Left
                                </button>
                                <button
                                    onClick={() => handleSidebarPositionChange('right')}
                                    className={`px-4 py-2 text-sm rounded-md ${
                                        sidebarPosition === 'right'
                                            ? 'bg-[var(--color-primary-orange)] text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    Right
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;