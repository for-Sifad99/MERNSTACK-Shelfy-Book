import React from 'react';

const postBooks = async (axiosSecure, bookData) => {
    const res = await axiosSecure.post('/addBooks', bookData);
    return res.data;
};

const patchBook = async (axiosSecure, id, bookData) => {
    const res = await axiosSecure.patch(`/updateBook/${id}`, bookData);
    return res.data;
};

export { postBooks, patchBook };