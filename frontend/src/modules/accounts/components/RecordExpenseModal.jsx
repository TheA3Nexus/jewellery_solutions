import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Receipt, 
  IndianRupee, 
  Calendar, 
  UserCheck, 
  Tag, 
  FileText 
} from 'lucide-react';

export const RecordExpenseModal = ({
  isOpen,
  onClose,
  onRecordExpense
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    category: 'SHOWROOM_EXPENSE',
    particulars: '',
    amount: '',
    paidTo: '',
    counterStaff: 'Manoj (Cashier)',
    paymentMode: 'CASH'
  });

  const categories = [
    { value: 'SHOWROOM_EXPENSE', label: 'Showroom Tea, Refreshment & Sweeper' },
    { value: 'PACKAGING', label: 'Velvet Boxes, Pouches & Luxury Bags' },
    { value: 'UTILITIES', label: 'Diesel for Generator / Electricity / Water' },
    { value: 'LOGISTICS', label: 'Insured Bullion Courier & Freight' },
    { value: 'WORKSHOP_REPAIR', label: 'Laser Welding Rouge & Minor Tools' },
    { value: 'STAFF_WELFARE', label: 'Staff Meal Allowance & Overtime' },
    { value: 'SECURITY', label: 'Armed Security & CCTV Service' },
    { value: 'MARKETING', label: 'Showroom Banners & Printing' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) {
      alert('Please enter a valid expense amount.');
      return;
    }
    if (!form.particulars.trim()) {
      alert('Please describe the purpose of this expense.');
      return;
    }

    onRecordExpense({
      ...form,
      amount: amt
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Record Petty Cash Expense (खर्च पर्ची)
              </h3>
              <p className="text-[10px] text-surface-400">
                Disburse cash from counter drawer &amp; update live daybook balance.
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
          
          {/* Category */}
          <div>
            <label className="text-[10px] text-surface-400 block mb-1 font-semibold uppercase">
              Expense Head / Category *
            </label>
            <select
              id="select-expense-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="select-field text-xs font-sans"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Amount & Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-surface-400 block mb-1 font-semibold uppercase">
                Amount to Disburse (₹) *
              </label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 text-surface-500 absolute left-2.5 top-2.5" />
                <input
                  type="number"
                  step="1"
                  required
                  id="input-expense-amount"
                  placeholder="e.g. 1500"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="input-field pl-8 font-mono font-bold text-surface-100 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-surface-400 block mb-1 font-semibold uppercase">
                Payment Mode *
              </label>
              <select
                id="select-expense-mode"
                value={form.paymentMode}
                onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
                className="select-field text-xs font-sans"
              >
                <option value="CASH">Counter Cash Safe #1</option>
                <option value="UPI">Current Bank A/c (UPI)</option>
              </select>
            </div>
          </div>

          {/* Paid To & Cashier */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-surface-400 block mb-1 font-semibold uppercase">
                Paid To (Beneficiary Name) *
              </label>
              <input
                type="text"
                required
                id="input-expense-paid-to"
                placeholder="e.g. Ramesh Chaiwala / Shyam Transport"
                value={form.paidTo}
                onChange={(e) => setForm({ ...form, paidTo: e.target.value })}
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] text-surface-400 block mb-1 font-semibold uppercase">
                Disbursed By (Cashier)
              </label>
              <input
                type="text"
                id="input-expense-cashier"
                value={form.counterStaff}
                onChange={(e) => setForm({ ...form, counterStaff: e.target.value })}
                className="input-field text-xs font-mono"
              />
            </div>
          </div>

          {/* Particulars / Narration */}
          <div>
            <label className="text-[10px] text-surface-400 block mb-1 font-semibold uppercase">
              Purpose &amp; Detailed Narration *
            </label>
            <textarea
              required
              id="input-expense-particulars"
              rows="2"
              placeholder="e.g. Refreshments for bridal party clients & showroom sanitization expenses"
              value={form.particulars}
              onChange={(e) => setForm({ ...form, particulars: e.target.value })}
              className="input-field text-xs"
            ></textarea>
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
              id="btn-submit-expense"
              className="btn-primary py-1.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record &amp; Generate Voucher</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
