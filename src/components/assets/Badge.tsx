import { memo, useMemo } from 'react';

import { Box, Stack } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import Text from '@/components/Text';
import type { Badge as BadgeType } from '@/hooks/types';

type Props = {
  imageUrl: URL | string;
  isCompleted: boolean;
  badge: BadgeType;
};

const CompletedSvg = memo(() => (
  <svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 1.1547C15.2376 0.440169 16.7624 0.440169 18 1.1547L27.8564 6.8453C29.094 7.55983 29.8564 8.88034 29.8564 10.3094V21.6906C29.8564 23.1197 29.094 24.4402 27.8564 25.1547L18 30.8453C16.7624 31.5598 15.2376 31.5598 14 30.8453L4.14359 25.1547C2.90599 24.4402 2.14359 23.1197 2.14359 21.6906V10.3094C2.14359 8.88034 2.90599 7.55983 4.14359 6.8453L14 1.1547Z"
      fill="white"
    />
    <path
      d="M15 8.57735C15.6188 8.22008 16.3812 8.22008 17 8.57735L21.9282 11.4226C22.547 11.7799 22.9282 12.4402 22.9282 13.1547V18.8453C22.9282 19.5598 22.547 20.2201 21.9282 20.5774L17 23.4226C16.3812 23.7799 15.6188 23.7799 15 23.4226L10.0718 20.5774C9.45299 20.2201 9.0718 19.5598 9.0718 18.8453V13.1547C9.0718 12.4402 9.45299 11.7799 10.0718 11.4226L15 8.57735Z"
      fill="#1D1818"
    />
    <path
      d="M13 17.5L15.2857 19L19 13"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
));

const IncompleteSvg = memo(() => (
  <svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 1.1547C15.2376 0.440169 16.7624 0.440169 18 1.1547L27.8564 6.8453C29.094 7.55983 29.8564 8.88034 29.8564 10.3094V21.6906C29.8564 23.1197 29.094 24.4402 27.8564 25.1547L18 30.8453C16.7624 31.5598 15.2376 31.5598 14 30.8453L4.14359 25.1547C2.90599 24.4402 2.14359 23.1197 2.14359 21.6906V10.3094C2.14359 8.88034 2.90599 7.55983 4.14359 6.8453L14 1.1547Z"
      fill="white"
    />
    <path
      d="M15 8.57735C15.6188 8.22008 16.3812 8.22008 17 8.57735L21.9282 11.4226C22.547 11.7799 22.9282 12.4402 22.9282 13.1547V18.8453C22.9282 19.5598 22.547 20.2201 21.9282 20.5774L17 23.4226C16.3812 23.7799 15.6188 23.7799 15 23.4226L10.0718 20.5774C9.45299 20.2201 9.0718 19.5598 9.0718 18.8453V13.1547C9.0718 12.4402 9.45299 11.7799 10.0718 11.4226L15 8.57735Z"
      fill="black"
    />
    <path d="M13 13L19 19" stroke="white" strokeWidth="1.5" />
    <path d="M13 19L19 13" stroke="white" strokeWidth="1.5" />
  </svg>
));

IncompleteSvg.displayName = 'IncompleteSvg';
CompletedSvg.displayName = 'CompletedSvg';

export function Badge({ imageUrl, isCompleted, badge }: Props) {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '0.75rem',
        backgroundColor: 'var(--White, #fff)',
        overflow: 'hidden',
        padding: '0.5rem 0.5rem 0.75rem 0.5rem',
        display: 'flex',
        width: '10.09375rem',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <Link href={`/badges/${badge.id}`}>
        <Stack flexDirection="column" gap=".75rem">
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
          >
            {isCompleted ? <CompletedSvg /> : <IncompleteSvg />}
          </Box>
          <Image
            src={imageUrl as string}
            alt="jumbotron"
            sizes="100vw"
            width={146}
            height={146}
            style={{
              borderRadius: '0.75rem',
            }}
          />
          {!isCompleted && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(211, 211, 211, 0.5)',
                borderRadius: '0.75rem',
              }}
            />
          )}
          <Text fontSize="1rem" align="center">
            {badge.name}
          </Text>
        </Stack>
      </Link>
    </Box>
  );
}
