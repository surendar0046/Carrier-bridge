import { useState } from 'react';

export const useVideoCall = () => {
  const [isInCall, setIsInCall] = useState(false);
  const startCall = () => setIsInCall(true);
  const endCall = () => setIsInCall(false);

  return { isInCall, startCall, endCall };
};
