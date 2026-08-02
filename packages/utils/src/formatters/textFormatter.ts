export const truncateText = (str: string, maxLength: number = 100): string => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '...';
};

export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
};
