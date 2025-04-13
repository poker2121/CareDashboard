import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api/user.api';

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Call the API
        const response = await userAPI.getAllUsers();

        // Log the full response for debugging
        console.log('API Response:', response);

        // Try to extract user data from various possible response formats
        let userData = [];

        // Handle different API response structures
        if (response.status === 200 || response.status === 201 || response.data) {
          // Direct array response
          // setCustomers(response.data.users);
          console.log('Response data:', response.data.users);
          const formattedCustomers = response.data.users.length && response.data.users.map(user => {

            return {
              id: user.id || user._id || String(Math.random()).substring(2, 10),
              name: user.userName.firstName + " " + user.userName.lastName,
              email: user.email || 'No email provided',
              phone: user.phone || 'Not provided',
              joinDate: new Date(user.createdAt)
                .toISOString()
                .slice(0, 10) || 'Not provided',
              // orders: user.orders?.length || user.orderCount || user.order_count || 0,
              totalSpent: user.totalSpent || user.total_spent ||
                (Array.isArray(user.orders) ? user.orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0) : 0),
              status: user.isActive ? 'Active' : 'Inactive',
              blocked: user.isBlocked ? 'Blocked' : 'Not blocked',
              confirmed: user.isConfirmed ? 'Confirmed' : 'Not confirmed',
              profilePic: user.profilePic || 'https://via.placeholder.com/150',
              gender: user.gender,
              role: user.role || 'User',
              wishList: user.whishList || [],
              location: user.address?.street + " " + user.address?.city || + ", " + user.address?.state + ", " + user.address?.country || 'Not provided'
            };
          });

          console.log('Formatted customers:', formattedCustomers);
          setCustomers(formattedCustomers);
        }

        console.log('Extracted user data:', userData);




      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(`Failed to load customers: ${err.message}`);


      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <CustomerContext.Provider value={{
      customers,
      loading,
      error,
      refreshCustomers: () => fetchCustomers() // Added refresh function
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomerContext = () => useContext(CustomerContext);