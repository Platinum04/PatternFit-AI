import React from 'react';
import { WardrobeIcon, InfoIcon } from './Icons';

const logoUrl = "/assets/logo.png";

interface HeaderProps {
  onWardrobeClick?: () => void;
  onAboutClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onWardrobeClick, onAboutClick }) => (
  <header className="relative w-full text-center flex flex-col items-center">
    <img src={logoUrl} alt="PatternFit AI Logo" className="h-20 sm:h-24 object-contain" />
    <p className="mt-3 text-lg text-premium-600 max-w-2xl mx-auto">
      Your personal AI tailor for a perfect fit, every time. Get a hyper-realistic virtual try-on in seconds.
    </p>
    <div className="absolute top-0 right-0 mt-2 mr-2 flex gap-2">
        {onAboutClick && (
             <button
                onClick={onAboutClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-premium-100 text-premium-700 font-semibold rounded-lg shadow-sm hover:bg-premium-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-900 transition"
                aria-label="About this project"
            >
                <InfoIcon className="w-5 h-5" />
                <span className="hidden sm:inline">About</span>
            </button>
        )}
        {onWardrobeClick && (
            <button
                onClick={onWardrobeClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-premium-100 text-premium-700 font-semibold rounded-lg shadow-sm hover:bg-premium-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-900 transition"
                aria-label="Open My Wardrobe"
            >
                <WardrobeIcon className="w-5 h-5" />
                <span className="hidden sm:inline">My Wardrobe</span>
            </button>
        )}
    </div>
  </header>
);

export default Header;
