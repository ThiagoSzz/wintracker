import { Title } from "@mantine/core";

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
  const baseStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    ...style,
  };

  const interactiveStyle: React.CSSProperties = interactive
    ? {
        cursor: "pointer",
        userSelect: "none",
        transition: "color 0.2s ease",
      }
    : {};

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
      style={{ ...baseStyle, ...interactiveStyle }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      <span style={{ 
        fontSize: "1em", 
        backgroundColor: "#1c7ed6", 
        color: "white",
        padding: "0px 6px",
        borderRadius: "4px",
        marginRight: "2px"
      }}>win</span>tracker
    </Title>
  );
};
