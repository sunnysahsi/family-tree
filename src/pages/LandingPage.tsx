
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Lock, Share2, Trees } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { useToast } from "@/components/ui/use-toast";

const LandingPage = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<"login" | "signup">("signup");
  const navigate = useNavigate();
  const { toast } = useToast();

  const openSignup = () => {
    setAuthType("signup");
    setAuthOpen(true);
  };

  const openLogin = () => {
    setAuthType("login");
    setAuthOpen(true);
  };

  const handleLogin = async (email: string, password: string) => {
    // Simulate login for demo (would connect to backend auth in a real app)
    console.log("Login attempt", { email, password });
    
    // Simulating successful login
    localStorage.setItem("isLoggedIn", "true");
    
    toast({
      title: "Logged in successfully!",
      description: "Welcome back to Garbh.",
    });
    
    navigate("/dashboard");
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    // Simulate signup for demo (would connect to backend auth in a real app)
    console.log("Signup attempt", { name, email, password });
    
    // Simulating successful signup
    localStorage.setItem("isLoggedIn", "true");
    
    toast({
      title: "Account created!",
      description: "Welcome to Garbh. Let's start building your family tree.",
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-garbh-green/30 via-garbh-blue/20 to-garbh-purple/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 animate-fade-in">
                Preserve Your Family History
              </h1>
              <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Create, visualize, and share your family tree with Garbh, the most intuitive family tree builder.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <Button size="lg" onClick={openSignup}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={openLogin}>
                  Log In
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md animate-zoom-in">
                <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-garbh-green/30 animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-garbh-purple/30 animate-pulse"></div>
                <div className="bg-white rounded-2xl shadow-lg p-8 relative z-10">
                  <img 
                    src="https://cdn.pixabay.com/photo/2014/12/22/00/07/tree-576847_960_720.png" 
                    alt="Family Tree" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Garbh?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-garbh-green/10 rounded-xl p-6 border border-garbh-green/20 animate-fade-in">
              <div className="w-12 h-12 bg-garbh-green/20 rounded-full flex items-center justify-center mb-4">
                <Trees className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Beautiful Visualizations</h3>
              <p className="text-muted-foreground">
                Create stunning interactive family trees that visualize your family history in an intuitive way.
              </p>
            </div>
            
            <div className="bg-garbh-blue/10 rounded-xl p-6 border border-garbh-blue/20 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-12 h-12 bg-garbh-blue/20 rounded-full flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easily Share</h3>
              <p className="text-muted-foreground">
                Invite family members to view and collaborate on your family trees with simple sharing options.
              </p>
            </div>
            
            <div className="bg-garbh-purple/10 rounded-xl p-6 border border-garbh-purple/20 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-12 h-12 bg-garbh-purple/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Generations</h3>
              <p className="text-muted-foreground">
                Document the rich tapestry of your family history and connect multiple generations.
              </p>
            </div>
            
            <div className="bg-garbh-peach/10 rounded-xl p-6 border border-garbh-peach/20 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="w-12 h-12 bg-garbh-peach/20 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy Controls</h3>
              <p className="text-muted-foreground">
                You control who sees your family information with detailed privacy settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-garbh-purple/10">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Start Building Your Family Tree Today</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of families who are documenting and preserving their history with Garbh.
          </p>
          <Button size="lg" onClick={openSignup}>
            Create Your Free Account
          </Button>
        </div>
      </section>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authType}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </div>
  );
};

export default LandingPage;
