import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Home, Upload, LogOut, MessageSquare, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Corrected import path
import { useTheme } from './theme-provider';

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onLinkClick) {
      onLinkClick();
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex flex-col h-full p-4 border-r border-border bg-background text-foreground">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-center">Chat App</h2>
        <nav className="space-y-2">
          <Link to="/chat" onClick={onLinkClick}>
            <Button variant="ghost" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" /> Chat
            </Button>
          </Link>
          <Link to="/upload" onClick={onLinkClick}>
            <Button variant="ghost" className="w-full justify-start">
              <Upload className="mr-2 h-4 w-4" /> Upload Knowledge
            </Button>
          </Link>
        </nav>
      </div>
      <div className="mt-auto space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={toggleTheme}>
          {theme === 'light' ? (
            <Moon className="mr-2 h-4 w-4" />
          ) : (
            <Sun className="mr-2 h-4 w-4" />
          )}
          Toggle Theme
        </Button>
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;