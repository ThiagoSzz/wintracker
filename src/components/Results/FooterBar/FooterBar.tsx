import { Group, Button, Tooltip, ActionIcon, Text } from "@mantine/core";
import { IconHelpHexagon, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useTranslation } from "react-i18next";
import { useEffect } from 'react';
import { useHelpMode } from '../../../hooks/useHelpMode';
import { useResultsContext } from "../../../pages/Results/ResultsContext";
import { useFooterBarStyles } from './FooterBar.styles';

interface FooterBarProps {
  onSave: () => void;
  onRevert: () => void;
  isLoading: boolean;
  editableMatchesLength: number;
  newMatchesLength: number;
}

export const FooterBar = ({
  onSave,
  onRevert,
  isLoading,
  editableMatchesLength,
  newMatchesLength,
}: FooterBarProps) => {
  const classes = useFooterBarStyles();
  const { t } = useTranslation();
  const { hasChanges, isHelpMode, currentStep, setHelpMode } = useResultsContext();
  
  const {
    currentHelpStep,
    currentStep: helpStep,
    totalSteps,
    toggleHelpMode: toggleHelpModeLocal,
    nextHelpStep,
    prevHelpStep,
  } = useHelpMode(editableMatchesLength, newMatchesLength);
  
  const currentStepId = currentStep?.id;
  const currentStepLabel = currentStep?.label;

  // Sync help step changes with context
  useEffect(() => {
    if (isHelpMode && helpStep) {
      setHelpMode(true, helpStep);
    }
  }, [helpStep, isHelpMode, setHelpMode]);

  const toggleHelpMode = () => {
    const newHelpMode = !isHelpMode;
    toggleHelpModeLocal();
    setHelpMode(newHelpMode, newHelpMode ? helpStep : undefined);
  };

  const handleNextHelpStep = () => {
    nextHelpStep();
  };

  const handlePrevHelpStep = () => {
    prevHelpStep();
  };

  return (
    <>
      <Group justify="space-between" className={classes.footer}>
        <Group gap="xs">
          <Tooltip label={t('helpButton')}>
            <ActionIcon
              size="lg"
              onClick={toggleHelpMode}
              color={isHelpMode ? 'blue' : 'gray'}
            >
              <IconHelpHexagon size={20} strokeWidth={1.4} />
            </ActionIcon>
          </Tooltip>

          {isHelpMode && (
            <Group gap={0}>
              <ActionIcon
                variant="outline"
                onClick={handlePrevHelpStep}
                disabled={currentHelpStep === 0}
                size="md"
              >
                <IconChevronLeft size={16} />
              </ActionIcon>

              <Text size="sm" className={classes.stepCounter}>
                {currentHelpStep + 1}/{totalSteps}
              </Text>

              <ActionIcon
                variant="outline"
                onClick={handleNextHelpStep}
                disabled={currentHelpStep === totalSteps - 1}
                size="md"
              >
                <IconChevronRight size={16} />
              </ActionIcon>
            </Group>
          )}
        </Group>

        <Group>
          <Tooltip
            label={currentStepId === 'revertButton' ? currentStepLabel : undefined}
            opened={isHelpMode && currentStepId === 'revertButton'}
            position="top"
            multiline
            withArrow
          >
            <div className={classes.revertButtonContainer}>
              {hasChanges && (
                <div className={classes.changeIndicator} />
              )}
              <Button
                color="red"
                variant="outline"
                onClick={onRevert}
                disabled={!hasChanges}
              >
                {t('revertButton')}
              </Button>
            </div>
          </Tooltip>
          <Tooltip
            label={currentStepId === 'saveButton' ? currentStepLabel : undefined}
            opened={isHelpMode && currentStepId === 'saveButton'}
            position="top"
            multiline
            withArrow
          >
            <div className={classes.saveButtonContainer}>
              <Button
                color="green"
                onClick={onSave}
                disabled={!hasChanges}
                loading={isLoading}
              >
                {t('saveButton')}
              </Button>
              {hasChanges && (
                <div className={classes.unsavedChangesText}>
                  {t('unsavedChangesFooter')}
                </div>
              )}
            </div>
          </Tooltip>
        </Group>
      </Group>
    </>
  );
};