import React, { useState, useEffect } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { useHardware } from '../../../context/HardwareContext';
import { 
  Scan, 
  Plus, 
  Trash2, 
  Scale, 
  Sparkles, 
  Layers, 
  Check, 
  Search,
  Tag
} from 'lucide-react';

export const ProductIngestionTable = ({ cart, setCart }) => {
  const { products, bullionRates } = useTenant();
  const { scaleWeight, isScaleStable } = useHardware();

  const [scanInput, setScanInput] = useState('');
  const [isStockDrawerOpen, setIsStockDrawerOpen] = useState(false);

  // Quick keyboard shortcut F2 to pull weight from scale
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        console.info('[POS] F2 Triggered: Live scale weight fetched:', scaleWeight);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scaleWeight]);

  // Compute pricing for an item
  const calculateItemFinancials = (item) => {
    let ratePerGram = bullionRates.gold22k;
    if (item.metal === 'Gold') {
      if (item.purity === '24K') ratePerGram = bullionRates.gold24k;
      else if (item.purity === '22K') ratePerGram = bullionRates.gold22k;
      else if (item.purity === '18K') ratePerGram = bullionRates.gold18k;
      else if (item.purity === '14K') ratePerGram = bullionRates.gold14k;
    } else if (item.metal === 'Silver') {
      ratePerGram = item.purity === '925' ? bullionRates.silver925 : bullionRates.silver;
    }

    const netMetalValue = Math.round(item.netWeight * ratePerGram);

    let makingChargeTotal = 0;
    if (item.makingChargeType === 'PERCENTAGE') {
      makingChargeTotal = Math.round((netMetalValue * item.makingChargeRate) / 100);
    } else if (item.makingChargeType === 'PER_GRAM') {
      makingChargeTotal = Math.round(item.netWeight * item.makingChargeRate);
    } else {
      makingChargeTotal = item.makingChargeRate || 0;
    }

    const diamondStoneTotal = item.diamondPrice || 0;
    const hallmarkCharge = item.hallmarkCharge || 0;

    const rowTotal = netMetalValue + makingChargeTotal + diamondStoneTotal + hallmarkCharge;

    return {
      ratePerGram,
      netMetalValue,
      makingChargeTotal,
      diamondStoneTotal,
      hallmarkCharge,
      rowTotal
    };
  };

  const handleAddItemToCart = (product) => {
    if (cart.find(c => c.id === product.id)) return;

    const financials = calculateItemFinancials(product);
    setCart(prev => [
      ...prev,
      {
        ...product,
        ...financials
      }
    ]);
    setScanInput('');
  };

  const handleScanSubmit = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const term = scanInput.trim().toLowerCase();
    const found = products.find(p => 
      p.status === 'IN_STOCK' && (
        p.id.toLowerCase() === term ||
        p.barcode.toLowerCase() === term ||
        (p.huid && p.huid.toLowerCase() === term) ||
        (p.rfidTag && p.rfidTag.toLowerCase() === term)
      )
    );

    if (found) {
      handleAddItemToCart(found);
    } else {
      alert(`Article "${scanInput}" not found in active inventory.`);
    }
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="card-surface space-y-3">
      {/* Search & Barcode Scan Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <form onSubmit={handleScanSubmit} className="relative flex-1">
          <Scan className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Scan Barcode / HUID / Item Code (e.g. 101001, HD7891)..."
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            className="input-field pl-9 pr-3 py-2 text-xs"
          />
        </form>

        <button
          type="button"
          onClick={() => setIsStockDrawerOpen(!isStockDrawerOpen)}
          className="btn-secondary text-xs"
        >
          <Layers className="w-3.5 h-3.5 text-brand-400" />
          <span>{isStockDrawerOpen ? 'Hide Catalog' : 'Pick from Stock'}</span>
        </button>
      </div>

      {/* Quick In-Stock Drawer */}
      {isStockDrawerOpen && (
        <div className="bg-surface-950 border border-surface-800 rounded-xl p-3 animate-in fade-in duration-150">
          <div className="text-[11px] font-medium text-surface-400 mb-2 flex justify-between items-center">
            <span>Available Ready-to-Sell Inventory:</span>
            <span className="text-[10px] text-brand-400 font-mono">Click item to add</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
            {products.filter(p => p.status === 'IN_STOCK').map(p => {
              const inCart = Boolean(cart.find(c => c.id === p.id));
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleAddItemToCart(p)}
                  disabled={inCart}
                  className={`px-2.5 py-1.5 rounded-lg border text-left text-xs transition flex items-center gap-2 ${
                    inCart 
                      ? 'bg-surface-900 border-surface-800 text-surface-500 opacity-60'
                      : 'bg-surface-900 hover:bg-surface-850 border-surface-700/60 text-surface-200'
                  }`}
                >
                  <Tag className="w-3 h-3 text-brand-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-surface-100 leading-tight">{p.name}</div>
                    <div className="text-[10px] text-surface-400 font-mono">
                      {p.netWeight.toFixed(3)}g &bull; {p.purity} &bull; {p.huid || p.barcode}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Cart Items Table */}
      <div className="overflow-x-auto border border-surface-800 rounded-lg">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-surface-950/80 text-[10px] text-surface-400 uppercase tracking-wider border-b border-surface-800">
            <tr>
              <th className="py-2.5 px-3 font-sans">#</th>
              <th className="py-2.5 px-3 font-sans">Item Details</th>
              <th className="py-2.5 px-3">HUID</th>
              <th className="py-2.5 px-3 text-right">Gross (g)</th>
              <th className="py-2.5 px-3 text-right">Net Wt (g)</th>
              <th className="py-2.5 px-3 text-right">Rate (₹/g)</th>
              <th className="py-2.5 px-3 text-right">Making (₹)</th>
              <th className="py-2.5 px-3 text-right">Subtotal (₹)</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/60">
            {cart.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-surface-500 font-sans text-xs">
                  <Scan className="w-6 h-6 mx-auto mb-1.5 text-surface-600 stroke-[1.5]" />
                  <span>No items added yet. Scan barcode, HUID, or select from stock above.</span>
                </td>
              </tr>
            ) : (
              cart.map((item, idx) => (
                <tr key={item.id} className="hover:bg-surface-850/40 transition">
                  <td className="py-2.5 px-3 text-surface-500">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <div className="font-semibold text-surface-100">{item.name}</div>
                    <div className="text-[10px] text-surface-400 font-mono">
                      {item.metal} &bull; {item.purity} ({item.purityPercent}%)
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-surface-950 border border-surface-800 text-brand-300 font-semibold text-[11px]">
                      {item.huid || 'N/A'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">{item.grossWeight.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-surface-100">{item.netWeight.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-right text-surface-300">₹{item.ratePerGram.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-surface-300">₹{item.makingChargeTotal.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-brand-300 text-sm">
                    ₹{item.rowTotal.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-surface-500 hover:text-rose-400 transition"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};