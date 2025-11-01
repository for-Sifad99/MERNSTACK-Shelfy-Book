import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/UseAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { getUserByEmail } from '../api/userApis';
import Loader from '../pages/Shared/Loader';

// Admin route component to protect admin-only routes with enhanced security
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [isAdminLoading, setIsAdminLoading] = React.useState(true);
    const location = useLocation();

    React.useEffect(() => {
        // If user is null and loading is false, we can determine the user is not logged in
        if (!user && !loading) {
            setIsAdminLoading(false);
            return;
        }

        const checkAdminStatus = async () => {
            if (user?.email) {
                try {
                    const userData = await getUserByEmail(axiosSecure, user.email);
                    setIsAdmin(userData.role === 'admin');
                } catch (error) {
                    console.error('Error checking admin status:', error);
                    // If user not found (404), they're not an admin
                    if (error.response?.status === 404) {
                        setIsAdmin(false);
                    } else {
                        // For other errors, assume not admin for security (fail-safe approach)
                        setIsAdmin(false);
                    }
                } finally {
                    setIsAdminLoading(false);
                }
            } else {
                setIsAdminLoading(false);
            }
        };

        if (user && !loading) {
            checkAdminStatus();
        }
    }, [user, loading, axiosSecure]);

    // Show loader while checking auth status
    if (loading || isAdminLoading) {
        return <Loader />;
    }

    // If user is not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user is not admin, redirect to home for security (fail-safe approach)
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    // If user is admin, render the children
    return children;
};

export default AdminRoute;