import { memo, useMemo } from 'react';
import { Stack, IconButton } from '@mui/material';
import Text from '@/components/Text';
import Link from 'next/link';

const LeftChevron = memo(function defaultLeftChevron() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="12" fill="#0A0B0D" fillOpacity="0.2" />
      <path d="M15 6L9 12L15 18" stroke="#1D1818" strokeWidth="2" />
    </svg>
  );
});

const WhiteLeftChevron = memo(function whiteLeftChevron() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="12" fill="white" fill-opacity="0.2" />
      <path d="M15 6L9 12L15 18" stroke="white" stroke-width="2" />
    </svg>
  );
});

type TitleBarProps = {
  owned?: boolean;
  title: string;
  backHref?: string;
};

export function TitleBar({
  owned = false,
  title,
  backHref = '/badges',
}: TitleBarProps) {
  const chevronIcon = useMemo(() => {
    return owned ? <WhiteLeftChevron /> : <LeftChevron />;
  }, [owned]);

  return (
    <Stack
      flexDirection="row"
      position="relative"
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      className="pageContent"
    >
      <Link href={backHref}>
        <IconButton
          sx={{
            color: owned ? '#FFFFFF' : '#1D1818',
            padding: 0,
          }}
        >
          {chevronIcon}
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
}

export default TitleBar;
