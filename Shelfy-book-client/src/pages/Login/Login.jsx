import React, { useCallback, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import leftBook from '../../assets/commonBanners/leftBook.png';
import rightBook from '../../assets/commonBanners/rightBook.png';
import { IoIosArrowForward } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { getUserByEmail, createUser as createDbUser } from "../../api/userApis";
import { useUserCreation } from "../../contexts/UserCreationContext";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrorUtils";

// Login component with enhanced authentication flow
const Login = () => {
    const { setUser, signInUser, createGoogleUser, forgotPassword, signOutUser } = useAuth();
    const { setUserCreated } = useUserCreation();
    const axiosSecure = useAxiosSecure();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const emailRef = useRef();
    const location = useLocation();
    const from = location?.state || '/';

    // Function to insert user into database (for Google login)
    const insertUserIntoDatabase = useCallback(async (user) => {
        try {
            const userData = {
                name: user.displayName || '',
                email: user.email,
                photo: user.photoURL || '',
                role: 'user'
            };
            
            const result = await createDbUser(axiosSecure, userData);
            
            // Set the user creation status in context
            setUserCreated(user.email);
            
            return result;
        } catch (dbError) {
            // If user already exists, the API will return a 409 conflict
            // This is expected and fine - it means the user is already in the database
            if (dbError.response?.status === 409) {
                // Set flag even for existing users
                setUserCreated(user.email);
                return;
            } else {
                toast.error('Failed to save user information. Please contact support.');
                throw dbError; // Re-throw the error so the calling function knows it failed
            }
        }
    }, [axiosSecure, setUserCreated]);

    // Memoized login handler
    const handleLogin = useCallback(async (e) => {
        e.preventDefault();

        // Form data:
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            const userCredential = await signInUser(email, password);
            const currentUser = userCredential.user;

            // Check if email is verified for email/password users
            if (!currentUser.emailVerified && currentUser.providerData[0]?.providerId === 'password') {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                    icon: "warning",
                    title: "Email not verified! Please check your email for verification link."
                });
                
                // Redirect to email verification page
                setTimeout(() => {
                    navigate('/email-verification');
                }, 3000);
                return;
            }

            // For email/password login, ensure user exists in our database
            try {
                const dbResult = await insertUserIntoDatabase(currentUser);
                console.log('User verified in database:', dbResult);
            } catch (insertError) {
                // If we can't insert the user into the database, we should sign them out
                try {
                    await signOutUser();
                } catch (signOutError) {
                    console.error('Failed to sign out user:', signOutError);
                }
                toast.error('Failed to verify account. Please try again.');
                return;
            }

            // Check if user is admin
            try {
                const userData = await getUserByEmail(axiosSecure, currentUser.email);
                // Dispatch role change event to update UI components
                window.dispatchEvent(new Event('roleChange'));
                if (userData.role === 'admin') {
                    // Redirect admin users to admin dashboard
                    setTimeout(() => {
                        navigate('/admin-dashboard');
                    }, 300);
                } else {
                    // Redirect regular users to user dashboard
                    setTimeout(() => {
                        navigate('/user-dashboard');
                    }, 300);
                }
            } catch (error) {
                // If user not found (404), this means they exist in Firebase but not in our database
                if (error.response?.status === 404) {
                    // This is an edge case - user exists in Firebase but not in our database
                    // We should sign them out and prompt them to register
                    toast.error('Account not found in our system. Please register first.');
                    try {
                        await signOutUser();
                    } catch (signOutError) {
                        console.error('Failed to sign out user:', signOutError);
                    }
                    // Redirect to register page
                    setTimeout(() => {
                        navigate('/register');
                    }, 300);
                } else {
                    // For other errors, redirect to user dashboard as fallback
                    // Dispatch role change event to update UI components
                    window.dispatchEvent(new Event('roleChange'));
                    setTimeout(() => {
                        navigate('/user-dashboard');
                    }, 300);
                }
            }

            // Success notification
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: "success",
                title: "Logged in successfully!!"
            });

            setUser(currentUser);
        }

        // Error handling
        catch (err) {
            console.error('Login error:', err);
            const errorMessage = getFirebaseErrorMessage(err);
            toast.error(errorMessage);
        }
    }, [signInUser, setUser, navigate, axiosSecure, signOutUser]);

    // Memoized Google login handler
    const handleGoogleLogin = useCallback(async () => {
        try {
            const userCredential = await createGoogleUser();
            const currentUser = userCredential.user;
            
            // For Google login, we need to ensure the user exists in our database
            // This handles both login and registration cases
            try {
                const dbResult = await insertUserIntoDatabase(currentUser);
                console.log('User verified in database:', dbResult);
            } catch (insertError) {
                // If we can't insert the user into the database, we should sign them out
                try {
                    await signOutUser();
                } catch (signOutError) {
                    console.error('Failed to sign out user:', signOutError);
                }
                toast.error('Failed to create account. Please try again.');
                return;
            }
            
            // Add a small delay to ensure database consistency
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Now that we've ensured the user exists in the database, check their role
            try {
                const userData = await getUserByEmail(axiosSecure, currentUser.email);
                // Dispatch role change event to update UI components
                window.dispatchEvent(new Event('roleChange'));
                if (userData.role === 'admin') {
                    // Redirect admin users to admin dashboard
                    setTimeout(() => {
                        navigate('/admin-dashboard');
                    }, 300);
                } else {
                    // Redirect regular users to user dashboard
                    setTimeout(() => {
                        navigate('/user-dashboard');
                    }, 300);
                }
            } catch (error) {
                // If user not found (404), this means they exist in Firebase but not in our database
                if (error.response?.status === 404) {
                    // This is expected for new Google users - assume regular user role
                    // Dispatch role change event to update UI components
                    window.dispatchEvent(new Event('roleChange'));
                    setTimeout(() => {
                        navigate('/user-dashboard');
                    }, 300);
                } else {
                    // For other errors, redirect to user dashboard as fallback
                    // Dispatch role change event to update UI components
                    window.dispatchEvent(new Event('roleChange'));
                    setTimeout(() => {
                        navigate('/user-dashboard');
                    }, 300);
                }
            }

            // Success notification
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: "success",
                title: "Logged in successfully!!"
            });

            setUser(currentUser);
        } catch (err) {
            console.error('Google login error:', err);
            const errorMessage = getFirebaseErrorMessage(err);
            toast.error(errorMessage);
        }
    }, [createGoogleUser, setUser, navigate, axiosSecure, signOutUser, insertUserIntoDatabase]);

    // Memoized forgot password handler
    const handleForgotPassword = useCallback(async () => {
        const email = emailRef.current.value;

        // Empty email check
        if (!email) {
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: "warning",
                title: "Please enter your email address first."
            });
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: "warning",
                title: "Please enter a valid email address."
            });
            return;
        }

        try {
            await forgotPassword(email);

            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: "success",
                title: "Password reset email sent! Please check your inbox."
            });
        } catch (err) {
            console.error('Password reset error:', err);
            const errorMessage = getFirebaseErrorMessage(err);
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: "error",
                title: errorMessage
            });
        }
    }, [forgotPassword]);

    // Memoized password visibility toggle
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    return (
        <>
            {/* Helmet */}
            <Helmet>
                <title>Log Back In - Shelfy</title>
                <meta name="description" content="Missed us? Hop back in and grab your books!" />
            </Helmet>

            {/* Page Banner */}
            <div className="flex justify-between items-center bg-[#e6eff2] dark:bg-[#19343d] sm:py-6 py-12">
                {/* Left Image */}
                <img
                    src={leftBook}
                    alt="Banner Book1 image"
                    className="hidden sm:block w-48 md:w-54 lg:w-64 pt-10"
                />

                {/* Title and Breadcrumb */}
                <div className="flex flex-col items-center justify-center text-center mx-auto sm:py-0 py-3">
                    <h1 className="text-[#012e4a] dark:text-[var(--color-light-primary)] font-semibold text-2xl md:text-3xl lg:text-4xl">
                        Back Again
                    </h1>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-normal text-gray-600 dark:text-slate-400 sm:mt-1">
                        <Link to="/">Home</Link>
                        <IoIosArrowForward />
                        <span className='text-orange-500 dark:text-orange-300'>Sign In</span>
                    </div>
                </div>

                {/* Right Image */}
                <img
                    src={rightBook}
                    alt="Banner Book2 image"
                    className="hidden sm:block w-28 md:w-34 lg:w-40 pt-10"
                />
            </div>

            {/* Main Content */}
            <div className="flex justify-center items-center py-10 md:px-6 sm:px-20">
                <div className="flex flex-col md:flex-row bg-white dark:bg-[var(--color-bg)] rounded-lg overflow-hidden w-full max-w-5xl shadow-xl shadow-blue-100 dark:shadow-none">
                    {/* Left Side */}
                    <div className="md:w-1/2 bg-gradient-to-br from-[#036280] to-[#03a9db] text-[var(--color-light-primary)] sm:px-8 px-2 md:py-0 sm:py-14 py-10 flex flex-col justify-center items-center space-y-1">
                        <img src="/logo.png" alt="Shelfy Logo" className="w-20 h-20" />
                        <h1 className="sm:text-3xl text-xl font-bold">Welcome back</h1>
                        <h2 className="sm:text-4xl text-2xl font-bold text-[var(--color-dark-primary)]">Shel<span className="text-[var(--color-primary-orange)]">fy</span></h2>
                        <p className="text-center sm:text-sm text-xs px-4 mt-1">
                            Access your bookshelf anytime, anywhere. Pick up right where you left off and keep reading!
                        </p>
                        <div className="flex text-sm gap-1 mt-1  font-bold text-black">
                            <span>TO EXPLORE ACCOUNT </span><Link to="/register" className="underline text-orange-300"> CREATE HERE</Link>
                        </div>
                    </div>

                    {/* Right Side - FORM */}
                    <div className="md:w-1/2 bg-white dark:bg-[#19343d] lg:px-7 md:px-4 sm:pb-10 sm:px-10 px-3 py-8 flex flex-col justify-center">
                        <h2 className="lg:text-5xl md:text-4xl text-3xl md:text-start text-center font-bold text-gray-800 dark:text-[var(--color-light-primary)]  mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                            Login Now!
                        </h2>

                        <form onSubmit={handleLogin} className="sm:space-y-4 space-y-[10px] text-sm">
                            {/* Email */}
                            <div>
                                <input
                                    ref={emailRef}
                                    type="email"
                                    name='email'
                                    placeholder="Email Address"
                                    className="w-full dark:text-gray-300 border-b border-gray-300 dark:border-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 py-1 mt-1 placeholder-gray-500 dark:placeholder-gray-400"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name='password'
                                    placeholder="Password"
                                    className="w-full dark:text-gray-300 border-b border-gray-300 dark:border-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 py-1 mt-1 placeholder-gray-500 dark:placeholder-gray-400"
                                    required
                                />
                                <span
                                    className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-300 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            {/* Remember Me + Forgot Password */}
                            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                <label className="flex items-center font-bold">
                                    <input type="checkbox" className="mr-2" />
                                    Remember me
                                </label>
                                <span onClick={handleForgotPassword} className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                    Forgot password?
                                </span>
                            </div>

                            {/* Submit button */}
                            <button className='relative overflow-hidden group w-full text-white py-[10px] mt-2 font-semibold bg-[var(--color-dark-secondary)] rounded'>
                                <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-primary-orange)] transition-all duration-700 group-hover:w-full z-0"></span>
                                <span className='relative'>
                                    Sign In
                                </span>
                            </button>

                            {/* OR Divider */}
                            <div className="flex items-center justify-center space-x-2 text-gray-400">
                                <hr className="w-1/4 border-gray-300 dark:border-gray-400" />
                                <span>Or</span>
                                <hr className="w-1/4 border-gray-300 dark:border-gray-400" />
                            </div>

                            {/* Google Button */}
                            <button
                                onClick={handleGoogleLogin}
                                type="button"
                                className="w-full dark:bg-white border border-gray-300 dark:border-slate-400 py-2 flex items-center justify-center space-x-2 hover:bg-gray-50 dark:hover:bg-slate-200 transition-all"
                            >
                                <svg className="rounded-full" aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                                <span>Continue With Google</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;