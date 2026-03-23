import React, { useEffect, useState } from 'react';
import { SparklesIcon, TailorIcon } from './Icons';

interface OnboardingProps {
  onStart: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
      // Trigger animations slightly after mount for a smooth entrance
      setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div className="fixed inset-0 z-5000 bg-white overflow-hidden flex flex-col md:flex-row font-sans selection:bg-brand/20">
      
      {/* Left Output - Typography & Action */}
      <div className={`w-full md:w-5/12 lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center h-full relative z-10 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
          
          <div className="absolute top-12 left-12 flex items-center gap-4">
              <div className="p-3 bg-studio-900 rounded-2xl shadow-xl">
                  <TailorIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-serif italic font-bold text-xl tracking-wide text-studio-900">PatternFit <span className="text-brand">AI</span></span>
          </div>

          <div className="mt-20 max-w-xl">
              
              <h1 className="text-5xl lg:text-7xl font-serif text-studio-900 leading-[1.1] tracking-tight mb-8">
                  True-to-life <br />
                  <span className="italic text-studio-600">Virtual Tailoring.</span>
              </h1>
              
              <p className="text-lg text-studio-500 font-light leading-relaxed mb-12 max-w-md">
                 Experience the industry-standard intersection of African bespoke craftsmanship and neural design rendering. Bring your technical specifications to life in stunning definition.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                  <button
                    onClick={onStart}
                    className="group relative px-10 py-5 bg-studio-900 text-white font-black text-xs tracking-widest uppercase overflow-hidden w-full sm:w-auto text-center"
                  >
                      <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <SparklesIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        Initialize Studio
                      </span>
                  </button>
                  <span className="text-[10px] font-mono tracking-widest text-studio-400 border border-studio-200 px-4 py-2 uppercase">Platform Live</span>
              </div>
          </div>

          {/* Technical Footer */}
          <div className="absolute bottom-12 left-12 flex gap-12 text-[9px] font-mono tracking-widest text-studio-300 uppercase">
              <div>
                  <span className="block text-studio-900 font-bold mb-1">Architecture</span>
                  <span>Neural_Cad_SYS</span>
              </div>
              <div>
                  <span className="block text-studio-900 font-bold mb-1">Render Status</span>
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online</span>
              </div>
          </div>
      </div>

      {/* Right Output - Hero Visual */}
      <div className={`relative w-full md:w-7/12 lg:w-1/2 h-full bg-studio-50 flex items-center justify-center overflow-hidden transition-all duration-1000 delay-300 ease-out border-l border-studio-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* Subtle CAD Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          {/* Tech lines */}
          <div className="absolute top-0 left-10 w-px h-full bg-studio-200/50"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-studio-200/50"></div>
          <div className="absolute top-[20%] right-10 flex items-center gap-2 text-[10px] font-mono tracking-widest text-studio-400 rotate-90 transform origin-top-right">
              VIEWPORT_RENDER_01
              <span className="w-8 h-px bg-studio-300"></span>
          </div>

          {/* High-Def Side-by-Side Measurement Layout */}
          <div className="relative w-full h-[85%] px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10">
              
              {/* Card - Men's Kaftan */}
              <div className="relative w-full md:w-1/2 max-w-[320px] aspect-[4/5] bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden border border-studio-200 transition-transform duration-700 hover:-translate-y-2 group">
                   <img 
                      src="/assets/studio/landing_kaftan_measured_1774259559085.png" 
                      alt="Men Kaftan Measurement Specifications" 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[2s]" 
                    />
                   <div className="absolute top-4 left-4 bg-brand/95 backdrop-blur-md px-3 py-1.5 text-[9px] font-mono tracking-widest text-white uppercase rounded-md z-10 shadow-lg">Spec_Profile_M</div>
              </div>

              {/* Card - Women's Gown (Slightly offset downward for an asymmetrical designer look) */}
              <div className="relative w-full md:w-1/2 max-w-[320px] aspect-[4/5] bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden border border-studio-200 transition-transform duration-700 hover:-translate-y-2 md:mt-16 group">
                   <img 
                      src="/assets/studio/landing_gown_measured_1774259599110.png" 
                      alt="Women Measurement Specifications" 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[2s]" 
                    />
                   <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 text-[9px] font-mono tracking-widest text-studio-900 border border-studio-200 uppercase rounded-md z-10 shadow-lg">Spec_Profile_F</div>
              </div>

              {/* Central Glow Effect */}
              <div className="absolute inset-0 bg-brand/5 blur-3xl rounded-full pointer-events-none -z-10 mix-blend-multiply"></div>
          </div>

      </div>

      <style>{`
          @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0px); }
          }
      `}</style>
    </div>
  );
};

export default Onboarding;