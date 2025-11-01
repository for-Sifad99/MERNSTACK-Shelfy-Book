import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaBook, FaEdit, FaInfoCircle, FaRedo } from 'react-icons/fa';
import { Link } from 'react-router';
import useAuth from '../../hooks/UseAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import * as bookApis from '../../api/bookApis';

const MyLibrary = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [addedBooks, setAddedBooks] = useState([]);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [activeTab, setActiveTab] = useState('added');
    const [loading, setLoading] = useState(true);

    // Fetch books data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch user's added books
                const userBooks = await bookApis.getBooksByUser(axiosSecure, user.email);
                setAddedBooks(userBooks.books);
                
                // Fetch user's borrowed books
                const borrowedBooks = await bookApis.getBorrowedBooksByEmail(axiosSecure, user.email);
                setBorrowedBooks(borrowedBooks);
            } catch (error) {
                console.error('Error fetching books data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchData();
        }
    }, [user, axiosSecure]);

    // Handle return book
    const handleReturnBook = async (id) => {
        if (window.confirm('Are you sure you want to return this book?')) {
            try {
                await bookApis.deleteBorrowedBook(axiosSecure, id);
                
                // Refresh borrowed books
                const borrowedBooks = await bookApis.getBorrowedBooksByEmail(axiosSecure, user.email);
                setBorrowedBooks(borrowedBooks);
                
                alert('Book returned successfully!');
            } catch (error) {
                console.error('Error returning book:', error);
                alert('Failed to return book. Please try again.');
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
                <title>My Library - Shelfy</title>
                <meta name="description" content="View and manage your added and borrowed books" />
            </Helmet>

            <div className="space-y-6">
                {/* Page header */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-[var(--color-dark-secondary)] dark:text-white">
                        My Library
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        View and manage your added books and borrowed books
                    </p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('added')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'added'
                                    ? 'border-[var(--color-primary-orange)] text-[var(--color-primary-orange)] dark:text-[var(--color-primary-orange)]'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                        >
                            Added Books
                        </button>
                        <button
                            onClick={() => setActiveTab('borrowed')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'borrowed'
                                    ? 'border-[var(--color-primary-orange)] text-[var(--color-primary-orange)] dark:text-[var(--color-primary-orange)]'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                        >
                            Borrowed Books
                        </button>
                    </nav>
                </div>

                {/* Added Books Table */}
                {activeTab === 'added' && (
                    <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-[var(--color-dark-secondary)] dark:text-white mb-4">
                            My Added Books
                        </h2>
                        {addedBooks.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Book Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Rating
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-[#1f2937] divide-y divide-gray-200 dark:divide-gray-700">
                                        {addedBooks.map((book) => (
                                            <tr key={book._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {book.bookTitle}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {book.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {book.rating}
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
                        ) : (
                            <div className="text-center py-12">
                                <FaBook className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No books added</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    You haven't added any books yet.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        to="/add-Books"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--color-primary-orange)] hover:bg-[#e65100] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-orange)]"
                                    >
                                        Add a Book
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Borrowed Books Table */}
                {activeTab === 'borrowed' && (
                    <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-[var(--color-dark-secondary)] dark:text-white mb-4">
                            My Borrowed Books
                        </h2>
                        {borrowedBooks.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Book Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Author Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Rating
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-[#1f2937] divide-y divide-gray-200 dark:divide-gray-700">
                                        {borrowedBooks.map((book) => (
                                            <tr key={book._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {book.bookTitle}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {book.authorName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {book.rating}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {book.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleReturnBook(book._id)}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 flex items-center"
                                                    >
                                                        <FaRedo className="mr-1" /> Return
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FaBook className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No borrowed books</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    You haven't borrowed any books yet.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        to="/all-books"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--color-primary-orange)] hover:bg-[#e65100] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-orange)]"
                                    >
                                        Browse Books
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyLibrary;