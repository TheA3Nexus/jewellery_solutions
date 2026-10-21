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

    const metalValue = item.netWeight * rate;
    const diamondValue = item.diamondPrice || 0;
    return Math.round(metalValue + diamondValue);
  };

  const totalGrossWeight = filteredProducts.reduce((sum, item) => sum + (item.grossWeight || 0), 0);
  const totalNetWeight = filteredProducts.reduce((sum, item) => sum + (item.netWeight || 0), 0);
  const totalInventoryValuation = filteredProducts.reduce((sum, item) => sum + getItemValuation(item), 0);

  return (
    <div className="card-surface space-y-4">
      
      {/* Top Controls: Search + Filters + Add Button */}
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="btn-primary py-2 text-xs font-sans font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Article</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-sans pb-1 border-b border-surface-800">
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
                ? 'bg-brand-500 text-surface-950 font-bold shadow-sm'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-850'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stock Table */}
      <div className="overflow-x-auto border border-surface-800 rounded-lg">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-surface-950 text-surface-400 text-[10px] uppercase border-b border-surface-800">
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
          <tbody className="divide-y divide-surface-800/60">
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
                  <tr key={item.id} className="hover:bg-surface-850/40 transition">
                    <td className="py-2.5 px-3 font-bold text-brand-400">{item.id}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <div className="font-semibold text-surface-100">{item.name}</div>
                      <div className="text-[10px] text-surface-400 font-mono">
                        {item.category} &bull; Barcode: {item.barcode}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-surface-950 border border-surface-800 text-brand-300 font-bold text-[11px]">
                        {item.huid || 'N/A'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-surface-300">
                      {item.purity} ({item.purityPercent}%)
                    </td>
                    <td className="py-2.5 px-3 text-right text-surface-300">{item.grossWeight.toFixed(3)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-surface-100">{item.netWeight.toFixed(3)}</td>
                    <td className="py-2.5 px-3 text-right text-[10px] text-surface-400">
                      {item.makingChargeType === 'PER_GRAM' ? `₹${item.makingChargeRate}/g` : `${item.makingChargeRate}%`}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700 text-xs">
                      ₹{valuation.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-center text-surface-400 text-[10px]">
                      {item.trayNo}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans ${
                        item.status === 'IN_STOCK'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-rose-50 text-rose-700 border border-rose-300'
                      }`}>
                        {item.status === 'IN_STOCK' ? 'In Stock' : 'Sold'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onOpenTagStudio(item)}
                        className="btn-secondary py-1 px-2 text-[10px] font-sans"
                        title="Design & Print ZPL Jewellery Tag"
                      >
                        <Tag className="w-3 h-3 text-brand-400" />
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
      <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
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
          <strong className="text-brand-300 font-bold">{totalNetWeight.toFixed(3)} GM</strong>
        </div>
        <div>
          <span className="text-surface-400">Live Inventory Valuation: </span>
          <strong className="text-emerald-400 font-bold text-sm">
            ₹{totalInventoryValuation.toLocaleString('en-IN')}
          </strong>
        </div>
      </div>

    </div>
  );
};