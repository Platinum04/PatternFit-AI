import React from 'react';
import { WardrobeIcon, InfoIcon, TailorIcon } from './Icons';

interface HeaderProps {
  onWardrobeClick?: () => void;
  onAboutClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onWardrobeClick, onAboutClick }) => (
  <header className="fixed top-0 left-0 right-0 z-[100] h-16 bg-studio-900 text-white flex items-center justify-between px-6 border-b border-studio-800 backdrop-blur-md bg-opacity-95">
    <div className="flex items-center gap-3">
        <TailorIcon className="w-8 h-8 text-brand" />
        <div className="flex flex-col">
            <h1 className="text-xl font-serif tracking-[0.2em] font-medium leading-tight">PATTERNFIT <span className="text-brand">AI</span></h1>
            <span className="text-[10px] tracking-[0.3em] font-bold text-studio-400 uppercase">Virtual Tailor Studio</span>
        </div>
    </div>

    <div className="flex items-center gap-4">
        {onAboutClick && (
             <button
                onClick={onAboutClick}
                className="flex items-center justify-center p-2 rounded-lg hover:bg-studio-800 transition-colors text-studio-300 hover:text-white group"
                aria-label="Studio Information"
                title="About"
            >
                <InfoIcon className="w-5 h-5" />
            </button>
        )}
        {onWardrobeClick && (
            <button
                onClick={onWardrobeClick}
                className="flex items-center gap-2 px-4 py-2 bg-studio-800 text-white text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-studio-700 transition focus:outline-none focus:ring-1 focus:ring-brand border border-studio-700"
                aria-label="Open My Wardrobe"
            >
                <WardrobeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">My Wardrobe</span>
            </button>
        )}
    </div>
  </header>
);

export default Header;
