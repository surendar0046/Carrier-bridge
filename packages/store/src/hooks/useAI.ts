import { useAIStore } from '../slices/aiSlice';

export const useAI = () => {
  const store = useAIStore();
  return {
    ...store,
  };
};
