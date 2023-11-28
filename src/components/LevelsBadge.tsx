import React, { ComponentProps, memo } from 'react';
import Image from 'next/image';

import Svg1 from '@public/images/levels/1.svg';
import Svg2 from '@public/images/levels/2.svg';
import Svg3 from '@public/images/levels/3.svg';
import Svg4 from '@public/images/levels/4.svg';
import Svg5 from '@public/images/levels/5.svg';
import Svg6 from '@public/images/levels/6.svg';
import { type Level } from '@/hooks/types';

type LevelNumber = Level['level'];

const Levels: {
  [key in LevelNumber]: typeof Svg1;
} = {
  0: Svg1,
  1: Svg2,
  2: Svg3,
  3: Svg4,
  4: Svg5,
  5: Svg6,
  6: null,
  7: null,
};

type SvgSwitcherProps = {
  level: keyof typeof Levels | null;
} & Omit<ComponentProps<typeof Image>, 'src'>;

const SvgSwitcher = ({ level, ...imageProps }: SvgSwitcherProps) => {
  let SvgComponent = null;
  if (level === null) {
    return null;
  }

  if (typeof level === 'string') {
    SvgComponent = Levels[parseInt(level) as unknown as LevelNumber];
  } else {
    SvgComponent = Levels[level];
  }

  return (
    <Image
      src={SvgComponent}
      alt={imageProps.alt}
      width={imageProps.width}
      height={imageProps.height}
    />
  );
};

export default memo(SvgSwitcher);
