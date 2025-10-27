
import React from 'react';
import { AppStep } from '../types';
import { CheckIcon } from './Icons';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const Step: React.FC<{ stepNumber: number; label: string; isActive: boolean; isCompleted: boolean }> = ({ stepNumber, label, isActive, isCompleted }) => {
  const getStepClasses = () => {
    if (isActive) {
      return 'border-blue-500 bg-blue-50 text-blue-600';
    }
    if (isCompleted) {
      return 'border-green-400 bg-green-50 text-green-700';
    }
    return 'border-slate-200 bg-slate-50 text-slate-500';
  };

  const getCircleClasses = () => {
    if (isActive) {
      return 'bg-blue-500 text-white';
    }
    if (isCompleted) {
      return 'bg-green-500 text-white';
    }
    return 'bg-slate-200 text-slate-600';
  };

  return (
    <div className={`flex-1 flex items-center p-3 rounded-lg border-2 transition-all duration-300 ${getStepClasses()}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 transition-colors duration-300 ${getCircleClasses()}`}>
        {isCompleted ? <CheckIcon className="w-5 h-5" /> : stepNumber}
      </div>
      <span className="font-semibold">{label}</span>
    </div>
  );
};

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Select & Calibrate' },
    { number: 2, label: 'AI Processing' },
    { number: 3, label: 'View Results' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {steps.map((step) => (
        <Step
          key={step.number}
          stepNumber={step.number}
          label={step.label}
          isActive={currentStep === step.number}
          isCompleted={currentStep > step.number}
        />
      ))}
    </div>
  );
};

export default StepIndicator;
