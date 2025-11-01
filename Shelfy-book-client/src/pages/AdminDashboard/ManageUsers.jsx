import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaUsers, FaSearch, FaFilter, FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import * as userApis from '../../api/userApis';
import useAuth from '../../hooks/UseAuth';
import { useNavigate } from 'react-router';

// Admin component to manage users with search, filter, and pagination
const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch all users from the database
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const usersData = await userApis.getAllUsers(axiosSecure);
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Show user-friendly error message
            alert('Failed to fetch users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle search and filter
    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter ? u.role === roleFilter : true;
        return matchesSearch && matchesRole;
    });

    // Get current users for pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle delete user with confirmation
    const handleDeleteUser = async (email) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone. All books added by this user will also be deleted.')) {
            try {
                await userApis.deleteUser(axiosSecure, email);
                // Refresh the user list
                fetchUsers();
                alert('User deleted successfully');
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user. Please try again.');
            }
        }
    };

    // Handle make admin with confirmation
    const handleMakeAdmin = async (email) => {
        if (window.confirm('Are you sure you want to make this user an admin?')) {
            try {
                // First, make the selected user an admin
                await userApis.updateUser(axiosSecure, email, { role: 'admin' });
                
                // Then, if the current user is making themselves not an admin, 
                // update their role to user and redirect them
                if (user.email === email) {
                    await userApis.updateUser(axiosSecure, user.email, { role: 'user' });
                    // Refresh the user list
                    fetchUsers();
                    // Small delay to ensure the database update is processed
                    setTimeout(() => {
                        // Dispatch role change event
                        window.dispatchEvent(new Event('roleChange'));
                        // Redirect to user dashboard
                        navigate('/user-dashboard');
                    }, 500);
                    return;
                }
                
                // Dispatch role change event for other users
                window.dispatchEvent(new Event('roleChange'));
                
                // Refresh the user list
                fetchUsers();
                alert('User role updated to admin successfully');
            } catch (error) {
                console.error('Error updating user role:', error);
                alert('Failed to update user role. Please try again.');
            }
        }
    };

    // Handle remove admin with confirmation
    const handleRemoveAdmin = async (email) => {
        if (window.confirm('Are you sure you want to remove admin privileges from this user?')) {
            try {
                // Update the user's role to user
                await userApis.updateUser(axiosSecure, email, { role: 'user' });
                
                // If the current user is removing their own admin privileges,
                // redirect them to user dashboard
                if (user.email === email) {
                    // Refresh the user list
                    fetchUsers();
                    // Small delay to ensure the database update is processed
                    setTimeout(() => {
                        // Dispatch role change event
                        window.dispatchEvent(new Event('roleChange'));
                        // Redirect to user dashboard
                        navigate('/user-dashboard');
                    }, 500);
                    return;
                }
                
                // Dispatch role change event for other users
                window.dispatchEvent(new Event('roleChange'));
                
                // Refresh the user list
                fetchUsers();
                alert('Admin role removed successfully');
            } catch (error) {
                console.error('Error removing admin role:', error);
                alert('Failed to remove admin role. Please try again.');
            }
        }
    };

    // Show loading indicator while fetching users
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary-orange)]"></div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Manage Users - Shelfy Admin</title>
                <meta name="description" content="Manage all users in the Shelfy system" />
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--color-dark-secondary)] dark:text-white">
                                Manage Users
                            </h1>
                            <p className="mt-1 text-gray-600 dark:text-gray-300">
                                Total users: {users.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-dark-secondary)] focus:border-transparent dark:bg-[#1f2937] dark:text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaFilter className="text-gray-400" />
                            </div>
                            <select
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-dark-secondary)] focus:border-transparent dark:bg-[#1f2937] dark:text-white"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        
                        <button
                            onClick={fetchUsers}
                            className="bg-[var(--color-dark-secondary)] hover:bg-[#024a66] text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#1f2937] divide-y divide-gray-200 dark:divide-gray-700">
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((user) => (
                                        <tr key={user.email} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {user.photo ? (
                                                            <img className="h-10 w-10 rounded-full" src={user.photo} alt={user.name} onError={(e) => { e.target.src = 'https://placehold.co/40x40'; }} />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-[var(--color-primary-orange)] flex items-center justify-center text-white">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.role === 'admin' 
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' 
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                                                }`}>
                                                    {user.role === 'admin' ? 'Admin' : 'User'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {user.role === 'admin' ? (
                                                        <button
                                                            onClick={() => handleRemoveAdmin(user.email)}
                                                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                            title="Remove Admin"
                                                        >
                                                            <FaUser />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleMakeAdmin(user.email)}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                            title="Make Admin"
                                                        >
                                                            <FaUserShield />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteUser(user.email)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 text-sm rounded-md ${
                                        currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-4 py-2 text-sm rounded-md ${
                                            currentPage === i + 1
                                                ? 'bg-[var(--color-dark-secondary)] text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 text-sm rounded-md ${
                                        currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageUsers;