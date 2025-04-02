import { publicAxios, privateAxios } from '../config/axios.config';

export const userAPI = {
    getUser: () => 
        privateAxios.get('/user/get User'),
    
    getAllUsers: () => 
        privateAxios.get('/user/All users'),
    
    updateUserProfile: (userData, id) => 
        privateAxios.put(`/user/${id}`, userData, {
            headers: {
                ...privateAxios.defaults.headers.common,
                'Content-Type': 'multipart/form-data',
            },
        }),
    
    getProfile: () => 
        privateAxios.get('/user/profile'),
    
    deleteUser: (userId) => 
        privateAxios.delete(`/user/delete user/${userId}`),
    
    changePassword: (passwordData) => 
        privateAxios.patch('/user/change-password', passwordData),
    
    addToWishlist: (productId) => 
        privateAxios.post(`/user/whishlist/${productId}`),
    
    removeFromWishlist: (productId) => 
        privateAxios.delete(`/user/whishlist/${productId}`),
    
    getWishlist: () => 
        privateAxios.get('/user/whishlist'),
};