import React from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import errorImg from "../../assets/404ErrorIllustration/errorImg.jpg";
import { Typewriter } from "react-simple-typewriter";


const ErrorPage = () => {
    return <>
        {/* Helmet */}
        <Helmet>
            <title>Lost in Books? - Shelfy</title>
            <meta name="description" content="Oopsie! Can’t find the page. Let’s get you back to books." />
        </Helmet>

        {/* Content */}
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white sm:py-10 md:py-0 md:px-6 px-3 md:gap-0 gap-4">
            {/* Left Side */}
            <div className="w-full md:w-1/2 text-center md:text-left sm:space-y-2">
                <p className="text-sm sm:text-lg md:text-base lg:text-xl text-gray-400 font-semibold uppercase md:pl-2">
                    ERROR CODE: 404
                </p>

                <h1 className="text-5xl sm:text-[82px] md:text-6xl lg:text-[88px] xl:text-[110px] font-bold text-black">
                    <span className='text-[#ff735c]'>OOO</span>PS!!
                </h1>

                {/* the typewriter effect */}
                <p className="text-xl sm:text-4xl md:text-2xl lg:text-3xl xl:text-[44px] xl:max-w-[540px] text-black">
                    <Typewriter
                        words={["This is not the page you are looking for"]}
                        loop={Infinity}
                        cursor
                        cursorStyle="_"
                        typeSpeed={50}
                        deleteSpeed={0}
                        delaySpeed={1000}
                    />
                </p>

                <p className="text-sm lg:text-base text-gray-500 pt-2 md:pt-0 lg:pt-0 xl:pt-2">
                    Here are a helpful link to back instead:
                </p>

                <div className="pt-1 lg:pt-0 xl:pt-1">
                    <Link
                        to="/"
                        className="lg:text-lg text-blue-600 underline font-medium hover:text-blue-800 transition"
                    >
                        Home
                    </Link>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full sm:max-w-[600px] md:w-1/2 flex justify-center items-center">
                <img
                    src={errorImg}
                    alt="404 Illustration"
                    className="w-full"
                />
            </div>
        </div>
    </>
};

export default ErrorPage;
