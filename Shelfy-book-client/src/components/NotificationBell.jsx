import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { useSocket } from '../contexts/SocketContext';

const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications, isAdmin } = useSocket();
    const [isOpen, setIsOpen] = useState(false);
    const notificationRef = useRef(null);

    // For now, show notification bell for all users during testing
    // In a real app, you would uncomment the line below to restrict to admin only
    // if (!isAdmin) {
    //     return null;
    // }

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Mark all as read when opening notifications
    const handleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            markAllAsRead();
        }
    };

    // Mark individual notification as read
    const handleMarkAsRead = (id) => {
        markAsRead(id);
    };

    // Clear all notifications
    const handleClearAll = () => {
        clearNotifications();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={notificationRef}>
            <button 
                onClick={handleOpen}
                className="relative text-[var(--color-dark-secondary)] dark:text-white"
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#343a46] shadow-lg rounded-md z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleClearAll}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {notifications.map((notification) => (
                                    <li 
                                        key={notification.id} 
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                {notification.type === 'rating' && (
                                                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                                                        <FaBell className="text-yellow-600 dark:text-yellow-300" />
                                                    </div>
                                                )}
                                                {notification.type === 'comment' && (
                                                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                                                        <FaBell className="text-green-600 dark:text-green-300" />
                                                    </div>
                                                )}
                                                {notification.type === 'book' && (
                                                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                                                        <FaBell className="text-blue-600 dark:text-blue-300" />
                                                    </div>
                                                )}
                                                {notification.type === 'borrow' && (
                                                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                                                        <FaBell className="text-purple-600 dark:text-purple-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(notification.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                No notifications
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;