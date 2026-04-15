'use client';

import { useEffect } from 'react';

const FONT_SIZE_CLASSES = [
  'font-size-smaller',
  'font-size-small',
  'font-size-large',
  'font-size-larger',
];

export function FontSizeProvider({
  fontSize = 'default',
}: {
  fontSize?: 'smaller' | 'small' | 'default' | 'large' | 'larger';
}) {
  useEffect(() => {
    const html = document.documentElement;

    FONT_SIZE_CLASSES.forEach(cls => html.classList.remove(cls));

    if (fontSize !== 'default') {
      html.classList.add(`font-size-${fontSize}`);
    }
  }, [fontSize]);

  return null;
}
