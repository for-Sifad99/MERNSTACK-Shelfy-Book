import React from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const axiosInstance = axios.create({
    baseURL: 'https://shelfy-book-server.vercel.app/'
});
const useAxiosSecure = () => {
    const { user, signOutUser } = useAuth();

    // request interceptor
    axiosInstance.interceptors.request.use(config => {
        if (user?.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`;
        };
        return config;
    });

    // response interceptor 
    axiosInstance.interceptors.response.use(response => {
        return response;
    }, error => {
        if (error.status === 401) {
            signOutUser()
                .then(() => {
                    console.log('Sign out user for 401 status code!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
        return Promise.reject(error);
    });

    return axiosInstance;
};

export default useAxiosSecure;