import React, { useEffect, useState } from 'react';
import { TailorIcon } from './Icons';
import { STYLES } from '../constants';

interface OnboardingProps {
  onStart: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      setScrolled(target.scrollTop > 50);
    };
    const scrollContainer = document.getElementById('landing-scroll-container');
    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="landing-scroll-container" className="fixed inset-0 z-[5000] bg-[#FAFAFA] overflow-y-auto overflow-x-hidden font-sans text-[#111111] selection:bg-brand/20">
      
      {/* Sticky Elegant Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TailorIcon className="w-6 h-6 text-[#111111]" />
            <span className="font-serif text-2xl tracking-wide italic font-bold">PatternFit<span className="text-brand">.ai</span></span>
          </div>
          <div className="hidden md:flex gap-10 text-xs font-bold tracking-[0.2em] uppercase text-gray-500">
            <a href="#vision" className="hover:text-gray-900 transition-colors">Vision</a>
            <a href="#process" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#studio" className="hover:text-gray-900 transition-colors">Studio</a>
          </div>
          <button 
            onClick={onStart}
            className="px-8 py-3 bg-[#111111] text-white text-[10px] font-black tracking-widest uppercase hover:bg-brand transition-colors duration-500 rounded-sm"
          >
            Enter Studio
          </button>
        </div>
      </nav>

      {/* Hero Section - Editorial Fashion Grid */}
      <header className="relative pt-40 pb-20 md:pt-56 md:pb-32 px-8 md:px-16 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Typography */}
          <div className="lg:col-span-6 z-10">
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-8 flex items-center gap-4">
              <span className="w-12 h-px bg-brand"></span>
              The Future of Bespoke
            </p>
            <h1 className="text-6xl md:text-8xl font-serif leading-[1.1] tracking-tight mb-10 text-[#111111]">
              Flawless Fit. <br />
              <span className="italic text-gray-400 font-light">Zero Guesswork.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-lg mb-12">
              Eliminate the anxiety of remote tailoring. We turn a single photo into precise tailoring measurements and true-to-life 3D visualizations before the fabric is ever cut.
            </p>
            <button 
              onClick={onStart}
              className="group flex items-center gap-6 text-[11px] font-black tracking-[0.3em] uppercase text-[#111111] hover:text-brand transition-colors"
            >
              Start Generating
              <span className="w-12 h-px bg-[#111111] group-hover:bg-brand group-hover:w-20 transition-all duration-500"></span>
            </button>
          </div>

          {/* Editorial Image Collage */}
          <div className="lg:col-span-6 relative h-[600px] w-full flex justify-center items-center">
              {/* Back Image (Gown) */}
              <div className="absolute right-0 top-0 w-3/5 h-[85%] overflow-hidden shadow-2xl z-0 transform translate-y-8 animate-fade" style={{ animationDelay: '0.2s' }}>
                <img src="/assets/studio/landing_gown_measured_1774259599110.png" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80" alt="Gown Specs" />
              </div>
              
              {/* Front Image (Kaftan) */}
              <div className="absolute left-0 bottom-0 w-[55%] h-[75%] border-8 border-[#FAFAFA] overflow-hidden shadow-2xl z-10 transform -translate-y-8 animate-fade" style={{ animationDelay: '0.4s' }}>
                <img src="/assets/studio/landing_kaftan_measured_1774259559085.png" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" alt="Kaftan Specs" />
              </div>
          </div>
        </div>
      </header>

      {/* The Process Section - Ultra Clean */}
      <section id="process" className="py-32 bg-white px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-serif text-[#111111] mb-6 tracking-tight">The <span className="italic text-brand">Process.</span></h2>
            <p className="text-gray-500 tracking-widest uppercase text-[10px] font-bold">How PatternFit guarantees precision</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-gray-100 pt-16">
            
            {/* Step 1 */}
            <div className="group">
              <span className="text-6xl font-serif text-gray-200 italic block mb-8 transition-colors group-hover:text-brand">01</span>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111111] mb-4">Snap & Upload</h3>
              <p className="text-gray-500 font-light leading-relaxed text-sm">
                Provide a simple full-body photo and enter your base height. No messy tape measure required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group">
              <span className="text-6xl font-serif text-gray-200 italic block mb-8 transition-colors group-hover:text-brand">02</span>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111111] mb-4">AI Magic Measure</h3>
              <p className="text-gray-500 font-light leading-relaxed text-sm">
                Our vision engine scans your proportions to securely extract pixel-perfect bust, waist, and hip parameters.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group">
              <span className="text-6xl font-serif text-gray-200 italic block mb-8 transition-colors group-hover:text-brand">03</span>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111111] mb-4">Virtual Try-on</h3>
              <p className="text-gray-500 font-light leading-relaxed text-sm">
                Apply real African textiles (Aso-Oke, Ankara) and complex embroidery over your 3D digital silhouette.
              </p>
            </div>

            {/* Step 4 */}
            <div className="group">
              <span className="text-6xl font-serif text-gray-200 italic block mb-8 transition-colors group-hover:text-brand">04</span>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111111] mb-4">Tailor Handover</h3>
              <p className="text-gray-500 font-light leading-relaxed text-sm">
                Your physical tailor receives exactly what you see: flawless blueprints and a perfect visual agreement.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-40 bg-[#111111] text-center px-8">
        <h2 className="text-5xl md:text-7xl font-serif text-white mb-10 tracking-tight italic">Ready to Design?</h2>
        <button 
            onClick={onStart}
            className="px-12 py-5 bg-white text-[#111111] text-[11px] font-black tracking-[0.3em] uppercase hover:bg-brand hover:text-white transition-all duration-500 rounded-sm shadow-2xl hover:-translate-y-2"
        >
            Enter Workspace
        </button>
      </section>

    </div>
  );
};

export default Onboarding;