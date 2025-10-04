import React, { useEffect, useState } from 'react';
import { FaAngleUp } from "react-icons/fa6";

const Scroll = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top with delay and slow effect
    const handleScrollToTop = () => {
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }, 300); 
    };

    return  <>
            {
                isVisible &&
                <FaAngleUp
                    onClick={handleScrollToTop}
                    className="text-4xl fixed lg:bottom-12 bottom-9 md:right-10 right-3 bg-[#036280] text-white rounded-xl z-50 hover:bg-[#034e80] transition-all duration-300 hover:-translate-y-2 p-[10px] shadow-lg cursor-pointer"
                />
            }
        </>
};

export default Scroll;
