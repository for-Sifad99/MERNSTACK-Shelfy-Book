import React from 'react';
import {
    createBrowserRouter,
} from "react-router";
import PrivetRouter from '../router/PrivetRouter'
import Root from '../layouts/Root';
import Home from '../pages/Home/Home';
import AllBooks from '../pages/AllBooks/AllBooks';
import BorrowedBooks from '../pages/BorrowedBooks/BorrowedBooks';
import Blogs from '../pages/Blogs/Blogs';
import AddBooks from '../pages/AddBooks/AddBooks';
import CategoryBooks from '../pages/CategoryBooks/CategoryBooks';
import BookDetails from '../pages/BookDetails/BookDetails';
import UpdateBook from '../pages/UpdateBook/UpdateBook';
import Register from '../pages/Register/Register';
import Login from '../pages/Login/Login';
import ErrorPage from '../pages/ErrorPage/ErrorPage';


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
        ]
    },
    {
        path: '/*',
        Component: ErrorPage
    },
]);

export default router;