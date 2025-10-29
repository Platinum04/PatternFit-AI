import React, { useState, useEffect } from 'react';

interface FabricNameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
}

const FabricNameModal: React.FC<FabricNameModalProps> = ({ isOpen, onClose, onSave }) => {
    const [fabricName, setFabricName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFabricName(''); // Reset name when modal opens
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSave = () => {
        if (fabricName.trim()) {
            onSave(fabricName.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-slate-800 text-center mb-4">Name Your Fabric</h2>
                <p className="text-sm text-slate-500 text-center mb-6">Give your custom fabric a name to save it to your collection.</p>
                <div>
                    <label htmlFor="fabricName" className="block text-sm font-medium text-slate-700 mb-1">
                        Fabric Name
                    </label>
                    <input
                        type="text"
                        id="fabricName"
                        value={fabricName}
                        onChange={(e) => setFabricName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., Green Silk Ankara"
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        autoFocus
                    />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!fabricName.trim()}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Save Fabric
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FabricNameModal;
