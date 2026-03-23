import React from 'react';
import { SparklesIcon, TailorIcon } from './Icons';

interface OnboardingProps {
  onStart: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-studio-900 flex items-center justify-center z-[5000] p-6 overflow-hidden">
      {/* Background CAD Grid Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="w-full max-w-xl mx-auto bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-10 sm:p-20 text-center relative border border-studio-200 animate-fade">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand p-5 rounded-[2rem] shadow-2xl">
          <TailorIcon className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-4 mb-10">
            <h2 className="text-[10px] font-black tracking-[0.5em] text-studio-400 uppercase">SYSTEM_INITIALIZATION</h2>
            <h1 className="text-4xl sm:text-5xl font-serif text-studio-900 tracking-tight leading-tight italic">
              PatternFit <span className="text-brand">AI</span>
            </h1>
            <p className="text-[10px] font-black tracking-[0.3em] text-studio-400 uppercase">Virtual Tailor Workspace v1.0</p>
        </div>
        
        <div className="w-12 h-1 bg-brand mx-auto rounded-full mb-10" />

        <p className="text-studio-600 leading-relaxed text-lg font-light font-serif">
          Experience the high-precision intersection of <span className="text-studio-900 font-bold">African Bespoke Craftsmanship</span> and <span className="text-studio-900 font-bold">Neural Design Rendering</span>. 
        </p>

        <div className="mt-14 space-y-6">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-4 w-full justify-center px-12 py-5 bg-studio-900 text-white font-black text-xs tracking-[0.3em] rounded-full shadow-2xl hover:bg-brand transition-all duration-500 transform hover:-translate-y-2 uppercase group"
            >
              <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Initialize Workspace
            </button>
            <p className="text-[9px] text-studio-400 font-mono tracking-widest uppercase">READY_FOR_DEPLOYMENT</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;