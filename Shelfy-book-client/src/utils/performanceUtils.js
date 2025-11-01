/**
 * Utility functions for performance monitoring and optimization
 */

/**
 * Measure the execution time of a function
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for the performance mark
 * @returns {Function} - Wrapped function that measures execution time
 */
export const withPerformanceMonitoring = (fn, label) => {
    return async (...args) => {
        const start = performance.now();
        try {
            const result = await fn(...args);
            const end = performance.now();
            console.debug(`[Performance] ${label} took ${end - start} milliseconds`);
            return result;
        } catch (error) {
            const end = performance.now();
            console.debug(`[Performance] ${label} failed after ${end - start} milliseconds`, error);
            throw error;
        }
    };
};

/**
 * Debounce a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Trigger on leading edge instead of trailing
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
};

/**
 * Throttle a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Memoize a function result based on its arguments
 * @param {Function} fn - Function to memoize
 * @param {Function} resolver - Function to resolve cache key from arguments
 * @returns {Function} - Memoized function
 */
export const memoize = (fn, resolver) => {
    const cache = new Map();
    
    return function(...args) {
        const key = resolver ? resolver(...args) : JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
};

export default {
    withPerformanceMonitoring,
    debounce,
    throttle,
    memoize
};