import { Group, Button, Tooltip, ActionIcon, Text } from "@mantine/core";
import {
  IconHelpHexagon,
  IconChevronLeft,
  IconChevronRight,
  IconChartBar,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useHelpMode } from "../../../hooks/useHelpMode";
import { useReportGeneration } from "../../../hooks/useReportGeneration";
import { useResultsContext } from "../../../pages/Results/ResultsContext";
import { ReportModal } from "../../shared/ReportModal/ReportModal";
import { useFooterBarStyles } from "./FooterBar.styles";
import type { Match } from "../../../types/Match";

interface FooterBarProps {
  onSave: () => void;
  onRevert: () => void;
  isLoading: boolean;
  editableMatchesLength: number;
  newMatchesLength: number;
  matches: Match[];
  userName: string;
}

export const FooterBar = ({
  onSave,
  onRevert,
  isLoading,
  editableMatchesLength,
  newMatchesLength,
  matches,
  userName,
}: FooterBarProps) => {
  const classes = useFooterBarStyles();
  const { t } = useTranslation();
  const { hasChanges, isHelpMode, currentStep, setHelpMode } =
    useResultsContext();

  const {
    currentHelpStep,
    currentStep: helpStep,
    totalSteps,
    toggleHelpMode: toggleHelpModeLocal,
    nextHelpStep,
    prevHelpStep,
  } = useHelpMode(editableMatchesLength, newMatchesLength);

  const {
    isGenerating,
    reportImageUrl,
    showReportModal,
    generateReport,
    downloadReport,
    openInNewPage,
    closeReportModal,
  } = useReportGeneration();

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

  const handleGenerateReport = () => {
    generateReport(matches, userName);
  };

  return (
    <>
      <Group justify="space-between" className={classes.footer}>
        <Group gap="xs">
          <Tooltip
            label={
              currentStepId === "generateReportButton"
                ? currentStepLabel
                : t("generateReport")
            }
            opened={isHelpMode && currentStepId === "generateReportButton"}
            position="top"
            multiline
            withArrow
          >
            <ActionIcon
              size="lg"
              onClick={handleGenerateReport}
              color="blue"
              variant="outline"
              loading={isGenerating}
              disabled={matches.length === 0}
            >
              <IconChartBar size={20} strokeWidth={1.4} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={t("helpButton")}>
            <ActionIcon
              size="lg"
              onClick={toggleHelpMode}
              color={isHelpMode ? "blue" : "#ffa756"}
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
            label={
              currentStepId === "revertButton" ? currentStepLabel : undefined
            }
            opened={isHelpMode && currentStepId === "revertButton"}
            position="top"
            multiline
            withArrow
          >
            <div className={classes.revertButtonContainer}>
              {hasChanges && <div className={classes.changeIndicator} />}
              <Button
                color="red"
                variant="outline"
                onClick={onRevert}
                disabled={!hasChanges}
              >
                {t("revertButton")}
              </Button>
            </div>
          </Tooltip>
          <Tooltip
            label={
              currentStepId === "saveButton" ? currentStepLabel : undefined
            }
            opened={isHelpMode && currentStepId === "saveButton"}
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
                {t("saveButton")}
              </Button>
              {hasChanges && (
                <div className={classes.unsavedChangesText}>
                  {t("unsavedChangesFooter")}
                </div>
              )}
            </div>
          </Tooltip>
        </Group>
      </Group>

      <ReportModal
        opened={showReportModal}
        onClose={closeReportModal}
        imageUrl={reportImageUrl}
        onDownload={downloadReport}
        onOpenInNewPage={openInNewPage}
      />
    </>
  );
};
