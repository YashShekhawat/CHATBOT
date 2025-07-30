import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { toast } from 'sonner';

type UserRole = 'guest' | 'employee' | null;

interface AuthContextType {
  role: UserRole;
  loginAsGuest: () => void;
  loginAsEmployee: (email: string, password: string) => void;
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
  const navigate = useNavigate();

  useEffect(() => {
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [role]);

  const loginAsGuest = () => {
    setRole('guest');
    toast.success('Logged in as Guest!');
    navigate('/');
  };

  const loginAsEmployee = (email: string, password: string) => {
    // TODO: Integrate employee login API here.
    // For now, simulating a successful login.
    console.log(`Attempting to log in as employee with email: ${email}, password: ${password}`);
    setRole('employee');
    toast.success('Logged in as Employee!');
    navigate('/');
  };

  const logout = () => {
    setRole(null);
    toast.info('Logged out.');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ role, loginAsGuest, loginAsEmployee, logout }}>
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
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};