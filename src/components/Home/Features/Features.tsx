/* eslint-disable react-hooks/exhaustive-deps */
import { Title, SimpleGrid, Alert, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useFeaturesStyles } from "./Features.styles";
import { useMemo } from "react";

export const Features = () => {
  const classes = useFeaturesStyles();
  const { t } = useTranslation();

  const features = useMemo(
    () => [
      t("featureTrackWins"),
      t("featureAddOpponents"),
      t("featureEditResults"),
    ],
    [],
  );

  const renderFeature = (text: string) => (
    <Alert color="blue" variant="light" className={classes.featureAlert}>
      <Text size="sm" fw={500}>
        {text}
      </Text>
    </Alert>
  );

  return (
    <div className={classes.container}>
      <Title order={3} size="h4" className={classes.title}>
        {t("featuresTitle")}
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        {features.map((feature) => renderFeature(feature))}
      </SimpleGrid>
    </div>
  );
};
