import { createUseStyles } from 'react-jss';

export const useMatchTableStyles = createUseStyles({
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
