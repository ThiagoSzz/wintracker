import { Title, Text, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../shared/Logo/Logo';
import { ErrorAlert } from '../../shared/ErrorAlert/ErrorAlert';
import { useWelcomeBackStyles } from './WelcomeBack.styles';

interface WelcomeBackProps {
  name: string;
  onContinue: () => void;
  onBack: () => void;
  error: string | null;
  isLoading: boolean;
}

export const WelcomeBack = ({ name, onContinue, onBack, error, isLoading }: WelcomeBackProps) => {
  const classes = useWelcomeBackStyles();
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
          {t('welcomeBack', { name })}
        </Title>
        <Text size="lg" c="dimmed">
          {t('clickToContinue')}
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
          onClick={onContinue}
        >
          {t('continueButton')}
        </Button>

        <Button
          variant="subtle"
          size="md"
          fullWidth
          onClick={onBack}
          disabled={isLoading}
          className={classes.backButton}
        >
          {t('notYou')}
        </Button>
      </div>
    </>
  );
};