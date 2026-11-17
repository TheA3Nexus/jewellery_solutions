import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

export const PlanUpgradeModal = ({ isOpen, onClose, store, onUpdatePlan }) => {
  const [selectedPlan, setSelectedPlan] = useState(store?.plan || 'GOLD_SHOWROOM');
  const [validityDays, setValidityDays] = useState(365);
  const [paymentMode, setPaymentMode] = useState('BANK_TRANSFER');
  const [notes, setNotes] = useState('');

  if (!isOpen || !store) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onUpdatePlan(store.id, selectedPlan, validityDays);
    onClose();
  };

  const getPlanPrice = (plan) => {
    switch (plan) {
      case 'DIAMOND_ENTERPRISE': return '₹1,20,000';
      case 'GOLD_SHOWROOM': return '₹48,000';
      case 'SILVER_RETAIL': return '₹24,000';
      default: return '₹0 (Free Trial)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-card border border-surface-border rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex justify-between items-center border-b border-surface-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-100">
                Manage Subscription &amp; Licensing
              </h3>
              <p className="text-xs text-surface-400 truncate max-w-[320px]">
                {store.name} &bull; ID: {store.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-100 p-1.5 rounded-lg hover:bg-surface-hover transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1.5">
              Select Subscription Plan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'SILVER_RETAIL', name: 'Silver Retail', desc: '1 Desk • ₹24k/yr' },
                { id: 'GOLD_SHOWROOM', name: 'Gold Showroom', desc: '3 Desks + Kitty • ₹48k/yr' },
                { id: 'DIAMOND_ENTERPRISE', name: 'Diamond Enterprise', desc: '8 Desks + Karigar • ₹1.2L/yr' },
                { id: 'FREE_TRIAL', name: 'Free Trial', desc: '14 Days Evaluation' }
              ].map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedPlan(tier.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition ${
                    selectedPlan === tier.id
                      ? 'border-brand-400 bg-brand-500/10 text-surface-100'
                      : 'border-surface-border bg-surface-canvas/50 text-surface-400 hover:border-surface-border/80'
                  }`}
                >
                  <p className="text-xs font-bold text-surface-100">{tier.name}</p>
                  <p className="text-[10px] text-surface-400 mt-0.5">{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Validity Extension
              </label>
              <select
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                className="w-full bg-surface-canvas border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-100 focus:outline-none focus:border-brand-400"
              >
                <option value={365}>+ 1 Year (365 Days)</option>
                <option value={180}>+ 6 Months (180 Days)</option>
                <option value={90}>+ 3 Months (90 Days)</option>
                <option value={30}>+ 1 Month (30 Days)</option>
                <option value={14}>+ 14 Days (Trial)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Payment Collection Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full bg-surface-canvas border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-100 focus:outline-none focus:border-brand-400"
              >
                <option value="BANK_TRANSFER">Bank IMPS / NEFT Transfer</option>
                <option value="UPI">Showroom UPI QR</option>
                <option value="CHEQUE">Cheque Clearance</option>
                <option value="CASH">Cash Collection</option>
                <option value="WAIVED">Complimentary / Demo</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-canvas/70 border border-surface-border flex items-center justify-between text-xs">
            <span className="text-surface-400">Total Subscription Invoice Amount:</span>
            <span className="font-bold text-brand-400 font-mono text-sm">
              {getPlanPrice(selectedPlan)}
            </span>
          </div>

          <div className="flex justify-end items-center gap-2.5 pt-2 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-surface-border text-surface-300 hover:text-surface-100 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Update &amp; Issue License</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
