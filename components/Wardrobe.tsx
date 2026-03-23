import React from 'react';
import { SavedFit, Collection, StylistComment } from '../types';
import { TrashIcon, WardrobeIcon, SparklesIcon, TailorIcon } from './Icons';

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
    if (window.confirm('Permanent deletion of this design record?')) {
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
          author: 'Studio Expert',
          content: `${fit.feedback.styleTip} This ${fit.style.name} in ${fit.fabric.name} is a high-precision bespoke choice for your silhouette.`,
          createdAt: new Date().toISOString()
      };
      onAddComment(fit.id, comment);
  };

  return (
    <div className="fixed inset-0 bg-studio-900/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade" onClick={onClose}>
      <div 
        className="w-full max-w-6xl h-[85vh] bg-white rounded-4xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col border border-studio-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-8 border-b border-studio-100 bg-studio-50/50">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-studio-900 p-2.5 rounded-xl shadow-lg">
                <TailorIcon className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-studio-900 tracking-tight italic">Studio Library</h2>
                <p className="text-[10px] text-studio-400 font-black tracking-[0.3em] uppercase">PROJECT_ARCHIVE_VER_2.4</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-studio-100 rounded-full transition-colors group">
                <div className="text-studio-300 group-hover:text-studio-900 text-3xl font-light leading-none">&times;</div>
            </button>
          </div>
          
          <div className="flex gap-10">
              <button 
                onClick={() => setActiveTab('fits')}
                className={`pb-4 text-[11px] font-black tracking-[0.3em] uppercase transition-all border-b-2 ${activeTab === 'fits' ? 'border-brand text-studio-900' : 'border-transparent text-studio-400 hover:text-studio-600'}`}
              >
                  01. ALL_PROJECTS
              </button>
              <button 
                onClick={() => setActiveTab('moodboards')}
                className={`pb-4 text-[11px] font-black tracking-[0.3em] uppercase transition-all border-b-2 ${activeTab === 'moodboards' ? 'border-brand text-studio-900' : 'border-transparent text-studio-400 hover:text-studio-600'}`}
              >
                  02. COLLECTIONS
              </button>
          </div>
        </header>

        <div className="grow p-8 overflow-y-auto bg-studio-50/20">
          {activeTab === 'fits' ? (
              fits.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 opacity-40">
                  <img src="C:/Users/User/.gemini/antigravity/brain/45572cf3-ba23-4b9e-8380-c5dcea8308c0/studio_empty_state_cad_1774252153238.png" className="w-80 opacity-50 contrast-125" alt="Empty Library" />
                  <h3 className="text-xs font-black tracking-widest text-studio-400 uppercase">NO_ACTIVE_PROJECTS_IN_BUFFER</h3>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                  {fits.map(fit => (
                    <div 
                      key={fit.id} 
                      className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700 bg-white border border-studio-100"
                      onClick={() => onSelectFit(fit)}
                    >
                      <img 
                        src={`data:image/jpeg;base64,${fit.generatedImageBase64}`} 
                        alt={fit.style.name} 
                        className="w-full aspect-[3/4] object-cover filter brightness-95 group-hover:brightness-105 transition-all duration-700"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-studio-900/90 via-studio-900/40 to-transparent p-5 translate-y-2 group-hover:translate-y-0 transition-transform">
                         <p className="font-black text-studio-50 text-[10px] tracking-widest uppercase">{fit.style.name}</p>
                         <p className="text-[8px] text-studio-400 tracking-tighter mt-1 italic">{new Date(fit.createdAt).toLocaleDateString()}</p>
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleGetStylistFeedback(fit); }}
                            className="mt-4 w-full py-2 text-[9px] font-black tracking-widest bg-brand text-white flex items-center justify-center gap-2 rounded-lg hover:bg-white hover:text-brand transition-all uppercase"
                         >
                             <SparklesIcon className="w-3 h-3" /> EXPERT_REVIEW
                         </button>
                      </div>
                      
                      <button 
                        onClick={(e) => handleDelete(e, fit.id)} 
                        className="absolute top-4 right-4 p-2.5 bg-studio-900/20 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 shadow-lg"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>

                      {fit.stylistComments && fit.stylistComments.length > 0 && (
                          <div className="absolute top-4 left-4 bg-brand text-white rounded-full p-2 shadow-xl animate-pulse ring-4 ring-brand/20">
                              <SparklesIcon className="w-3 h-3" />
                          </div>
                      )}
                    </div>
                  ))}
                </div>
              )
          ) : (
            <div className="h-full flex flex-col max-w-5xl mx-auto w-full">
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-studio-100">
                    <div>
                        <h3 className="text-xl font-serif text-studio-900">Project Collections</h3>
                        <p className="text-[10px] text-studio-400 font-black tracking-widest uppercase mt-1">ORGANIZING_STUDIO_VARIATIONS</p>
                    </div>
                    <button 
                        onClick={() => setIsCreatingCollection(true)}
                        className="px-6 py-3 bg-studio-900 text-white text-[10px] font-black tracking-[0.2em] rounded-full hover:bg-brand transition-all shadow-xl uppercase"
                    >
                        + NEW_COLLECTION
                    </button>
                </div>

                {isCreatingCollection && (
                    <div className="mb-12 p-8 bg-white rounded-4xl border border-studio-200 shadow-2xl animate-fade">
                        <input 
                            value={newCollectionName}
                            onChange={e => setNewCollectionName(e.target.value)}
                            placeholder="COLLECTION_NAME"
                            className="w-full bg-studio-50 border-2 border-studio-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand mb-6 font-black tracking-widest uppercase text-xs"
                        />
                        <div className="flex gap-4">
                             <button onClick={handleCreateCollection} className="px-8 py-3 bg-brand text-white text-[10px] font-black rounded-full tracking-widest uppercase shadow-lg">INITIALIZE</button>
                             <button onClick={() => setIsCreatingCollection(false)} className="px-8 py-3 text-[10px] font-black text-studio-400 tracking-widest uppercase hover:text-studio-900">ABORT</button>
                        </div>
                    </div>
                )}

                {collections.length === 0 ? (
                    <div className="grow flex flex-col items-center justify-center text-center space-y-8 opacity-40">
                         <img src="C:/Users/User/.gemini/antigravity/brain/45572cf3-ba23-4b9e-8380-c5dcea8308c0/studio_empty_state_cad_1774252153238.png" className="w-64 opacity-50 grayscale" alt="Empty Collections" />
                         <p className="text-[10px] font-black tracking-widest text-studio-400 uppercase">WORKSPACE_COLLECTIONS_UNDEFINED</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {collections.map(col => (
                            <div key={col.id} className="p-8 bg-white rounded-4xl border border-studio-100 flex justify-between items-center group hover:border-brand hover:shadow-2xl transition-all cursor-pointer">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-studio-50 rounded-2xl flex items-center justify-center font-black text-studio-200 text-2xl group-hover:text-brand bg-opacity-50">
                                        #
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-xl text-studio-900 group-hover:italic transition-all">{col.name}</h4>
                                        <p className="text-[9px] text-brand font-black tracking-[0.3em] uppercase mt-2">{col.fitIds.length} VECTORS STORED</p>
                                    </div>
                                </div>
                                <button onClick={() => onDeleteCollection(col.id)} className="opacity-0 group-hover:opacity-100 p-3 bg-studio-50 text-studio-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl">
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
