import { publicAxios, privateAxios } from '../config/axios.config';

export const couponesAPI = {
    // GET all coupones
    getAllCoupones: async () => await privateAxios.get('/coupon'),
    
    // POST create coupone
    createCoupone: (couponeData) => 
        privateAxios.post('/coupon', couponeData),
    
    // PUT update coupone
    updateCoupone: (id, couponeData) => 
        privateAxios.put(`/coupon/${id}`, couponeData),
    
    // DELETE delete coupone
    deleteCoupone: (id) => 
        privateAxios.delete(`/coupon/${id}`),
    
    // GET QR code
    getCouponQrCode: (id) => 
        publicAxios.get(`/coupones/${id}/qrcode`),
};