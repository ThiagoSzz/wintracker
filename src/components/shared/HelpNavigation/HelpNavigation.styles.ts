import { createUseStyles } from 'react-jss';

export const useHelpNavigationStyles = createUseStyles({
  floatingBar: {
    position: 'fixed',
    bottom: '1%',
    left: '1%',
    right: '1%',
    width: '98%',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px 20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e0e0e0',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
  },
  centerSection: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  stepCounter: {
    padding: '0 12px',
    fontWeight: 600,
    color: '#495057',
    fontSize: '14px',
    minWidth: '50px',
    textAlign: 'center',
  },
});
