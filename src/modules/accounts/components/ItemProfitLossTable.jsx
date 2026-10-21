import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Coins, 
  IndianRupee, 
  Printer, 
  AlertTriangle,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const ItemProfitLossTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Sold Items with Cost vs Realized Revenue breakdown
  const [soldItems] = useState([
    {
      id: 'SOLD-801',
      invoiceNo: 'INV-2026-0891',
      date: '2026-10-21',
      huid: 'HD99281',
      tagCode: 'JW-NKL-01',
      itemName: '22K Traditional Peacock Bridal Necklace',
      category: 'NECKLACE',
      grossWeight: 32.400,
      netGoldWeight: 31.850,
      goldCostRate: 6450, // Cost when purchased/melted
      goldSaleRate: 7120, // Rate billed to customer
      artisanMakingCost: 14332, // Paid to Karigar (31.85g * ₹450/g)
      customerMakingCharged: 27072, // Billed to customer (12% of metal or ₹850/g)
      stoneCost: 2500,
      stoneCharged: 5200,
      totalCost: 31.850 * 6450 + 14332 + 2500, // ₹2,22,264.50
      totalRealizedSale: 31.850 * 7120 + 27072 + 5200, // ₹2,59,044.00
      profitAmount: (31.850 * 7120 + 27072 + 5200) - (31.850 * 6450 + 14332 + 2500), // +₹36,779.50
      profitPercent: 16.5
    },
    {
      id: 'SOLD-802',
      invoiceNo: 'INV-2026-0892',
      date: '2026-10-21',
      huid: 'HD77312',
      tagCode: 'JW-RNG-04',
      itemName: '18K Diamond Solitaire Halo Engagement Ring',
      category: 'RINGS',
      grossWeight: 4.850,
      netGoldWeight: 4.600,
      goldCostRate: 5350,
      goldSaleRate: 5850,
      artisanMakingCost: 3500,
      customerMakingCharged: 7500,
      stoneCost: 45000, // VVS Solitaire diamond purchase
      stoneCharged: 78000, // Diamond retail billing
      totalCost: 4.600 * 5350 + 3500 + 45000, // ₹73,110
      totalRealizedSale: 4.600 * 5850 + 7500 + 78000, // ₹1,12,410
      profitAmount: 112410 - 73110, // +₹39,300
      profitPercent: 53.7
    },
    {
      id: 'SOLD-803',
      invoiceNo: 'INV-2026-0888',
      date: '2026-10-20',
      huid: 'HD44182',
      tagCode: 'JW-CHN-12',
      itemName: '22K Solid Dubai Machine Chain 20"',
      category: 'CHAINS',
      grossWeight: 18.500,
      netGoldWeight: 18.500,
      goldCostRate: 6920, // Bullion was bought when rates were higher
      goldSaleRate: 7080, // Customer bargained heavily
      artisanMakingCost: 5550, // ₹300/g casting cost
      customerMakingCharged: 6475, // Discounted to ₹350/g
      stoneCost: 0,
      stoneCharged: 0,
      totalCost: 18.500 * 6920 + 5550, // ₹1,33,570
      totalRealizedSale: 18.500 * 7080 + 6475, // ₹1,37,455
      profitAmount: 137455 - 133570, // +₹3,885
      profitPercent: 2.9 // Razor thin margin
    },
    {
      id: 'SOLD-804',
      invoiceNo: 'INV-2026-0884',
      date: '2026-10-19',
      huid: 'HD11209',
      tagCode: 'JW-BNG-08',
      itemName: '22K Handcrafted Calcutta Kada Bangles (Pair)',
      category: 'BANGLES',
      grossWeight: 45.200,
      netGoldWeight: 45.200,
      goldCostRate: 6500,
      goldSaleRate: 7100,
      artisanMakingCost: 22600, // ₹500/g
      customerMakingCharged: 45200, // ₹1,000/g
      stoneCost: 0,
      stoneCharged: 0,
      totalCost: 45.200 * 6500 + 22600, // ₹3,16,400
      totalRealizedSale: 45.200 * 7100 + 45200, // ₹3,66,120
      profitAmount: 366120 - 316400, // +₹49,720
      profitPercent: 15.7
    }
  ]);

  const filteredItems = soldItems.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.itemName.toLowerCase().includes(q) ||
        item.invoiceNo.toLowerCase().includes(q) ||
        item.huid.toLowerCase().includes(q) ||
        item.tagCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalSalesRevenue = filteredItems.reduce((acc, i) => acc + i.totalRealizedSale, 0);
  const totalCostBasis = filteredItems.reduce((acc, i) => acc + i.totalCost, 0);
  const totalGrossProfit = totalSalesRevenue - totalCostBasis;
  const overallMarginPercent = totalCostBasis > 0 ? ((totalGrossProfit / totalCostBasis) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Top Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Realized Sales Revenue */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-brand-400" />
            Realized Net Turnover
          </span>
          <div className="text-2xl font-mono font-bold text-surface-100 mt-1">
            ₹{Math.round(totalSalesRevenue).toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-surface-400">
            Excluding 3% GST tax liability
          </div>
        </div>

        {/* Purchase & Making Cost Basis */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            Cost of Goods Sold (COGS)
          </span>
          <div className="text-2xl font-mono font-bold text-surface-200 mt-1">
            ₹{Math.round(totalCostBasis).toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-surface-400">
            Bullion + Karigar labour + Gems
          </div>
        </div>

        {/* Net Gross Profit Amount */}
        <div className="bg-surface-900 border border-emerald-500/20 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Net Gross Profit
          </span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
            ₹{Math.round(totalGrossProfit).toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-mono font-medium">
            Margin: {overallMarginPercent}% on COGS
          </div>
        </div>

        {/* Low Margin Radar */}
        <div className="bg-surface-900 border border-amber-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Margin Protection Radar
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
              1 Low Margin
            </span>
          </div>
          <div className="text-xs text-surface-300 mt-2">
            1 machine chain was sold at <strong>2.9% margin</strong> due to manual making charge discount.
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-surface-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Item-by-Item Profitability Audit
            </h3>
            <div className="flex bg-surface-950 p-0.5 rounded-lg border border-surface-800 text-xs font-medium">
              {['ALL', 'NECKLACE', 'RINGS', 'CHAINS', 'BANGLES'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    selectedCategory === cat
                      ? 'bg-surface-800 text-surface-100 shadow-sm'
                      : 'text-surface-400 hover:text-surface-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
              <input
                type="text"
                placeholder="Search HUID, Tag, Item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-surface-950 border border-surface-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500 w-52"
              />
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg border border-surface-700 bg-surface-800 hover:bg-surface-700 text-surface-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Export Report
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 text-surface-400 font-semibold uppercase tracking-wider text-[11px] border-b border-surface-800 font-sans">
              <tr>
                <th className="px-4 py-3">Sold Article & HUID</th>
                <th className="px-4 py-3">Invoice & Date</th>
                <th className="px-4 py-3 text-right">Net Weight</th>
                <th className="px-4 py-3 text-right">Gold Cost vs Sale</th>
                <th className="px-4 py-3 text-right">Artisan Mazdoori vs Charged</th>
                <th className="px-4 py-3 text-right">Stone Margin</th>
                <th className="px-4 py-3 text-right">Total Cost Basis</th>
                <th className="px-4 py-3 text-right">Realized Sale</th>
                <th className="px-4 py-3 text-right text-emerald-400">Net Profit (₹)</th>
                <th className="px-4 py-3 text-center">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60 font-mono">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-surface-800/40 transition-colors">
                  <td className="px-4 py-3 font-sans">
                    <div className="font-semibold text-surface-100">{item.itemName}</div>
                    <div className="text-[11px] text-surface-400 flex items-center gap-2 mt-0.5 font-mono">
                      <span className="text-brand-400 font-bold">Tag: {item.tagCode}</span>
                      <span>&bull;</span>
                      <span>HUID: {item.huid}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans whitespace-nowrap">
                    <div className="font-medium text-surface-200">{item.invoiceNo}</div>
                    <div className="text-[11px] text-surface-500 font-mono">{item.date}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-surface-200">
                    {item.netGoldWeight.toFixed(3)} g
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-surface-400 text-[11px]">Cost: ₹{item.goldCostRate}</div>
                    <div className="text-amber-400 font-bold">Sale: ₹{item.goldSaleRate}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-rose-400 text-[11px]">Paid: ₹{item.artisanMakingCost.toLocaleString('en-IN')}</div>
                    <div className="text-emerald-400 font-bold">Recvd: ₹{item.customerMakingCharged.toLocaleString('en-IN')}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.stoneCharged > 0 ? (
                      <div>
                        <div className="text-surface-400 text-[11px]">Cost: ₹{item.stoneCost.toLocaleString('en-IN')}</div>
                        <div className="text-sky-400 font-bold">+₹{(item.stoneCharged - item.stoneCost).toLocaleString('en-IN')}</div>
                      </div>
                    ) : (
                      <span className="text-surface-600">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-surface-300">
                    ₹{Math.round(item.totalCost).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-surface-100">
                    ₹{Math.round(item.totalRealizedSale).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">
                    +₹{Math.round(item.profitAmount).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.profitPercent >= 15
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.profitPercent >= 8
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {item.profitPercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
