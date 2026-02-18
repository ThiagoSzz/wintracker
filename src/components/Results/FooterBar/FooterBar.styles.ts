import { createUseStyles } from 'react-jss';

export const useFooterBarStyles = createUseStyles({
  footer: {
    marginTop: '1rem',
  },
  stepCounter: {
    minWidth: '40px',
    textAlign: 'center',
  },
  changeIndicator: {
    width: '10px',
    height: '10px',
    backgroundColor: '#ffd43b',
    borderRadius: '50%',
    marginRight: '25px',
  },
  revertButtonContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  saveButtonContainer: {
    position: 'relative',
  },
  unsavedChangesText: {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '12px',
    color: '#868e96',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
});