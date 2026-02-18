import { createUseStyles } from 'react-jss';

export const useAppStyles = createUseStyles({
  container: {
    paddingTop: '2rem',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
});