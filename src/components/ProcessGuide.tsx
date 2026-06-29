import React from 'react';
import { Palette, QrCode, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProcessGuide() {
  const steps = [
    {
      stepNumber: '01',
      title: 'Customize Your Item',
      description: 'Choose a beautiful pre-made style and select delicious add-ons (KitKats, Ferrero Rochers), OR write a request outlining your custom design details.',
      icon: <Palette className="text-[#0099FF]" size={28} />,
      color: 'bg-sky-500/10 text-[#0099FF]',
    },
    {
      stepNumber: '02',
      title: 'Select Code / QR or COD',
      description: 'Review your pricing and choose Cash on Delivery (COD) or Fonepay. Fonepay order checkouts feature an interactive static QR code popup.',
      icon: <QrCode className="text-pink-500" size={28} />,
      color: 'bg-pink-500/10 text-pink-500',
    },
    {
      stepNumber: '03',
      title: 'Finalize on WhatsApp',
      description: 'Click checkout to generate an automated order summary. It deep-links you to WhatsApp to finalize wrapping, logistics, and shipping details with us.',
      icon: <MessageCircle className="text-emerald-500 animate-bounce" size={28} />,
      color: 'bg-emerald-500/10 text-emerald-500',
    }
  ];

  return (
    <section id="process-guide-section" className="py-16 px-4 max-w-5xl mx-auto scroll-mt-24">
      <div className="text-center space-y-3 max-w-lg mx-auto mb-12">
        <span className="text-[#0099FF] text-xs font-bold uppercase tracking-wider bg-[#E0F2FE] px-3.5 py-1.5 rounded-full">
          Simple 3-Step Journey
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
          Crafted to Your Doorstep
        </h2>
        <p className="font-sans text-sm text-slate-500 leading-relaxed">
          How we bridge digital selection with direct, authentic local delivery & creator customization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Decorative curvy connect lines for desktop */}
        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 border-t border-dashed border-sky-200 -z-10" />

        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="glass-panel p-8 rounded-[2rem] hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between"
          >
            <div>
              {/* Bubble Index */}
              <div className="absolute top-4 right-6 font-display text-4xl font-extrabold text-[#0D94FF]/10 select-none">
                {step.stepNumber}
              </div>

              {/* Icon Holder */}
              <div className={`p-4 rounded-full w-14 h-14 ${step.color} flex items-center justify-center mb-6 shadow-sm`}>
                {step.icon}
              </div>

              <h3 className="font-display text-xl font-bold text-[#0F172A] mb-3">
                {step.title}
              </h3>
              
              <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </div>

            {idx < 2 && (
              <div className="md:hidden flex justify-center mt-6 text-sky-300">
                <ArrowRight size={18} className="rotate-90" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
