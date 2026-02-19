import { createUseStyles } from 'react-jss';

export const useReportModalStyles = createUseStyles({
  modalBody: {
    padding: '1rem',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  reportImage: {
    maxHeight: '60vh',
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  buttonGroup: {
    marginTop: '1rem',
  },
  button: {
    minWidth: '140px',
  },
  errorAlert: {
    marginBottom: '1rem',
  },
});