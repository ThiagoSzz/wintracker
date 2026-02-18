import { Title, Text, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../shared/Logo/Logo';
import { ErrorAlert } from '../../shared/ErrorAlert/ErrorAlert';
import { useCreateAccountStyles } from './CreateAccount.styles';

interface CreateAccountProps {
  name: string;
  onCreate: () => void;
  onBack: () => void;
  error: string | null;
  isLoading: boolean;
}

export const CreateAccount = ({ name, onCreate, onBack, error, isLoading }: CreateAccountProps) => {
  const classes = useCreateAccountStyles();
  const { t } = useTranslation();

  return (
    <>
      <div className={classes.header}>
        <Logo 
          order={1} 
          size="h1" 
          className={classes.logo}
        />
      </div>

      <div className={classes.titleContainer}>
        <Title order={2} size="h3" className={classes.title}>
          {t('createAccountFor', { name })}
        </Title>
        <Text size="lg" c="dimmed">
          {t('clickToCreate')}
        </Text>
      </div>

      {error && (
        <ErrorAlert
          message={error}
          style={{ marginBottom: '1rem' }}
        />
      )}

      <div className={classes.buttonContainer}>
        <Button
          size="lg"
          fullWidth
          loading={isLoading}
          onClick={onCreate}
        >
          {t('createAccountButton')}
        </Button>

        <Button
          variant="subtle"
          size="md"
          fullWidth
          onClick={onBack}
          disabled={isLoading}
          className={classes.backButton}
        >
          {t('alreadyHaveAccount1')}
          <br/>
          {t('alreadyHaveAccount2')}
        </Button>
      </div>
    </>
  );
};