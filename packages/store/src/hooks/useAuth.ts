import { useAuthStore } from '../slices/authSlice';

export const useAuth = () => {
  const store = useAuthStore();
  return {
    ...store,
  };
};
