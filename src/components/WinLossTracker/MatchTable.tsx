import { Table, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { MatchRow } from './MatchRow';
import { useWinLossContext } from './WinLossContext';
import type { Match } from '../../types/Match';

interface NewMatch {
  id: string;
  opponent_name: string;
  wins: number;
  losses: number;
  isNew: true;
}

interface MatchTableProps {
  editableMatches: Match[];
  newMatches: NewMatch[];
  currentUser: { id: number };
  onChange: (matchId: number | string, field: string, value: string | number) => void;
  onDelete: (matchId: number) => void;
}

export const MatchTable = ({
  editableMatches,
  newMatches,
  currentUser,
  onChange,
  onDelete,
}: MatchTableProps) => {
  const { t } = useTranslation();
  const { isRemoveMode, isHelpMode, currentStep } = useWinLossContext();
  
  const currentStepId = currentStep?.id;
  const currentStepLabel = currentStep?.label;

  return (
    <Tooltip
      label={currentStepId === 'table' ? currentStepLabel : undefined}
      opened={isHelpMode && currentStepId === 'table'}
      position="top"
      multiline
      withArrow
    >
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: isRemoveMode ? '40%' : '50%' }}>
              {t('opponentName')}
            </Table.Th>
            <Table.Th style={{ width: '25%', textAlign: 'center' }}>
              {t('wins')}
            </Table.Th>
            <Table.Th style={{ width: '25%', textAlign: 'center' }}>
              {t('losses')}
            </Table.Th>
            {isRemoveMode && (
              <Table.Th
                style={{ width: '10%', textAlign: 'center' }}
              ></Table.Th>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {editableMatches.map((match, index) => (
            <MatchRow
              key={match.id}
              match={match}
              userId={currentUser.id}
              onChange={onChange}
              onDelete={onDelete}
              isEditMode={isRemoveMode}
              manualSave={true}
              isFirstRow={index === 0}
              isHelpMode={isHelpMode}
              currentHelpStep={currentStepId}
            />
          ))}

          {newMatches.map((match, index) => (
            <MatchRow
              key={match.id}
              match={match as unknown as Match}
              userId={currentUser.id}
              onChange={onChange}
              isGhostRow={true}
              isEditMode={isRemoveMode}
              manualSave={true}
              isFirstRow={editableMatches.length === 0 && index === 0}
              isHelpMode={isHelpMode}
              currentHelpStep={currentStepId}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Tooltip>
  );
};