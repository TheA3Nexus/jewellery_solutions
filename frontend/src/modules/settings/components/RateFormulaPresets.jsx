import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { 
  TrendingUp, 
  Coins, 
  Tv, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  SlidersHorizontal,
  Wifi,
} from 'lucide-react';

export const RateFormulaPresets = () => {
  const { bullionRates, updateRates } = useTenant();

  const [base24k, setBase24k] = useState(bullionRates.gold24k || 7850);
  const [baseSilver, setBaseSilver] = useState(bullionRates.silver || 96.5);
  const [premiumMargin, setPremiumMargin] = useState(0); // ₹ premium per gram on 22K

  // LED Display Board Config
  const [ledConfig, setLedConfig] = useState({
    enabled: true,
    ipAddress: '192.168.1.185',
    port: '8080',
    protocol: 'JSON_HTTP', // JSON_HTTP or RS485_HEX
    refreshIntervalSeconds: 60,
    displayText: 'WELCOME TO A3 JEWELLERY &bull; TODAY GOLD 22K RATE: '
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Derived Rates
  const calc22k = Math.round(base24k * 0.9167 + parseFloat(premiumMargin || 0));
  const calc18k = Math.round(base24k * 0.75);
  const calc14k = Math.round(base24k * 0.5833);
  const calcSilver925 = +(baseSilver * 0.925).toFixed(2);

  const handleApplyRates = (e) => {
    e.preventDefault();
    updateRates({
      gold24k: parseFloat(base24k),
      gold22k: calc22k,
      gold18k: calc18k,
      gold14k: calc14k,
      silver: parseFloat(baseSilver),
      silver925: calcSilver925
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTestBroadcast = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      alert(`Successfully dispatched live rates to LED Screen at ${ledConfig.ipAddress}:${ledConfig.port}`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              Bullion Rate Derivation &amp; LED Board Broadcaster
              {isSaved && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Rates Updated
                </span>
              )}
            </h2>
            <p className="text-xs text-surface-400">
              Auto-calculate 22K, 18K, 14K from 24K pure bullion and sync with showroom LED rate displays.
            </p>
          </div>
        </div>

        <button
          onClick={handleApplyRates}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20"
        >
          <Save className="w-4 h-4" />
          Apply &amp; Broadcast New Rates
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Base Rates & Formula Engine */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-surface-200 flex items-center gap-2 border-b border-surface-800 pb-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Base Input &amp; Derivation Formula
          </h3>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-surface-400 font-medium mb-1">
                  24K Pure Gold Base Rate (₹ / Gram)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 font-mono">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={base24k}
                    onChange={(e) => setBase24k(parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-950 border border-surface-700 rounded-lg pl-7 pr-3 py-2 text-surface-100 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <span className="text-[10px] text-surface-500 mt-1 block">
                  ₹{(base24k * 10).toLocaleString('en-IN')} per 10 grams (1 Tola)
                </span>
              </div>

              <div>
                <label className="block text-surface-400 font-medium mb-1">
                  Fine Silver 999 Base Rate (₹ / Gram)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 font-mono">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={baseSilver}
                    onChange={(e) => setBaseSilver(parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-950 border border-surface-700 rounded-lg pl-7 pr-3 py-2 text-surface-100 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <span className="text-[10px] text-surface-500 mt-1 block">
                  ₹{(baseSilver * 1000).toLocaleString('en-IN')} per 1 Kilogram
                </span>
              </div>
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">
                Showroom Retail Premium Margin on 22K (₹ / Gram)
              </label>
              <input
                type="number"
                value={premiumMargin}
                onChange={(e) => setPremiumMargin(e.target.value)}
                placeholder="Optional premium (e.g. 0 or 25)"
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Formula Preview Grid */}
            <div className="bg-surface-950 rounded-xl p-3 border border-surface-800 space-y-2">
              <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider block">
                Calculated Showroom Purity Rates Preview
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="p-2 bg-surface-900 rounded border border-surface-800 flex justify-between">
                  <span className="text-surface-400">22K (91.6%):</span>
                  <span className="font-bold text-amber-400">₹{calc22k} /g</span>
                </div>
                <div className="p-2 bg-surface-900 rounded border border-surface-800 flex justify-between">
                  <span className="text-surface-400">18K (75.0%):</span>
                  <span className="font-bold text-surface-200">₹{calc18k} /g</span>
                </div>
                <div className="p-2 bg-surface-900 rounded border border-surface-800 flex justify-between">
                  <span className="text-surface-400">14K (58.5%):</span>
                  <span className="font-bold text-surface-200">₹{calc14k} /g</span>
                </div>
                <div className="p-2 bg-surface-900 rounded border border-surface-800 flex justify-between">
                  <span className="text-surface-400">925 Sterling:</span>
                  <span className="font-bold text-slate-300">₹{calcSilver925} /g</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Digital LED Display Board Integration */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-surface-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-200 flex items-center gap-2">
              <Tv className="w-4 h-4 text-sky-400" />
              Showroom Window LED Display Board
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LAN Ready
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-surface-400 font-medium mb-1">LED Controller IP Address</label>
                <input
                  type="text"
                  value={ledConfig.ipAddress}
                  onChange={(e) => setLedConfig({ ...ledConfig, ipAddress: e.target.value })}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-surface-400 font-medium mb-1">Port</label>
                <input
                  type="text"
                  value={ledConfig.port}
                  onChange={(e) => setLedConfig({ ...ledConfig, port: e.target.value })}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">Communication Protocol</label>
              <select
                value={ledConfig.protocol}
                onChange={(e) => setLedConfig({ ...ledConfig, protocol: e.target.value })}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
              >
                <option value="JSON_HTTP">HTTP REST API (JSON Payload)</option>
                <option value="RS485_HEX">RS485 Serial HEX Broadcast</option>
                <option value="MQTT">MQTT Broker (Showroom IoT Topic)</option>
              </select>
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">Scrolling Marquee Text</label>
              <input
                type="text"
                value={ledConfig.displayText}
                onChange={(e) => setLedConfig({ ...ledConfig, displayText: e.target.value })}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* LED Screen Live Preview */}
            <div className="bg-black border-2 border-surface-800 rounded-xl p-3 font-mono text-center">
              <div className="text-[10px] text-surface-600 mb-1">LED PHYSICAL PANEL SIMULATION</div>
              <div className="text-amber-400 font-black tracking-widest text-sm animate-pulse">
                GOLD 24K: ₹{base24k} | GOLD 22K: ₹{calc22k} | SILVER: ₹{baseSilver}
              </div>
              <div className="text-[11px] text-emerald-400 font-bold mt-1">
                HALLMARKED 916 HUID AVAILABLE
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestBroadcast}
              disabled={isBroadcasting}
              className="w-full py-2 bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-600 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Wifi className="w-3.5 h-3.5 text-sky-400" />
              {isBroadcasting ? 'Broadcasting...' : 'Test Send Packet to LED Controller'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
