'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { mergeProps } from '@base-ui/react/merge-props';

import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

import { useHaptics } from '@/hooks/use-haptics';

import { Loader } from '../loader';

const buttonVariants = cva(
  "relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-[transform,opacity,background-color,box-shadow,filter] duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-transparent focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer active:scale-[0.96] hover:brightness-95 select-none",
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:bg-foreground/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        success:
          'bg-success text-white hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 dark:bg-success/60',
        outline: 'bg-card',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-input text-foreground',
        ghost: 'hover:bg-card hover:text-muted-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        /**
         * The icon padding tweak looks at the SVG inside the content wrapper
         * (`[data-slot=button-content]`), never the loader, so the padding
         * doesn't shift when entering the loading state.
         *
         * Heights step by +8px mirroring the icon sizes (size-8 / size-10 /
         * size-12): h-8 / h-10 / h-12.
         */
        // No vertical padding: the height is fixed by `h-*`, and the loading
        // content wrapper uses `self-stretch` + `translate-y-full` to slide the
        // FULL height out of view — any `py` would shrink the content box and
        // leave a sliver of the content visible during loading.
        sm: 'h-8 gap-1.5 px-3 has-[[data-slot=button-content]>svg]:px-2.5!',
        default: 'h-10 px-4 has-[[data-slot=button-content]>svg]:px-3!',
        lg: 'h-12 px-6 has-[[data-slot=button-content]>svg]:px-5!',
        'icon-sm': 'size-8',
        icon: 'size-10',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type InternalVariantProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
  isLoading?: boolean;
};

export type ButtonVariants = InternalVariantProps['variant'];

/**
 * Button content + loader as a vertical conveyor that slides in and out of the
 * button (clipped at the edge — the button has `overflow-hidden`).
 *
 * The content stays in flow (once, without duplicating the text) with
 * `self-stretch`, so it spans the button's full height and fixes its
 * width/height — the button never shrinks. `translate-y` only moves it visually
 * (transform doesn't affect layout), keeping the size. The loader is
 * `absolute inset-0`. Both slide the button's FULL height via `translate-y-full`:
 * - when loading starts, the loader drops in from the top while the content
 *   drops out the bottom;
 * - when it ends, the loader rises out the top while the content comes back up
 *   from the bottom.
 *
 * Pure CSS (no animation lib). The real content (with the text) stays in the DOM
 * once, preserving the accessible name; the loader is decorative (`aria-hidden`).
 */
function ButtonContent({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <span
        data-slot="button-content"
        className={cn(
          'inline-flex items-center justify-center gap-[inherit] self-stretch transition-transform duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none',
          isLoading ? 'translate-y-full' : 'translate-y-0',
        )}
      >
        {children}
      </span>

      <span
        data-slot="button-loader"
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center transition-transform duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none',
          isLoading ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <Loader variant="button" />
      </span>
    </>
  );
}

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & InternalVariantProps
>(function Button(
  {
    variant,
    size = 'default',
    asChild = false,
    isLoading = false,
    disabled,
    className,
    children,
    ...props
  },
  forwardedRef,
) {
  const { trigger } = useHaptics();

  return (
    <ButtonPrimitive
      ref={forwardedRef}
      nativeButton={!asChild}
      render={
        asChild && React.isValidElement<Record<string, unknown>>(children)
          ? buttonProps =>
              React.cloneElement(
                children,
                mergeProps(
                  buttonProps as React.ComponentPropsWithRef<'button'>,
                  children.props as React.ComponentPropsWithRef<'button'>,
                ),
                <ButtonContent isLoading={isLoading}>
                  {children.props.children as React.ReactNode}
                </ButtonContent>,
              )
          : undefined
      }
      data-slot="button"
      data-size={size}
      data-variant={variant}
      data-loading={isLoading}
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      className={buttonVariants({ variant, size, className })}
      {...props}
      onClick={e => {
        trigger('click');
        props.onClick?.(e);
      }}
    >
      {asChild ? null : (
        <ButtonContent isLoading={isLoading}>{children}</ButtonContent>
      )}
    </ButtonPrimitive>
  );
});

export { Button, buttonVariants };
