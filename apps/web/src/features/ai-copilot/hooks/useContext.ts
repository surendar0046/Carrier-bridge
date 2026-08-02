import { usePathname } from 'next/navigation';

export const useContext = () => {
  const pathname = usePathname();
  return {
    currentPath: pathname,
    activeSection: pathname?.split('/')[1] || 'dashboard',
  };
};
