import React from 'react';
import { SparklesIcon, TailorIcon } from './Icons';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-studio-900/40 backdrop-blur-md flex items-center justify-center z-[2000] p-4 animate-fade" 
            onClick={onClose}
        >
            <div 
                className="w-full max-w-2xl bg-white rounded-4xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden border border-studio-200"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-8 border-b border-studio-100 bg-studio-50/50">
                    <div className="flex items-center gap-4">
                        <div className="bg-brand p-2 rounded-xl">
                            <TailorIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif text-studio-900 tracking-tight italic">System Documentation</h2>
                            <p className="text-[10px] text-studio-400 font-black tracking-[0.3em] uppercase mt-1">CORE_ARCHITECTURE_VER_0.94</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-studio-100 rounded-full transition-colors group">
                        <div className="text-studio-300 group-hover:text-studio-900 text-3xl font-light leading-none">&times;</div>
                    </button>
                </header>
                
                <div className="grow p-10 overflow-y-auto max-h-[70vh] space-y-12">
                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black tracking-[0.2em] text-brand uppercase">01. PROJECT_SYNOPSIS</h3>
                        <p className="text-studio-600 leading-relaxed font-light">
                            PatternFit AI is a high-precision <span className="text-studio-900 font-bold underline decoration-brand/30">Virtual Tailoring Workspace</span> designed to bridge the gap between traditional bespoke craftsmanship and digital design. Using advanced computer vision and neural rendering, it simulates your fit in real-time.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black tracking-[0.2em] text-brand uppercase">02. SYSTEM_CAPABILITIES</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { title: 'PROPORTION_ENGINE', detail: 'Vision-based body measurements' },
                                { title: 'TEXTILE_SIMULATOR', detail: 'Neural texture mapping technology' },
                                { title: 'CURATION_ENGINE', detail: 'Studio project tracking & hub' },
                                { title: 'EXPORT_SUBSYSTEM', val: 'Professional PDF specifications' }
                            ].map(item => (
                                <div key={item.title} className="p-5 bg-studio-50 rounded-2xl border border-studio-100 group hover:border-brand/20 transition-all">
                                    <p className="text-[8px] font-black text-studio-400 tracking-widest uppercase mb-1">{item.title}</p>
                                    <p className="text-[10px] font-bold text-studio-900 uppercase opacity-80">{item.detail || (item as any).val}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-studio-900 p-8 rounded-4xl text-white space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="flex items-center gap-3">
                            <SparklesIcon className="w-5 h-5 text-brand" />
                            <h3 className="text-[9px] font-black tracking-[0.3em] uppercase">POWER_STATUS</h3>
                        </div>
                        <p className="text-sm font-serif italic opacity-80 leading-relaxed">"Integrating modern African aesthetics with high-precision digital tailoring workflows for the global fashion industry."</p>
                    </section>
                </div>
                
                <div className="p-8 border-t border-studio-100 flex justify-center bg-studio-50/20">
                    <button
                        onClick={onClose}
                        className="px-12 py-3 border-2 border-studio-900 rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:bg-studio-900 hover:text-white transition-all shadow-xl"
                    >
                        TERMINATE_VIEW
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
