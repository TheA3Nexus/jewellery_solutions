import React, { useState } from 'react';
import { 
  UserPlus, 
  X, 
  Coins, 
  Gift, 
  ShieldCheck, 
  IndianRupee, 
  Phone, 
  User, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

export const EnrollMemberModal = ({
  isOpen,
  onClose,
  onEnrollMember,
  schemes = []
}) => {
  if (!isOpen) return null;

  const defaultScheme = schemes[0] || {
    id: 'SCH-11-PLUS-1',
    name: 'Swarna Varsha 11+1 Golden Plan',
    monthlyEmi: 2000,
    tenureMonths: 11,
    bonusAmount: 2000,
    joiningGift: '10g 999 Fine Silver Coin'
  };

  const nextToken = Math.floor(105 + Math.random() * 40);

  const [form, setForm] = useState({
    schemeName: defaultScheme.name,
    monthlyEmi: defaultScheme.monthlyEmi,
    tenureMonths: defaultScheme.tenureMonths,
    bonusAmount: defaultScheme.bonusAmount,
    joiningGift: defaultScheme.joiningGift,
    customerName: '',
    phone: '',
    city: 'Mumbai',
    tokenNo: String(nextToken),
    collectFirstEmi: true,
    paymentMode: 'CASH'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.phone.trim()) {
      alert('Please enter member name and phone number.');
      return;
    }

    const emi = parseFloat(form.monthlyEmi) || 2000;
    const initialInstallments = form.collectFirstEmi
      ? [
          {
            num: 1,
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            amount: emi,
            mode: form.paymentMode
          }
        ]
      : [];

    const newMember = {
      id: `MEM-${form.tokenNo}`,
      tokenNo: form.tokenNo,
      passbookNo: `PB-2026-${form.tokenNo.padStart(4, '0')}`,
      customerName: form.customerName,
      phone: form.phone.startsWith('+91') ? form.phone : `+91 ${form.phone}`,
      city: form.city,
      schemeName: form.schemeName,
      monthlyEmi: emi,
      tenureMonths: form.tenureMonths,
      bonusAmount: emi,
      joiningGift: form.joiningGift,
      paidInstallments: initialInstallments,
      status: 'ACTIVE',
      enrolledAt: new Date().toISOString()
    };

    onEnrollMember(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider font-sans">
                Enroll New Scheme Member (नया खाता खोलें)
              </h3>
              <p className="text-[10px] text-surface-400 font-mono">
                BUDS Act 2019 Compliant &bull; 11+1 Swarna Nidhi Passbook Registration
              </p>
            </div>
          </div>
          <button
            data-testid="close-modal-btn"
            onClick={onClose}
            className="text-surface-400 hover:text-surface-100 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          
          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-surface-400 block mb-1 font-semibold uppercase">
                Member Full Name *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-surface-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  id="input-member-name"
                  placeholder="e.g. Meenakshi Sundaram"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="input-field pl-8 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-surface-400 block mb-1 font-semibold uppercase">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-surface-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  id="input-member-phone"
                  placeholder="98200 88990"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field pl-8 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Scheme & EMI Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-surface-400 block mb-1 font-semibold uppercase">
                Scheme Plan *
              </label>
              <select
                id="select-member-scheme"
                value={form.schemeName}
                onChange={(e) => {
                  const s = schemes.find(sc => sc.name === e.target.value) || defaultScheme;
                  setForm({
                    ...form,
                    schemeName: s.name,
                    monthlyEmi: s.monthlyEmi,
                    bonusAmount: s.bonusAmount || s.monthlyEmi
                  });
                }}
                className="select-field text-xs font-sans"
              >
                <option value="Swarna Varsha 11+1 Golden Plan">Swarna Varsha 11+1 (₹2,000/mo)</option>
                <option value="Dhan-Varsha Royal Kitty Plan">Dhan-Varsha Royal (₹5,000/mo)</option>
                <option value="Swarna Nidhi Bullion Accumulation Plan">Swarna Nidhi Bullion (₹10,000/mo)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-surface-400 block mb-1 font-semibold uppercase">
                Monthly Installment (₹) *
              </label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 text-surface-500 absolute left-2.5 top-2.5" />
                <input
                  type="number"
                  step="500"
                  required
                  id="input-member-emi"
                  value={form.monthlyEmi}
                  onChange={(e) => setForm({ ...form, monthlyEmi: e.target.value })}
                  className="input-field pl-8 font-mono font-bold text-surface-100 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Joining Gift & City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-surface-400 block mb-1 font-semibold uppercase">
                Assured Joining Gift
              </label>
              <select
                id="select-member-gift"
                value={form.joiningGift}
                onChange={(e) => setForm({ ...form, joiningGift: e.target.value })}
                className="select-field text-xs font-sans"
              >
                <option value="10g 999 Fine Silver Coin">10g 999 Fine Silver Coin</option>
                <option value="Lakshmi-Ganesh Silver Diya">Lakshmi-Ganesh Silver Diya (15g)</option>
                <option value="Gold-Plated Shubh Labh Idol">Gold-Plated Shubh Labh Idol</option>
                <option value="None / Cash Discount">None (Adjust against making)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-surface-400 block mb-1 font-semibold uppercase">
                Assigned Token &amp; Passbook #
              </label>
              <input
                type="text"
                disabled
                value={`Token #${form.tokenNo} (PB-2026-${form.tokenNo.padStart(4, '0')})`}
                className="input-field text-xs font-mono bg-surface-950 text-brand-400 font-bold"
              />
            </div>
          </div>

          {/* First Installment Collection Checkbox */}
          <div className="p-3 bg-surface-950 rounded-xl border border-surface-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                id="checkbox-collect-first-emi"
                checked={form.collectFirstEmi}
                onChange={(e) => setForm({ ...form, collectFirstEmi: e.target.checked })}
                className="rounded border-surface-700 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-xs font-semibold text-surface-200">
                Collect 1st Installment Now (₹{parseFloat(form.monthlyEmi || 0).toLocaleString('en-IN')})
              </span>
            </label>

            {form.collectFirstEmi && (
              <div className="flex items-center gap-4 pl-6 pt-1 text-xs font-mono">
                <span className="text-surface-400 text-[10px]">Payment Mode:</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-surface-200">
                  <input
                    type="radio"
                    name="mode"
                    value="CASH"
                    checked={form.paymentMode === 'CASH'}
                    onChange={() => setForm({ ...form, paymentMode: 'CASH' })}
                  />
                  <span>Cash Safe</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-surface-200">
                  <input
                    type="radio"
                    name="mode"
                    value="UPI"
                    checked={form.paymentMode === 'UPI'}
                    onChange={() => setForm({ ...form, paymentMode: 'UPI' })}
                  />
                  <span>UPI / Bank Transfer</span>
                </label>
              </div>
            )}
          </div>

          {/* Statutory Shield */}
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-surface-300 flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>BUDS Act 2019: Guaranteed 11-month tenure with 12th month free bonus credit.</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-2 border-t border-surface-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-1.5 px-3 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-submit-enroll-member"
              className="btn-primary py-1.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll &amp; Issue Passbook</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
