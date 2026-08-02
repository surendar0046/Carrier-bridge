import { useState } from 'react';

export const useJobSimulation = () => {
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'running' | 'completed'>('idle');

  const startSimulation = () => setSimulationStatus('running');
  const completeSimulation = () => setSimulationStatus('completed');

  return { simulationStatus, startSimulation, completeSimulation };
};
