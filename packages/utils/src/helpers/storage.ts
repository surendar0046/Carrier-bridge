export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
};
