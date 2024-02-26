'use client';

import { useCallback, useMemo } from 'react';

import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  NoSsr,
  Skeleton,
  Stack,
} from '@mui/material';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Button } from '@/components/assets/Button';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import Text from '@/components/Text';
import { Color } from '@/constants/color';
import { GAME_ID } from '@/constants/gameId';
import { useLevels } from '@/hooks/useLevels';
import Pill from '@/components/Pill';
import { useGameInfoContext } from '@/context/GameInfoContext';
import { BootstrapDialog } from '@/components/BoostrapDialog';

export default function PrizesPageClient() {
  const { address } = useAccount();
  const {
    data,
    isLoading: isLevelsLoading,
    error: levelsError,
  } = useLevels({ gameId: GAME_ID, address: address ?? '' });
  const { showModal, setShowModal } = useGameInfoContext();

  const toggleModal = useCallback(() => {
    setShowModal((prev) => !prev);
  }, [setShowModal]);

  const handleClaimPress = useCallback(
    (ctaUrl: string) => () => {
      window.open(ctaUrl, '_blank');
    },
    []
  );

  const loadingSkeleton = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, index) => (
        <Grid
          item
          xs={12}
          sm={5.5}
          lg={2.75}
          key={`skeleton-${index}`}
          spacing={1}
          sx={{
            pb: 2,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Stack
            direction="column"
            gap={1}
            p={2}
            sx={{ background: Color.White }}
            width="100%"
            borderRadius="16px"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <Skeleton variant="circular" width={44} height={44} />
              <Stack direction="column">
                <Skeleton variant="text" width={100} height={30} />
                <Skeleton variant="text" width={200} height={20} />
              </Stack>
            </Stack>
            <Skeleton variant="rectangular" width={300} height={275} />
            <Skeleton variant="rounded" width="100%" height={50} />
          </Stack>
        </Grid>
      )),
    []
  );

  return (
    <Stack gap="24px" pb={10}>
      <DetailsPageNavbar title="Prizes" />
      <Pill backgroundColor="none" onClick={toggleModal} hover>
        <Text>How prizes work</Text>
        {showModal ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Pill>
      <NoSsr>
        <Grid
          container
          gap={2}
          sx={{ width: '100%', flexGrow: 1 }}
          justifyContent="center"
        >
          {isLevelsLoading
            ? loadingSkeleton
            : data.levels.map((level, index) => {
                const currentLevel =
                  data.currentLevelIdx === null
                    ? -1
                    : Number(data.currentLevelIdx);
                const isDisabled = currentLevel < index;

                return (
                  <Grid
                    item
                    key={`${level.id}-${index}`}
                    xs={12}
                    sm={5.5}
                    lg={2.75}
                  >
                    <Stack
                      direction="column"
                      gap={1}
                      p={2}
                      sx={{ background: Color.White }}
                      height="100%"
                      width="100%"
                      borderRadius="16px"
                      alignItems="center"
                      justifyContent={'space-between'}
                    >
                      <Stack direction="row" alignItems="flex-start" gap={2}>
                        <Box pt={1}>
                          <Image
                            src={level.imageUrl ?? ''}
                            alt="jumbotron"
                            width={44}
                            height={44}
                          />
                        </Box>
                        <Stack direction="column">
                          <Stack direction="row" gap={2}>
                            <Text variant="h6">Level {level.level}</Text>
                            {currentLevel === index && (
                              <Pill>
                                <Text useMonoFont fontSize="14px">
                                  Current
                                </Text>
                              </Pill>
                            )}
                          </Stack>
                          <Text variant="body1">{level.prizeDescription}</Text>
                          <Text variant="body1">{`${level.thresholdPoints.toString()} points required`}</Text>
                          <Text
                            variant="body1"
                            visibility={
                              level.level === '1' ? 'visible' : 'hidden'
                            }
                          >
                            <i>IRL Redemption Only</i>
                          </Text>
                        </Stack>
                      </Stack>
                      <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        py={2}
                        width="300px"
                        height="275px"
                      >
                        <Image
                          src={level.prizeImageUrl ?? ''}
                          alt="jumbotron"
                          width={200}
                          height={200}
                        />
                      </Stack>

                      <Button
                        href={level.ctaUrl}
                        variant="contained"
                        disabled={isDisabled}
                        bgColor={Color.CoinbaseBlue}
                        onClick={handleClaimPress(level.ctaUrl)}
                        textColor={Color.White}
                      >
                        {currentLevel >= index ? 'Claim' : 'Locked'}
                      </Button>
                    </Stack>
                  </Grid>
                );
              })}
        </Grid>
        <BootstrapDialog
          onClose={() => setShowModal(false)}
          aria-labelledby="customized-dialog-title"
          open={showModal}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            How prizes work
          </DialogTitle>
          <DialogContent>
            <Text gutterBottom lineHeight="160%">
              • Prizes can be claimed for free at ETHDenver (Spork Castle, Booth
              401) or ordered through the Slice merch store (shipping and
              processing fees apply).
            </Text>
            <Text gutterBottom lineHeight="160%">
              • You are eligible to claim a prize from each level.
            </Text>
            <Text gutterBottom lineHeight="160%">
              • Online orders must be placed by March 6, 11:59 EST.
            </Text>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>
              <Text>Got it!</Text>
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </NoSsr>
    </Stack>
  );
}
