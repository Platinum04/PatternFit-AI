import React, { useState, useEffect, useCallback } from 'react';
import { AppStep, Style, Fabric, Gender, Measurements, SavedFit, Design, SleeveLength, AITailorFeedback } from './types';
import { calculateMeasurements } from './services/measurementService';
import { generateVirtualTryOn, getAITailorFeedback } from './services/geminiService';
import { getSavedFits, saveFit, deleteFit } from './services/wardrobeService';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import PatternSelector from './components/PatternSelector';
import ImageUploader from './components/ImageUploader';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingOverlay from './components/LoadingOverlay';
import Onboarding from './components/Onboarding';
import { SparklesIcon } from './components/Icons';
import CameraCapture from './components/CameraCapture';
import Wardrobe from './components/Wardrobe';
import AboutModal from './components/AboutModal';
import { FEMALE_FABRICS, MALE_FABRICS } from './constants';
import { compressImageBase64 } from './services/imageService';

const fetchImageAsBase64 = async (url: string): Promise<{ base64: string, mimeType: string }> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image from ${url}`);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const base64String = (reader.result as string).split(',')[1];
        resolve({ base64: base64String, mimeType: blob.type });
      } else {
        reject(new Error('Failed to read blob as data URL.'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const App: React.FC = () => {
  console.log('App component is rendering...');
  const [appStep, setAppStep] = useState<AppStep>(AppStep.SELECTION);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
  
  // Selections
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [userImage, setUserImage] = useState<{ base64: string; mimeType: string; } | null>(null);
  const [gender, setGender] = useState<Gender>('female');
  const [sleeveLength, setSleeveLength] = useState<SleeveLength>('short');
  const [height, setHeight] = useState<string>('');
  
  // Results
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [generatedImageBase64, setGeneratedImageBase64] = useState<string | null>(null);
  const [generatedImageMimeType, setGeneratedImageMimeType] = useState<string>('image/png');
  const [tailorFeedback, setTailorFeedback] = useState<AITailorFeedback | null>(null);
  
  // App State
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [savedFits, setSavedFits] = useState<SavedFit[]>([]);
  const [viewingSavedFit, setViewingSavedFit] = useState<boolean>(false);
  
  useEffect(() => {
    const prefetchFabrics = async () => {
      const allDefaultFabrics = [...FEMALE_FABRICS, ...MALE_FABRICS];
      for (const fabric of allDefaultFabrics) {
        if (!fabric.base64) {
          try {
            const { base64, mimeType } = await fetchImageAsBase64(fabric.imageUrl);
            fabric.base64 = base64;
            fabric.mimeType = mimeType;
          } catch (error) {
            console.error(`Failed to pre-fetch fabric ${fabric.name}:`, error);
          }
        }
      }
    };
    prefetchFabrics();
  }, []);

  useEffect(() => {
    const onboardingStatus = localStorage.getItem('patternfit-onboarded');
    if (onboardingStatus === 'true') {
      setHasOnboarded(true);
    }
    setSavedFits(getSavedFits());
  }, []);

  const handleOnboarding = () => {
    localStorage.setItem('patternfit-onboarded', 'true');
    setHasOnboarded(true);
  };

  const handleImageUpload = useCallback((file: File, base64: string, mimeType: string) => {
    setUserImage({ base64, mimeType });
  }, []);

  const handleFabricSelect = (fabric: Fabric) => {
    if (!fabric.base64) {
      console.error("Selected fabric is missing base64 data.");
      return;
    }
    setSelectedFabric(fabric);
  };
  
  const handleGenerateFit = async () => {
    const heightInFeet = parseFloat(height) || 0;
    const totalInches = heightInFeet * 12;

    if (totalInches <= 0) {
      alert('Please enter a valid height to proceed.');
      return;
    }

    if (!selectedStyle || !selectedFabric || !userImage || !selectedDesign) return;

    setAppStep(AppStep.PROCESSING);
    setLoadingMessage('Estimating your measurements...');
    
    const calculatedMeasurements = await calculateMeasurements(totalInches, gender);
    setMeasurements(calculatedMeasurements);
    
    setLoadingMessage('Warming up the AI tailor...');
    try {
      const feedbackPromise = getAITailorFeedback(calculatedMeasurements, selectedStyle, selectedFabric, selectedDesign, gender, sleeveLength);
      
      setLoadingMessage('Generating your virtual try-on...');
      const generatedImagePromise = generateVirtualTryOn(userImage, selectedStyle, selectedFabric, selectedDesign, sleeveLength);
      
      const [feedback, generatedImage] = await Promise.all([feedbackPromise, generatedImagePromise]);
      
      setTailorFeedback(feedback);
      setGeneratedImageBase64(generatedImage);
      setGeneratedImageMimeType('image/png'); // Image from Gemini is PNG

      setLoadingMessage('Saving to your wardrobe...');
      
      // Compress images before saving to prevent quota issues
      const [compressedUserImageBase64, compressedGeneratedImageBase64] = await Promise.all([
        compressImageBase64(userImage.base64, userImage.mimeType),
        compressImageBase64(generatedImage, 'image/png')
      ]);

      // Strip large base64 data from fabric object before saving
      const fabricToSave: Fabric = {
          id: selectedFabric.id,
          name: selectedFabric.name,
          imageUrl: selectedFabric.imageUrl
      };

      const newFit: SavedFit = {
        id: `fit_${Date.now()}`,
        style: selectedStyle,
        fabric: fabricToSave,
        design: selectedDesign,
        sleeveLength: sleeveLength,
        measurements: calculatedMeasurements,
        feedback: feedback,
        userImage: {
          base64: compressedUserImageBase64,
          mimeType: 'image/jpeg', // Compressed to JPEG
        },
        generatedImageBase64: compressedGeneratedImageBase64, // Compressed to JPEG
        createdAt: new Date().toISOString(),
      };
      saveFit(newFit);
      setSavedFits(getSavedFits());

      setAppStep(AppStep.RESULTS);
    } catch (error) {
      console.error('Error during AI generation:', error);
      alert(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
      handleReset();
    } finally {
      setLoadingMessage(null);
    }
  };

  const handleReset = useCallback(() => {
    setAppStep(AppStep.SELECTION);
    setSelectedStyle(null);
    setSelectedFabric(null);
    setSelectedDesign(null);
    setUserImage(null);
    setMeasurements(null);
    setGeneratedImageBase64(null);
    setGeneratedImageMimeType('image/png'); // Reset to default
    setTailorFeedback(null);
    setGender('female');
    setSleeveLength('short');
    setHeight('');
    setViewingSavedFit(false);
  }, []);
  
  const handleDeleteFit = (fitId: string) => {
    deleteFit(fitId);
    setSavedFits(getSavedFits());
  };
  
  const handleViewFitFromWardrobe = (fit: SavedFit) => {
    setSelectedStyle(fit.style);
    setSelectedFabric(fit.fabric);
    setSelectedDesign(fit.design);
    setSleeveLength(fit.sleeveLength);
    setUserImage(fit.userImage); // This will have compressed base64 and jpeg mimeType
    setMeasurements(fit.measurements);
    setTailorFeedback(fit.feedback);
    setGeneratedImageBase64(fit.generatedImageBase64);
    setGeneratedImageMimeType('image/jpeg'); // Saved images are always compressed to jpeg
    setGender(fit.style.gender);
    setAppStep(AppStep.RESULTS);
    setIsWardrobeOpen(false);
    setViewingSavedFit(true);
  };

  const heightForValidation = parseFloat(height) || 0;
  const isGenerateButtonDisabled = !selectedStyle || !selectedFabric || !userImage || !selectedDesign || heightForValidation <= 0;
  
  const allOtherSelectionsMade = !!(selectedStyle && selectedFabric && userImage && selectedDesign);
  const isHeightMissing = heightForValidation <= 0;
  const highlightHeight = allOtherSelectionsMade && isHeightMissing;

  if (!hasOnboarded) {
    return <Onboarding onStart={handleOnboarding} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {loadingMessage && <LoadingOverlay message={loadingMessage} />}
      {isCameraOpen && <CameraCapture onCapture={handleImageUpload} onClose={() => setIsCameraOpen(false)} />}
      {isWardrobeOpen && <Wardrobe fits={savedFits} onClose={() => setIsWardrobeOpen(false)} onSelectFit={handleViewFitFromWardrobe} onDeleteFit={handleDeleteFit} />}
      {isAboutModalOpen && <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />}
      
      <Header onWardrobeClick={() => setIsWardrobeOpen(true)} onAboutClick={() => setIsAboutModalOpen(true)} />
      
      <main className="w-full max-w-4xl mt-8">
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-premium-900/5 border border-premium-100">
          <StepIndicator currentStep={appStep} />

          {appStep === AppStep.SELECTION && (
            <div className="mt-10">
              <PatternSelector
                gender={gender}
                onGenderChange={setGender}
                height={height}
                onHeightChange={setHeight}
                selectedStyle={selectedStyle}
                onStyleSelect={setSelectedStyle}
                sleeveLength={sleeveLength}
                onSleeveLengthChange={setSleeveLength}
                selectedDesign={selectedDesign}
                onDesignSelect={setSelectedDesign}
                selectedFabric={selectedFabric}
                onFabricSelect={handleFabricSelect}
                highlightHeight={highlightHeight}
                disabled={appStep !== AppStep.SELECTION}
              />
              <div className="mt-10 border-t border-premium-100 pt-8">
                <h3 className="text-xl font-serif font-medium text-premium-900 mb-4 tracking-wide">7. Upload Your Photo</h3>
                <ImageUploader onUpload={handleImageUpload} onTakePhoto={() => setIsCameraOpen(true)} disabled={appStep !== AppStep.SELECTION} />
              </div>

              <div className="mt-12 text-center">
                <button
                  onClick={handleGenerateFit}
                  disabled={isGenerateButtonDisabled}
                  className={`inline-flex items-center gap-3 px-12 py-4 font-medium text-lg rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-900
                    ${isGenerateButtonDisabled
                      ? 'bg-premium-100 text-premium-400 cursor-not-allowed shadow-none'
                      : 'bg-premium-900 text-white hover:bg-premium-800 hover:shadow-premium-900/30'
                    }`}
                >
                  <SparklesIcon className="w-6 h-6" />
                  Generate My Fitting
                </button>
              </div>
            </div>
          )}

          {appStep === AppStep.RESULTS && userImage && generatedImageBase64 && tailorFeedback && measurements && selectedStyle && selectedFabric && selectedDesign && (
             <div className="mt-8">
               <ResultsDisplay
                originalImage={`data:${userImage.mimeType};base64,${userImage.base64}`}
                generatedImage={`data:${generatedImageMimeType};base64,${generatedImageBase64}`}
                feedback={tailorFeedback}
                measurements={measurements}
                style={selectedStyle}
                fabric={selectedFabric}
                design={selectedDesign}
                sleeveLength={sleeveLength}
                gender={gender}
                onReset={handleReset}
                isSavedView={viewingSavedFit}
                onClose={handleReset}
              />
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
