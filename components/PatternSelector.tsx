import React, { useCallback, useMemo } from 'react';
import { Fabric, Style, Gender } from '../types';
import { FABRICS, STYLES } from '../constants';
import { UploadIcon } from './Icons';

interface GarmentSelectorProps {
  selectedGender: Gender | null;
  onGenderSelect: (gender: Gender) => void;
  selectedStyle: Style | null;
  onStyleSelect: (style: Style) => void;
  selectedFabric: Fabric | null;
  onFabricSelect: (fabric: Fabric) => void;
}

const GarmentSelector: React.FC<GarmentSelectorProps> = ({ 
  selectedGender, onGenderSelect, 
  selectedStyle, onStyleSelect, 
  selectedFabric, onFabricSelect 
}) => {
  const handleCustomFabricUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Invalid file type. Please upload a JPG, PNG, or WEBP image for the pattern.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File is too large. Please upload an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      if (base64String) {
        const customFabric: Fabric = {
          id: `custom-${Date.now()}`,
          name: 'Custom Fabric',
          imageUrl: URL.createObjectURL(file),
          base64: base64String,
          mimeType: file.type,
        };
        onFabricSelect(customFabric);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }, [onFabricSelect]);

  const availableStyles = useMemo(() => {
    if (!selectedGender) return [];
    return STYLES.filter(style => style.gender === selectedGender);
  }, [selectedGender]);

  const isCustomFabricSelected = selectedFabric?.id.startsWith('custom-');

  return (
    <div className="space-y-8">
      {/* Step 1: Gender Selection */}
      <div>
        <h2 className="text-xl font-bold text-slate-700 mb-4">1. Choose a Category</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onGenderSelect('male')}
            className={`p-4 rounded-lg border-4 font-bold text-lg transition-all duration-200 ${selectedGender === 'male' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-transparent bg-slate-100 hover:border-blue-300'}`}
          >
            Men's Styles
          </button>
          <button
            onClick={() => onGenderSelect('female')}
            className={`p-4 rounded-lg border-4 font-bold text-lg transition-all duration-200 ${selectedGender === 'female' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-transparent bg-slate-100 hover:border-blue-300'}`}
          >
            Women's Styles
          </button>
        </div>
      </div>

      {/* Step 2: Style Selection */}
      {selectedGender && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-700 mb-4">2. Select Your Style</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {availableStyles.map((style) => (
              <div
                key={style.id}
                onClick={() => onStyleSelect(style)}
                className={`cursor-pointer rounded-lg overflow-hidden border-4 transition-all duration-200 transform hover:scale-105 ${
                  selectedStyle?.id === style.id ? 'border-blue-500 shadow-xl' : 'border-transparent hover:border-blue-300'
                }`}
              >
                <img src={style.imageUrl} alt={style.name} className="w-full h-40 object-cover" />
                <div className={`p-3 text-center font-semibold ${selectedStyle?.id === style.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {style.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Fabric Selection */}
      {selectedStyle && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-700 mb-4">3. Pick a Fabric</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {FABRICS.map((fabric) => (
              <div
                key={fabric.id}
                onClick={() => onFabricSelect(fabric)}
                className={`cursor-pointer rounded-lg overflow-hidden border-4 transition-all duration-200 transform hover:scale-105 ${
                  selectedFabric?.id === fabric.id ? 'border-blue-500 shadow-xl' : 'border-transparent hover:border-blue-300'
                }`}
              >
                <img src={fabric.imageUrl} alt={fabric.name} className="w-full h-32 object-cover" />
                <div className={`p-2 text-center font-semibold text-sm ${selectedFabric?.id === fabric.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {fabric.name}
                </div>
              </div>
            ))}
            
            <div onClick={() => { if (isCustomFabricSelected) document.getElementById('custom-fabric-upload')?.click(); }} className="h-full">
              {!isCustomFabricSelected ? (
                  <label
                    htmlFor="custom-fabric-upload"
                    className="cursor-pointer rounded-lg overflow-hidden border-4 border-transparent hover:border-blue-300 h-full flex flex-col transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="flex-grow w-full h-32 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-600">
                      <UploadIcon className="w-8 h-8 mb-2" />
                      <span className="font-semibold text-center px-2 text-sm">Upload Fabric</span>
                    </div>
                    <div className="p-2 text-center font-semibold bg-slate-100 text-slate-700 text-sm">
                      Custom
                    </div>
                  </label>
                ) : (
                  <div className="cursor-pointer rounded-lg overflow-hidden border-4 border-blue-500 shadow-xl h-full flex flex-col">
                    <img src={selectedFabric.imageUrl} alt={selectedFabric.name} className="w-full h-32 object-cover" />
                    <div className="p-2 text-center font-semibold bg-blue-500 text-white text-sm">
                      {selectedFabric.name}
                      <span className="block font-normal text-xs">(Click to change)</span>
                    </div>
                  </div>
                )}
              <input
                id="custom-fabric-upload"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleCustomFabricUpload}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GarmentSelector;
