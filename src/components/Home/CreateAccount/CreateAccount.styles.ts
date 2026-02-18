import { createUseStyles } from 'react-jss';

export const useCreateAccountStyles = createUseStyles({
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
    whiteSpace: 'normal !important',
    wordBreak: 'break-word',
    minHeight: '44px',
    height: 'auto',
    padding: '8px 16px',
    textOverflow: 'visible !important',
    overflow: 'visible !important',
    lineHeight: '1.4',
  },
});