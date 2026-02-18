import { createUseStyles } from 'react-jss';

export const useResultsStyles = createUseStyles({
  container: {
    paddingTop: '2rem',
  },
  mainContainer: {
    paddingTop: '2rem',
    paddingBottom: '2rem',
    position: 'relative',
  },
  languageSelector: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logo: {
    marginBottom: '0.5rem',
  },
  userName: {
    fontWeight: 'normal',
    color: '#666',
  },
  errorAlert: {
    marginBottom: '1rem',
  },
});