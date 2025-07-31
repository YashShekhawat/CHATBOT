import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import { ChatHistoryProvider } from './context/ChatHistoryContext';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import UploadPage from './pages/UploadPage';
import { ThemeProvider } from './components/theme-provider';
import EmployeeRoute from './components/EmployeeRoute';
import Layout from './components/Layout';
import { Toaster } from 'sonner';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <ChatHistoryProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ChatPage />} />
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
          </ChatHistoryProvider>
        </AuthProvider>
      </Router>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}

export default App;