import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { auth } from '../../firebase/firebase.config';
import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    sendPasswordResetEmail, 
    updateProfile, 
    signOut, 
    onAuthStateChanged, 
    sendEmailVerification 
} from 'firebase/auth';
import { UserCreationProvider } from './UserCreationContext';
import { getFirebaseErrorMessage, isTooManyRequestsError } from '../utils/firebaseErrorUtils';

// AuthProvider component to manage authentication state and functions
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper functions for loading state
    const startLoading = useCallback(() => {
        setLoading(true);
    }, []);

    const stopLoading = useCallback(() => {
        setLoading(false);
    }, []);

    // Memoize Google provider to prevent recreation on each render
    const googleProvider = useMemo(() => new GoogleAuthProvider(), []);

    // Create User with email and password
    const createUser = useCallback(async (email, password) => {
        startLoading();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error) {
            // Re-throw error with user-friendly message
            throw new Error(getFirebaseErrorMessage(error));
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    // Create User with Google
    const createGoogleUser = useCallback(async () => {
        startLoading();
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            return userCredential;
        } catch (error) {
            // Re-throw error with user-friendly message
            throw new Error(getFirebaseErrorMessage(error));
        } finally {
            stopLoading();
        }
    }, [googleProvider, startLoading, stopLoading]);

    // Sign In User with email and password
    const signInUser = useCallback(async (email, password) => {
        startLoading();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error) {
            // Re-throw error with user-friendly message
            throw new Error(getFirebaseErrorMessage(error));
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    // Reset Password
    const forgotPassword = useCallback(async (email) => {
        startLoading();
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            // Re-throw error with user-friendly message
            throw new Error(getFirebaseErrorMessage(error));
        } finally {
            stopLoading();
        }
    }, [startLoading]);

    // Update User Profile
    const profileUpdate = useCallback(async (currentUser, updatedObj) => {
        startLoading();
        try {
            await updateProfile(currentUser, updatedObj);
        } catch (error) {
            // Re-throw error with user-friendly message
            throw new Error(getFirebaseErrorMessage(error));
        } finally {
            stopLoading();
        }
    }, [startLoading]);

    // Send Email Verification
    const sendVerificationEmail = useCallback(async (user) => {
        startLoading();
        try {
            // Check if we're being called too frequently
            const lastSent = localStorage.getItem('lastVerificationEmailSent');
            const now = Date.now();
            
            // If less than 1 minute has passed, reject the request
            if (lastSent && (now - parseInt(lastSent)) < 60000) {
                throw new Error('Please wait before requesting another verification email');
            }
            
            const result = await sendEmailVerification(user);
            
            // Store the time we sent the email with safe localStorage operation
            try {
                localStorage.setItem('lastVerificationEmailSent', now.toString());
            } catch (error) {
                console.warn('Failed to set item in localStorage for key: lastVerificationEmailSent', error);
            }
            
            return result;
        } catch (error) {
            // Handle quota exceeded error specifically
            if (isTooManyRequestsError(error)) {
                throw new Error('Too many requests. Please wait a while before requesting another verification email.');
            }
            // Re-throw error with user-friendly message
            throw new Error(getFirebaseErrorMessage(error));
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    // Sign Out User
    const signOutUser = useCallback(async () => {
        startLoading();
        try {
            await signOut(auth);
        } catch (error) {
            // Re-throw error with user-friendly message
            throw new Error(getFirebaseErrorMessage(error));
        } finally {
            stopLoading();
        }
    }, [startLoading]);

    // Auth State Observer
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            stopLoading();
        });

        return () => {
            unSubscribe();
        };
    }, [stopLoading]);

    // Memoize authInfo to prevent unnecessary re-renders
    const authInfo = useMemo(() => ({
        loading,
        user,
        setUser,
        createUser,
        createGoogleUser,
        signInUser,
        forgotPassword,
        profileUpdate,
        sendVerificationEmail,
        signOutUser
    }), [loading, user, createUser, createGoogleUser, signInUser, forgotPassword, profileUpdate, sendVerificationEmail, signOutUser]);

    return (
        <AuthContext.Provider value={authInfo}>
            <UserCreationProvider>
                {children}
            </UserCreationProvider>
        </AuthContext.Provider>
    );
};

export default AuthProvider;