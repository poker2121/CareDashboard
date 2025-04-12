import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api/auth.api';
import { userAPI } from '../services/api/user.api';
import Swal from 'sweetalert2';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setUserToken(token);
      setIsAuthenticated(true);
      // Make sure axios is configured with the token
      axios.defaults.headers.common['authorization'] = `pharma__${token}`;
      
      // Fetch user data when component mounts if token exists
      refreshUserData();
    }
  }, []);

  const clearAuthData = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserData(null);
    setUserToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    delete axios.defaults.headers.common['authorization'];
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Login API called with credentials:', credentials);
      
      const response = await authAPI.login(credentials);
      const token = response.data.token;
      localStorage.setItem("userToken", token);
      
      // Set token in state and axios headers
      setUserToken(token);
      setIsAuthenticated(true);
      axios.defaults.headers.common['authorization'] = `pharma__${token}`;
      
      const userData = response.data;
      setUserData(userData);

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

        if (userToken) {
          try {
            await authAPI.logout();
          } catch (error) {
            console.error('Logout API error:', error);
          }
        }

        clearAuthData();

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

  const refreshUserData = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setIsAuthenticated(false);
      setUserData(null);
      return false;
    }
    
    try {
      // Ensure the token is set in axios headers
      axios.defaults.headers.common['authorization'] = `pharma__${token}`;
      
      // Make an API call to get user profile
      const response = await userAPI.getProfile();
      
      if (response && response.data) {
        setUserData(response.data);
        setUserToken(token);
        setIsAuthenticated(true);
        return true;
      } else {
        // If no valid response, clear auth data
        clearAuthData();
        return false;
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      // Only clear auth data if it's an authentication error (401)
      if (error.response && error.response.status === 401) {
        clearAuthData();
      }
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        error,
        isAuthenticated,
        refreshUserData,
        userToken,
        userData,
        setUserToken
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
