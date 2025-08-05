import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2Icon } from 'lucide-react';

interface LoaderProps {
  loading?: boolean;
  className?: string;
}

const Loader = ({ loading = false, className = 'size-4' }: LoaderProps) => {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <Loader2Icon className={`${className} animate-spin`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Loader, type LoaderProps };
