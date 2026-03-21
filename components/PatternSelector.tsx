import React, { useState, useEffect } from 'react';
import { Fabric, Style, Gender, Design, SleeveLength } from '../types';
import { MALE_FABRICS, FEMALE_FABRICS, STYLES, DESIGNS } from '../constants';
import { getSavedFabrics, saveFabrics } from '../services/fabricService';
import { UploadIcon } from './Icons';
import FabricNameModal from './FabricNameModal';

interface PatternSelectorProps {
  gender: Gender;
  onGenderChange: (gender: Gender) => void;
  height: string;
  onHeightChange: (height: string) => void;
  selectedStyle: Style | null;
  onStyleSelect: (style: Style | null) => void;
  sleeveLength: SleeveLength;
  onSleeveLengthChange: (sleeveLength: SleeveLength) => void;
  selectedDesign: Design | null;
  onDesignSelect: (design: Design | null) => void;
  selectedFabric: Fabric | null;
  onFabricSelect: (fabric: Fabric) => void;
  highlightHeight: boolean;
  disabled: boolean;
}

interface PendingFabric {
  base64: string;
  mimeType: string;
  file: File;
}

const PatternSelector: React.FC<PatternSelectorProps> = ({
  gender,
  onGenderChange,
  height,
  onHeightChange,
  selectedStyle,
  onStyleSelect,
  sleeveLength,
  onSleeveLengthChange,
  selectedDesign,
  onDesignSelect,
  selectedFabric,
  onFabricSelect,
  highlightHeight,
  disabled
}) => {
  const [customFabrics, setCustomFabrics] = useState<Fabric[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [pendingFabric, setPendingFabric] = useState<PendingFabric | null>(null);

  useEffect(() => {
    setCustomFabrics(getSavedFabrics());
  }, []);

  const handleGenderChange = (newGender: Gender) => {
    onGenderChange(newGender);
    if (selectedStyle && selectedStyle.gender !== newGender) {
      onStyleSelect(null);
      onDesignSelect(null);
    }
    // Reset fabric selection if it's from the gender-specific list
    const currentDefaultFabrics = newGender === 'female' ? MALE_FABRICS : FEMALE_FABRICS;
    if (selectedFabric && currentDefaultFabrics.some(f => f.id === selectedFabric.id)) {
        onFabricSelect(null as any);
    }
  };

  const handleStyleChange = (newStyle: Style | null) => {
    onStyleSelect(newStyle);

    if (newStyle) {
      const designsForStyle = DESIGNS.filter(d => d.styleId === newStyle.id);
      if (designsForStyle.length > 0) {
        // Auto-select the first design to ensure the form is always valid after style selection.
        onDesignSelect(designsForStyle[0]);
      } else {
        // If no specific designs exist, use the "Classic" placeholder.
        onDesignSelect({
          id: 'classic-design',
          name: 'Classic',
          styleId: newStyle.id,
          imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // 1x1 transparent pixel
        });
      }
    } else {
      // If style is cleared (e.g. on gender change), clear the design.
      onDesignSelect(null);
    }
  };


  const handleFabricUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit for fabrics
      setError('File is too large. Please upload an image under 2MB.');
      return;
    }
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      if (base64String) {
        setPendingFabric({ base64: base64String, mimeType: file.type, file });
        setIsNameModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleSaveCustomFabric = (name: string) => {
    if (!pendingFabric) return;
    
    const newFabric: Fabric = {
      id: `custom-${Date.now()}`,
      name: name,
      imageUrl: URL.createObjectURL(pendingFabric.file),
      base64: pendingFabric.base64,
      mimeType: pendingFabric.mimeType,
    };
    
    const updatedFabrics = [...customFabrics, newFabric];
    setCustomFabrics(updatedFabrics);
    saveFabrics(updatedFabrics);
    onFabricSelect(newFabric);

    setIsNameModalOpen(false);
    setPendingFabric(null);
  };
  
  const genderSpecificFabrics = gender === 'female' ? FEMALE_FABRICS : MALE_FABRICS;
  const allFabrics = [...genderSpecificFabrics, ...customFabrics];
  const filteredStyles = STYLES.filter(s => s.gender === gender);
  const filteredDesigns = selectedStyle ? DESIGNS.filter(d => d.styleId === selectedStyle.id) : [];

  const cardBaseClasses = "border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 transform hover:scale-105";
  const selectedCardClasses = "border-premium-900 ring-2 ring-premium-900 shadow-lg";
  const unselectedCardClasses = "border-premium-200 hover:border-premium-300 hover:shadow-md";
  const disabledCardClasses = "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none";

  return (
    <div className="space-y-6">
      <FabricNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onSave={handleSaveCustomFabric}
      />

      {/* 1. Gender Selection */}
      <div>
        <h3 className="text-xl font-serif font-medium text-premium-900 mb-4 tracking-wide">1. Select Gender</h3>
        <div className="flex gap-2 p-1 bg-premium-100/50 rounded-xl">
          {(['female', 'male'] as Gender[]).map(g => (
            <button
              key={g}
              onClick={() => handleGenderChange(g)}
              disabled={disabled}
              className={`w-full py-2 px-4 rounded-md font-semibold transition-colors text-sm sm:text-base ${
                gender === g ? 'bg-premium-900 text-white shadow' : 'bg-transparent text-premium-600 hover:bg-premium-200'
              } ${disabled ? 'cursor-not-allowed' : ''}`}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Height Input */}
      <div className={`rounded-2xl transition-all duration-300 ${highlightHeight ? 'bg-premium-50 ring-2 ring-premium-300 p-4 -m-4' : ''}`}>
        <div>
          <h3 className="text-xl font-serif font-medium text-premium-900 mb-4 tracking-wide">2. Enter Your Height</h3>
          <div className="max-w-xs">
            <label htmlFor="height" className="block text-sm font-medium text-premium-600 mb-1">Height</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => onHeightChange(e.target.value)}
                placeholder="e.g., 5.75"
                min="1"
                max="8"
                step="0.01"
                className="block w-full pl-3 pr-12 py-2 bg-white border border-premium-300 rounded-md placeholder-premium-400 focus:outline-none focus:ring-premium-900 focus:border-premium-900 sm:text-sm disabled:bg-premium-50 disabled:text-premium-500 disabled:border-premium-200"
                disabled={disabled}
                aria-label="Height in feet"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-premium-500 sm:text-sm" id="height-unit">
                  ft
                </span>
              </div>
            </div>
          </div>
          {highlightHeight && <p className="text-sm text-premium-900 mt-2 animate-pulse">Please enter your height to enable generation.</p>}
        </div>
      </div>


      {/* 3. Style Selection */}
      <div>
        <h3 className="text-xl font-serif font-medium text-premium-900 mb-4 tracking-wide">3. Choose Your Style</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {filteredStyles.map(style => (
            <div
              key={style.id}
              onClick={() => !disabled && handleStyleChange(style)}
              className={`${cardBaseClasses} ${selectedStyle?.id === style.id ? selectedCardClasses : unselectedCardClasses} ${disabled ? disabledCardClasses : ''}`}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-pressed={selectedStyle?.id === style.id}
            >
              <img src={style.imageUrl} alt={style.name} className="w-full h-32 sm:h-40 object-cover" />
              <p className="font-semibold text-center p-2 text-sm bg-white">{style.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Sleeve Length Selection (Conditional) */}
      {selectedStyle && (
        <div className="animate-fade-in mt-6">
          <h3 className="text-xl font-serif font-medium text-premium-900 mb-4 tracking-wide">4. Select Sleeve Length</h3>
          <div className="flex gap-2 p-1 bg-premium-100/50 rounded-xl">
            {(['short', 'long'] as SleeveLength[]).map(sl => (
              <button
                key={sl}
                onClick={() => onSleeveLengthChange(sl)}
                disabled={disabled}
                className={`w-full py-2 px-4 rounded-md font-semibold transition-colors text-sm sm:text-base ${
                  sleeveLength === sl ? 'bg-premium-900 text-white shadow' : 'bg-transparent text-premium-600 hover:bg-premium-200'
                } ${disabled ? 'cursor-not-allowed' : ''}`}
              >
                {sl === 'short' ? 'Short Sleeve' : 'Long Sleeve'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Design Selection (Conditional) */}
      {selectedStyle && (
        <div className="animate-fade-in mt-6">
          <h3 className="text-xl font-serif font-medium text-premium-900 mb-4 tracking-wide">5. Select Your Design</h3>
          {filteredDesigns.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredDesigns.map(design => (
                <div
                  key={design.id}
                  onClick={() => !disabled && onDesignSelect(design)}
                  className={`${cardBaseClasses} ${selectedDesign?.id === design.id ? selectedCardClasses : unselectedCardClasses} ${disabled ? disabledCardClasses : ''}`}
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  aria-pressed={selectedDesign?.id === design.id}
                >
                  <img src={design.imageUrl} alt={design.name} className="w-full h-32 sm:h-40 object-cover bg-premium-100" />
                  <p className="font-semibold text-center p-2 text-sm bg-white">{design.name}</p>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-sm text-premium-500 p-4 bg-premium-50 rounded-lg">No specific designs available for this style. The classic look will be used.</p>
          )}
        </div>
      )}

      {/* 6. Fabric Selection */}
      <div className="mt-8">
        <h3 className="text-xl font-serif font-medium text-premium-900 mb-4 tracking-wide">6. Pick or Upload a Fabric</h3>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {allFabrics.map(fabric => (
            <div 
              key={fabric.id} 
              onClick={() => !disabled && onFabricSelect(fabric)} 
              className={`relative rounded-lg overflow-hidden h-24 w-24 flex-shrink-0 cursor-pointer transition-all duration-200 transform hover:scale-105 ${selectedFabric?.id === fabric.id ? selectedCardClasses : unselectedCardClasses} ${disabled ? disabledCardClasses : ''}`}
              role="button" 
              tabIndex={disabled ? -1 : 0} 
              aria-pressed={selectedFabric?.id === fabric.id}
            >
              <img src={fabric.imageUrl} alt={fabric.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-1">
                <p className="text-white text-xs font-semibold truncate">{fabric.name}</p>
              </div>
            </div>
          ))}
          <label 
            htmlFor="fabric-upload" 
            className={`flex flex-col items-center justify-center h-24 w-24 flex-shrink-0 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${disabled ? 'bg-premium-100 border-premium-300 text-premium-400 cursor-not-allowed' : 'bg-premium-50 border-premium-300 text-premium-500 hover:bg-premium-100 hover:border-premium-300'}`}
          >
            <UploadIcon className="w-6 h-6" />
            <span className="text-xs font-semibold mt-1 text-center">Upload</span>
            <input id="fabric-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFabricUpload} disabled={disabled} />
          </label>
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default PatternSelector;