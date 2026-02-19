import { Group, Button, Tooltip, ActionIcon } from "@mantine/core";
import { IconHelpHexagon, IconChartBar } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
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
  isHelpMode: boolean;
  toggleHelpMode: () => void;
}

export const FooterBar = ({
  onSave,
  onRevert,
  isLoading,
  matches,
  userName,
  isHelpMode,
  toggleHelpMode,
}: FooterBarProps) => {
  const classes = useFooterBarStyles();
  const { t } = useTranslation();
  const { hasChanges, currentStep } = useResultsContext();

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

  const handleToggleHelpMode = () => {
    if (!isHelpMode) {
      toggleHelpMode();
    }
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
              onClick={handleToggleHelpMode}
              color="#ffa756"
            >
              <IconHelpHexagon size={20} strokeWidth={1.4} />
            </ActionIcon>
          </Tooltip>
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
