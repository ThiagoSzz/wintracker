import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Container,
  Title,
  Table,
  LoadingOverlay,
  Alert,
  Group,
  Button,
  Tooltip,
  ActionIcon,
  Text,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconHelpHexagon,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Logo } from "../ui";
import {
  useGetUserMatches,
  useCreateMatch,
  useUpdateMatch,
  useUpdateMatchOpponentName,
  useDeleteMultipleMatches,
} from "../../hooks/useMatches";
import { useUserStore } from "../../store/userStore";
import { MatchRow } from "./MatchRow";
import type { Match } from "../../types";

// Extended match type to include editing state
interface EditableMatch extends Match {
  isEditing?: boolean;
  isNew?: boolean;
}

interface NewMatch extends Omit<
  Match,
  "id" | "user_id" | "created_at" | "updated_at"
> {
  id: string; // Temporary ID for new matches
  user_id?: number; // Optional for type compatibility
  created_at?: string; // Optional for type compatibility
  updated_at?: string; // Optional for type compatibility
  isNew: true;
}

export const WinLossTracker = () => {
  const { t } = useTranslation();
  const { currentUser } = useUserStore();
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [showUnsavedBanner, setShowUnsavedBanner] = useState(false);
  const [isHelpMode, setIsHelpMode] = useState(false);
  const [currentHelpStep, setCurrentHelpStep] = useState(0);

  // Set page title
  useEffect(() => {
    document.title = "wintracker | Your results";
  }, []);

  // State management for editable data
  const [editableMatches, setEditableMatches] = useState<EditableMatch[]>([]);
  const [newMatches, setNewMatches] = useState<NewMatch[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [deletedMatchIds, setDeletedMatchIds] = useState<Set<number>>(
    new Set(),
  );

  const {
    data: originalMatches = [],
    isLoading,
    error,
  } = useGetUserMatches(currentUser?.id || null);

  const createMatchMutation = useCreateMatch();
  const updateMatchMutation = useUpdateMatch();
  const updateOpponentNameMutation = useUpdateMatchOpponentName();

  // Initialize editable matches when original data loads
  useEffect(() => {
    if (originalMatches.length > 0) {
      setEditableMatches([...originalMatches]);
    }
  }, [originalMatches]);

  // Memoize existing opponent names for duplicate checking (only from saved matches)
  const existingOpponentNames = useMemo(
    () =>
      new Set(
        originalMatches.map((match) =>
          match.opponent_name.toLowerCase().trim(),
        ),
      ),
    [originalMatches],
  );

  // Check if there are any changes
  useEffect(() => {
    const hasEditChanges = editableMatches.some((match, index) => {
      const original = originalMatches[index];
      if (!original) return true; // New match
      return (
        match.opponent_name !== original.opponent_name ||
        match.wins !== original.wins ||
        match.losses !== original.losses
      );
    });

    // Only consider new matches as changes if they have actual data entered
    const hasNewMatchChanges = newMatches.some(
      (match) =>
        match.opponent_name.trim().length > 0 ||
        match.wins > 0 ||
        match.losses > 0,
    );
    const hasLengthChanges = editableMatches.length !== originalMatches.length;
    const hasDeletedMatches = deletedMatchIds.size > 0;

    const changes =
      hasEditChanges ||
      hasNewMatchChanges ||
      hasLengthChanges ||
      hasDeletedMatches;

    setHasChanges(changes);
    setShowUnsavedBanner(changes);
  }, [editableMatches, newMatches, originalMatches, deletedMatchIds]);

  // Handle changes from MatchRow components
  const handleMatchChange = useCallback(
    (matchId: number | string, field: string, value: string | number) => {
      if (typeof matchId === "string") {
        // Handle new match changes
        setNewMatches((prev) =>
          prev.map((match) =>
            match.id === matchId ? { ...match, [field]: value } : match,
          ),
        );
      } else {
        // Handle existing match changes
        setEditableMatches((prev) =>
          prev.map((match) =>
            match.id === matchId ? { ...match, [field]: value } : match,
          ),
        );
      }
    },
    [],
  );

  // Handle adding new match row
  const handleAddNewMatch = useCallback(() => {
    const newMatch: NewMatch = {
      id: `new-${Date.now()}`,
      opponent_name: "",
      wins: 0,
      losses: 0,
      isNew: true,
    };
    setNewMatches((prev) => [...prev, newMatch]);
  }, []);

  const closeDuplicateError = useCallback(() => {
    setDuplicateError(null);
  }, []);

  const closeUnsavedBanner = useCallback(() => {
    setShowUnsavedBanner(false);
  }, []);

  const toggleHelpMode = useCallback(() => {
    setIsHelpMode((prev) => {
      if (!prev) {
        setCurrentHelpStep(0); // Start from first step when enabling
      }
      return !prev;
    });
  }, []);

  const nextHelpStep = useCallback(() => {
    setCurrentHelpStep((prev) => {
      const hasFirstRow = editableMatches.length > 0 || newMatches.length > 0;
      const totalSteps = hasFirstRow ? 7 : 5; // 7 with first row, 5 without
      return prev < totalSteps - 1 ? prev + 1 : prev;
    });
  }, [editableMatches.length, newMatches.length]);

  const prevHelpStep = useCallback(() => {
    setCurrentHelpStep((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Define help steps based on usage order
  const getHelpSteps = useMemo(() => {
    const hasFirstRow = editableMatches.length > 0 || newMatches.length > 0;
    const steps = [
      { id: "table", label: t("helpTooltipTable") },
      { id: "addButton", label: t("helpTooltipAddButton") },
    ];

    if (hasFirstRow) {
      steps.push(
        { id: "opponentField", label: t("helpTooltipOpponentField") },
        { id: "counterButtons", label: t("helpTooltipCounterButtons") },
      );
    }

    steps.push(
      { id: "saveButton", label: t("helpTooltipSave") },
      { id: "revertButton", label: t("helpTooltipRevert") },
      { id: "removeButton", label: t("helpTooltipRemoveButton") },
    );

    return steps;
  }, [editableMatches.length, newMatches.length, t]);

  const currentStep = getHelpSteps[currentHelpStep];
  const totalSteps = getHelpSteps.length;

  // Remove mode handlers
  const handleToggleRemoveMode = useCallback(() => {
    setIsRemoveMode((prev) => !prev);
    // Keep pending deletions when exiting remove mode so save button remains enabled
  }, []);

  // Handle marking match for deletion
  const handleDeleteMatch = useCallback((matchId: number) => {
    setDeletedMatchIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(matchId);
      return newSet;
    });
    // Remove from editable matches immediately for UI
    setEditableMatches((prev) => prev.filter((match) => match.id !== matchId));
  }, []);

  const deleteMultipleMatchesMutation = useDeleteMultipleMatches();

  // Save all changes
  const handleSave = useCallback(async () => {
    if (!currentUser) return;

    try {
      // Delete marked matches in a single batch operation
      if (deletedMatchIds.size > 0) {
        await deleteMultipleMatchesMutation.mutateAsync({
          matchIds: Array.from(deletedMatchIds),
          userId: currentUser.id,
        });
      }

      // Save new matches
      for (const newMatch of newMatches) {
        if (newMatch.opponent_name.trim()) {
          // Check for duplicates
          const normalizedName = newMatch.opponent_name.toLowerCase().trim();
          if (existingOpponentNames.has(normalizedName)) {
            setDuplicateError(newMatch.opponent_name.trim());
            // Remove the duplicate new match from the UI
            setNewMatches((prev) =>
              prev.filter((match) => match.id !== newMatch.id),
            );
            return;
          }

          await createMatchMutation.mutateAsync({
            user_id: currentUser.id,
            opponent_name: newMatch.opponent_name.trim(),
            wins: newMatch.wins,
            losses: newMatch.losses,
          });
        }
      }

      // Save updated existing matches
      for (const match of editableMatches) {
        const original = originalMatches.find((m) => m.id === match.id);
        if (original) {
          // Update opponent name if changed
          if (match.opponent_name !== original.opponent_name) {
            await updateOpponentNameMutation.mutateAsync({
              matchId: match.id,
              opponentName: match.opponent_name.trim(),
            });
          }

          // Update wins/losses if changed
          if (
            match.wins !== original.wins ||
            match.losses !== original.losses
          ) {
            await updateMatchMutation.mutateAsync({
              matchId: match.id,
              updateData: { wins: match.wins, losses: match.losses },
            });
          }
        }
      }

      // Clear all temporary state
      setNewMatches([]);
      setDeletedMatchIds(new Set());
      setHasChanges(false);
      setDuplicateError(null);
      setIsRemoveMode(false);
      setShowUnsavedBanner(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  }, [
    currentUser,
    newMatches,
    editableMatches,
    originalMatches,
    existingOpponentNames,
    deletedMatchIds,
    createMatchMutation,
    updateMatchMutation,
    updateOpponentNameMutation,
    deleteMultipleMatchesMutation,
  ]);

  // Revert all changes
  const handleRevert = useCallback(() => {
    setEditableMatches([...originalMatches]);
    setNewMatches([]);
    setDeletedMatchIds(new Set());
    setHasChanges(false);
    setDuplicateError(null);
    setShowUnsavedBanner(false);
  }, [originalMatches]);

  const { clearUser } = useUserStore();

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
        <Alert
          color="red"
          style={{ marginBottom: "1rem" }}
          withCloseButton
          onClose={closeDuplicateError}
          title={t("duplicateOpponentError")}
        >
          {t("duplicateOpponentError")}: "{duplicateError}"
        </Alert>
      )}

      {showUnsavedBanner && (
        <Alert
          color="blue"
          style={{ marginBottom: "1rem" }}
          withCloseButton
          onClose={closeUnsavedBanner}
          title={t("unsavedChanges")}
        >
          {t("unsavedChangesMessage")}
        </Alert>
      )}

      {/* Toolbar with Help and Save/Revert buttons */}
      <Group justify="space-between" style={{ marginBottom: "1rem" }}>
        <Group gap="xs">
          <Tooltip label={t("helpButton")}>
            <ActionIcon
              size="lg"
              onClick={toggleHelpMode}
              color={isHelpMode ? "blue" : "gray"}
            >
              <IconHelpHexagon size={20} strokeWidth={1.4} />
            </ActionIcon>
          </Tooltip>

          {isHelpMode && (
            <Group gap={4}>
              <ActionIcon
                variant="outline"
                onClick={prevHelpStep}
                disabled={currentHelpStep === 0}
                size="md"
              >
                <IconChevronLeft size={16} />
              </ActionIcon>

              <Text size="sm" style={{ minWidth: "40px", textAlign: "center" }}>
                {currentHelpStep + 1}/{totalSteps}
              </Text>

              <ActionIcon
                variant="outline"
                onClick={nextHelpStep}
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
              currentStep?.id === "revertButton" ? currentStep.label : undefined
            }
            opened={isHelpMode && currentStep?.id === "revertButton"}
            position="bottom"
            multiline
            withArrow
          >
            <Button
              color="red"
              variant="outline"
              onClick={handleRevert}
              disabled={!hasChanges}
            >
              {t("revertButton")}
            </Button>
          </Tooltip>
          <Tooltip
            label={
              currentStep?.id === "saveButton" ? currentStep.label : undefined
            }
            opened={isHelpMode && currentStep?.id === "saveButton"}
            position="top"
            multiline
            withArrow
          >
            <Button
              color="green"
              onClick={handleSave}
              disabled={!hasChanges}
              loading={
                createMatchMutation.isPending ||
                updateMatchMutation.isPending ||
                updateOpponentNameMutation.isPending
              }
            >
              {t("saveButton")}
            </Button>
          </Tooltip>
        </Group>
      </Group>

      <Tooltip
        label={currentStep?.id === "table" ? currentStep.label : undefined}
        opened={isHelpMode && currentStep?.id === "table"}
        position="bottom"
        multiline
        withArrow
      >
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: isRemoveMode ? "40%" : "50%" }}>
                {t("opponentName")}
              </Table.Th>
              <Table.Th style={{ width: "25%", textAlign: "center" }}>
                {t("wins")}
              </Table.Th>
              <Table.Th style={{ width: "25%", textAlign: "center" }}>
                {t("losses")}
              </Table.Th>
              {isRemoveMode && (
                <Table.Th
                  style={{ width: "10%", textAlign: "center" }}
                ></Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {/* Render existing matches */}
            {editableMatches.map((match, index) => (
              <MatchRow
                key={match.id}
                match={match}
                userId={currentUser.id}
                onChange={handleMatchChange}
                onDelete={handleDeleteMatch}
                isEditMode={isRemoveMode}
                manualSave={true}
                isFirstRow={index === 0}
                isHelpMode={isHelpMode}
                currentHelpStep={currentStep?.id}
              />
            ))}

            {/* Render new matches */}
            {newMatches.map((match, index) => (
              <MatchRow
                key={match.id}
                match={match as unknown as Match}
                userId={currentUser.id}
                onChange={handleMatchChange}
                isGhostRow={true}
                isEditMode={isRemoveMode}
                manualSave={true}
                isFirstRow={editableMatches.length === 0 && index === 0}
                isHelpMode={isHelpMode}
                currentHelpStep={currentStep?.id}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Tooltip>

      {/* Action buttons below the table */}
      <Group
        justify="space-between"
        align="center"
        style={{ marginTop: "1rem", width: "100%" }}
      >
        <Tooltip
          label={
            currentStep?.id === "removeButton" ? currentStep.label : undefined
          }
          opened={isHelpMode && currentStep?.id === "removeButton"}
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
              {isRemoveMode
                ? t("stopRemovingButton")
                : t("removeOpponentsButton")}
            </span>
            <span className="mobile-text">
              {isRemoveMode
                ? t("stopRemovingButtonShort")
                : t("removeOpponentsButtonShort")}
            </span>
          </Button>
        </Tooltip>

        <Tooltip
          label={
            currentStep?.id === "addButton" ? currentStep.label : undefined
          }
          opened={isHelpMode && currentStep?.id === "addButton"}
          position="top"
          multiline
          withArrow
        >
          <Button
            color="blue"
            onClick={handleAddNewMatch}
            size="sm"
            style={{ minWidth: "fit-content" }}
          >
            <span className="desktop-text">+ {t("addNewOpponent")}</span>
            <span className="mobile-text">{t("addNewOpponentShort")}</span>
          </Button>
        </Tooltip>
      </Group>
    </Container>
  );
};
