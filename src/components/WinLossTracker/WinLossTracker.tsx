import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Container,
  Title,
  Table,
  LoadingOverlay,
  Alert,
  Group,
  Button,
} from "@mantine/core";
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

interface NewMatch {
  id: string; // Temporary ID for new matches
  opponent_name: string;
  wins: number;
  losses: number;
  isNew: true;
}

export const WinLossTracker = () => {
  const { t } = useTranslation();
  const { currentUser } = useUserStore();
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  // Set page title
  useEffect(() => {
    document.title = "wintracker | Your results";
  }, []);

  // State management for editable data
  const [editableMatches, setEditableMatches] = useState<EditableMatch[]>([]);
  const [newMatches, setNewMatches] = useState<NewMatch[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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

    const hasNewMatchChanges = newMatches.length > 0;
    const hasLengthChanges = editableMatches.length !== originalMatches.length;
    const hasDeletedMatches = deletedMatchIds.size > 0;

    setHasChanges(
      hasEditChanges ||
        hasNewMatchChanges ||
        hasLengthChanges ||
        hasDeletedMatches,
    );
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

  // Edit mode handlers
  const handleToggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
    // Keep pending deletions when exiting edit mode so save button remains enabled
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
      setIsEditMode(false);
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

      {/* Toolbar with Edit/Save/Revert buttons */}
      <Group justify="space-between" style={{ marginBottom: "1rem" }}>
        <Button variant="outline" onClick={handleToggleEditMode}>
          {isEditMode ? t("stopEditingButton") : t("editButton")}
        </Button>

        <Group>
          <Button
            color="red"
            variant="outline"
            onClick={handleRevert}
            disabled={!hasChanges}
          >
            {t("revertButton")}
          </Button>
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
        </Group>
      </Group>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: isEditMode ? "40%" : "50%" }}>
              {t("opponentName")}
            </Table.Th>
            <Table.Th style={{ width: "25%", textAlign: "center" }}>
              {t("wins")}
            </Table.Th>
            <Table.Th style={{ width: "25%", textAlign: "center" }}>
              {t("losses")}
            </Table.Th>
            {isEditMode && (
              <Table.Th
                style={{ width: "10%", textAlign: "center" }}
              ></Table.Th>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {/* Render existing matches */}
          {editableMatches.map((match) => (
            <MatchRow
              key={match.id}
              match={match}
              userId={currentUser.id}
              onChange={handleMatchChange}
              onDelete={handleDeleteMatch}
              isEditMode={isEditMode}
              manualSave={true}
            />
          ))}

          {/* Render new matches */}
          {newMatches.map((match) => (
            <MatchRow
              key={match.id}
              match={match}
              userId={currentUser.id}
              onChange={handleMatchChange}
              isGhostRow={true}
              isEditMode={isEditMode}
              manualSave={true}
            />
          ))}
        </Table.Tbody>
      </Table>

      {/* Add new opponent button - outside the table */}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <Button color="blue" onClick={handleAddNewMatch} size="md">
          + {t("addNewOpponent")}
        </Button>
      </div>
    </Container>
  );
};
