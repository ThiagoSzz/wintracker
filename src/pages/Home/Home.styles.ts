import { createUseStyles } from 'react-jss';

export const useHomeStyles = createUseStyles({
  container: {
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
  tagline: {
    marginBottom: '1rem',
  },
  loadingContainer: {
    textAlign: 'center',
  },
  loadingLogo: {
    marginBottom: '1rem',
  },
});