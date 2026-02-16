import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { validateName, sanitizeName } from '../lib/validations';

export const useFormValidation = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [sanitizedName, setSanitizedName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateAndSanitize = useCallback((inputName: string) => {
    const sanitized = sanitizeName(inputName);
    const validationError = validateName(sanitized);

    if (validationError) {
      setError(t(validationError));
      return null;
    }

    setError(null);
    setSanitizedName(sanitized);
    return sanitized;
  }, [t]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setName('');
    setSanitizedName('');
    setError(null);
  }, []);

  return {
    name,
    setName,
    sanitizedName,
    error,
    validateAndSanitize,
    clearError,
    reset,
  };
};