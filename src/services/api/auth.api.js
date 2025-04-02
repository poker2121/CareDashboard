import { publicAxios, privateAxios } from '../config/axios.config';

export const authAPI = {
    login: (credentials) => 
        publicAxios.post('/auth/login', credentials),
    
    register: (userData) => 
        publicAxios.post('/auth/signUp', userData),
    
    sendCode: (email) => 
        publicAxios.post('/auth/sendcode', email),

    resetPassword: (email, forgetCode, newPassword) =>
        publicAxios.put('/auth/resetPass', {email, forgetCode, newPassword}),
    
    logout: () => 
        privateAxios.post('/auth/logout'),

    refreshToken: (refreshToken) => 
        publicAxios.post('/auth/refresh-token', { refreshToken }),

};