import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { MdLogout } from "react-icons/md";
import Swal from "sweetalert2";
import useAuth from '../../hooks/useAuth';


const Profile = () => {
    const { signOutUser, user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [clickedOpen, setClickedOpen] = useState(false); // track click
    const modalRef = useRef(null);
    const profileRef = useRef(null);

    const handleSignOut = async () => {
        // Sweet Alert:
        Swal.fire({
            title: "Are you sure?",
            text: "You want to logout!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Logout"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await signOutUser();
                navigate('/login');
                Swal.fire({
                    title: "Logged out!",
                    text: "You are successfully logged out.",
                    icon: "success"
                });
            };
        });
    };

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target) &&
                !profileRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setClickedOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleMouseEnter = () => {
        if (!clickedOpen) {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (!clickedOpen) {
            setIsOpen(false);
        }
    };

    const handleProfileClick = () => {
        setClickedOpen(!clickedOpen);
        setIsOpen(!clickedOpen);
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Profile Picture */}
            <img
                ref={profileRef}
                src={user?.photoURL}
                alt="User"
                onClick={handleProfileClick}
                className="sw-[35px] h-[35px] rounded-full border-2 border-[#e0e0e0] dark:border-[#3f3f3f] cursor-pointer"
            />

            {/* Modal */}
            {isOpen && (
                <div
                    ref={modalRef}
                    className="absolute top-10 md:top-13 sm:top-11 right-0 w-54 bg-white dark:bg-[#343a46] shadow-sm rounded-md p-4 z-50"
                >
                    <div className="flex items-center gap-2">
                        <img
                            src={user?.photoURL}
                            alt="Large User"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h2 className="text-base font-semibold text-[var(--color-dark-primary)] dark:text-white">
                                {user?.displayName || "User Name"}
                            </h2>
                            <h2 className="text-xs text-gray-600 dark:text-gray-300">
                                {user?.email || "User Email"}
                            </h2>
                        </div>
                    </div>
                    <hr className="text-gray-300 dark:text-gray-600 mt-3 mb-2" />
                    <button
                        onClick={handleSignOut}
                        className="text-sm w-full flex gap-2 items-center text-gray-500 dark:text-gray-300 py-1 pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                    >
                        <MdLogout />  Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;
