import { createUseStyles } from 'react-jss';

export const useMatchTableStyles = createUseStyles({
  tableContainer: {
    maxHeight: '55vh',
    overflowY: 'auto',
    position: 'relative',
  },
  table: {
    '& thead': {
      position: 'sticky',
      top: 0,
      zIndex: 1,
      backgroundColor: 'white',
    },
  },
  tableHeader: {
    textAlign: 'center',
  },
  opponentColumnRemove: {
    width: '40%',
  },
  opponentColumnNormal: {
    width: '50%',
  },
  counterColumn: {
    width: '25%',
    textAlign: 'center',
  },
  removeColumn: {
    width: '10%',
    textAlign: 'center',
  },
});
