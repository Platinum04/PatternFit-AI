import React from 'react';
import Header from './Header'; 
import { SparklesIcon } from './Icons';

interface OnboardingProps {
  onStart: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="flex justify-center mb-6">
          <Header />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-4">
          Welcome to the Future of Tailoring
        </h1>
        
        <p className="text-slate-600 mt-4 leading-relaxed">
          Experience the magic of AI-powered virtual try-on. Select your style, pick a fabric, and see a hyper-realistic preview of your custom-fitted traditional Nigerian attire in seconds.
        </p>

        <button
          onClick={onStart}
          className="mt-8 inline-flex items-center gap-3 w-full sm:w-auto justify-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
        >
          <SparklesIcon className="w-6 h-6" />
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Onboarding;