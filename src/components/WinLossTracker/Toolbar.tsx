import { Group, Button, Tooltip, ActionIcon, Text } from '@mantine/core';
import { IconHelpHexagon, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface ToolbarProps {
  isHelpMode: boolean;
  onToggleHelp: () => void;
  currentHelpStep: number;
  totalHelpSteps: number;
  onPrevHelpStep: () => void;
  onNextHelpStep: () => void;
  hasChanges: boolean;
  onSave: () => void;
  onRevert: () => void;
  isLoading: boolean;
  currentStepId?: string;
  currentStepLabel?: string;
}

export const Toolbar = ({
  isHelpMode,
  onToggleHelp,
  currentHelpStep,
  totalHelpSteps,
  onPrevHelpStep,
  onNextHelpStep,
  hasChanges,
  onSave,
  onRevert,
  isLoading,
  currentStepId,
  currentStepLabel,
}: ToolbarProps) => {
  const { t } = useTranslation();

  return (
    <Group justify="space-between" style={{ marginBottom: '1rem' }}>
      <Group gap="xs">
        <Tooltip label={t('helpButton')}>
          <ActionIcon
            size="lg"
            onClick={onToggleHelp}
            color={isHelpMode ? 'blue' : 'gray'}
          >
            <IconHelpHexagon size={20} strokeWidth={1.4} />
          </ActionIcon>
        </Tooltip>

        {isHelpMode && (
          <Group gap={4}>
            <ActionIcon
              variant="outline"
              onClick={onPrevHelpStep}
              disabled={currentHelpStep === 0}
              size="md"
            >
              <IconChevronLeft size={16} />
            </ActionIcon>

            <Text size="sm" style={{ minWidth: '40px', textAlign: 'center' }}>
              {currentHelpStep + 1}/{totalHelpSteps}
            </Text>

            <ActionIcon
              variant="outline"
              onClick={onNextHelpStep}
              disabled={currentHelpStep === totalHelpSteps - 1}
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
          position="bottom"
          multiline
          withArrow
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {hasChanges && (
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#ffd43b',
                  borderRadius: '50%',
                  marginRight: '25px',
                }}
              />
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
          <Button
            color="green"
            onClick={onSave}
            disabled={!hasChanges}
            loading={isLoading}
          >
            {t('saveButton')}
          </Button>
        </Tooltip>
      </Group>
    </Group>
  );
};