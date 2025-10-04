import React from 'react';
import { Link } from 'react-router';
import { motion } from "motion/react";
import heroGirl from '../../assets/homeBanners/heroGirl.png';
import heroTop from '../../assets/homeBanners/heroTop.png';
import heroBottom from '../../assets/homeBanners/heroBottom.png';
import frame from '../../assets/homeBanners/frame.png';
import book from '../../assets/homeBanners/book.png';
import { FaArrowRight } from "react-icons/fa";

const Banner = () => {
    return (
        <section className='relative overflow-x-hidden'>
            <img src="https://i.postimg.cc/9XTbxCg8/banner1.png" className='w-full h-[532px]' alt="" />
            
            {/* Banner top shape image */}
            <img className='absolute top-0 sm:right-1 right-0 sm:w-[500px] w-[440px]' src={heroTop} alt="hero Top image" />

            {/* Banner text content */}
            <div className='absolute sm:top-38 top-24 lg:left-38 left-4 lg:w-[540px] md:w-[520px] w-[270px]'>
                <h4 className='md:text-2xl text-lg text-[var(--color-primary-orange)]'>Up to 30% Off</h4>
                <h1 className='lg:text-6xl md:text-5xl text-[26px] text-[var(--color-dark-primary)] font-semibold md:mt-1 md:mb-5 mb-3 lg:leading-15 md:leading-13'>Get Your New Book
                    With The Best Price</h1>
                <Link to='all-books'>
                    <button className='relative overflow-hidden group text-xs font-semibold px-6 py-[10px] bg-[var(--color-dark-secondary)] text-white rounded-full'>
                        <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-primary-orange)] transition-all duration-700 group-hover:w-full z-0"></span>
                        <span className='relative z-10 flex gap-1 items-center'>
                            Explore Books<FaArrowRight />
                        </span>
                    </button>
                </Link>
            </div>

            {/* Banner hero girl image with motion */}
            <motion.img
                animate={
                    {
                        x: [0, -20, 0],
                        transition: { duration: 5, repeat: Infinity }
                    }
                }
                className='absolute bottom-0 lg:right-24 sm:right-4 right-0 sm:w-[390px] sm:h-[485px] w-[360px] z-2' src={heroGirl} alt="hero girl" />

            {/* Banner bottom shape image  */}
            <img className='absolute bottom-0 right-0 w-[180px] h-[140px]' src={heroBottom} alt="hero bottom image" />

            {/* Banner bottom middle shape with motion */}
            <motion.img
                animate={
                    {
                        y: [6, -6, 6],
                        transition: { duration: 5, repeat: Infinity }
                    }
                }
                className='hidden md:block absolute bottom-4 lg:right-[500px] md:right-[340px] w-[170px] h-[70px]' src={frame} alt="frame image" />

            {/* Banner top right shape image */}
            <motion.img
                animate={
                    {
                        x: [6, 30, 6],
                        transition: { duration: 5, repeat: Infinity }
                    }
                }
                className='hidden md:block absolute top-2 lg:left-72 md:left-14 w-[170px] h-[70px]' src={frame} alt="frame image" />

            {/* Banner bottom right books image */}
            <img className='absolute bottom-0 left-0 w-[170px] h-[100px]' src={book} alt="book image" />
        </section>
    );
};

export default Banner;