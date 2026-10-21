import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { useHardware } from '../../../context/HardwareContext';
import { 
  Tv, 
  Scale, 
  Coins, 
  QrCode, 
  CheckCircle2, 
  Maximize2, 
  ShieldCheck,
  Building2,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const CustomerSecondaryDisplay = () => {
  const { tenant, bullionRates } = useTenant();
  const { scaleWeight, isScaleStable, scaleStatus } = useHardware();

  // Simulated items currently placed on counter billing
  const [activeBillItems] = useState([
    {
      id: 'JW-NKL-01',
      name: '22K Handcrafted Peacock Bridal Necklace',
      purity: '22K (91.6% BIS)',
      grossWeight: 32.400,
      netWeight: 31.850,
      huid: 'HD99281',
      totalAmount: 259044
    },
    {
      id: 'JW-RNG-04',
      name: '18K Diamond Solitaire Halo Ring',
      purity: '18K (75.0% BIS)',
      grossWeight: 4.850,
      netWeight: 4.600,
      huid: 'HD77312',
      totalAmount: 112410
    }
  ]);

  const billSubtotal = activeBillItems.reduce((acc, i) => acc + i.totalAmount, 0);
  const gstAmount = Math.round(billSubtotal * 0.03);
  const grandTotal = billSubtotal + gstAmount;

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              Customer-Facing Secondary Counter Pole Display
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Dual Monitor Out
              </span>
            </h2>
            <p className="text-xs text-surface-400">
              High-visibility display facing the customer at the counter showing live scale weight, items, and dynamic payment QR.
            </p>
          </div>
        </div>

        <button
          onClick={toggleFullscreen}
          className="px-3.5 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-600 font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5 text-brand-400" />
          {isFullscreen ? 'Exit Fullscreen' : 'Open in Dedicated Customer Screen'}
        </button>
      </div>

      {/* Customer Secondary Monitor Live Simulation Frame */}
      <div className="bg-black border-4 border-surface-800 rounded-3xl p-6 sm:p-8 text-surface-100 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header of Customer Display */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-800/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-900 border border-brand-500/40 flex items-center justify-center text-brand-400 font-black text-xl shadow-inner">
              A3
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-surface-50">
                {tenant.name}
              </h1>
              <p className="text-xs text-surface-400 flex items-center gap-2 mt-0.5">
                <span>{tenant.branch}</span>
                <span>&bull;</span>
                <span className="text-emerald-400 font-medium">BIS HUID License: {tenant.bisLicenseNo}</span>
              </p>
            </div>
          </div>

          {/* Live Rates Ticker Bar */}
          <div className="flex items-center gap-2 bg-surface-950 px-4 py-2 rounded-xl border border-surface-800 font-mono text-xs">
            <Coins className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex items-center gap-3">
              <div>
                <span className="text-surface-500 text-[10px] block">24K Gold:</span>
                <span className="text-amber-400 font-bold">₹{bullionRates.gold24k} /g</span>
              </div>
              <span className="text-surface-700">|</span>
              <div>
                <span className="text-surface-500 text-[10px] block">22K 916:</span>
                <span className="text-brand-600 font-bold">₹{bullionRates.gold22k} /g</span>
              </div>
              <span className="text-surface-700">|</span>
              <div>
                <span className="text-surface-500 text-[10px] block">Silver:</span>
                <span className="text-slate-300 font-bold">₹{bullionRates.silver} /g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Body: Scale Feeds + Active Cart + Dynamic UPI QR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column: Live Scale Readout & Trust Box */}
          <div className="bg-surface-950/80 border border-surface-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-surface-400 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-brand-400" />
                  Live Electronic Scale Readout
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isScaleStable ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-amber-50 text-amber-700 border border-amber-300'}`}>
                  {isScaleStable ? 'Stable' : 'Unstable'}
                </span>
              </div>

              {/* Digital Scale LED display box */}
              <div className="bg-black rounded-xl p-5 border-2 border-surface-800 text-center font-mono relative overflow-hidden">
                <span className="text-[10px] text-surface-500 uppercase tracking-widest block font-sans">
                  Current Ornament Weight On Scale
                </span>
                <div className="text-5xl font-black text-amber-400 tracking-tight my-2">
                  {scaleWeight.toFixed(3)}
                  <span className="text-lg font-normal text-surface-400 ml-1">g</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-sans flex items-center justify-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Certified Class-II Precision Scale (NABL)
                </div>
              </div>
            </div>

            <div className="text-xs text-surface-400 space-y-2 border-t border-surface-800/80 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% BIS Hallmarked jewellery with 6-digit laser HUID.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero stone weight deduction guarantee on pure metal.</span>
              </div>
            </div>
          </div>

          {/* Middle Column: Items on Counter Cart */}
          <div className="bg-surface-950/80 border border-surface-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-surface-300">
                  Articles Added to Your Bill ({activeBillItems.length})
                </span>
                <span className="text-[10px] text-brand-400 font-mono">Counter 01</span>
              </div>

              <div className="divide-y divide-surface-800/80 space-y-3">
                {activeBillItems.map((item) => (
                  <div key={item.id} className="pt-2 flex justify-between items-start text-xs">
                    <div>
                      <h4 className="font-semibold text-surface-100">{item.name}</h4>
                      <div className="text-[11px] text-surface-400 font-mono flex items-center gap-2 mt-0.5">
                        <span className="text-brand-600 font-bold">{item.purity}</span>
                        <span>&bull;</span>
                        <span>Net Wt: {item.netWeight.toFixed(3)}g</span>
                        <span>&bull;</span>
                        <span>HUID: {item.huid}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-surface-100 text-sm">
                      ₹{item.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Tally Breakdown */}
            <div className="border-t-2 border-surface-800/80 pt-3 mt-4 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-surface-400">
                <span>Taxable Value:</span>
                <span>₹{billSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-surface-400">
                <span>Goods &amp; Service Tax (3% GST):</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-surface-800 font-bold text-base">
                <span className="font-sans text-surface-100">Final Amount Payable:</span>
                <span className="text-amber-400 text-xl font-black">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic UPI QR Code for Instant Settlement */}
          <div className="bg-gradient-to-b from-surface-900 to-surface-950 border border-brand-500/30 rounded-2xl p-5 text-center flex flex-col justify-between items-center shadow-lg">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-1">
                Instant UPI QR Settlement
              </span>
              <p className="text-[11px] text-surface-400">
                Scan with Google Pay, PhonePe, Paytm, BHIM, or any Banking UPI App
              </p>
            </div>

            {/* QR Code Canvas Representation */}
            <div className="bg-white p-3.5 rounded-2xl shadow-xl my-3 inline-block">
              {/* Simulated high-clarity QR Code visual */}
              <div className="w-44 h-44 bg-slate-950 flex flex-col items-center justify-center p-2 rounded-xl text-white relative">
                <QrCode className="w-36 h-36 text-brand-400" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-2 py-0.5 rounded text-[9px] font-black text-slate-950 shadow-md">
                    UPI ₹{grandTotal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full space-y-1">
              <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Merchant: {tenant.tradeName}
              </div>
              <div className="text-[10px] text-surface-500 font-mono">
                VPA: {tenant.upiVpa || 'a3jewels@hdfcbank'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
