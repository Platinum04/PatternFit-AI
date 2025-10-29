import React, { useCallback } from 'react';
import { Style, Fabric, Measurements, Gender, Design, SleeveLength, AITailorFeedback } from '../types';
import { RulerIcon, TailorIcon, RefreshIcon, DownloadIcon, ShareIcon, SaveIcon, WardrobeIcon, LightbulbIcon, FabricIcon, BodyOutlineIcon } from './Icons';

interface ResultsDisplayProps {
  originalImage: string;
  generatedImage: string;
  feedback: AITailorFeedback;
  measurements: Measurements;
  style: Style;
  fabric: Fabric;
  design: Design;
  sleeveLength: SleeveLength;
  gender: Gender;
  onReset: () => void;
  isSavedView?: boolean;
  onClose?: () => void;
}

// Helper to convert a data URL to a File object for the Web Share API
const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const match = arr[0].match(/:(.*?);/);
    if (!match) return null;
    const mime = match[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  originalImage, generatedImage, feedback, measurements, 
  style, fabric, design, gender, onReset, isSavedView = false, onClose,
  sleeveLength
}) => {
  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `patternfit-ai-${style.id}-${fabric.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage, style.id, fabric.id]);
  
  const handleShare = useCallback(async () => {
    const imageFile = dataURLtoFile(generatedImage, `PatternFit-AI-Design.png`);
    if (imageFile && navigator.share) {
        try {
            await navigator.share({
                title: 'PatternFit AI Design',
                text: `Check out this custom ${style.name} I designed with PatternFit AI!`,
                files: [imageFile],
            });
        } catch (error) {
            console.error('Error sharing:', error);
            // Fallback for browsers that canShare but fail, or for specific errors.
            alert('Could not share the image at this time.');
        }
    } else {
        alert('Sharing is not supported on this browser.');
    }
  }, [generatedImage, style.name]);

  const bustOrChestLabel = gender === 'female' ? 'Bust' : 'Chest';
  const measurementTitle = 'Your Estimated Measurements';

  const formatLabel = (key: string): string => {
    if (key === 'bust') return bustOrChestLabel;
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const MainActionButton = isSavedView ? (
    <button
        onClick={onClose}
        className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition transform hover:scale-105"
    >
        Close
    </button>
  ) : (
    <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition transform hover:scale-105"
    >
        <RefreshIcon className="w-5 h-5" />
        Start a New Fitting
    </button>
  );

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h3 className="text-center font-bold text-lg mb-2 text-slate-700">Original Photo</h3>
            <img src={originalImage} alt="Original user" className="rounded-xl shadow-md w-full object-contain bg-slate-100" />
        </div>
        <div>
            <h3 className="text-center font-bold text-lg mb-2 text-slate-700">Your Virtual Try-On</h3>
            <img src={generatedImage} alt="Virtual try-on" className="rounded-xl shadow-md w-full object-contain bg-slate-100" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2 mb-4">
            <TailorIcon className="w-6 h-6 text-blue-500" />
            AI Tailor's Assessment
          </h3>
          <p className="text-blue-900 leading-relaxed mb-4">
             {feedback.overallImpression}
          </p>
          <div className="space-y-3 border-t border-blue-200 pt-3">
              <div className="flex items-start">
                  <BodyOutlineIcon className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                      <h4 className="font-semibold text-blue-800">Fit Analysis</h4>
                      <p className="text-sm text-blue-900">{feedback.fitAnalysis}</p>
                  </div>
              </div>
               <div className="flex items-start">
                  <FabricIcon className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                      <h4 className="font-semibold text-blue-800">Fabric Choice</h4>
                      <p className="text-sm text-blue-900">{feedback.fabricChoice}</p>
                  </div>
              </div>
              <div className="flex items-start">
                  <LightbulbIcon className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                      <h4 className="font-semibold text-blue-800">Style Tip</h4>
                      <p className="text-sm text-blue-900">{feedback.styleTip}</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center items-center gap-4 flex-wrap">
        <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-8 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition transform hover:scale-105"
        >
          <ShareIcon className="w-5 h-5" />
          Share
        </button>
        
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-8 py-3 bg-slate-200 text-slate-800 font-semibold rounded-lg shadow-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition transform hover:scale-105"
        >
          <DownloadIcon className="w-5 h-5" />
          Save Image
        </button>
        {MainActionButton}
      </div>
    </div>
  );
};

export default ResultsDisplay;
