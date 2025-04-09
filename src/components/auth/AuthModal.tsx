
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string) => void;
}

const AuthModal = ({ 
  isOpen, 
  onClose, 
  defaultTab = "login", 
  onLogin, 
  onSignup 
}: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "signup");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Welcome to Garbh
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            <LoginForm onSubmit={onLogin} />
          </TabsContent>
          
          <TabsContent value="signup" className="mt-4">
            <SignupForm onSubmit={onSignup} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
