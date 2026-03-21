
import React from 'react';
import { AppStep } from '../types';
import { CheckIcon } from './Icons';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const Step: React.FC<{ stepNumber: number; label: string; isActive: boolean; isCompleted: boolean }> = ({ stepNumber, label, isActive, isCompleted }) => {
  const getStepClasses = () => {
    if (isActive) {
      return 'border-premium-900 bg-premium-50 text-premium-900';
    }
    if (isCompleted) {
      return 'border-green-400 bg-green-50 text-green-700';
    }
    return 'border-premium-200 bg-premium-50 text-premium-500';
  };

  const getCircleClasses = () => {
    if (isActive) {
      return 'bg-premium-900 text-white';
    }
    if (isCompleted) {
      return 'bg-green-500 text-white';
    }
    return 'bg-premium-200 text-premium-600';
  };

  return (
    <div className={`flex-1 flex items-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 ${getStepClasses()}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm mr-4 transition-colors duration-300 ${getCircleClasses()}`}>
        {isCompleted ? <CheckIcon className="w-5 h-5" /> : stepNumber}
      </div>
      <span className="font-serif text-lg tracking-wide">{label}</span>
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
