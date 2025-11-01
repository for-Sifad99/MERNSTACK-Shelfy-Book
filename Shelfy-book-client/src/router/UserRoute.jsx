import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/UseAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { getUserByEmail } from '../api/userApis';
import Loader from '../pages/Shared/Loader';

// User route component to protect user-only routes with enhanced security
const UserRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isUser, setIsUser] = React.useState(false);
    const [isUserLoading, setIsUserLoading] = React.useState(true);
    const location = useLocation();

    React.useEffect(() => {
        // If user is null and loading is false, we can determine the user is not logged in
        if (!user && !loading) {
            setIsUserLoading(false);
            return;
        }

        const checkUserRole = async () => {
            if (user?.email) {
                try {
                    const userData = await getUserByEmail(axiosSecure, user.email);
                    // Regular users have role 'user' or undefined (for legacy users)
                    setIsUser(userData.role === 'user' || userData.role === undefined);
                } catch (error) {
                    console.error('Error checking user role:', error);
                    // If user not found (404), they're not a regular user
                    if (error.response?.status === 404) {
                        setIsUser(false);
                    } else {
                        // For other errors, assume not a regular user for security (fail-safe approach)
                        setIsUser(false);
                    }
                } finally {
                    setIsUserLoading(false);
                }
            } else {
                setIsUserLoading(false);
            }
        };

        if (user && !loading) {
            checkUserRole();
        }
    }, [user, loading, axiosSecure]);

    // Show loader while checking auth status
    if (loading || isUserLoading) {
        return <Loader />;
    }

    // If user is not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user is admin, redirect to admin dashboard (prevent admin access to user routes)
    if (!isUser) {
        return <Navigate to="/admin-dashboard" replace />;
    }

    // If user is a regular user, render the children
    return children;
};

export default UserRoute;