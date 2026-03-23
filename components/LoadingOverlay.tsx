import React from 'react';
import { TailorIcon } from './Icons';

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-studio-900/95 backdrop-blur-2xl animate-fade">
    <div className="text-center space-y-12 p-8 max-w-lg w-full">
      <div className="relative inline-block">
        <div className="w-32 h-32 border-b-2 border-brand rounded-full animate-spin duration-1000 shadow-[0_0_30px_rgba(99,102,241,0.2)]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <TailorIcon className="w-10 h-10 text-brand animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-6">
          <div className="flex flex-col items-center gap-1">
              <h2 className="text-white text-[10px] font-black tracking-[0.5em] uppercase">SYSTEM_PROCESSING</h2>
              <div className="w-24 h-[1px] bg-studio-800" />
          </div>
          <p className="text-studio-300 font-serif italic text-2xl h-16 leading-tight flex items-center justify-center">
            {message || 'Computing Studio Geometry...'}
          </p>
      </div>

      <div className="w-full bg-studio-800 h-1 rounded-full overflow-hidden max-w-[200px] mx-auto">
          <div className="bg-brand h-full w-[100%] animate-[loading_2s_infinite]"></div>
      </div>
      
      <p className="text-[9px] text-studio-500 font-mono tracking-widest uppercase mt-4">RECALIBRATING PATTERN VECTORS...</p>
      
      <style>{`
          @keyframes loading {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
          }
      `}</style>
    </div>
  </div>
);

export default LoadingOverlay;
