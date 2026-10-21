import React, { useState } from 'react';
import { useHardware } from '../../../context/HardwareContext';
import { 
  Plus, 
  X, 
  Scale, 
  Tag, 
  QrCode, 
  ShieldCheck, 
  Layers, 
  Coins, 
  Sparkles,
  Camera,
  Check
} from 'lucide-react';

export const AddItemModal = ({ isOpen, onClose, onAddItem, bullionRates }) => {
  const { scaleWeight } = useHardware();

  const [form, setForm] = useState({
    name: '',
    category: 'Rings',
    metal: 'Gold',
    purity: '22K',
    purityPercent: 91.67,
    huid: '',
    grossWeight: '',
    stoneWeight: '0.000',
    wastagePercent: '2.5',
    makingChargeType: 'PER_GRAM',
    makingChargeRate: '650',
    hallmarkCharge: '45.00',
    trayNo: 'Tray-A01',
    diamondCarat: '',
    diamondClarity: 'VVS1',
    diamondColor: 'G-H',
    diamondPrice: '',
  });

  if (!isOpen) return null;

  const handleFetchScaleWeight = () => {
    setForm(prev => ({ ...prev, grossWeight: scaleWeight.toFixed(3) }));
  };

  const handlePurityChange = (purity) => {
    let purityPercent = 91.67;
    if (purity === '24K') purityPercent = 99.90;
    else if (purity === '22K') purityPercent = 91.67;
    else if (purity === '18K') purityPercent = 75.00;
    else if (purity === '14K') purityPercent = 58.33;
    else if (purity === '925') purityPercent = 92.50;

    setForm(prev => ({ ...prev, purity, purityPercent }));
  };

  const gross = parseFloat(form.grossWeight) || 0;
  const stone = parseFloat(form.stoneWeight) || 0;
  const netWeight = Math.max(0, gross - stone);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || gross <= 0) {
      alert('Please provide a valid article name and gross weight.');
      return;
    }

    const uniqueId = `A3-${form.category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const barcode = Math.floor(100000 + Math.random() * 900000).toString();
    const rfidTag = `E280116060000204A1${Math.floor(100000 + Math.random() * 900000)}`;

    const newItem = {
      id: uniqueId,
      barcode,
      rfidTag,
      name: form.name,
      category: form.category,
      metal: form.metal,
      purity: form.purity,
      purityPercent: form.purityPercent,
      huid: form.huid ? form.huid.toUpperCase() : `HD${Math.floor(1000 + Math.random() * 9000)}`,
      grossWeight: gross,
      stoneWeight: stone,
      netWeight: parseFloat(netWeight.toFixed(3)),
      wastagePercent: parseFloat(form.wastagePercent) || 0,
      makingChargeType: form.makingChargeType,
      makingChargeRate: parseFloat(form.makingChargeRate) || 0,
      hallmarkCharge: parseFloat(form.hallmarkCharge) || 0,
      trayNo: form.trayNo || 'Tray-General',
      diamondCarat: form.diamondCarat ? parseFloat(form.diamondCarat) : null,
      diamondClarity: form.diamondCarat ? form.diamondClarity : null,
      diamondColor: form.diamondCarat ? form.diamondColor : null,
      diamondPrice: form.diamondPrice ? parseFloat(form.diamondPrice) : null,
      status: 'IN_STOCK',
      createdAt: new Date().toISOString(),
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Catalog New Jewellery Article
              </h3>
              <p className="text-[11px] text-surface-400 font-mono">
                Opening Stock &bull; Precision Weight &bull; HUID Registration
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          
          {/* Article Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] text-surface-400 font-sans block mb-1">
                Article Description / Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 22K Traditional Peacock Necklace"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="select-field font-sans text-xs"
              >
                <option value="Rings">Rings</option>
                <option value="Chains">Chains</option>
                <option value="Bangles">Bangles</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Pendants">Pendants</option>
                <option value="Earrings">Earrings</option>
                <option value="Mangalsutra">Mangalsutra</option>
                <option value="Silver Articles">Silver Articles</option>
                <option value="Bullion & Bars">Bullion &amp; Bars</option>
              </select>
            </div>
          </div>

          {/* Metal, Purity & HUID */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">Metal</label>
              <select
                value={form.metal}
                onChange={(e) => setForm({ ...form, metal: e.target.value })}
                className="select-field font-sans text-xs"
              >
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">Purity</label>
              <select
                value={form.purity}
                onChange={(e) => handlePurityChange(e.target.value)}
                className="select-field font-sans text-xs"
              >
                <option value="24K">24K (99.9%)</option>
                <option value="22K">22K (91.6%)</option>
                <option value="18K">18K (75.0%)</option>
                <option value="14K">14K (58.3%)</option>
                <option value="925">925 Sterling</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">
                Hallmark UID (6-Digit)
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. HD7891"
                value={form.huid}
                onChange={(e) => setForm({ ...form, huid: e.target.value.toUpperCase() })}
                className="input-field uppercase font-bold text-brand-300"
              />
            </div>

            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">
                Showroom Tray / Box
              </label>
              <input
                type="text"
                placeholder="Tray-A04"
                value={form.trayNo}
                onChange={(e) => setForm({ ...form, trayNo: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Weight Matrix with Scale Fetch Hook */}
          <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-surface-300 uppercase tracking-wider font-sans flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Weight Matrix &bull; 4-Decimal Precision</span>
              </span>
              <button
                type="button"
                onClick={handleFetchScaleWeight}
                className="btn-secondary py-1 px-2.5 text-[11px] font-sans text-emerald-400 hover:text-emerald-300"
                title="Fetch live weight from physical electronic scale"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Fetch Weight ({scaleWeight.toFixed(3)}g)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-surface-400 block mb-1 font-sans">
                  Gross Weight (Grams) *
                </label>
                <input
                  type="number"
                  step="0.001"
                  required
                  placeholder="0.000"
                  value={form.grossWeight}
                  onChange={(e) => setForm({ ...form, grossWeight: e.target.value })}
                  className="input-field font-bold text-surface-100"
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 block mb-1 font-sans">
                  Stone / Less Weight (Grams)
                </label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.000"
                  value={form.stoneWeight}
                  onChange={(e) => setForm({ ...form, stoneWeight: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 block mb-1 font-sans">
                  Computed Net Gold Weight
                </label>
                <div className="px-3 py-2 bg-surface-900 border border-surface-700/60 rounded-lg text-xs font-bold text-brand-300">
                  {netWeight.toFixed(3)} GM
                </div>
              </div>
            </div>
          </div>

          {/* Making Charges & Hallmark Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">
                Making Charge Type
              </label>
              <select
                value={form.makingChargeType}
                onChange={(e) => setForm({ ...form, makingChargeType: e.target.value })}
                className="select-field font-sans text-xs"
              >
                <option value="PER_GRAM">Per Gram (₹/g)</option>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Lum-Sum (₹)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">
                Making Rate / Value
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 650"
                value={form.makingChargeRate}
                onChange={(e) => setForm({ ...form, makingChargeRate: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">
                Govt Hallmarking Fee (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.hallmarkCharge}
                onChange={(e) => setForm({ ...form, hallmarkCharge: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Optional Diamond / Gemstone Section */}
          <div className="p-3.5 rounded-xl bg-surface-950/60 border border-surface-800 space-y-2">
            <span className="text-[11px] font-bold text-surface-400 uppercase tracking-wider font-sans block">
              Diamond &amp; Gemstone Details (Optional)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Carat</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00 ct"
                  value={form.diamondCarat}
                  onChange={(e) => setForm({ ...form, diamondCarat: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Clarity</label>
                <select
                  value={form.diamondClarity}
                  onChange={(e) => setForm({ ...form, diamondClarity: e.target.value })}
                  className="select-field font-sans text-xs"
                >
                  <option value="IF">IF</option>
                  <option value="VVS1">VVS1</option>
                  <option value="VVS2">VVS2</option>
                  <option value="VS1">VS1</option>
                  <option value="SI1">SI1</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Color</label>
                <input
                  type="text"
                  placeholder="G-H"
                  value={form.diamondColor}
                  onChange={(e) => setForm({ ...form, diamondColor: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Stone Price (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.diamondPrice}
                  onChange={(e) => setForm({ ...form, diamondPrice: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-surface-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-2.5 text-xs font-sans"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 py-2.5 text-xs font-bold font-sans"
            >
              <Check className="w-4 h-4" />
              <span>Register Article in Stock</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};