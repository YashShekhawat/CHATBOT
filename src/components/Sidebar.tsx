import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Upload, LogOut, MessageSquare } from 'lucide-react'; // Removed Sun, Moon
import { useAuth } from '../context/AuthContext';
// Removed useTheme import as it's no longer needed here

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const { logout, role } = useAuth();
  const navigate = useNavigate();
  // Removed theme and setTheme from useTheme

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onLinkClick) {
      onLinkClick();
    }
  };

  // Removed toggleTheme function

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
          {role === 'employee' && (
            <Link to="/upload" onClick={onLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" /> Upload Knowledge
              </Button>
            </Link>
          )}
        </nav>
      </div>
      <div className="mt-auto space-y-2">
        {/* Removed Toggle Theme Button */}
        {role && (
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;