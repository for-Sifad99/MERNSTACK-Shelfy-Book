import React from 'react';
import { Link } from "react-router";
import visa from '../../assets/footerIcons/visa.png';
import mastercard from '../../assets/footerIcons/mastercard.png';
import payoneer from '../../assets/footerIcons/payoneer.png';
import affirm from '../../assets/footerIcons/affirm.png';
import {
    FaFacebookF,
    FaGoogle,
    FaGithub,
    FaEnvelope,
    FaLocationArrow
} from "react-icons/fa";
import { RiArrowRightDoubleLine } from "react-icons/ri";

const Footer = () => {
    return (
        <footer className="bg-[#002D44] dark:bg-[var(--color-bg)] text-white dark:border-t dark:border-[#535353]">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-6 xl:px-30 pt-12">
                <div className="grid xl:gap-6 md:gap-0 gap-10 md:grid-cols-5 text-sm md:text-base">
                    {/* Brand Info */}
                    <div className="md:col-span-2 md:pr-6">
                        <Link to="/" className="flex items-center font-bold lg:mb-4 md:mb-2 mb-2">
                            <img src="/logo.png" alt="Shelfy" className="md:w-12 md:h-12 sm:w-14 sm:h-14 w-8 h-8 mr-2" />
                            <h1 className="md:text-3xl sm:text-[45px] text-2xl text-blue-200">
                                Shel<span className="text-[var(--color-primary-orange)] font-bold">fy</span>
                            </h1>
                        </Link>
                        <p className="opacity-70 lg:text-sm md:text-xs sm:text-lg text-sm">
                            Read books anytime, anywhere, and discover stories that matter. We provide quality books and unbeatable value.
                        </p>
                        <div className="flex gap-[6px] mt-4 lg:text-sm md:text-xs sm:text-lg text-sm">
                            {[FaFacebookF, FaGoogle, FaGithub, FaEnvelope].map((Icon, index) => (
                                <div
                                    key={index}
                                    className="text-white p-[6px] rounded border border-slate-500 dark:border-gray-700 hover:bg-[var(--color-primary-orange)] transition duration-300 "
                                >
                                    <Icon />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h3 className="font-semibold lg:text-xl md:text-lg sm:text-3xl text-xl mb-2">Support</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-[2px] md:w-1/16 sm:w-1/24 w-1/30 bg-[var(--color-primary-orange)]"></div>
                            <div className="h-[2px] md:w-2/16 sm:w-2/20 w-2/30 bg-[var(--color-light-accent)]"></div>
                        </div>
                        <ul className="md:space-y-1 sm:space-y-0 space-y-1 lg:text-sm md:text-xs sm:text-lg text-sm">
                            <li className="flex items-center hover:text-[var(--color-primary-orange)] cursor-pointer hover:translate-x-1 transition-all duration-300"><RiArrowRightDoubleLine /> Help Center</li>
                            <li className="flex items-center hover:text-[var(--color-primary-orange)] cursor-pointer hover:translate-x-1 transition-all duration-300"><RiArrowRightDoubleLine />Opening Hours</li>
                            <li className="flex items-center hover:text-[var(--color-primary-orange)] cursor-pointer hover:translate-x-1 transition-all duration-300"><RiArrowRightDoubleLine />Contact Us</li>
                            <li className="flex items-center hover:text-[var(--color-primary-orange)] cursor-pointer hover:translate-x-1 transition-all duration-300"><RiArrowRightDoubleLine />Return Policy</li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold lg:text-xl md:text-lg sm:text-3xl text-xl mb-2">Categories</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-[2px] md:w-1/16 sm:w-1/24 w-1/30 bg-[var(--color-primary-orange)]"></div>
                            <div className="h-[2px] md:w-2/16 sm:w-2/20 w-2/30 bg-[var(--color-light-accent)]"></div>
                        </div>
                        <ul className="md:space-y-1 sm:space-y-0 space-y-1 lg:text-sm md:text-xs sm:text-lg text-sm">
                            <li className="flex items-center hover:text-[var(--color-primary-orange)] cursor-pointer hover:translate-x-1 transition-all duration-300"><RiArrowRightDoubleLine />Romantic Books</li>
                            <li className="flex items-center hover:text-[var(--color-primary-orange)] cursor-pointer hover:translate-x-1 transition-all duration-300"><RiArrowRightDoubleLine />Poetry Books</li>
                            <li className="flex items-center hover:text-[var(--color-primary-orange)] cursor-pointer hover:translate-x-1 transition-all duration-300"><RiArrowRightDoubleLine />Fantasy Books</li>
                            <li className="flex items-center hover:text-[var(--color-primary-orange)] cursor-pointer hover:translate-x-1 transition-all duration-300"><RiArrowRightDoubleLine />History Books</li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold lg:text-xl md:text-lg sm:text-3xl text-xl mb-2">Newsletter</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-[2px] md:w-1/16 sm:w-1/24 w-1/30 bg-[var(--color-primary-orange)]"></div>
                            <div className="h-[2px] md:w-2/16 sm:w-2/20 w-2/30 bg-[var(--color-light-accent)]"></div>
                        </div>
                        <p className="md:text-xs sm:text-lg text-sm opacity-70 mb-3">Sign up with your email address to get the latest updates.</p>
                        <div>
                            <div className="flex flex-row justify-between gap-3 max-w-[300px] max-w-[340px] border border-slate-400 dark:border-gray-600 md:p-1 p-[6px] lg:text-sm md:text-xs sm:text-lg text-sm rounded">
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="p-2 rounded text-white w-full focus:outline-none"
                                />
                                <button className='relative overflow-hidden group lg:text-sm md:text-xs sm:text-lg text-sm font-semibold px-[14px] py-[10px] bg-[var(--color-dark-secondary)] text-white rounded'>
                                    <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-primary-orange)] transition-all duration-700 group-hover:w-full z-0"></span>
                                    <FaLocationArrow className='relative z-10 mx-auto' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Copyright */}
            <div className="max-w-[1600px] md:mx-auto mt-6 px-4 sm:px-6 md:px-12 lg:px-6 xl:px-38 py-3 bg-[var(--color-dark-secondary)] dark:bg-[var(--color-bg)] flex flex-col md:flex-row md:justify-between md:items-center text-xs sm:gap-4 gap-2">
                <p>© All Copyrights 2025 | Shelfy</p>
                <div className="flex sm:gap-3 gap-1">
                    <img src={visa}
                        className="w-14 h-8 py-2 px-3 rounded border hover:border-2  border-slate-400 dark:hover:border-1 dark:hover:border-gray-400 dark:border-gray-500 transition duration-300 shadow-md"
                    />
                    <img src={mastercard}
                        className="w-14 h-8 py-2 px-3 rounded border hover:border-2  border-slate-400 dark:hover:border-1 dark:hover:border-gray-400 dark:border-gray-500 transition duration-300 shadow-md"
                    />
                    <img src={payoneer}
                        className="w-14 h-8 py-2 px-3 rounded border hover:border-2  border-slate-400 dark:hover:border-1 dark:hover:border-gray-400 dark:border-gray-500 transition duration-300 shadow-md"
                    />
                    <img src={affirm}
                        className="w-14 h-8 py-2 px-3 rounded border hover:border-2  border-slate-400 dark:hover:border-1 dark:hover:border-gray-400 dark:border-gray-500 transition duration-300 shadow-md"
                    />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
