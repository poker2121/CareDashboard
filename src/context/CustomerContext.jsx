import React, { createContext, useContext, useState, useEffect } from 'react';

// تأكد من استيراد ال API المناسب، مثلاً:
// import userAPI from 'path-to-user-api';

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getAllUsers(); // تأكد من أن userAPI معرف ومستورد بشكل صحيح
        

        const formattedCustomers = response.data.map(user => ({
          id: user.id,
          name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          phone: user.phone || 'Not provided',
          joinDate: user.createdAt || new Date().toISOString(),
          orders: user.orders?.length || 0,
          totalSpent: user.orders?.reduce((total, order) => total + (order.total || 0), 0) || 0,
          status: user.status || 'Active',
          location: user.address?.city || 'Not provided'
        }));
        setCustomers(formattedCustomers);
      } catch (err) {
        setError('Failed to load customers');
        
        setCustomers([
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phone: "+1 234-567-8900",
            joinDate: "2024-01-15",
            orders: 12,
            totalSpent: 1250.00,
            status: "Active",
            location: "New York"
          },
          {
            id: 2,
            name: "Sarah Smith",
            email: "sarah@example.com",
            phone: "+1 234-567-8901",
            joinDate: "2024-02-01",
            orders: 5,
            totalSpent: 450.00,
            status: "Active",
            location: "Los Angeles"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <CustomerContext.Provider value={{ customers, loading, error }}>
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomerContext = () => useContext(CustomerContext);
