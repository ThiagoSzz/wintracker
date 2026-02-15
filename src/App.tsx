import { useState, useEffect } from 'react';
import { MantineProvider, Container, Alert } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';
import { useUserStore } from './store/userStore';
import { HomePage } from './components/HomePage';
import { WinLossTracker } from './components/WinLossTracker';
import { initializeDatabase } from './database/connection';
import { getUserByName } from './database/queries/users';
import './i18n/config';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  const { currentUser, setCurrentUser } = useUserStore();
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isLoadingFromUrl, setIsLoadingFromUrl] = useState(true);

  useEffect(() => {
    const initDb = async () => {
      try {
        await initializeDatabase();
        setIsDbInitialized(true);
        
        // After DB is initialized, check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const userParam = urlParams.get('user');
        
        console.log('Checking URL parameters:', { userParam, currentURL: window.location.href });
        
        if (userParam) {
          try {
            // Decode the URL parameter in case it has encoded characters
            const decodedUserParam = decodeURIComponent(userParam);
            console.log('Attempting to load user from URL:', decodedUserParam);
            const user = await getUserByName(decodedUserParam);
            if (user) {
              console.log('Successfully loaded user from URL:', user);
              setCurrentUser(user);
            } else {
              console.warn('User not found in database:', decodedUserParam);
            }
          } catch (error) {
            console.error('Failed to load user from URL:', error);
          }
        }
        
        setIsLoadingFromUrl(false);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDbError(error instanceof Error ? error.message : 'Database initialization failed');
        setIsLoadingFromUrl(false);
      }
    };

    initDb();
  }, [setCurrentUser]);

  // Update URL when user changes (but not on initial load)
  useEffect(() => {
    // Skip URL updates during initial load when we're loading from URL
    if (isLoadingFromUrl) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    
    if (currentUser) {
      // Encode the user name to handle special characters and spaces
      urlParams.set('user', encodeURIComponent(currentUser.name));
    } else {
      urlParams.delete('user');
    }
    
    const newUrl = urlParams.toString() 
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;
    
    window.history.replaceState({}, '', newUrl);
  }, [currentUser, isLoadingFromUrl]);

  const handleUserLogin = () => {
    // Navigation is handled by the user store state change
  };

  if (dbError) {
    return (
      <MantineProvider>
        <Container size="sm" style={{ paddingTop: '2rem' }}>
          <Alert color="red" title="Database Connection Error">
            {dbError}
          </Alert>
        </Container>
      </MantineProvider>
    );
  }

  if (!isDbInitialized || isLoadingFromUrl) {
    return (
      <MantineProvider>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading...</div>
        </div>
      </MantineProvider>
    );
  }

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <Notifications />
        {currentUser ? (
          <WinLossTracker />
        ) : (
          <HomePage onUserLogin={handleUserLogin} />
        )}
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default App;