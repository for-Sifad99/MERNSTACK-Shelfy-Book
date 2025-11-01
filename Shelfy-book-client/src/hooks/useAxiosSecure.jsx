import { useCallback, useMemo } from 'react';
import axios from 'axios';
import useAuth from './UseAuth';

const useAxiosSecure = () => {
    const { user } = useAuth();

    // Memoize axios instance to prevent recreation on each render
    const axiosInstance = useMemo(() => axios.create({
        baseURL: `${import.meta.env.VITE_server_url}/api/`
    }), []);

    // Memoize token refresh function with exponential backoff
    const refreshTokenWithBackoff = useCallback(async (user) => {
        try {
            // Implement exponential backoff with a maximum of 3 attempts
            let delay = 1000;
            let attempts = 0;
            const maxAttempts = 3;
            
            while (attempts < maxAttempts) {
                try {
                    const token = await user.getIdToken(true);
                    return token;
                } catch (error) {
                    attempts++;
                    if (attempts >= maxAttempts) throw error;
                    
                    // Wait with exponential backoff
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Double the delay for next attempt
                }
            }
        } catch (refreshError) {
            console.error('Error force refreshing Firebase ID token:', refreshError);
            throw refreshError;
        }
    }, []);

    // Request interceptor
    useMemo(() => {
        const interceptor = axiosInstance.interceptors.request.use(async (config) => {
            if (user) {
                try {
                    // Get ID token without force refresh to avoid quota issues
                    const token = await user.getIdToken(false);
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                } catch (error) {
                    console.error('Error getting Firebase ID token:', error);
                    // If we get a quota error, try again with force refresh using backoff
                    // Check if it's a quota exceeded error by looking at error properties
                    if (error && typeof error === 'object' && 
                        (error.code === 'auth/quota-exceeded' ||
                         (error.message && error.message.includes('quota exceeded')) ||
                         (error.response && error.response.status === 429))) {
                        try {
                            const token = await refreshTokenWithBackoff(user);
                            if (token) {
                                config.headers.Authorization = `Bearer ${token}`;
                            }
                        } catch (refreshError) {
                            console.error('Failed to refresh token after quota error:', refreshError);
                        }
                    }
                }
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        // Cleanup interceptor on unmount
        return () => {
            axiosInstance.interceptors.request.eject(interceptor);
        };
    }, [axiosInstance, user, refreshTokenWithBackoff]);

    // Response interceptor
    useMemo(() => {
        const interceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    // Handle 401 errors if needed
                    console.error('Unauthorized access - token may be expired');
                } else if (error.response?.status === 429) {
                    // Handle rate limiting errors
                    console.error('Rate limit exceeded');
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on unmount
        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, [axiosInstance]);

    return axiosInstance;
};

export default useAxiosSecure;