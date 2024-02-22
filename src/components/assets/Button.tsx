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
  textColor?: string;
  width?: string;
  maxWidth?: string;
  px?: string;
  py?: string;
};

export function Button({
  children,
  onClick,
  variant = 'contained',
  isLoading,
  disabled,
  href,
  bgColor = Color.Black,
  textColor = 'white',
  width = '100%',
  px = '20px',
  py = '16px',
  maxWidth,
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
        px,
        py,
        borderRadius: '1rem',
        backgroundColor: bgColor,
        color: textColor,
        textAlign: 'center',
        width,
        borderColor: '#656565',
        maxWidth,
      }}
    >
      {children}
    </LoadingButton>
  );
}
