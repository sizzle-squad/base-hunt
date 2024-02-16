import { Card, CardMedia, Grid, Stack } from '@mui/material';
import { useCallback } from 'react';
import Text from '@/components/Text';
import { Button } from '@/components/assets/Button';
import { Color } from '@/constants/color';
import ListCard from '@/components/ListCard';
import { DailyChallengeClaim } from '@/components/Cards/DailyChallengeClaim';
import { ChallengeEntry } from './ChallengesClient';

type Props = {
  list: ChallengeEntry[];
  onClick?: (item: ChallengeEntry) => void;
  sectionTitle: string;
  isLoading?: boolean;
  displayGuildChallenge?: boolean;
};

const loadingCollection = [null, null, null, null, null];

export function ChallengeList({
  list,
  onClick,
  sectionTitle,
  isLoading,
  displayGuildChallenge,
}: Props) {
  const handlePress = useCallback(
    (item: ChallengeEntry) => () => {
      onClick?.(item);
    },
    [onClick]
  );

  return (
    <Stack gap={2} alignItems="flex-start" pb={3}>
      <Text
        variant="h6"
        sx={{ fontWeight: 500, size: '16px', lineHeight: '16px' }}
      >
        {sectionTitle}
      </Text>
      {isLoading &&
        loadingCollection.map((_, index) => (
          <ListCard key={index} isLoading={isLoading} />
        ))}
      <Grid container gap={2} sx={{ width: '100%' }}>
        {displayGuildChallenge ? <DailyChallengeClaim /> : null}
        {list &&
          list.map((item, index) => {
            return (
              <Grid item key={index} sx={{ width: '100%' }}>
                <Card
                  key={index}
                  sx={{
                    height: '100%',
                    p: 2,
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={handlePress(item)}
                >
                  <Stack direction="row" gap={2}>
                    <CardMedia
                      component="img"
                      image="https://go.wallet.coinbase.com/static/base-hunt/base-house.jpg"
                      alt="green iguana"
                      sx={{
                        height: '126px',
                        width: '126px',
                      }}
                    />
                    <Stack
                      direction="column"
                      gap={2}
                      justifyContent={'space-between'}
                    >
                      <Stack
                        direction="column"
                        justifyContent="flex-start"
                        gap={0.5}
                        maxWidth="215px"
                      >
                        <Text variant="body2">{item.type}</Text>
                        <Text variant="h6">{item.title}</Text>
                      </Stack>
                      <Button
                        variant="outlined"
                        bgColor={item.isCompleted ? Color.GRAY : 'none'}
                        textColor="black"
                        width="fit-content"
                        px="12px"
                        py="8px"
                      >
                        <Text>
                          {item.isCompleted
                            ? 'Claimed'
                            : item.points.toString() + ' pts'}
                        </Text>
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </Stack>
  );
}
