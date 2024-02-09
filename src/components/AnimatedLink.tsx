'use client';
import React, { memo } from 'react';

import Link from 'next/link';

import useAnimatedRouter from '@/hooks/useAnimatedRouter';

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
