import { Group, Button, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useWinLossContext } from './WinLossContext';

interface ToolbarProps {
  onAddNewMatch: () => void;
  newMatchesLength: number;
}

export const Toolbar = ({
  onAddNewMatch,
  newMatchesLength,
}: ToolbarProps) => {
  const { t } = useTranslation();
  const { isHelpMode, currentStep, isRemoveMode, toggleRemoveMode } = useWinLossContext();
  
  const currentStepId = currentStep?.id;
  const currentStepLabel = currentStep?.label;

  return (
    <Group
      justify="space-between"
      align="center"
      style={{ marginBottom: '1rem' }}
    >
      <Tooltip
        label={currentStepId === 'removeButton' ? currentStepLabel : undefined}
        opened={isHelpMode && currentStepId === 'removeButton'}
        position="bottom"
        multiline
        withArrow
      >
        <Button
          variant="outline"
          color="red"
          onClick={toggleRemoveMode}
          size="sm"
          style={{ minWidth: 'fit-content' }}
        >
          <span className="desktop-text">
            {newMatchesLength > 0
              ? "Cancel"
              : isRemoveMode
                ? t("stopRemovingButton")
                : t("removeOpponentsButton")}
          </span>
          <span className="mobile-text">
            {newMatchesLength > 0
              ? "Cancel"
              : isRemoveMode
                ? t("stopRemovingButtonShort")
                : t("removeOpponentsButtonShort")}
          </span>
        </Button>
      </Tooltip>

      <Tooltip
        label={currentStepId === 'addButton' ? currentStepLabel : undefined}
        opened={isHelpMode && currentStepId === 'addButton'}
        position="bottom"
        multiline
        withArrow
      >
        <Button
          color="blue"
          onClick={onAddNewMatch}
          size="sm"
          style={{ minWidth: 'fit-content' }}
          disabled={newMatchesLength > 0}
        >
          <span className="desktop-text">+ {t("addNewOpponent")}</span>
          <span className="mobile-text">{t("addNewOpponentShort")}</span>
        </Button>
      </Tooltip>
    </Group>
  );
};