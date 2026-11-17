import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  Sparkles,
  ShoppingBag,
  PlusCircle,
  Trash2,
  Gift,
  Check,
  ChevronRight,
  Monitor
} from 'lucide-react';

export const CustomerSecondaryDisplay = () => {
  const { tenant, bullionRates } = useTenant();
  const { scaleWeight, isScaleStable, scaleStatus } = useHardware();

  // Mode: 'BILLING' (Live counter cart + scale) or 'PROMO' (Festive screensaver & offers)
  const [displayMode, setDisplayMode] = useState('BILLING');
  const [activeCounter, setActiveCounter] = useState('Counter 01 (Main Ground Hall)');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [paymentSuccessAlert, setPaymentSuccessAlert] = useState(false);

  // Active items currently placed on counter billing
  const [activeBillItems, setActiveBillItems] = useState([
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

  const billSubtotal = activeBillItems.reduce((acc, i) => acc + (Number(i.totalAmount) || 0), 0);
  const gstAmount = Math.round(billSubtotal * 0.03);
  const grandTotal = billSubtotal + gstAmount;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSimulatePayment = () => {
    setPaymentSuccessAlert(true);
    setTimeout(() => {
      setPaymentSuccessAlert(false);
    }, 4500);
  };

  const handleAddSampleItem = () => {
    const newItem = {
      id: `JW-CAD-${Date.now().toString().slice(-4)}`,
      name: '22K Antique Temple Lakshmi Bangle',
      purity: '22K (91.6% BIS)',
      grossWeight: 18.250,
      netWeight: 18.250,
      huid: 'HD88104',
      totalAmount: 147825
    };
    setActiveBillItems([...activeBillItems, newItem]);
  };

  const handleClearCart = () => {
    setActiveBillItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl shadow-sm">
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
              High-visibility display facing the customer at the counter showing live scale weight, itemized bill tally, and dynamic payment QR.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex bg-surface-950 p-1 rounded-lg border border-surface-800 text-xs font-semibold">
            <button
              id="btn-mode-billing"
              onClick={() => setDisplayMode('BILLING')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                displayMode === 'BILLING'
                  ? 'bg-surface-800 text-surface-100 font-bold border border-surface-700'
                  : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-brand-400" />
              Counter Billing Mode
            </button>
            <button
              id="btn-mode-promo"
              onClick={() => setDisplayMode('PROMO')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                displayMode === 'PROMO'
                  ? 'bg-surface-800 text-surface-100 font-bold border border-surface-700'
                  : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-rose-400" />
              Festive Promo Mode
            </button>
          </div>

          {/* Counter Selector */}
          <select
            id="select-counter"
            value={activeCounter}
            onChange={(e) => setActiveCounter(e.target.value)}
            className="bg-surface-950 border border-surface-700 rounded-lg px-2.5 py-1.5 text-xs text-surface-200 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="Counter 01 (Main Ground Hall)">Counter 01 (Main Ground Hall)</option>
            <option value="Counter 02 (Bridal Lounge)">Counter 02 (Bridal Lounge)</option>
            <option value="Counter 03 (Diamond Solitaire Studio)">Counter 03 (Diamond Studio)</option>
          </select>

          {/* Fullscreen Toggle */}
          <button
            id="btn-toggle-fullscreen"
            onClick={toggleFullscreen}
            className="px-3.5 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-600 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5 text-brand-400" />
            {isFullscreen ? 'Exit Fullscreen' : 'Dedicated Screen'}
          </button>
        </div>
      </div>

      {/* Counter Simulation Action Bar for Staff Testing */}
      <div className="flex items-center justify-between gap-3 bg-surface-950 p-3 rounded-xl border border-surface-800 text-xs">
        <div className="flex items-center gap-2 text-surface-400">
          <Monitor className="w-4 h-4 text-brand-400" />
          <span>Interactive Staff Simulator:</span>
          <span className="font-bold text-surface-200">{activeCounter}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-add-sample-item"
            onClick={handleAddSampleItem}
            className="px-3 py-1 rounded-lg bg-surface-900 hover:bg-surface-800 text-brand-400 border border-brand-500/30 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Add Bangle (+₹1.47L)
          </button>
          <button
            id="btn-clear-cart"
            onClick={handleClearCart}
            className="px-3 py-1 rounded-lg bg-surface-900 hover:bg-surface-800 text-surface-400 hover:text-rose-400 border border-surface-700 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
          <button
            id="btn-simulate-payment"
            onClick={handleSimulatePayment}
            className="px-3.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Simulate UPI Paid
          </button>
        </div>
      </div>

      {/* Customer Secondary Monitor Live Simulation Frame */}
      <div className="bg-black border-4 border-surface-800 rounded-3xl p-6 sm:p-8 text-surface-100 shadow-2xl relative overflow-hidden">
        {/* Ambient Luxury Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header of Customer Display */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-800/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-900 border border-brand-500/40 flex items-center justify-center text-brand-400 font-black text-xl shadow-inner">
              A3
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-surface-50">
                {tenant?.name || 'A3 JEWELLERY & SONS'}
              </h1>
              <p className="text-xs text-surface-400 flex items-center gap-2 mt-0.5">
                <span>{tenant?.branch || 'Flagship Luxury Showroom'}</span>
                <span>&bull;</span>
                <span className="text-emerald-400 font-medium">
                  BIS HUID License: {tenant?.bisLicenseNo || 'HM/C-7749102'}
                </span>
              </p>
            </div>
          </div>

          {/* Live Rates Ticker Bar */}
          <div className="flex items-center gap-2 bg-surface-950 px-4 py-2 rounded-xl border border-surface-800 font-mono text-xs">
            <Coins className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex items-center gap-3">
              <div>
                <span className="text-surface-500 text-[10px] block">24K Gold:</span>
                <span id="stat-ticker-24k" className="text-amber-400 font-bold">
                  ₹{bullionRates?.gold24k || 7720} /g
                </span>
              </div>
              <span className="text-surface-700">|</span>
              <div>
                <span className="text-surface-500 text-[10px] block">22K 916:</span>
                <span id="stat-ticker-22k" className="text-brand-400 font-bold">
                  ₹{bullionRates?.gold22k || 7080} /g
                </span>
              </div>
              <span className="text-surface-700">|</span>
              <div>
                <span className="text-surface-500 text-[10px] block">Silver:</span>
                <span id="stat-ticker-silver" className="text-slate-300 font-bold">
                  ₹{bullionRates?.silver || 94} /g
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Received Instant Flash Banner */}
        {paymentSuccessAlert && (
          <div 
            id="banner-payment-success"
            className="my-4 bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl p-4 flex items-center justify-between text-emerald-100 shadow-xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-300">
                  Payment of ₹{grandTotal.toLocaleString('en-IN')} Received Successfully!
                </h3>
                <p className="text-xs text-emerald-400/80">
                  Transaction verified via Banking UPI Gateway. Generating GST Tax Invoice &amp; Guarantee Card...
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-300">
              TXN-SUCCESS-2026
            </span>
          </div>
        )}

        {/* Conditional Screen Content: Billing Mode vs Promo Showcase Mode */}
        {displayMode === 'BILLING' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column: Live Scale Readout & Trust Box */}
            <div className="bg-surface-950/80 border border-surface-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-surface-400 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-brand-400" />
                    Live Electronic Scale Readout
                  </span>
                  <span 
                    id="stat-scale-stability"
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      isScaleStable 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {isScaleStable ? 'Stable' : 'Unstable'}
                  </span>
                </div>

                {/* Digital Scale LED display box */}
                <div className="bg-black rounded-xl p-5 border-2 border-surface-800 text-center font-mono relative overflow-hidden shadow-inner">
                  <span className="text-[10px] text-surface-500 uppercase tracking-widest block font-sans">
                    Current Ornament Weight On Scale
                  </span>
                  <div 
                    id="stat-scale-weight"
                    className="text-5xl font-black text-amber-400 tracking-tight my-2"
                  >
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
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% BIS Hallmarked jewellery with 6-digit laser HUID.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero stone weight deduction guarantee on pure metal.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Complimentary Karatmeter purity test available on demand.</span>
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
                  <span className="text-[10px] text-brand-400 font-mono font-bold">
                    {activeCounter}
                  </span>
                </div>

                {activeBillItems.length === 0 ? (
                  <div className="py-12 text-center text-surface-500 space-y-2">
                    <ShoppingBag className="w-8 h-8 mx-auto text-surface-600" />
                    <p className="text-xs">No articles currently on the counter scale.</p>
                    <p className="text-[10px] text-surface-600">Items scanned by sales executive will appear here in real-time.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-surface-800/80 space-y-3 max-h-56 overflow-y-auto pr-1">
                    {activeBillItems.map((item) => (
                      <div key={item.id} className="pt-2 flex justify-between items-start text-xs">
                        <div>
                          <h4 className="font-semibold text-surface-100">{item.name}</h4>
                          <div className="text-[11px] text-surface-400 font-mono flex items-center gap-2 mt-0.5">
                            <span className="text-brand-400 font-bold">{item.purity}</span>
                            <span>&bull;</span>
                            <span>Net Wt: {item.netWeight.toFixed(3)}g</span>
                            <span>&bull;</span>
                            <span>HUID: {item.huid}</span>
                          </div>
                        </div>
                        <div className="text-right font-mono font-bold text-surface-100 text-sm">
                          ₹{Number(item.totalAmount).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bill Tally Breakdown */}
              <div className="border-t-2 border-surface-800/80 pt-3 mt-4 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-surface-400">
                  <span>Taxable Value:</span>
                  <span id="stat-customer-subtotal">₹{billSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-surface-400">
                  <span>Goods &amp; Service Tax (3% GST):</span>
                  <span id="stat-customer-gst">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-surface-800 font-bold text-base">
                  <span className="font-sans text-surface-100">Final Amount Payable:</span>
                  <span id="stat-customer-grand-total" className="text-amber-400 text-xl font-black">
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
              <div id="qr-dynamic-payment" className="bg-white p-3.5 rounded-2xl shadow-xl my-3 inline-block">
                <div className="w-44 h-44 bg-slate-950 flex flex-col items-center justify-center p-2 rounded-xl text-white relative">
                  <QrCode className="w-36 h-36 text-brand-400" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white px-2.5 py-0.5 rounded text-[9px] font-black text-slate-950 shadow-md border border-slate-300">
                      UPI ₹{grandTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-1">
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Merchant: {tenant?.tradeName || tenant?.name || 'A3 JEWELLERY'}
                </div>
                <div className="text-[10px] text-surface-500 font-mono">
                  VPA: {tenant?.upiVpa || 'a3jewels@hdfcbank'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Festive Promo Showcase Mode
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {/* Promo Card 1: Swarna Nidhi Monthly Savings */}
            <div className="bg-gradient-to-br from-amber-950/40 via-surface-900 to-surface-950 border border-amber-500/30 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Gold Savings Plan
                </span>
                <h3 className="text-lg font-black text-amber-300">Swarna Nidhi 11-Month Scheme</h3>
                <p className="text-xs text-surface-300 leading-relaxed">
                  Pay 11 monthly installments and get the 12th installment as a 100% store bonus! Zero making charges on redemption.
                </p>
              </div>
              <div className="border-t border-amber-500/20 pt-3 flex justify-between items-center text-xs text-amber-400 font-bold">
                <span>Start from ₹2,000 / month</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Promo Card 2: Certified Solitaire Diamond Exchange */}
            <div className="bg-gradient-to-br from-indigo-950/40 via-surface-900 to-surface-950 border border-indigo-500/30 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Lifetime Exchange
                </span>
                <h3 className="text-lg font-black text-indigo-300">100% Solitaire Buyback Guarantee</h3>
                <p className="text-xs text-surface-300 leading-relaxed">
                  Every natural diamond carries IGI/GIA certification with 100% exchange value against prevailing diamond benchmarks.
                </p>
              </div>
              <div className="border-t border-indigo-500/20 pt-3 flex justify-between items-center text-xs text-indigo-400 font-bold">
                <span>Zero Deductions on Diamond</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Promo Card 3: Free Karatmeter Hallmarking Check */}
            <div className="bg-gradient-to-br from-emerald-950/40 via-surface-900 to-surface-950 border border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Complimentary Service
                </span>
                <h3 className="text-lg font-black text-emerald-300">Free In-Store Karatmeter XRF Testing</h3>
                <p className="text-xs text-surface-300 leading-relaxed">
                  Bring your old family gold ornaments for free computerized XRF non-destructive purity testing with printed certificate.
                </p>
              </div>
              <div className="border-t border-emerald-500/20 pt-3 flex justify-between items-center text-xs text-emerald-400 font-bold">
                <span>NABL Calibrated Precision</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
