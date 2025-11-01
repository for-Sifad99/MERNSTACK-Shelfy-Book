import React from 'react';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import leftBook from '../../assets/commonBanners/leftBook.png';
import rightBook from '../../assets/commonBanners/rightBook.png';
import { IoIosArrowForward } from "react-icons/io";
import { toast } from 'react-toastify';
import useAuth from '../../hooks/UseAuth';
import uploadImageToImgBB from '../../utils/imageUpload';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { postBooks } from '../../api/bookApis';
import { useSocket } from '../../contexts/SocketContext'; // Add socket context import

const AddBooks = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { emitBook } = useSocket(); // Add socket context

    // Function to generate a unique book ID
    const generateBookId = () => {
        return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9);
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        // Get form data
        const bookTitle = formData.get('bookTitle');
        const authorName = formData.get('authorName');
        const authorEmail = user?.email;
        const authorPhoto = user?.photoURL;
        const imageFile = formData.get('coverImage');
        const category = formData.get('category');
        const description = formData.get('description');
        const bookContent = formData.get('bookContent');
        const quantity = parseInt(formData.get('quantity'));
        // Remove rating input and set default rating to 0
        const rating = 0; // Default rating

        // Validation
        if (!bookTitle || !authorName || !imageFile || !category || !description || !bookContent || !quantity) {
            return toast.error("All fields are required!");
        }

        if (quantity <= 0) {
            return toast.error("Quantity must be greater than 0!");
        }

        try {
            // Upload image to ImgBB
            const imageUrl = await uploadImageToImgBB(imageFile);

            // Create book object
            const bookObj = {
                bookTitle,
                authorName,
                authorEmail,
                authorPhoto,
                image: imageUrl,
                category,
                description,
                bookContent,
                quantity,
                rating, // Set rating to 0
                bookId: generateBookId()
            };

            // Add book to database
            const data = await postBooks(axiosSecure, bookObj);
            console.log(data);

            // Emit socket event for new book
            emitBook({
                bookTitle,
                userName: user.displayName || user.email,
                userId: user.uid
            });

            toast.success("Book added successfully!");
            form.reset();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add book. Please try again.");
        }
    };

    return (
        <>
            {/* Helmet */}
            <Helmet>
                <title>Drop a Book - Shelfy</title>
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
                        Publish Your Book
                    </h1>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-normal text-gray-600 dark:text-slate-400 sm:mt-1">
                        <Link to="/">Home</Link>
                        <IoIosArrowForward />
                        <span className='text-orange-500 dark:text-orange-300'>Add Books</span>
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
            <div className="lg:max-w-3xl lg:mx-auto md:mx-6 mx-auto md:py-14 sm:py-10 py-6 px-3 sm:px-6 rounded-md">
                <h2 className="text-2xl md:text-4xl text-[var(--color-dark-secondary)] dark:text-[var(--color-light-secondary)] font-semibold mb-6 border-b-2 border-[var(--color-dark-secondary)]  dark:border-[var(--color-light-secondary)] sm:pb-1 pb-[2px]">Add Book</h2>
                <form onSubmit={handleAddBook} className='space-y-4'>
                    {/* Book Name */}
                    <div className='dark:text-white'>
                        <label className="block text-sm font-medium mb-1">Book Name</label>
                        <input
                            type="text"
                            name="bookTitle"
                            placeholder="Enter book title"
                            className="w-full border border-gray-300 dark:border-gray-500 focus:outline-none focus:border-2 rounded px-3 py-2"
                            required
                        />
                    </div>

                    {/* Author Name */}
                    <div className='dark:text-white'>
                        <label className="block text-sm font-medium mb-1">Author Name</label>
                        <input
                            type="text"
                            name="authorName"
                            placeholder="Enter author name"
                            className="w-full border border-gray-300 dark:border-gray-500 focus:outline-none focus:border-2 rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div className='flex flex-col md:flex-row sm:gap-4 gap-3 w-full'>
                        {/* Image Upload */}
                        <div className='md:w-1/2  dark:text-white'>
                            <label className="block text-sm font-medium mb-1">Book Cover Image</label>
                            <input
                                type='file'
                                name='coverImage'
                                accept='image/*'
                                required
                                className="w-full border border-gray-300 dark:border-gray-500 focus:outline-none focus:border-2 rounded px-3 py-2"
                            />
                        </div>

                        {/* Category */}
                        <div className='md:w-1/2  dark:text-white'>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                name="category"
                                className="w-full text-[#919397] border border-gray-300 dark:border-gray-500 focus:outline-none focus:border-2 rounded px-3 py-2"
                                required
                            >
                                <option value="">Select category</option>
                                <option value="Novel" className='text-black'>Novel</option>
                                <option value="Thriller" className='text-black'>Thriller</option>
                                <option value="History" className='text-black'>History</option>
                                <option value="Drama" className='text-black'>Drama</option>
                                <option value="Sci-Fi" className='text-black'>Sci-Fi</option>
                            </select>
                        </div>
                    </div>

                    {/* Short Description */}
                    <div className=' dark:text-white'>
                        <label className="block text-sm font-medium">Short Description</label>
                        <textarea
                            name="description"
                            placeholder="Write a short description"
                            className="w-full border border-gray-300 dark:border-gray-500 focus:outline-none focus:border-2 rounded px-3 py-2 h-24"
                            required
                        />
                    </div>

                    {/* Book Content */}
                    <div className=' dark:text-white'>
                        <label className="block text-sm font-medium">Book Content</label>
                        <textarea
                            name="bookContent"
                            placeholder="Write a book content"
                            className="w-full border border-gray-300 dark:border-gray-500 focus:outline-none focus:border-2 rounded px-3 py-2 h-24"
                            required
                        />
                    </div>

                    <div className='flex flex-col md:flex-row gap-5 w-full'>
                        {/* Quantity */}
                        <div className='md:w-1/2  dark:text-white'>
                            <label className="block text-sm font-medium mb-1">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                placeholder="Enter quantity"
                                className="w-full border border-gray-300 dark:border-gray-500 focus:outline-none focus:border-2 rounded px-3 py-2"
                                required
                            />
                        </div>

                        {/* Remove Rating Input */}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className='relative overflow-hidden group text-sm font-semibold px-6 py-2 w-full flex justify-center text-white group-hover:font-bold  bg-[var(--color-dark-secondary)] rounded transition-all duration-300'>
                        <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-primary-orange)] transition-all duration-500 group-hover:w-full z-0"></span>
                        <span className='relative z-10'>
                            Add Book
                        </span>
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddBooks;