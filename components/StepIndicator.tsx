import React from 'react';
import { AppStep } from '../types';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: AppStep.SELECTION, label: 'CURATION' },
    { id: AppStep.PROCESSING, label: 'COMPUTING' },
    { id: AppStep.RESULTS, label: 'STUDIO_RENDER' },
  ];

  return (
    <div className="w-full flex justify-center mb-16 px-4">
      <div className="flex items-center gap-6 sm:gap-16 w-full max-w-3xl justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = index < steps.findIndex(s => s.id === currentStep) && currentStep !== AppStep.PROCESSING;

          return (
            <div key={step.id} className="flex flex-col items-center gap-4 relative flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-1000 w-full ${
                isActive ? 'bg-brand shadow-lg shadow-brand/40 scale-y-125' : isCompleted ? 'bg-studio-900 opacity-100' : 'bg-studio-200'
              }`} />
              <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black tracking-[0.3em] uppercase transition-all duration-500 whitespace-nowrap ${
                    isActive ? 'text-studio-900 translate-y-1' : 'text-studio-400'
                  }`}>{step.label}</span>
                  {isActive && <div className="w-1 h-3 bg-brand animate-pulse scale-x-150" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
