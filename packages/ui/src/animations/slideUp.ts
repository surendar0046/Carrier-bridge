export const slideUp = {
  initial:   { opacity: 0, y: 32 },
  animate:   { opacity: 1, y: 0 },
  exit:      { opacity: 0, y: 32 },
  transition:{ duration: 0.35, ease: [0.4, 0, 0.2, 1] },
};

export const slideDown = {
  initial:   { opacity: 0, y: -32 },
  animate:   { opacity: 1, y: 0 },
  exit:      { opacity: 0, y: -32 },
  transition:{ duration: 0.35, ease: [0.4, 0, 0.2, 1] },
};
