import {
  Card,
  CardMedia,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCallback, useMemo } from 'react';
import Text from '@/components/Text';
import { Button } from '@/components/assets/Button';
import { Color } from '@/constants/color';
import ListCard from '@/components/ListCard';
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
  const theme = useTheme();
  const greaterThanMid = useMediaQuery(theme.breakpoints.up('md'));

  const fillerCards = useMemo(() => {
    if (greaterThanMid) {
      const fillerCount = list.length % 4;
      const filler = [];
      for (let i = 0; i < fillerCount; i++) {
        filler.push(
          <Grid
            item
            key={`fill-${i}`}
            sx={{ width: '100%' }}
            xs={12}
            sm={5.5}
            lg={2.75}
          >
            <Card
              sx={{
                height: '100%',
                p: 2,
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'none',
              }}
            >
              hello
            </Card>
          </Grid>
        );
      }

      return filler;
    }

    return null;
  }, [greaterThanMid, list]);

  const handlePress = useCallback(
    (item: ChallengeEntry) => () => {
      onClick?.(item);
    },
    [onClick]
  );

  const cards = useMemo(() => {
    if (!list) return null;

    if (!greaterThanMid) {
      return list.map((item, index) => {
        return (
          <Grid
            item
            key={index}
            sx={{ width: '100%' }}
            xs={12}
            sm={5.5}
            lg={2.75}
          >
            <Card
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
                  image={
                    item.imageUrl ??
                    'https://go.wallet.coinbase.com/static/base-hunt/base-house.jpg'
                  }
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
      });
    } else {
      return list.map((item, index) => {
        return (
          <Grid
            item
            key={index}
            sx={{ width: '100%' }}
            xs={12}
            sm={5.5}
            lg={2.75}
          >
            <Card
              sx={{
                height: '100%',
                px: 2,
                py: 3,
                borderRadius: '14px',
                cursor: 'pointer',
              }}
              onClick={handlePress(item)}
            >
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
                height="100%"
              >
                <CardMedia
                  component="img"
                  image={
                    item.imageUrl ??
                    'https://go.wallet.coinbase.com/static/base-hunt/base-house.jpg'
                  }
                  alt="challenge image"
                  sx={{
                    height: '175px',
                    width: '175px',
                    borderRadius: '8px',
                  }}
                />
                <Stack
                  direction="column"
                  gap={2}
                  justifyContent="space-between"
                  height="100%"
                >
                  <Stack
                    direction="column"
                    justifyContent="center"
                    gap={0.5}
                    maxWidth="215px"
                  >
                    <Text variant="h6" textAlign="center">
                      {item.title}
                    </Text>
                  </Stack>
                </Stack>
                <Button
                  variant="outlined"
                  bgColor={item.isCompleted ? Color.GRAY : 'none'}
                  textColor="black"
                  width="100%"
                  px="12px"
                  py="8px"
                  borderColor="#CED2DB"
                >
                  <Text>
                    {item.isCompleted
                      ? 'Claimed'
                      : `Earn ${item.points.toString()} pts`}
                  </Text>
                </Button>
              </Stack>
            </Card>
          </Grid>
        );
      });
    }
  }, [greaterThanMid, handlePress, list]);

  // const mobileCard = useMemo((item: ChallengeEntry, index: number) => {
  //   return ()
  // }, []);

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
      <Grid
        container
        gap={2}
        sx={{ width: '100%', flexGrow: 1 }}
        justifyContent="space-between"
      >
        {cards}
        {fillerCards}
      </Grid>
    </Stack>
  );
}
