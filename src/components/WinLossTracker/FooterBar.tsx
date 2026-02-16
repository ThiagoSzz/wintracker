import { Group, Button, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface FooterBarProps {
  onToggleRemoveMode: () => void;
  onAddNewMatch: () => void;
  isRemoveMode: boolean;
  newMatchesLength: number;
  hasChanges: boolean;
  isHelpMode: boolean;
  currentStepId?: string;
  currentStepLabel?: string;
}

export const FooterBar = ({
  onToggleRemoveMode,
  onAddNewMatch,
  isRemoveMode,
  newMatchesLength,
  hasChanges,
  isHelpMode,
  currentStepId,
  currentStepLabel,
}: FooterBarProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Group
        justify="space-between"
        align="center"
        style={{ marginTop: '1rem', width: '100%' }}
      >
        <Tooltip
          label={currentStepId === 'removeButton' ? currentStepLabel : undefined}
          opened={isHelpMode && currentStepId === 'removeButton'}
          position="top"
          multiline
          withArrow
        >
          <Button
            variant="outline"
            color="red"
            onClick={onToggleRemoveMode}
            size="sm"
            style={{ minWidth: 'fit-content' }}
          >
            <span className="desktop-text">
              {newMatchesLength > 0 
                ? "Cancel"
                : isRemoveMode 
                  ? t("stopRemovingButton") 
                  : t("removeOpponentsButton")
              }
            </span>
            <span className="mobile-text">
              {newMatchesLength > 0 
                ? "Cancel"
                : isRemoveMode 
                  ? t("stopRemovingButtonShort") 
                  : t("removeOpponentsButtonShort")
              }
            </span>
          </Button>
        </Tooltip>

        <Tooltip
          label={currentStepId === 'addButton' ? currentStepLabel : undefined}
          opened={isHelpMode && currentStepId === 'addButton'}
          position="top"
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
      
      {hasChanges && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '0.5rem',
          color: '#868e96',
          fontSize: '12px'
        }}>
          Unsaved changes
        </div>
      )}
    </>
  );
};