import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaBook, FaSearch, FaFilter, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import * as bookApis from '../../api/bookApis';
import { useNavigate } from 'react-router';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);
    const [categories, setCategories] = useState([]);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // Fetch books
    const fetchBooks = async (page = 1, category = '', search = '') => {
        try {
            setLoading(true);
            const result = await bookApis.getAllBooks(axiosSecure, category, page, 10);
            
            setBooks(result.books);
            setTotalPages(result.totalPages);
            setTotalBooks(result.totalBooks);
            setCurrentPage(result.currentPage);
            
            // Extract unique categories
            const uniqueCategories = [...new Set(result.books.map(book => book.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchBooks();
    }, []);

    // Handle search
    const handleSearch = () => {
        fetchBooks(1, categoryFilter, searchTerm);
    };

    // Handle page change
    const handlePageChange = (page) => {
        fetchBooks(page, categoryFilter, searchTerm);
    };

    // Handle delete book
    const handleDeleteBook = async (id) => {
        if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
            try {
                await bookApis.deleteBook(axiosSecure, id);
                // Refresh the book list
                fetchBooks(currentPage, categoryFilter, searchTerm);
                alert('Book deleted successfully');
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Failed to delete book');
            }
        }
    };

    // Handle edit book
    const handleEditBook = (id) => {
        navigate(`/update-Book/${id}`);
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
            <Helmet>
                <title>Manage Books - Shelfy Admin</title>
                <meta name="description" content="Manage all books in the Shelfy library" />
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--color-dark-secondary)] dark:text-white">
                                Manage Books
                            </h1>
                            <p className="mt-1 text-gray-600 dark:text-gray-300">
                                Total books: {totalBooks}
                            </p>
                        </div>
                        <button 
                            onClick={() => navigate('/add-Books')}
                            className="flex items-center gap-2 bg-[var(--color-dark-secondary)] hover:bg-[#024a66] text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <FaPlus /> Add New Book
                        </button>
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
                                placeholder="Search books..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-dark-secondary)] focus:border-transparent dark:bg-[#1f2937] dark:text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaFilter className="text-gray-400" />
                            </div>
                            <select
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-dark-secondary)] focus:border-transparent dark:bg-[#1f2937] dark:text-white"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        
                        <button
                            onClick={handleSearch}
                            className="bg-[var(--color-dark-secondary)] hover:bg-[#024a66] text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Books Table */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Book</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#1f2937] divide-y divide-gray-200 dark:divide-gray-700">
                                {books.length > 0 ? (
                                    books.map((book) => (
                                        <tr key={book._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {book.image ? (
                                                            <img className="h-10 w-10 rounded-md" src={book.image} alt={book.bookTitle} onError={(e) => { e.target.src = 'https://placehold.co/40x40'; }} />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                                                <FaBook className="text-gray-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{book.bookTitle}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">{book.bookId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {book.authorName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                                    {book.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {book.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                <div className="flex items-center">
                                                    <span className="mr-1">{book.rating}</span>
                                                    <FaBook className="text-yellow-500" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditBook(book._id)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBook(book._id)}
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
                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No books found
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
                                Showing page {currentPage} of {totalPages}
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

export default ManageBooks;