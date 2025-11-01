import React, { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/UseAuth';
import Loader from '../pages/Shared/Loader';

// Private route component to protect routes that require authentication
const PrivetRouter = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading state while checking auth status
    if (loading) {
        return <Loader />;
    }

    // Memoize navigation decisions for performance
    const navigationDecision = useMemo(() => {
        // If user is not authenticated, redirect to login
        if (!user) {
            return { 
                redirect: true, 
                to: "/login", 
                state: { from: location.pathname } 
            };
        }

        // If user is authenticated but email is not verified for email/password users, redirect to verification page
        if (!user.emailVerified && user.providerData[0]?.providerId === 'password') {
            return { 
                redirect: true, 
                to: "/email-verification" 
            };
        }

        // If user is authenticated and email is verified (or using Google auth), render children
        return { redirect: false };
    }, [user, location.pathname]);

    // Handle navigation decision
    if (navigationDecision.redirect) {
        return <Navigate to={navigationDecision.to} state={navigationDecision.state} replace />;
    }

    return children;
};

export default PrivetRouter;