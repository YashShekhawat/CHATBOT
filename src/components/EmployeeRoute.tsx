import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface EmployeeRouteProps {
  children: React.ReactNode;
}

const EmployeeRoute: React.FC<EmployeeRouteProps> = ({ children }) => {
  const { role } = useAuth();
  const location = useLocation();

  if (role === 'employee') {
    return <>{children}</>;
  } else if (role) {
    // User is logged in but not an employee (e.g., guest)
    return <Navigate to="/chat" state={{ from: location }} replace />;
  } else {
    // User is not logged in at all, let ProtectedRoute handle it (redirect to /login)
    // This case should ideally be caught by an outer ProtectedRoute, but included for robustness.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default EmployeeRoute;