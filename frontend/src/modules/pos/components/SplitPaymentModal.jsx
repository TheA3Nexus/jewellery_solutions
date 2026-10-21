import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Banknote, 
  QrCode, 
  Building, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen, 
  Printer, 
  MessageCircle,
  X,
  FileCheck
} from 'lucide-react';

export const SplitPaymentModal = ({
  isOpen,
  onClose,
  totals,
  customer,
  onFinalizeSale
}) => {
  if (!isOpen) return null;

  const { grossTotal, exchangeCredit, taxableAmount, gstAmount, grandTotal } = totals;

  // Split amounts
  const [payments, setPayments] = useState({
    cash: 0,
    card: 0,
    upi: grandTotal, // default to UPI full
    cheque: 0,
    udhaar: 0,
  });

  const [cardDetails, setCardDetails] = useState({ last4: '', bank: '' });
  const [chequeDetails, setChequeDetails] = useState({ chequeNo: '', bankName: '' });

  // Section 269ST Violation: Hard restriction on cash >= ₹2,00,000
  const isCashRestricted = parseFloat(payments.cash || 0) >= 200000;

  // Total collected vs Grand Total
  const totalAllocated = 
    (parseFloat(payments.cash) || 0) +
    (parseFloat(payments.card) || 0) +
    (parseFloat(payments.upi) || 0) +
    (parseFloat(payments.cheque) || 0) +
    (parseFloat(payments.udhaar) || 0);

  const remainingBalance = grandTotal - totalAllocated;

  const handleQuickPayFull = (mode) => {
    setPayments({
      cash: mode === 'CASH' ? grandTotal : 0,
      card: mode === 'CARD' ? grandTotal : 0,
      upi: mode === 'UPI' ? grandTotal : 0,
      cheque: mode === 'CHEQUE' ? grandTotal : 0,
      udhaar: mode === 'UDHAAR' ? grandTotal : 0,
    });
  };

  const handleComplete = (invoiceType) => {
    if (isCashRestricted) {
      alert("Statutory Violation: Income Tax Act Section 269ST restricts single cash transactions of ₹2,00,000 or more. Please reduce cash amount.");
      return;
    }

    if (Math.abs(remainingBalance) > 1) {
      alert(`Payment mismatch: Outstanding balance of ₹${remainingBalance.toLocaleString('en-IN')}. Please allocate full amount or assign to Udhaar.`);
      return;
    }

    onFinalizeSale({
      paymentBreakdown: payments,
      cardDetails,
      chequeDetails,
      invoiceType // 'TAX_INVOICE' | 'ESTIMATE'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-400" />
              <span>Multi-Payment Settlement &amp; Billing</span>
            </h3>
            <p className="text-[11px] text-surface-400 font-mono mt-0.5">
              Customer: {customer.name || 'Walk-in'} &bull; PAN: {customer.pan || 'N/A'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-surface-400 hover:text-surface-100 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bill Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-surface-950 border border-surface-800 text-xs font-mono">
          <div>
            <span className="text-surface-400 text-[10px] block">Gross Value</span>
            <strong className="text-surface-200">₹{grossTotal.toLocaleString('en-IN')}</strong>
          </div>
          <div>
            <span className="text-surface-400 text-[10px] block">Old Metal Credit</span>
            <strong className="text-brand-400">-₹{exchangeCredit.toLocaleString('en-IN')}</strong>
          </div>
          <div>
            <span className="text-surface-400 text-[10px] block">GST (3%)</span>
            <strong className="text-surface-200">₹{gstAmount.toLocaleString('en-IN')}</strong>
          </div>
          <div className="bg-surface-900 p-1.5 rounded border border-surface-700/60">
            <span className="text-brand-400 text-[10px] block font-semibold">Net Payable</span>
            <strong className="text-brand-300 text-sm font-bold">₹{grandTotal.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Quick 1-Click Full Allocation Buttons */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider block">
            Quick 1-Click Pay Entire Bill With:
          </label>
          <div className="grid grid-cols-5 gap-1.5 text-xs font-mono">
            {['UPI', 'CARD', 'CASH', 'CHEQUE', 'UDHAAR'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => handleQuickPayFull(m)}
                className="btn-secondary py-1.5 text-[11px]"
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Split Allocation Fields */}
        <div className="space-y-3 font-mono text-xs">
          
          {/* Cash Row with Section 269ST Alert */}
          <div className="p-3 rounded-xl bg-surface-950/60 border border-surface-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-surface-200">
                <Banknote className="w-4 h-4 text-emerald-400" />
                <span>Cash Payment</span>
              </span>
              <input
                type="number"
                value={payments.cash || ''}
                onChange={(e) => setPayments({ ...payments, cash: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className={`w-36 text-right input-field font-bold ${
                  isCashRestricted ? 'border-rose-500 bg-rose-950/30 text-rose-300' : ''
                }`}
              />
            </div>
            {isCashRestricted && (
              <div className="p-2 rounded bg-rose-950/50 border border-rose-800/50 text-[10px] text-rose-300 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Section 269ST Blocker:</strong> Single cash receipt of ₹2,00,000 or more is illegal under the Indian Income Tax Act. Transaction blocked until cash is reduced.
                </span>
              </div>
            )}
          </div>

          {/* Dynamic UPI Row with QR Code */}
          <div className="p-3 rounded-xl bg-surface-950/60 border border-surface-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-surface-200">
              <QrCode className="w-4 h-4 text-sky-400" />
              <div>
                <span>Dynamic UPI / QR Payment</span>
                <span className="text-[10px] text-surface-400 block font-sans">
                  Direct push to customer-facing display pole
                </span>
              </div>
            </div>
            <input
              type="number"
              value={payments.upi || ''}
              onChange={(e) => setPayments({ ...payments, upi: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="w-36 text-right input-field font-bold text-sky-300"
            />
          </div>

          {/* Card Payment Row */}
          <div className="p-3 rounded-xl bg-surface-950/60 border border-surface-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-surface-200">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Credit / Debit Card</span>
            </div>
            <input
              type="number"
              value={payments.card || ''}
              onChange={(e) => setPayments({ ...payments, card: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="w-36 text-right input-field font-bold text-amber-300"
            />
          </div>

          {/* Cheque / RTGS Row */}
          <div className="p-3 rounded-xl bg-surface-950/60 border border-surface-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-surface-200">
              <Building className="w-4 h-4 text-violet-400" />
              <span>Cheque / NEFT / RTGS</span>
            </div>
            <input
              type="number"
              value={payments.cheque || ''}
              onChange={(e) => setPayments({ ...payments, cheque: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="w-36 text-right input-field font-bold text-violet-300"
            />
          </div>

          {/* Udhaar (Customer Credit Balance) */}
          <div className="p-3 rounded-xl bg-surface-950/60 border border-surface-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-surface-200">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <div>
                <span>Customer Khata (Udhaar)</span>
                <span className="text-[10px] text-surface-400 block font-sans">
                  Unpaid balance assigned to customer ledger
                </span>
              </div>
            </div>
            <input
              type="number"
              value={payments.udhaar || ''}
              onChange={(e) => setPayments({ ...payments, udhaar: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="w-36 text-right input-field font-bold text-rose-300"
            />
          </div>

        </div>

        {/* Balance Status Footer */}
        <div className="p-3 rounded-xl bg-surface-950 border border-surface-800 flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-surface-400">Total Allocated: </span>
            <strong className="text-surface-100">₹{totalAllocated.toLocaleString('en-IN')}</strong>
          </div>
          <div>
            <span className="text-surface-400">Remaining Balance: </span>
            <strong className={`text-sm font-bold ${
              Math.abs(remainingBalance) <= 1 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              ₹{remainingBalance.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        {/* Action Dispatch Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleComplete('ESTIMATE')}
            disabled={isCashRestricted}
            className="btn-secondary py-3 text-xs"
          >
            <Printer className="w-4 h-4 text-surface-400" />
            <span>Generate Thermal Estimate (3")</span>
          </button>

          <button
            type="button"
            onClick={() => handleComplete('TAX_INVOICE')}
            disabled={isCashRestricted}
            className="btn-primary py-3 text-xs font-bold"
          >
            <FileCheck className="w-4 h-4" />
            <span>Issue Official GST Tax Invoice</span>
          </button>
        </div>

      </div>
    </div>
  );
};