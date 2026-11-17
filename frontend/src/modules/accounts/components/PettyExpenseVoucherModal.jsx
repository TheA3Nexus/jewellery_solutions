import React from 'react';
import { printA4 } from '../../../utils/printService';
import { 
  Receipt, 
  Printer, 
  X, 
  CheckCircle2, 
  IndianRupee, 
  Building2, 
  ShieldCheck,
  Calendar,
  Tag
} from 'lucide-react';

export const PettyExpenseVoucherModal = ({
  isOpen,
  onClose,
  expenseData,
  tenant
}) => {
  if (!isOpen || !expenseData) return null;

  const voucherNo = expenseData.voucherNo || `EXP-${Date.now().toString().slice(-4)}`;
  const dateStr = expenseData.date || new Date().toISOString().split('T')[0];
  const timeStr = expenseData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const amount = Math.abs(parseFloat(expenseData.amount || expenseData.cash || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Petty Cash Expense Voucher (खर्च पर्ची)
              </h3>
              <span className="text-[10px] font-mono text-surface-400">
                Ref: {voucherNo} &bull; Category: {expenseData.category?.replace('_', ' ') || 'SHOWROOM EXPENSE'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-print-expense-voucher"
              onClick={() => printA4('printable-petty-expense-slip', `Expense_Voucher_${voucherNo}`)}
              className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher Slip</span>
            </button>
            <button
              data-testid="close-modal-btn"
              onClick={onClose}
              className="text-surface-400 hover:text-surface-100 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pure-Paper Printable Slip Container */}
        <div
          id="printable-petty-expense-slip"
          className="bg-white text-slate-950 p-6 rounded-xl border border-slate-300 font-sans text-xs space-y-4 printable-document printable-a4"
        >
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-3">
            <h2 className="text-base font-black tracking-tight text-slate-950 uppercase">
              {tenant?.businessName || 'A3 JEWELLERY & BULLION HOUSE'}
            </h2>
            <p className="text-[10px] text-slate-600 font-medium">
              {tenant?.address || 'Showroom 4, Bullion Exchange Plaza, Zaveri Bazaar, Mumbai - 400002'}
            </p>
            <p className="text-[10px] text-slate-600 font-mono mt-0.5">
              GSTIN: {tenant?.gstin || '27AAACA1234A1Z5'} &bull; Phone: {tenant?.phone || '+91 98200 12345'}
            </p>
            <div className="inline-block mt-2 px-3 py-0.5 border border-slate-900 font-bold uppercase text-[10px] tracking-wider bg-slate-100">
              PETTY CASH PAYMENT VOUCHER / खतौनी खर्च पर्ची
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Voucher No:</span>
              <span className="font-mono font-bold text-slate-900 text-xs">{voucherNo}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Date &amp; Time:</span>
              <span className="font-mono text-slate-900">{dateStr} &bull; {timeStr}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Expense Head / Category:</span>
              <span className="font-bold text-slate-900 uppercase">{expenseData.category?.replace('_', ' ') || 'SHOWROOM EXPENSE'}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Disbursed From:</span>
              <span className="font-medium text-slate-900 font-mono">Counter Cash Safe #1</span>
            </div>
          </div>

          {/* Payment Particulars */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-100 border-b border-slate-200 font-semibold uppercase text-slate-700">
                <tr>
                  <th className="p-2.5">Description &amp; Purpose</th>
                  <th className="p-2.5 text-right w-36">Amount Paid (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-2.5 font-medium text-slate-900">
                    <div>{expenseData.particulars || expenseData.narration || 'Showroom Daily Petty Expense'}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Paid to / Beneficiary: <strong className="text-slate-800">{expenseData.paidTo || expenseData.counterStaff || 'Manoj (Cashier)'}</strong>
                    </div>
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold text-slate-950 text-sm">
                    ₹{amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td className="p-2.5 text-right uppercase text-[10px] text-slate-700">Total Cash Disbursed:</td>
                  <td className="p-2.5 text-right font-mono text-slate-950 text-sm">
                    ₹{amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Amount in Words */}
          <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
            <strong>Payment Mode:</strong> Cash Payment from Counter Safe &bull; Verified against Daily Rojnamcha
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-center text-[10px]">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <span className="font-bold text-slate-800 mt-1 block">Receiver's Signature</span>
              <span className="text-[9px] text-slate-500">(प्राप्तकर्ता हस्ताक्षर)</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <span className="font-bold text-slate-800 mt-1 block">Manager / Approver</span>
              <span className="text-[9px] text-slate-500">(स्वीकृति अधिकारी)</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <span className="font-bold text-slate-800 mt-1 block">Cashier / Disburser</span>
              <span className="text-[9px] text-slate-500">(रोकड़िया हस्ताक्षर)</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
