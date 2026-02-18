import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/config';
import { isValidLanguage } from '../types/Language';

export const useUrlParams = () => {
  useTranslation();

  const updateUrlParams = useCallback((params: Record<string, string | null>) => {
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
    if (window.location.pathname === '/') {
      window.history.replaceState({}, '', '/home' + window.location.search);
    }
  }, []);

  const setPagePath = useCallback((path: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const newUrl = urlParams.toString() 
      ? `${path}?${urlParams.toString()}`
      : path;
    
    if (window.location.pathname !== path) {
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const initializeFromUrl = useCallback(() => {
    redirectToHome();
    
    const languageParam = getUrlParam('language');
    const userParam = getUrlParam('user');
    
    if (languageParam && isValidLanguage(languageParam)) {
      i18n.changeLanguage(languageParam);
    }
    
    return {
      userParam: userParam ? decodeURIComponent(userParam) : null,
      languageParam
    };
  }, [getUrlParam, redirectToHome]);


  return {
    updateUrlParams,
    getUrlParam,
    setLanguageParam,
    setUserParam,
    redirectToHome,
    initializeFromUrl,
    setPagePath
  };
};
