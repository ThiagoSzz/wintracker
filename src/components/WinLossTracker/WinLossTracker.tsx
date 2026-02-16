import { useCallback } from "react";
import { Container, Title, LoadingOverlay, Alert } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Logo } from "../ui/Logo";
import { ErrorAlert } from "../ui/ErrorAlert";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useMatchesState } from "../../hooks/useMatchesState";
import { useHelpMode } from "../../hooks/useHelpMode";
import { useRemoveMode } from "../../hooks/useRemoveMode";
import { useDuplicateValidation } from "../../hooks/useDuplicateValidation";
import { useMatchOperations } from "../../hooks/useMatchOperations";
import { useGetUserMatches } from "../../hooks/useMatches";
import { useUserStore } from "../../store/userStore";
import { Toolbar } from "./Toolbar";
import { MatchTable } from "./MatchTable";
import { FooterBar } from "./FooterBar";

export const WinLossTracker = () => {
  const { t } = useTranslation();
  const { currentUser, clearUser } = useUserStore();
  
  usePageTitle("wintracker | Your results");

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
  } = useMatchesState(originalMatches);

  const {
    isHelpMode,
    currentStep,
    totalSteps,
    toggleHelpMode,
    nextHelpStep,
    prevHelpStep,
  } = useHelpMode(editableMatches.length, newMatches.length);

  const { isRemoveMode, toggleRemoveMode, exitRemoveMode } = useRemoveMode();

  const { duplicateError, checkDuplicate, clearDuplicateError } = useDuplicateValidation(originalMatches);

  const { saveChanges, isLoading: isSaving } = useMatchOperations();

  const handleToggleRemoveMode = useCallback(() => {
    if (newMatches.length > 0) {
      clearNewMatches();
      return;
    }
    toggleRemoveMode();
  }, [newMatches.length, clearNewMatches, toggleRemoveMode]);

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
        }
      );

      if (success) {
        resetAfterSave();
        clearDuplicateError();
        exitRemoveMode();
      }
    } catch (error) {
      console.error("Error saving changes:", error);
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
  ]);

  const handleLogoClick = useCallback(() => {
    clearUser();
  }, [clearUser]);

  if (!currentUser) {
    return null;
  }

  if (error) {
    return (
      <Container size="md" style={{ paddingTop: "2rem" }}>
        <Alert color="red">{t("databaseError")}</Alert>
      </Container>
    );
  }

  return (
    <Container
      size="md"
      style={{
        paddingTop: "2rem",
        paddingBottom: "2rem",
        position: "relative",
      }}
    >
      <LoadingOverlay visible={isLoading} />

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Logo
          order={2}
          onClick={handleLogoClick}
          interactive={true}
          style={{ marginBottom: "0.5rem" }}
        />
        <Title
          order={3}
          size="h4"
          style={{ fontWeight: "normal", color: "#666" }}
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

      <Toolbar
        isHelpMode={isHelpMode}
        onToggleHelp={toggleHelpMode}
        currentHelpStep={0}
        totalHelpSteps={totalSteps}
        onPrevHelpStep={prevHelpStep}
        onNextHelpStep={nextHelpStep}
        hasChanges={hasChanges}
        onSave={handleSave}
        onRevert={resetState}
        isLoading={isSaving}
        currentStepId={currentStep?.id}
        currentStepLabel={currentStep?.label}
      />

      <MatchTable
        editableMatches={editableMatches}
        newMatches={newMatches}
        currentUser={currentUser}
        onChange={handleMatchChange}
        onDelete={deleteMatch}
        isRemoveMode={isRemoveMode}
        isHelpMode={isHelpMode}
        currentStepId={currentStep?.id}
        currentStepLabel={currentStep?.label}
      />

      <FooterBar
        onToggleRemoveMode={handleToggleRemoveMode}
        onAddNewMatch={addNewMatch}
        isRemoveMode={isRemoveMode}
        newMatchesLength={newMatches.length}
        hasChanges={hasChanges}
        isHelpMode={isHelpMode}
        currentStepId={currentStep?.id}
        currentStepLabel={currentStep?.label}
      />
    </Container>
  );
};