import React from 'react';
import { useTenant } from '../../../context/TenantContext';
import { ArrowLeftRight, Coins, Scale, AlertCircle } from 'lucide-react';

export const OldGoldExchangeDrawer = ({ exchange, setExchange }) => {
  const { bullionRates } = useTenant();

  const handleToggle = (checked) => {
    setExchange(prev => ({ ...prev, active: checked }));
  };

  const calculateExchangeCredit = () => {
    if (!exchange.active) return 0;
    const gross = parseFloat(exchange.grossWeight) || 0;
    const less = parseFloat(exchange.lessWeight) || 0;
    const net = Math.max(0, gross - less);
    const purity = parseFloat(exchange.purityPercent) || 84.0;
    
    // Fine pure gold equivalent in grams
    const fineWeight = (net * purity) / 100;
    
    // Scrap rate usually benchmarked to 24K pure minus standard refinery margin (e.g. 2%)
    const scrapRate = exchange.customRate 
      ? parseFloat(exchange.customRate) 
      : Math.round(bullionRates.gold24k * 0.98);

    const creditAmount = Math.round(fineWeight * scrapRate);
    return { net, fineWeight, scrapRate, creditAmount };
  };

  const financials = calculateExchangeCredit();

  return (
    <div className="card-surface space-y-3">
      <div className="flex items-center justify-between border-b border-surface-800 pb-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={exchange.active}
            onChange={(e) => handleToggle(e.target.checked)}
            className="w-4 h-4 rounded border-surface-700 text-brand-500 focus:ring-brand-500/50 bg-surface-950"
          />
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-bold text-surface-100 uppercase tracking-wider">
              Old Gold / Silver Exchange
            </span>
          </div>
        </label>
        {exchange.active && (
          <span className="text-xs font-mono font-bold text-brand-400">
            -₹{financials.creditAmount.toLocaleString('en-IN')}
          </span>
        )}
      </div>

      {exchange.active && (
        <div className="space-y-3 pt-1 animate-in fade-in duration-150 text-xs font-mono">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] text-surface-400 block mb-1">Gross Wt (g)</label>
              <input
                type="number"
                step="0.001"
                placeholder="0.000"
                value={exchange.grossWeight || ''}
                onChange={(e) => setExchange(prev => ({ ...prev, grossWeight: e.target.value }))}
                className="input-field"
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
                className="input-field"
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
                className="input-field"
              />
            </div>

            <div>
              <label className="text-[10px] text-surface-400 block mb-1">Scrap Rate (₹/g)</label>
              <input
                type="number"
                placeholder={financials.scrapRate.toString()}
                value={exchange.customRate || ''}
                onChange={(e) => setExchange(prev => ({ ...prev, customRate: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          {/* Breakdown summary strip */}
          <div className="p-2.5 rounded-lg bg-surface-950 border border-surface-800 flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div>
              <span className="text-surface-400">Net Scrap Weight: </span>
              <strong className="text-surface-200">{financials.net.toFixed(3)}g</strong>
            </div>
            <div>
              <span className="text-surface-400">Equivalent 24K Fine: </span>
              <strong className="text-brand-300 font-bold">{financials.fineWeight.toFixed(3)}g</strong>
            </div>
            <div>
              <span className="text-surface-400">Exchange Credit Total: </span>
              <strong className="text-brand-400 text-xs">₹{financials.creditAmount.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};