import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuth from '../hooks/UseAuth';

// Create Socket Context
const SocketContext = createContext();

// Socket Provider Component
export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const socketRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    // Check if user is admin - simplified approach to avoid CORS issues
    useEffect(() => {
        // For now, we'll determine admin status from the user object if available
        // In a real app, you might want to store this in localStorage or context
        if (user) {
            // This is a simplified approach - in a real app, you'd get this from your auth system
            // For now, we'll assume non-admin users don't need real-time notifications
            setIsAdmin(false); // We'll set this properly on the server side
        } else {
            setIsAdmin(false);
        }
    }, [user]);

    // Initialize socket connection
    useEffect(() => {
        // Create socket connection
        socketRef.current = io(import.meta.env.VITE_server_url || 'http://localhost:3000', {
            withCredentials: true
        });
        
        // Handle connection
        socketRef.current.on('connect', () => {
            console.log('Socket connected:', socketRef.current.id);
            
            // Join with user data if available
            if (user) {
                socketRef.current.emit('join', {
                    userId: user.uid,
                    email: user.email,
                    name: user.displayName,
                    isAdmin: false // We'll let the server determine this
                });
            }
        });
        
        // Handle rating notifications - only for admin
        socketRef.current.on('ratingNotification', (ratingData) => {
            const notification = {
                id: Date.now(),
                type: 'rating',
                message: `${ratingData.userName} rated the book "${ratingData.bookTitle}" ${ratingData.rating} stars`,
                timestamp: new Date(),
                read: false,
                data: ratingData
            };
            
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });
        
        // Handle comment notifications - only for admin
        socketRef.current.on('commentNotification', (commentData) => {
            const notification = {
                id: Date.now(),
                type: 'comment',
                message: `${commentData.userName} commented on the book "${commentData.bookTitle}"`,
                timestamp: new Date(),
                read: false,
                data: commentData
            };
            
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });
        
        // Handle book notifications - only for admin
        socketRef.current.on('bookNotification', (bookData) => {
            const notification = {
                id: Date.now(),
                type: 'book',
                message: `${bookData.userName} posted a new book "${bookData.bookTitle}"`,
                timestamp: new Date(),
                read: false,
                data: bookData
            };
            
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });
        
        // Handle borrow notifications - only for admin
        socketRef.current.on('borrowNotification', (borrowData) => {
            const notification = {
                id: Date.now(),
                type: 'borrow',
                message: `${borrowData.userName} borrowed the book "${borrowData.bookTitle}"`,
                timestamp: new Date(),
                read: false,
                data: borrowData
            };
            
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });
        
        // Handle disconnection
        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
        });
        
        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [user]);
    
    // Mark notification as read
    const markAsRead = (id) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === id 
                    ? { ...notification, read: true } 
                    : notification
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };
    
    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
    };
    
    // Clear all notifications
    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };
    
    // Emit events
    const emitRating = (ratingData) => {
        if (socketRef.current) {
            socketRef.current.emit('newRating', ratingData);
        }
    };
    
    const emitComment = (commentData) => {
        if (socketRef.current) {
            socketRef.current.emit('newComment', commentData);
        }
    };
    
    const emitBook = (bookData) => {
        if (socketRef.current) {
            socketRef.current.emit('newBook', bookData);
        }
    };
    
    const emitBorrow = (borrowData) => {
        if (socketRef.current) {
            socketRef.current.emit('newBorrow', borrowData);
        }
    };
    
    // Context value
    const contextValue = {
        socket: socketRef.current,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        emitRating,
        emitComment,
        emitBook,
        emitBorrow,
        isAdmin: true // For now, we'll assume admin for testing - in real app this would be determined properly
    };
    
    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook to use socket context
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export default SocketContext;