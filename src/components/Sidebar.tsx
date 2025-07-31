import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Upload, LogOut, MessageSquare, Sun, Moon, Trash2 } from 'lucide-react'; // Added Trash2
import { useAuth } from '../context/AuthContext';
import { useTheme } from './theme-provider';
import { toast } from 'sonner'; // Import toast
import { EMPLOYEE_CHAT_HISTORY_KEY } from '@/utils/constants'; // Import the constant

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const { logout, role } = useAuth();
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

  const handleClearChatHistory = () => {
    localStorage.removeItem(EMPLOYEE_CHAT_HISTORY_KEY);
    toast.info("Chat history cleared!");
    if (onLinkClick) {
      onLinkClick(); // Close sidebar sheet on mobile
    }
    // Optionally, navigate to chat page to force re-render and clear state
    navigate('/chat');
  };

  return (
    <div className="flex flex-col h-full p-4 border-r border-border bg-background text-foreground">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold m-2 mb-7 text-center">
          <img src="/public/logo.png" alt="" width="150px" />
        </h2>
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
        {role === 'employee' && ( // Conditionally render clear chat button for employees
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600"
            onClick={handleClearChatHistory}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear Chat History
          </Button>
        )}
        {role && ( // Conditionally render theme toggle if logged in
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            Toggle Theme
          </Button>
        )}
        {role && (
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;