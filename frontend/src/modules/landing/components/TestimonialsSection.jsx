import React from 'react';
import { Star, MapPin, Quote, ShieldCheck } from 'lucide-react';

export const TestimonialsSection = () => {
  const reviews = [
    {
      quote: "Peela Sona (Old Gold Exchange) aur weighing scale ka direct RS-232 auto-sync showroom me manual ghapla rokne ke liye game-changer hai. Ab cashier hath se galat weight daal hi nahi sakta.",
      author: "Shri Maheshbhai Zaveri",
      store: "Zaveri Heritage Jewels",
      city: "Zaveri Bazaar, Mumbai",
      rating: 5,
      tier: "Diamond Enterprise Plan"
    },
    {
      quote: "Swarna Nidhi Kitty Scheme aur counter par Customer Secondary Screen dekh kar grahak impress ho jaate hain. WhatsApp bill turant chala jata hai, paper slip dhundne ka jhanjhat khatam.",
      author: "Shri Ram Prasad Verma",
      store: "Shree Ram Jewellers & Sons",
      city: "Chowk, Varanasi",
      rating: 5,
      tier: "Gold Showroom Plan"
    },
    {
      quote: "Karigar workshop me chheel (vada) aur fine gold loss ka hisaab pehle register me ulajhta tha. A3 ERP ke alloy calculator aur job cards ne har mahine lakho rupaye ka metal loss roka hai.",
      author: "Shri Mahesh Kothari",
      store: "Zaveri Ratna Bhandar",
      city: "Johari Bazaar, Jaipur",
      rating: 5,
      tier: "Diamond Enterprise Plan"
    }
  ];

  return (
    <section className="py-16 lg:py-24 border-b border-surface-border bg-surface-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold font-mono text-brand-400 uppercase tracking-widest px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
            PROVEN IN INDIA'S SARAFA BAZAARS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-surface-100 tracking-tight">
            Trusted by Heritage Jewellers
          </h2>
          <p className="text-sm sm:text-base text-surface-300">
            Hear from showroom owners who eliminated paper bahi-khata and modernized their daily operations.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <div 
              key={idx}
              className="card-surface p-6 border border-surface-border flex flex-col justify-between space-y-5 shadow-xs relative"
            >
              <Quote className="w-8 h-8 text-brand-500/20 absolute top-4 right-4 pointer-events-none" />

              <div className="space-y-3">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-surface-200 leading-relaxed italic">
                  "{r.quote}"
                </p>
              </div>

              {/* Author & Store Details */}
              <div className="pt-3 border-t border-surface-border/60">
                <h4 className="text-xs font-bold text-surface-100">
                  {r.author}
                </h4>
                <p className="text-[11px] text-brand-400 font-semibold font-mono">
                  {r.store}
                </p>
                <div className="flex items-center justify-between text-[10px] text-surface-400 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-surface-500" />
                    <span>{r.city}</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-medium">
                    {r.tier}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
