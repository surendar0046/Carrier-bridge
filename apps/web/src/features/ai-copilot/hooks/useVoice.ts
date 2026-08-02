import { useState } from 'react';

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    setIsListening(true);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return { isListening, transcript, startListening, stopListening };
};
