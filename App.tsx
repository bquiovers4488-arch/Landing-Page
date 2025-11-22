import React, { useState } from 'react';
import StarField from './components/StarField';
import ClaimSubmission from './components/ClaimSubmission';
import Labs from './components/Labs';
import PortalLogin from './components/PortalLogin';
import { AppView } from './types';
import { FileText, Microscope, ShieldCheck, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);

  // Landing Nav (with Login)
  const renderLandingNav = () => (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/80 border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-tighter">ER</span>
          </div>
          <span className="text-lg md:text-xl font-light tracking-[0.2em] text-white whitespace-nowrap">
            ESTIMATE RELIANCE
          </span>
        </div>
        <button 
          onClick={() => setView(AppView.PORTAL)}
          className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-all"
        >
          Login
        </button>
      </div>
    </nav>
  );

  // Internal Nav (with Back button)
  const renderInternalNav = () => (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/50 border-b border-white/10 px-6 py-4 flex justify-between items-center">
      <div 
        className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setView(AppView.LANDING)}
      >
        <div className="w-8 h-8 rounded-sm bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center">
             <span className="text-white font-bold text-xs tracking-tighter">ER</span>
        </div>
        <span className="text-lg font-light tracking-[0.2em] text-white whitespace-nowrap">
          ESTIMATE RELIANCE
        </span>
      </div>
      <button 
        onClick={() => setView(AppView.LANDING)}
        className="flex items-center px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-sm text-slate-300"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>
    </nav>
  );

  const renderContent = () => {
    switch (view) {
      case AppView.CLAIMS:
        return <ClaimSubmission />;
      case AppView.LABS:
        return <Labs />;
      case AppView.PORTAL:
        return <PortalLogin />;
      default:
        return (
          <>
            {/* Hero Section */}
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20">
              <div className="text-center max-w-5xl mx-auto animate-float">
                <h1 className="text-6xl md:text-8xl font-thin tracking-[0.15em] mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-teal-200 drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                  ESTIMATE RELIANCE
                </h1>
                <div className="h-px w-40 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-8"></div>
                <p className="text-xl md:text-2xl text-slate-300 font-light tracking-wide mb-12 max-w-3xl mx-auto leading-relaxed">
                  Professional insurance restoration estimates, supplements, and creative marketing solutions—powered by AI.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={() => setView(AppView.CLAIMS)}
                    className="px-10 py-5 text-lg font-medium bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-2xl shadow-indigo-600/30 transition-all transform hover:scale-105"
                  >
                    Submit a Claim →
                  </button>
                  <button 
                    onClick={() => setView(AppView.LABS)}
                    className="px-10 py-5 text-lg font-light border border-teal-500/50 hover:border-teal-400 text-teal-100 hover:bg-teal-500/10 rounded-xl transition-all"
                  >
                    Explore Services
                  </button>
                </div>
              </div>
            </div>

            {/* Service Cards - Now Only 2 */}
            <div className="px-4 py-20 max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Card 1: Claims */}
                <button
                  onClick={() => setView(AppView.CLAIMS)}
                  className="group relative h-96 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 border border-white/10 hover:border-indigo-400/50 bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700">
                    <div className="w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
                  </div>
                  <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 mb-6 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
                      <FileText className="w-10 h-10 text-indigo-300" />
                    </div>
                    <h3 className="text-2xl font-medium text-white mb-3 tracking-wide">CLAIMS SUBMISSION</h3>
                    <p className="text-sm text-indigo-200/70 mb-4 max-w-sm">
                      Upload insurance scopes, denials, and photos. Get professional analysis and supplement generation.
                    </p>
                    <span className="text-xs text-indigo-300/50 uppercase tracking-widest">Insurance Restoration</span>
                  </div>
                </button>

                {/* Card 2: Labs */}
                <button
                  onClick={() => setView(AppView.LABS)}
                  className="group relative h-96 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 border border-white/10 hover:border-teal-400/50 bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700">
                    <div className="w-64 h-64 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors" />
                  </div>
                  <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 mb-6 rounded-full bg-teal-500/10 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors border border-teal-500/20">
                      <Microscope className="w-10 h-10 text-teal-300" />
                    </div>
                    <h3 className="text-2xl font-medium text-white mb-3 tracking-wide">CREATIVE LABS</h3>
                    <p className="text-sm text-teal-200/70 mb-4 max-w-sm">
                      Generate professional logos, marketing materials, and compelling copy using AI-powered design tools.
                    </p>
                    <span className="text-xs text-teal-300/50 uppercase tracking-widest">Marketing & Design</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Optional: Why Estimate Reliance Section */}
            <div className="px-4 py-16 max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-light text-slate-200 tracking-wide mb-4">Why Estimate Reliance?</h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-teal-400 to-transparent mx-auto"></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-slate-900/40 backdrop-blur-sm p-8 rounded-xl border border-white/5">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-lg font-medium text-white mb-2">Fast Turnaround</h3>
                  <p className="text-sm text-slate-400">AI-powered analysis delivers results in minutes, not days.</p>
                </div>
                
                <div className="bg-slate-900/40 backdrop-blur-sm p-8 rounded-xl border border-white/5">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-lg font-medium text-white mb-2">Expert Quality</h3>
                  <p className="text-sm text-slate-400">Professional-grade estimates and supplements that adjusters respect.</p>
                </div>
                
                <div className="bg-slate-900/40 backdrop-blur-sm p-8 rounded-xl border border-white/5">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-lg font-medium text-white mb-2">Transparent Pricing</h3>
                  <p className="text-sm text-slate-400">Choose your service level—from automated to hands-on expert review.</p>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-slate-950">
      <StarField />
      
      {/* Ambient Music Indicator */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-4 opacity-30 hover:opacity-100 transition-opacity">
        <div className="text-[10px] uppercase tracking-widest text-slate-400">Ambience</div>
        <div className="flex space-x-1 h-3 items-end">
            <div className="w-0.5 bg-teal-500 h-1.5 animate-[pulse_1s_infinite]"></div>
            <div className="w-0.5 bg-teal-500 h-3 animate-[pulse_1.5s_infinite]"></div>
            <div className="w-0.5 bg-teal-500 h-2 animate-[pulse_1.2s_infinite]"></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {view === AppView.LANDING ? renderLandingNav() : renderInternalNav()}
        <main className="flex-grow flex flex-col">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;