import { Group, Button, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useWinLossContext } from "./WinLossContext";

interface FooterBarProps {
  onAddNewMatch: () => void;
  newMatchesLength: number;
  clearNewMatches: () => void;
}

export const FooterBar = ({
  onAddNewMatch,
  newMatchesLength,
  clearNewMatches,
}: FooterBarProps) => {
  const { t } = useTranslation();
  const { hasChanges, isHelpMode, currentStep, isRemoveMode, toggleRemoveMode } = useWinLossContext();
  
  const currentStepId = currentStep?.id;
  const currentStepLabel = currentStep?.label;

  const handleToggleRemoveMode = () => {
    if (newMatchesLength > 0) {
      clearNewMatches();
      return;
    }
    toggleRemoveMode();
  };

  return (
    <>
      <Group
        justify="space-between"
        align="center"
        style={{ marginTop: "1rem", width: "100%" }}
      >
        <Tooltip
          label={
            currentStepId === "removeButton" ? currentStepLabel : undefined
          }
          opened={isHelpMode && currentStepId === "removeButton"}
          position="top"
          multiline
          withArrow
        >
          <Button
            variant="outline"
            color="red"
            onClick={handleToggleRemoveMode}
            size="sm"
            style={{ minWidth: "fit-content" }}
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
          label={currentStepId === "addButton" ? currentStepLabel : undefined}
          opened={isHelpMode && currentStepId === "addButton"}
          position="top"
          multiline
          withArrow
        >
          <Button
            color="blue"
            onClick={onAddNewMatch}
            size="sm"
            style={{ minWidth: "fit-content" }}
            disabled={newMatchesLength > 0}
          >
            <span className="desktop-text">+ {t("addNewOpponent")}</span>
            <span className="mobile-text">{t("addNewOpponentShort")}</span>
          </Button>
        </Tooltip>
      </Group>

      {hasChanges && (
        <div
          style={{
            textAlign: "center",
            marginTop: "0.5rem",
            color: "#868e96",
            fontSize: "12px",
          }}
        >
          Unsaved changes
        </div>
      )}
    </>
  );
};
