import { User } from './auth';

// Define a Netlify Identity user type
interface NetlifyUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  app_metadata?: {
    roles?: string[];
  };
  token?: {
    access_token?: string;
  };
}

// Define a mapped user type that transforms Netlify user to our app User
type MappedUser = Omit<User, 'role'> & {
  role: 'admin' | 'user';
  isAuthenticated?: boolean;
  token?: string;
}

declare global {
  interface Window {
    netlifyIdentity: {
      init: (options?: any) => void;
      on: (event: string, callback: Function) => void;
      open: (tab?: string) => void;
      close: () => void;
      logout: () => void;
      refresh: () => Promise<void>;
      currentUser: () => User | null;
      gotrue: any;
    };
  }
}

/**
 * Initializes Netlify Identity widget
 */
export const initNetlifyIdentity = () => {
  if (typeof window !== 'undefined' && window.netlifyIdentity) {
    window.netlifyIdentity.init({
      locale: 'en',
    });
  }
};

/**
 * Opens the Netlify Identity modal for authentication
 * @param tab The tab to open (login or signup)
 */
export const openNetlifyModal = (tab: 'login' | 'signup' = 'login') => {
  if (typeof window !== 'undefined' && window.netlifyIdentity) {
    window.netlifyIdentity.open(tab);
  } else {
    console.error('Netlify Identity is not available');
  }
};

/**
 * Handles Netlify Identity login
 * @returns A Promise that resolves to the authenticated user or null
 */
export const handleNetlifyLogin = (): Promise<User | null> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.netlifyIdentity) {
      window.netlifyIdentity.on('login', (user: NetlifyUser) => {
        const mappedUser: User = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || 'Anonymous User',
          avatar: user.user_metadata?.avatar_url || '',
          role: (user.app_metadata?.roles?.[0] as 'admin' | 'user') || 'user',
          organization: 'Alpha Platform',
          lastLogin: new Date().toISOString()
        };
        
        // Close the modal after login
        window.netlifyIdentity.close();
        resolve(mappedUser);
      });
    } else {
      resolve(null);
    }
  });
};

/**
 * Logs the user out
 */
export const handleNetlifyLogout = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.netlifyIdentity) {
      window.netlifyIdentity.logout();
      window.netlifyIdentity.on('logout', () => {
        resolve();
      });
    } else {
      resolve();
    }
  });
};

/**
 * Gets the current authenticated user
 * @returns The current authenticated user or null
 */
export const getCurrentNetlifyUser = (): User | null => {
  if (typeof window !== 'undefined' && window.netlifyIdentity) {
    const netUser = window.netlifyIdentity.currentUser() as NetlifyUser | null;
    
    if (netUser) {
      const mappedUser: User = {
        id: netUser.id,
        email: netUser.email,
        name: netUser.user_metadata?.full_name || 'Anonymous User',
        avatar: netUser.user_metadata?.avatar_url || '',
        role: (netUser.app_metadata?.roles?.[0] as 'admin' | 'user') || 'user',
        organization: 'Alpha Platform',
        lastLogin: new Date().toISOString()
      };
      return mappedUser;
    }
  }
  
  return null;
};

/**
 * Refreshes the current user's authentication token
 */
export const refreshNetlifyToken = async (): Promise<void> => {
  if (typeof window !== 'undefined' && window.netlifyIdentity) {
    try {
      await window.netlifyIdentity.refresh();
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }
};
