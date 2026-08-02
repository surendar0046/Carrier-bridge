'use client';
import React, { useState } from 'react';

export const JobSimulation: React.FC = () => {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-slate-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-white">Interactive Job Day-in-the-Life Simulation</h3>
        <span className="text-xs font-bold text-blue-400">Step {step} of 3</span>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            <strong>Scenario 1:</strong> The production API gateway latency spiked to 450ms. How would you diagnose the microservices bottleneck?
          </p>
          <div className="space-y-2">
            <button onClick={() => setStep(2)} className="w-full text-left p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs">
              A. Inspect distributed tracing telemetry via OpenTelemetry & Redis cache metrics.
            </button>
            <button onClick={() => setStep(2)} className="w-full text-left p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs">
              B. Restart all Kubernetes pods immediately without logging.
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            <strong>Scenario 2:</strong> You discovered an unindexed database query in the user service causing high CPU usage.
          </p>
          <div className="space-y-2">
            <button onClick={() => { setStep(3); setCompleted(true); }} className="w-full text-left p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs">
              Add a composite index on (tenant_id, created_at) and configure read replicas.
            </button>
          </div>
        </div>
      )}

      {completed && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/40 rounded-2xl text-xs text-emerald-400">
          ✓ Simulation complete! Score: 98/100 (Architect Level)
        </div>
      )}
    </div>
  );
};
