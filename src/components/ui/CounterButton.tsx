import { ActionIcon } from '@mantine/core';
import { IconPlus, IconMinus } from '@tabler/icons-react';

interface CounterButtonProps {
  value: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
}

export const CounterButton = ({ value, onChange, disabled = false }: CounterButtonProps) => {
  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <ActionIcon
        variant="filled"
        size="sm"
        onClick={handleDecrement}
        disabled={disabled || value <= 0}
      >
        <IconMinus size={12} />
      </ActionIcon>
      
      <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
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
};