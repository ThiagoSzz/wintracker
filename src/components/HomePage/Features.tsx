import { Title, SimpleGrid, Alert, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export const Features = () => {
  const { t } = useTranslation();

  return (
    <div style={{ marginTop: '4rem' }}>
      <Title order={3} size="h4" style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1c7ed6' }}>
        {t('featuresTitle')}
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Alert color="blue" variant="light" style={{ border: 'none', backgroundColor: '#e7f5ff' }}>
          <Text size="sm" fw={500}>
            {t('featureTrackWins')}
          </Text>
        </Alert>
        <Alert color="blue" variant="light" style={{ border: 'none', backgroundColor: '#e7f5ff' }}>
          <Text size="sm" fw={500}>
            {t('featureAddOpponents')}
          </Text>
        </Alert>
        <Alert color="blue" variant="light" style={{ border: 'none', backgroundColor: '#e7f5ff' }}>
          <Text size="sm" fw={500}>
            {t('featureEditResults')}
          </Text>
        </Alert>
      </SimpleGrid>
    </div>
  );
};