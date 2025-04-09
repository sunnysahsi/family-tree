
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import TreeView from "@/pages/TreeView";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<"login" | "signup">("login");

  // Check for login status on app load
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setAuthModalType("login");
    setIsAuthModalOpen(true);
  };

  const handleSignup = () => {
    setAuthModalType("signup");
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  // Route protection component
  const RequireAuth = ({ children }: { children: JSX.Element }) => {
    return isLoggedIn ? children : <Navigate to="/" />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar 
              isLoggedIn={isLoggedIn} 
              onLogin={handleLogin} 
              onSignup={handleSignup}
              onLogout={handleLogout}
            />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LandingPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/tree/:id" 
                  element={
                    <RequireAuth>
                      <TreeView />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/tree/:id/edit" 
                  element={
                    <RequireAuth>
                      <TreeView />
                    </RequireAuth>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
