import * as React from 'react';
import { Stack, IconButton } from '@mui/material';
import Text from '@/components/Text';
import Link from 'next/link';

type TitleBarProps = {
  owned?: boolean;
  title: string;
  backHref?: string;
};

const TitleBar: React.FC<TitleBarProps> = ({
  owned = false,
  title,
  backHref = '/badges',
}) => {
  return (
    <Stack
      flexDirection="row"
      position="relative"
      width="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      <Link href={backHref}>
        <IconButton
          sx={{
            color: owned ? '#FFFFFF' : '#1D1818',
            padding: 0,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="24"
              height="24"
              rx="12"
              fill="#0A0B0D"
              fillOpacity="0.2"
            />
            <path d="M15 6L9 12L15 18" stroke="#1D1818" strokeWidth="2" />
          </svg>
        </IconButton>
      </Link>
      <Stack flexDirection="row" justifyContent="center" width="100%">
        <Text
          fontSize="20px"
          sx={{
            color: owned ? '#FFFFFF' : '#1D1818',
          }}
        >
          {title}
        </Text>
      </Stack>
    </Stack>
  );
};

export default TitleBar;
