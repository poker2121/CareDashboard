import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api/user.api';

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchCustomers = async () => {
  //     try {
  //       setLoading(true);
  //       // Call the API
  //       // const response = await userAPI.getAllUsers();
        
  //       // Log the full response for debugging
  //       console.log('API Response:', response);
        
  //       // Try to extract user data from various possible response formats
  //       let userData = [];
        
  //       // Handle different API response structures
  //       if (response) {
  //         // Direct array response
  //         if (Array.isArray(response)) {
  //           userData = response;
  //         }
  //         // Response with data property
  //         else if (response.data) {
  //           if (Array.isArray(response.data)) {
  //             userData = response.data;
  //           }
  //           else if (Array.isArray(response.data.users)) {
  //             userData = response.data.users;
  //           }
  //           else if (Array.isArray(response.data.data)) {
  //             userData = response.data.data;
  //           }
  //           else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
  //             // Single user object
  //             userData = [response.data];
  //           }
  //         }
  //         // Response with users property
  //         else if (Array.isArray(response.users)) {
  //           userData = response.users;
  //         }
  //       }
        
  //       console.log('Extracted user data:', userData);
        
  //       // If no users were found, create a default/sample user
  //       if (!userData || userData.length === 0) {
  //         console.log('No users found, creating sample user');
  //         // You can create a sample user for development or leave empty
  //         userData = [{
  //           id: 'sample-user-1',
  //           name: 'John Doe',
  //           email: 'john@example.com',
  //           phone: '+1 234 567 8901',
  //           createdAt: new Date().toISOString(),
  //           location: 'New York',
  //           orders: 5,
  //           totalSpent: 1250
  //         }];
  //       }
        
     
  //       const formattedCustomers = userData.map(user => {
          
         
          
  //         return {
  //           id: user.id || user._id || String(Math.random()).substring(2, 10),
  //           name: user.name || user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
  //           email: user.email || 'No email provided',
  //           phone: user.phone || user.phoneNumber || user.mobile || 'Not provided',
  //           joinDate: user.createdAt || user.created_at || user.joinDate || user.registeredAt || new Date().toISOString(),
  //           orders: user.orders?.length || user.orderCount || user.order_count || 0,
  //           totalSpent: user.totalSpent || user.total_spent || 
  //             (Array.isArray(user.orders) ? user.orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0) : 0),
  //           status: user.status || 'Active',
  //           location: user.address?.city || user.city || user.location || user.address || 'Not provided'
  //         };
  //       });
        
  //       console.log('Formatted customers:', formattedCustomers);
  //       setCustomers(formattedCustomers);
        
  //     } catch (err) {
  //       console.error('Error fetching customers:', err);
  //       setError(`Failed to load customers: ${err.message}`);
        
  //       // Create a sample user in case of error for development
  //       setCustomers([{
  //         id: 'sample-user-error',
  //         name: 'Sample User',
  //         email: 'sample@example.com',
  //         phone: '+1 234 567 8900',
  //         joinDate: new Date().toISOString(),
  //         orders: 3,
  //         totalSpent: 750,
  //         status: 'Active',
  //         location: 'Sample City'
  //       }]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCustomers();
  // }, []);

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