import { ReactNode } from 'react';

import { Box, Card, Skeleton, Stack } from '@mui/material';

import Text from '@/components/Text';

// Define a type that requires either title or subtitle to be present
export type ListCardProps = {
  key?: number;
  startContent?: ReactNode;
  endContent?: ReactNode;
  title?: string;
  subtitle?: string | ReactNode;
  titleDecoration?: ReactNode;
  isLoading?: boolean;
};

function ListCard({
  startContent,
  title,
  subtitle,
  endContent,
  titleDecoration,
  isLoading,
}: ListCardProps) {
  // Component implementation remains the same
  return (
    <Card
      sx={{
        borderRadius: '12px',
        padding: '12px',
        alignSelf: 'stretch',
      }}
    >
      {isLoading ? (
        <Stack direction="row" gap={2}>
          <Skeleton variant="rounded" width={90} height={90} />
          <Stack direction="column" gap={2}>
            <Stack gap={0.5}>
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={150} height={25} />
            </Stack>
            <Skeleton variant="rounded" width={95} height={30} />
          </Stack>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="flex-start">
          {/* Start Content */}
          {startContent && <Stack flexDirection="column">{startContent}</Stack>}
          <Stack gap="10px" sx={{ flexGrow: 1, overflow: 'hidden', px: 1 }}>
            {/* Title */}
            <Stack flexDirection="row" justifyContent="space-between">
              {title && !isLoading && (
                <Stack flexDirection={'row'} gap="8px" alignItems={'center'}>
                  <Text lineHeight="19.2px" fontSize="16px" noWrap>
                    {title}
                  </Text>
                  {titleDecoration && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {titleDecoration}
                    </Box>
                  )}
                </Stack>
              )}
              {/* End Content */}
              {endContent && !isLoading && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {endContent}
                </Box>
              )}
            </Stack>
            {/* Subtitle */}
            {subtitle && !isLoading && (
              <Text fontSize="14px" color="text.secondary" noWrap>
                {subtitle}
              </Text>
            )}
          </Stack>
        </Stack>
      )}
    </Card>
  );
}

export default ListCard;
