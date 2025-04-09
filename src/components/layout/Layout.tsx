
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={isAuthenticated} 
        onLogin={() => {}} // These will be handled by page components
        onSignup={() => {}} // using modals rather than in the navbar
        onLogout={logout}
      />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
