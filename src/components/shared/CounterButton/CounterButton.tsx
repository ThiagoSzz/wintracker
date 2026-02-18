import { ActionIcon, Tooltip } from "@mantine/core";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import { useCounterButtonStyles } from './CounterButton.styles';

interface CounterButtonProps {
  value: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
  tooltipLabel?: string;
  showTooltip?: boolean;
}

export const CounterButton = ({
  value,
  onChange,
  disabled = false,
  tooltipLabel,
  showTooltip = false,
}: CounterButtonProps) => {
  const classes = useCounterButtonStyles();

  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  const counterContent = (
    <div className={classes.container}>
      <ActionIcon
        variant="filled"
        size="sm"
        onClick={handleDecrement}
        disabled={disabled || value <= 0}
      >
        <IconMinus size={12} />
      </ActionIcon>

      <span className={classes.valueDisplay}>
        {value}
      </span>

      <ActionIcon
        variant="filled"
        size="sm"
        onClick={handleIncrement}
        disabled={disabled}
      >
        <IconPlus size={12} />
      </ActionIcon>
    </div>
  );

  if (showTooltip && tooltipLabel) {
    return (
      <Tooltip 
        label={tooltipLabel}
        opened={showTooltip}
        position="bottom"
        multiline
        withArrow
      >
        {counterContent}
      </Tooltip>
    );
  }

  return counterContent;
};