import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define Database type inline instead of importing from a separate file
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          model_id: string | null;
          prompt_id: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          configuration: Json;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          model_id?: string | null;
          prompt_id?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          configuration?: Json;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          model_id?: string | null;
          prompt_id?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          configuration?: Json;
          is_active?: boolean;
        };
      };
      prompts: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          content: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          variables: Json;
          version: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          content: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          variables?: Json;
          version?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          content?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          variables?: Json;
          version?: number;
          is_active?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Only create the client when needed and in a browser context
export const createSupabaseClient = () => {
  if (!isBrowser) {
    // Return dummy client for SSR
    return {
      auth: {
        signIn: () => Promise.resolve({ user: null, session: null, error: new Error('Not in browser') }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: null, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Not in browser') }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Not in browser') }),
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Not in browser') }),
        getSession: () => Promise.resolve({ data: { session: null }, error: new Error('Not in browser') }),
      },
      from: () => ({ select: () => ({ data: [], error: null }) }),
    };
  }
  
  // Create and return actual client in browser
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Export a singleton instance
export const supabase = createSupabaseClient();

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return { error: error?.message || 'An unexpected error occurred' };
};
