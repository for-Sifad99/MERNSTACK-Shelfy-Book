import React from 'react';
import { Helmet } from 'react-helmet-async';
import leftBook from '../../assets/commonBanners/leftBook.png';
import rightBook from '../../assets/commonBanners/rightBook.png';
import { IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router';

// Blogs data
const blogPosts = [
    {
        id: 1,
        title: "Top 5 Must-Read Books of 2025",
        date: "August 10, 2025",
        author: "Library Admin",
        description:
            "Discover our handpicked selection of books you should read this year. From timeless classics to modern bestsellers, this list has something for everyone.",
        image: "https://i.ibb.co.com/99QKF6qN/post-1.jpg",
    },
    {
        id: 2,
        title: "Why Reading Every Day Changes Your Life",
        date: "July 25, 2025",
        author: "Library Blogger",
        description:
            "Daily reading not only boosts knowledge but also reduces stress and improves focus. Learn how to make it a part of your routine.",
        image: "https://i.ibb.co.com/HTFyQp1C/post-2.jpg",
    },
    {
        id: 3,
        title: "How to Choose the Perfect Book for You",
        date: "June 15, 2025",
        author: "Guest Author",
        description:
            "Struggling to pick your next read? We’ve got tips to help you find books that match your mood, interests, and goals.",
        image: "https://i.ibb.co.com/wFk1z7YC/post-3.jpg",
    },
];

const Blogs = () => {
    return (
        <>
            {/* Helmet */}
            <Helmet>
                <title>Blogs - Shelfy</title>
                <meta
                    name="description"
                    content="Dive into our library blogs for book reviews, reading tips, and literary fun."
                />
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
                        Blog Lists
                    </h1>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-normal text-gray-600 dark:text-slate-400 sm:mt-1">
                        <Link to="/">Home</Link>
                        <IoIosArrowForward />
                        <span className='text-orange-500 dark:text-orange-300'>Our Blogs</span>
                    </div>
                </div>

                {/* Right Image */}
                <img
                    src={rightBook}
                    alt="Banner Book2 image"
                    className="hidden sm:block w-28 md:w-34 lg:w-40 pt-10"
                />
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-16">
                {blogPosts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-[#e0e0e0] dark:border-[#3f3f3f] overflow-hidden transition-shadow"
                    >
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-60 object-cover"
                        />
                        <div className="p-5 text-left">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white hover:text-orange-500 dark:hover:text-orange-300 transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {post.date} • {post.author}
                            </p>
                            <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
                                {post.description}
                            </p>
                            <button className="mt-4 inline-block text-orange-500 dark:text-orange-300 font-medium hover:underline">
                                Read More →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Blogs;