import React, { useState, useEffect } from 'react';
import { Fabric, Style, Gender, Design, SleeveLength } from '../types';
import { FABRICS, STYLES, DESIGNS } from '../constants';
import { getSavedFabrics, saveFabrics } from '../services/fabricService';
import { UploadIcon } from './Icons';

interface PatternSelectorProps {
  gender: Gender;
  onGenderChange: (gender: Gender) => void;
  selectedStyle: Style | null;
  onStyleSelect: (style: Style | null) => void;
  sleeveLength: SleeveLength;
  onSleeveLengthChange: (sleeveLength: SleeveLength) => void;
  selectedDesign: Design | null;
  onDesignSelect: (design: Design | null) => void;
  selectedFabric: Fabric | null;
  onFabricSelect: (fabric: Fabric) => void;
  disabled: boolean;
}

const PatternSelector: React.FC<PatternSelectorProps> = ({
  gender,
  onGenderChange,
  selectedStyle,
  onStyleSelect,
  sleeveLength,
  onSleeveLengthChange,
  selectedDesign,
  onDesignSelect,
  selectedFabric,
  onFabricSelect,
  disabled
}) => {
  const [customFabrics, setCustomFabrics] = useState<Fabric[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCustomFabrics(getSavedFabrics());
  }, []);

  const handleGenderChange = (newGender: Gender) => {
    onGenderChange(newGender);
    if (selectedStyle && selectedStyle.gender !== newGender) {
      onStyleSelect(null);
      onDesignSelect(null);
    }
  };

  const handleStyleChange = (newStyle: Style | null) => {
    onStyleSelect(newStyle);
    // Always reset design when style changes
    onDesignSelect(null);
  }

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
        const newFabric: Fabric = {
          id: `custom-${Date.now()}`,
          name: file.name.split('.').slice(0, -1).join('.') || 'Custom Fabric',
          imageUrl: URL.createObjectURL(file),
          base64: base64String,
          mimeType: file.type,
        };
        const updatedFabrics = [...customFabrics, newFabric];
        setCustomFabrics(updatedFabrics);
        saveFabrics(updatedFabrics);
        onFabricSelect(newFabric);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };
  
  const allFabrics = [...FABRICS, ...customFabrics];
  const filteredStyles = STYLES.filter(s => s.gender === gender);
  const filteredDesigns = selectedStyle ? DESIGNS.filter(d => d.styleId === selectedStyle.id) : [];

  const cardBaseClasses = "border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 transform hover:scale-105";
  const selectedCardClasses = "border-blue-500 ring-2 ring-blue-500 shadow-lg";
  const unselectedCardClasses = "border-slate-200 hover:border-blue-300 hover:shadow-md";
  const disabledCardClasses = "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none";

  return (
    <div className="space-y-6">
      {/* 1. Gender Selection */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">1. Select Gender</h3>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
          {(['female', 'male'] as Gender[]).map(g => (
            <button
              key={g}
              onClick={() => handleGenderChange(g)}
              disabled={disabled}
              className={`w-full py-2 px-4 rounded-md font-semibold transition-colors text-sm sm:text-base ${
                gender === g ? 'bg-blue-600 text-white shadow' : 'bg-transparent text-slate-600 hover:bg-slate-200'
              } ${disabled ? 'cursor-not-allowed' : ''}`}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Style Selection */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-3">2. Choose Your Style</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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

      {/* 3. Sleeve Length Selection (Conditional) */}
      {selectedStyle && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">3. Select Sleeve Length</h3>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            {(['short', 'long'] as SleeveLength[]).map(sl => (
              <button
                key={sl}
                onClick={() => onSleeveLengthChange(sl)}
                disabled={disabled}
                className={`w-full py-2 px-4 rounded-md font-semibold transition-colors text-sm sm:text-base ${
                  sleeveLength === sl ? 'bg-blue-600 text-white shadow' : 'bg-transparent text-slate-600 hover:bg-slate-200'
                } ${disabled ? 'cursor-not-allowed' : ''}`}
              >
                {sl === 'short' ? 'Short Sleeve' : 'Long Sleeve'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Design Selection (Conditional) */}
      {selectedStyle && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-semibold text-slate-700 mb-3">4. Select Your Design</h3>
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
                  <img src={design.imageUrl} alt={design.name} className="w-full h-32 sm:h-40 object-cover bg-slate-100" />
                  <p className="font-semibold text-center p-2 text-sm bg-white">{design.name}</p>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-sm text-slate-500 p-4 bg-slate-50 rounded-lg">No specific designs available for this style. The classic look will be used.</p>
          )}
        </div>
      )}

      {/* 5. Fabric Selection */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-3">5. Pick or Upload a Fabric</h3>
        <div className="flex overflow-x-auto space-x-3 pb-3">
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
            className={`flex flex-col items-center justify-center h-24 w-24 flex-shrink-0 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${disabled ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed' : 'bg-slate-50 border-slate-300 text-slate-500 hover:bg-slate-100 hover:border-blue-300'}`}
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