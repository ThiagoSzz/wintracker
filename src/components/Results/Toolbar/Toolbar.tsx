import { Group, Button, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useResultsContext } from '../../../pages/Results/ResultsContext';
import { useToolbarStyles } from './Toolbar.styles';

interface ToolbarProps {
  onAddNewMatch: () => void;
  newMatchesLength: number;
  onCancelAddMode: () => void;
}

export const Toolbar = ({
  onAddNewMatch,
  newMatchesLength,
  onCancelAddMode,
}: ToolbarProps) => {
  const classes = useToolbarStyles();
  const { t } = useTranslation();
  const { isHelpMode, currentStep, isRemoveMode, toggleRemoveMode } = useResultsContext();
  
  const currentStepId = currentStep?.id;
  const currentStepLabel = currentStep?.label;

  return (
    <Group
      justify="space-between"
      align="center"
      className={classes.toolbar}
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
          onClick={newMatchesLength > 0 ? onCancelAddMode : toggleRemoveMode}
          size="sm"
          className={classes.button}
        >
          <span className="desktop-text">
            {newMatchesLength > 0
              ? t("cancelButton")
              : isRemoveMode
                ? t("stopRemovingButton")
                : t("removeOpponentsButton")}
          </span>
          <span className="mobile-text">
            {newMatchesLength > 0
              ? t("cancelButton")
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
          className={classes.button}
          disabled={isRemoveMode}
        >
          <span className="desktop-text">+ {t("addNewOpponent")}</span>
          <span className="mobile-text">{t("addNewOpponentShort")}</span>
        </Button>
      </Tooltip>
    </Group>
  );
};