import React, { useState, useEffect } from 'react';
import { Fabric, Style, Gender, Design, SleeveLength } from '../types';
import { MALE_FABRICS, FEMALE_FABRICS, STYLES, DESIGNS } from '../constants';
import { getSavedFabrics, saveFabrics } from '../services/fabricService';
import { UploadIcon, SparklesIcon, TailorIcon } from './Icons';
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
  onMagicMeasure: () => void;
  isMeasuringAI: boolean;
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
  disabled,
  onMagicMeasure,
  isMeasuringAI
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
        onDesignSelect(designsForStyle[0]);
      } else {
        onDesignSelect({
          id: 'classic-design',
          name: 'Classic',
          styleId: newStyle.id,
          imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        });
      }
    } else {
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
    if (file.size > 2 * 1024 * 1024) {
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
      <div className="animate-fade-in">
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

      {/* 2. Height & AI Measure */}
      <div className={`rounded-2xl transition-all duration-300 ${highlightHeight ? 'bg-premium-50 ring-2 ring-premium-300 p-4 -m-4' : ''}`}>
        <h3 className="text-xl font-serif font-medium text-premium-900 mb-4 tracking-wide">2. Enter Height & AI Measurement</h3>
        <div className="max-w-md">
           <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="w-full sm:w-32">
                  <label htmlFor="height" className="block text-sm font-medium text-premium-600 mb-1">Height (ft)</label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      id="height"
                      value={height}
                      onChange={(e) => onHeightChange(e.target.value)}
                      placeholder="5.7"
                      min="1"
                      max="8"
                      step="0.01"
                      className="block w-full pl-3 pr-8 py-2 bg-white border border-premium-300 rounded-md placeholder-premium-400 focus:outline-none focus:ring-premium-900 focus:border-premium-900 sm:text-sm disabled:bg-premium-50"
                      disabled={disabled}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <span className="text-premium-400 text-xs">ft</span>
                    </div>
                  </div>
              </div>
              
              <button
                type="button"
                onClick={onMagicMeasure}
                disabled={disabled || !height || isMeasuringAI}
                className={`inline-flex items-center gap-2 px-6 py-2 h-[38px] text-sm font-bold rounded-lg transition-all
                  ${(disabled || !height || isMeasuringAI)
                    ? 'bg-premium-100 text-premium-400 cursor-not-allowed border border-premium-200'
                    : 'bg-accent text-white hover:bg-accent-dark shadow-md hover:shadow-accent/20 active:scale-95'
                  }`}
              >
                <SparklesIcon className={`w-4 h-4 ${isMeasuringAI ? 'animate-spin' : ''}`} />
                {isMeasuringAI ? 'AI Measuring...' : 'Magic Measure with AI'}
              </button>
           </div>
           {!height && <p className="text-xs text-premium-500 mt-2 italic font-light">Enter height first to unlock AI body measurement.</p>}
        </div>
        {highlightHeight && <p className="text-sm text-premium-900 mt-2 animate-pulse">Required: Please enter your height.</p>}
      </div>

      {/* 3. Style Selection */}
      <div className="animate-fade-in pt-4">
        <h3 className="text-xl font-serif font-medium text-premium-900 mb-4 tracking-wide">3. Choose Your Style</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {filteredStyles.map(style => (
            <div
              key={style.id}
              onClick={() => !disabled && handleStyleChange(style)}
              className={`${cardBaseClasses} ${selectedStyle?.id === style.id ? selectedCardClasses : unselectedCardClasses} ${disabled ? disabledCardClasses : ''}`}
            >
              <img src={style.imageUrl} alt={style.name} className="w-full h-32 sm:h-40 object-cover" />
              <p className="font-semibold text-center p-2 text-sm bg-white border-t border-premium-100">{style.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Sleeve Length Selection */}
      {selectedStyle && (
        <div className="animate-fade-in mt-6">
          <h3 className="text-xl font-serif font-medium text-premium-900 mb-4 tracking-wide">4. Select Sleeve Length</h3>
          <div className="flex gap-2 p-1 bg-premium-100/50 rounded-xl max-w-sm">
            {(['short', 'long'] as SleeveLength[]).map(sl => (
              <button
                key={sl}
                onClick={() => onSleeveLengthChange(sl)}
                disabled={disabled}
                className={`w-full py-2 px-4 rounded-md font-semibold transition-colors text-sm ${
                  sleeveLength === sl ? 'bg-premium-900 text-white shadow' : 'bg-transparent text-premium-600 hover:bg-premium-200'
                } ${disabled ? 'cursor-not-allowed' : ''}`}
              >
                {sl === 'short' ? 'Short Sleeve' : 'Long Sleeve'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Design Selection */}
      {selectedStyle && (
        <div className="animate-fade-in mt-6">
          <h3 className="text-xl font-serif font-medium text-premium-900 mb-4 tracking-wide">5. Select Your Design</h3>
          {filteredDesigns.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {filteredDesigns.map(design => (
                <div
                  key={design.id}
                  onClick={() => !disabled && onDesignSelect(design)}
                  className={`${cardBaseClasses} ${selectedDesign?.id === design.id ? selectedCardClasses : unselectedCardClasses} ${disabled ? disabledCardClasses : ''}`}
                >
                  <img src={design.imageUrl} alt={design.name} className="w-full h-24 sm:h-32 object-cover bg-premium-100" />
                  <p className="font-medium text-center p-1 text-xs bg-white truncate">{design.name}</p>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-sm text-premium-500 p-4 bg-premium-50 rounded-lg">Classic design selected.</p>
          )}
        </div>
      )}

      {/* 6. Material Curation */}
      <div className="mt-12 pt-8 border-t border-premium-100/50">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
                <h3 className="text-2xl font-serif font-medium text-premium-900 tracking-tight">Material Curation</h3>
                <p className="text-sm text-premium-500 font-light mt-1 italic">Select from our signature textiles or provide your own.</p>
            </div>
            <div className="bg-accent/10 text-accent px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold tracking-widest border border-accent/20">
                <TailorIcon className="w-3.5 h-3.5" /> TAILOR'S STUDIO CHOICE
            </div>
        </div>
        
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {/* Upload Slot FIRST for the "Bespoke" feel */}
          <label 
            htmlFor="fabric-upload" 
            className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed transition-all duration-300 ${disabled ? 'bg-premium-50 border-premium-200 text-premium-300' : 'bg-white border-premium-300 text-premium-500 hover:border-accent hover:bg-accent/5 cursor-pointer shadow-sm hover:shadow-md'}`}
          >
            <div className="bg-premium-100 group-hover:bg-accent/20 p-3 rounded-full transition-colors">
                <UploadIcon className="w-6 h-6 text-premium-600 group-hover:text-accent" />
            </div>
            <span className="text-[10px] font-black mt-3 tracking-tighter uppercase">CLIENT'S OWN</span>
            <p className="text-[8px] opacity-60 mt-0.5">UPLOAD TEXTILE</p>
            <input id="fabric-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFabricUpload} disabled={disabled} />
          </label>

          {allFabrics.map(fabric => (
            <div 
              key={fabric.id} 
              onClick={() => !disabled && onFabricSelect(fabric)} 
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 transform hover:-translate-y-1 ${selectedFabric?.id === fabric.id ? 'ring-2 ring-accent ring-offset-2 scale-[1.02] shadow-xl' : 'border border-premium-100 hover:shadow-lg'} ${disabled ? disabledCardClasses : ''}`}
            >
              <img src={fabric.imageUrl} alt={fabric.name} className="w-full h-32 object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors ${selectedFabric?.id === fabric.id ? 'bg-accent/10 bg-opacity-10' : ''}`} />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/30 to-transparent p-3">
                <span className="text-white text-[9px] font-black tracking-widest uppercase truncate block">{fabric.name}</span>
                <p className="text-white/60 text-[7px] uppercase tracking-tighter mt-0.5">Premium Swatch</p>
              </div>
              {selectedFabric?.id === fabric.id && (
                  <div className="absolute top-2 right-2 bg-accent text-white p-1 rounded-full shadow-lg h-5 w-5 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  </div>
              )}
            </div>
          ))}
        </div>
        {error && <p className="text-sm text-red-600 mt-4 animate-shake">{error}</p>}
      </div>
    </div>
  );
};

export default PatternSelector;