import React, { useState } from 'react';
import { 
  X, 
  Gift, 
  ShieldCheck, 
  Calendar, 
  Percent, 
  Coins, 
  Check 
} from 'lucide-react';

export const CreateSchemePlanModal = ({ isOpen, onClose, onCreatePlan }) => {
  const [form, setForm] = useState({
    name: 'Swarna Varsha 11+1 Golden Plan',
    type: 'CASH_11_PLUS_1',
    monthlyEmi: '2000',
    tenureMonths: 11,
    bonusAmount: '2000',
    joiningGift: '10g 999 Silver Coin',
    makingDiscountPercent: '20',
    isLuckyDrawActive: true,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const emi = parseFloat(form.monthlyEmi) || 0;
    const bonus = parseFloat(form.bonusAmount) || 0;

    const newPlan = {
      id: `SCH-${Math.floor(100 + Math.random() * 900)}`,
      name: form.name,
      type: form.type,
      monthlyEmi: emi,
      tenureMonths: parseInt(form.tenureMonths, 10),
      bonusAmount: bonus,
      joiningGift: form.joiningGift,
      makingDiscountPercent: parseFloat(form.makingDiscountPercent) || 0,
      isLuckyDrawActive: form.isLuckyDrawActive,
      activeMembersCount: 0,
      createdAt: new Date().toISOString()
    };

    onCreatePlan(newPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Create New Jewellery Savings Plan
              </h3>
              <p className="text-[11px] text-surface-400 font-mono">
                BUDS Act 2019 Legal Shield &bull; 11+1 Monthly Installment Structure
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          
          <div>
            <label className="text-[10px] text-surface-400 font-sans block mb-1">Scheme Plan Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">Plan Structure Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="select-field font-sans text-xs"
              >
                <option value="CASH_11_PLUS_1">11+1 Fixed Cash Installment</option>
                <option value="WEIGHT_BASED">Weight-Based Gold Accumulation</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">
                Tenure (Strictly &le; 11 Months for BUDS Act)
              </label>
              <input
                type="number"
                disabled
                value={form.tenureMonths}
                className="input-field bg-surface-950/60 opacity-80"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">Monthly Installment Amount (₹) *</label>
              <input
                type="number"
                required
                value={form.monthlyEmi}
                onChange={(e) => {
                  const emi = e.target.value;
                  setForm({ ...form, monthlyEmi: emi, bonusAmount: emi });
                }}
                className="input-field font-bold text-brand-300"
              />
            </div>

            <div>
              <label className="text-[10px] text-surface-400 font-sans block mb-1">
                Jeweller Bonus Contribution (12th Month)
              </label>
              <input
                type="number"
                value={form.bonusAmount}
                onChange={(e) => setForm({ ...form, bonusAmount: e.target.value })}
                className="input-field font-bold text-emerald-400"
              />
            </div>
          </div>

          {/* Promotional Perks */}
          <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-2.5">
            <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider font-sans block">
              Enrollment Perks &amp; Incentives
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Free Joining Gift Item</label>
                <input
                  type="text"
                  value={form.joiningGift}
                  onChange={(e) => setForm({ ...form, joiningGift: e.target.value })}
                  className="input-field font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">
                  Maturity Making Discount (%)
                </label>
                <input
                  type="number"
                  value={form.makingDiscountPercent}
                  onChange={(e) => setForm({ ...form, makingDiscountPercent: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* BUDS Act Notice */}
          <div className="p-2.5 rounded-lg bg-surface-950 border border-surface-800 text-[10px] text-surface-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Statutory Compliance Locked:</strong> Software enforces an 11-month contract to comply with the Banning of Unregulated Deposit Schemes (BUDS) Act, 2019. Cash refunds are locked; maturity is redeemed against jewelry purchase.
            </span>
          </div>

          {/* Actions */}
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
              <span>Launch Scheme Plan</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};