import { FC, ReactElement, ReactNode } from 'react';
import { Box, Card, LinearProgress, Stack, Typography } from '@mui/material';
import Text from '@/components/Text';

// Define a type that requires either title or subtitle to be present
export type ListCardProps = {
  key?: number;
  startContent?: ReactNode;
  endContent?: ReactNode;
  title?: string;
  subtitle?: string | ReactNode;
};

const ListCard: FC<ListCardProps> = ({
  startContent,
  title,
  subtitle,
  endContent,
}) => {
  // Component implementation remains the same
  return (
    <Card
      sx={{
        borderRadius: '12px',
        padding: '12px',
        alignSelf: 'stretch',
      }}
    >
      <Stack direction="row" alignItems="flex-start" gap="12px">
        <>
          {/* Start Content */}
          {startContent && <Stack flexDirection="column">{startContent}</Stack>}
          <Stack gap="10px" sx={{ flexGrow: 1, overflow: 'hidden', px: 1 }}>
            {/* Title */}
            <Stack flexDirection="row" justifyContent="space-between">
              {title && (
                <Text lineHeight="19.2px" fontSize="16px" noWrap>
                  {title}
                </Text>
              )}
              {/* End Content */}
              {endContent && (
                <Box sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'}}>
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
};

export default ListCard;
