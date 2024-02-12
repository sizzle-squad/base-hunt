import { ReactNode } from 'react';

import { LoadingButton } from '@mui/lab';
import { Color } from '@/constants/color';

type Props = {
  variant?: 'text' | 'outlined' | 'contained';
  onClick?: () => void;
  children: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  href?: string;
  bgColor?: string;
};

export function Button({
  children,
  onClick,
  variant = 'contained',
  isLoading,
  disabled,
  href,
  bgColor = Color.Black,
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
        backgroundColor: bgColor,
        color: 'white',
        textAlign: 'center',
      }}
    >
      {children}
    </LoadingButton>
  );
}
