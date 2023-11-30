'use client';
import useAnimatedRouter from '@/hooks/useAnimatedRouter';
import Link from 'next/link';
import React, { memo } from 'react';

type Props = {
  href: string;
  children: React.ReactNode;
};

const AnimatedLink = ({ href, children }: Props) => {
  const { animatedRoute } = useAnimatedRouter();
  return (
    <Link href={href} onClick={() => animatedRoute(href)} passHref>
      {children}
    </Link>
  );
};

export default memo(AnimatedLink);

AnimatedLink.displayName = 'AnimatedLink';
