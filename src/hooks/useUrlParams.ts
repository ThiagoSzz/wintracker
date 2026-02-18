import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/config';
import { isValidLanguage } from '../types/Language';

export const useUrlParams = () => {
  useTranslation();

  const updateUrlParams = useCallback((params: Record<string, string | null>) => {
    if (typeof window === 'undefined') return; // SSR safety
    
    const urlParams = new URLSearchParams(window.location.search);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        urlParams.delete(key);
      } else {
        urlParams.set(key, value);
      }
    });

    const newUrl = urlParams.toString() 
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;
    
    window.history.replaceState({}, '', newUrl);
  }, []);

  const getUrlParam = useCallback((key: string): string | null => {
    if (typeof window === 'undefined') return null; // SSR safety
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
  }, []);

  const setLanguageParam = useCallback((language: string) => {
    updateUrlParams({ language });
  }, [updateUrlParams]);

  const setUserParam = useCallback((user: string | null) => {
    updateUrlParams({ user: user ? encodeURIComponent(user) : null });
  }, [updateUrlParams]);

  const redirectToHome = useCallback(() => {
    if (typeof window === 'undefined') return; // SSR safety
    
    if (window.location.pathname === '/') {
      window.history.replaceState({}, '', '/home' + window.location.search);
    }
  }, []);

  const forceRedirectToHome = useCallback(() => {
    if (typeof window === 'undefined') return; // SSR safety
    
    // Clear all URL parameters and redirect to home
    window.history.replaceState({}, '', '/home');
  }, []);

  const setPagePath = useCallback((path: string) => {
    if (typeof window === 'undefined') return; // SSR safety
    
    const urlParams = new URLSearchParams(window.location.search);
    const newUrl = urlParams.toString() 
      ? `${path}?${urlParams.toString()}`
      : path;
    
    if (window.location.pathname !== path) {
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const initializeFromUrl = useCallback(() => {
    try {
      redirectToHome();
      
      const languageParam = getUrlParam('language');
      const userParam = getUrlParam('user');
      
      if (languageParam && isValidLanguage(languageParam)) {
        i18n.changeLanguage(languageParam);
      }
      
      let decodedUserParam = null;
      if (userParam) {
        try {
          decodedUserParam = decodeURIComponent(userParam);
        } catch (error) {
          console.warn('Failed to decode user parameter:', error);
          // Clear invalid user param and redirect to home
          forceRedirectToHome();
          throw new Error('Invalid URL parameters');
        }
      }
      
      return {
        userParam: decodedUserParam,
        languageParam
      };
    } catch (error) {
      console.warn('URL parameter initialization failed:', error);
      forceRedirectToHome();
      throw error;
    }
  }, [getUrlParam, redirectToHome, updateUrlParams, forceRedirectToHome]);


  return {
    updateUrlParams,
    getUrlParam,
    setLanguageParam,
    setUserParam,
    redirectToHome,
    forceRedirectToHome,
    initializeFromUrl,
    setPagePath
  };
};
