import React, { useState, useCallback } from 'react';
import { Fabric, Style, Gender, Measurements, AppStep } from './types';
import { calculateMeasurements } from './services/measurementService';
import { generateVTOImage, generateTailorFeedback } from './services/geminiService';
import { saveFitData } from './services/firestoreService';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import GarmentSelector from './components/PatternSelector';
import ImageUploader from './components/ImageUploader';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingOverlay from './components/LoadingOverlay';
import CameraCapture from './components/CameraCapture';
import Onboarding from './components/Onboarding';

const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [appStep, setAppStep] = useState<AppStep>(AppStep.SELECTION);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [height, setHeight] = useState<number | ''>('');
  const [userImage, setUserImage] = useState<{ file: File; base64: string; mimeType: string; } | null>(null);
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [vtoImage, setVtoImage] = useState<string | null>(null);
  const [tailorFeedback, setTailorFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const handleReset = () => {
    setAppStep(AppStep.SELECTION);
    setSelectedGender(null);
    setSelectedStyle(null);
    setSelectedFabric(null);
    setHeight('');
    setUserImage(null);
    setMeasurements(null);
    setVtoImage(null);
    setTailorFeedback(null);
    setIsLoading(false);
    setError(null);
    setShowCamera(false);
  };
  
  const handleGenderSelect = (gender: Gender) => {
      setSelectedGender(gender);
      setSelectedStyle(null);
      setSelectedFabric(null);
  };

  const processImage = useCallback(async (file: File, base64: string, mimeType: string) => {
    if (!selectedStyle || !selectedFabric || !height || !selectedGender) {
      setError("Please complete all selections (style, fabric, height) first.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setUserImage({ file, base64, mimeType });
    setAppStep(AppStep.PROCESSING);

    try {
      setLoadingMessage('Taking your measurements...');
      const calculatedMeasurements = await calculateMeasurements(height, selectedGender);
      setMeasurements(calculatedMeasurements);

      setLoadingMessage('Our AI tailor is crafting your fit...');
      const [generatedImage, feedback] = await Promise.all([
        generateVTOImage(base64, mimeType, selectedStyle, selectedFabric, calculatedMeasurements, selectedGender),
        generateTailorFeedback(selectedStyle, selectedFabric, calculatedMeasurements, selectedGender)
      ]);
      
      setVtoImage(generatedImage);
      setTailorFeedback(feedback);

      setLoadingMessage('Saving your results...');
      await saveFitData({ style: selectedStyle, fabric: selectedFabric, measurements: calculatedMeasurements });

      setAppStep(AppStep.RESULTS);
    } catch (err: any) {
      console.error("An error occurred during the fitting process:", err);
      setError(err.message || "Sorry, something went wrong while creating your virtual fit. Please try again.");
      setAppStep(AppStep.SELECTION);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [selectedStyle, selectedFabric, height, selectedGender]);
  
  const isSelectionComplete = !!selectedGender && !!selectedStyle && !!selectedFabric && !!height && height > 0;
  
  if (showOnboarding) {
    return <Onboarding onStart={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-100">
      {showCamera && <CameraCapture onCapture={processImage} onClose={() => setShowCamera(false)} />}
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-6 transition-all duration-500">
          <StepIndicator currentStep={appStep} />
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading && <LoadingOverlay message={loadingMessage} />}

          {appStep === AppStep.SELECTION && (
            <div className="mt-8 space-y-8">
              <GarmentSelector 
                selectedGender={selectedGender} onGenderSelect={handleGenderSelect}
                selectedStyle={selectedStyle} onStyleSelect={setSelectedStyle}
                selectedFabric={selectedFabric} onFabricSelect={setSelectedFabric}
              />
              
              {selectedFabric && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-slate-700 mb-4">4. Enter Your Height</h2>
                    <div className="relative">
                        <input
                          type="number"
                          id="height"
                          value={height}
                          onChange={(e) => setHeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                          placeholder="e.g., 68"
                          className="w-full p-4 pr-16 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          aria-describedby="height-unit"
                        />
                        <span id="height-unit" className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500">inches</span>
                      </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-700 mb-4">5. Provide Your Photo</h2>
                    <ImageUploader onUpload={processImage} onTakePhoto={() => setShowCamera(true)} disabled={!isSelectionComplete} />
                    {!isSelectionComplete && <p className="text-sm text-slate-500 mt-2">Please complete all previous steps to enable photo input.</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {appStep === AppStep.RESULTS && measurements && vtoImage && tailorFeedback && userImage && selectedStyle && selectedFabric && selectedGender && (
            <ResultsDisplay 
              originalImage={URL.createObjectURL(userImage.file)}
              generatedImage={`data:image/jpeg;base64,${vtoImage}`}
              feedback={tailorFeedback}
              measurements={measurements}
              style={selectedStyle}
              fabric={selectedFabric}
              gender={selectedGender}
              onReset={handleReset}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default App;
