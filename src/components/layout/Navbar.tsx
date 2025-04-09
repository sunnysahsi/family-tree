
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Book,
  Menu,
  X,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useMobileMenu } from "@/hooks/use-mobile";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isOpen, toggle, close } = useMobileMenu();
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Book className="h-5 w-5" />
            <span className="hidden font-bold sm:inline-block">
              Garbh
            </span>
          </Link>
          <div className="hidden md:flex">
            {isAuthenticated && (
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link
                  to="/dashboard"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    location.pathname === "/dashboard"
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  Dashboard
                </Link>
              </nav>
            )}
          </div>
        </div>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-8 w-8 rounded-full"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.name && <p className="font-medium">{user.name}</p>}
                    {user?.email && (
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile/edit" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Log In
              </Button>
              <Button onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </div>
          )}
          
          <Button
            variant="ghost"
            className="ml-2 h-8 w-8 px-0 md:hidden"
            onClick={toggle}
          >
            {isOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 p-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={close}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile/edit"
                  className="block w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={close}
                >
                  Edit Profile
                </Link>
                <div
                  className="block w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-accent text-destructive cursor-pointer"
                  onClick={() => {
                    logout();
                    close();
                  }}
                >
                  Log out
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={close}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="block w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={close}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
