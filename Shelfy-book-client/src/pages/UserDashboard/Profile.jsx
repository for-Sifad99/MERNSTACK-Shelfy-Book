import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaCamera } from 'react-icons/fa';
import useAuth from '../../hooks/UseAuth';
import uploadImageToImgBB from '../../utils/imageUpload';
import avatar from '../../assets/avatarImg/avatar.jpg';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { getUserByEmail } from '../../api/userApis';

const Profile = () => {
    const { user, profileUpdate } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        bio: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(user?.photoURL || null);
    const [showPhotoPopup, setShowPhotoPopup] = useState(false);
    const [newProfileImage, setNewProfileImage] = useState(null);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle profile image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle photo popup open
    const handleOpenPhotoPopup = () => {
        setShowPhotoPopup(true);
    };

    // Handle photo popup close
    const handleClosePhotoPopup = () => {
        setShowPhotoPopup(false);
        setNewProfileImage(null);
    };

    // Handle new photo selection in popup
    const handleNewPhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProfileImage(file);
        }
    };

    // Handle photo update from popup
    const handleUpdatePhoto = async () => {
        if (!newProfileImage) return;
        
        try {
            // Upload new profile image to ImgBB
            const photoURL = await uploadImageToImgBB(newProfileImage);
            
            // Update user profile
            await profileUpdate(user, {
                photoURL: photoURL
            });
            
            // Update preview image
            setPreviewImage(photoURL);
            
            // Close popup
            handleClosePhotoPopup();
            
            alert('Profile photo updated successfully!');
        } catch (error) {
            console.error('Error updating profile photo:', error);
            alert('Failed to update profile photo. Please try again.');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Upload new profile image if provided
            let photoURL = user?.photoURL;
            if (profileImage) {
                photoURL = await uploadImageToImgBB(profileImage);
            }
            
            // Update user profile
            await profileUpdate(user, {
                displayName: profileData.name,
                photoURL: photoURL
            });
            
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    // Get user photo URL
    const getUserPhotoURL = () => {
        if (previewImage) {
            return previewImage;
        }
        if (user && user.photoURL) {
            return user.photoURL;
        }
        return avatar;
    };

    // Handle broken image URLs by falling back to default avatar
    const handleImageError = (e) => {
        e.target.src = avatar;
    };

    return (
        <>
            {/* Helmet for SEO */}
            <Helmet>
                <title>Profile - Shelfy User</title>
                <meta name="description" content="User profile for Shelfy book library" />
            </Helmet>

            {/* Photo Update Popup */}
            {showPhotoPopup && (
                <div className="fixed inset-0 bg-black/60 bg-backdrop-xs flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1f2937] rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-[var(--color-dark-secondary)] dark:text-white">
                            Update Profile Photo
                        </h2>
                        
                        <div className="flex flex-col items-center">
                            {/* Current photo preview */}
                            <img 
                                src={getUserPhotoURL()} 
                                alt="Current Profile" 
                                onError={handleImageError}
                                className="w-32 h-32 rounded-full border-4 border-white mb-4"
                            />
                            
                            {/* File input */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleNewPhotoChange}
                                className="w-full mb-4 text-gray-900 dark:text-gray-100"
                            />
                            
                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleClosePhotoPopup}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdatePhoto}
                                    disabled={!newProfileImage}
                                    className={`px-4 py-2 rounded-md text-white ${
                                        newProfileImage 
                                            ? 'bg-[var(--color-primary-orange)] hover:bg-[var(--color-dark-secondary)]' 
                                            : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    Update Photo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Page header */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-[var(--color-dark-secondary)] dark:text-white">
                        My Profile
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Manage your profile information
                    </p>
                </div>

                {/* Profile card */}
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--color-dark-secondary)] to-[var(--color-primary-orange)] p-6">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="relative">
                                <img 
                                    src={getUserPhotoURL()} 
                                    alt="Profile" 
                                    onError={handleImageError}
                                    className="w-24 h-24 rounded-full border-4 border-white"
                                />
                                {/* Update photo icon */}
                                <button 
                                    onClick={handleOpenPhotoPopup}
                                    className="absolute bottom-0 right-0 bg-[var(--color-primary-orange)] rounded-full p-2 cursor-pointer"
                                >
                                    <FaCamera className="text-white" />
                                </button>
                            </div>
                            <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                                <h2 className="text-2xl font-bold text-white">
                                    {user?.displayName || 'User'}
                                </h2>
                                <p className="text-white text-opacity-80 mt-1">
                                    User
                                </p>
                                <p className="text-white text-opacity-80 mt-1 flex items-center justify-center md:justify-start">
                                    <FaEnvelope className="mr-2" />
                                    {user?.email || 'user@example.com'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {isEditing ? (
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-orange)] focus:border-[var(--color-primary-orange)] dark:bg-[#2d3748] dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-orange)] focus:border-[var(--color-primary-orange)] dark:bg-[#2d3748] dark:text-white"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-orange)] focus:border-[var(--color-primary-orange)] dark:bg-[#2d3748] dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-orange)] focus:border-[var(--color-primary-orange)] dark:bg-[#2d3748] dark:text-white"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-orange)] focus:border-[var(--color-primary-orange)] dark:bg-[#2d3748] dark:text-white"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[var(--color-primary-orange)] text-white rounded-md hover:bg-[var(--color-dark-secondary)]"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start">
                                        <FaUser className="text-[var(--color-primary-orange)] mt-1 mr-3" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                                            <p className="text-gray-900 dark:text-white">
                                                {user?.displayName || 'User'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <FaEnvelope className="text-[var(--color-primary-orange)] mt-1 mr-3" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
                                            <p className="text-gray-900 dark:text-white">
                                                {user?.email || 'user@example.com'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <FaPhone className="text-[var(--color-primary-orange)] mt-1 mr-3" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</h3>
                                            <p className="text-gray-900 dark:text-white">
                                                {profileData.phone || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <FaMapMarkerAlt className="text-[var(--color-primary-orange)] mt-1 mr-3" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h3>
                                            <p className="text-gray-900 dark:text-white">
                                                {profileData.address || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Bio</h3>
                                        <p className="text-gray-900 dark:text-white">
                                            {profileData.bio || 'No bio available'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-[var(--color-primary-orange)] text-white rounded-md hover:bg-[var(--color-dark-secondary)]"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;