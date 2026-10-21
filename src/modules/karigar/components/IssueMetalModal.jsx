import React, { useState } from 'react';
import { useHardware } from '../../../context/HardwareContext';
import { Hammer, X, Scale, Coins, Check } from 'lucide-react';

export const IssueMetalModal = ({ isOpen, onClose, onIssueMetal, karigars }) => {
  const { scaleWeight } = useHardware();

  const [form, setForm] = useState({
    karigarId: karigars[0]?.id || '',
    metalType: 'Gold',
    purity: '24K (99.9%)',
    weightGrams: '',
    workOrderDesc: '22K Traditional Peacock Bridal Set (Necklace + Earrings)',
    expectedDeliveryDays: '7',
    targetGrossWeight: '45.000',
    maxGhatPercent: '2.5'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const wt = parseFloat(form.weightGrams) || 0;
    if (wt <= 0) {
      alert('Please enter valid metal weight to issue.');
      return;
    }

    onIssueMetal({
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      karigarId: form.karigarId,
      metalType: form.metalType,
      purity: form.purity,
      weightGrams: wt,
      workOrderDesc: form.workOrderDesc,
      issuedAt: new Date().toISOString(),
      maxGhatPercent: parseFloat(form.maxGhatPercent) || 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <Hammer className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
              Issue Pure Metal to Artisan (Karigar Javak)
            </h3>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">Select Karigar *</label>
              <select
                value={form.karigarId}
                onChange={(e) => setForm({ ...form, karigarId: e.target.value })}
                className="select-field font-sans text-xs"
              >
                {karigars.map(k => (
                  <option key={k.id} value={k.id}>{k.name} ({k.specialization})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">Metal &amp; Purity</label>
              <select
                value={form.purity}
                onChange={(e) => setForm({ ...form, purity: e.target.value })}
                className="select-field font-sans text-xs"
              >
                <option value="24K (99.9%)">24K Pure Gold Bar (99.9%)</option>
                <option value="22K (91.6%)">22K Fine Casting Scrap (91.6%)</option>
                <option value="999 Silver">999 Fine Pure Silver</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-surface-400 font-sans block mb-1">Work Order Description</label>
            <input
              type="text"
              required
              value={form.workOrderDesc}
              onChange={(e) => setForm({ ...form, workOrderDesc: e.target.value })}
              className="input-field font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] text-surface-400 font-sans">Issued Weight (Grams) *</label>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, weightGrams: scaleWeight.toFixed(3) }))}
                  className="text-[10px] text-emerald-400 font-sans hover:underline"
                >
                  Fetch Scale ({scaleWeight.toFixed(3)}g)
                </button>
              </div>
              <input
                type="number"
                step="0.001"
                required
                placeholder="0.000"
                value={form.weightGrams}
                onChange={(e) => setForm({ ...form, weightGrams: e.target.value })}
                className="input-field font-bold text-surface-100"
              />
            </div>

            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">Max Allowable Wastage (Ghat %)</label>
              <input
                type="number"
                step="0.1"
                value={form.maxGhatPercent}
                onChange={(e) => setForm({ ...form, maxGhatPercent: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-surface-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-2 text-xs font-sans"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 py-2 text-xs font-bold font-sans"
            >
              <Check className="w-4 h-4" />
              <span>Issue Metal &amp; Debit Artisan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};