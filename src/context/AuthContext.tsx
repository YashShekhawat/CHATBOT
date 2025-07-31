import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { toast } from 'sonner';

type UserRole = 'guest' | 'employee' | null;

interface AuthContextType {
  role: UserRole;
  userEmail: string | null;
  loginAsGuest: () => void;
  loginAsEmployee: (email: string) => void;
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
  const [userEmail, setUserEmail] = useState<string | null>(() => {
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

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    } else {
      localStorage.removeItem('userEmail');
    }
  }, [userEmail]);

  const loginAsGuest = () => {
    setRole('guest');
    setUserEmail(null);
    toast.success('Logged in as Guest!');
    navigate('/');
  };

  const loginAsEmployee = (email: string) => {
    setRole('employee');
    setUserEmail(email);
    toast.success('Login successful!'); // Changed toast message here
    navigate('/');
  };

  const logout = () => {
    setRole(null);
    setUserEmail(null);
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