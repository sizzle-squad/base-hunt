'use client';
import { useProgress } from '@/context/NavigationContext';
import useAnimatedRouter from '@/hooks/useAnimatedRouter';
import Link from 'next/link';
import React, { memo, useCallback } from 'react';

type Props = {
  href: string;
  children: React.ReactNode;
};

const AnimatedLink = ({ href, children }: Props) => {
  const { animatedRoute } = useAnimatedRouter();
  const { setIsProgressing } = useProgress();

  const handleClick = useCallback(() => {
    setIsProgressing(true);
    animatedRoute(href);
  }, [animatedRoute, href, setIsProgressing]);

  return (
    <Link href={href} onClick={handleClick} passHref>
      {children}
    </Link>
  );
};

export default memo(AnimatedLink);

AnimatedLink.displayName = 'AnimatedLink';
