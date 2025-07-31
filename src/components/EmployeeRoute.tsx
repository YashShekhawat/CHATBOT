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
    return <Navigate to="/chat" state={{ from: location }} replace />;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default EmployeeRoute;