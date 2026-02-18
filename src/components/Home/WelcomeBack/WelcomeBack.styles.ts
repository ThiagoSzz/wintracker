import { createUseStyles } from 'react-jss';

export const useWelcomeBackStyles = createUseStyles({
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logo: {
    marginBottom: '1rem',
  },
  titleContainer: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    marginBottom: '0.5rem',
  },
  errorAlert: {
    marginBottom: '1rem',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
  },
  backButton: {
    whiteSpace: 'normal',
    minHeight: '44px',
    height: 'auto',
    padding: '8px 16px',
    display: 'block',
    width: '100%',
  },
});