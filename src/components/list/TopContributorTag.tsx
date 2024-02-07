import Text from '@/components/Text';
import { Stack } from '@mui/material';
import { memo } from 'react';

const CrownIcon = memo(() => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.879 4.10461C7.33752 3.17555 8.66232 3.17555 9.12084 4.10461L9.66837 5.21402C9.85044 5.58294 10.2024 5.83866 10.6095 5.89782L11.8338 6.07572C12.8591 6.2247 13.2685 7.48467 12.5266 8.20784L11.6407 9.07139C11.3461 9.35856 11.2116 9.77231 11.2812 10.1778L11.4903 11.3972C11.6655 12.4183 10.5937 13.197 9.67665 12.7149L8.5816 12.1392C8.21744 11.9477 7.7824 11.9477 7.41824 12.1392L6.32319 12.7149C5.40616 13.197 4.33437 12.4183 4.5095 11.3972L4.71864 10.1778C4.78819 9.77231 4.65375 9.35856 4.35914 9.07139L3.47323 8.20784C2.73133 7.48467 3.14072 6.2247 4.166 6.07572L5.3903 5.89782C5.79744 5.83866 6.1494 5.58294 6.33147 5.21401L6.879 4.10461Z"
      fill="white"
    />
  </svg>
));
CrownIcon.displayName = 'CrownIcon';

export function TopContributorTag({ isGuild }: { isGuild?: boolean }) {
  return (
    <Stack
      direction="row"
      borderRadius={100}
      bgcolor="var(--Black, #1d1818)"
      display="flex"
      padding="4px 8px"
      alignItems="center"
      width="120px"
      gap={1}
    >
      <CrownIcon />
      <Text
        flexGrow={1}
        whiteSpace="nowrap"
        fontSize={14}
        lineHeight="17px"
        fontWeight={400}
        color={'var(--White, #fff)'}
        variant="h6"
      >
        {`Top ${isGuild ? 'guild' : 'player'}`}
      </Text>
    </Stack>
  );
}
