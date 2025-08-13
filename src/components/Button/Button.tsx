import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { motion, type HTMLMotionProps } from 'motion/react';

import { cn } from '@/utils';
import { Loader } from '@/components/Loader';

const variants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive touch-hitbox active:scale-98 transition-all duration-150",
  ),
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        warning:
          'bg-warning text-white hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 dark:bg-warning/60',
        success:
          'bg-success text-white hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 dark:bg-success/60',
        outline:
          'border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        xs: cn(
          'h-7 rounded-md gap-1 px-2.5',
          // 'has-[>svg]:px-2',
        ),
        sm: cn(
          'h-8 rounded-md gap-1.5 px-3',
          // 'has-[>svg]:px-2.5',
        ),
        md: cn(
          'h-9 px-4 py-2',
          // 'has-[>svg]:px-3',
        ),
        lg: cn(
          'h-10 rounded-md px-6',
          // 'has-[>svg]:px-4',
        ),
        xl: cn(
          'h-11 rounded-md px-8',
          // 'has-[>svg]:px-5',
        ),
        '2xl': cn(
          'h-12 rounded-md px-10',
          // 'has-[>svg]:px-6',
        ),
        '3xl': cn(
          'h-14 rounded-md px-12',
          // 'has-[>svg]:px-8',
        ),
        '4xl': cn(
          'h-16 rounded-md px-14',
          // 'has-[>svg]:px-10',
        ),
        '5xl': cn(
          'h-18 rounded-md px-16',
          // 'has-[>svg]:px-12',
        ),
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: VariantProps<typeof variants>['variant'];
  size?: VariantProps<typeof variants>['size'];
  asChild?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

interface InternalButtonProps
  extends Omit<
    HTMLMotionProps<'button'>,
    keyof React.DOMAttributes<HTMLButtonElement>
  > {}

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  ...props
}: ButtonProps) => {
  const p: InternalButtonProps = {
    ...props,
    className: cn(
      variants({ variant, size, className }),
      loading && 'cursor-not-allowed',
    ),
  };

  return asChild ? (
    <Slot data-slot="button" className={p.className}>
      {props.children}
    </Slot>
  ) : (
    <motion.button {...p}>
      {loading && <Loader loading={loading} size="xs" />}
      {props.children}
    </motion.button>
  );
};

export { Button, type ButtonProps, variants };
