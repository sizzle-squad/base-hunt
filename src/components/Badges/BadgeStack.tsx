import { BadgeTypeEnum } from '@/hooks/types';
import { Box } from '@mui/material';
import Image from 'next/image';
import { useCallback } from 'react';

type Props = {
  panel: BadgeTypeEnum;
  toggleFunction: (type: BadgeTypeEnum) => void;
  hide: boolean;
};

function BadgeStack({ panel, toggleFunction, hide }: Props) {
  const handleToggle = useCallback(() => {
    toggleFunction(panel);
  }, [panel, toggleFunction]);

  if (hide) return null;

  return (
    <Box
      onClick={handleToggle}
      sx={{
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        borderRadius: '0.75rem',
        backgroundColor: 'var(--White, #fff)',
        display: 'flex',
        gap: '20px',
        padding: '0 16px',
      }}
    >
      <Image
        style={{
          aspectRatio: '2.5',
          objectFit: 'contain',
          objectPosition: 'center',
          width: '80px',
          overflow: 'hidden',
          // marginTop: '16px',
          maxWidth: '100%',
        }}
        src="/images/badges.svg"
        alt="Badges"
        width={80}
        height={80}
      />
      <Box
        sx={{
          color: 'var(--Dark-Blue, #0a25a5)',
          fontFeatureSettings: '"clig" 0, "liga" 0',
          alignSelf: 'center',
          whiteSpace: 'nowrap',
          margin: 'auto 0',
          ':hover': {
            cursor: 'pointer',
          },
        }}
      >
        Show all
      </Box>
    </Box>
  );
}

export default BadgeStack;
