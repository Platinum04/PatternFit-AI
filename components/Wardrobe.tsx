import React from 'react';
import { SavedFit, Collection, StylistComment } from '../types';
import { TrashIcon, WardrobeIcon, SparklesIcon } from './Icons';

interface WardrobeProps {
  fits: SavedFit[];
  onClose: () => void;
  onSelectFit: (fit: SavedFit) => void;
  onDeleteFit: (fitId: string) => void;
  collections: Collection[];
  onSaveCollection: (collection: Collection) => void;
  onDeleteCollection: (id: string) => void;
  onAddComment: (fitId: string, comment: StylistComment) => void;
}

const Wardrobe: React.FC<WardrobeProps> = ({ 
    fits, onClose, onSelectFit, onDeleteFit,
    collections, onSaveCollection, onDeleteCollection, onAddComment
}) => {
  const [activeTab, setActiveTab] = React.useState<'fits' | 'moodboards'>('fits');
  const [isCreatingCollection, setIsCreatingCollection] = React.useState(false);
  const [newCollectionName, setNewCollectionName] = React.useState('');

  const handleDelete = (e: React.MouseEvent, fitId: string) => {
    e.stopPropagation(); 
    if (window.confirm('Are you sure you want to delete this fitting?')) {
      onDeleteFit(fitId);
    }
  };

  const handleCreateCollection = () => {
      if (!newCollectionName.trim()) return;
      const newCol: Collection = {
          id: `col_${Date.now()}`,
          name: newCollectionName.trim(),
          fitIds: [],
          createdAt: new Date().toISOString()
      };
      onSaveCollection(newCol);
      setNewCollectionName('');
      setIsCreatingCollection(false);
  };

  const handleGetStylistFeedback = async (fit: SavedFit) => {
      const comment: StylistComment = {
          id: `comment_${Date.now()}`,
          author: 'Expert Stylist',
          content: `${fit.feedback.styleTip} This ${fit.style.name} in ${fit.fabric.name} is a bold and sophisticated choice for your frame.`,
          createdAt: new Date().toISOString()
      };
      onAddComment(fit.id, comment);
      alert("Style consultation complete! Check your fit for the expert comment.");
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-5xl h-[90vh] bg-white rounded-4xl shadow-2xl flex flex-col border border-premium-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-6 border-b border-premium-100 bg-premium-50/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <WardrobeIcon className="w-8 h-8 text-accent" />
              <h2 className="text-3xl font-serif text-premium-900 tracking-wide">Studio Curation</h2>
            </div>
            <button onClick={onClose} className="text-premium-400 hover:text-premium-900 text-3xl font-light transition-colors">&times;</button>
          </div>
          
          <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab('fits')}
                className={`pb-2 text-sm font-bold tracking-widest uppercase transition-all border-b-2 ${activeTab === 'fits' ? 'border-accent text-premium-900' : 'border-transparent text-premium-400 hover:text-premium-600'}`}
              >
                  All Designs
              </button>
              <button 
                onClick={() => setActiveTab('moodboards')}
                className={`pb-2 text-sm font-bold tracking-widest uppercase transition-all border-b-2 ${activeTab === 'moodboards' ? 'border-accent text-premium-900' : 'border-transparent text-premium-400 hover:text-premium-600'}`}
              >
                  Moodboards
              </button>
          </div>
        </header>

        <div className="grow p-6 overflow-y-auto bg-white">
          {activeTab === 'fits' ? (
              fits.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <WardrobeIcon className="w-24 h-24 text-premium-100" />
                  <h3 className="mt-4 text-xl font-medium text-premium-400 italic">No designs saved yet.</h3>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {fits.map(fit => (
                    <div 
                      key={fit.id} 
                      className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-premium-100"
                      onClick={() => onSelectFit(fit)}
                    >
                      <img 
                        src={`data:image/jpeg;base64,${fit.generatedImageBase64}`} 
                        alt={fit.style.name} 
                        className="w-full h-full object-cover aspect-3/4 transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <p className="font-bold text-white text-xs tracking-widest uppercase">{fit.style.name}</p>
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleGetStylistFeedback(fit); }}
                            className="mt-2 w-full py-1 text-[10px] bg-accent text-white flex items-center justify-center gap-1 rounded hover:bg-accent-dark transition-colors"
                         >
                             <SparklesIcon className="w-3 h-3" /> Get Stylist Review
                         </button>
                      </div>
                      
                      <button 
                        onClick={(e) => handleDelete(e, fit.id)} 
                        className="absolute top-3 right-3 p-2 bg-black/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 shadow-lg"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>

                      {fit.stylistComments && fit.stylistComments.length > 0 && (
                          <div className="absolute top-3 left-3 bg-accent text-white rounded-full p-1.5 shadow-lg animate-pulse">
                              <SparklesIcon className="w-3 h-3" />
                          </div>
                      )}
                    </div>
                  ))}
                </div>
              )
          ) : (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-premium-500 text-sm font-light italic">Curate your favorite designs into thematic moodboards.</p>
                    <button 
                        onClick={() => setIsCreatingCollection(true)}
                        className="px-4 py-2 bg-premium-900 text-white text-xs font-bold rounded-lg hover:bg-premium-800 transition-all shadow-md"
                    >
                        + NEW MOODBOARD
                    </button>
                </div>

                {isCreatingCollection && (
                    <div className="mb-8 p-4 bg-premium-50 rounded-2xl border border-premium-200 animate-fade-in">
                        <input 
                            value={newCollectionName}
                            onChange={e => setNewCollectionName(e.target.value)}
                            placeholder="e.g., Wedding Season 2026"
                            className="w-full bg-white border border-premium-200 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent mb-3"
                        />
                        <div className="flex gap-2">
                             <button onClick={handleCreateCollection} className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-lg">Create</button>
                             <button onClick={() => setIsCreatingCollection(false)} className="px-4 py-2 text-xs font-bold text-premium-500">Cancel</button>
                        </div>
                    </div>
                )}

                {collections.length === 0 ? (
                    <div className="grow flex flex-col items-center justify-center text-center opacity-40">
                         <div className="w-24 h-24 border-2 border-dashed border-premium-300 rounded-3xl mb-4" />
                         <p className="text-sm">No moodboards created yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {collections.map(col => (
                            <div key={col.id} className="p-6 bg-premium-50 rounded-4xl border border-premium-100 flex justify-between items-center group hover:border-accent hover:bg-white transition-all cursor-pointer">
                                <div>
                                    <h4 className="font-serif text-lg text-premium-900">{col.name}</h4>
                                    <p className="text-[10px] text-premium-400 uppercase tracking-widest mt-1">{col.fitIds.length} ITEMS</p>
                                </div>
                                <button onClick={() => onDeleteCollection(col.id)} className="opacity-0 group-hover:opacity-100 p-2 text-premium-300 hover:text-red-500 transition-all">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wardrobe;
