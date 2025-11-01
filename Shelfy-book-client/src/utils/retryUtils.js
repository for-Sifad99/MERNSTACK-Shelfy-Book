/**
 * Utility functions for handling retries with exponential backoff
 */

/**
 * Wait for a specified amount of time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Execute a function with exponential backoff retry logic
 * @param {Function} fn - Function to execute
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {Function} shouldRetry - Function to determine if retry should be attempted
 * @returns {Promise<any>} - Result of the function execution
 */
export const exponentialBackoff = async (fn, maxRetries = 3, baseDelay = 1000, shouldRetry = () => true) => {
    let lastError;
    
    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            
            // If this is the last attempt or shouldn't retry, throw the error
            if (i === maxRetries || !shouldRetry(error)) {
                throw error;
            }
            
            // Calculate delay with exponential backoff and jitter
            const delay = Math.min(baseDelay * Math.pow(2, i), 10000); // Cap at 10 seconds
            const jitter = Math.random() * delay * 0.1; // Add 10% jitter
            const totalDelay = delay + jitter;
            
            console.warn(`Attempt ${i + 1} failed. Retrying in ${Math.round(totalDelay)}ms...`, error);
            await wait(totalDelay);
        }
    }
    
    throw lastError;
};

/**
 * Check if an error is a Firebase quota exceeded error
 * @param {Error} error - Error to check
 * @returns {boolean} - True if error is a quota exceeded error
 */
export const isQuotaExceededError = (error) => {
    return error && 
           typeof error === 'object' && 
           ((error.code && error.code.includes('quota-exceeded')) ||
            (error.message && error.message.includes('quota exceeded')) ||
            (error.response && error.response.status === 429));
};

/**
 * Check if an error is a Firebase too many requests error
 * @param {Error} error - Error to check
 * @returns {boolean} - True if error is a too many requests error
 */
export const isTooManyRequestsError = (error) => {
    return error && 
           typeof error === 'object' && 
           ((error.code && error.code.includes('too-many-requests')) ||
            (error.message && error.message.includes('too many requests')) ||
            (error.response && error.response.status === 429));
};

export default {
    wait,
    exponentialBackoff,
    isQuotaExceededError,
    isTooManyRequestsError
};