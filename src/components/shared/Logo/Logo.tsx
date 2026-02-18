import { Title } from "@mantine/core";
import { useLogoStyles } from './Logo.styles';

interface LogoProps {
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: string;
  onClick?: () => void;
  showEmoji?: boolean;
  style?: React.CSSProperties;
  className?: string;
  interactive?: boolean;
}

export const Logo = ({
  order = 1,
  size = "h1",
  onClick,
  style = {},
  className,
  interactive = false,
}: LogoProps) => {
  const classes = useLogoStyles();
  
  const combinedClassName = `${classes.logoBase} ${interactive ? classes.interactive : ''} ${className || ''}`.trim();

  const handleMouseEnter = interactive
    ? (e: React.MouseEvent<HTMLHeadingElement>) => {
        e.currentTarget.style.color = "#007bff";
      }
    : undefined;

  const handleMouseLeave = interactive
    ? (e: React.MouseEvent<HTMLHeadingElement>) => {
        e.currentTarget.style.color = "";
      }
    : undefined;

  return (
    <Title
      order={order}
      size={size}
      style={style}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={combinedClassName}
    >
      <span className={classes.winSpan}>win</span>tracker
    </Title>
  );
};
