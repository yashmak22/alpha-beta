import type { AppProps } from 'next/app';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import theme from '@/styles/theme';
import { store } from '@/store';
import { apolloClient } from '@/lib/apollo';
import { AuthProvider, useAuth } from '@/lib/auth';

// Create React Query client
const queryClient = new QueryClient();

// Public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];

// Route Guard component to protect routes
function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Don't run on public routes
    if (publicRoutes.includes(router.pathname)) {
      return;
    }
    
    // If not authenticated and not loading, redirect to login
    if (!isAuthenticated && !loading) {
      // Store current path for redirect after login
      sessionStorage.setItem('auth_redirect', router.asPath);
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);
  
  // Don't show protected content while checking auth
  if (loading && !publicRoutes.includes(router.pathname)) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }
  
  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ApolloProvider client={apolloClient}>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <AuthProvider>
                <RouteGuard>
                  <Component {...pageProps} />
                </RouteGuard>
              </AuthProvider>
            </ChakraProvider>
          </QueryClientProvider>
        </ReduxProvider>
      </ApolloProvider>
    </>
  );
}
