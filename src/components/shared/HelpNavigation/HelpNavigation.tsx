import { Group, ActionIcon, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import { useHelpNavigationStyles } from "./HelpNavigation.styles";

interface HelpNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export const HelpNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onClose,
  isFirstStep,
  isLastStep,
}: HelpNavigationProps) => {
  const classes = useHelpNavigationStyles();

  return (
    <div className={classes.floatingBar}>
      <div className={classes.leftSection}>
        <ActionIcon
          variant="filled"
          color="red"
          size="sm"
          onClick={onClose}
        >
          <IconX size={16} />
        </ActionIcon>
      </div>

      <div className={classes.centerSection}>
        <Group gap={0}>
          <ActionIcon
            variant="outline"
            onClick={onPrevious}
            disabled={isFirstStep}
            size="sm"
          >
            <IconChevronLeft size={16} />
          </ActionIcon>

          <Text size="sm" className={classes.stepCounter}>
            {currentStep + 1}/{totalSteps}
          </Text>

          <ActionIcon
            variant="outline"
            onClick={onNext}
            disabled={isLastStep}
            size="sm"
          >
            <IconChevronRight size={16} />
          </ActionIcon>
        </Group>
      </div>

      <div></div>
    </div>
  );
};