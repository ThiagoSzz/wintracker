import { useCallback } from 'react';
import { TextInput, Table, ActionIcon, Text, Tooltip } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { CounterButton } from '../../shared/CounterButton/CounterButton';
import type { Match } from '../../../types/Match';
import { useMatchRowStyles } from './MatchRow.styles';

interface MatchRowProps {
  match: Match;
  userId: number;
  onChange?: (matchId: number | string, field: string, value: string | number) => void;
  onDelete?: (matchId: number) => void;
  isEditMode?: boolean;
  isGhostRow?: boolean;
  manualSave?: boolean;
  isFirstRow?: boolean;
  isHelpMode?: boolean;
  currentHelpStep?: string;
}

export const MatchRow = ({ 
  match, 
  isGhostRow = false, 
  onChange, 
  onDelete, 
  isEditMode = false, 
  isFirstRow = false, 
  isHelpMode = false,
  currentHelpStep
}: MatchRowProps) => {
  const classes = useMatchRowStyles();
  const { t } = useTranslation();

  const matchId = match?.id;
  const opponentName = match?.opponent_name || '';
  const wins = match?.wins || 0;
  const losses = match?.losses || 0;

  // Event handlers for manual save mode
  const handleWinsChange = useCallback((newWins: number) => {
    if (matchId && onChange && !isEditMode) {
      onChange(matchId, 'wins', newWins);
    }
  }, [matchId, onChange, isEditMode]);

  const handleLossesChange = useCallback((newLosses: number) => {
    if (matchId && onChange && !isEditMode) {
      onChange(matchId, 'losses', newLosses);
    }
  }, [matchId, onChange, isEditMode]);

  const handleOpponentNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (matchId && onChange && !isEditMode) {
      onChange(matchId, 'opponent_name', e.target.value);
    }
  }, [matchId, onChange, isEditMode]);

  const handleDelete = useCallback(() => {
    if (typeof matchId === 'number' && onDelete) {
      onDelete(matchId);
    }
  }, [matchId, onDelete]);

  const isReadOnly = isEditMode && !isGhostRow;
  const counterDisabled = (isGhostRow && !opponentName.trim()) || isReadOnly;

  return (
    <Table.Tr>
      <Table.Td>
        {isReadOnly ? (
          <Text size="sm" className={classes.textCell}>
            {opponentName}
          </Text>
        ) : (
          <Tooltip 
            label={currentHelpStep === 'opponentField' ? t("helpTooltipOpponentField") : undefined} 
            opened={isHelpMode && isFirstRow && currentHelpStep === 'opponentField'}
            position="bottom"
            multiline
            withArrow
          >
            <TextInput
              value={opponentName}
              onChange={handleOpponentNameChange}
              placeholder={isGhostRow ? t('opponentName') : undefined}
              variant="default"
              size="sm"
              readOnly={isReadOnly}
            />
          </Tooltip>
        )}
      </Table.Td>
      <Table.Td className={classes.centerCell}>
        {isReadOnly ? (
          <Text size="sm" fw={500}>
            {wins}
          </Text>
        ) : (
          <CounterButton
            value={wins}
            onChange={handleWinsChange}
            disabled={counterDisabled}
            tooltipLabel={currentHelpStep === 'counterButtons' ? t("helpTooltipCounterButtons") : undefined}
            showTooltip={isHelpMode && isFirstRow && currentHelpStep === 'counterButtons'}
          />
        )}
      </Table.Td>
      <Table.Td className={classes.centerCell}>
        {isReadOnly ? (
          <Text size="sm" fw={500}>
            {losses}
          </Text>
        ) : (
          <CounterButton
            value={losses}
            onChange={handleLossesChange}
            disabled={counterDisabled}
          />
        )}
      </Table.Td>
      {isEditMode && (
        <Table.Td className={classes.centerCell}>
          {!isGhostRow && (
            <ActionIcon
              color="red"
              variant="subtle"
              onClick={handleDelete}
              size="sm"
            >
              <IconTrash size={16} />
            </ActionIcon>
          )}
        </Table.Td>
      )}
    </Table.Tr>
  );
};