import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmail, signUpWithEmail, signOut, getCurrentUser } from './supabase-auth';
import { supabase } from './supabase';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  organization?: string;
  lastLogin?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (provider: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData?: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  loginWithEmail: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth
  useEffect(() => {
    // Check for existing user
    const checkForUser = async () => {
      try {
        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem('alpha_user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Try to get user from Supabase
          const currentUser = await getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem('alpha_user', JSON.stringify(currentUser));
          }
        }
      } catch (err) {
        console.error('Error checking for user:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkForUser();
    
    // Set up Supabase auth subscription
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        getCurrentUser().then(mappedUser => {
          if (mappedUser) {
            setUser(mappedUser);
            localStorage.setItem('alpha_user', JSON.stringify(mappedUser));
          }
        });
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('alpha_user');
        router.push('/login');
      }
    });
    
    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);
  
  // Login with a provider (like "supabase")
  const login = async (provider: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (provider === 'supabase' || provider === 'email') {
        // Show login UI
        router.push('/login');
      } else {
        // For development or when auth service isn't available
        useFallbackAuth();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  // Login with email/password
  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we're using Supabase auth in production
      if (process.env.NEXT_PUBLIC_AUTH_PROVIDER === 'supabase') {
        const user = await signInWithEmail(email, password);
        if (user) {
          setUser(user);
          localStorage.setItem('alpha_user', JSON.stringify(user));
          router.push('/');
        }
      } else {
        // Fallback for development
        useFallbackAuth(email);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  // Register a new user
  const signup = async (email: string, password: string, userData?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we're using Supabase auth in production
      if (process.env.NEXT_PUBLIC_AUTH_PROVIDER === 'supabase') {
        const user = await signUpWithEmail(email, password, userData);
        if (user) {
          setUser(user);
          localStorage.setItem('alpha_user', JSON.stringify(user));
          router.push('/');
        }
      } else {
        // Fallback for development
        useFallbackAuth(email, userData?.name);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to signup');
    } finally {
      setLoading(false);
    }
  };
  
  // Fallback authentication for development and when auth service isn't available
  const useFallbackAuth = (email: string = 'demo@alphaplatform.dev', name: string = 'Demo User') => {
    // Create a demo user
    const demoUser: User = {
      id: 'demo-user-' + Date.now(),
      email: email,
      name: name || email.split('@')[0],
      avatar: '',
      role: 'admin',
      organization: 'Alpha Platform',
      lastLogin: new Date().toISOString()
    };
    
    // Set the user in state and localStorage
    setUser(demoUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('alpha_user', JSON.stringify(demoUser));
    }
    
    // Navigate to dashboard
    router.push('/');
  };
  
  // Handle logout
  const logout = async () => {
    setLoading(true);
    
    try {
      // Check if we're using Supabase auth in production
      if (process.env.NEXT_PUBLIC_AUTH_PROVIDER === 'supabase') {
        await signOut();
      }
      
      // Clear user from state and storage
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('alpha_user');
      }
      
      // Redirect to login page
      router.push('/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message || 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    error,
    login,
    loginWithEmail,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
