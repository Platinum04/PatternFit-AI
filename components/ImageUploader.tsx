import React, { useCallback, useState } from 'react';
import { UploadIcon, CameraIcon } from './Icons';

interface ImageUploaderProps {
  onUpload: (file: File, base64: string, mimeType: string) => void;
  onTakePhoto: () => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, onTakePhoto, disabled }) => {
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
      setFileName('');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File is too large. Please upload an image under 5MB.');
      setFileName('');
      return;
    }

    setError(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      if (base64String) {
        onUpload(file, base64String, file.type);
      } else {
        setError('Could not read the image file.');
      }
    };
    reader.onerror = () => {
      setError('Error reading file.');
    };
    reader.readAsDataURL(file);
    
    event.target.value = '';

  }, [onUpload]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2">
         <label
            htmlFor="image-upload"
            className={`flex-1 w-full flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${disabled
              ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed'
              : 'bg-blue-50 border-blue-300 text-blue-600 hover:bg-blue-100 hover:border-blue-400'
            }`}
          >
            <UploadIcon className="w-8 h-8 mb-2" />
            <span className="font-semibold text-sm text-center">{fileName || 'Upload photo'}</span>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </label>

          <button
            type="button"
            onClick={onTakePhoto}
            disabled={disabled}
            className={`flex-1 w-full flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${disabled
              ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed'
              : 'bg-blue-50 border-blue-300 text-blue-600 hover:bg-blue-100 hover:border-blue-400'
            }`}
          >
              <CameraIcon className="w-8 h-8 mb-2" />
              <span className="font-semibold text-sm text-center">Take a photo</span>
          </button>
      </div>
       {fileName && <p className="text-xs text-slate-500 mt-2 text-center">Selected: {fileName}</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;
