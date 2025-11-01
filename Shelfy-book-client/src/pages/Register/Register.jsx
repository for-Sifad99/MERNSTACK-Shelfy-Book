import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import leftBook from '../../assets/commonBanners/leftBook.png';
import rightBook from '../../assets/commonBanners/rightBook.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { createUser as createDbUser } from "../../api/userApis";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrorUtils";
import { useUserCreation } from "../../contexts/UserCreationContext";
import uploadImageToImgBB from "../../utils/imageUpload";

// Register component with enhanced authentication flow
const Register = () => {
    const { setUser, createUser: createAuthUser, createGoogleUser, profileUpdate, sendVerificationEmail, signOutUser } = useAuth();
    const { setUserCreated } = useUserCreation();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    // Memoized password visibility toggle
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    // Handle file selection
    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    }, []);

    // Function to insert user into database
    const insertUserIntoDatabase = useCallback(async (user) => {
        try {
            const result = await createDbUser(axiosSecure, {
                name: user.displayName || '',
                email: user.email,
                photo: user.photoURL || '',
                role: 'user'
            });
            
            // Set the user creation status in context
            setUserCreated(user.email);
            
            // Return the result to ensure the caller knows the operation is complete
            return result;
        } catch (dbError) {
            // If user already exists, the API will return a 409 conflict
            // We can ignore this error as it means the user is already in the database
            if (dbError.response?.status !== 409) {
                toast.error('Failed to save user information. Please contact support.');
                throw dbError; // Re-throw to let the caller know about the error
            } else {
                // Even if user exists, set creation status
                setUserCreated(user.email);
                return { status: 'already_exists' };
            }
        }
    }, [axiosSecure, setUserCreated]);

    // Memoized registration handler
    const handleRegister = useCallback(async (e) => {
        e.preventDefault();

        // Form data:
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const checkbox = form.checkbox.checked;
        const fileInput = form.querySelector('input[type="file"]');
        const selectedFile = fileInput?.files[0];

        // empty validation
        if (!name || !email || !password) {
            toast.warning("Please fill in all fields!");
            return;
        } else if (!checkbox) {
            toast.warning("Please Accept terms!");
            return;
        };

        // Check if a file is selected
        if (!selectedFile) {
            toast.warning("Please select a profile picture!");
            return;
        }

        // password validation
        if (password.length < 6) return setError("Password must be at least 6 characters!");
        if (!/[A-Z]/.test(password)) return setError("Include at least one uppercase letter!");
        if (!/[a-z]/.test(password)) return setError("Include at least one lowercase letter!");
        if (!/[0-9]/.test(password)) return setError("Include at least one number!");
        if (!/[!@#$%^&*]/.test(password)) return setError("Include at least one special character!");

        try {
            // Upload the selected file to ImgBB
            let photoURL = '';
            try {
                photoURL = await uploadImageToImgBB(selectedFile);
            } catch (uploadError) {
                console.error('Image upload failed:', uploadError);
                toast.error('Failed to upload profile picture. Please try again.');
                return;
            }
            
            const userCredential = await createAuthUser(email, password);
            const currentUser = userCredential.user;

            // Update displayName and photoURL
            await profileUpdate(currentUser, {
                displayName: name,
                photoURL: photoURL
            });
            
            // Insert user into database and wait for completion
            const dbResult = await insertUserIntoDatabase(currentUser);
            console.log('User successfully created in database:', dbResult);
            
            // Send verification email
            try {
                await sendVerificationEmail(currentUser);
            } catch (verificationError) {
                // If we fail to send verification email, still allow the user to continue
                console.error("Failed to send verification email:", verificationError);
                // We'll still redirect to the verification page where they can request another email
            }
            
            // Set user in context
            setUser(currentUser);
            
            // Sweet Alert:
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "Account created! Please check your email for verification."
            });

            // Dispatch role change event to update UI components
            window.dispatchEvent(new Event('roleChange'));
            // Redirect to email verification page
            setTimeout(() => {
                navigate('/email-verification');
            }, 3000);
        }
        // Error handling
        catch (err) {
            console.error('Registration error:', err);
            const errorMessage = getFirebaseErrorMessage(err);
            toast.error(errorMessage);
        };
    }, [createAuthUser, profileUpdate, sendVerificationEmail, setUser, navigate, insertUserIntoDatabase]);

    // Memoized Google registration handler
    const handleGoogleUser = useCallback(async () => {
        try {
            // For Google registration, we'll use a default avatar if no file is selected
            let photoURL = '';
            // Get the selected file from the form
            const form = document.querySelector('form');
            const fileInput = form?.querySelector('input[type="file"]');
            const selectedFile = fileInput?.files[0];
            
            if (selectedFile) {
                try {
                    photoURL = await uploadImageToImgBB(selectedFile);
                } catch (uploadError) {
                    console.error('Image upload failed:', uploadError);
                    toast.error('Failed to upload profile picture. Please try again.');
                    return;
                }
            } else {
                // Use default avatar or Google profile picture
                photoURL = '';
            }
            
            const userCredential = await createGoogleUser();
            const currentUser = userCredential.user;
            
            // If we have an uploaded photo URL, update the profile
            if (photoURL) {
                await profileUpdate(currentUser, {
                    photoURL: photoURL
                });
            }
            
            // Insert user into database and wait for completion
            const dbResult = await insertUserIntoDatabase(currentUser);
            console.log('User successfully created in database:', dbResult);
            
            // Set user in context
            setUser(currentUser);
            
            // Sweet Alert
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "Account created!"
            });

            // Dispatch role change event to update UI components
            window.dispatchEvent(new Event('roleChange'));
            // For Google sign-in, redirect to user dashboard since email is already verified
            setTimeout(() => {
                navigate('/user-dashboard');
            }, 3000);
        }
        // Error handling
        catch (err) {
            console.error('Google registration error:', err);
            const errorMessage = getFirebaseErrorMessage(err);
            toast.error(errorMessage);
        };
    }, [createGoogleUser, profileUpdate, setUser, navigate, insertUserIntoDatabase]);

    return (
        <>
            {/* Helmet */}
            <Helmet>
                <title>Join the Shelf - Shelfy</title>
                <meta name="description" content="Make an account and start your Shelfy journey!" />
            </Helmet>

            {/* Content */}
            <section className="dark:bg-[var(--color-bg)]">
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
                            Unlock to Learn
                        </h1>
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-normal text-gray-600 dark:text-slate-400 sm:mt-1">
                            <Link to="/">Home</Link>
                            <IoIosArrowForward />
                            <span className='text-orange-500 dark:text-orange-300'>Sign up</span>
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
                            <h1 className="sm:text-3xl text-xl font-bold">Welcome to</h1>
                            <h2 className="sm:text-4xl text-2xl font-bold text-[var(--color-dark-primary)]">Shel<span className="text-[var(--color-primary-orange)]">fy</span></h2>
                            <p className="text-center sm:text-sm text-xs px-4 mt-1">
                                Learn more about our digital library collection. Discover and save
                                your favorite books across the web.
                            </p>
                            <div className="flex text-sm gap-1 mt-1  font-bold text-black">
                                <span>TO EXPLORE FIRST </span><Link to="/login" className="underline text-orange-300"> LOGIN HERE</Link>
                            </div>
                        </div>

                        {/* Right Side - FORM */}
                        <div className="md:w-1/2 bg-white dark:bg-[#19343d] lg:px-7 md:px-4 sm:pb-10 sm:px-10 px-3 py-8 flex flex-col justify-center">
                            <h2 className="lg:text-5xl md:text-4xl text-3xl md:text-start text-center font-bold text-gray-800 dark:text-[var(--color-light-primary)]  mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                                Create One!
                            </h2>

                            <form onSubmit={handleRegister} className="sm:space-y-4 space-y-[10px] text-sm">
                                {/* Name */}
                                <div>
                                    <input
                                        type="text"
                                        name='name'
                                        placeholder="Full Name"
                                        className="w-full dark:text-gray-300 border-b border-gray-300 dark:border-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 py-1 mt-1 placeholder-gray-500 dark:placeholder-gray-400"
                                        required
                                    />
                                </div>

                                {/* Photo URL */}
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full dark:text-gray-300 border-b border-gray-300 dark:border-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 py-1 mt-1 placeholder-gray-500 dark:placeholder-gray-400"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select a profile picture</p>
                                </div>

                                {/* Email */}
                                <div>
                                    <input
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

                                {/* Error showing */}
                                {
                                    error &&
                                    <p className="text-orange-500 dark:text-orange-300 lg:text-sm md:text-xs sm:text-sm text-xs">⚠️ {error}</p>
                                }

                                {/* Terms */}
                                <label className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    <input type="checkbox" name='checkbox' className="mr-2" required />
                                    I Accept Terms & Conditions
                                </label>

                                {/* Submit button */}
                                <button className='relative overflow-hidden group w-full text-white py-[10px] mt-2 font-semibold bg-[var(--color-dark-secondary)] rounded'>
                                    <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-primary-orange)] transition-all duration-700 group-hover:w-full z-0"></span>
                                    <span className='relative'>
                                        Sign Up
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
                                    onClick={handleGoogleUser}
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
            </section>
        </>
    );
};

export default Register;