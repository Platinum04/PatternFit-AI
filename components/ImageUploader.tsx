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

    if (file.size > 10 * 1024 * 1024) { // 10MB limit (Studio Grade)
      setError('File too large for studio processing. Limit is 10MB.');
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
        setError('Could not read the source file.');
      }
    };
    reader.onerror = () => {
      setError('Error reading file.');
    };
    reader.readAsDataURL(file);
    
    event.target.value = '';

  }, [onUpload]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         <label
            htmlFor="image-upload"
            className={`group relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-[2rem] transition-all duration-500
            ${disabled
              ? 'bg-studio-100 border-studio-200 text-studio-300 cursor-not-allowed'
              : 'bg-white border-studio-200 text-studio-900 hover:border-brand hover:bg-studio-50 cursor-pointer shadow-sm hover:shadow-2xl'
            }`}
          >
            <div className="bg-studio-100 group-hover:bg-brand/10 p-5 rounded-full mb-4 transition-all">
                <UploadIcon className="w-8 h-8 text-studio-500 group-hover:text-brand" />
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">{fileName || 'LOAD_BASE_IMAGE'}</span>
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
            className={`group relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-[2rem] transition-all duration-500
            ${disabled
              ? 'bg-studio-100 border-studio-200 text-studio-300 cursor-not-allowed'
              : 'bg-white border-studio-200 text-studio-900 hover:border-brand hover:bg-studio-50 cursor-pointer shadow-sm hover:shadow-2xl'
            }`}
          >
              <div className="bg-studio-100 group-hover:bg-brand/10 p-5 rounded-full mb-4 transition-all">
                  <CameraIcon className="w-8 h-8 text-studio-500 group-hover:text-brand" />
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">CAPTURE_LIVE_SOURCE</span>
          </button>
      </div>
       {fileName && <p className="text-[9px] text-studio-400 font-mono text-center tracking-widest uppercase italic">Active_Buffer: {fileName}</p>}
      {error && <p className="text-[9px] text-red-500 font-black text-center tracking-[0.25em] uppercase animate-shake">{error}</p>}
    </div>
  );
};

export default ImageUploader;
