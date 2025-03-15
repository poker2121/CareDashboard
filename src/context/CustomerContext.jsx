import React, { createContext, useContext, useState } from 'react';

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234-567-8900",
      joinDate: "2024-01-15",
      orders: 12,
      totalSpent: 1250.00,
      status: "Active"
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      phone: "+1 234-567-8901",
      joinDate: "2024-02-01",
      orders: 5,
      totalSpent: 450.00,
      status: "Active"
    },
    // Add more sample data as needed
  ]);

  return (
    <CustomerContext.Provider value={{ customers }}>
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomerContext = () => useContext(CustomerContext);