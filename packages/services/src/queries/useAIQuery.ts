import { useState } from 'react';
import { aiService } from '../modules/aiService';

export const useAIQuery = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async (prompt: string, context?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await aiService.askCopilot(prompt, context);
      setResponse(res.response || JSON.stringify(res));
      setIsLoading(false);
      return res;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return { response, isLoading, error, ask };
};
