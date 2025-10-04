import { FaCalendarAlt, FaUser } from "react-icons/fa";
import news1 from '../../assets/latestNews/news1.jpg';
import news2 from '../../assets/latestNews/news2.jpg';
import news3 from '../../assets/latestNews/news3.jpg';
import news4 from '../../assets/latestNews/news4.jpg';

// News data
const newsData = [
    {
        id: 1,
        title: "Montes Suspendisse Massa Curae Malesuada",
        date: "Feb 10, 2024",
        author: "Admin",
        img: news1,
    },
    {
        id: 2,
        title: "Playful Picks Paradise: Kids’ Essentials With Dash.",
        date: "Mar 20, 2024",
        author: "Admin",
        img: news2,
    },
    {
        id: 3,
        title: "Tiny Emporium: Playful Picks For Kids’ Delightful Days.",
        date: "Jun 14, 2024",
        author: "Admin",
        img: news3,
    },
    {
        id: 4,
        title: "Eu Parturient Dictumst Fames Quam Tempor",
        date: "Mar 12, 2024",
        author: "Admin",
        img: news4,
    },
];

const LatestNews = () => {
    return (
        <section className="bg-[#dce9ee] dark:bg-[#2d343f] px-4 py-12 sm:py-20">
            <div className="text-center sm:mb-10 mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold  dark:text-[var(--color-light-primary)] sm:mb-2 mb-1">Our Latest News</h2>
                <p className="sm:text-sm text-xs text-gray-600 dark:text-gray-300">
                    Stay updated with our most recent stories, tips, and highlights—handpicked just for you. <span className="hidden sm:block">
                        Explore what's happening, what's trending, and what's inspiring right now.</span>
                </p>
            </div>

            <div className="lg:max-w-5xl md:max-w-2xl sm:max-w-xl w-full mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
                {newsData.map((item) => (
                    <div
                        key={item.id}
                        className=" bg-white dark:bg-[#075a75] rounded-lg shadow-md overflow-hidden  transition-all duration-400 group hover:-translate-y-2"
                    >
                        <div className="relative">
                            <img src={item.img} alt={item.title} className="w-full sm:h-40 h-[10%] object-cover p-3 rounded group-hover:scale-104 transition-all duration-400" />
                            <span className="absolute top-4 left-4 bg-sky-600 text-white text-[10px] sm:text-xs  px-2 py-1 rounded">
                                Activities
                            </span>
                        </div>
                        <div className="px-4 pb-2">
                            <div className="flex items-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-200 text-semibold mb-1 gap-4">
                                <div className="flex items-center gap-1">
                                    <FaCalendarAlt />
                                    <span>{item.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaUser />
                                    <span>By {item.author}</span>
                                </div>
                            </div>
                            <h3 className="text-sm sm:text-xs font-semibold text-gray-800 dark:text-white">{item.title}</h3>
                            <a
                                href="#"
                                className="text-sky-600 dark:text-blue-300 text-sm sm:text-xs font-medium hover:underline inline-flex items-center gap-1"
                            >
                                Read More →
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default LatestNews;
