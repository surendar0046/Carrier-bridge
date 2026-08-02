export const fadeIn = {
  initial:   { opacity: 0 },
  animate:   { opacity: 1 },
  exit:      { opacity: 0 },
  transition:{ duration: 0.2 },
};

export const fadeInUp = {
  initial:   { opacity: 0, y: 16 },
  animate:   { opacity: 1, y: 0 },
  exit:      { opacity: 0, y: -16 },
  transition:{ duration: 0.3, ease: 'easeOut' },
};
