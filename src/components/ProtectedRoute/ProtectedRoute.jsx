import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { Spinner } from 'react-bootstrap';

export function ProtectedRoute({ children }) {
  const { userToken, isAuthenticated, refreshUserData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // If we already have a token in context, we're authenticated
        if (userToken) {
          setAuthChecked(true);
          setIsLoading(false);
          return;
        }

        // Check for token in localStorage
        const storedToken = localStorage.getItem('userToken');
        
        if (storedToken) {
          // Validate the token by refreshing user data
          const isValid = await refreshUserData();
          setAuthChecked(true);
        } else {
          // No token found
          setAuthChecked(true);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuthChecked(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [userToken, refreshUserData]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Only redirect if we've completed the auth check and there's no token
  if (authChecked && !userToken && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
