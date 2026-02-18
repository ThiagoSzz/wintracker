import { Table, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { MatchRow } from '../MatchRow/MatchRow';
import { useResultsContext } from '../../../pages/Results/ResultsContext';
import type { Match } from '../../../types/Match';
import { useMatchTableStyles } from './MatchTable.styles';

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
  const { isRemoveMode, isHelpMode, currentStep } = useResultsContext();
  const classes = useMatchTableStyles();
  
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
            <Table.Th className={isRemoveMode ? classes.opponentColumnRemove : classes.opponentColumnNormal}>
              {t('opponentName')}
            </Table.Th>
            <Table.Th className={classes.counterColumn}>
              {t('wins')}
            </Table.Th>
            <Table.Th className={classes.counterColumn}>
              {t('losses')}
            </Table.Th>
            {isRemoveMode && (
              <Table.Th className={classes.removeColumn}></Table.Th>
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