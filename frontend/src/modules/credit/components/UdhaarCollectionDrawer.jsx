import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const UdhaarCollectionDrawer = ({ isOpen, onClose, account, onPaymentRecorded }) => {
  const { tenant } = useTenant();

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI'); // 'UPI', 'CASH', 'CARD', 'BANK'
  const [remarks, setRemarks] = useState('Part payment towards wedding jewellery balance');
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
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Collect Udhaar (Khaata) Payment
              </h3>
              <p className="text-[11px] text-surface-400">
                Customer: <strong>{account.customerName}</strong> ({account.phone})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showReceiptPreview ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Account Context Banner */}
            <div className="bg-surface-950 p-3.5 rounded-xl border border-surface-800 flex justify-between items-center font-mono">
              <div>
                <span className="text-surface-500 text-[10px] uppercase font-sans block">Current Due Balance</span>
                <span className="text-xl font-bold text-brand-400">
                  ₹{account.balanceDue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-surface-500 text-[10px] uppercase font-sans block">Original Invoice</span>
                <span className="text-surface-200 font-bold">{account.invoiceNo}</span>
              </div>
            </div>

            {/* Quick Amount Pills */}
            <div className="flex items-center gap-2 font-mono">
              <span className="text-surface-400 text-[11px] font-sans">Quick Fill:</span>
              <button
                type="button"
                onClick={() => handleQuickAmount(0.25)}
                className="px-2.5 py-1 rounded bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-700"
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => handleQuickAmount(0.5)}
                className="px-2.5 py-1 rounded bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-700"
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => handleQuickAmount(1.0)}
                className="px-2.5 py-1 rounded bg-surface-800 hover:bg-surface-700 text-brand-400 font-bold border border-surface-700"
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

            {/* Payment Mode */}
            <div>
              <label className="block text-surface-400 font-medium mb-1.5">
                Settlement Payment Mode
              </label>
              <div className="grid grid-cols-4 gap-2 font-semibold">
                {['UPI', 'CASH', 'CARD', 'BANK'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 rounded-lg border text-center transition-all ${
                      paymentMode === mode
                        ? 'bg-brand-500 text-slate-950 border-brand-500 font-bold shadow-sm'
                        : 'bg-surface-950 text-surface-400 border-surface-800 hover:border-surface-700 hover:text-surface-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-surface-400 font-medium mb-1">Narration / Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-brand-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                Record Payment &amp; Generate Festival Slip
              </button>
            </div>
          </form>
        ) : (
          /* Festival Themed Receipt Slip Preview */
          <div className="space-y-4">
            <div className="bg-surface-950 border-2 border-brand-500/40 rounded-xl p-5 text-xs text-surface-200 space-y-3 font-mono">
              <div className="text-center border-b border-surface-800 pb-2">
                <div className="text-amber-400 font-sans font-bold text-[11px] tracking-widest uppercase">
                  ✦ Shubh Deepawali &bull; Shubh Labh ✦
                </div>
                <h4 className="font-sans font-black text-sm uppercase text-surface-100 mt-0.5">
                  {tenant.name}
                </h4>
                <p className="text-[10px] text-surface-400 font-sans">{tenant.address}</p>
                <span className="text-[10px] text-brand-400">GST: {tenant.gstin}</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-surface-400">Receipt No:</span>
                  <span className="font-bold text-surface-100">{lastPaymentReceipt.receiptNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">Date:</span>
                  <span>{lastPaymentReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">Customer:</span>
                  <span className="font-sans font-semibold text-surface-100">{lastPaymentReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">Against Bill:</span>
                  <span>{lastPaymentReceipt.originalBillNo}</span>
                </div>
              </div>

              <div className="border-t border-b border-surface-800 py-2 space-y-1">
                <div className="flex justify-between text-surface-400">
                  <span>Previous Balance:</span>
                  <span>₹{lastPaymentReceipt.previousBalance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 text-sm">
                  <span>Amount Paid ({lastPaymentReceipt.paymentMode}):</span>
                  <span>₹{lastPaymentReceipt.amountPaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-brand-600">
                  <span>Remaining Due:</span>
                  <span>₹{lastPaymentReceipt.remainingBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-surface-500 font-sans pt-1">
                Thank you for your valued patronage! Jewelry once sold remains in your hearts forever.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Festival Slip
              </button>
              <button
                onClick={() => {
                  alert(`Dispatched payment receipt WhatsApp to ${lastPaymentReceipt.phone}`);
                  onClose();
                }}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp PDF Slip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
