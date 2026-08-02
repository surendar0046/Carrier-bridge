import { useUserStore } from '../slices/userSlice';

export const useUser = () => {
  const store = useUserStore();
  return {
    ...store,
  };
};
