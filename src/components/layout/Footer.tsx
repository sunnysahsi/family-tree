
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white py-6 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Garbh. All rights reserved.
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-muted-foreground text-sm flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-garbh-pink" /> for families everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
