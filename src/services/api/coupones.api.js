import { publicAxios, privateAxios } from '../config/axios.config';

export const couponesAPI = {
    // GET all coupones
    getAllCoupones: async () => await publicAxios.get('/coupones'),
    
    // POST create coupone
    createCoupone: (couponeData) => 
        privateAxios.post('/coupones', couponeData),
    
    // PUT update coupone
    updateCoupone: (id, couponeData) => 
        privateAxios.put(`/coupones/${id}`, couponeData),
    
    // DELETE delete coupone
    deleteCoupone: (id) => 
        privateAxios.delete(`/coupones/${id}`),
    
    // GET QR code
    getCouponQrCode: (id) => 
        publicAxios.get(`/coupones/${id}/qrcode`),
};