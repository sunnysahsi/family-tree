
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/User';
import { userApi } from '@/services/api';
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use React Query to fetch current user
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      // Check local storage first
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        return null;
      }
      
      const response = await userApi.getCurrentUser();
      if (response.status === 'error' || !response.data) {
        localStorage.removeItem('isLoggedIn');
        return null;
      }
      
      return response.data;
    },
    // Don't auto fetch on mount - we'll handle this ourselves
    enabled: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await userApi.login(email, password);
      if (response.status === 'error' || !response.data) {
        throw new Error(response.error || 'Login failed');
      }
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('isLoggedIn', 'true');
      queryClient.setQueryData(['currentUser'], data);
      toast({
        title: 'Logged in successfully!',
        description: 'Welcome back to Garbh.',
      });
      router.push('/dashboard');
    },
    onError: (error) => {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An error occurred while logging in',
        variant: 'destructive',
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const response = await userApi.signup(name, email, password);
      if (response.status === 'error' || !response.data) {
        throw new Error(response.error || 'Signup failed');
      }
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('isLoggedIn', 'true');
      queryClient.setQueryData(['currentUser'], data);
      toast({
        title: 'Account created!',
        description: 'Welcome to Garbh. Let\'s start building your family tree.',
      });
      router.push('/dashboard');
    },
    onError: (error) => {
      toast({
        title: 'Signup failed',
        description: error instanceof Error ? error.message : 'An error occurred during signup',
        variant: 'destructive',
      });
    },
  });

  // Call refetch whenever we mount this provider
  useEffect(() => {
    refetch();
  }, [refetch]);

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const signup = async (name: string, email: string, password: string) => {
    await signupMutation.mutateAsync({ name, email, password });
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    queryClient.setQueryData(['currentUser'], null);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user: data || null,
        isLoading: isLoading || loginMutation.isPending || signupMutation.isPending,
        isAuthenticated: !!data,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
