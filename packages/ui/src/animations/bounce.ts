export const bounce = {
  initial:   { scale: 0.8, opacity: 0 },
  animate:   { scale: 1, opacity: 1 },
  exit:      { scale: 0.8, opacity: 0 },
  transition:{ type: 'spring', stiffness: 400, damping: 20 },
};

export const pulse = {
  animate: {
    scale: [1, 1.04, 1],
    transition: { repeat: Infinity, duration: 2 },
  },
};
