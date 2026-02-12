"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ToastType = 'info' | 'success' | 'error';
type Toast = {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
};

type ToastContextValue = {
  showToast: (toast: Omit<Toast, 'id'>) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 9);
    const toast: Toast = { id, duration: 4000, ...t };
    setToasts((s) => [toast, ...s]);
    if (toast.duration && toast.duration > 0) {
      window.setTimeout(() => remove(id), toast.duration);
    }
  }, [remove]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="pointer-events-none fixed right-6 top-6 z-[9999] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`pointer-events-auto max-w-sm w-full rounded-lg shadow-lg px-4 py-3 flex items-start gap-3 text-sm ${
                t.type === 'success' ? 'bg-emerald-600 text-white' : t.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'
              }`}
            >
              <div className="mt-0.5 font-bold">
                {t.type === 'success' ? '✓' : t.type === 'error' ? '⚠' : 'i'}
              </div>
              <div className="flex-1">
                {t.title && <div className="font-semibold">{t.title}</div>}
                <div className="text-[13px]">{t.message}</div>
              </div>
              <button onClick={() => remove(t.id)} className="ml-2 opacity-90">✕</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
