import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaBook, FaUsers, FaChartBar, FaTachometerAlt, FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import * as bookApis from '../../api/bookApis';
import * as userApis from '../../api/userApis';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUniqueBooks: 0,
        totalStock: 0,
        totalBorrowed: 0,
        booksByCategory: []
    });
    const [users, setUsers] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    // Fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch books statistics
                const booksStats = await bookApis.getBooksStatistics(axiosSecure);
                
                // Fetch all users
                const usersData = await userApis.getAllUsers(axiosSecure);
                
                // Fetch top users by books added
                const topUsersData = await bookApis.getTopUsersByBooks(axiosSecure);
                
                setStats(booksStats);
                setUsers(usersData);
                setTopUsers(topUsersData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [axiosSecure]);

    // Prepare data for charts
    const prepareChartData = () => {
        // Books by category data
        const categoryData = stats.booksByCategory.map(item => ({
            name: item._id,
            count: item.count
        }));

        return { categoryData };
    };

    const { categoryData } = prepareChartData();

    // Handle delete user
    const handleDeleteUser = async (email) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                // Delete user from database
                await userApis.deleteUser(axiosSecure, email);
                
                // Refresh the user lists
                const usersData = await userApis.getAllUsers(axiosSecure);
                const topUsersData = await bookApis.getTopUsersByBooks(axiosSecure);
                
                setUsers(usersData);
                setTopUsers(topUsersData);
                
                alert('User deleted successfully');
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    // Handle make admin
    const handleMakeAdmin = async (email) => {
        if (window.confirm('Are you sure you want to make this user an admin? The current admin will be changed to a regular user.')) {
            try {
                // First, find the current admin
                const currentAdmin = users.find(user => user.role === 'admin');
                
                // If there's a current admin, change their role to user
                if (currentAdmin && currentAdmin.email !== email) {
                    await userApis.updateUser(axiosSecure, currentAdmin.email, { role: 'user' });
                }
                
                // Make the selected user an admin
                await userApis.updateUser(axiosSecure, email, { role: 'admin' });
                
                // Refresh the user lists
                const usersData = await userApis.getAllUsers(axiosSecure);
                const topUsersData = await bookApis.getTopUsersByBooks(axiosSecure);
                
                setUsers(usersData);
                setTopUsers(topUsersData);
                
                alert('User role updated successfully');
            } catch (error) {
                console.error('Error updating user role:', error);
                alert('Failed to update user role: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    // Handle remove admin role
    const handleRemoveAdmin = async (email) => {
        if (window.confirm('Are you sure you want to remove admin privileges from this user?')) {
            try {
                // Remove admin role and set to regular user
                await userApis.updateUser(axiosSecure, email, { role: 'user' });
                
                // Refresh the user lists
                const usersData = await userApis.getAllUsers(axiosSecure);
                const topUsersData = await bookApis.getTopUsersByBooks(axiosSecure);
                
                setUsers(usersData);
                setTopUsers(topUsersData);
                
                alert('Admin role removed successfully');
            } catch (error) {
                console.error('Error removing admin role:', error);
                alert('Failed to remove admin role: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary-orange)]"></div>
            </div>
        );
    }

    return (
        <>
            {/* Helmet for SEO */}
            <Helmet>
                <title>Admin Dashboard - Shelfy</title>
                <meta name="description" content="Admin dashboard for managing Shelfy book library" />
            </Helmet>

            <div className="space-y-6">
                {/* Welcome section */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-[var(--color-dark-secondary)] dark:text-white">
                        Welcome to Admin Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Manage your book library, users, and analytics from this centralized dashboard.
                    </p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                                <FaBook className="text-blue-600 dark:text-blue-300 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Books</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBooks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                                <FaUsers className="text-green-600 dark:text-green-300 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                                <FaChartBar className="text-yellow-600 dark:text-yellow-300 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Borrowed Books</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBorrowed}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                                <FaTachometerAlt className="text-purple-600 dark:text-purple-300 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Books in Stock</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStock}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts section - Only Books by Category */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Books by Category - Bar Chart */}
                    <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-[var(--color-dark-secondary)] dark:text-white mb-4">
                            Books by Category
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={categoryData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" name="Books Count" fill="#036280" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Users by Books Added - Table Format */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-[var(--color-dark-secondary)] dark:text-white mb-4">
                        Top Users by Books Added
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Photo</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Books Count</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#1f2937] divide-y divide-gray-200 dark:divide-gray-700">
                                {topUsers.length > 0 ? (
                                    topUsers.map((user, index) => {
                                        // Find user details from the users array
                                        const userDetails = users.find(u => u.email === user._id);
                                        
                                        return (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {userDetails?.photo ? (
                                                            <img className="h-10 w-10 rounded-full" src={userDetails.photo} alt={userDetails?.name || user.authorName} />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-[var(--color-primary-orange)] flex items-center justify-center text-white">
                                                                {(userDetails?.name || user.authorName || user._id)?.charAt(0)?.toUpperCase() || 'U'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {userDetails?.name || user.authorName || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {user._id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {user.booksCount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        userDetails?.role === 'admin' 
                                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' 
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                                                    }`}>
                                                        {userDetails?.role === 'admin' ? 'Admin' : 'User'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        {userDetails?.role === 'admin' ? (
                                                            <button 
                                                                onClick={() => handleRemoveAdmin(user._id)}
                                                                className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                                                                title="Remove Admin"
                                                            >
                                                                <FaUser />
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                onClick={() => handleMakeAdmin(user._id)}
                                                                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                                                title="Make Admin"
                                                            >
                                                                <FaUserShield />
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No user data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;