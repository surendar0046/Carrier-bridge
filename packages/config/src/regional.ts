export const regional = {
  defaultCurrency: 'INR',
  defaultLanguage: 'en',
  supportedRegions: ['IN', 'US', 'GB', 'AE', 'SG'],
  salaryFormats: {
    IN: { symbol: '₹', divisor: 100000, suffix: 'L' },
    US: { symbol: '$', divisor: 1000,   suffix: 'k' },
  },
  dateFormats: {
    IN: 'DD/MM/YYYY',
    US: 'MM/DD/YYYY',
  },
} as const;
