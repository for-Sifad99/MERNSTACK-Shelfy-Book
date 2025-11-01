import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router';
import { MdLogout, MdEmail, MdDashboard } from "react-icons/md";
import useAuth from '../../hooks/UseAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { getUserByEmail } from '../../api/userApis';
import avatar from '../../assets/avatarImg/avatar.jpg';
import Swal from "sweetalert2";
import { useUserCreation } from '../../contexts/UserCreationContext';

// Shared profile component for header navigation
const Profile = () => {
    const { signOutUser, user } = useAuth();
    const { userCreationStatus } = useUserCreation();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [clickedOpen, setClickedOpen] = useState(false); // track click
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminLoading, setIsAdminLoading] = useState(true);
    const modalRef = useRef(null);
    const profileRef = useRef(null);

    // Check if user needs email verification
    const needsEmailVerification = user && !user.emailVerified && user.providerData[0]?.providerId === 'password';

    // Check if user is admin
    useEffect(() => {
        const checkAdminStatus = async () => {
            // Reset loading state
            setIsAdminLoading(true);
            
            // Check admin status if we have a user
            if (user?.email) {
                console.log('Checking admin status for user:', user.email);
                try {
                    // Always check the database for the current user's role
                    const userData = await getUserByEmail(axiosSecure, user.email);
                    console.log('User data retrieved:', userData);
                    const isAdminUser = userData.role === 'admin';
                    setIsAdmin(isAdminUser);
                    setIsAdminLoading(false);
                    
                    // If user was admin but is now user, redirect to user dashboard
                    if (!isAdminUser && window.location.pathname.includes('/admin-dashboard')) {
                        navigate('/user-dashboard');
                    }
                    
                    // If user was user but is now admin, redirect to admin dashboard
                    if (isAdminUser && window.location.pathname.includes('/user-dashboard') && !window.location.pathname.includes('/admin-dashboard')) {
                        navigate('/admin-dashboard');
                    }
                } catch (error) {
                    console.error('Error checking user role:', error);
                    // If user not found (404), this means they exist in Firebase but not in our database
                    if (error.response?.status === 404) {
                        // User not found in database
                        // This could happen if user was manually added to Firebase or creation failed
                        // In this case, we should redirect them to register or handle appropriately
                        console.log('User not found in database, assuming regular user');
                        setIsAdmin(false);
                    } else {
                        // For other errors, assume not admin for security
                        setIsAdmin(false);
                    }
                    setIsAdminLoading(false);
                }
            } else {
                // No user, reset admin status
                setIsAdmin(false);
                setIsAdminLoading(false);
            }
        };

        checkAdminStatus();
        
        // Also check periodically to catch role changes
        const interval = setInterval(checkAdminStatus, 5000); // Check every 5 seconds
        
        // Listen for role change events
        const handleRoleChange = () => {
            checkAdminStatus();
        };
        
        window.addEventListener('roleChange', handleRoleChange);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('roleChange', handleRoleChange);
        };
    }, [user, axiosSecure, navigate]);

    const handleSignOut = async () => {
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

    const handleVerifyEmail = () => {
        navigate('/email-verification');
        setIsOpen(false);
        setClickedOpen(false);
    };

    const handleAdminDashboard = () => {
        navigate('/admin-dashboard');
        setIsOpen(false);
        setClickedOpen(false);
    };

    const handleUserDashboard = () => {
        navigate('/user-dashboard');
        setIsOpen(false);
        setClickedOpen(false);
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

    // Get user display name
    const getUserDisplayName = () => {
        if (user) {
            return user.displayName || user.email || "User";
        }
        return "User";
    };

    // Get user email
    const getUserEmail = () => {
        if (user && user.email) {
            return user.email;
        }
        return "User Email";
    };

    // Get user photo URL with fallback for broken images
    const getUserPhotoURL = () => {
        if (user && user.photoURL) {
            return user.photoURL;
        }
        return avatar;
    };

    // Handle broken image URLs by falling back to default avatar
    const handleImageError = (e) => {
        e.target.src = avatar;
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
                src={getUserPhotoURL()}
                alt="User"
                onClick={handleProfileClick}
                onError={handleImageError}
                className="w-[35px] h-[35px] rounded-full border-2 border-[#e0e0e0] dark:border-[#3f3f3f] cursor-pointer"
            />

            {/* Modal */}
            {isOpen && (
                <div
                    ref={modalRef}
                    className="absolute top-10 md:top-13 sm:top-11 right-0 w-54 bg-white dark:bg-[#343a46] shadow-sm rounded-md p-4 z-50"
                >
                    <div className="flex items-center gap-2">
                        <img
                            src={getUserPhotoURL()}
                            alt="Large User"
                            onError={handleImageError}
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h2 className="text-base font-semibold text-[var(--color-dark-primary)] dark:text-white">
                                {getUserDisplayName()}
                            </h2>
                            <h2 className="text-xs text-gray-600 dark:text-gray-300">
                                {getUserEmail()}
                            </h2>
                        </div>
                    </div>
                    
                    {/* Email verification warning */}
                    {needsEmailVerification && (
                        <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-xs text-yellow-800 dark:text-yellow-200">
                            <div className="flex items-center">
                                <MdEmail className="mr-1" />
                                <span>Email not verified</span>
                            </div>
                            <button 
                                onClick={handleVerifyEmail}
                                className="mt-1 text-blue-600 dark:text-blue-300 hover:underline"
                            >
                                Verify now
                            </button>
                        </div>
                    )}
                    
                    <hr className="text-gray-300 dark:text-gray-600 mt-3 mb-2" />
                    
                    {/* Dashboard Link */}
                    {user && (
                        <button
                            onClick={isAdmin ? handleAdminDashboard : handleUserDashboard}
                            className="text-sm w-full flex gap-2 items-center text-gray-500 dark:text-gray-300 py-1 pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                            disabled={isAdminLoading}
                        >
                            <MdDashboard /> 
                            {isAdminLoading ? (
                                <span>Loading...</span>
                            ) : isAdmin ? (
                                'Admin Dashboard'
                            ) : (
                                'User Dashboard'
                            )}
                        </button>
                    )}
                    
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