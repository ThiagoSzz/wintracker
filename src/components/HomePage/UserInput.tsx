import { TextInput, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ErrorAlert } from '../ui/ErrorAlert';

interface UserInputProps {
  name: string;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
  error: string | null;
  isLoading: boolean;
}

export const UserInput = ({ name, onNameChange, onSubmit, error, isLoading }: UserInputProps) => {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <TextInput
          label={t('enterName')}
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
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