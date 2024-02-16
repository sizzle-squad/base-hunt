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
  lineHeight,
  ...props
}) => {
  const fontStyle = useMonoFont ? { fontFamily: 'CoinbaseMono' } : {};
  return (
    <Typography
      variant={variant}
      {...props}
      sx={{ ...commonStyles, ...fontStyle, fontSize, color, lineHeight }}
    >
      {children}
    </Typography>
  );
};

export default Text;
