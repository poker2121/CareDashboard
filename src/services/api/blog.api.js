import { publicAxios, privateAxios } from '../config/axios.config';

export const blogAPI = {
    // Create a new blog post
    createBlog: (blogData) => 
        privateAxios.post('/blog', blogData, {
            headers: {
                ...privateAxios.defaults.headers.common,
                'Content-Type': 'multipart/form-data',
            },
        }),
    
    // Update an existing blog post
    updateBlog: (blogId, blogData) => 
        privateAxios.put(`/blog/${blogId}`, blogData, {
            headers: {
                ...privateAxios.defaults.headers.common,
                'Content-Type': 'multipart/form-data',
            },
        }),
    
    // Get all blog posts
    getAllBlogs: () => 
        publicAxios.get('/blog'),
    
    // Get a specific blog post by ID
    getBlog: (blogId) => 
        publicAxios.get(`/blog/${blogId}`),
    
    // Delete a blog post
    deleteBlog: (blogId) => 
        privateAxios.delete(`/blog/${blogId}`),
};