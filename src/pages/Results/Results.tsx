import { useCallback } from "react";
import { Container, Title, LoadingOverlay, Alert } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Logo } from "../../components/shared/Logo/Logo";
import { LanguageSelector } from "../../components/shared/LanguageSelector/LanguageSelector";
import { ErrorAlert } from "../../components/shared/ErrorAlert/ErrorAlert";
import { HelpNavigation } from "../../components/shared/HelpNavigation/HelpNavigation";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useMatchesState } from "../../hooks/useMatchesState";
import { useRemoveMode } from "../../hooks/useRemoveMode";
import { useDuplicateValidation } from "../../hooks/useDuplicateValidation";
import { useMatchOperations } from "../../hooks/useMatchOperations";
import { useGetUserMatches } from "../../hooks/useMatches";
import { useHelpMode } from "../../hooks/useHelpMode";
import { useReportGeneration } from "../../hooks/useReportGeneration";
import { useUserStore } from "../../store/userStore";
import { ResultsProvider } from "./ResultsContext";
import { Toolbar } from "../../components/Results/Toolbar/Toolbar";
import { MatchTable } from "../../components/Results/MatchTable/MatchTable";
import { FooterBar } from "../../components/Results/FooterBar/FooterBar";
import { useResultsStyles } from "./Results.styles";

export const Results = () => {
  const classes = useResultsStyles();
  const { t } = useTranslation();
  const { currentUser, clearUser } = useUserStore();

  usePageTitle(t("winLossTrackerPageTitle"));

  const {
    data: originalMatches = [],
    isLoading,
    error,
  } = useGetUserMatches(currentUser?.id || null);

  const {
    editableMatches,
    newMatches,
    hasChanges,
    deletedMatchIds,
    handleMatchChange,
    addNewMatch,
    deleteMatch,
    resetState,
    resetAfterSave,
    clearNewMatches,
    removeEmptyRows,
  } = useMatchesState(originalMatches);

  const { isRemoveMode, toggleRemoveMode, exitRemoveMode } = useRemoveMode();

  const handleToggleRemoveMode = useCallback(() => {
    removeEmptyRows();
    toggleRemoveMode();
  }, [removeEmptyRows, toggleRemoveMode]);

  const handleCancelAddMode = useCallback(() => {
    removeEmptyRows();
  }, [removeEmptyRows]);

  const { duplicateError, checkDuplicate, clearDuplicateError } =
    useDuplicateValidation(originalMatches);

  const { saveChanges, isLoading: isSaving } = useMatchOperations();

  const {
    isHelpMode,
    currentHelpStep,
    currentStep: helpStep,
    totalSteps,
    nextHelpStep,
    prevHelpStep,
    toggleHelpMode,
  } = useHelpMode(editableMatches.length, newMatches.length);

  const {
    isGenerating: isGeneratingReport,
    reportImageUrl,
    showReportModal,
    reportError,
    generateReport,
    downloadReport,
    openInNewPage,
    closeReportModal,
    clearReportError,
  } = useReportGeneration();

  const handleSave = useCallback(async () => {
    if (!currentUser) return;

    try {
      const success = await saveChanges(
        currentUser,
        newMatches,
        editableMatches,
        originalMatches,
        deletedMatchIds,
        checkDuplicate,
        () => {
          clearNewMatches();
        },
      );

      if (success) {
        resetAfterSave();
        clearDuplicateError();
        exitRemoveMode();
        removeEmptyRows();
      }
    } catch {
      // Silent error handling
    }
  }, [
    currentUser,
    newMatches,
    editableMatches,
    originalMatches,
    deletedMatchIds,
    saveChanges,
    checkDuplicate,
    clearNewMatches,
    resetAfterSave,
    clearDuplicateError,
    exitRemoveMode,
    removeEmptyRows,
  ]);

  const handleLogoClick = useCallback(() => {
    clearUser();
  }, [clearUser]);

  const handleCloseHelpMode = useCallback(() => {
    toggleHelpMode();
  }, [toggleHelpMode]);

  if (!currentUser) {
    return null;
  }

  if (error) {
    return (
      <Container size="md" className={classes.container}>
        <Alert color="red">{t("databaseError")}</Alert>
      </Container>
    );
  }

  return (
    <ResultsProvider 
      hasChanges={hasChanges}
      isRemoveMode={isRemoveMode}
      toggleRemoveMode={handleToggleRemoveMode}
      exitRemoveMode={exitRemoveMode}
      isHelpMode={isHelpMode}
      currentStep={helpStep}
    >
      <Container size="md" className={classes.mainContainer}>
        <LoadingOverlay visible={isLoading} />

        <div className={classes.languageSelector}>
          <LanguageSelector />
        </div>

        <div className={classes.header}>
          <Logo
            order={2}
            onClick={handleLogoClick}
            interactive={true}
            className={classes.logo}
          />
          <Title
            order={3}
            size="h4"
            className={classes.userName}
          >
            {currentUser.name}
          </Title>
        </div>

        {duplicateError && (
          <ErrorAlert
            message={`${t("duplicateOpponentError")}: "${duplicateError}"`}
            title={t("duplicateOpponentError")}
            onClose={clearDuplicateError}
            style={{ marginBottom: "1rem" }}
          />
        )}

        {reportError && (
          <ErrorAlert
            message={reportError}
            title={t("reportError")}
            onClose={clearReportError}
            style={{ marginBottom: "1rem" }}
          />
        )}

        <Toolbar
          onAddNewMatch={addNewMatch}
          newMatchesLength={newMatches.length}
          onCancelAddMode={handleCancelAddMode}
        />

        <MatchTable
          editableMatches={editableMatches}
          newMatches={newMatches}
          currentUser={currentUser}
          onChange={handleMatchChange}
          onDelete={deleteMatch}
        />

        <FooterBar
          onSave={handleSave}
          onRevert={resetState}
          isLoading={isSaving}
          editableMatchesLength={editableMatches.length}
          newMatchesLength={newMatches.length}
          matches={originalMatches}
          userName={currentUser.name}
          isHelpMode={isHelpMode}
          toggleHelpMode={toggleHelpMode}
          isGeneratingReport={isGeneratingReport}
          onGenerateReport={generateReport}
          reportImageUrl={reportImageUrl}
          showReportModal={showReportModal}
          onDownloadReport={downloadReport}
          onOpenInNewPage={openInNewPage}
          onCloseReportModal={closeReportModal}
        />

        {isHelpMode && (
          <HelpNavigation
            currentStep={currentHelpStep}
            totalSteps={totalSteps}
            onPrevious={prevHelpStep}
            onNext={nextHelpStep}
            onClose={handleCloseHelpMode}
            isFirstStep={currentHelpStep === 0}
            isLastStep={currentHelpStep === totalSteps - 1}
          />
        )}
      </Container>
    </ResultsProvider>
  );
};
