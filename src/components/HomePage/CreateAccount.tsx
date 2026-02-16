import { Title, Text, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Logo } from '../ui/Logo';
import { ErrorAlert } from '../ui/ErrorAlert';

interface CreateAccountProps {
  name: string;
  onCreate: () => void;
  onBack: () => void;
  error: string | null;
  isLoading: boolean;
}

export const CreateAccount = ({ name, onCreate, onBack, error, isLoading }: CreateAccountProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Logo 
          order={1} 
          size="h1" 
          style={{ marginBottom: '1rem' }}
        />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title order={2} size="h3" style={{ marginBottom: '0.5rem' }}>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
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
          style={{
            whiteSpace: 'normal !important',
            wordBreak: 'break-word',
            minHeight: '44px',
            height: 'auto',
            padding: '8px 16px',
            textOverflow: 'visible !important',
            overflow: 'visible !important',
            lineHeight: '1.4',
          }}
        >
          {t('alreadyHaveAccount1')}
          <br/>
          {t('alreadyHaveAccount2')}
        </Button>
      </div>
    </>
  );
};