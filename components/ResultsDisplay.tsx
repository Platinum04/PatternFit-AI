import React, { useCallback } from 'react';
import { Style, Fabric, Measurements, Gender, Design, SleeveLength, AITailorFeedback, StylistComment } from '../types';
import { RulerIcon, TailorIcon, RefreshIcon, DownloadIcon, ShareIcon, SaveIcon, WardrobeIcon, LightbulbIcon, FabricIcon, BodyOutlineIcon, SparklesIcon } from './Icons';
import { generateTailorSpecification } from '../services/pdfService';

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
  isSavedView: boolean;
  onClose: () => void;
  stylistComments?: StylistComment[];
}

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
  sleeveLength,
  stylistComments
}) => {
  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `patternfit-studio-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage]);

  const handleShare = useCallback(async () => {
    const imageFile = dataURLtoFile(generatedImage, `PatternFit-Studio-Output.png`);
    if (imageFile && navigator.share) {
        try {
            await navigator.share({
                title: 'PatternFit AI Studio Render',
                text: `View my custom design specs!`,
                files: [imageFile],
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        handleDownload();
    }
  }, [generatedImage, handleDownload]);

  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  
  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
        await generateTailorSpecification(
            originalImage,
            generatedImage,
            measurements,
            style,
            fabric,
            design,
            sleeveLength,
            gender,
            feedback
        );
    } catch (error) {
        console.error("PDF generation failed:", error);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="animate-fade grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left Column: Visual Canvas */}
      <div className="lg:col-span-7 space-y-8">
        <div className="grid grid-cols-2 gap-4">
             <div className="relative group rounded-3xl overflow-hidden border border-studio-200 bg-studio-50 shadow-2xl">
                <img src={originalImage} alt="Input" className="w-full aspect-[3/4] object-cover" />
                <div className="absolute top-4 left-4 bg-studio-900/80 backdrop-blur px-3 py-1 text-[10px] text-white font-black tracking-widest uppercase">INPUT_SOURCE</div>
             </div>
             <div className="relative group rounded-3xl overflow-hidden border border-studio-200 bg-studio-50 shadow-2xl">
                <img src={generatedImage} alt="Studio Render" className="w-full aspect-[3/4] object-cover" />
                <div className="absolute top-4 left-4 bg-brand px-3 py-1 text-[10px] text-white font-black tracking-widest uppercase">STUDIO_RENDER</div>
             </div>
        </div>

        <div className="p-8 bg-studio-50 rounded-4xl border border-studio-200 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
                <button onClick={handleDownload} className="flex flex-col items-center gap-2 group">
                    <div className="p-4 bg-studio-900 text-white rounded-2xl group-hover:bg-brand transition-all shadow-lg group-active:scale-90">
                        <DownloadIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black text-studio-400 tracking-widest uppercase">GEN_EXPORT</span>
                </button>
                <button onClick={handleShare} className="flex flex-col items-center gap-2 group">
                    <div className="p-4 bg-white text-studio-900 border border-studio-200 rounded-2xl group-hover:bg-studio-100 transition-all shadow-sm group-active:scale-90">
                        <ShareIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black text-studio-400 tracking-widest uppercase">HUB_SHARE</span>
                </button>
            </div>

            <button
                onClick={handleGeneratePdf}
                disabled={isGeneratingPdf}
                className="flex items-center gap-3 px-8 py-4 bg-brand text-white rounded-full font-black text-xs tracking-widest shadow-2xl shadow-brand/20 hover:bg-studio-900 transition-all uppercase group"
            >
                <TailorIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                {isGeneratingPdf ? 'EXPORTING...' : 'DOWNLOAD SPEC SHEET'}
            </button>
        </div>
      </div>

      {/* Right Column: Attribute Panels */}
      <div className="lg:col-span-5 space-y-6">
        <div className="p-8 bg-white border border-studio-200 rounded-4xl shadow-xl">
           <div className="flex items-center gap-3 mb-8 border-b border-studio-100 pb-4">
               <RulerIcon className="w-5 h-5 text-brand" />
               <h3 className="text-[11px] font-black text-studio-500 tracking-[0.3em] uppercase">SYSTEM_SPECIFICATIONS</h3>
           </div>
           
           <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                <div>
                   <p className="text-[9px] font-black text-studio-400 tracking-widest uppercase mb-1">Style</p>
                   <p className="text-sm font-bold text-studio-900 truncate uppercase">{style.name}</p>
                </div>
                <div>
                   <p className="text-[9px] font-black text-studio-400 tracking-widest uppercase mb-1">Textile</p>
                   <p className="text-sm font-bold text-studio-900 truncate uppercase">{fabric.name}</p>
                </div>
                <div>
                   <p className="text-[9px] font-black text-studio-400 tracking-widest uppercase mb-1">Gender</p>
                   <p className="text-sm font-bold text-studio-900 uppercase">{gender}</p>
                </div>
                <div>
                   <p className="text-[9px] font-black text-studio-400 tracking-widest uppercase mb-1">Variation</p>
                   <p className="text-sm font-bold text-studio-900 uppercase">{sleeveLength}</p>
                </div>
           </div>

           <div className="mt-10 p-6 bg-studio-100 rounded-2xl border border-studio-200">
               <h4 className="text-[10px] font-black text-studio-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                   <BodyOutlineIcon className="w-4 h-4" /> METRIC_ANALYSIS
               </h4>
               <div className="grid grid-cols-2 gap-4">
                    {Object.entries(measurements).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-studio-200 last:border-0 grow">
                            <span className="text-[10px] text-studio-500 uppercase font-bold tracking-tighter">{key}</span>
                            <span className="text-xs font-mono font-black text-studio-900">{val}"</span>
                        </div>
                    ))}
               </div>
           </div>
        </div>

        <div className="p-8 bg-brand/5 border border-brand/10 rounded-4xl">
            <div className="flex items-start gap-4">
                <div className="bg-brand text-white p-2 rounded-xl">
                    <LightbulbIcon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-brand tracking-widest uppercase mb-2">STUDIO_INSIGHT</h4>
                    <p className="text-sm font-serif italic text-studio-800 leading-relaxed">"{feedback.styleTip}"</p>
                </div>
            </div>
        </div>

        {stylistComments && stylistComments.length > 0 && (
            <div className="space-y-4">
                <h4 className="text-[10px] font-black text-studio-400 tracking-widest uppercase ml-2">EXPERT FEEDBACK</h4>
                {stylistComments.map(comment => (
                    <div key={comment.id} className="p-8 bg-studio-900 text-white rounded-4xl shadow-2xl animate-fade">
                        <p className="text-xs font-light leading-relaxed opacity-90">{comment.content}</p>
                        <div className="mt-6 flex items-center justify-between border-t border-studio-700 pt-4">
                            <span className="text-[10px] font-black tracking-widest text-brand">{comment.author.toUpperCase()}</span>
                            <SparklesIcon className="w-4 h-4 text-brand" />
                        </div>
                    </div>
                ))}
            </div>
        )}

        <div className="pt-6">
            <button 
                onClick={onReset}
                className="w-full py-4 bg-white border-2 border-studio-900 text-studio-900 rounded-full font-black text-[10px] tracking-[0.3em] uppercase hover:bg-studio-900 hover:text-white transition-all shadow-xl"
            >
                START_NEW_SESSION
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
