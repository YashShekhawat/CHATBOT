import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ChatPage from "./pages/ChatPage";
import UploadPage from "./pages/UploadPage";
import LoginPage from "./pages/LoginPage"; // Import the new Login Page
import { AuthProvider, ProtectedRoute } from "./context/AuthContext"; // Import AuthProvider and ProtectedRoute

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider> {/* Wrap the entire app with AuthProvider */}
          <Routes>
            <Route path="/login" element={<LoginPage />} /> {/* Add the login route */}
            <Route element={<Layout />}>
              {/* Protect these routes */}
              <Route path="/" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;