import { LoadingButton } from '@mui/lab';
import { ReactNode } from 'react';

type Props = {
  variant?: 'text' | 'outlined' | 'contained';
  onClick?: () => void;
  children: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  href?: string;
};

export function Button({
  children,
  onClick,
  variant = 'contained',
  isLoading,
  disabled,
  href,
}: Props) {
  return (
    <LoadingButton
      href={href}
      disabled={disabled}
      loading={isLoading}
      variant={variant}
      onClick={onClick}
      fullWidth
      sx={{
        px: '20px',
        py: '16px',
        borderRadius: '1rem',
        bgcolor: 'text.primary',
        color: 'white',
        textAlign: 'center',
      }}
    >
      {children}
    </LoadingButton>
  );
}
