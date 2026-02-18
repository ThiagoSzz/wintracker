import { createUseStyles } from 'react-jss';

export const useLanguageSelectorStyles = createUseStyles({
  button: {
    padding: '4px 8px',
    height: 'auto',
    minHeight: '32px',
    backgroundColor: 'transparent',
  },
  flag: {
    fontSize: '18px',
  },
  menuItemSelected: {
    backgroundColor: '#f1f3f4',
  },
  menuItemDefault: {
    backgroundColor: 'transparent',
  },
  menuGroup: {
    fontSize: '14px',
  },
  menuFlag: {
    fontSize: '16px',
  },
});