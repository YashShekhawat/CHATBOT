import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext'; // Corrected import paths
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import UploadPage from './pages/UploadPage';
import Sidebar from './components/Sidebar';
import { Sheet, SheetContent } from './components/ui/sheet';
import { Button } from './components/ui/button';
import { Menu } from 'lucide-react';
import { ThemeProvider } from './components/theme-provider';

function App() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar for larger screens */}
            <div className="hidden md:flex md:w-64 flex-shrink-0">
              <Sidebar />
            </div>

            {/* Mobile Sheet for smaller screens */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar onLinkClick={() => setIsSheetOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Top bar for mobile to open sidebar */}
              <div className="md:hidden p-4 border-b border-border flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => setIsSheetOpen(true)}>
                  <Menu className="h-6 w-6" />
                </Button>
                <h1 className="text-xl font-semibold">Chat App</h1>
                <div></div> {/* Placeholder for balance */}
              </div>

              {/* Main content area */}
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/upload"
                    element={
                      <ProtectedRoute>
                        <UploadPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<LoginPage />} /> {/* Default route */}
                </Routes>
              </main>
            </div>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;