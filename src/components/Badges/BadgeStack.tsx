import { Box } from '@mui/material';
import { Panel } from './Accordion';
import Image from 'next/image';

type Props = {
  panel: Panel;
  toggleFunction: (type: Panel) => void;
  hide: boolean;
};

function BadgeStack({ panel, toggleFunction, hide }: Props) {
  if (hide) return null;
  return (
    <Box
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
        onClick={() => toggleFunction(panel)}
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