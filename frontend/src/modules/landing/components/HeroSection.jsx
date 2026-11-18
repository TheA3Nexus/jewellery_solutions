import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Scale, 
  Printer, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Layers, 
  TrendingUp,
  MessageSquare
} from 'lucide-react';

export const HeroSection = ({ onOpenLogin, onEnterDemo }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-surface-border bg-gradient-to-b from-surface-card via-surface-canvas/60 to-surface-canvas">
      {/* Subtle Glow Background Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-bold font-mono tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
              <span>INDIA'S PREMIER CLOUD JEWELLERY ERP &bull; 2026 EDITION</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-surface-100 tracking-tight leading-[1.15]">
              The Operating System for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-amber-500">
                Modern Jewellery Showrooms
              </span>
            </h1>

            {/* Subheading in Hinglish & English */}
            <p className="text-sm sm:text-base text-surface-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Transform your showroom with zero manual calculation errors. Connect your{' '}
              <strong className="text-surface-100 font-semibold">Precision Weighing Scales</strong>, print{' '}
              <strong className="text-surface-100 font-semibold">BIS 6-Digit HUID Barcode Tags</strong>, settle{' '}
              <strong className="text-surface-100 font-semibold">Karigar Wastage</strong>, run{' '}
              <strong className="text-surface-100 font-semibold">Swarna Nidhi Gold Kitty Schemes</strong>, and dispatch{' '}
              <strong className="text-surface-100 font-semibold">Instant WhatsApp GST Invoices</strong>.
            </p>

            {/* CTA Button Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                id="hero-login-btn"
                onClick={onOpenLogin}
                className="w-full sm:w-auto btn-primary text-sm px-6 py-3 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Login to Showroom (साइन इन करें)</span>
              </button>

              <button
                id="hero-demo-btn"
                onClick={onEnterDemo}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-hover text-surface-100 font-bold text-sm flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
              >
                <Play className="w-4 h-4 text-brand-400" />
                <span>Explore Interactive Demo (लाइव देखें)</span>
              </button>
            </div>

            {/* Trust & Statutory Compliance Badges */}
            <div className="pt-4 border-t border-surface-border/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-surface-300 font-medium">
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>BIS HUID Compliant</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rule 114B PAN Active</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live Scale RS-232 Sync</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Section 269ST Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Tech POS Live Terminal Mockup Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-surface-card border border-brand-500/40 p-5 shadow-2xl space-y-4 ring-1 ring-brand-400/20">
              
              {/* Terminal Window Chrome Header */}
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono text-surface-400 ml-1">
                    POS Counter 01 &bull; Active Cart
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SCALE ONLINE (COM3)</span>
                </div>
              </div>

              {/* Live Bullion & Scale Strip */}
              <div className="grid grid-cols-2 gap-2 bg-surface-canvas p-2.5 rounded-xl border border-surface-border text-xs font-mono">
                <div>
                  <span className="text-[10px] text-surface-400 font-sans">22K Gold Rate:</span>
                  <p className="text-sm font-bold text-brand-400">₹13,389 / g</p>
                </div>
                <div className="border-l border-surface-border pl-2.5">
                  <span className="text-[10px] text-surface-400 font-sans">Precision Scale:</span>
                  <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5" />
                    <span>22.350 GM</span>
                  </p>
                </div>
              </div>

              {/* Scanned Jewellery Ornament Row */}
              <div className="p-3 rounded-xl bg-surface-canvas/60 border border-surface-border space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-bold">
                      HUID: BN9812
                    </span>
                    <h4 className="text-xs font-bold text-surface-100 mt-1">
                      22K Antique Filigree Bangle (Single)
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-surface-100 font-mono">
                    ₹3,16,420
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 text-[10px] text-surface-400 font-mono pt-1 border-t border-surface-border/50">
                  <div>Gross: <strong className="text-surface-200">22.350g</strong></div>
                  <div>Net: <strong className="text-surface-200">21.900g</strong></div>
                  <div>Making: <strong className="text-brand-400">₹750/g</strong></div>
                </div>
              </div>

              {/* Invoice Breakdown Strip */}
              <div className="bg-surface-canvas/90 p-3 rounded-xl border border-surface-border text-xs space-y-1.5 font-sans">
                <div className="flex justify-between text-surface-300 text-[11px]">
                  <span>Gold Metal Value (91.6% Purity):</span>
                  <span className="font-mono text-surface-100">₹2,93,219</span>
                </div>
                <div className="flex justify-between text-surface-300 text-[11px]">
                  <span>Making Charges + Hallmark (BIS):</span>
                  <span className="font-mono text-surface-100">₹16,470</span>
                </div>
                <div className="flex justify-between text-surface-300 text-[11px]">
                  <span>GST (3% SGST + CGST):</span>
                  <span className="font-mono text-surface-100">₹9,291</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold border-t border-surface-border pt-1.5 text-surface-100">
                  <span>Grand Total Payable:</span>
                  <span className="font-mono text-base text-brand-400">₹3,18,980</span>
                </div>
              </div>

              {/* Simulated Action Pills */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Invoice Sent</span>
                </div>
                <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center gap-1.5 font-semibold">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI Payment Received</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
