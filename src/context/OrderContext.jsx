import React, { createContext, useContext, useState } from 'react';
import { ordersAPI } from '../services/api';
import Swal from 'sweetalert2';
const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {// Fetch orders from the API
      const response = await ordersAPI.getAllOrders();
      console.log(response);
      console.log(response.data.orders);
      if(response.data.message === "Done"){
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await ordersAPI.updateOrderStatus(orderId, status);
      console.log(res);
      if (res.status === 200) {
      
              Swal.fire({
                icon: "success",
                title: "Order Updated Successfully!",
                showConfirmButton: false,
                timer: 1500,
              });
            }
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, fetchOrders, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrderContext = () => useContext(OrderContext);