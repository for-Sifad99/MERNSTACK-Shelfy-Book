import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { getFirebaseErrorMessage, isTooManyRequestsError } from "../../utils/firebaseErrorUtils";

const EmailVerification = () => {
    const { user, sendVerificationEmail, signOutUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    // Check if user is already verified
    useEffect(() => {
        if (user?.emailVerified) {
            // Redirect to home or dashboard
            navigate('/');
        }
    }, [user, navigate]);

    // Cooldown timer effect
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => {
                setCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [cooldown]);

    // Initialize cooldown from localStorage
    useEffect(() => {
        // Safe get item from localStorage
        let lastSent;
        try {
            lastSent = localStorage.getItem('lastVerificationEmailSent');
        } catch (error) {
            console.warn('Failed to get item from localStorage for key: lastVerificationEmailSent', error);
            lastSent = null;
        }
        
        if (lastSent) {
            const now = Date.now();
            const timePassed = now - parseInt(lastSent);
            const timeLeft = Math.max(0, 60000 - timePassed); // 60 seconds cooldown
            
            if (timeLeft > 0) {
                setCooldown(Math.ceil(timeLeft / 1000));
            }
        }
    }, []);

    // Memoized resend email handler
    const handleResendEmail = useCallback(async () => {
        if (user) {
            try {
                setLoading(true);
                await sendVerificationEmail(user);
                
                // Set cooldown
                setCooldown(60);
                
                // Store the time we sent the email with safe localStorage operation
                try {
                    localStorage.setItem('lastVerificationEmailSent', Date.now().toString());
                } catch (error) {
                    console.warn('Failed to set item in localStorage for key: lastVerificationEmailSent', error);
                }
                
                // Success notification
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                    icon: "success",
                    title: "Verification email sent!",
                    text: "Please check your inbox and spam/junk folder."
                });
            } catch (error) {
                console.error("Error sending verification email:", error);
                
                if (error.message.includes('wait')) {
                    toast.warning(error.message);
                } else if (isTooManyRequestsError(error)) {
                    toast.error("Too many requests. Please wait a while before requesting another verification email.");
                    // Set a longer cooldown
                    setCooldown(300); // 5 minutes
                } else {
                    const errorMessage = getFirebaseErrorMessage(error);
                    toast.error(errorMessage);
                }
            } finally {
                setLoading(false);
            }
        }
    }, [user, sendVerificationEmail]);

    // Memoized sign out handler
    const handleSignOut = useCallback(async () => {
        try {
            await signOutUser();
            navigate('/login');
        } catch (error) {
            console.error("Error signing out:", error);
            toast.error("Failed to sign out. Please try again.");
        }
    }, [signOutUser, navigate]);

    // Memoized refresh handler
    const handleRefresh = useCallback(() => {
        window.location.reload();
    }, []);

    // Memoized button text
    const buttonText = useMemo(() => {
        if (loading) return "Sending...";
        if (cooldown > 0) return `Resend available in ${cooldown}s`;
        return "Resend Verification Email";
    }, [loading, cooldown]);

    // Memoized button class
    const buttonClass = useMemo(() => {
        const baseClass = "w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ";
        if (loading || cooldown > 0) {
            return baseClass + "bg-gray-400 dark:bg-gray-600 cursor-not-allowed";
        }
        return baseClass + "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
    }, [loading, cooldown]);

    // Loading state
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Email Verification - Shelfy</title>
                <meta name="description" content="Verify your email address to continue using Shelfy" />
            </Helmet>

            <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Email Verification Required
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Please check your email (<span className="font-semibold">{user.email}</span>) and click the verification link to activate your account.
                        </p>

                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    <strong>Tip:</strong> If you don't see the email, please check your spam/junk folder.
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="mx-auto bg-gray-200 dark:bg-gray-700 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Didn't receive the email?
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleResendEmail}
                                disabled={loading || cooldown > 0}
                                className={buttonClass}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : buttonText}
                            </button>

                            <button
                                onClick={handleSignOut}
                                className="w-full text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                            >
                                Sign Out
                            </button>
                        </div>

                        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                            <p>
                                After verifying your email, you can{" "}
                                <button 
                                    onClick={handleRefresh} 
                                    className="text-blue-600 hover:underline dark:text-blue-500"
                                >
                                    refresh this page
                                </button>{" "}
                                to continue.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EmailVerification;