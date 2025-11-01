import React from 'react';
import {
    createBrowserRouter,
} from "react-router";
import PrivetRouter from '../router/PrivetRouter';
import AdminRoute from '../router/AdminRoute';
import UserRoute from '../router/UserRoute';
import Root from '../layouts/Root';
import Home from '../pages/Home/Home';
import AllBooks from '../pages/AllBooks/AllBooks';
import MyBooks from '../pages/MyBooks/MyBooks';
import BorrowedBooks from '../pages/BorrowedBooks/BorrowedBooks';
import Blogs from '../pages/Blogs/Blogs';
import AddBooks from '../pages/AddBooks/AddBooks';
import CategoryBooks from '../pages/CategoryBooks/CategoryBooks';
import BookDetails from '../pages/BookDetails/BookDetails';
import UpdateBook from '../pages/UpdateBook/UpdateBook';
import Register from '../pages/Register/Register';
import Login from '../pages/Login/Login';
import EmailVerification from '../pages/EmailVerification/EmailVerification';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import AdminDashboardLayout from '../layouts/AdminDashboardLayout';
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';
import Settings from '../pages/AdminDashboard/Settings';
import AdminProfile from '../pages/AdminDashboard/Profile';
import ManageBooks from '../pages/AdminDashboard/ManageBooks';
import ManageUsers from '../pages/AdminDashboard/ManageUsers';
import UserDashboardLayout from '../layouts/UserDashboardLayout';
import UserDashboard from '../pages/UserDashboard/UserDashboard';
import UserProfile from '../pages/UserDashboard/Profile';
import MyLibrary from '../pages/UserDashboard/MyLibrary';

const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: '/all-books',
                element: <AllBooks />
            },
            {
                path: '/my-books',
                element: <PrivetRouter><MyBooks /></PrivetRouter>
            },
            {
                path: '/add-Books',
                element: <PrivetRouter><AddBooks /></PrivetRouter>
            },
            {
                path: '/borrowed-Books',
                element: <PrivetRouter><BorrowedBooks /></PrivetRouter>
            },
            {
                path: '/blogs',
                element: <Blogs />
            },
            {
                path: '/category-Books/:category',
                element: <CategoryBooks />
            },
            {
                path: '/book-details/:id',
                element: <PrivetRouter><BookDetails /></PrivetRouter>
            },
            {
                path: '/update-Book/:id',
                element: <PrivetRouter><UpdateBook /></PrivetRouter>
            },
            {
                path: '/register',
                Component: Register
            },
            {
                path: '/login',
                Component: Login
            },
            {
                path: '/email-verification',
                Component: EmailVerification
            },
        ]
    },
    {
        path: "/admin-dashboard",
        element: <AdminRoute><AdminDashboardLayout /></AdminRoute>,
        children: [
            {
                index: true,
                element: <AdminDashboard />
            },
            {
                path: 'manage-books',
                element: <ManageBooks />
            },
            {
                path: 'manage-users',
                element: <ManageUsers />
            },
            {
                path: 'profile',
                element: <AdminProfile />
            },
            {
                path: 'settings',
                element: <Settings />
            }
        ]
    },
    {
        path: "/user-dashboard",
        element: <UserRoute><UserDashboardLayout /></UserRoute>,
        children: [
            {
                index: true,
                element: <UserDashboard />
            },
            {
                path: 'my-library',
                element: <MyLibrary />
            },
            {
                path: 'profile',
                element: <UserProfile />
            },
            {
                path: 'settings',
                element: <Settings />
            }
        ]
    },
    {
        path: '/*',
        Component: ErrorPage
    },
]);

export default router;