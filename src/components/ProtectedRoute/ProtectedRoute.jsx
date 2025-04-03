import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(UserContext);

  
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;