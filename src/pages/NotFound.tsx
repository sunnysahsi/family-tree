
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-garbh-blue/10">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! We couldn't find this page.</p>
        <div className="relative">
          <div className="absolute -top-16 -left-8 w-16 h-16 rounded-full bg-garbh-green/30 animate-pulse"></div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-garbh-purple/30 animate-pulse"></div>
          <Button asChild size="lg">
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
