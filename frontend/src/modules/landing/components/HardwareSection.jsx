import React from 'react';
import { 
  Scale, 
  Printer, 
  Monitor, 
  Tablet, 
  Cpu, 
  CheckCircle2, 
  Radio, 
  Zap 
} from 'lucide-react';

export const HardwareSection = () => {
  const hardwareCards = [
    {
      title: 'Precision Gold Balances (कांटा)',
      icon: Scale,
      models: 'Essae Teraoka, Citizen, Phoenix, Wensar, Sartorius',
      port: 'RS-232 Serial COM / USB',
      desc: 'Automatic real-time weight capture straight from the scale pan. Cashier cannot manually alter gold weight, eliminating billing discrepancies.',
      features: ['0.01g & 0.001g high precision', 'Auto-tare & stability detection', 'Zero manual typing errors']
    },
    {
      title: 'Jewellery Dumbbell Tag Printers',
      icon: Printer,
      models: 'Zebra ZD220, GK420t, TSC TE244, TTP-244 Pro',
      port: 'USB / LAN / Wi-Fi',
      desc: 'Prints scratch-resistant, washable Polypropylene butterfly dumbbell tags with crisp 6-digit BIS HUID QR codes and gross/net weights.',
      features: ['45mm x 12mm dumbbell tags', 'Direct ZPL & TSPL print commands', 'Tear-resistant wax-resin thermal ribbon']
    },
    {
      title: 'Customer-Facing Pole Display',
      icon: Monitor,
      models: 'Any HDMI / VGA Secondary Monitor (10" to 15")',
      port: 'HDMI / USB-C Extended Display',
      desc: 'Mounts on the billing counter facing the customer. Displays live bullion rate ticker, bill itemization, and dynamic GPay / PhonePe UPI payment QR.',
      features: ['Live transaction transparency', 'Instant UPI QR on screen', 'Showroom promotional slide banners']
    },
    {
      title: 'Showroom Sales Tablets (Lookbook)',
      icon: Tablet,
      models: 'Apple iPad, Samsung Galaxy Tab, Any Android Tablet',
      port: 'Local Showroom Wi-Fi',
      desc: 'Enables salesmen to present your entire digital design catalogue to customers on showroom sofas, with 1-click "Push to POS" quotation routing.',
      features: ['High-res jewelry photo zooms', 'Purity & weight filters', 'Instant counter quotation slip']
    }
  ];

  return (
    <section id="hardware" className="py-16 lg:py-24 border-b border-surface-border bg-surface-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold font-mono text-brand-400 uppercase tracking-widest px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
            SHOWROOM PERIPHERALS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-surface-100 tracking-tight">
            Plug-and-Play Hardware Integration
          </h2>
          <p className="text-sm sm:text-base text-surface-300">
            No expensive proprietary hardware locks. A3 Jewels connects natively to the precision scales, barcode printers, and monitors you already own.
          </p>
        </div>

        {/* 4 Hardware Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {hardwareCards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="card-surface p-5 border border-surface-border hover:border-brand-400/50 transition-all flex flex-col justify-between space-y-4 shadow-sm group"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-slate-950 transition">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-surface-100 group-hover:text-brand-300 transition">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-surface-400 font-mono mt-0.5">
                      Port: {item.port}
                    </p>
                  </div>

                  <p className="text-xs text-surface-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-border/60 space-y-2">
                  <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider font-mono">
                    Supported Models:
                  </span>
                  <p className="text-[11px] text-surface-200 font-semibold font-mono">
                    {item.models}
                  </p>

                  <div className="space-y-1 pt-1">
                    {item.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5 text-[10px] text-surface-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Hardware Daemon Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-card border border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-300 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-surface-100">
                A3 Hardware Gateway Bridge Daemon (Background Utility)
              </h4>
              <p className="text-[11px] text-surface-400 mt-0.5">
                Runs silently on your counter Windows PC at <code className="text-brand-400 font-mono">ws://127.0.0.1:9876</code> to deliver sub-millisecond weight telemetry to the cloud app.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs font-mono font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ZERO DRIVER CONFIGURATION</span>
          </div>
        </div>

      </div>
    </section>
  );
};
