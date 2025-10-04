import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import leftBook from '../../assets/commonBanners/leftBook.png';
import rightBook from '../../assets/commonBanners/rightBook.png';
import { IoIosArrowForward } from "react-icons/io";
import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { FaUser } from 'react-icons/fa';
import { LuTableProperties, LuTableOfContents } from "react-icons/lu";
import { MdTipsAndUpdates } from "react-icons/md";
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import Loader from '../Shared/Loader';
import Pagination from '../Shared/Pagination';
import axios from 'axios';


const AllBooks = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [view, setView] = useState(() => localStorage.getItem('bookView') || 'card');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;

    // Fetch paginated books based on category & page
    useEffect(() => {
        const fetchCategoryBooks = async () => {
            try {
                const res = await axios.get(`https://shelfy-book-server.vercel.app/allBooks?page=${currentPage}&limit=${itemsPerPage}`);
                setBooks(res.data.books);
                setTotalPages(res.data.totalPages);
            } catch (error) {
                console.error("Error fetching all books:", error);
            } finally {
                setLoading(false);
            };
        };

        fetchCategoryBooks();
    }, [currentPage]);

    // filter books based on availability
    const filteredBooks = books.filter(book => {
        if (filter === 'available') {
            return book.quantity > 0;
        } else if (filter === 'out-of-stock') {
            return book.quantity === 0;
        }
        return true;
    });

    // Handle view change and save to localStorage
    const handleViewChange = (viewType) => {
        localStorage.setItem('bookView', viewType);
        setView(viewType);
    };

    const handleUpdateClick = (bookId) => {
        if (user) {
            // user logged in → navigate to book details
            navigate(`/update-book/${bookId}`);
        } else {
            // user not logged in → show toast
            toast.warning('Please login first to update book!');
        }
    };

    return <>
        {/* Helmet */}
        <Helmet>
            <title>All the Books - Shelfy</title>
            <meta name="description" content="Scroll through ‘em all — find your next fav read on Shelfy!" />
        </Helmet>


        {/* Page Banner */}
        <div className="flex justify-between items-center bg-[#e6eff2] dark:bg-[#19343d] sm:py-6 py-12">
            {/* Left Image */}
            <img
                src={leftBook}
                alt="Banner Book1 image"
                className="hidden sm:block w-48 md:w-54 lg:w-64 pt-10"
            />

            {/* Title and Breadcrumb */}
            <div className="flex flex-col items-center justify-center text-center mx-auto sm:py-0 py-3">
                <h1 className="text-[#012e4a] dark:text-[var(--color-light-primary)] font-semibold text-2xl md:text-3xl lg:text-4xl">
                    Let's Read
                </h1>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-normal text-gray-600 dark:text-slate-400 sm:mt-1">
                    <Link to="/">Home</Link>
                    <IoIosArrowForward />
                    <span className='text-orange-500 dark:text-orange-300'>All Books</span>
                </div>
            </div>

            {/* Right Image */}
            <img
                src={rightBook}
                alt="Banner Book2 image"
                className="hidden sm:block w-28 md:w-34 lg:w-40 pt-10"
            />
        </div>

        {/* Main Content */}
        <div className="sm:py-16 py-8 px-4 md:px-10 lg:px-4 xl:px-36">
            {/* Header UI */}
            <div className="flex flex-col sm:flex-row justify-between items-center border-[1px] border-gray-300 dark:border-gray-500 rounded-md py-[6px] px-3 mb-6 md:mx-0 sm:mx-16">
                <p className="text-sm dark:text-white">
                    Showing 1–<span className='font-bold text-red-500 dark:text-orange-400'>{books.length}</span> of <span className='font-bold text-red-500 dark:text-orange-400'>{filteredBooks.length}</span> Results
                </p>
                <div className="flex items-center gap-4 text-xs text-[var(--color-dark-primary)] dark:text-[var(--color-light-primary)] mt-2 md:mt-0">
                    <div className="flex items-center gap-2">
                        <select value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="select h-5 select-ghost focus:outline-none text-xs">
                            <option value="all">All Books</option>
                            <option value="available">Available Books</option>
                            <option value="out-of-stock">Out of Stock</option>
                        </select>
                        <div className="flex gap-1">
                            <button
                                onClick={() => handleViewChange('card')}
                                className={`text-red-500 dark:text-red-400 p-1 rounded ${view === 'card' ? 'bg-orange-100' : ''}`}
                                title="Card View"
                            >
                                <LuTableProperties size={16} />
                            </button>
                            <button
                                onClick={() => handleViewChange('table')}
                                className={`p-1 rounded ${view === 'table' ? 'bg-orange-100 text-black' : ''}`}
                                title="Table View"
                            >
                                <LuTableOfContents size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {filteredBooks.length == 0 ?
                <div className='flex flex-col justify-center items-center gap-2 sm:gap-3 md:mt-10 sm:mt-8 mt-6'>
                    <p className='text-sm sm:text-2xl lg:text-3xl font-semibold text-orange-500 dark:text-orange-400'>There are no collect in this option!</p>
                    <Link to='/'>
                        <button className='relative overflow-hidden group text-xs font-semibold px-6 py-[8px] w-full flex justify-center text-white g bg-[var(--color-dark-secondary)]  rounded-full transition-all duration-300'>
                            <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-primary-orange)] transition-all duration-500 group-hover:w-full z-0"></span>
                            <span className='relative z-10'>
                                Back Home
                            </span>
                        </button>
                    </Link>
                </div> : <>
                    {/* Card View */}
                    {loading ?
                        <Loader /> :
                        <>
                            {view === 'card' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:px-0 sm:px-16">
                                    {filteredBooks.map((book) => (
                                        <div key={book._id} className="relative group rounded-xl">
                                            <div className='bg-[#f5f5f5] dark:bg-[#374151] px-6 pt-6 pb-3 flex justify-center items-center rounded-xl'>
                                                <img
                                                    src={book.bookImg}
                                                    alt={book.bookTitle}
                                                    className="w-[120px] h-[150px] object-cover rounded mb-2 transition-transform duration-300 ease-in-out group-hover:scale-110"
                                                />
                                            </div>
                                            <p className='absolute top-3 left-4 text-[10px] bg-[var(--color-dark-secondary)] text-white font-semibold py-1 px-[6px] rounded'>{book.category}</p>
                                            <div className='bg-white dark:bg-[var(--color-bg)] py-3'>
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-1 text-[var(--color-dark-secondary)] dark:text-[var(--color-light-secondary)] text-xs font-semibold mb-1'>
                                                        <FaUser />{book.authorName}
                                                    </div>
                                                    <div className="text-yellow-500 inline-block mb-2">
                                                        <Rating
                                                            style={{ maxWidth: 52 }}
                                                            value={book.rating}
                                                            readOnly
                                                            halfFillMode="svg"
                                                            itemStyles={{
                                                                itemShapes: Star,
                                                                activeFillColor: '#ffa900',
                                                                inactiveFillColor: '#e5e7eb',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <h1 className='dark:text-[#dad5d5] text-xs font-extrabold dark:font-semibold mb-2'>
                                                    {book.bookTitle}
                                                </h1>
                                                <button
                                                    onClick={() => handleUpdateClick(book._id)}
                                                    className='relative overflow-hidden group text-xs font-semibold px-6 py-[8px] w-full flex justify-center text-[var(--color-dark-secondary)] group-hover:text-white group-hover:font-bold  bg-[#eeebfd] rounded-full transition-all duration-300'>
                                                    <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-primary-orange)] transition-all duration-500 group-hover:w-full z-0"></span>
                                                    <span className='relative z-10 flex gap-1 items-center'>
                                                        <MdTipsAndUpdates /> Update
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    }

                    {/* Table View */}
                    {loading ?
                        <Loader /> :
                        <>
                            {view === 'table' && (
                                <div className="overflow-x-auto md:mx-0 sm:mx-16 rounded-md">
                                    <table className="min-w-full border-2 border-gray-200 dark:border-[#374151] rounded-md">
                                        <thead>
                                            <tr className="bg-gray-100 dark:bg-[#374151] dark:text-[var(--color-light-primary)]">
                                                <th className="p-4">Count</th>
                                                <th className="p-4">Cover</th>
                                                <th className="p-4">Author</th>
                                                <th className="p-4">Title</th>
                                                <th className="p-4">Category</th>
                                                <th className="p-4">Rating</th>
                                                <th className="p-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBooks.map((book, index) => (
                                                <tr key={book._id} className="text-center">
                                                    <td className="border-b-2 border-gray-200 dark:border-[#374151] px-4 py-2">
                                                        <h3 className='flex justify-center text-white items-center bg-red-500 dark:bg-red-400 dark:border-[#374151] font-bold w-10 h-10 rounded-full'>{index + 1}</h3>
                                                    </td>
                                                    <td className="border-b-2 border-l-2  border-r-2 border-gray-200 dark:border-[#374151] py-2 flex justify-center mx-auto"><img className='w-[52px]' src={book.bookImg} alt={book.title} /></td>
                                                    <td className="border-b-2 border-gray-200 dark:border-[#374151] px-4 py-2"><div className='lg:flex items-center gap-1 text-[var(--color-dark-secondary)] dark:text-[var(--color-light-secondary)] lg:text-base md:text-sm text-xs font-semibold'>
                                                        <FaUser className='lg:block hidden' />{book.authorName}
                                                    </div></td>
                                                    <td className="border-b-2 dark:text-gray-300 dark:border-[#374151] lg:text-base md:text-sm text-xs font-semibold border-gray-200 px-4 py-2">{book.bookTitle}</td>
                                                    <td className="border-b-2 text-sm text-gray-500 dark:text-gray-400  font-extrabold border-gray-200 dark:border-[#374151] px-4 py-2">{book.category}</td>
                                                    <td className="border-b-2 border-gray-200 dark:border-[#374151] px-4 py-2">
                                                        <h3 className='bg-gray-200 dark:bg-gray-300 dark:text-black dark:border-[#374151] p-1 rounded'>{book.rating}</h3>
                                                    </td>
                                                    <td className="border-b-2 border-gray-200 dark:border-[#374151] px-4 py-2">
                                                        <button
                                                            onClick={() => handleUpdateClick(book._id)}
                                                            className='relative overflow-hidden group text-xs font-semibold px-6 py-[8px] w-full flex justify-center text-[var(--color-dark-secondary)] hover:text-white group-hover:font-bold  bg-[#eeebfd] rounded-full transition-all duration-300'>
                                                            <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-primary-orange)] transition-all duration-500 group-hover:w-full z-0"></span>
                                                            <span className='relative z-10 flex gap-1 items-center'>
                                                                <MdTipsAndUpdates /> Update
                                                            </span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    }

                    <div className='text-center mt-6 text-xl'>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </>
            }
        </div>
    </>
};

export default AllBooks;
