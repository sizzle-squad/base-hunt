import { ReactNode } from 'react';
import { Box, Card, Stack } from '@mui/material';
import Text from '@/components/Text';

// Define a type that requires either title or subtitle to be present
export type ListCardProps = {
  key?: number;
  startContent?: ReactNode;
  endContent?: ReactNode;
  title?: string;
  subtitle?: string;
  titleDecoration?: ReactNode;
};

function ListCard({
  startContent,
  title,
  subtitle,
  endContent,
  titleDecoration,
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
              {title && (
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
              {endContent && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {endContent}
                </Box>
              )}
            </Stack>
            {/* Subtitle */}
            {subtitle && (
              <Text fontSize="14px" color="text.secondary" noWrap>
                {subtitle}
              </Text>
            )}
          </Stack>
        </>
      </Stack>
    </Card>
  );
}

export default ListCard;
