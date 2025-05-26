import { supabase } from './supabase';
import { User } from './auth';

/**
 * Initialize Supabase Auth
 */
export const initSupabaseAuth = () => {
  // No initialization needed, Supabase client is already initialized
};

/**
 * Logs in a user with email and password
 * @param email User's email
 * @param password User's password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Map Supabase user to our User model
    if (data.user) {
      return mapSupabaseUser(data.user);
    }
    
    return null;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Registers a new user with email and password
 * @param email User's email
 * @param password User's password
 * @param userData Additional user data
 */
export const signUpWithEmail = async (email: string, password: string, userData?: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData?.name || '',
          avatar_url: userData?.avatar || '',
        },
      },
    });
    
    if (error) throw error;
    
    // Map Supabase user to our User model
    if (data.user) {
      return mapSupabaseUser(data.user);
    }
    
    return null;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * Signs the current user out
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Gets the current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      return mapSupabaseUser(data.user);
    }
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Maps a Supabase user to our User model
 */
export const mapSupabaseUser = (supabaseUser: any): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.full_name || 'Anonymous User',
    avatar: supabaseUser.user_metadata?.avatar_url || '',
    role: supabaseUser.app_metadata?.role || 'user',
    organization: 'Alpha Platform',
    lastLogin: new Date().toISOString(),
  };
};
