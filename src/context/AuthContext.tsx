import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { toast } from 'sonner';

type UserRole = 'guest' | 'employee' | null;

interface AuthContextType {
  role: UserRole;
  userEmail: string | null; // Added userEmail to context type
  loginAsGuest: () => void;
  loginAsEmployee: (email: string) => void; // Modified to accept the authenticated email
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('userRole') as UserRole) || null;
    }
    return null;
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => { // New state for user email
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userEmail') || null;
    }
    return null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [role]);

  useEffect(() => { // Effect to persist userEmail in local storage
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    } else {
      localStorage.removeItem('userEmail');
    }
  }, [userEmail]);

  const loginAsGuest = () => {
    setRole('guest');
    setUserEmail(null); // Guests don't have an associated email
    toast.success('Logged in as Guest!');
    navigate('/');
  };

  // This function now expects the email that was successfully authenticated by the API
  const loginAsEmployee = (email: string) => {
    setRole('employee');
    setUserEmail(email); // Store the email received from the API response
    toast.success('Logged in as Employee!');
    navigate('/');
  };

  const logout = () => {
    setRole(null);
    setUserEmail(null); // Clear email on logout
    toast.info('Logged out.');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ role, userEmail, loginAsGuest, loginAsEmployee, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { role } = useAuth();
  const location = useLocation();

  if (!role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};