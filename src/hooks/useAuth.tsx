
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/User";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to verify the token
        // For demo purposes, we'll check localStorage
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        
        if (isLoggedIn) {
          // Mock user data
          setUser({
            id: "user1",
            name: "Demo User",
            email: "user@example.com",
            createdAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      localStorage.setItem("isLoggedIn", "true");
      
      // Mock user data
      setUser({
        id: "user1",
        name: "Demo User",
        email,
        createdAt: new Date().toISOString(),
      });
      
      toast({
        title: "Logged in successfully!",
        description: "Welcome back to Garbh."
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful signup
      localStorage.setItem("isLoggedIn", "true");
      
      // Mock user data
      setUser({
        id: "user1",
        name,
        email,
        createdAt: new Date().toISOString(),
      });
      
      toast({
        title: "Account created!",
        description: "Welcome to Garbh. Let's start building your family tree."
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try again with different information.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
