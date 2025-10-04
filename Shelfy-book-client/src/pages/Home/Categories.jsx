import React from 'react';
import { Link } from 'react-router';
import { FaBook } from "react-icons/fa";

// Categories data
const books = [
    {
        "bookImg": "https://i.postimg.cc/VLn9Gz5Z/images.jpg",
        "category": "History"
    },
    {
        "bookImg": "https://i.postimg.cc/fRr566LX/image-2.jpg",
        "category": "Thriller"
    },
    {
        "bookImg": "https://i.postimg.cc/qMVyCWQs/image-3.jpg",
        "category": "Novel"
    },
    {
        "bookImg": "https://i.postimg.cc/Y2QdPnYD/image-4.jpg",
        "category": "Drama"
    }
]

const Categories = () => {
    return (
        <section className='bg-[#d0e1e7] dark:bg-[#2d343f] xl:px-40 md:px-6 px-4 py-12 sm:py-20 mt-10 sm:mt-16'>
            <div className='flex flex-col sm:flex-row items-center justify-between sm:mb-10 mb-8 xl:px-9 lg:px-6 md:px-12 px-6 gap-2'>
                <h1 className='text-2xl md:text-3xl font-semibold text-[var(--color-dark-secondary)] dark:text-[var(--color-light-secondary)]'>Book Categories</h1>
                <Link to='/all-books'>
                    <button className='relative overflow-hidden group text-xs font-semibold sm:px-6 sm:py-[10px] px-4 py-2 border border-[var(--color-dark-secondary)] dark:border-[var(--color-light-secondary)] text-[var(--color-dark-secondary)] dark:text-[var(--color-light-secondary)] hover:text-white  tarnsition-all duration-500 rounded-full'>
                        <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-dark-secondary)] dark:bg-[var(--color-light-secondary)] transition-all duration-700 group-hover:w-full z-0"></span>
                        <span className='relative z-10'>
                            Explore Books
                        </span>
                    </button>
                </Link>
            </div>
            <div className="flex flex-wrap mx-auto justify-center items-center gap-4">
                {books.map((book, index) => (
                    <Link to={`/category-books/${book.category}`} key={index} className="group rounded-xl transition-all duration-300 hover:-translate-y-2">
                        <div className='relative flex flex-col bg-[#f5f5f5] dark:bg-[#596477] p-[10px] justify-center items-center rounded-full'>
                            <img
                                src={book.bookImg}
                                alt={book.bookTitle}
                                className="lg:w-[200px] lg:h-[300px] md:w-[180px] md:h-[260px] sm:w-[140px] sm:h-[200px] w-[160px] h-[220px] border-10 border-orange-300 object-cover rounded-full"
                            />
                            <div className='absolute border-orange-300 group-hover:text-[#f5f5f5] text-[var(--color-dark-secondary)] bg-[#f5f5f5] group-hover:bg-[var(--color-dark-secondary)] w-18 h-18 flex gap-[2px] justify-center mx-auto items-center font-bold rounded-full transition-all duration-500 delay-100 mt-1'>
                                <span className=' text-[10px]'><FaBook /></span><span className='text-xs'> {book.category}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Categories;