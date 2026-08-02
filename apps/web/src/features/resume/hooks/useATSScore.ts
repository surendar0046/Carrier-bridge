import { useState } from 'react';

export const useATSScore = () => {
  const [score, setScore] = useState(94);
  const [isScanning, setIsScanning] = useState(false);

  const scanResume = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScore(96);
      setIsScanning(false);
    }, 1500);
  };

  return { score, isScanning, scanResume };
};
