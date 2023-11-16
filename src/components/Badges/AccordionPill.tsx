import { Box } from '@mui/material';

type Props = {
  totalCount: number;
  collectedCount: number;
};

function AccordionPill({ collectedCount, totalCount }: Props) {
  return (
    <Box
      sx={{
        color: 'var(--White, #fff)',
        fontFeatureSettings: '"clig" 0, "liga" 0',
        whiteSpace: 'nowrap',
        borderRadius: '6.25rem', // 100px
        backgroundColor: 'var(--Black, #151515)',
        padding: '4px 8px',
        font: '400 14px/17px "Coinbase Mono", -apple-system, Roboto, Helvetica, sans-serif',
        '@media (max-width: 991px)': {
          whiteSpace: 'initial',
        },
      }}
    >
      {collectedCount}/{totalCount}
    </Box>
  );
}

export default AccordionPill;
