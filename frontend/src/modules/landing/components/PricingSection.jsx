import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const PricingSection = ({ onSelectPlan }) => {
  const plans = [
    {
      id: 'SILVER_RETAIL',
      name: 'Silver Retail Plan',
      badge: 'Single Counter',
      price: '₹24,000',
      period: '/ Year (Billed Annually)',
      desc: 'Perfect for standalone retail jewellers transitioning from manual khata to modern barcode billing.',
      counters: '1 Billing Counter Included',
      features: [
        'POS GST Tax Invoicing & Thermal Slips',
        'Zebra/TSC Barcode Dumbbell Tag Printing',
        'Customer Udhaar & Bahi-Khata Ledger',
        'Daily Rojnamcha Daybook & Cash Tally',
        'Direct WhatsApp Invoice PDF Delivery',
        'Basic Cloud Backup & Security'
      ],
      isPopular: false,
      ctaText: 'Choose Silver Retail'
    },
    {
      id: 'GOLD_SHOWROOM',
      name: 'Gold Showroom Plan',
      badge: 'Most Popular Across India',
      price: '₹48,000',
      period: '/ Year (Billed Annually)',
      desc: 'The complete showroom package for busy retail counters with live precision scales and customer screens.',
      counters: 'Up to 3 Billing Counters Included',
      features: [
        'Everything in Silver Retail Plan, plus:',
        'Electronic Precision Scale RS-232 Auto-Capture',
        'Customer-Facing Secondary HDMI Pole Display',
        'iPad / Tablet Showroom Digital Lookbook',
        'Swarna Nidhi 11+1 Monthly Gold Kitty Schemes',
        'Girvi & Gold Loan Desk (Form G / Section 11)',
        'Live Bullion Rate Auto-Derivation Engine'
      ],
      isPopular: true,
      ctaText: 'Start with Gold Showroom'
    },
    {
      id: 'DIAMOND_ENTERPRISE',
      name: 'Diamond Enterprise',
      badge: 'Multi-Branch & Workshops',
      price: '₹1,20,000',
      period: '/ Year (Billed Annually)',
      desc: 'For multi-store luxury jewellery houses, bullion merchants, and in-house Karigar manufacturing workshops.',
      counters: 'Up to 10 Billing Counters Included',
      features: [
        'Everything in Gold Showroom Plan, plus:',
        'Multi-Branch Central Inventory Stock Transfers',
        'Karigar & Workshop Desk with Wastage (Vada) Audits',
        'VIP Customer Loyalty & Reward Points Engine',
        'Custom Branded WhatsApp Business API Integration',
        'Priority 24/7 Telephone & Field Support',
        'Dedicated Onboarding & Data Migration Engineer'
      ],
      isPopular: false,
      ctaText: 'Contact Enterprise Sales'
    }
  ];

  return (
    <section id="pricing" className="py-16 lg:py-24 border-b border-surface-border bg-surface-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold font-mono text-brand-400 uppercase tracking-widest px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
            TRANSPARENT LICENSING
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-surface-100 tracking-tight">
            Simple, Value-Packed Subscription Plans
          </h2>
          <p className="text-sm sm:text-base text-surface-300">
            Invest in peace of mind. Prevent staff theft, eliminate gold weight discrepancies, and elevate your showroom reputation.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p) => (
            <div 
              key={p.id}
              className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 transition relative shadow-lg ${
                p.isPopular
                  ? 'bg-gradient-to-b from-brand-500/10 via-surface-card to-surface-card border-2 border-brand-400 ring-2 ring-brand-400/20'
                  : 'bg-surface-canvas border border-surface-border'
              }`}
            >
              {/* Top Popular Ribbon */}
              {p.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-500 text-slate-950 font-black text-[10px] uppercase font-mono tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{p.badge}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  {!p.isPopular && (
                    <span className="text-[10px] font-mono font-bold text-surface-400 uppercase tracking-wider">
                      {p.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-surface-100 mt-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-surface-400 mt-1 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pt-2 border-t border-surface-border/60">
                  <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="text-3xl sm:text-4xl font-black text-surface-100">
                      {p.price}
                    </span>
                    <span className="text-xs text-surface-400 font-sans">
                      {p.period}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-brand-400 mt-1 font-mono">
                    {p.counters}
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-2.5 pt-3 border-t border-surface-border/60">
                  <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider font-mono">
                    Included Capabilities:
                  </span>
                  {p.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-surface-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-surface-border/60">
                <button
                  onClick={() => onSelectPlan && onSelectPlan(p.id)}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    p.isPopular
                      ? 'btn-primary shadow-md'
                      : 'border border-surface-border bg-surface-card hover:bg-surface-hover text-surface-100 shadow-2xs'
                  }`}
                >
                  <span>{p.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Free Evaluation Callout */}
        <div className="p-4 rounded-xl bg-surface-canvas border border-surface-border text-center text-xs text-surface-300">
          Want to evaluate with your own inventory?{' '}
          <strong className="text-surface-100">All new showrooms get a 14-Day Full Feature Free Evaluation</strong> with zero credit card required.
        </div>

      </div>
    </section>
  );
};
