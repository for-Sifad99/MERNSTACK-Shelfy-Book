// Utility function to upload image to ImgBB
const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Get the API key from environment variables
    const apiKey = import.meta.env.VITE_image_upload_key;
    
    if (!apiKey) {
        throw new Error('Image upload API key is not configured');
    }
    
    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });
        
        const data = await response.json();
        
        if (data.success) {
            return data.data.url;
        } else {
            throw new Error(data.error.message || 'Failed to upload image');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export default uploadImageToImgBB;