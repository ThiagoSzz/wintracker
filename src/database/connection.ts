import { neon } from '@neondatabase/serverless';

const databaseUrl = import.meta.env.VITE_DATABASE_URL;

if (!databaseUrl || databaseUrl === 'your_neon_connection_string_here') {
  throw new Error('Please set VITE_DATABASE_URL in your .env.local file with a valid Neon connection string');
}

export const sql = neon(databaseUrl, {
  disableWarningInBrowsers: true
});

// Singleton pattern for database initialization
let isInitialized = false;
const initializationPromise: Promise<void> | null = null;

export const initializeDatabase = async (): Promise<void> => {
  // If already initialized, return immediately
  if (isInitialized) {
    return Promise.resolve();
  }

  // If initialization is in progress, return the same promise
  if (initializationPromise) {
    return initializationPromise;
  }

  // Mark as initialized since no actual initialization is needed
  isInitialized = true;
  return Promise.resolve();
};
