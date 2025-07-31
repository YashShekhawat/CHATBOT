import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import { ChatHistoryProvider } from './context/ChatHistoryContext'; // Import ChatHistoryProvider
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import UploadPage from './pages/UploadPage';
import { ThemeProvider } from './components/theme-provider';
import EmployeeRoute from './components/EmployeeRoute';
import Layout from './components/Layout';
import { Toaster } from 'sonner'; // Import Toaster from sonner

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <ChatHistoryProvider> {/* Wrap with ChatHistoryProvider */}
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              {/* Protected routes using the new Layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ChatPage />} /> {/* Default route for / */}
                <Route path="chat" element={<ChatPage />} />
                <Route
                  path="upload"
                  element={
                    <EmployeeRoute>
                      <UploadPage />
                    </EmployeeRoute>
                  }
                />
              </Route>
            </Routes>
          </ChatHistoryProvider> {/* Close ChatHistoryProvider */}
        </AuthProvider>
      </Router>
      <Toaster richColors position="bottom-right" /> {/* Add Sonner Toaster here */}
    </ThemeProvider>
  );
}

export default App;