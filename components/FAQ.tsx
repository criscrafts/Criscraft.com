"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQItem } from "@/types";

interface FAQProps {
  faqs: FAQItem[];
}

export const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-warm-ivory relative overflow-hidden" id="faq">
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col gap-4">
          <span className="text-[10px] tracking-widest uppercase font-bold text-soft-gold">
            Support Desk
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-deep-slate">
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-[1px] bg-soft-gold mx-auto mt-2" />
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq._id || idx}
                className="rounded-2xl border border-soft-gold/15 bg-soft-cream/35 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-sans text-deep-slate focus:outline-none"
                >
                  <span className="font-medium text-sm sm:text-base">{faq.question}</span>
                  <span className="p-1 rounded-full bg-warm-ivory border border-soft-gold/15 text-soft-gold transition-colors duration-300">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 font-sans text-sm text-charcoal/80 leading-relaxed border-t border-soft-gold/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
