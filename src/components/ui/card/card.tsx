'use client';

import React from 'react';

import { motion } from 'motion/react';

import { cn } from '@/lib/cn';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return reduced;
}

interface CardSliderProps extends React.ComponentProps<'div'> {
  /** Zero-based index of the visible panel */
  index: number;
  /** Duration in ms (ignored when `prefers-reduced-motion: reduce`) */
  transitionDurationMs?: number;
}

/**
 * Horizontal slide between step panels inside a card (viewport + flex track).
 * Each direct child is one full-width step.
 */
function CardSlider({
  index,
  className,
  children,
  transitionDurationMs = 300,
  ...props
}: CardSliderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const items = React.Children.toArray(children).filter(Boolean);
  const count = items.length;

  const safeIndex =
    count === 0 ? 0 : Math.max(0, Math.min(Math.floor(index), count - 1));

  const transformTransition = prefersReducedMotion
    ? 'none'
    : `transform ${transitionDurationMs}ms cubic-bezier(0.32, 0.72, 0, 1)`;

  const slideRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = React.useState<number[]>([]);

  React.useLayoutEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, count);
  }, [count]);

  React.useLayoutEffect(() => {
    const elements = slideRefs.current
      .slice(0, count)
      .filter((el): el is HTMLDivElement => el !== null);
    if (elements.length === 0) return;

    const measure = () => {
      setHeights(prev => {
        const next: number[] = [];
        for (let i = 0; i < count; i++) {
          const el = slideRefs.current[i];
          if (!el) {
            next.push(0);
            continue;
          }
          // scrollHeight: full content height (grid row height would be max of all columns otherwise).
          const h = Math.max(
            el.scrollHeight,
            el.getBoundingClientRect().height,
          );
          next.push(h);
        }
        if (
          prev.length === next.length &&
          prev.every((v, i) => v === next[i])
        ) {
          return prev;
        }
        return next;
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    elements.forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, [count, safeIndex]);

  const activeHeight = heights[safeIndex] ?? 0;
  const durationSec = prefersReducedMotion ? 0 : transitionDurationMs / 1000;

  if (count === 0) return null;

  const slideShare = 100 / count;

  return (
    <div
      data-slot="card-slider"
      className={cn(
        'min-h-0 min-w-0 w-full max-w-full overflow-x-clip overflow-y-visible',
        className,
      )}
      {...props}
    >
      {/*
        Inactive columns are collapsed (h-0 + overflow hidden + min-h-0) so the grid row
        height is only the active step — not max(all steps), which forced wrong viewport
        height and inner scroll. Active step is never given the collapsed classes.
      */}
      <motion.div
        className="min-h-0 w-full overflow-x-clip overflow-y-visible"
        initial={false}
        animate={
          activeHeight > 0 ? { height: activeHeight } : { height: 'auto' }
        }
        transition={{
          height: {
            duration: durationSec,
            ease: [0.32, 0.72, 0, 1],
          },
        }}
      >
        <div
          className="grid min-h-0 will-change-transform items-start"
          style={{
            width: `${count * 100}%`,
            gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
            transform: `translateX(-${safeIndex * slideShare}%)`,
            transition: transformTransition,
          }}
        >
          {items.map((child, i) => (
            <div
              key={i}
              ref={el => {
                slideRefs.current[i] = el;
              }}
              className={cn(
                'box-border min-h-0 min-w-0 max-w-full w-full',
                i !== safeIndex &&
                  'h-0 max-h-0 overflow-hidden border-0 p-0 pointer-events-none',
              )}
              aria-hidden={i !== safeIndex}
            >
              {child}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

interface CardContextValue {
  hasContent: boolean;
}

const CardContext = React.createContext<CardContextValue>({
  hasContent: false,
});

interface CardProps extends React.ComponentProps<'div'> {
  className?: string;
}

function CardRoot({ className, children, ...props }: CardProps) {
  const hasContent = React.Children.toArray(children).some(
    child => React.isValidElement(child) && child.type === CardContent,
  );

  return (
    <CardContext.Provider value={{ hasContent }}>
      <div
        className={cn(
          'flex flex-col bg-card [--card-radius:1rem] [--card-padding:0.25rem] p-(--card-padding) rounded-(--card-radius) group w-full h-fit',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

interface CardHeaderProps extends React.ComponentProps<'div'> {
  className?: string;
}

function CardHeader({ className, children, ...props }: CardHeaderProps) {
  const { hasContent } = React.useContext(CardContext);

  return (
    <div
      className={cn(
        'p-4 flex items-center justify-start gap-3 min-h-14',
        hasContent && 'mb-1',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardContentProps extends React.ComponentProps<'div'> {
  className?: string;
}

function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div
      className={cn(
        'relative bg-muted flex flex-1 flex-col gap-4 [--card-content-radius:calc(var(--card-radius)-var(--card-padding))] [--card-content-padding:1rem] rounded-(--card-content-radius) p-(--card-content-padding) overflow-hidden',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardFooterProps extends React.ComponentProps<'div'> {
  className?: string;
}

function CardFooter({ className, children, ...props }: CardFooterProps) {
  const { hasContent } = React.useContext(CardContext);

  return (
    <div
      suppressHydrationWarning
      className={cn(
        'p-4 flex items-center justify-start gap-3',
        hasContent && 'mt-1',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
  Slider: CardSlider,
});

/** Use these named exports from Server Components — `Card.Header` can be undefined across the RSC boundary. */
export { CardContent, CardFooter, CardHeader, CardSlider };
