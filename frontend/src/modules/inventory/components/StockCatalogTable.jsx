import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { 
  Search, 
  Tag, 
  Printer, 
  ExternalLink, 
  Filter, 
  Coins, 
  Gem, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';

export const StockCatalogTable = ({ onOpenAddModal, onOpenTagStudio }) => {
  const { products, bullionRates } = useTenant();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // 'ALL' | 'GOLD' | 'SILVER' | 'DIAMOND' | 'SOLD'

  // Filter products based on search and category
  const filteredProducts = products.filter(item => {
    // Category filter
    if (selectedCategory === 'GOLD' && item.metal !== 'Gold') return false;
    if (selectedCategory === 'SILVER' && item.metal !== 'Silver') return false;
    if (selectedCategory === 'DIAMOND' && !item.diamondCarat) return false;
    if (selectedCategory === 'SOLD' && item.status !== 'SOLD') return false;
    if (selectedCategory !== 'SOLD' && item.status === 'SOLD') return false;

    // Search filter
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.id.toLowerCase().includes(term) ||
      item.barcode.includes(term) ||
      (item.huid && item.huid.toLowerCase().includes(term)) ||
      (item.trayNo && item.trayNo.toLowerCase().includes(term))
    );
  });

  // Calculate live valuation of inventory item
  const getItemValuation = (item) => {
    let rate = bullionRates.gold22k;
    if (item.metal === 'Gold') {
      if (item.purity === '24K') rate = bullionRates.gold24k;
      else if (item.purity === '22K') rate = bullionRates.gold22k;
      else if (item.purity === '18K') rate = bullionRates.gold18k;
      else if (item.purity === '14K') rate = bullionRates.gold14k;
    } else if (item.metal === 'Silver') {
      rate = item.purity === '925' ? bullionRates.silver925 : bullionRates.silver;
    }

    const metalValue = (parseFloat(item.netWeight) || 0) * rate;
    const diamondValue = item.diamondPrice || 0;
    return Math.round(metalValue + diamondValue);
  };

  const totalGrossWeight = filteredProducts.reduce((sum, item) => sum + (parseFloat(item.grossWeight) || 0), 0);
  const totalNetWeight = filteredProducts.reduce((sum, item) => sum + (parseFloat(item.netWeight) || 0), 0);
  const totalInventoryValuation = filteredProducts.reduce((sum, item) => sum + getItemValuation(item), 0);

  return (
    <div className="card-surface space-y-4">
      
      {/* Top Controls: Search + Summary Stats */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Article Name, Barcode, HUID, or Tray No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 pr-3 py-2 text-xs"
          />
        </div>

        {/* Catalog Summary Metric Badge */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-surface-400">
          <span className="px-2.5 py-1 rounded-lg bg-surface-subtle border border-surface-border text-surface-300">
            {filteredProducts.length} Articles Listed
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-subtle border border-surface-border text-surface-100 font-bold">
            Total: ₹{totalInventoryValuation.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-sans pb-1 border-b border-surface-border">
        {[
          { id: 'ALL', label: 'All Active Stock' },
          { id: 'GOLD', label: 'Fine Gold Articles' },
          { id: 'SILVER', label: 'Silver Articles' },
          { id: 'DIAMOND', label: 'Diamond & Gemstone' },
          { id: 'SOLD', label: 'Sold Out History' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-surface-hover text-brand-400 border border-brand-500/35 font-bold shadow-xs'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-hover border border-transparent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stock Table */}
      <div className="overflow-x-auto border border-surface-border rounded-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-surface-subtle text-surface-400 text-[10px] uppercase border-b border-surface-border">
            <tr>
              <th className="py-2.5 px-3 font-sans">Item Code</th>
              <th className="py-2.5 px-3 font-sans">Article Description</th>
              <th className="py-2.5 px-3">HUID</th>
              <th className="py-2.5 px-3">Purity</th>
              <th className="py-2.5 px-3 text-right">Gross (g)</th>
              <th className="py-2.5 px-3 text-right">Net Wt (g)</th>
              <th className="py-2.5 px-3 text-right">Making Type</th>
              <th className="py-2.5 px-3 text-right">Live Valuation</th>
              <th className="py-2.5 px-3 text-center">Tray</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-center">Tag Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/60">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-surface-500 font-sans text-xs">
                  No jewellery articles match the selected criteria.
                </td>
              </tr>
            ) : (
              filteredProducts.map((item) => {
                const valuation = getItemValuation(item);
                return (
                  <tr key={item.id} className="hover:bg-surface-hover/50 transition">
                    {/* 1. Item Code: Clean Monospace Badge instead of raw long orange UUID */}
                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-surface-subtle border border-surface-border text-surface-300 font-medium" title={item.id}>
                        {item.barcode ? `A3-${item.barcode}` : item.id.slice(0, 8)}
                      </span>
                    </td>

                    {/* 2. Article Description & Category */}
                    <td className="py-2.5 px-3 font-sans">
                      <div className="font-semibold text-surface-100">{item.name}</div>
                      <div className="text-[10px] text-surface-400 font-mono">
                        {item.category} &bull; Barcode: {item.barcode}
                      </div>
                    </td>

                    {/* 3. HUID Badge */}
                    <td className="py-2.5 px-3 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/25 text-brand-text font-bold text-[10px]">
                        {item.huid || 'N/A'}
                      </span>
                    </td>

                    {/* 4. Precious Metal Purity with Authentic High-Contrast Jewelry Distinction */}
                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      {item.metal === 'Silver' ? (
                        <span className="px-1.5 py-0.5 rounded bg-slate-500/10 border border-slate-500/25 text-slate-700 dark:text-slate-300 font-semibold">
                          925 Silver
                        </span>
                      ) : item.diamondCarat ? (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-700 dark:text-indigo-300 font-semibold">
                          {item.purity} Diamond
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 font-semibold">
                          {item.purity} ({item.purityPercent}%)
                        </span>
                      )}
                    </td>

                    {/* 5. Gross Weight */}
                    <td className="py-2.5 px-3 text-right text-surface-300">{(parseFloat(item.grossWeight) || 0).toFixed(3)}</td>

                    {/* 6. Net Weight */}
                    <td className="py-2.5 px-3 text-right font-bold text-surface-100">{(parseFloat(item.netWeight) || 0).toFixed(3)}</td>

                    {/* 7. Making Charge */}
                    <td className="py-2.5 px-3 text-right text-[10px] text-surface-400">
                      {item.makingChargeType === 'PER_GRAM' ? `₹${item.makingChargeRate}/g` : `${item.makingChargeRate}%`}
                    </td>

                    {/* 8. Live Valuation: Clean High-Contrast Ivory White (No Mint Green) */}
                    <td className="py-2.5 px-3 text-right font-bold font-mono text-surface-100 text-xs">
                      ₹{valuation.toLocaleString('en-IN')}
                    </td>

                    {/* 9. Tray No */}
                    <td className="py-2.5 px-3 text-center text-surface-400 text-[10px]">
                      {item.trayNo}
                    </td>

                    {/* 10. Operational Status: Refined Colombian Emerald Badge */}
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-medium inline-flex items-center gap-1.5 ${
                        item.status === 'IN_STOCK'
                          ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/25'
                          : 'bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-500/25'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'IN_STOCK' ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-rose-500 dark:bg-rose-400'}`} />
                        <span>{item.status === 'IN_STOCK' ? 'In Stock' : 'Sold'}</span>
                      </span>
                    </td>

                    {/* 11. Tag Studio Print Action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onOpenTagStudio(item)}
                        className="btn-secondary py-1 px-2.5 text-[10px] font-sans flex items-center gap-1.5 mx-auto"
                        title="Design & Print ZPL Jewellery Tag"
                      >
                        <Tag className="w-3 h-3 text-brand-accent" />
                        <span>Tag</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div>
          <span className="text-surface-400">Total Items: </span>
          <strong className="text-surface-100">{filteredProducts.length}</strong>
        </div>
        <div>
          <span className="text-surface-400">Total Gross Wt: </span>
          <strong className="text-surface-100">{totalGrossWeight.toFixed(3)} GM</strong>
        </div>
        <div>
          <span className="text-surface-400">Total Net Gold: </span>
          <strong className="text-brand-text font-bold">{totalNetWeight.toFixed(3)} GM</strong>
        </div>
        <div>
          <span className="text-surface-400">Live Inventory Valuation: </span>
          <strong className="text-surface-100 font-bold text-sm">
            ₹{totalInventoryValuation.toLocaleString('en-IN')}
          </strong>
        </div>
      </div>

    </div>
  );
};
