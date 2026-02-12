'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmailDraft } from '@/types/email';
import { useToast } from './ToastContext';
import axios from 'axios';

interface GmailMockupProps {
  draft: EmailDraft;
  onClose: () => void;
}

export default function GmailPage({ draft, onClose }: GmailMockupProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [Recipient, setRecipient] = useState("");
  const [localBody, setLocalBody] = useState(draft.body);
  const [localSubject, setLocalSubject] = useState(draft.subject);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const { showToast } = useToast();
  
  // --- VERIFICATION STATES ---
  const [isValidating, setIsValidating] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'valid' | 'invalid' | null>(null);
  const verifyTimer = useRef<number | null>(null);

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalBody(draft.body);
    setLocalSubject(draft.subject);
  }, [draft]);

  // --- ABSTRACT API LOGIC ---
  const verifyEmail = async (email: string) => {
    // Basic quick format check
    const simpleRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!email || !email.includes('@')) {
      setVerificationResult(null);
      return;
    }

    setIsValidating(true);
    setVerificationResult(null);

    try {
      const response = await fetch(
        `https://emailreputation.abstractapi.com/v1/?api_key=aae74d5e6feb4a359457f687c9e54210&email=${encodeURIComponent(
          email,
        )}`,
      );
      const data = await response.json();

      // Debug: show API response in console for troubleshooting
      console.debug('AbstractAPI response for', email, data);

      // Treat as valid if deliverability is 'deliverable' OR score is high
      const deliverable = data?.email_deliverability?.status === 'deliverable';
      const score = data?.email_quality?.score;
      if (deliverable || (typeof score === 'number' && score >= 0.8)) {
        setVerificationResult('valid');
      } else if (data && data.email_deliverability) {
        // API responded but not deliverable
        setVerificationResult('invalid');
      } else {
        // Unexpected response shape: fallback to regex
        setVerificationResult(simpleRegex.test(email) ? 'valid' : 'invalid');
      }
    } catch (error) {
      console.error('Verification failed (fetch)', error);
      // On fetch failure (CORS, network, rate limit), fallback to regex
      setVerificationResult(simpleRegex.test(email) ? 'valid' : 'invalid');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSendEmail = () => {
    (async () => {
      if (Recipient.trim() === '') {
        alert('Please enter recipient email address.');
        return;
      }

      if (displayName.trim() === '') {
        alert('Please enter your Display Name (From).');
        return;
      }

      setIsSending(true);
      setSendResult(null);
      setErrorMessage(null);
      setSendStatus('sending');

      try {
        const replyTo = (process.env.NEXT_PUBLIC_REPLY_TO as string) || Recipient;
        // Prefer the OTP verification token stored during verification flow (sessionStorage)
        // fall back to any legacy token in localStorage
        const authToken = typeof window !== 'undefined'
          ? sessionStorage.getItem('otp_token') || localStorage.getItem('emailToken')
          : null;
        const baseUrl = (process.env.NEXT_PUBLIC_API_BASE as string) || 'http://localhost:5000';

        let res;
        if (attachedFile) {
          const form = new FormData();
          form.append('to', Recipient);
          form.append('replyTo', replyTo);
          form.append('subject', localSubject);
          form.append('description', localBody);
          form.append('UserName', displayName);
          if (authToken) form.append('token', authToken);
          form.append('attachment', attachedFile, attachedFile.name);

          res = await axios.post(`${baseUrl}/email/send`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          const payload: any = {
            to: Recipient,
            replyTo,
            subject: localSubject,
            description: localBody,
            UserName: displayName,
          };
          if (authToken) payload.token = authToken;

          res = await axios.post(`${baseUrl}/email/send`, payload, {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const resultMsg = res?.data?.status ?? 'Email sent successfully';
        setSendResult(resultMsg);
        setSendStatus('success');
        showToast({ type: 'success', title: 'Email sent', message: resultMsg });
        // show success toast briefly, then close composer
        setShowConfirm(false);
        
        setTimeout(() => {
          setIsSending(false);
          onClose();
          setSendStatus('idle');
        }, 1400);
      } catch (err: any) {
        console.error('Send failed', err);
        const msg = err?.response?.data?.message || err?.message || 'Send failed';
        // keep composer open so user can edit/try again
        setSendStatus('error');
        setErrorMessage(msg);
        showToast({ type: 'error', title: 'Send failed', message: msg });
        setShowConfirm(false);
        setIsSending(false);
      } finally {
        // Leave sendStatus to success/error until user dismisses
      }
    })();
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = localBody.substring(0, start) + emoji + localBody.substring(end);
    setLocalBody(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 px-4">
      
      {/* THE POPUP WINDOW */}
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 max-h-[90vh]">
        
        {/* HEADER */}
        <div className="bg-[#f2f6fc] px-4 py-3 flex justify-between items-center border-b border-slate-200">
          <span className="text-sm font-medium text-slate-700">New Message</span>
          <button onClick={onClose} className="hover:text-slate-900 font-bold text-lg transition-colors">✕</button>
        </div>

        {/* INPUTS SECTION */}
        <div className="px-4">
          {/* TO FIELD */}
          <div className={`border-b py-2 flex items-center gap-2 transition-all duration-300 ${
            verificationResult === 'invalid' ? 'border-red-500 bg-red-50/50 animate-shake' : 'border-slate-100'
          }`}>
            <span className={`text-sm w-12 ${verificationResult === 'invalid' ? 'text-red-600 font-bold' : 'text-slate-500'}`}>To</span>
            <input
              onChange={(e) => {
                const v = e.target.value;
                setRecipient(v);
                if (verificationResult) setVerificationResult(null);
                // debounce verification to avoid rapid API calls
                if (verifyTimer.current) clearTimeout(verifyTimer.current);
                verifyTimer.current = window.setTimeout(() => {
                  verifyEmail(v.trim());
                }, 600) as unknown as number;
              }}
              value={Recipient}
              onBlur={(e) => verifyEmail(e.target.value.trim())}
              type="text"
              className="grow outline-none text-sm bg-transparent"
              placeholder="Recipients"
            />
            
            <div className="flex items-center gap-2 pr-2">
              {isValidating && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
              {verificationResult === 'valid' && <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">✓ Verified</span>}
              {verificationResult === 'invalid' && <span className="text-red-600 text-xs font-bold bg-white px-2 py-1 rounded shadow-sm border border-red-200">✕ Invalid Mailbox</span>}
            </div>
          </div>
          
          {/* SUBJECT FIELD */}
          <div className="border-b border-slate-100 py-2 flex items-center gap-2">
            <span className="text-sm text-slate-500 w-12">From</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="grow outline-none text-sm font-medium"
              placeholder="Display name for recipient (Not GMAIL)"
            />
          </div>

          <div className="border-b border-slate-100 py-2 flex items-center gap-2">
            <span className="text-sm text-slate-500 w-12">Subject</span>
            <input 
              type="text" 
              value={localSubject} 
              onChange={(e) => setLocalSubject(e.target.value)}
              className="grow outline-none text-sm font-medium" 
            />
          </div>
        </div>

        {/* BODY AREA */}
        <div className="p-4 grow flex flex-col overflow-y-auto min-h-[350px]">
          <textarea 
            ref={textareaRef}
            className="w-full grow outline-none text-[14px] leading-relaxed text-[#222] resize-none whitespace-pre-wrap"
            style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
            value={localBody}
            onChange={(e) => setLocalBody(e.target.value)}
            spellCheck="false"
          />

          {attachedFile && (
            <div className="mt-4 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between w-72 animate-in slide-in-from-left-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-xl">📄</span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold truncate text-slate-700">{attachedFile.name}</span>
                  <span className="text-[9px] text-slate-400">{(attachedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              <button onClick={() => setAttachedFile(null)} className="text-slate-400 hover:text-red-500 p-1">✕</button>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 flex items-center justify-between bg-white border-t border-slate-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowConfirm(true)}
              className="bg-[#0b57d0] hover:bg-[#0842a0] text-white px-8 py-2.5 rounded-full text-sm font-medium transition-all shadow-md active:scale-95"
            >
              Send
            </button>
            
            <div className="flex gap-6 text-slate-500 items-center">
              <button onClick={() => fileInputRef.current?.click()} className="hover:text-slate-800 text-2xl">📎</button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => setAttachedFile(e.target.files?.[0] || null)} 
                className="hidden" 
                accept=".pdf,.doc,.docx"
              />
              <button onClick={() => insertEmoji('😊')} className="hover:text-slate-800 text-xl">😊</button>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 text-xl">🗑</button>
        </div>
      </div>

      {/* CONFIRMATION POPUP */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm text-center w-full mx-4"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🚀</div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Final Dispatch?</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Recipient: <span className="font-semibold">{Recipient}</span>
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Back</button>
                <button 
                  onClick={handleSendEmail}
                  disabled={isSending || sendStatus === 'sending'}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-60"
                >
                  {sendStatus === 'sending' || isSending ? 'Sending...' : 'Send Now'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast / Status */}
      <div className="pointer-events-none fixed top-6 right-6 z-60">
        <AnimatePresence>
          {sendStatus === 'sending' && (
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="pointer-events-auto bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
            >
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <div>Sending...</div>
            </motion.div>
          )}

          {sendStatus === 'success' && (
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="pointer-events-auto bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
            >
              <div className="text-xl">✓</div>
              <div>{sendResult || 'Email sent'}</div>
            </motion.div>
          )}

          {sendStatus === 'error' && (
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="pointer-events-auto bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
            >
              <div className="text-xl">⚠</div>
              <div>
                {errorMessage || 'Failed to send email'}
                <div className="text-xs opacity-80">Please check recipient and try again.</div>
              </div>
              <button
                onClick={() => setSendStatus('idle')}
                className="ml-3 bg-white/20 px-2 py-1 rounded text-xs"
              >Dismiss</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TAILWIND CUSTOM SHAKE ANIMATION */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}