import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Marquee from "react-fast-marquee";
import avatar from '../../assets/avatarImg/avatar.jpg';
import { TbListDetails } from "react-icons/tb";
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate } from "react-router";

const HighRatingBooks = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch top rating books
    useEffect(() => {
        const fetchTopRatingBooks = async () => {
            try {
                const res = await axios.get('https://shelfy-book-server.vercel.app/topRatingbooks');
                setBooks(res.data);
            } catch (error) {
                console.error("Error fetching top rating books:", error);
            } finally {
                setLoading(false);
            };
        };

        fetchTopRatingBooks();
    }, []);

     const handleDetailsClick = (bookId) => {
            if (user) {
                // user logged in → navigate to book details
                navigate(`/book-details/${bookId}`);
            } else {
                // user not logged in → show toast
                toast.warning('Please login first to view book details!');
            }
        };
    

    if (loading) {
        return <div className='flex mx-auto justify-center items-center my-20'><span className="loading loading-spinner loading-xl"></span></div>
    };

    return (
        <div className="px-6 md:px-12 lg:px-6 xl:px-38 py-12 sm:py-20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:mb-10 mb-8">
                <h1 className='text-2xl md:text-3xl font-semibold text-[var(--color-dark-primary)] dark:text-[var(--color-light-primary)]'>Top Rating Books</h1>
                <Link to='/all-books'>
                    <button className='relative overflow-hidden group text-xs font-semibold sm:px-6 sm:py-[10px] px-4 py-2 border border-[var(--color-dark-secondary)] dark:border-[var(--color-light-secondary)] text-[var(--color-dark-secondary)] dark:text-[var(--color-light-secondary)] hover:text-white  tarnsition-all duration-500 rounded-full'>
                        <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-dark-secondary)] dark:bg-[var(--color-light-secondary)] transition-all duration-700 group-hover:w-full z-0"></span>
                        <span className='relative z-10'>
                            Explore More
                        </span>
                    </button>
                </Link >
            </div>
            <Marquee
                direction="left"
                speed={40}
                gradient={false}
                pauseOnHover={true}
                autoFill={false}
            >
                <div className="flex gap-4 pl-4 animate-[slide_10s_linear_infinite]">
                    {books.map((book, index) => (
                        <div key={book._id}
                            style={{ animationDelay: `${index * 0.5}s` }} className="relative group rounded-xl">
                            <div className='bg-[#f5f5f5] dark:bg-[#374151] px-7 pt-7 pb-4 flex justify-center items-center rounded-xl'>
                                <img
                                    src={book.bookImg}
                                    alt={book.bookTitle}
                                    className="w-[140px] h-[180px] object-cover rounded-md mb-2 transition-transform duration-300 ease-in-out group-hover:scale-110"
                                />
                            </div>
                            <p className='absolute top-3 left-4 text-[10px] bg-[var(--color-dark-secondary)] text-white font-semibold py-1 px-[6px] rounded'>{book.category}</p>
                            <div className='bg-white dark:bg-[var(--color-bg)] py-3'>
                                <div className="flex justify-end mb-1">
                                    <Rating
                                        style={{ maxWidth: 82 }}
                                        value={book.rating}
                                        readOnly
                                        halfFillMode="svg"
                                        itemStyles={{
                                            itemShapes: Star,
                                            activeFillColor: '#ff6500',
                                            inactiveFillColor: '#e5e7eb',
                                        }}
                                    />
                                </div>
                                <h1 className='dark:text-[#dad5d5] text-gray-500 text-sm font-bold dark:font-normal mb-1'>
                                    {book.bookTitle}
                                </h1>
                                <div className='flex items-center gap-1 text-black dark:text-[var(--color-light-primary)] text-sm font-bold mb-2'>
                                    <img src={avatar} className='w-6 h-6 rounded-full' alt="Default avatar image" />
                                    {book.authorName}
                                </div>
                                    <button
                                    onClick={() => handleDetailsClick(book._id)}
                                        className='relative overflow-hidden group text-xs font-semibold px-6 py-[8px] w-full flex justify-center text-[var(--color-dark-secondary)] group-hover:text-white group-hover:font-bold  bg-[#eeebfd] rounded-full transition-all duration-300'>
                                        <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-primary-orange)] transition-all duration-500 group-hover:w-full z-0"></span>
                                        <span className='relative z-10 flex gap-1 items-center'>
                                            <TbListDetails size={12} />View Details
                                        </span>
                                    </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Marquee>
        </div>
    );
};

export default HighRatingBooks;
