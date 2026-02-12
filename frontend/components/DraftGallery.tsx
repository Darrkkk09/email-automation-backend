'use client';
import { useState } from 'react';
import { EmailDraft } from '@/types/email';

interface DraftGalleryProps {
  drafts: EmailDraft[];
  onSelect: (draft: EmailDraft) => void;
}

export default function DraftGallery({ drafts, onSelect }: DraftGalleryProps) {
  return (
    // FIX: Changed 'slide-in-from-bottom' to 'slide-in-from-top-2' 
    // removed large space-y and replaced with specific margin-top control
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-top-2 duration-700">
      
      {/* Header - Minimal margin-bottom to keep content "upside" */}
      <div className="flex flex-col gap-0.5 shrink-0 mb-6">
        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#3C2A1A]">Select a Variation</h2>
        <p className="text-slate-400 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black">
          Architectural Review • Ready to Dispatch
        </p>
      </div>

      {/* Grid Container - Flex-grow pushes the bottom space away, keeping content at the top */}
      <div className="flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar">
        {/* Adjusted grid for PC (3 columns on very wide screens) to stay compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 pb-10">
          {drafts.map((draft, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(draft)}
              className="group relative p-6 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-300 border border-slate-100 flex flex-col items-start text-left h-[260px] bg-white hover:shadow-[0_30px_60px_-15px_rgba(60,42,26,0.08)] hover:border-blue-500/20 hover:-translate-y-1 active:scale-[0.98]"
            >
              {/* Badge */}
              <div className="flex justify-between items-center w-full mb-3">
                <span className="px-2.5 py-0.5 bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  Draft 0{idx + 1}
                </span>
                <div className="flex gap-1">
                   <div className="w-1 h-1 rounded-full bg-slate-200 group-hover:bg-blue-300" />
                   <div className="w-1 h-1 rounded-full bg-slate-200 group-hover:bg-blue-500" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-serif font-bold text-[#3C2A1A] text-base md:text-lg mb-2 leading-tight group-hover:text-blue-900 transition-colors line-clamp-2">
                {draft.subject}
              </h3>

              <div className="relative flex-grow overflow-hidden w-full">
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-4 font-light">
                  {draft.body}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent" />
              </div>

              {/* Action Indicator */}
              <div className="mt-3 pt-3 border-t border-slate-50 w-full flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-600">
                  Open in Zen Editor
                </span>
                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <span className="text-xs">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}