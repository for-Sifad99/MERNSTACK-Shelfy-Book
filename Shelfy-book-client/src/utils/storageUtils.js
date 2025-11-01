/**
 * Utility functions for safe localStorage operations
 */

/**
 * Safely get an item from localStorage
 * @param {string} key - Key to retrieve
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} - Value from localStorage or default value
 */
export const safeGetItem = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Failed to get item from localStorage for key: ${key}`, error);
        return defaultValue;
    }
};

/**
 * Safely set an item in localStorage
 * @param {string} key - Key to set
 * @param {*} value - Value to store
 * @returns {boolean} - True if successful, false otherwise
 */
export const safeSetItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn(`Failed to set item in localStorage for key: ${key}`, error);
        return false;
    }
};

/**
 * Safely remove an item from localStorage
 * @param {string} key - Key to remove
 * @returns {boolean} - True if successful, false otherwise
 */
export const safeRemoveItem = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`Failed to remove item from localStorage for key: ${key}`, error);
        return false;
    }
};

/**
 * Safely clear localStorage
 * @returns {boolean} - True if successful, false otherwise
 */
export const safeClear = () => {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.warn('Failed to clear localStorage', error);
        return false;
    }
};

export default {
    safeGetItem,
    safeSetItem,
    safeRemoveItem,
    safeClear
};