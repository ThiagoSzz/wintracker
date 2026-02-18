import { TextInput, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ErrorAlert } from '../../shared/ErrorAlert/ErrorAlert';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useUserInputStyles } from './UserInput.styles';

interface UserInputProps {
  onSubmit: (validatedName: string) => void;
  isLoading: boolean;
}

export const UserInput = ({ onSubmit, isLoading }: UserInputProps) => {
  const classes = useUserInputStyles();
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
      <div className={classes.formGroup}>
        <TextInput
          label={t('enterName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="lg"
          disabled={isLoading}
          className={classes.textInput}
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