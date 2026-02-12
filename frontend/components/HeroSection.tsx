import React from 'react';

export default function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-[#FDFCFB] px-6 lg:px-20 overflow-hidden">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-stone-200/40 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-100/30 blur-[100px]" />
      </div>

      <div className="container mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10 py-20 lg:py-0">
        
        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-center text-center lg:text-left">
          <div className="inline-block self-center lg:self-start px-3 py-1 mb-6 text-[9px] font-bold tracking-[0.25em] text-blue-600 uppercase bg-blue-50/50 border border-blue-100/50 rounded-full">
            The New Era of Workflow
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#3C2A1A] leading-[1.15] mb-6 tracking-tight">
            The Bridge Between <br />
            <span className="italic text-[#8B735B] bg-gradient-to-r from-[#8B735B] to-[#3C2A1A] bg-clip-text text-transparent">
              AI & Your Inbox.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed font-light">
            Eliminate copy-paste fatigue. Architect professional drafts with AI, 
            verify recipients, and dispatch instantly—all in one workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-[#3C2A1A] text-white px-10 py-5 rounded-xl font-bold text-lg shadow-[0_15px_40px_rgba(60,42,26,0.15)] hover:-translate-y-1 hover:bg-[#523D2B] transition-all duration-300 active:scale-95"
            >
              Enter the Workspace
            </button>
            <div className="text-left">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                 Zero Setup <br /> 
                 <span className="text-blue-500">Pure Efficiency</span>
               </p>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT: THE COMPONENT CARD */}
        <div className="relative w-full flex justify-center lg:justify-end animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Subtle Glow behind card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-50/50 blur-3xl rounded-full" />

          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100 relative w-full max-w-md">
            
            {/* COMPACT VERIFIED BADGE */}
            <div className="absolute -top-5 -right-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg animate-bounce shadow-blue-100">
               <span className="text-[10px] font-black flex items-center gap-1.5 uppercase tracking-wider">
                 <span className="text-sm">✓</span> Verified
               </span>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">Handshaking API...</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                </div>
              </div>

              <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                 <span className="block text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-2">Deliverability Score</span>
                 <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-serif text-[#3C2A1A]">0.98</span>
                    <span className="text-lg text-slate-300 font-serif">/ 1.0</span>
                 </div>
              </div>

              <div className="space-y-3">
                <div className="h-[1px] bg-slate-100 w-full" />
                <p className="text-xs text-slate-400 italic leading-relaxed">
                  Architecture validated for <br/>
                  <span className="text-blue-600 not-italic font-semibold font-mono">testingbrook@gmail.com</span>
                </p>
              </div>

              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-full h-full bg-blue-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-slate-300 opacity-50">
        <span className="text-[8px] font-bold uppercase tracking-[0.4em]">Scroll</span>
        <div className="w-px h-6 bg-slate-200" />
      </div>
    </section>
  );
}