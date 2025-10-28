import React from 'react';
import { SparklesIcon } from './Icons';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in" 
            onClick={onClose}
        >
            <div 
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="w-8 h-8 text-blue-600" />
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">About PatternFit AI</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl font-light">&times;</button>
                </header>
                
                <div className="flex-grow p-6 sm:p-8 overflow-y-auto max-h-[70vh] space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">The Project</h3>
                        <p className="text-slate-600 leading-relaxed">
                            <strong>PatternFit AI</strong> is a revolutionary virtual try-on application designed to eliminate the uncertainty and risk from the custom tailoring process. It addresses a common challenge in bespoke fashion: visualizing how a specific style, fabric, and design will look on <em>you</em> before it's made.
                        </p>
                         <p className="text-slate-600 leading-relaxed mt-2">
                           The experience is elevated by the <strong>AI Tailor's Assessment</strong>, which provides structured, expert feedback on the overall look, fit, fabric choice, and even offers practical style tips, making every user feel like they've had a personal consultation.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">Built With</h3>
                        <ul className="list-disc list-inside text-slate-600 space-y-2">
                            <li><strong>Frontend:</strong> A responsive and modern user interface built with <strong>React</strong> and styled using <strong>Tailwind CSS</strong>.</li>
                            <li>
                                <strong>Generative AI:</strong> Powered by the <strong>Google Gemini API</strong>.
                                <ul className="list-['-_'] list-inside ml-6 mt-1 text-sm">
                                     <li><strong><code>gemini-2.5-flash-image</code></strong> is used for the core virtual try-on, generating the photorealistic images.</li>
                                     <li><strong><code>gemini-2.5-flash</code></strong> is used to generate the structured, insightful feedback for the AI Tailor's Assessment.</li>
                                </ul>
                            </li>
                             <li><strong>State Management:</strong> Managed locally with React Hooks for a clean and efficient component-based architecture.</li>
                             <li><strong>Local Storage:</strong> The browser's <code>localStorage</code> is used to persist the user's "Wardrobe" and custom fabric uploads for a seamless return experience.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
