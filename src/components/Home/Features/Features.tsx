import { Title, SimpleGrid, Alert, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useFeaturesStyles } from './Features.styles';

export const Features = () => {
  const classes = useFeaturesStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.container}>
      <Title order={3} size="h4" className={classes.title}>
        {t('featuresTitle')}
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Alert color="blue" variant="light" className={classes.featureAlert}>
          <Text size="sm" fw={500}>
            {t('featureTrackWins')}
          </Text>
        </Alert>
        <Alert color="blue" variant="light" className={classes.featureAlert}>
          <Text size="sm" fw={500}>
            {t('featureAddOpponents')}
          </Text>
        </Alert>
        <Alert color="blue" variant="light" className={classes.featureAlert}>
          <Text size="sm" fw={500}>
            {t('featureEditResults')}
          </Text>
        </Alert>
      </SimpleGrid>
    </div>
  );
};