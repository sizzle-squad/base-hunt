import { FC, PropsWithChildren, ReactNode } from 'react';

import { Typography, TypographyProps } from '@mui/material';

interface CustomTypographyProps extends TypographyProps {
  children: PropsWithChildren<ReactNode>;
  fontSize?: string | number;
}

const commonStyles = {
  color: '#000',
  fontFeatureSettings: "'clig' off, 'liga' off",
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: 'normal',
} as const;

const Text: FC<CustomTypographyProps & { useMonoFont?: boolean }> = ({
  children,
  variant,
  fontSize,
  color,
  useMonoFont,
  ...props
}) => {
  const fontStyle = useMonoFont ? { fontFamily: 'CoinbaseMono' } : {};
  return (
    <Typography
      variant={variant}
      sx={{ ...commonStyles, ...fontStyle, fontSize, color }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default Text;
