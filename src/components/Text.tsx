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
};

const Text: FC<CustomTypographyProps> = ({
  children,
  variant,
  fontSize,
  color,
  ...props
}) => {
  return (
    <Typography
      variant={variant}
      sx={{ ...commonStyles, fontSize: fontSize, color }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default Text;
