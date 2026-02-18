import { useState, useEffect } from "react";
import { MantineProvider, Container, Alert } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { useUserStore } from "./store/userStore";
import { Home } from "./pages/Home/Home";
import { Results } from "./pages/Results/Results";
import { initializeDatabase } from "./database/connection";
import { getUserByName } from "./database/queries/users";
import { useUrlParams } from "./hooks/useUrlParams";
import i18n from "./i18n/config";
import { useAppStyles } from "./App.styles";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

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
  const classes = useAppStyles();
  const { t } = useTranslation();
  const { currentUser, setCurrentUser } = useUserStore();
  const { initializeFromUrl, setUserParam, setLanguageParam, setPagePath, forceRedirectToHome } = useUrlParams();
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isLoadingFromUrl, setIsLoadingFromUrl] = useState(true);

  useEffect(() => {
    const initDb = async () => {
      try {
        await initializeDatabase();
        setIsDbInitialized(true);

        // Initialize from URL parameters
        try {
          const { userParam } = initializeFromUrl();

          if (userParam) {
            try {
              const user = await getUserByName(userParam);
              if (user) {
                setCurrentUser(user);
              } else {
                // User doesn't exist in database, redirect to home
                console.warn('User not found in database, redirecting to home');
                forceRedirectToHome();
              }
            } catch (error) {
              // Database error when looking up user, redirect to home
              console.warn('Database error looking up user, redirecting to home:', error);
              forceRedirectToHome();
            }
          }
        } catch (error) {
          // URL parameter initialization failed, user already redirected to home
          console.warn('URL parameter initialization failed, redirected to home:', error);
        }

        setIsLoadingFromUrl(false);
      } catch (error) {
        setDbError(
          error instanceof Error
            ? error.message
            : "Database initialization failed",
        );
        setIsLoadingFromUrl(false);
      }
    };

    initDb();
  }, [setCurrentUser, initializeFromUrl, setUserParam, forceRedirectToHome]);

  // Update URL when user changes (but not on initial load)
  useEffect(() => {
    if (isLoadingFromUrl) return;
    setUserParam(currentUser?.name || null);
  }, [currentUser, isLoadingFromUrl, setUserParam]);

  // Update URL when language changes
  useEffect(() => {
    if (isLoadingFromUrl) return;
    setLanguageParam(i18n.language);
  }, [i18n.language, isLoadingFromUrl, setLanguageParam]);

  // Update page path based on current view
  useEffect(() => {
    if (isLoadingFromUrl) return;
    
    if (currentUser) {
      setPagePath('/results');
    } else {
      setPagePath('/home');
    }
  }, [currentUser, isLoadingFromUrl, setPagePath]);

  const handleUserLogin = () => {
    // Navigation is handled by the user store state change
  };

  if (dbError) {
    return (
      <MantineProvider>
        <Container size="sm" className={classes.container}>
          <Alert color="red" title={t("databaseConnectionError")}>
            {dbError}
          </Alert>
        </Container>
      </MantineProvider>
    );
  }

  if (!isDbInitialized || isLoadingFromUrl) {
    return (
      <MantineProvider>
        <div className={classes.loadingContainer}>
          <div>{t("loading")}</div>
        </div>
      </MantineProvider>
    );
  }

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <Notifications />
        {currentUser ? (
          <Results />
        ) : (
          <Home onUserLogin={handleUserLogin} />
        )}
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default App;
