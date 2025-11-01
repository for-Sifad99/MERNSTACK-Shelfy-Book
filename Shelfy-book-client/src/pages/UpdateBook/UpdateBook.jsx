import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import leftBook from '../../assets/commonBanners/leftBook.png';
import rightBook from '../../assets/commonBanners/rightBook.png';
import { IoIosArrowForward } from "react-icons/io";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { patchBook } from '../../api/bookApis';
import uploadImageToImgBB from '../../utils/imageUpload';

const UpdateBook = () => {
    const axiosSecure = useAxiosSecure();
    const { id } = useParams();
    const [bookInfo, setBookInfo] = useState({});
    const [selectedCategory, setSelectedCategory] = React.useState(bookInfo?.category || '');

    // Fetch book info by Id
    useEffect(() => {
        // Create axios instance with base URL
        const axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_server_url
        });
        
        axiosInstance.get(`/api/allBooks/${id}`)
            .then(res => {
                setBookInfo(res.data);
                setSelectedCategory(res.data.category || '');
            })
            .catch(err => {
                console.error("Failed to fetch book info", err);
            });
    }, [id]);

    // Set initial category from bookInfo
    useEffect(() => {
        if (bookInfo?.category) {
            setSelectedCategory(bookInfo.category);
        }
    }, [bookInfo]);

    const handleUpdateBook = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        // Get form data
        const bookTitle = formData.get('bookTitle');
        const authorName = formData.get('authorName');
        const imageFile = formData.get('coverImage');
        const category = formData.get('category');
        const description = formData.get('description');
        const bookContent = formData.get('bookContent');
        const quantity = parseInt(formData.get('quantity'));
        const rating = parseFloat(formData.get('rating'));

        // Validation
        if (!bookTitle || !authorName || !category || !description || !bookContent || !quantity || !rating) {
            return toast.error("All fields are required!");
        }

        if (quantity <= 0) {
            return toast.error("Quantity must be greater than 0!");
        }

        if (rating < 1 || rating > 5) {
            return toast.error("Rating must be between 1 and 5!");
        }

        try {
            let imageUrl = bookInfo?.bookImg;

            // Upload new image if provided
            if (imageFile && imageFile.size > 0) {
                imageUrl = await uploadImageToImgBB(imageFile);
            }

            // Create updated book object
            const updatedBookObj = {
                bookTitle,
                authorName,
                image: imageUrl,
                category,
                description,
                bookContent,
                quantity,
                rating
            };

            // Update book in database
            const data = await patchBook(axiosSecure, id, updatedBookObj);
            console.log(data);

            toast.success("Book updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update book. Please try again.");
        }
    };

    return (
        <>
            {/* Helmet */}
            <Helmet>
                <title>Tweak the Book - Shelfy</title>
                <meta name="description" content="Add a book to the shelf like a boss. Quick and easy!" />
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
                        Update Book Info
                    </h1>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-normal text-gray-600 dark:text-slate-400 sm:mt-1">
                        <Link to="/">Home</Link>
                        <IoIosArrowForward />
                        <span className='text-orange-500 dark:text-orange-300'>Update Book</span>
                    </div>
                </div>

                {/* Right Image */}
                <img
                    src={rightBook}
                    alt="Banner Book2 image"
                    className="hidden sm:block w-28 md:w-34 lg:w-40 pt-10"
                />
            </div>

            {/* Man Content */}
            <div className="lg:max-w-3xl lg:mx-auto md:mx-6 mx-auto md:py-14 sm:py-10 py-6 px-6 rounded-md">
                <h2 className="text-2xl md:text-4xl text-[var(--color-dark-secondary)] dark:text-[var(--color-light-secondary)] font-semibold mb-6 border-b-2 border-[var(--color-dark-secondary)]  dark:border-[var(--color-light-secondary)] sm:pb-1 pb-[2px]">Update Book</h2>
                <form onSubmit={handleUpdateBook} className='space-y-4'>
                    {/* Book Name */}
                    <div className='dark:text-white'>
                        <label className="block text-sm font-medium mb-1">Book Name</label>
                        <input
                            type="text"
                            name="bookTitle"
                            defaultValue={bookInfo?.bookTitle || ''}
                            placeholder="Enter book title"
                            className="w-full border border-gray-300 dark:border-gray-500 focus:outline-none focus:border-2 rounded px-3 py-2"
                        />
                    </div>

                    {/* Author Name */}
                    <div className='dark:text-white'>
                        <label className="block text-sm font-medium mb-1">Author Name</label>
                        <input
                            type="text"
                            name="authorName"
                            defaultValue={bookInfo?.authorName || ''}
                            placeholder="Enter author name"
                            className="w-full border border-gray-300 dark:border-gray-500 focus:outline-none focus:border-2 rounded px-3 py-2"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className='dark:text-white'>
                        <label className="block text-sm font-medium mb-1">Book Cover Image</label>
                        <input
                            type='file'
                            name='coverImage'
                            accept='image/*'
                            className="w-full border border-gray-300 dark:border-gray-500 focus:outline-none focus:border-2 rounded px-3 py-2"
                        />
                        {bookInfo?.bookImg && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Current image:</p>
                                <img src={bookInfo.bookImg} alt="Current book cover" className="mt-1 w-32 h-32 object-cover rounded" />
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col md:flex-row sm:gap-4 gap-3 w-full'>
                        {/* Category */}
                        <div className='md:w-1/2 dark:text-white'>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                name="category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full text-[#919397] border border-gray-300 dark:border-gray-500 focus:outline-none focus:border-2 rounded px-3 py-2"
                            >
                                <option value="">Select category</option>
                                <option value="Novel" className='text-black'>Novel</option>
                                <option value="Thriller" className='text-black'>Thriller</option>
                                <option value="History" className='text-black'>History</option>
                                <option value="Drama" className='text-black'>Drama</option>
                                <option value="Sci-Fi" className='text-black'>Sci-Fi</option>
                            </select>
                        </div>

                        {/* Rating */}
                        <div className='md:w-1/2  dark:text-white'>
                            <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="rating"
                                defaultValue={bookInfo?.rating || ''}
                                placeholder="Give rating"
                                className="w-full border border-gray-300 dark:border-gray-500 focus:outline-none focus:border-2 rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className='relative overflow-hidden group text-sm font-semibold px-6 py-2 w-full flex justify-center text-white group-hover:font-bold  bg-[var(--color-dark-secondary)] rounded transition-all duration-300'>
                        <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-primary-orange)] transition-all duration-500 group-hover:w-full z-0"></span>
                        <span className='relative z-10'>
                            Update Book
                        </span>
                    </button>
                </form>
            </div>
        </>
    );
};

export default UpdateBook;
