'use client';
import { useState } from 'react';
import { getAIDrafts } from '@/lib/api-client';
import { EmailDraft } from '@/types/email';

export default function EmailComposer({ onDraftsGenerated }: { onDraftsGenerated: (drafts: EmailDraft[]) => void }) {
  const [context, setContext] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!description || !context) return alert("Please fill in both fields");
    
    setIsGenerating(true);
    try {
      const drafts = await getAIDrafts(context, description);
      onDraftsGenerated(drafts);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    // We use h-full and flex-col to ensure it fits the container without scrolling
    <div className="h-full flex flex-col space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      
      {/* Recipient Context Section */}
      <div className="space-y-2 md:space-y-3 shrink-0">
        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-blue-600/70">
          Project Context
        </label>
        <div className="relative group">
          <input 
            type="text"
            placeholder="e.g. Hiring Manager at Google"
            className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 md:py-4 text-sm md:text-base font-medium placeholder:text-slate-300 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all shadow-sm"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          <div className="absolute inset-y-0 right-4 flex items-center opacity-20 group-focus-within:opacity-100 transition-opacity">
            <span className="text-xs">👤</span>
          </div>
        </div>
      </div>

      {/* Core Message Section - This grows to fill space but stays contained */}
      <div className="flex-grow flex flex-col space-y-2 md:space-y-3 overflow-hidden">
        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Core Objective
        </label>
        <div className="relative flex-grow">
          <textarea 
            placeholder="Describe your intent. Be as messy as you like..."
            className="w-full h-full p-4 md:p-6 bg-slate-50/50 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 focus:bg-white focus:border-blue-500/20 focus:ring-8 focus:ring-blue-50/30 outline-none transition-all resize-none text-slate-600 leading-relaxed text-sm md:text-base shadow-inner custom-scrollbar"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {!description && (
            <div className="absolute bottom-6 right-6 opacity-10 hidden md:block">
              <span className="text-4xl italic font-serif">🖋️</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Section */}
      <div className="space-y-4 shrink-0">
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="group relative w-full py-4 md:py-5 bg-[#3C2A1A] text-white rounded-xl md:rounded-2xl font-bold text-[11px] md:text-xs tracking-[0.25em] uppercase overflow-hidden transition-all hover:bg-[#523D2B] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-stone-200"
        >
          {/* Subtle button shine effect */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] group-hover:translate-x-[200%] transition-transform duration-1000" />
          
          {isGenerating ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Building...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Architect Drafts <span className="text-lg opacity-50">→</span>
            </span>
          )}
        </button>

        {/* Status indicator */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
             <div className={`w-1.5 h-1.5 rounded-full ${context && description ? 'bg-green-500 animate-pulse' : 'bg-slate-200'}`} />
             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Ready to process</span>
          </div>
          <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">v1.0.4</span>
        </div>
      </div>
    </div>
  );
}