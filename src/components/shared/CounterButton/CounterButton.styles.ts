import { createUseStyles } from 'react-jss';

export const useCounterButtonStyles = createUseStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  valueDisplay: {
    minWidth: '24px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
  },
});