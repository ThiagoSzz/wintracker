import { createUseStyles } from 'react-jss';

export const useLogoStyles = createUseStyles({
  logoBase: {
    position: 'relative',
    display: 'inline-block',
  },
  interactive: {
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'color 0.2s ease',
  },
  winSpan: {
    fontSize: '1em',
    backgroundColor: '#1c7ed6',
    color: 'white',
    padding: '0px 6px',
    borderRadius: '4px',
    marginRight: '2px',
  },
});