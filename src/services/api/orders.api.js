import { publicAxios, privateAxios } from '../config/axios.config';

export const ordersAPI = {
   
    getAllOrders: async () => await privateAxios.get('/order'),
    updateOrderStatus: async(orderId, status) => await privateAxios.put(`/order/${orderId}`, { status }),
}