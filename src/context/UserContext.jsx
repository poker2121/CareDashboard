import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api/auth.api';
import Swal from 'sweetalert2';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(credentials);
      const userData = response.data;
      
      // Save user data and token
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // If the API returns a token, store it
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome back, ${userData.name || 'Admin'}!`,
        timer: 2000,
        showConfirmButton: false
      });
      
      return { success: true, data: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Logout',
        text: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout'
      });
      
      if (result.isConfirmed) {
        setLoading(true);
        
        // Call the logout API if the user is logged in
        if (user) {
          try {
            await authAPI.logout();
          } catch (error) {
            console.error('Logout API error:', error);
            // Continue with local logout even if API fails
          }
        }
        
        // Clear user data
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          timer: 2000,
          showConfirmButton: false
        });
        
        return { success: true };
      } else {
        return { success: false, canceled: true };
      }
    } catch (err) {
      console.error('Logout error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user has admin role
  const isAdmin = user && user.role === 'Admin';

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        loading, 
        error,
        isAdmin
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;