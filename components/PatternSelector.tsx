import React, { useCallback, useMemo, useState } from 'react';
import { Fabric, Style, Gender } from '../types';
import { STYLES } from '../constants';
import { UploadIcon, CheckIcon, RefreshIcon } from './Icons';

interface GarmentSelectorProps {
  selectedGender: Gender | null;
  onGenderSelect: (gender: Gender) => void;
  selectedStyle: Style | null;
  onStyleSelect: (style: Style | null) => void;
  selectedFabric: Fabric | null;
  onFabricSelect: (fabric: Fabric | null) => void;
}

const FabricUploader: React.FC<{onSelect: (fabric: Fabric) => void}> = ({ onSelect }) => {
  const [fabricName, setFabricName] = useState('');
  const [fabricPreview, setFabricPreview] = useState<{file: File, base64: string, mimeType: string} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File is too large. Please upload an image under 5MB.');
      return;
    }
    setError(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      if (base64String) {
        setFabricPreview({ file, base64: base64String, mimeType: file.type });
      } else {
        setError('Could not read the image file.');
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }, []);

  const handleConfirm = () => {
    if (fabricPreview && fabricName) {
      onSelect({
        id: `custom-${Date.now()}`,
        name: fabricName,
        imageUrl: URL.createObjectURL(fabricPreview.file),
        base64: fabricPreview.base64,
        mimeType: fabricPreview.mimeType,
      });
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
      {!fabricPreview && (
        <label htmlFor="fabric-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition-colors">
          <UploadIcon className="w-8 h-8 text-slate-400 mb-2" />
          <span className="font-semibold text-slate-600">Click to upload fabric image</span>
          <span className="text-sm text-slate-500">PNG, JPG, WEBP up to 5MB</span>
          <input id="fabric-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
        </label>
      )}

      {fabricPreview && (
        <div className="space-y-3">
          <img src={URL.createObjectURL(fabricPreview.file)} alt="Fabric preview" className="w-full h-40 object-cover rounded-lg shadow-inner" />
          <input
            type="text"
            value={fabricName}
            onChange={(e) => setFabricName(e.target.value)}
            placeholder="Name your fabric (e.g., 'Blue Ankara')"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            aria-label="Fabric name"
          />
          <button 
            onClick={handleConfirm}
            disabled={!fabricName}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
          >
            <CheckIcon className="w-5 h-5" />
            Use This Fabric
          </button>
        </div>
      )}
       {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
};


const GarmentSelector: React.FC<GarmentSelectorProps> = ({ 
  selectedGender, onGenderSelect, 
  selectedStyle, onStyleSelect, 
  selectedFabric, onFabricSelect 
}) => {
  const availableStyles = useMemo(() => {
    if (!selectedGender) return [];
    return STYLES.filter(style => style.gender === selectedGender);
  }, [selectedGender]);
  
  const handleGenderSelection = (gender: Gender) => {
    onGenderSelect(gender);
    onStyleSelect(null);
    onFabricSelect(null);
  }

  return (
    <div className="space-y-8">
      {/* Step 1: Gender Selection */}
      <div>
        <h2 className="text-xl font-bold text-slate-700 mb-4">1. Choose a Category</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleGenderSelection('male')}
            className={`p-4 rounded-lg border-4 font-bold text-lg transition-all duration-200 ${selectedGender === 'male' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-transparent bg-slate-100 hover:border-blue-300'}`}
          >
            Men's Styles
          </button>
          <button
            onClick={() => handleGenderSelection('female')}
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
          <h2 className="text-xl font-bold text-slate-700 mb-4">3. Upload & Name Your Fabric</h2>
          {selectedFabric ? (
             <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="font-semibold text-green-800">Fabric Selected:</p>
              <p className="text-lg font-bold text-green-900">{selectedFabric.name}</p>
              <img src={selectedFabric.imageUrl} alt={selectedFabric.name} className="mt-2 w-32 h-32 object-cover rounded-md mx-auto shadow-sm" />
              <button onClick={() => onFabricSelect(null)} className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 font-semibold">
                <RefreshIcon className="w-4 h-4" />
                Change Fabric
              </button>
            </div>
          ) : (
            <FabricUploader onSelect={onFabricSelect} />
          )}
        </div>
      )}
    </div>
  );
};

export default GarmentSelector;
