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
        className="inline-flex items-center gap-2 px-8 py-3 bg-premium-900 text-white font-medium rounded-full shadow-lg hover:bg-premium-800 hover:shadow-premium-900/30 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-900"
    >
        Close
    </button>
  ) : (
    <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-8 py-3 bg-premium-900 text-white font-medium rounded-full shadow-lg hover:bg-premium-800 hover:shadow-premium-900/30 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-900"
    >
        <RefreshIcon className="w-5 h-5" />
        Start a New Fitting
    </button>
  );

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <h3 className="text-center font-serif text-2xl mb-4 text-premium-900 tracking-wide">Original Photo</h3>
            <img src={originalImage} alt="Original user" className="rounded-3xl shadow-xl shadow-premium-900/10 w-full object-contain bg-premium-50 border border-premium-100" />
        </div>
        <div>
            <h3 className="text-center font-serif text-2xl mb-4 text-premium-900 tracking-wide">Your Virtual Try-On</h3>
            <img src={generatedImage} alt="Virtual try-on" className="rounded-3xl shadow-xl shadow-premium-900/10 w-full object-contain bg-premium-50 border border-premium-100" />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-premium-50/50 p-8 rounded-3xl border border-premium-200 shadow-sm">
          <h3 className="text-2xl font-serif text-premium-900 flex items-center gap-3 mb-6 tracking-wide">
            <RulerIcon className="w-6 h-6 text-accent" />
            {measurementTitle}
          </h3>
          <ul className="space-y-4 text-lg">
             {Object.entries(measurements).map(([key, value]) => {
                if (value === undefined || value === null) return null;
                return (
                   <li key={key} className="flex justify-between items-center border-b border-premium-200/50 pb-2 last:border-0 last:pb-0">
                    <span className="font-medium text-premium-600">{formatLabel(key)}:</span>
                    <span className="font-mono text-premium-900 font-semibold">{value} inches</span>
                  </li>
                );
             })}
          </ul>
        </div>
        
        <div className="bg-premium-50/50 p-8 rounded-3xl border border-premium-200 shadow-sm">
          <h3 className="text-2xl font-serif text-premium-900 flex items-center gap-3 mb-6 tracking-wide">
            <TailorIcon className="w-6 h-6 text-accent" />
            AI Tailor's Assessment
          </h3>
          <p className="text-premium-950 leading-relaxed mb-4">
             {feedback.overallImpression}
          </p>
          <div className="space-y-3 border-t border-premium-200 pt-3">
              <div className="flex items-start">
                  <BodyOutlineIcon className="w-5 h-5 text-premium-900 mt-1 mr-3 flex-shrink-0" />
                  <div>
                      <h4 className="font-semibold text-premium-900">Fit Analysis</h4>
                      <p className="text-sm text-premium-950">{feedback.fitAnalysis}</p>
                  </div>
              </div>
               <div className="flex items-start">
                  <FabricIcon className="w-5 h-5 text-premium-900 mt-1 mr-3 flex-shrink-0" />
                  <div>
                      <h4 className="font-semibold text-premium-900">Fabric Choice</h4>
                      <p className="text-sm text-premium-950">{feedback.fabricChoice}</p>
                  </div>
              </div>
              <div className="flex items-start">
                  <LightbulbIcon className="w-5 h-5 text-premium-900 mt-1 mr-3 flex-shrink-0" />
                  <div>
                      <h4 className="font-semibold text-premium-900">Style Tip</h4>
                      <p className="text-sm text-premium-950">{feedback.styleTip}</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 flex justify-center items-center gap-4 flex-wrap pb-8">
        <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-8 py-3 bg-premium-100 text-premium-800 font-medium rounded-full shadow-md hover:bg-premium-200 transition-all duration-300 transform hover:-translate-y-1 border border-premium-200"
        >
          <ShareIcon className="w-5 h-5 opacity-70" />
          Share
        </button>
        
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-8 py-3 bg-premium-100 text-premium-800 font-medium rounded-full shadow-md hover:bg-premium-200 transition-all duration-300 transform hover:-translate-y-1 border border-premium-200"
        >
          <DownloadIcon className="w-5 h-5 opacity-70" />
          Save Image
        </button>
        {MainActionButton}
      </div>
    </div>
  );
};

export default ResultsDisplay;
