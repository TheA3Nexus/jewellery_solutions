import React, { useState } from 'react';
import { 
  CreditCard, 
  Boxes, 
  Hammer, 
  CalendarCheck, 
  Coins, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Printer,
  Scale,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';

const MODULES = [
  {
    id: 'POS',
    name: 'POS & Counter Sales',
    icon: CreditCard,
    tagline: 'Lightning Fast Billing with Live Precision Scale Integration',
    desc: 'Generate complete GST tax invoices in under 45 seconds. Direct RS-232 connection captures exact weight from your digital scale without manual typing errors.',
    features: [
      'Live RS-232 scale weight capture (Essae, Citizen, Phoenix)',
      'Old Gold Exchange (Peela Sona) with Kasauti / XRF purity deduction',
      'Dual payment split (Cash + UPI + Card + Gold Exchange)',
      'Instant thermal receipt & PDF invoice dispatched on customer WhatsApp'
    ],
    highlight: 'Zero-Error Weighing Scale Integration'
  },
  {
    id: 'INVENTORY',
    name: 'Inventory & RFID/HUID',
    icon: Boxes,
    tagline: '6-Digit BIS HUID Barcode Tagging & Tray-Wise Auditing',
    desc: 'Print high-durability polypropylene butterfly dumbbell tags with 6-digit BIS HUID QR codes. Perform morning and evening tray reconciliation in minutes.',
    features: [
      'Zebra & TSC direct ZPL tag printing (45mm x 12mm dumbbell tags)',
      'Tray-wise physical stock tallying (prevent showroom theft/loss)',
      'Real-time live bullion stock valuation by today’s MCX rate',
      'UHF RFID bulk batch scanning for instant tray stock audits'
    ],
    highlight: '100% BIS HUID Hallmarking Compliant'
  },
  {
    id: 'KARIGAR',
    name: 'Karigar & Workshop Desk',
    icon: Hammer,
    tagline: 'Track Every Milligram of Gold Issued & Settled',
    desc: 'Eliminate gold leakage in workshops. Record raw 24K bullion issue, finished jewellery receipt, melting loss, and Karigar wastage (vada) settlements.',
    features: [
      'Raw metal issue vouchers with digital Karigar signatures',
      'Automated wastage (vada/chheel) percentage tolerance rules',
      'Alloy calculator (24K fine gold to 22K/18K/14K alloy mix)',
      'Running Karigar ledger maintained in pure fine gold grams'
    ],
    highlight: 'Zero-Leakage Workshop Ledger'
  },
  {
    id: 'SCHEMES',
    name: 'Swarna Nidhi Kitty Schemes',
    icon: CalendarCheck,
    tagline: 'Boost Customer Retention with Monthly Gold Schemes',
    desc: 'Run 11+1 monthly gold kitty schemes or gram-accumulation plans. Automated monthly installment tracking, lucky draw engine, and WhatsApp passbook updates.',
    features: [
      'Flexible 11+1 bonus month and gold gram accumulation plans',
      'Digital member passbook with automated installment alerts',
      'Provably-fair Lucky Draw engine for festive showroom events',
      'Seamless maturity settlement against showroom jewellery purchases'
    ],
    highlight: 'Predictable Monthly Cash Inflow'
  },
  {
    id: 'GIRVI',
    name: 'Girvi & Gold Loan Desk',
    icon: Coins,
    tagline: 'Statutory Form G & Section 11 Legal Gold Lending',
    desc: 'Complete pawn-broking & gold loan management adhering to Indian Money Lending regulations. Automated monthly interest compounding and legal auction alerts.',
    features: [
      'Statutory Form G pawn ticket generation with ornament photo',
      'Monthly simple and compounding interest calculation engine',
      'Part-principal repayment and interest voucher ledger',
      'Automated auction radar & borrower legal notice dispatch'
    ],
    highlight: 'Money Lending Act Compliant'
  },
  {
    id: 'LOOKBOOK',
    name: 'Tablet Lookbook & Pole Display',
    icon: Layers,
    tagline: 'Luxury Showroom Experience & Customer-Facing Screen',
    desc: 'Empower sales staff with high-resolution digital lookbooks on iPads. Customer-facing secondary HDMI display showcases real-time billing breakdown and UPI QR.',
    features: [
      'High-resolution digital design catalogue for showroom sofa sales',
      '1-Click "Push to POS" quotation slip generator',
      'Secondary customer pole screen with live rate ticker',
      'Dynamic on-screen GPay / PhonePe / Paytm UPI payment QR code'
    ],
    highlight: '10x Luxury Showroom Brand Perception'
  }
];

export const ModuleShowcase = ({ onExploreModule }) => {
  const [activeTab, setActiveTab] = useState(MODULES[0].id);

  const activeModule = MODULES.find(m => m.id === activeTab) || MODULES[0];
  const Icon = activeModule.icon;

  return (
    <section id="features" className="py-16 lg:py-24 border-b border-surface-border bg-surface-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold font-mono text-brand-400 uppercase tracking-widest px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
            ENTERPRISE JEWELLERY SUITE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-surface-100 tracking-tight">
            Everything Your Showroom Needs, Unified
          </h2>
          <p className="text-sm sm:text-base text-surface-300">
            Replace clumsy spreadsheets, outdated DOS billing, and disconnected ledgers with a single, synchronized cloud platform.
          </p>
        </div>

        {/* Module Tab Selector Pill Strip */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {MODULES.map((mod) => {
            const TabIcon = mod.icon;
            const isSelected = mod.id === activeTab;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-brand-500 text-slate-950 shadow-xs'
                    : 'bg-surface-canvas text-surface-400 hover:text-surface-100 hover:bg-surface-hover border border-surface-border'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{mod.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Module Detail Showcase Box */}
        <div className="bg-surface-canvas border border-surface-border rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono font-bold">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>{activeModule.highlight}</span>
              </div>

              <h3 className="text-2xl font-black text-surface-100 leading-snug">
                {activeModule.tagline}
              </h3>

              <p className="text-sm text-surface-300 leading-relaxed">
                {activeModule.desc}
              </p>

              {/* Feature Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeModule.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-surface-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Interactive Demo Action */}
              <div className="pt-4">
                <button
                  onClick={() => onExploreModule && onExploreModule(activeModule.id)}
                  className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2 shadow-xs"
                >
                  <span>Launch Live {activeModule.name} Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Visual Feature Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-surface-card border border-surface-border p-6 shadow-md space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-surface-100 uppercase tracking-wide">
                    {activeModule.name}
                  </h4>
                  <p className="text-xs text-surface-400 mt-1">
                    Integrated with real-time statutory compliance, Indian tax rules, and local hardware drivers.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-surface-canvas border border-surface-border font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-surface-400">
                    <span>Domain Architecture:</span>
                    <strong className="text-emerald-400">Production Ready</strong>
                  </div>
                  <div className="flex justify-between text-surface-400">
                    <span>Testing Status:</span>
                    <strong className="text-brand-300">100% E2E Verified</strong>
                  </div>
                  <div className="flex justify-between text-surface-400">
                    <span>Data Encryption:</span>
                    <strong className="text-surface-200">AES-256 Multi-Tenant</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

const SparklesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);
