
import { ReactNode } from 'react';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

const Layout = ({ children, showNavbar = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
