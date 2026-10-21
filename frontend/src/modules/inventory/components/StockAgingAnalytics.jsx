import React from 'react';
import { useTenant } from '../../../context/TenantContext';
import { 
  Hourglass, 
  TrendingDown, 
  Flame, 
  Coins, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCcw,
  Sparkles
} from 'lucide-react';

export const StockAgingAnalytics = () => {
  const { products, bullionRates } = useTenant();

  // Simulated aging buckets based on product index or creation
  const activeStock = products.filter(p => p.status === 'IN_STOCK');

  const agingBuckets = {
    fresh: activeStock.slice(0, 2),        // <30 Days
    active: activeStock.slice(2, 4),       // 30-90 Days
    slow: activeStock.slice(4, 5),         // 90-180 Days
    dead: []                               // >180 Days
  };

  const calculateBucketValue = (items) => {
    return items.reduce((sum, item) => {
      const rate = item.metal === 'Gold' ? bullionRates.gold22k : bullionRates.silver;
      return sum + Math.round(item.netWeight * rate);
    }, 0);
  };

  return (
    <div className="card-surface space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-800 pb-3">
        <div className="flex items-center gap-2">
          <Hourglass className="w-5 h-5 text-brand-400" />
          <div>
            <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider font-sans">
              Inventory Aging &amp; Dead Capital Intelligence
            </h3>
            <p className="text-[11px] text-surface-400">
              Track slow-moving ornaments and optimize bullion working capital turnaround
            </p>
          </div>
        </div>
      </div>

      {/* Aging Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Fresh <30d */}
        <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] uppercase font-sans font-bold">Fresh Stock (&lt;30d)</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold text-surface-100">{agingBuckets.fresh.length} Items</div>
          <div className="text-[11px] text-surface-400">
            ₹{calculateBucketValue(agingBuckets.fresh).toLocaleString('en-IN')}
          </div>
        </div>

        {/* Active 30-90d */}
        <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-1">
          <div className="flex items-center justify-between text-sky-400">
            <span className="text-[10px] uppercase font-sans font-bold">Active Rotation (30-90d)</span>
            <Hourglass className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold text-surface-100">{agingBuckets.active.length} Items</div>
          <div className="text-[11px] text-surface-400">
            ₹{calculateBucketValue(agingBuckets.active).toLocaleString('en-IN')}
          </div>
        </div>

        {/* Slow 90-180d */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 space-y-1">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[10px] uppercase font-sans font-bold">Slow Moving (90-180d)</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold text-amber-800">{agingBuckets.slow.length} Items</div>
          <div className="text-[11px] text-surface-400">
            ₹{calculateBucketValue(agingBuckets.slow).toLocaleString('en-IN')}
          </div>
        </div>

        {/* Dead Stock >180d */}
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 space-y-1">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-[10px] uppercase font-sans font-bold">Dead Stock (&gt;180d)</span>
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold text-rose-700">{agingBuckets.dead.length} Items</div>
          <div className="text-[11px] text-surface-400">
            ₹{calculateBucketValue(agingBuckets.dead).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Advisory & Liquidation Insights */}
      <div className="p-4 rounded-xl bg-surface-950 border border-surface-800 space-y-2 font-sans">
        <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" />
          <span>Bullion Working Capital Optimization Recommendations</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-surface-300 pt-1">
          <div className="p-3 rounded-lg bg-surface-900 border border-surface-800 space-y-1">
            <strong className="text-surface-100 text-[11px] block">Promotion in Savings Scheme:</strong>
            <p className="text-[11px] text-surface-400">
              Feature slow-moving items in the Customer Digital Passbook with a 20% Making Charge discount voucher upon Kitty maturity.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-surface-900 border border-surface-800 space-y-1">
            <strong className="text-surface-100 text-[11px] block">Melting &amp; Re-casting to Trending Items:</strong>
            <p className="text-[11px] text-surface-400">
              Articles sitting unsold for over 180 days can be moved to the Karigar Desk with 1-click for melting into 24K bars or lightweight lightweight daily-wear chains.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};