import React from 'react';
import { Outlet } from 'react-router';
import Header from '../pages/Shared/Header';
import Footer from '../pages/Shared/Footer';
import Scroll from '../pages/Shared/Scroll';


const Root = () => {
    return (
            <section className='dark:bg-[var(--color-bg)]'>
                <Header />
                    <Outlet />
                    {/* Top scroll button */}
                    <Scroll />
                <Footer />
            </section>

    );
};

export default Root;