import { TextInput, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ErrorAlert } from '../ui/ErrorAlert';
import { useFormValidation } from '../../hooks/useFormValidation';

interface UserInputProps {
  onSubmit: (validatedName: string) => void;
  isLoading: boolean;
}

export const UserInput = ({ onSubmit, isLoading }: UserInputProps) => {
  const { t } = useTranslation();
  const { name, setName, error, validateAndSanitize } = useFormValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validatedName = validateAndSanitize(name);
    if (validatedName) {
      onSubmit(validatedName);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <TextInput
          label={t('enterName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="lg"
          disabled={isLoading}
          style={{ marginBottom: '1rem' }}
        />
      </div>

      {error && (
        <ErrorAlert
          message={error}
          style={{ marginBottom: '1rem' }}
        />
      )}

      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={!name.trim()}
      >
        {t('goButton')}
      </Button>
    </form>
  );
};