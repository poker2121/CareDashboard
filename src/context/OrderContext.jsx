import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders] = useState([
    {
      id: "ORD-001",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        avatar: "J"
      },
      date: "2024-03-01",
      items: [
        { name: "Product A", quantity: 2, price: 129.99 },
        { name: "Product B", quantity: 1, price: 89.99 }
      ],
      total: 349.97,
      status: "Delivered",
      paymentMethod: "Credit Card",
      shippingAddress: "123 Main St, City, Country"
    },
  
  ]);

  return (
    <OrderContext.Provider value={{ orders }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrderContext = () => useContext(OrderContext);