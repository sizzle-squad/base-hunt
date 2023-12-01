'use client';
import { useProgress } from '@/context/NavigationContext';
import useAnimatedRouter from '@/hooks/useAnimatedRouter';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { memo, useCallback } from 'react';

type Props = {
  href: string;
  children: React.ReactNode;
};

const AnimatedLink = ({ href, children }: Props) => {
  const { animatedRoute } = useAnimatedRouter();
  const { startProgress } = useProgress();
  const pathname = usePathname();

  const handleClick = useCallback(() => {
    if (pathname === href) return;
    startProgress();
    animatedRoute(href);
  }, [animatedRoute, href, startProgress, pathname]);

  return (
    <Link href={href} onClick={handleClick} passHref>
      {children}
    </Link>
  );
};

export default memo(AnimatedLink);

AnimatedLink.displayName = 'AnimatedLink';
