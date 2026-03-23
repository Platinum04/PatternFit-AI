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

  const cardBaseClasses = "border-2 border-transparent bg-studio-50 overflow-hidden cursor-pointer transition-all duration-300 transform hover:border-studio-200";
  const selectedCardClasses = "border-[#111111] bg-white z-10 shadow-md";
  const unselectedCardClasses = "hover:shadow-sm";
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
        <h3 className="text-[10px] font-black tracking-widest uppercase text-studio-400 mb-4 border-b border-studio-200 pb-2">01. Gender Context</h3>
        <div className="flex gap-4">
          {(['female', 'male'] as Gender[]).map(g => (
            <button
              key={g}
              onClick={() => handleGenderChange(g)}
              disabled={disabled}
              className={`py-3 px-8 text-[10px] font-black tracking-widest uppercase transition-all rounded-[2px] border ${
                gender === g ? 'bg-[#111111] text-white border-[#111111]' : 'bg-transparent text-studio-500 border-studio-200 hover:border-[#111111]'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Height & AI Measure */}
      <div className={`p-6 transition-all duration-500 border rounded-[2px] ${highlightHeight ? 'bg-studio-50 border-[#111111]' : 'border-studio-100 bg-white'}`}>
        <h3 className="text-[10px] font-black tracking-widest uppercase text-studio-400 mb-4 border-b border-studio-200 pb-2">02. Scale & Proportion</h3>
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
                    className="block w-full pl-5 pr-10 py-3.5 bg-studio-50 border border-studio-200 rounded-[2px] placeholder-studio-300 text-studio-900 font-mono focus:outline-none focus:border-[#111111] transition-all"
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
              className={`inline-flex items-center gap-3 px-8 py-3.5 h-[52px] text-[10px] font-black tracking-widest rounded-[2px] transition-all uppercase border
                ${(disabled || !height || isMeasuringAI)
                  ? 'bg-studio-100 text-studio-400 cursor-not-allowed border-studio-200'
                  : 'bg-white text-[#111111] border-[#111111] hover:bg-[#111111] hover:text-white'
                }`}
            >
              <SparklesIcon className={`w-4 h-4 ${isMeasuringAI ? 'animate-spin' : ''}`} />
              {isMeasuringAI ? 'Analyzing' : 'Magic Measure'}
            </button>
        </div>
        {!height && <p className="text-[10px] text-studio-400 mt-4 tracking-[-0.05em] uppercase border-l-2 border-studio-200 pl-3">Requires explicit base height definition.</p>}
        {highlightHeight && <p className="text-[10px] text-red-600 mt-4 tracking-widest uppercase font-black uppercase border-l-2 border-red-600 pl-3">Target specification required: Base height.</p>}
      </div>

      {/* 3. Style Selection */}
      <div className="animate-fade pt-8">
        <h3 className="text-[10px] font-black tracking-widest uppercase text-studio-400 mb-6 border-b border-studio-200 pb-2">03. Base Silhouette</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {filteredStyles.map(style => (
            <div
              key={style.id}
              onClick={() => !disabled && handleStyleChange(style)}
              className={`${cardBaseClasses} ${selectedStyle?.id === style.id ? selectedCardClasses : unselectedCardClasses} ${disabled ? disabledCardClasses : ''}`}
            >
              <img src={style.imageUrl} alt={style.name} className="w-full h-40 sm:h-52 object-cover object-top grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" />
              <div className="p-4 bg-white border-t border-studio-100 flex items-center justify-between">
                  <span className="text-[9px] font-black tracking-[0.2em] uppercase text-[#111111]">{style.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Sleeve Length Selection */}
      {selectedStyle && (
        <div className="animate-fade mt-10">
          <h3 className="text-[10px] font-black tracking-widest uppercase text-studio-400 mb-6 border-b border-studio-200 pb-2">04. Sleeve Specification</h3>
          <div className="flex gap-4">
            {(['short', 'long'] as SleeveLength[]).map(sl => (
              <button
                key={sl}
                onClick={() => onSleeveLengthChange(sl)}
                disabled={disabled}
                className={`w-32 py-3 px-4 font-black transition-all text-[10px] tracking-widest uppercase border rounded-[2px] ${
                  sleeveLength === sl ? 'bg-[#111111] text-white border-[#111111]' : 'bg-transparent text-studio-500 hover:border-[#111111] border-studio-200'
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
          <h3 className="text-[10px] font-black tracking-widest uppercase text-studio-400 mb-6 border-b border-studio-200 pb-2">05. Technical Overlay</h3>
          {filteredDesigns.length > 0 ? (
            <div className="grid grid-cols-2 xs:grid-cols-4 gap-4">
              {filteredDesigns.map(design => (
                <div
                  key={design.id}
                  onClick={() => !disabled && onDesignSelect(design)}
                  className={`${cardBaseClasses} ${selectedDesign?.id === design.id ? selectedCardClasses : unselectedCardClasses} ${disabled ? disabledCardClasses : ''}`}
                >
                  <img src={design.imageUrl} alt={design.name} className="w-full h-40 object-cover p-2 grayscale hover:grayscale-0 transition-all duration-500" />
                  <div className="p-3 bg-white border-t border-studio-100 text-center">
                      <span className="text-[8px] font-black tracking-[0.2em] uppercase truncate block text-[#111111]">{design.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="p-8 border border-studio-200 bg-studio-50 text-center">
                 <p className="text-[10px] text-studio-400 font-mono tracking-widest uppercase">Classic Variation Active (Null Overlay)</p>
             </div>
          )}
        </div>
      )}

      {/* 6. Material Curation */}
      <div className="mt-16 pt-16 border-t border-studio-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
                <h3 className="text-[10px] font-black uppercase text-studio-400 mb-2 tracking-[0.3em]">06. Spec Integration</h3>
                <h4 className="text-4xl font-serif text-[#111111] tracking-tight italic">Material Library.</h4>
            </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
          <label 
            htmlFor="fabric-upload" 
            className={`group flex flex-col items-center justify-center p-6 border border-dashed transition-all duration-300 ${disabled ? 'bg-studio-50 border-studio-200 text-studio-300' : 'bg-white border-studio-300 text-studio-500 hover:border-[#111111] hover:bg-studio-50 cursor-pointer shadow-sm'}`}
          >
            <div className="bg-white group-hover:bg-[#111111] p-5 rounded-full border border-studio-200 transition-all">
                <UploadIcon className="w-6 h-6 text-[#111111] group-hover:text-white" />
            </div>
            <span className="text-[9px] font-black mt-5 tracking-[0.2em] uppercase text-[#111111]">Upload Specific</span>
            <input id="fabric-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFabricUpload} disabled={disabled} />
          </label>

          {allFabrics.map(fabric => (
            <div 
              key={fabric.id} 
              onClick={() => !disabled && onFabricSelect(fabric)} 
              className={`group relative overflow-hidden cursor-pointer transition-all duration-500 transform border-2 ${selectedFabric?.id === fabric.id ? 'border-[#111111] z-10 scale-105 shadow-xl' : 'border-transparent hover:border-studio-200 hover:shadow-sm'} ${disabled ? disabledCardClasses : ''}`}
            >
              <img src={fabric.imageUrl} alt={fabric.name} className="w-full h-40 object-cover grayscale-[0.8] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-4 border-t border-studio-100/50">
                <span className="text-[#111111] text-[9px] font-black tracking-widest uppercase truncate block">{fabric.name}</span>
                <p className="text-studio-500 text-[8px] uppercase tracking-widest mt-1">Stock Standard</p>
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