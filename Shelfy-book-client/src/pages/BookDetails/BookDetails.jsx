import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router";
import { Helmet } from 'react-helmet-async';
import leftBook from '../../assets/commonBanners/leftBook.png';
import rightBook from '../../assets/commonBanners/rightBook.png';
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineProductionQuantityLimits, MdOutlineCategory } from "react-icons/md";
import { FaGripLinesVertical, FaTrash, FaEdit } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { patchBook } from '../../api/bookApis';
import { useSocket } from '../../contexts/SocketContext'; // Add socket context import

const BookDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { emitRating, emitComment } = useSocket(); // Add socket context
    const [book, setBook] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [returnDate, setReturnDate] = useState("");
    const [userRating, setUserRating] = useState(0); // User's rating
    const [userComment, setUserComment] = useState(""); // User's comment
    const [bookComments, setBookComments] = useState([]); // All comments for this book
    const [editingCommentId, setEditingCommentId] = useState(null); // Track which comment is being edited
    const [editingCommentText, setEditingCommentText] = useState(""); // Text for editing comment

    useEffect(() => {
        // Create axios instance with base URL
        const axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_server_url
        });
        
        axiosInstance.get(`/api/allBooks/${id}`)
            .then(res => {
                setBook(res.data);
                // Initialize user rating if it exists in book data
                if (res.data.ratings && res.data.ratings[user?.email]) {
                    setUserRating(res.data.ratings[user.email]);
                }
                // Initialize comments if they exist
                if (res.data.comments) {
                    setBookComments(res.data.comments);
                }
            })
            .catch(err => console.error("Failed to fetch book info", err));
    }, [id, user?.email]);

    const {
        bookImg,
        bookTitle,
        authorName,
        rating,
        shortDescription,
        bookContent,
        category,
        quantity,
    } = book;

    // Handle user rating submission
    const handleRatingSubmit = async (newRating) => {
        if (!user) {
            toast.error("Please login to rate this book");
            return;
        }

        try {
            // Update rating in database
            const updatedBook = await patchBook(axiosSecure, id, {
                rating: newRating
            });

            // Update local state
            setBook(prev => ({ ...prev, rating: newRating }));
            setUserRating(newRating);

            // Emit socket event for new rating
            emitRating({
                bookId: id,
                bookTitle: bookTitle,
                userName: user.displayName || user.email,
                userId: user.uid,
                rating: newRating
            });

            toast.success("Rating submitted successfully!");
        } catch (error) {
            console.error("Error submitting rating:", error);
            toast.error("Failed to submit rating. Please try again.");
        }
    };

    // Handle comment submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error("Please login to comment on this book");
            return;
        }

        if (!userComment.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        try {
            // Create comment object
            const newComment = {
                id: Date.now(),
                userId: user.uid,
                userName: user.displayName || user.email,
                userEmail: user.email,
                text: userComment,
                timestamp: new Date().toISOString(),
                isEditing: false
            };

            // Update comments in database
            const updatedComments = editingCommentId 
                ? bookComments.map(comment => 
                    comment.id === editingCommentId 
                        ? { ...comment, text: userComment, isEditing: false } 
                        : comment
                )
                : [...bookComments, newComment];

            await patchBook(axiosSecure, id, {
                comments: updatedComments
            });

            // Update local state
            setBookComments(updatedComments);
            
            // If editing, clear editing state
            if (editingCommentId) {
                setEditingCommentId(null);
                setEditingCommentText("");
                toast.success("Comment updated successfully!");
            } else {
                // If adding new comment, clear input and emit socket event
                setUserComment("");
                emitComment({
                    bookId: id,
                    bookTitle: bookTitle,
                    userName: user.displayName || user.email,
                    userId: user.uid,
                    comment: userComment
                });
                toast.success("Comment added successfully!");
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
            toast.error("Failed to submit comment. Please try again.");
        }
    };

    // Handle comment deletion
    const handleCommentDelete = async (commentId) => {
        if (!user) {
            toast.error("Please login to delete comments");
            return;
        }

        try {
            // Filter out the comment to be deleted
            const updatedComments = bookComments.filter(comment => comment.id !== commentId);
            
            // Update comments in database
            await patchBook(axiosSecure, id, {
                comments: updatedComments
            });

            // Update local state
            setBookComments(updatedComments);
            toast.success("Comment deleted successfully!");
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("Failed to delete comment. Please try again.");
        }
    };

    // Handle comment editing
    const handleCommentEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditingCommentText(comment.text);
        setUserComment(comment.text);
    };

    // Cancel comment editing
    const cancelCommentEdit = () => {
        setEditingCommentId(null);
        setEditingCommentText("");
        setUserComment("");
    };

    const handleBorrowSubmit = async (e) => {
        e.preventDefault();
        setShowModal(false);

        const borrowedData = {
            name: user.displayName,
            email: user.email,
            bookId: id,
            returnDate,
        }
        try {
            // 1. Borrow info save
            // Create axios instance with base URL
            const axiosInstance = axios.create({
                baseURL: import.meta.env.VITE_server_url
            });
            
            await axiosInstance.post(`/api/addBorrowedBookInfo`, borrowedData);

            // 2. Quantity decrease in DB
            await patchBook(axiosSecure, id, {
                quantity: book.quantity - 1,
            });

            // 3. Update local state
            setBook(prev => ({ ...prev, quantity: quantity - 1 }));

            // Emit socket event for new borrow
            emitBorrow({
                bookId: id,
                bookTitle: bookTitle,
                userName: user.displayName || user.email,
                userId: user.uid
            });

            // Sweet Alert :
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "You are successfully borrowed the book!!"
            });

        } catch (err) {
            if (err.response?.status === 403) {
                toast.error("You can't borrow more than 3 books!");
            } else if (err.response?.status === 400) {
                toast.error("You already borrowed this book!");
            } else {
                toast.error("Something went wrong!");
                console.error(err);
            };
        };
    };

    return (
        <>
            <Helmet>
                <title>Book Peek - Shelfy</title>
                <meta name="description" content="Check out the juicy details before you borrow or bounce." />
            </Helmet>

            {/* Page Banner */}
            <div className="flex justify-between items-center bg-[#e6eff2] dark:bg-[#19343d] sm:py-6 py-12">
                <img src={leftBook} alt="Banner Book1" className="hidden sm:block w-48 md:w-54 lg:w-64 pt-10" />
                <div className="flex flex-col items-center justify-center text-center mx-auto sm:py-0 py-3">
                    <h1 className="text-[#012e4a] dark:text-[var(--color-light-primary)] font-semibold text-2xl md:text-3xl lg:text-4xl">Borrow Book</h1>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-normal text-gray-600 dark:text-slate-400 sm:mt-1">
                        <Link to="/">Home</Link>
                        <IoIosArrowForward />
                        <span className='text-orange-500 dark:text-orange-300'>Book Details</span>
                    </div>
                </div>
                <img src={rightBook} alt="Banner Book2" className="hidden sm:block w-28 md:w-34 lg:w-40 pt-10" />
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row gap-6 py-10 xl:px-0 lg:px-6 md:px-8 max-w-5xl mx-auto">
                {/* Book Image */}
                <div className='flex-shrink-0 bg-[#f5f5f5] dark:bg-[#374151] md:mx-0 sm:mx-20 mx-4 py-12 px-24 flex justify-center items-center rounded-xl'>
                    <img src={bookImg} alt={bookTitle} className="w-[180px] object-cover rounded-md mb-2" />
                </div>

                {/* Book Info */}
                <div className="flex-1 md:mt-10 mt-4 space-y-2 md:mx-0 sm:mx-20 mx-4">
                    <div className='flex items-center sm:gap-10 gap-2'>
                        <h2 className="lg:text-3xl text-xl font-bold text-[var(--color-dark-primary)] dark:text-[var(--color-light-primary)]">{bookTitle}</h2>
                        <p className="text-green-600 font-semibold">{quantity > 0 ? 'Available in stock' : 'Out of stock'}</p>
                    </div>

                    <p className="text-sm font-bold dark:text-white -mt-2">By <span className="font-normal text-blue-600 dark:text-blue-400 underline">{authorName}</span></p>

                    {/* Ratings */}
                    <div className="flex items-center gap-4">
                        <Rating
                            style={{ maxWidth: 80 }}
                            value={rating}
                            readOnly
                            halfFillMode="svg"
                            itemStyles={{
                                itemShapes: Star,
                                activeFillColor: '#ffa900',
                                inactiveFillColor: '#e5e7eb',
                            }}
                        />
                        <span className="text-sm dark:text-gray-300">({rating || 0} stars)</span>
                    </div>

                    {/* User Rating */}
                    {user && (
                        <div className="mt-2">
                            <p className="text-sm font-medium dark:text-white">Your Rating:</p>
                            <Rating
                                style={{ maxWidth: 120 }}
                                value={userRating}
                                onChange={handleRatingSubmit}
                                halfFillMode="svg"
                                itemStyles={{
                                    itemShapes: Star,
                                    activeFillColor: '#ffa900',
                                    inactiveFillColor: '#e5e7eb',
                                }}
                            />
                        </div>
                    )}

                    <p className="sm:text-base text-xs dark:text-gray-300 text-gray-700">{shortDescription}</p>

                    <div className='flex sm:flex-row flex-col sm:gap-4 gap-1 dark:text-gray-200'>
                        <p className="flex items-center gap-1 sm:text-base text-sm font-bold">
                            <MdOutlineProductionQuantityLimits /> Quantity :<span className="text-orange-500">{quantity}</span>
                        </p>
                        <p className='hidden sm:block'><FaGripLinesVertical /></p>
                        <p className="flex items-center gap-1 sm:text-base text-sm font-bold">
                            <MdOutlineCategory /> Category :<span className="text-orange-500">{category}</span>
                        </p>
                    </div>

                    {/* Borrow Button */}
                    <button
                        disabled={quantity <= 0}
                        onClick={() => setShowModal(true)}
                        className='relative overflow-hidden group sm:text-sm text-xs font-semibold px-6 py-[8px] w-[160px] flex justify-center text-[var(--color-dark-secondary)] hover:text-white  bg-[#eeebfd] rounded-full transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed'>
                        <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-primary-orange)] transition-all duration-500 group-hover:w-full z-0"></span>
                        <span className='relative z-10 flex gap-1 items-center'><IoCart className="text-base" />Borrow</span>
                    </button>

                    {/* Book Content */}
                    <div className="mt-4 border-t pt-2 dark:text-gray-300 sm:text-sm text-xs">
                        <h1 className='font-bold text-xl text-gray-700 dark:text-white'>Book Content :</h1>
                        <p>{bookContent}</p>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-[var(--color-dark-primary)] dark:text-[var(--color-light-primary)] mb-6">Comments</h2>
                
                {/* Comment Form */}
                {user && (
                    <form onSubmit={handleCommentSubmit} className="mb-8">
                        <div className="mb-4">
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {editingCommentId ? "Edit your comment" : "Add a comment"}
                            </label>
                            <textarea
                                id="comment"
                                value={userComment}
                                onChange={(e) => setUserComment(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary-orange)] focus:border-[var(--color-primary-orange)] dark:bg-[#2d3748] dark:text-white"
                                placeholder="Share your thoughts about this book..."
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--color-primary-orange)] hover:bg-[#e65100] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-orange)]"
                            >
                                {editingCommentId ? "Update Comment" : "Post Comment"}
                            </button>
                            {editingCommentId && (
                                <button
                                    type="button"
                                    onClick={cancelCommentEdit}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-orange)] dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                )}

                {/* Comments List */}
                <div className="space-y-6">
                    {bookComments.length > 0 ? (
                        bookComments.map((comment) => (
                            <div key={comment.id} className="bg-white dark:bg-[#1f2937] rounded-lg shadow p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {comment.userName}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(comment.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {comment.text}
                                        </p>
                                    </div>
                                    {user && user.email === comment.userEmail && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleCommentEdit(comment)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                title="Edit"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleCommentDelete(comment.id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                title="Delete"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                            No comments yet. Be the first to comment!
                        </p>
                    )}
                </div>
            </div>

            {/* Borrow Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 backdrop-blur-xs bg-black/50 flex items-center justify-center">
                    <form onSubmit={handleBorrowSubmit} className="bg-white dark:bg-[var(--color-bg)] p-6 rounded-lg lg:max-w-[400px] md:max-w-[360px] max-w-[320px] w-[90%] space-y-4">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Borrow This Book</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input type="text" value={user.displayName} readOnly className="sm:text-sm text-xs mt-1 w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-500 outline-none bg-gray-100 dark:bg-gray-700 dark:text-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" value={user.email} readOnly className="sm:text-sm text-xs mt-1 w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-500 outline-none bg-gray-100 dark:bg-gray-700 dark:text-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Return Date</label>
                            <input type="date" required value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="sm:text-sm text-xs mt-1 w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-500 outline-none bg-gray-100 dark:bg-gray-700 dark:text-white" />
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className='relative overflow-hidden group sm:text-sm text-xs font-semibold px-6 py-[8px] w-[160px] flex justify-center dark:text-gary-400 hover:text-white text-gray-500 bg-gray-200 rounded-full transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed'>
                                <span className="absolute left-0 top-0 h-full w-0 bg-gray-400 transition-all duration-500 group-hover:w-full z-0"></span>
                                <span className='relative z-10'>Cancel</span>
                            </button>
                            <button
                                disabled={quantity <= 0}
                                onClick={() => setShowModal(true)}
                                className='relative overflow-hidden group sm:text-sm text-xs font-semibold px-6 py-[8px] w-[160px] flex justify-center  text-white  bg-[var(--color-primary-orange)] rounded-full transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed'>
                                <span className="absolute left-0 top-0 h-full w-0 bg-[var(--color-dark-secondary)] transition-all duration-500 group-hover:w-full z-0"></span>
                                <span className='relative z-10'>Conform</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default BookDetails;
