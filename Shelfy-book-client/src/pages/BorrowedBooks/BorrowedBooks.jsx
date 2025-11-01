import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import leftBook from '../../assets/commonBanners/leftBook.png';
import rightBook from '../../assets/commonBanners/rightBook.png';
import { IoIosArrowForward } from "react-icons/io";
import { FaUser } from 'react-icons/fa';
import { IoMdReturnRight } from "react-icons/io";
import Swal from 'sweetalert2';
import useAuth from '../../hooks/UseAuth';
import axios from 'axios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { patchBook } from '../../api/bookApis';


const BorrowedBooks = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [borrowedBooks, setBorrowedBooks] = useState([]);

    useEffect(() => {
        if (!user?.email) return;

        const fetchBorrowedBooks = async () => {
            try {
                // Create axios instance with base URL
                const axiosInstance = axios.create({
                    baseURL: import.meta.env.VITE_server_url
                });
                
                const res = await axiosInstance.get(`/api/borrowedBooks/${user.email}`);
                setBorrowedBooks(res.data);
            } catch (error) {
                console.error("Error fetching borrowed books:", error);
            }
        };

        fetchBorrowedBooks();
    }, [user?.email]);


    const handleReturn = async (borrowedId, bookId, currentQuantity) => {
        try {
            await patchBook(axiosSecure, bookId, {
                quantity: currentQuantity + 1
            });
            // Create axios instance with base URL
            const axiosInstance = axios.create({
                baseURL: import.meta.env.VITE_server_url
            });
            
            await axiosInstance.delete(`/api/deleteBorrowedBook/${borrowedId}`);

            // Sweet Alert :
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "You are successfully returned the book!!"
            });

            // Update UI
            setBorrowedBooks(prev =>
                prev.filter(book => book._id !== borrowedId)
            );
        } catch (error) {
            console.error("Error returning the book:", error);
        };
    };

    return <>
        {/* Helmet */}
        <Helmet>
            <title>You Borrowed These - Shelfy</title>
            <meta name="description" content="Your current reads live here. Don’t forget to return ’em!" />
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
                    My Books
                </h1>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-normal text-gray-600 dark:text-slate-400 sm:mt-1">
                    <Link to="/">Home</Link>
                    <IoIosArrowForward />
                    <span className='text-orange-500 dark:text-orange-300'>Borrowed Books</span>
                </div>
            </div>

            {/* Right Image */}
            <img
                src={rightBook}
                alt="Banner Book2 image"
                className="hidden sm:block w-28 md:w-34 lg:w-40 pt-10"
            />
        </div >

        {/* Main Content */}
        <div className="sm:py-16 py-8 px-4 md:px-10 lg:px-4 xl:px-36" >
            {
                borrowedBooks.length === 0 ?
                    <div className='flex flex-col justify-center items-center gap-2 lg:gap-3'>
                        <p className='text-sm sm:text-2xl lg:text-3xl font-semibold text-orange-500 dark:text-orange-400'>You don't Borrowed any book yet!</p>
                        <Link to='/all-books'>
                            <button className='relative overflow-hidden group text-xs font-semibold px-6 py-[8px] w-full flex justify-center text-white g bg-[var(--color-dark-secondary)]  rounded-full transition-all duration-300'>
                                <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-primary-orange)] transition-all duration-500 group-hover:w-full z-0"></span>
                                <span className='relative z-10'>
                                    Borrow Book
                                </span>
                            </button>
                        </Link>
                    </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:px-0 sm:px-16">
                        {borrowedBooks.map((borrowedBook) => (
                            <div key={borrowedBook._id} className="relative group rounded-xl">
                                <div className='bg-[#f5f5f5] dark:bg-[#374151] px-6 pt-6 pb-3 flex justify-center items-center rounded-xl'>
                                    <img
                                        src={borrowedBook.bookImg}
                                        alt={borrowedBook.bookTitle}
                                        className="w-[120px] h-[150px] object-cover rounded mb-2 transition-transform duration-300 ease-in-out group-hover:scale-110"
                                    />
                                </div>
                                <p className='absolute top-3 left-4 text-[10px] bg-[var(--color-dark-secondary)] text-white font-semibold py-1 px-[6px] rounded'>{borrowedBook.category}</p>
                                <div className='bg-white dark:bg-[var(--color-bg)] py-3'>
                                    <h1 className='text-xs text-right font-semibold text-orange-500 dark:text-orange-300 mb-1'>
                                        Return: {borrowedBook.returnDate}
                                    </h1>
                                    <h1 className='dark:text-[#dad5d5] text-xs font-extrabold dark:font-semibold mb-1'>
                                        {borrowedBook.bookTitle}
                                    </h1>
                                    <div className='flex items-center gap-1 text-[var(--color-dark-secondary)] dark:text-[var(--color-light-secondary)] text-xs font-semibold mb-2'>
                                        <span className='flex items-center gap-1 text-black dark:text-[#dad5d5]'>   <FaUser />Borrowed by: </span>
                                        {borrowedBook.name}
                                    </div>

                                    <button
                                        onClick={() => handleReturn(
                                            borrowedBook._id,
                                            borrowedBook.bookId,
                                            borrowedBook.quantity
                                        )}
                                        type='button'
                                        className='relative overflow-hidden group text-xs font-semibold px-6 py-[8px] w-full flex justify-center text-[var(--color-dark-secondary)] group-hover:text-white group-hover:font-bold  bg-[#eeebfd] rounded-full transition-all duration-300'>
                                        <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-primary-orange)] transition-all duration-500 group-hover:w-full z-0"></span>
                                        <span className='relative z-10 flex gap-1 items-center'>
                                            <IoMdReturnRight className='text-base' /> Return
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
            }
        </div >
    </>
};

export default BorrowedBooks;