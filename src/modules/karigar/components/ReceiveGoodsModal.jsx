import React, { useState } from 'react';
import { useHardware } from '../../../context/HardwareContext';
import { Hammer, X, Scale, Check, AlertCircle } from 'lucide-react';

export const ReceiveGoodsModal = ({ isOpen, onClose, onReceiveGoods, karigars }) => {
  const { scaleWeight } = useHardware();

  const [form, setForm] = useState({
    karigarId: karigars[0]?.id || '',
    articleName: '22K Handcrafted Filigree Necklace',
    grossWeight: '',
    returnScrapWeight: '2.100',
    stoneWeight: '0.000',
    makingRatePerGram: '750',
    actualGhatGrams: '1.250'
  });

  if (!isOpen) return null;

  const gross = parseFloat(form.grossWeight) || 0;
  const scrap = parseFloat(form.returnScrapWeight) || 0;
  const stone = parseFloat(form.stoneWeight) || 0;
  const netWeight = Math.max(0, gross - stone);
  const totalMetalAccounted = netWeight + scrap;
  const makingChargesPayable = Math.round(netWeight * (parseFloat(form.makingRatePerGram) || 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.articleName || gross <= 0) {
      alert('Please enter valid article name and weight.');
      return;
    }

    onReceiveGoods({
      karigarId: form.karigarId,
      articleName: form.articleName,
      grossWeight: gross,
      netWeight,
      returnScrapWeight: scrap,
      makingChargesPayable,
      receivedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <Hammer className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
              Receive Finished Jewellery &amp; Scrap
            </h3>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">Select Karigar</label>
              <select
                value={form.karigarId}
                onChange={(e) => setForm({ ...form, karigarId: e.target.value })}
                className="select-field font-sans text-xs"
              >
                {karigars.map(k => (
                  <option key={k.id} value={k.id}>{k.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">Article Name</label>
              <input
                type="text"
                required
                value={form.articleName}
                onChange={(e) => setForm({ ...form, articleName: e.target.value })}
                className="input-field font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] text-surface-400 font-sans">Gross Wt (g) *</label>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, grossWeight: scaleWeight.toFixed(3) }))}
                  className="text-[10px] text-emerald-400 font-sans hover:underline"
                >
                  Scale ({scaleWeight.toFixed(3)}g)
                </button>
              </div>
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
              <label className="text-[10px] text-surface-400 font-sans block mb-1">Return Scrap (Chhilan)</label>
              <input
                type="number"
                step="0.001"
                value={form.returnScrapWeight}
                onChange={(e) => setForm({ ...form, returnScrapWeight: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">Stone / Wax Wt</label>
              <input
                type="number"
                step="0.001"
                value={form.stoneWeight}
                onChange={(e) => setForm({ ...form, stoneWeight: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Mazdoori Calculation */}
          <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <div>
                <label className="text-[10px] text-surface-400 font-sans block">Making Charge (₹/Gram)</label>
                <input
                  type="number"
                  value={form.makingRatePerGram}
                  onChange={(e) => setForm({ ...form, makingRatePerGram: e.target.value })}
                  className="input-field w-32 py-1 mt-0.5"
                />
              </div>

              <div className="text-right">
                <span className="text-surface-400 font-sans text-[10px] block">Labour Payable (Credit Karigar)</span>
                <strong className="text-emerald-400 text-sm font-bold">
                  ₹{makingChargesPayable.toLocaleString('en-IN')}
                </strong>
              </div>
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
              <span>Receive Article &amp; Update Ledgers</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};