import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const AnnouncementBar = ({ announcementText, onCtaClick }) => {
  const defaultText = announcementText || "⚡ New Release: Automated 6-Digit BIS HUID Hallmarking & Real-time Precision Weighing Scale Gateway 2.0 Now Live Across India!";

  return (
    <aside 
      aria-label="Announcement"
      className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-brand-500/30 text-surface-100 py-1.5 px-3 text-xs shadow-xs relative z-40 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Left: Ticker Message */}
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <span className="px-2 py-0.5 rounded-full bg-brand-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-2xs">
            <Zap className="w-2.5 h-2.5" />
            Announcement
          </span>
          <p className="text-[11px] font-medium text-surface-200 truncate max-w-[320px] sm:max-w-xl md:max-w-2xl">
            {defaultText}
          </p>
        </div>

        {/* Right: Quick Action Link */}
        <button
          onClick={onCtaClick}
          className="text-brand-300 hover:text-brand-200 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer shrink-0"
        >
          <span>Explore Demo Showroom</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
