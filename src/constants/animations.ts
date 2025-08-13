export const ANIMATION_DURATION = 0.2;
export const ANIMATION_EASE = 'easeInOut';

export const animations = {
  config: {
    duration: ANIMATION_DURATION,
    ease: ANIMATION_EASE,
  },
  presets: {
    ENTER_POSITIVE_EXIT_NEGATIVE: {
      initial: {
        opacity: 0,
        y: 10,
      },
      animate: {
        opacity: 1,
        y: 0,
      },
      exit: {
        opacity: 0,
        y: -10,
      },
    },
    ENTER_NEGATIVE_EXIT_POSITIVE: {
      initial: {
        opacity: 0,
        y: -10,
      },
      animate: {
        opacity: 1,
        y: 0,
      },
      exit: {
        opacity: 0,
        y: 10,
      },
    },
    ENTER_NEGATIVE_EXIT_NEGATIVE: {
      initial: {
        opacity: 0,
        y: -10,
      },
      animate: {
        opacity: 1,
        y: 0,
      },
      exit: {
        opacity: 0,
        y: -10,
      },
    },
    ENTER_POSITIVE_EXIT_POSITIVE: {
      initial: {
        opacity: 0,
        y: 10,
      },
      animate: {
        opacity: 1,
        y: 0,
      },
      exit: {
        opacity: 0,
        y: 10,
      },
    },
  },
};
