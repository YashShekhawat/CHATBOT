import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Upload, LogOut, MessageSquare, Sun, Moon, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from './theme-provider';
import { toast } from 'sonner';
import { getChatHistoryKey } from '@/utils/constants'; // Import the new helper
import { useChatHistory } from '@/context/ChatHistoryContext';

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const { logout, role, userEmail } = useAuth(); // Get userEmail
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { triggerClearChatHistory } = useChatHistory();

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
    if (userEmail) {
      localStorage.removeItem(getChatHistoryKey(userEmail)); // Use user-specific key
      triggerClearChatHistory();
      toast.info("Chat history cleared!");
    } else {
      toast.error("Cannot clear history: No user email found.");
    }
    if (onLinkClick) {
      onLinkClick(); // Close sidebar sheet on mobile
    }
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
        {role === 'employee' && (
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600"
            onClick={handleClearChatHistory}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear Chat History
          </Button>
        )}
        {role && (
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