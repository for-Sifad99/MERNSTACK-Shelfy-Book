/**
 * Utility functions for handling Firebase errors
 */

/**
 * Get user-friendly error message from Firebase error
 * @param {Error} error - Firebase error object
 * @returns {string} - User-friendly error message
 */
export const getFirebaseErrorMessage = (error) => {
    if (!error || typeof error !== 'object') {
        return 'An unknown error occurred';
    }

    // Handle Firebase auth errors
    if (error.code) {
        switch (error.code) {
            // Auth errors
            case 'auth/email-already-in-use':
                return 'This email is already registered. Please try logging in instead.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/operation-not-allowed':
                return 'Email/password accounts are not enabled.';
            case 'auth/weak-password':
                return 'Password is too weak. Please use a stronger password.';
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
                return 'Wrong email or password! Please try again.';
            case 'auth/user-disabled':
                return 'This account has been disabled.';
            case 'auth/user-not-found':
                return 'No account found with this email. Please register first.';
            case 'auth/too-many-requests':
                return 'Too many requests. Please try again later.';
            case 'auth/popup-blocked':
                return 'Popup was blocked. Please allow popups and try again.';
            case 'auth/account-exists-with-different-credential':
                return 'An account already exists with this email. Please try logging in with your existing account.';
            case 'auth/popup-closed-by-user':
                return 'Sign in popup was closed. Please try again.';
            case 'auth/quota-exceeded':
                return 'Quota exceeded. Please try again later.';
            // Add more cases as needed
            default:
                return error.message || 'An unknown error occurred';
        }
    }

    // Fallback to error message
    return error.message || 'An unknown error occurred';
};

/**
 * Check if error is a Firebase quota exceeded error
 * @param {Error} error - Error to check
 * @returns {boolean} - True if error is a quota exceeded error
 */
export const isQuotaExceededError = (error) => {
    return error && 
           typeof error === 'object' && 
           (error.code === 'auth/quota-exceeded' ||
            (error.message && error.message.includes('quota exceeded')) ||
            (error.response && error.response.status === 429));
};

/**
 * Check if error is a Firebase too many requests error
 * @param {Error} error - Error to check
 * @returns {boolean} - True if error is a too many requests error
 */
export const isTooManyRequestsError = (error) => {
    return error && 
           typeof error === 'object' && 
           (error.code === 'auth/too-many-requests' ||
            (error.message && error.message.includes('too many requests')) ||
            (error.response && error.response.status === 429));
};

export default {
    getFirebaseErrorMessage,
    isQuotaExceededError,
    isTooManyRequestsError
};