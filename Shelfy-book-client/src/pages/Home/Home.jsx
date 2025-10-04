import React from 'react';
import { Helmet } from 'react-helmet-async';
import Banner from './Banner';
import InfoBanner from './InfoBanner';
import Categories from './Categories';
import HighRatingBooks from './HighRating';
import LatestNews from './LatestNews';


const Home = () => {
    return (
        <>
            {/* Helmet */}
            <Helmet>
                <title>Book Vibes Start Here - Shelfy</title>

                <meta name="description" content="Welcome to Shelfy - Discover, borrow, and manage books with ease. Your digital library experience starts here!" />
            </Helmet>

            {/* Content */}
            <section className='max-w-[1600px] mx-auto'>
                {/* Content */}
                <Banner />

                {/* Info Banner */}
              <InfoBanner />

                {/* Categories */}
                <Categories />

                {/* High Rating Books Collection */}
                <HighRatingBooks />

                {/* Latest Newses */}
                <LatestNews />
            </section>
        </>
    );
};

export default Home;