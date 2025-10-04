import React from 'react';
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    return (
        <div className="md:mt-10 sm:mt-0 -mt-3 flex gap-2 justify-center items-center">
            {/* Prev button */}
            <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                
                className={'md:p-[7px] md:text-lg p-[5px] text-base border-2 border-[var(--color-dark-secondary)] text-[var(--color-dark-secondary)] dark:text-white font-medium hover:text-white hover:bg-[var(--color-dark-secondary)] rounded'}
            >
                <FaAngleLeft />
            </button>

            {/* Page number buttons (only 1, 2, 3) */}
            {[...Array(Math.min(totalPages, 3))].map((_, index) => {
                const pageNum = index + 1;
                return (
                    <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`md:px-3 md:py-[2px] md:text-lg px-[10px] py-[1px] text-base border-2 border-[var(--color-dark-secondary)] text-[var(--color-dark-secondary)] dark:text-white font-medium hover:text-white hover:bg-[var(--color-dark-secondary)] rounded ${currentPage === pageNum && 'text-white bg-[var(--color-dark-secondary)]'}`}
                    >
                        {pageNum}
                    </button>
                )
            })}

            {/* Next button */}
            <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={'md:p-[7px] md:text-lg p-[5px] text-base border-2 border-[var(--color-dark-secondary)] text-[var(--color-dark-secondary)] dark:text-white font-medium hover:text-white hover:bg-[var(--color-dark-secondary)] rounded'}
            >
                <FaAngleRight />
            </button>
        </div>
    );
};

export default Pagination;