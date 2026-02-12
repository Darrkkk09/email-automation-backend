'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: "Why not just use ChatGPT and Gmail separately?",
    a: "Context switching is the silent killer of productivity. By bridging the gap between AI generation and your inbox, we eliminate the friction of manual copying, re-formatting, and tab-switching, saving you roughly 4 minutes per dispatch."
  },
  {
    q: "Is the email verification truly real-time?",
    a: "Yes. Every time a recipient is added, our system initiates a multi-layer handshake via Abstract API—checking MX records and SMTP server availability—to guarantee the mailbox exists before you hit send."
  },
  {
    q: "Can I use my own AI prompts?",
    a: "Absolutely. You can 'Architect' the specific tone, length, and technical depth of your drafts. Our system acts as the engine, but the professional voice remains entirely yours."
  },
  {
    q: "Does this handle complex attachments?",
    a: "Unlike standard chat interfaces, our workspace allows you to attach PDFs, resumes, and project briefs directly to the generated draft, ensuring your outreach is package-ready instantly."
  },
  {
    q: "How does the 'Zen Editor' improve quality?",
    a: "The AI provides the architecture, but the Zen Editor provides the soul. It’s a focused, distraction-free environment designed for final human refinements before the email is sent through our secure backend."
  },
  {
    q: "Is my data used for AI training?",
    a: "No. We prioritize professional privacy. Your drafts and recipient data are processed securely for dispatch only and are never used to train public models."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open first

  return (
    <section className="relative min-h-screen w-full flex items-center bg-[#FDFCFB] py-24 px-6 lg:px-20 border-t border-slate-100 overflow-hidden">
      {/* BACKGROUND ACCENT */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#8B735B]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* LEFT HEADER */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <div className="sticky top-32">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6 block">
                Information Architecture
              </span>
              <h2 className="text-5xl lg:text-7xl font-serif text-[#3C2A1A] leading-[1.1] mb-8">
                Human <br />
                Questions. <br />
                <span className="text-[#8B735B] italic font-normal">Expertly <br />Answered.</span>
              </h2>
              <p className="text-slate-400 font-medium max-w-xs leading-relaxed">
                Everything you need to know about bridging the gap between AI logic and professional delivery.
              </p>
            </div>
          </div>

          {/* RIGHT QUESTIONS: ACCORDION GRID */}
          <div className="lg:col-span-8 space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i} 
                initial={false}
                className={`group border-b border-slate-100 transition-colors duration-500 ${openIndex === i ? 'bg-[#F9F8F3]/50 rounded-2xl' : ''}`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-start justify-between py-8 px-6 text-left"
                >
                  <div className="flex gap-6 md:gap-10">
                    <span className={`text-2xl font-serif transition-colors duration-500 ${openIndex === i ? 'text-[#8B735B]' : 'text-slate-200'}`}>
                      0{i + 1}
                    </span>
                    <h3 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300 ${openIndex === i ? 'text-blue-600' : 'text-[#3C2A1A]'}`}>
                      {faq.q}
                    </h3>
                  </div>

                  {/* CUSTOM ANIMATED ICON */}
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={`mt-2 shrink-0 ${openIndex === i ? 'text-blue-600' : 'text-slate-300'}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-10 pl-20 md:pl-32 pr-10">
                        <p className="text-[#5D544D] text-lg leading-relaxed max-w-2xl border-l-2 border-blue-100 pl-8">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}