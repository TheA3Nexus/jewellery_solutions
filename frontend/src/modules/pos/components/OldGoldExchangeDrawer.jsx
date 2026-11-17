import React from 'react';
import { useTenant } from '../../../context/TenantContext';
import { useHardware } from '../../../context/HardwareContext';
import { ArrowLeftRight, Coins, Scale, AlertCircle } from 'lucide-react';

export const OldGoldExchangeDrawer = ({ exchange, setExchange }) => {
  const { bullionRates } = useTenant();
  const { scaleWeight, isScaleStable } = useHardware();

  const handleToggle = (checked) => {
    setExchange(prev => ({ ...prev, active: checked }));
  };

  const calculateExchangeCredit = () => {
    if (!exchange.active) return { net: 0, fineWeight: 0, scrapRate: 0, creditAmount: 0 };
    const gross = parseFloat(exchange.grossWeight) || 0;
    const less = parseFloat(exchange.lessWeight) || 0;
    const net = Math.max(0, gross - less);
    const purity = parseFloat(exchange.purityPercent) || 84.0;
    
    // Fine pure gold equivalent in grams
    const fineWeight = (net * purity) / 100;
    
    // Scrap rate usually benchmarked to 24K pure minus standard refinery margin (e.g. 2%)
    const scrapRate = exchange.customRate 
      ? parseFloat(exchange.customRate) 
      : Math.round((bullionRates.gold24k || 14607) * 0.98);

    const creditAmount = Math.round(fineWeight * scrapRate);
    return { net, fineWeight, scrapRate, creditAmount };
  };

  const financials = calculateExchangeCredit();

  return (
    <div className="card-surface p-3 space-y-3">
      <div className="flex items-center justify-between border-b border-surface-border pb-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={exchange.active}
            onChange={(e) => handleToggle(e.target.checked)}
            className="w-4 h-4 rounded border-surface-input text-brand-500 focus:ring-brand-500/50 bg-surface-canvas"
          />
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-bold text-surface-100 uppercase tracking-wider">
              Old Gold / Silver Exchange (Contra Credit)
            </span>
          </div>
        </label>
        {exchange.active && (
          <span className="text-xs font-mono font-bold text-brand-accent">
            -₹{financials.creditAmount.toLocaleString('en-IN')}
          </span>
        )}
      </div>

      {exchange.active && (
        <div className="space-y-3 pt-1 animate-in fade-in duration-150 text-xs font-mono">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <div className="flex items-center justify-between text-[10px] text-surface-400 mb-1">
                <span>Gross Wt (g)</span>
                {scaleWeight > 0 && (
                  <button
                    type="button"
                    onClick={() => setExchange(prev => ({ ...prev, grossWeight: scaleWeight.toFixed(3) }))}
                    className="text-brand-accent hover:underline font-bold text-[9px] flex items-center gap-0.5"
                    title="Read from live digital scale"
                  >
                    <Scale className="w-2.5 h-2.5" />
                    <span>Scale</span>
                  </button>
                )}
              </div>
              <input
                type="number"
                step="0.001"
                placeholder="0.000"
                value={exchange.grossWeight || ''}
                onChange={(e) => setExchange(prev => ({ ...prev, grossWeight: e.target.value }))}
                className="input-field text-xs py-1"
              />
            </div>

            <div>
              <label className="text-[10px] text-surface-400 block mb-1">Less / Stone Wt (g)</label>
              <input
                type="number"
                step="0.001"
                placeholder="0.000"
                value={exchange.lessWeight || ''}
                onChange={(e) => setExchange(prev => ({ ...prev, lessWeight: e.target.value }))}
                className="input-field text-xs py-1"
              />
            </div>

            <div>
              <label className="text-[10px] text-surface-400 block mb-1">Tunch / Purity (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 84.5"
                value={exchange.purityPercent || ''}
                onChange={(e) => setExchange(prev => ({ ...prev, purityPercent: e.target.value }))}
                className="input-field text-xs py-1"
              />
            </div>

            <div>
              <label className="text-[10px] text-surface-400 block mb-1">Scrap Rate (₹/g)</label>
              <input
                type="number"
                placeholder={financials.scrapRate.toString()}
                value={exchange.customRate || ''}
                onChange={(e) => setExchange(prev => ({ ...prev, customRate: e.target.value }))}
                className="input-field text-xs py-1"
              />
            </div>
          </div>

          {/* Quick Purity Preset Chips */}
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-surface-400 font-sans">Purity Chips:</span>
            {[
              { label: '22K (91.67%)', val: 91.67 },
              { label: '18K (75%)', val: 75.0 },
              { label: 'Trad (84%)', val: 84.0 },
              { label: 'Silver (92.5%)', val: 92.5 }
            ].map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => setExchange(prev => ({ ...prev, purityPercent: p.val }))}
                className={`px-1.5 py-0.5 rounded font-mono transition ${
                  parseFloat(exchange.purityPercent) === p.val
                    ? 'bg-brand-500/20 text-brand-accent font-bold border border-brand-500/40'
                    : 'bg-surface-canvas hover:bg-surface-hover text-surface-400 border border-surface-border'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Breakdown summary strip */}
          <div className="p-2.5 rounded-lg bg-surface-canvas border border-surface-border flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div>
              <span className="text-surface-400">Net Scrap Weight: </span>
              <strong className="text-surface-100">{financials.net.toFixed(3)}g</strong>
            </div>
            <div>
              <span className="text-surface-400">Equivalent 24K Fine: </span>
              <strong className="text-brand-benchmark font-bold">{financials.fineWeight.toFixed(3)}g</strong>
            </div>
            <div>
              <span className="text-surface-400">Exchange Credit Total: </span>
              <strong className="text-brand-accent text-xs">₹{financials.creditAmount.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
