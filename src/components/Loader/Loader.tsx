import { AnimatePresence, motion } from 'motion/react';
import { Loader2Icon, LoaderIcon } from 'lucide-react';
import { cn } from '@/utils';
import { DEFAULT_SIZE, type SizesType } from '@/constants/sizes';
import { animations } from '@/constants/animations';

interface LoaderProps {
  variant?: 'loader' | 'spinner';
  loading?: boolean;
  size?: SizesType;
  className?: string;
}

const Loader = ({
  variant = 'loader',
  loading = true,
  size = DEFAULT_SIZE,
  className,
}: LoaderProps) => {
  const sizesMap = {
    xs: 'size-4',
    sm: 'size-6',
    md: 'size-8',
    lg: 'size-10',
    xl: 'size-12',
    '2xl': 'size-14',
    '3xl': 'size-16',
    '4xl': 'size-18',
    '5xl': 'size-20',
  };

  const durationMap = {
    loader: '500',
    spinner: '1200',
  };

  const props = {
    className: cn(
      sizesMap[size],
      'animate-spin shrink-0',
      `duration-${durationMap[variant]}`,
    ),
  };

  return (
    <div className={cn('relative shrink-0', className, sizesMap[size])}>
      <AnimatePresence mode="popLayout">
        {loading && (
          <motion.div
            key="loader"
            layout="size"
            {...animations.presets.ENTER_NEGATIVE_EXIT_POSITIVE}
          >
            {variant === 'loader' && <Loader2Icon {...props} />}
            {variant === 'spinner' && <LoaderIcon {...props} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Loader, type LoaderProps };
