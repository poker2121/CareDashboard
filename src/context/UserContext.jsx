// تعديل UserContext.js

import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api/auth.api';
import Swal from 'sweetalert2';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // التحقق من تسجيل دخول المستخدم ومن صلاحية التوكن
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        // إذا لم يكن هناك توكن أو بيانات مستخدم، فالمستخدم غير مسجل
        if (!token || !storedUser) {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // التحقق من صلاحية التوكن عن طريق API
        try {
          // يمكنك إضافة دالة جديدة في authAPI للتحقق من صلاحية التوكن
          const response = await authAPI.validateToken(token);
          if (response.data.valid) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // إذا كان التوكن غير صالح، قم بتسجيل الخروج
            clearAuthData();
          }
        } catch (err) {
          // في حالة وجود خطأ في التحقق من التوكن، قم بتسجيل الخروج
          console.error('Token validation error:', err);
          clearAuthData();
        }
      } catch (err) {
        console.error('Auth check error:', err);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // دالة لمسح بيانات المصادقة
  const clearAuthData = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(credentials);
      const userData = response.data;
      
      // حفظ بيانات المستخدم والتوكن
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // إذا أعاد API توكن، قم بتخزينه
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }
      
      // عرض رسالة نجاح
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
      
      // عرض رسالة خطأ
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
      // عرض مربع تأكيد
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
        
        // استدعاء API تسجيل الخروج إذا كان المستخدم مسجلاً
        if (user) {
          try {
            await authAPI.logout();
          } catch (error) {
            console.error('Logout API error:', error);
            // الاستمرار في تسجيل الخروج محلياً حتى لو فشل API
          }
        }
        
        // مسح بيانات المستخدم
        clearAuthData();
        
        // عرض رسالة نجاح
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

  // التحقق من صلاحية التوكن بشكل دوري (اختياري)
  useEffect(() => {
    if (isAuthenticated) {
      const tokenCheckInterval = setInterval(async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await authAPI.validateToken(token);
            if (!response.data.valid) {
              clearAuthData();
              Swal.fire({
                icon: 'warning',
                title: 'Session Expired',
                text: 'Your session has expired. Please login again.',
                timer: 3000,
                showConfirmButton: false
              });
            }
          } catch (err) {
            console.error('Token validation error:', err);
          }
        }
      }, 15 * 60 * 1000); // التحقق كل 15 دقيقة مثلاً

      return () => clearInterval(tokenCheckInterval);
    }
  }, [isAuthenticated]);

  // التحقق من وجود دور المسؤول
  const isAdmin = user && user.role === 'Admin';

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        loading, 
        error,
        isAdmin,
        isAuthenticated
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;