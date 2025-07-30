import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import UploadPage from './pages/UploadPage';
import { ThemeProvider } from './components/theme-provider';
import EmployeeRoute from './components/EmployeeRoute';
import Layout from './components/Layout'; // Import the new Layout component

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
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
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;