import React, { useState } from 'react';
import { printThermal } from '../../../utils/printService';
import { 
  X, 
  CreditCard, 
  IndianRupee, 
  Printer, 
  CheckCircle2, 
  QrCode, 
  MessageCircle,
  Building2,
  Calendar,
  Sparkles,
  Coins
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const UdhaarCollectionDrawer = ({ isOpen, onClose, account, onPaymentRecorded }) => {
  const { tenant } = useTenant();

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI'); // 'UPI', 'CASH', 'CARD', 'BANK', 'CHEQUE', 'OLD_GOLD'
  const [remarks, setRemarks] = useState('Part payment towards jewellery purchase balance');
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [lastPaymentReceipt, setLastPaymentReceipt] = useState(null);

  if (!isOpen || !account) return null;

  const handleQuickAmount = (ratio) => {
    setPaymentAmount(Math.round(account.balanceDue * ratio).toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }
    if (amount > account.balanceDue) {
      alert(`Amount cannot exceed the current balance of ₹${account.balanceDue.toLocaleString('en-IN')}`);
      return;
    }

    const receipt = {
      receiptNo: `RCT-UDH-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      customerName: account.customerName,
      phone: account.phone,
      originalBillNo: account.invoiceNo,
      previousBalance: account.balanceDue,
      amountPaid: amount,
      remainingBalance: account.balanceDue - amount,
      paymentMode,
      remarks
    };

    setLastPaymentReceipt(receipt);
    setShowReceiptPreview(true);
    onPaymentRecorded(account.id, amount, receipt);
  };

  const handlePrint = () => {
    printThermal('printable-udhaar-slip', `Udhaar_Receipt_${lastPaymentReceipt?.receiptNo || 'RCPT'}`);
  };

  const handleResetAndClose = () => {
    setShowReceiptPreview(false);
    setPaymentAmount('');
    setLastPaymentReceipt(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider font-sans">
                Collect Udhaar (Khaata) Payment
              </h3>
              <p className="text-[11px] text-surface-400 font-mono">
                Customer: <strong className="text-surface-200 font-sans">{account.customerName}</strong> ({account.phone})
              </p>
            </div>
          </div>
          <button 
            id="btn-close-collection-drawer"
            onClick={handleResetAndClose} 
            className="p-1 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showReceiptPreview ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            {/* Account Context Banner */}
            <div className="bg-surface-950 p-3.5 rounded-xl border border-surface-800 flex justify-between items-center font-mono">
              <div>
                <span className="text-surface-500 text-[10px] uppercase font-sans block">Current Due Balance</span>
                <span id="stat-collect-current-due" className="text-xl font-bold text-brand-400">
                  ₹{account.balanceDue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-surface-500 text-[10px] uppercase font-sans block">Invoice Ref</span>
                <span className="text-surface-200 font-bold">{account.invoiceNo}</span>
              </div>
            </div>

            {/* Quick Amount Pills */}
            <div className="flex items-center gap-2 font-mono">
              <span className="text-surface-400 text-[11px] font-sans">Quick Ratio:</span>
              <button
                id="btn-quick-25"
                type="button"
                onClick={() => handleQuickAmount(0.25)}
                className="px-2.5 py-1 rounded bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-700 transition-colors"
              >
                25%
              </button>
              <button
                id="btn-quick-50"
                type="button"
                onClick={() => handleQuickAmount(0.5)}
                className="px-2.5 py-1 rounded bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-700 transition-colors"
              >
                50%
              </button>
              <button
                id="btn-quick-100"
                type="button"
                onClick={() => handleQuickAmount(1.0)}
                className="px-2.5 py-1 rounded bg-surface-800 hover:bg-surface-700 text-brand-400 font-bold border border-surface-700 transition-colors"
              >
                Full (100%)
              </button>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-surface-400 font-medium mb-1">
                Amount Received Now (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 font-mono text-base font-bold">₹</span>
                <input
                  id="input-collect-amount"
                  type="number"
                  step="1"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter repayment amount"
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg pl-8 pr-3 py-2 text-base text-surface-100 font-mono font-bold focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Payment Modes */}
            <div>
              <label className="block text-surface-400 font-medium mb-1.5">
                Settlement Payment Mode
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 font-semibold">
                {['UPI', 'CASH', 'CARD', 'BANK', 'CHEQUE', 'OLD_GOLD'].map((mode) => (
                  <button
                    key={mode}
                    id={`select-mode-${mode.toLowerCase()}`}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 rounded-lg border text-center text-xs transition-all ${
                      paymentMode === mode
                        ? 'bg-brand-500 text-slate-950 border-brand-500 font-bold shadow-sm'
                        : 'bg-surface-950 text-surface-400 border-surface-800 hover:border-surface-700 hover:text-surface-200'
                    }`}
                  >
                    {mode === 'OLD_GOLD' ? 'OLD GOLD' : mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-surface-400 font-medium mb-1">Narration / Remarks</label>
              <input
                id="input-collect-remarks"
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                id="btn-submit-collect-payment"
                type="submit"
                className="w-full py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-brand-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                Record Payment &amp; Generate Voucher Slip
              </button>
            </div>
          </form>
        ) : (
          /* Receipt Slip Preview */
          <div className="space-y-4">
            <div id="printable-udhaar-slip" className="bg-white text-black border-2 border-slate-400 rounded-xl p-5 text-xs space-y-3 font-mono printable-document printable-thermal">
              <div className="text-center border-b border-slate-300 pb-2">
                <div className="text-slate-700 font-sans font-bold text-[10px] tracking-widest uppercase">
                  Shubh Deepawali &bull; Shubh Labh
                </div>
                <h4 className="font-sans font-black text-sm uppercase text-black mt-0.5">
                  {tenant.name}
                </h4>
                <p className="text-[10px] text-slate-700 font-sans">{tenant.address}</p>
                <span className="text-[10px] text-slate-800">GSTIN: {tenant.gstin}</span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-600">Receipt No:</span>
                  <span id="stat-receipt-no" className="font-bold text-black">{lastPaymentReceipt.receiptNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span>{lastPaymentReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Customer:</span>
                  <span className="font-sans font-semibold text-black">{lastPaymentReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Against Bill:</span>
                  <span>{lastPaymentReceipt.originalBillNo}</span>
                </div>
              </div>

              <div className="border-t border-b border-slate-300 py-2 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Previous Balance:</span>
                  <span>₹{lastPaymentReceipt.previousBalance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 text-sm">
                  <span>Amount Paid ({lastPaymentReceipt.paymentMode}):</span>
                  <span id="stat-receipt-amount-paid">₹{lastPaymentReceipt.amountPaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-black text-sm">
                  <span>Remaining Due:</span>
                  <span id="stat-receipt-remaining-due">₹{lastPaymentReceipt.remainingBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-600 italic">
                Note: {lastPaymentReceipt.remarks}
              </div>

              <div className="text-center text-[10px] text-slate-600 font-sans pt-1 border-t border-slate-200">
                Thank you for your valued patronage! Jewelery once sold remains in your hearts forever.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-print-collection-receipt"
                onClick={handlePrint}
                className="flex-1 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-brand-400" />
                Print Voucher Slip
              </button>
              <button
                id="btn-whatsapp-collection-receipt"
                onClick={() => {
                  const text = `Namaste ${lastPaymentReceipt.customerName} ji, payment received of Rs. ${lastPaymentReceipt.amountPaid.toLocaleString('en-IN')} via ${lastPaymentReceipt.paymentMode} towards invoice ${lastPaymentReceipt.originalBillNo}. Receipt #${lastPaymentReceipt.receiptNo}. Remaining Balance: Rs. ${lastPaymentReceipt.remainingBalance.toLocaleString('en-IN')}. Thank you, ${tenant.name}.`;
                  const cleanPhone = lastPaymentReceipt.phone.replace(/[^0-9]/g, '');
                  window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Slip
              </button>
              <button
                id="btn-done-collection-drawer"
                onClick={handleResetAndClose}
                className="py-2 px-3 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 border border-surface-700 text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
