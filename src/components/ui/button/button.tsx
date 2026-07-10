'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { mergeProps } from '@base-ui/react/merge-props';

import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { useHaptics } from '@/hooks/use-haptics';

import { composeRefs } from '@/lib/slot';

import { Loader } from '../loader';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-[transform,opacity,background-color,box-shadow,filter] duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-transparent focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer active:scale-[0.96] hover:brightness-95 select-none",
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
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5! data-[loading=true]:w-8!',
        default: 'h-10 px-4 py-2 has-[>svg]:px-3! data-[loading=true]:w-10!',
        lg: 'h-10 px-5 px-6 has-[>svg]:px-4! data-[loading=true]:w-12!',
        'icon-sm': 'size-8',
        icon: 'size-10',
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

  const ref = React.useRef<HTMLElement>(null);

  const buttonWidth = React.useRef<number | null>(null);
  const buttonHeight = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (ref.current && !isLoading) {
      const bounds = ref.current.getBoundingClientRect();

      buttonWidth.current = bounds.width;
      buttonHeight.current = bounds.height;
    }
  }, [isLoading]);

  const isFullWidth = className?.includes('w-full');

  const buttonStyle: React.CSSProperties = {
    ...props.style,
    ...(isLoading && buttonWidth.current && !isFullWidth
      ? { minWidth: buttonWidth.current }
      : {}),
    ...(isLoading && buttonHeight.current
      ? { minHeight: buttonHeight.current }
      : {}),
  };

  const content = isLoading ? (
    <>
      <Loader variant="button" />
      {/* Keeps the accessible name while the visible label is replaced by the loader. */}
      <span className="sr-only">{children as React.ReactNode}</span>
    </>
  ) : (
    (children as React.ReactNode)
  );

  return (
    <ButtonPrimitive
      ref={composeRefs(ref, forwardedRef)}
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
                isLoading ? (
                  <>
                    <Loader variant="button" />
                    {/* Keeps the accessible name while the visible label is replaced by the loader. */}
                    <span className="sr-only">
                      {children.props.children as React.ReactNode}
                    </span>
                  </>
                ) : (
                  (children.props.children as React.ReactNode)
                ),
              )
          : undefined
      }
      data-slot="button"
      data-size={size}
      data-variant={variant}
      data-loading={isLoading}
      disabled={disabled || isLoading}
      className={buttonVariants({ variant, size, className })}
      {...props}
      style={buttonStyle}
      onClick={e => {
        trigger('click');
        props.onClick?.(e);
      }}
    >
      {asChild ? null : content}
    </ButtonPrimitive>
  );
});

export { Button, buttonVariants };
