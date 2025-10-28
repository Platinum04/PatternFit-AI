import React from 'react';
import { SavedFit } from '../types';
import { TrashIcon, WardrobeIcon } from './Icons';

interface WardrobeProps {
  fits: SavedFit[];
  onClose: () => void;
  onSelectFit: (fit: SavedFit) => void;
  onDeleteFit: (fitId: string) => void;
}

const Wardrobe: React.FC<WardrobeProps> = ({ fits, onClose, onSelectFit, onDeleteFit }) => {

  const handleDelete = (e: React.MouseEvent, fitId: string) => {
    e.stopPropagation(); // Prevent the click from selecting the fit
    if (window.confirm('Are you sure you want to delete this fitting?')) {
      onDeleteFit(fitId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <WardrobeIcon className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-800">My Virtual Wardrobe</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl font-light">&times;</button>
        </header>
        
        <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
          {fits.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <WardrobeIcon className="w-24 h-24 text-slate-300" />
              <h3 className="mt-4 text-xl font-semibold text-slate-600">Your wardrobe is empty.</h3>
              <p className="mt-2 text-slate-500">Generate a new fitting and save it to see it in your wardrobe.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {fits.map(fit => (
                <div 
                  key={fit.id} 
                  className="group relative rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                  onClick={() => onSelectFit(fit)}
                >
                  <img 
                    src={`data:image/png;base64,${fit.generatedImageBase64}`} 
                    alt={`Virtual try-on for ${fit.style.name}`} 
                    className="w-full h-full object-cover aspect-[3/4] transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                    <p className="font-bold text-white text-sm truncate">{fit.style.name}</p>
                    <p className="text-xs text-slate-200 truncate">{new Date(fit.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, fit.id)} 
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    aria-label="Delete fitting"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wardrobe;