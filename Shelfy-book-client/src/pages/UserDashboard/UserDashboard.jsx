import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaBook, FaUsers, FaChartBar, FaTachometerAlt, FaEdit, FaInfoCircle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router';
import useAuth from '../../hooks/UseAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import * as bookApis from '../../api/bookApis';

const UserDashboard = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState({
        myBooks: 0,
        borrowedBooks: 0,
        returnedBooks: 0,
        booksByCategory: []
    });
    const [recentBooks, setRecentBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch user's books
                const userBooks = await bookApis.getBooksByUser(axiosSecure, user.email);
                
                // Fetch borrowed books
                const borrowedBooks = await bookApis.getBorrowedBooksByEmail(axiosSecure, user.email);
                
                // Prepare books by category data
                const categoryCount = {};
                userBooks.books.forEach(book => {
                    categoryCount[book.category] = (categoryCount[book.category] || 0) + 1;
                });
                
                const booksByCategory = Object.entries(categoryCount).map(([category, count]) => ({
                    name: category,
                    count: count
                }));
                
                // Get recent books (limit to 5)
                const recentBooks = userBooks.books.slice(0, 5);
                
                setStats({
                    myBooks: userBooks.totalBooks,
                    borrowedBooks: borrowedBooks.length,
                    returnedBooks: 0, // This would need to be implemented based on your return tracking system
                    booksByCategory: booksByCategory
                });
                
                setRecentBooks(recentBooks);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchData();
        }
    }, [user, axiosSecure]);

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
                <title>User Dashboard - Shelfy</title>
                <meta name="description" content="User dashboard for managing your Shelfy book library" />
            </Helmet>

            <div className="space-y-6">
                {/* Welcome section */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-[var(--color-dark-secondary)] dark:text-white">
                        Welcome, {user?.displayName || user?.email}!
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Manage your book library, borrowing history, and profile settings from this centralized dashboard.
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
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">My Books</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.myBooks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                                <FaChartBar className="text-green-600 dark:text-green-300 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Borrowed Books</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.borrowedBooks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                                <FaTachometerAlt className="text-purple-600 dark:text-purple-300 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Returned Books</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.returnedBooks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                                <FaUsers className="text-orange-600 dark:text-orange-300 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Categories</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.booksByCategory.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts section - Books by Category */}
                {stats.booksByCategory.length > 0 && (
                    <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-[var(--color-dark-secondary)] dark:text-white mb-4">
                            My Books by Category
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={stats.booksByCategory}
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
                )}

                {/* Recently Added Books */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-[var(--color-dark-secondary)] dark:text-white mb-4">
                        Recently Added Books
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Book Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#1f2937] divide-y divide-gray-200 dark:divide-gray-700">
                                {recentBooks.map((book, index) => (
                                    <tr key={book._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {book.bookTitle}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {book.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            <img src={book.image} alt={book.bookTitle} className="w-10 h-10 rounded" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Link 
                                                    to={`/update-book/${book._id}`}
                                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <Link 
                                                    to={`/book-details/${book._id}`}
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                                >
                                                    <FaInfoCircle />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDashboard;