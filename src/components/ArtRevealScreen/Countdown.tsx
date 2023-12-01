'use client';
import React, { useState, useEffect, useMemo } from 'react';
import accurateInterval from 'accurate-interval';
import Text from '@/components/Text';
import { Stack } from '@mui/material';

export const CountdownTimer = () => {
  const targetDate = new Date('December 10, 2023 17:00:00').getTime();
  const calculateInitialCount = () => {
    const currentTime = new Date().getTime();
    const timeDifference = targetDate - currentTime;
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
    const days = Math.floor(count / (3600 * 24));
    const hours = Math.floor((count % (3600 * 24)) / 3600);
    const minutes = Math.floor((count % 3600) / 60);
    const seconds = count % 60;

    return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
  }, [count]);

  return (
    <Stack width="100%" gap={8} textAlign="center">
      <Text fontSize="100px" useMonoFont>
        {formatCountdown}
      </Text>
    </Stack>
  );
};
