import React from 'react';
import {
    FaTruck,
    FaLock,
    FaHeadset,
    FaPercent
} from 'react-icons/fa';

// Banner info data
const InfoBanner = () => {
    const items = [
        {
            icon: <FaTruck size={24} />,
            title: 'Return & Refund',
            subtitle: 'Money back guarantee',
        },
        {
            icon: <FaLock size={24} />,
            title: 'Secure Payment',
            subtitle: '30% off by subscribing',
        },
        {
            icon: <FaHeadset size={24} />,
            title: 'Quality Support',
            subtitle: 'Always online 24/7',
        },
        {
            icon: <FaPercent size={24} />,
            title: 'Daily Offers',
            subtitle: '20% off by subscribing',
        },
    ];

    return (
        <div className="bg-[#d8e9ef] dark:bg-[#075a75] p-4 rounded-md flex flex-col justify-center items-center sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-4 sm:mx-6 md:mx-12 lg:mx-6 xl:mx-38 my-16 sm:my-20 max-w-[400px] sm:max-w-full">
            {items.map((item, index) => (
                <div key={index} className="flex items-start gap-3 w-full md:w-auto">
                    <div className="bg-[#075a75] dark:bg-[#d8e9ef] text-white dark:text-[#075a75] p-3 rounded-md">
                        {item.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-white">{item.title}</h4>
                        <p className="text-sm sm:text-xs text-gray-600 dark:text-gray-300">{item.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InfoBanner;
