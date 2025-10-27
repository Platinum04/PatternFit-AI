import React, { useCallback } from 'react';
import { Style, Fabric, Measurements, Gender } from '../types';
import { RulerIcon, TailorIcon, RefreshIcon, DownloadIcon } from './Icons';

interface ResultsDisplayProps {
  originalImage: string;
  generatedImage: string;
  feedback: string;
  measurements: Measurements;
  style: Style;
  fabric: Fabric;
  gender: Gender;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  originalImage, generatedImage, feedback, measurements, 
  style, fabric, gender, onReset 
}) => {
  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `patternfit-ai-${style.id}-${fabric.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage, style.id, fabric.id]);
  
  const bustOrChestLabel = gender === 'female' ? 'Bust' : 'Chest';

  const measurementTitle = 'Your Estimated Measurements';

  // Helper to format measurement keys into readable labels
  const formatLabel = (key: string): string => {
    if (key === 'bust') return bustOrChestLabel;
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="mt-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images */}
        <div>
            <h3 className="text-center font-bold text-lg mb-2 text-slate-700">Original Photo</h3>
            <img src={originalImage} alt="Original user" className="rounded-xl shadow-md w-full object-contain" />
        </div>
        <div>
            <h3 className="text-center font-bold text-lg mb-2 text-slate-700">Your Virtual Try-On</h3>
            <img src={generatedImage} alt="Virtual try-on" className="rounded-xl shadow-md w-full object-contain" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Measurements */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
            <RulerIcon className="w-6 h-6 text-blue-500" />
            {measurementTitle}
          </h3>
          <ul className="space-y-2 text-lg">
             {Object.entries(measurements).map(([key, value]) => {
                if (value === undefined || value === null) return null;
                return (
                   <li key={key} className="flex justify-between">
                    <span className="font-semibold text-slate-600">{formatLabel(key)}:</span>
                    <span className="font-mono text-slate-800">{value} inches</span>
                  </li>
                );
             })}
          </ul>
        </div>
        
        {/* Tailor Feedback */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2 mb-4">
            <TailorIcon className="w-6 h-6 text-blue-500" />
            AI Tailor's Assessment
          </h3>
          <p className="text-blue-900 leading-relaxed">
            For the <span className="font-semibold">{fabric.name} {style.name}</span>, {feedback}
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center items-center gap-4 flex-wrap">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-8 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition transform hover:scale-105"
        >
          <DownloadIcon className="w-5 h-5" />
          Save Image
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition transform hover:scale-105"
        >
          <RefreshIcon className="w-5 h-5" />
          Start a New Fitting
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
