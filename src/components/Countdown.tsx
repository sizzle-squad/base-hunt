'use client';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { setHours, startOfToday, startOfTomorrow } from 'date-fns';
import { getTimezoneOffset, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

import { Stack } from '@mui/material';
import accurateInterval from 'accurate-interval';

import Text from '@/components/Text';

const MST_TIMEZONE = 'America/Denver';

function addLeadingZero(num: number) {
  return num < 10 ? `0${num}` : num;
}

export const CountdownTimer = memo(() => {
  const targetDate = zonedTimeToUtc(
    setHours(startOfToday(), 17),
    MST_TIMEZONE
  ).getTime();

  const calculateInitialCount = () => {
    const currentTime = new Date().getTime();
    let timeDifference = targetDate - currentTime;
    if (timeDifference < 0) {
      // need to get tmr 5pm
      timeDifference =
        zonedTimeToUtc(
          setHours(startOfTomorrow(), 17),
          MST_TIMEZONE
        ).getTime() - currentTime;
    }

    return Math.floor(timeDifference / 1000); // Convert to seconds
  };

  const [count, setCount] = useState(calculateInitialCount);

  useEffect(() => {
    const interval = accurateInterval(
      () => {
        setCount((prevCount) => prevCount - 1);
      },
      1000,
      { aligned: true, immediate: true }
    );

    return () => interval.clear();
  }, []);

  // Function to format the countdown
  const formatCountdown = useMemo(() => {
    const hours = Math.floor((count % (3600 * 24)) / 3600);
    const minutes = Math.floor((count % 3600) / 60);
    const seconds = count % 60;

    return `${addLeadingZero(hours)}: ${addLeadingZero(minutes)}: ${addLeadingZero(seconds)}`;
  }, [count]);

  return (
    <Stack
      direction="column"
      width="100%"
      gap={1}
      borderRadius="12px"
      p={2}
      sx={{ backgroundColor: 'white' }}
    >
      <Text variant="h5" useMonoFont>
        {formatCountdown}
      </Text>
      <Text variant="body1">Time remaining until daily snapshot</Text>
    </Stack>
  );
});

CountdownTimer.displayName = 'CountdownTimer';
