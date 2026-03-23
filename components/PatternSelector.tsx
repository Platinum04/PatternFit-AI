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

  const cardBaseClasses = "border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-sm";
  const selectedCardClasses = "border-studio-900 ring-4 ring-studio-900 shadow-2xl z-10 scale-[1.04]";
  const unselectedCardClasses = "border-studio-200 bg-white hover:border-studio-400 hover:shadow-lg";
  const disabledCardClasses = "opacity-40 cursor-not-allowed grayscale filter";

  return (
    <div className="space-y-8">
      <FabricNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onSave={handleSaveCustomFabric}
      />

      {/* 1. Gender Selection */}
      <div className="animate-fade">
        <h3 className="text-xs font-bold text-studio-400 mb-4 tracking-[0.3em] uppercase">01. GENDER CONTEXT</h3>
        <div className="flex gap-2 p-1.5 bg-studio-100 rounded-2xl max-w-sm border border-studio-200">
          {(['female', 'male'] as Gender[]).map(g => (
            <button
              key={g}
              onClick={() => handleGenderChange(g)}
              disabled={disabled}
              className={`w-full py-2.5 px-6 rounded-xl font-bold transition-all text-xs tracking-widest uppercase ${
                gender === g ? 'bg-studio-900 text-white shadow-xl scale-105' : 'bg-transparent text-studio-500 hover:bg-studio-200'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Height & AI Measure */}
      <div className={`p-6 rounded-4xl transition-all duration-500 border border-transparent ${highlightHeight ? 'bg-studio-50 border-brand/20 shadow-xl shadow-brand/5' : ''}`}>
        <h3 className="text-xs font-bold text-studio-400 mb-4 tracking-[0.3em] uppercase">02. SCALE & PROPORTION</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            <div className="w-full sm:w-40">
                <label htmlFor="height" className="block text-[10px] font-black text-studio-500 mb-2 tracking-widest uppercase italic">Base Height (ft)</label>
                <div className="relative group">
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => onHeightChange(e.target.value)}
                    placeholder="5.7"
                    min="1"
                    max="8"
                    step="0.01"
                    className="block w-full pl-5 pr-10 py-3.5 bg-studio-50 border-studio-200 rounded-xl placeholder-studio-300 text-studio-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all border-2"
                    disabled={disabled}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <span className="text-studio-400 font-mono text-xs">ft</span>
                  </div>
                </div>
            </div>
            
            <button
              type="button"
              onClick={onMagicMeasure}
              disabled={disabled || !height || isMeasuringAI}
              className={`inline-flex items-center gap-3 px-8 py-3.5 h-[52px] text-xs font-black tracking-widest rounded-xl transition-all uppercase
                ${(disabled || !height || isMeasuringAI)
                  ? 'bg-studio-200 text-studio-400 cursor-not-allowed border border-studio-300'
                  : 'bg-studio-900 text-white hover:bg-brand shadow-2xl hover:shadow-brand/20 active:scale-95'
                }`}
            >
              <SparklesIcon className={`w-4 h-4 ${isMeasuringAI ? 'animate-spin' : ''}`} />
              {isMeasuringAI ? 'ANALYZING...' : 'MAGIC MEASURE'}
            </button>
        </div>
        {!height && <p className="text-[10px] text-studio-400 mt-4 tracking-tighter italic">Required for AI measurement calculations.</p>}
        {highlightHeight && <p className="text-sm text-brand mt-4 animate-pulse font-bold tracking-tight">ACTION REQUIRED: Specifiy base height.</p>}
      </div>

      {/* 3. Style Selection */}
      <div className="animate-fade pt-4">
        <h3 className="text-xs font-bold text-studio-400 mb-6 tracking-[0.3em] uppercase">03. BASE SILHOUETTE</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          {filteredStyles.map(style => (
            <div
              key={style.id}
              onClick={() => !disabled && handleStyleChange(style)}
              className={`${cardBaseClasses} ${selectedStyle?.id === style.id ? selectedCardClasses : unselectedCardClasses} ${disabled ? disabledCardClasses : ''}`}
            >
              <img src={style.imageUrl} alt={style.name} className="w-full h-40 sm:h-52 object-cover transition-transform duration-700 hover:scale-110" />
              <div className="p-4 bg-studio-50 border-t border-studio-100 flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest uppercase text-studio-900">{style.name}</span>
                  <div className="w-1.5 h-1.5 bg-studio-300 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Sleeve Length Selection */}
      {selectedStyle && (
        <div className="animate-fade mt-10">
          <h3 className="text-xs font-bold text-studio-400 mb-4 tracking-[0.3em] uppercase">04. SLEEVE SPECIFICATION</h3>
          <div className="flex gap-3 p-1.5 bg-studio-100 rounded-2xl max-w-sm border border-studio-200">
            {(['short', 'long'] as SleeveLength[]).map(sl => (
              <button
                key={sl}
                onClick={() => onSleeveLengthChange(sl)}
                disabled={disabled}
                className={`w-full py-2.5 px-4 rounded-xl font-bold transition-all text-xs tracking-widest uppercase ${
                  sleeveLength === sl ? 'bg-studio-900 text-white shadow-xl scale-105' : 'bg-transparent text-studio-500 hover:bg-studio-200'
                } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {sl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Design Selection */}
      {selectedStyle && (
        <div className="animate-fade mt-12">
          <h3 className="text-xs font-bold text-studio-400 mb-6 tracking-[0.3em] uppercase">05. PATTERN DETAIL</h3>
          {filteredDesigns.length > 0 ? (
            <div className="grid grid-cols-2 xs:grid-cols-4 gap-4">
              {filteredDesigns.map(design => (
                <div
                  key={design.id}
                  onClick={() => !disabled && onDesignSelect(design)}
                  className={`${cardBaseClasses} ${selectedDesign?.id === design.id ? selectedCardClasses : unselectedCardClasses} ${disabled ? disabledCardClasses : ''}`}
                >
                  <img src={design.imageUrl} alt={design.name} className="w-full h-32 object-cover bg-studio-100 p-2 grayscale hover:grayscale-0 transition-all duration-500" />
                  <div className="p-3 bg-white text-center">
                      <span className="text-[9px] font-black tracking-widest uppercase truncate block">{design.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="p-8 border-2 border-dashed border-studio-200 rounded-3xl text-center">
                 <p className="text-xs text-studio-400 italic tracking-widest uppercase">Classic Variation Active</p>
             </div>
          )}
        </div>
      )}

      {/* 6. Material Curation */}
      <div className="mt-16 pt-12 border-t border-studio-200/50">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div>
                <h3 className="text-xs font-bold text-studio-400 mb-2 tracking-[0.3em] uppercase">06. TEXTILE CURATION</h3>
                <h4 className="text-2xl font-serif text-studio-900 tracking-tight italic">Material Selection</h4>
            </div>
            <div className="bg-brand/5 text-brand px-4 py-2 rounded-xl flex items-center gap-3 text-xs font-bold tracking-[0.1em] border border-brand/20">
                <TailorIcon className="w-4 h-4" /> STUDIO CHOICE
            </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
          <label 
            htmlFor="fabric-upload" 
            className={`group flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 border-dashed transition-all duration-300 ${disabled ? 'bg-studio-50 border-studio-200 text-studio-300' : 'bg-white border-studio-300 text-studio-500 hover:border-brand hover:bg-studio-50 cursor-pointer shadow-sm hover:shadow-2xl'}`}
          >
            <div className="bg-studio-100 group-hover:bg-brand/10 p-5 rounded-full transition-all">
                <UploadIcon className="w-8 h-8 text-studio-500 group-hover:text-brand" />
            </div>
            <span className="text-[10px] font-black mt-5 tracking-[0.2em] uppercase">CLIENT OWN</span>
            <input id="fabric-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFabricUpload} disabled={disabled} />
          </label>

          {allFabrics.map(fabric => (
            <div 
              key={fabric.id} 
              onClick={() => !disabled && onFabricSelect(fabric)} 
              className={`group relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 transform hover:-translate-y-2 ${selectedFabric?.id === fabric.id ? 'ring-4 ring-brand ring-offset-4 scale-105 shadow-2xl' : 'border border-studio-100 hover:shadow-xl'} ${disabled ? disabledCardClasses : ''}`}
            >
              <img src={fabric.imageUrl} alt={fabric.name} className="w-full h-40 object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-studio-900/90 via-studio-900/40 to-transparent p-5">
                <span className="text-studio-50 text-[10px] font-black tracking-widest uppercase truncate block">{fabric.name}</span>
                <p className="text-studio-400 text-[8px] uppercase tracking-widest mt-1">Studio Swatch</p>
              </div>
            </div>
          ))}
        </div>
        {error && <p className="text-xs text-red-500 mt-6 animate-shake font-bold tracking-widest uppercase text-center">{error}</p>}
      </div>
    </div>
  );
};

export default PatternSelector;