import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext'
import { auth } from '../../firebase/firebase.config'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, updateProfile, signOut, onAuthStateChanged, } from 'firebase/auth';


const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    //? Create User:
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    //? Create User with Goggle:
    const googleProvider = new GoogleAuthProvider();

    const createGoogleUser = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    //? SignIn User:
    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    //? Reset Password:
    const forgotPassword = (email) => {
        setLoading(true);
        return sendPasswordResetEmail(auth, email);
    };

    //? Update User Pofile:
    const profileUpdate = (currentUser, updatedObg) => {
        setLoading(true);
        return updateProfile(currentUser, updatedObg);
    };

    //? SignOut User:
    const signOutUser = () => {
        setLoading(true);
        return signOut(auth);
    };

    //? Observer:
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => {
            unSubscribe();
        };
    }, [user]);

    const authInfo = {
        loading,
        user,
        setUser,
        createUser,
        createGoogleUser,
        signInUser,
        forgotPassword,
        profileUpdate,
        signOutUser
    };

    return <AuthContext.Provider value={authInfo}>
        {children}
    </AuthContext.Provider>  
};

export default AuthProvider;