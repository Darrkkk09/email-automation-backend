'use client';
import { useRouter } from 'next/navigation';
import { useState,useEffect } from 'react';
import Verification from '@/components/Verification';
import HeroSection from '@/components/HeroSection';
import FAQ from '@/components/FAQ';
import EmailComposer from '@/components/EmailComposer';
import DraftGallery from '@/components/DraftGallery';
import { EmailDraft } from '@/types/email';
import GmailPage from '@/components/GmailPage';



export default function EmailApp() {
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('is_verified') === 'true';
    }
    return false;
  });

  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<EmailDraft | null>(null);
  const [editableDraft, setEditableDraft] = useState<EmailDraft | null>(null);
  const [isGmailOpen, setIsGmailOpen] = useState(false);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

  const handleOpenEditor = (draft: EmailDraft) => {
    setSelectedDraft(draft);
    setEditableDraft({ ...draft });
  };
useEffect(() => {
  let scrollY = 0;
  if (selectedDraft) {
    // lock background scroll by fixing body position at current scroll
    scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    // also hide overflow on the root html element to catch any remaining scroll
    document.documentElement.style.overflow = 'hidden';
  } else {
    // ensure any leftover styles are cleared
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
  return () => {
    // restore scrolling and original position
    const prevTop = document.body.style.top || '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    // restore scroll if we previously locked it
    if (prevTop) {
      const y = -parseInt(prevTop || '0', 10) || 0;
      window.scrollTo(0, y);
    }
  };
}, [selectedDraft]);

const router = useRouter();
function handleLogout() {
  sessionStorage.clear();
  localStorage.removeItem('emailToken');
  router.push('/');
}

  return (
    <main className="h-screen w-full bg-[#FDFCFB] text-slate-900 overflow-hidden flex flex-col">
      {!isVerified ? (
        <div className="h-full overflow-y-auto">
          {/* Nav and Hero stay as they are for the landing state */}
          <nav className="fixed top-0 w-full z-[100] bg-[#FDFCFB]/90 backdrop-blur-md px-6 md:px-10 py-4 md:py-6 flex justify-between items-center border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3C2A1A] rounded-lg" />
              <span className="font-serif text-lg md:text-xl font-bold text-[#3C2A1A]">Architect</span>
            </div>
            <button 
              onClick={() => setShowAuthOverlay(true)}
              className="bg-[#3C2A1A] text-white px-5 py-2 md:px-6 md:py-2 rounded-full font-bold text-xs md:text-sm"
            >
              Sign In
            </button>
          </nav>

          <HeroSection onGetStarted={() => setShowAuthOverlay(true)} />
          <FAQ />

          {showAuthOverlay && (
            <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl max-w-lg w-full text-center relative">
                <button onClick={() => setShowAuthOverlay(false)} className="absolute top-6 right-6 text-slate-400 font-bold">✕</button>
                <h2 className="text-2xl font-serif text-[#3C2A1A] mb-2">Welcome Back</h2>
                <Verification onSuccess={() => {
                   setIsVerified(true);
                   setShowAuthOverlay(false);
                }} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <header className="h-16 md:h-20 shrink-0 flex justify-between items-center bg-white border-b border-slate-100 px-6 md:px-10 z-50">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#3C2A1A] rounded-xl flex items-center justify-center text-white font-serif font-bold shadow-lg">A</div>
              <div>
                <h1 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-1">Workspace</h1>
                <span className="text-sm md:text-lg font-serif text-[#3C2A1A]">Email Automation</span>
              </div>
            </div>
            <button onClick={handleLogout} className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-red-500">Sign Out</button>
          </header>

          <div className="grow flex flex-col lg:flex-row items-stretch overflow-hidden relative">
            
            {/* SIDEBAR */}
            <aside className="w-full lg:w-[420px] bg-white border-b lg:border-b-0 lg:border-r border-slate-100 p-6 md:p-10 shrink-0 h-auto lg:h-full overflow-y-auto">
              <div className="max-w-2xl mx-auto lg:max-w-none">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 hidden lg:block">Draft Architect</h2>
                <EmailComposer onDraftsGenerated={(data) => {
                  setDrafts(data);
                  setSelectedDraft(null);
                }} />
              </div>
            </aside>

            {/* RESULTS SECTION: Moved "Upward" by removing excessive padding and centering */}
            <section id="results-area" className="grow w-full bg-[#FDFCFB] flex flex-col overflow-hidden">
              <div className="p-6 md:p-10 h-full flex flex-col">
                {drafts.length > 0 ? (
                  // "items-start" and flex-col keeps content at the top
                  <div className="max-w-6xl w-full h-full flex flex-col animate-in fade-in slide-in-from-top-4 duration-700">
                     <div className="flex items-center gap-4 mb-6 shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Generated Variations</span>
                        <div className="h-px grow bg-slate-200/40" />
                     </div>
                     {/* The Gallery component must have h-full and internal overflow-y-auto */}
                     <div className="grow overflow-hidden">
                        <DraftGallery drafts={drafts} onSelect={handleOpenEditor} />
                     </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                    <div className="text-4xl mb-4">🖋️</div>
                    <p className="font-serif text-lg text-[#3C2A1A]">Drafts appear here instantly.</p>
                  </div>
                )}
              </div>
            </section>
{selectedDraft && editableDraft && (
  <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-start justify-center p-0 md:p-10 lg:p-12 overflow-hidden overscroll-none touch-none">
    
    {/* MODAL CONTAINER */}
    <div className="bg-white w-full h-full lg:max-w-5xl lg:h-[85vh] lg:rounded-[2.5rem] shadow-2xl border-slate-100 flex flex-col overflow-hidden relative animate-in zoom-in-95 fade-in duration-300">
      
      {/* HEADER: shrink-0 keeps it from moving */}
      <div className="px-6 py-4 md:px-10 border-b border-slate-50 flex justify-between items-center bg-white shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedDraft(null)} 
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2"
          >
            <span className="text-sm">✕</span> Close
          </button>
          <div className="h-4 w-px bg-slate-100 hidden md:block" />
          <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-blue-500">Zen Editor</span>
        </div>
        
        <button 
          onClick={() => setIsGmailOpen(true)} 
          className="bg-[#3C2A1A] text-white px-6 py-2 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg"
        >
          Open Dispatch
        </button>
      </div>

      {/* SUBJECT: Fixed and non-scrollable (minimal vertical spacing) */}
      <div className="shrink-0 bg-white">
        <div className="max-w-3xl mx-auto w-full px-8 md:px-14 lg:px-16">
          <div className="py-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 block mb-1">Subject</label>
            <input 
              className="text-2xl md:text-3xl font-serif font-bold text-[#3C2A1A] w-full outline-none bg-transparent border-none focus:ring-0 py-0" 
              value={editableDraft.subject}
              onChange={(e) => setEditableDraft({...editableDraft, subject: e.target.value})}
            />
          </div>
          <div className="h-px w-full bg-slate-50 shrink-0" />
        </div>
      </div>

      {/* INTERNAL CONTENT: Only this area can scroll (message body) */}
      <div className="grow flex flex-col p-8 md:p-14 lg:p-16 overflow-y-auto custom-scrollbar bg-white overscroll-contain">
        <div className="max-w-3xl mx-auto w-full">
          <div className="grow">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 block mb-4 uppercase">Message Body</label>
            <textarea 
              className="w-full min-h-[50vh] text-base md:text-lg leading-relaxed text-slate-600 outline-none resize-none bg-transparent border-none focus:ring-0"
              value={editableDraft.body}
              onChange={(e) => setEditableDraft({...editableDraft, body: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* FOOTER: Fixed at the bottom of the modal */}
      <div className="px-10 py-4 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center shrink-0 z-10">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          {editableDraft.body.length} Characters • Live Sync
        </span>
        <div className="flex gap-2 items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Editing Mode</span>
        </div>
      </div>
    </div>
  </div>
)}

            {isGmailOpen && editableDraft && (
              <div className="fixed inset-0 z-[120]">
                <GmailPage draft={editableDraft} onClose={() => setIsGmailOpen(false)} />
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}