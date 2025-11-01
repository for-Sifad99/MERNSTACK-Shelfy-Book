// Book API functions

// Add a new book
const postBooks = async (axiosSecure, bookData) => {
    const res = await axiosSecure.post('/addBooks', bookData);
    return res.data;
};

// Update a book by ID
const patchBook = async (axiosSecure, id, bookData) => {
    const res = await axiosSecure.patch(`/updateBook/${id}`, bookData);
    return res.data;
};

// Get all books with optional category and pagination
const getAllBooks = async (axiosInstance, category, page, limit) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    
    const res = await axiosInstance.get(`/allBooks?${params.toString()}`);
    return res.data;
};

// Get books by user email with pagination
const getBooksByUser = async (axiosSecure, email, page, limit) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    
    const res = await axiosSecure.get(`/myBooks/${email}?${params.toString()}`);
    return res.data;
};

// Get books statistics for admin dashboard
const getBooksStatistics = async (axiosInstance) => {
    const res = await axiosInstance.get('/booksStatistics');
    return res.data;
};

// Get a single book by ID
const getBookById = async (axiosInstance, id) => {
    const res = await axiosInstance.get(`/allBooks/${id}`);
    return res.data;
};

// Get top rating books
const getTopRatingBooks = async (axiosInstance) => {
    const res = await axiosInstance.get(`/topRatingBooks`);
    return res.data;
};

// Add borrowed book info
const addBorrowedBookInfo = async (axiosInstance, borrowedData) => {
    const res = await axiosInstance.post('/addBorrowedBookInfo', borrowedData);
    return res.data;
};

// Get borrowed books by email
const getBorrowedBooksByEmail = async (axiosInstance, email) => {
    const res = await axiosInstance.get(`/borrowedBooks/${email}`);
    return res.data;
};

// Delete borrowed book by ID
const deleteBorrowedBook = async (axiosInstance, id) => {
    const res = await axiosInstance.delete(`/deleteBorrowedBook/${id}`);
    return res.data;
};

// Get all borrowed books info
const getAllBorrowedBooksInfo = async (axiosInstance) => {
    const res = await axiosInstance.get('/borrowedBooksInfo');
    return res.data;
};

// Get top users by books added
const getTopUsersByBooks = async (axiosInstance) => {
    const res = await axiosInstance.get('/topUsersByBooks');
    return res.data;
};

// Delete book by ID
const deleteBook = async (axiosSecure, id) => {
    const res = await axiosSecure.delete(`/deleteBook/${id}`);
    return res.data;
};

export { 
    postBooks, 
    patchBook, 
    getAllBooks, 
    getBooksByUser,
    getBooksStatistics,
    getBookById, 
    getTopRatingBooks, 
    addBorrowedBookInfo, 
    getBorrowedBooksByEmail, 
    deleteBorrowedBook,
    getAllBorrowedBooksInfo,
    getTopUsersByBooks,
    deleteBook
};