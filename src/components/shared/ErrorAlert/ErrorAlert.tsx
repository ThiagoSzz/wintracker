import { Alert } from '@mantine/core';

interface ErrorAlertProps {
  message: string;
  title?: string;
  onClose?: () => void;
  style?: React.CSSProperties;
}

export const ErrorAlert = ({ message, title, onClose, style }: ErrorAlertProps) => {
  return (
    <Alert
      color="red"
      style={style}
      withCloseButton={!!onClose}
      onClose={onClose}
      title={title}
    >
      {message}
    </Alert>
  );
};