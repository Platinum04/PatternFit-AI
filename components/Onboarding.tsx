import React from 'react';
import Header from './Header'; 
import { SparklesIcon } from './Icons';

interface OnboardingProps {
  onStart: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-premium-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg mx-auto bg-premium-50 rounded-3xl shadow-2xl shadow-premium-900/50 p-8 sm:p-14 text-center transform transition-all duration-500 scale-95 hover:scale-100 border border-premium-200">
        <div className="flex justify-center mb-4">
          <Header />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-serif text-premium-900 mt-6 tracking-wide leading-tight">
          Welcome to the Future of Tailoring
        </h1>
        
        <p className="text-premium-600 mt-6 leading-relaxed text-lg font-light">
          Experience the magic of AI-powered virtual try-on. Select your style, pick a fabric, and see a hyper-realistic preview of your custom-fitted traditional Nigerian attire in seconds.
        </p>

        <button
          onClick={onStart}
          className="mt-10 inline-flex items-center gap-3 w-full sm:w-auto justify-center px-10 py-4 bg-premium-900 text-white font-medium text-lg rounded-full shadow-lg shadow-premium-900/30 hover:bg-premium-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-900 transition-all duration-300 transform hover:-translate-y-1"
        >
          <SparklesIcon className="w-6 h-6" />
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Onboarding;