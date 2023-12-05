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
      <Stack direction="row" alignItems="flex-start">
        <>
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
                </Stack>
              )}
              {isLoading && (
                <Text lineHeight="19.2px" fontSize="16px" noWrap>
                  <Skeleton variant="text" width={100} height={20} />
                </Text>
              )}
              {/* End Content */}
            </Stack>
            {/* Subtitle */}
            {subtitle && !isLoading && (
              <Text fontSize="14px" color="text.secondary" noWrap>
                {subtitle}
              </Text>
            )}
            {isLoading && (
              <Text fontSize="14px" color="text.secondary" noWrap>
                <Skeleton variant="text" width={200} height={20} />
              </Text>
            )}
          </Stack>
        </>
      </Stack>
    </Card>
  );
}

export default ListCard;
