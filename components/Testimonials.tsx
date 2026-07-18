import React from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { Testimonial } from "@/types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <section className="py-24 bg-soft-cream relative overflow-hidden" id="testimonials">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-10 w-[30vw] h-[30vw] rounded-full bg-pastel-blue/20 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16 flex flex-col gap-4">
          <span className="text-[10px] tracking-widest uppercase font-bold text-soft-gold">
            Voices of CrisCrafts
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-deep-slate leading-tight">
            Shared stories from <br />
            our happy collectors
          </h2>
          <div className="w-12 h-[1px] bg-soft-gold mx-auto mt-2" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((t, idx) => (
            <div
              key={t._id || idx}
              className="glassmorphism p-8 rounded-3xl flex flex-col justify-between gap-6 shadow-luxury-sm hover:shadow-luxury hover:-translate-y-1 transition-all duration-500 ease-out border border-soft-gold/10 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-soft-gold/10" />

              <div className="flex flex-col gap-4 font-sans">
                {/* Rating stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, starIdx) => (
                    <Star key={starIdx} className="w-3.5 h-3.5 text-soft-gold fill-soft-gold" />
                  ))}
                </div>

                <p className="text-sm italic leading-relaxed text-charcoal/80">
                  "{t.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 border-t border-soft-gold/10 pt-4 mt-2">
                {t.avatar && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-soft-gold/25">
                    <Image
                      src={t.avatar}
                      alt={t.author}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                )}
                <div className="font-sans">
                  <h4 className="text-sm font-semibold text-deep-slate">{t.author}</h4>
                  {t.role && <p className="text-[10px] text-dark-gray/60 tracking-wider uppercase font-semibold">{t.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
