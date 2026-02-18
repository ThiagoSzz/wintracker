import { useState, useEffect } from "react";
import { MantineProvider, Container, Alert } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { useUserStore } from "./store/userStore";
import { HomePage } from "./components/HomePage/HomePage";
import { WinLossTracker } from "./components/WinLossTracker/WinLossTracker";
import { initializeDatabase } from "./database/connection";
import { getUserByName } from "./database/queries/users";
import { useUrlParams } from "./hooks/useUrlParams";
import i18n from "./i18n/config";

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
  const { t } = useTranslation();
  const { currentUser, setCurrentUser } = useUserStore();
  const { initializeFromUrl, setUserParam, setLanguageParam, setPagePath } = useUrlParams();
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isLoadingFromUrl, setIsLoadingFromUrl] = useState(true);

  useEffect(() => {
    const initDb = async () => {
      try {
        await initializeDatabase();
        setIsDbInitialized(true);

        // Initialize from URL parameters
        const { userParam } = initializeFromUrl();

        if (userParam) {
          try {
            const user = await getUserByName(userParam);
            if (user) {
              setCurrentUser(user);
            }
          } catch {
            // Silent error handling - user will see the login form
          }
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
  }, [setCurrentUser, initializeFromUrl]);

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
        <Container size="sm" style={{ paddingTop: "2rem" }}>
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
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
          <WinLossTracker />
        ) : (
          <HomePage onUserLogin={handleUserLogin} />
        )}
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default App;
