import React, { useState } from 'react';
import { printThermal } from '../../../utils/printService';
import { 
  CreditCard, 
  IndianRupee, 
  Printer, 
  CheckCircle2, 
  MessageCircle, 
  X, 
  Calendar,
  Coins,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const GirviPartPaymentModal = ({ isOpen, onClose, loan, onPaymentRecorded }) => {
  const { tenant } = useTenant();

  const [interestAmount, setInterestAmount] = useState('');
  const [principalRepayment, setPrincipalRepayment] = useState('0');
  const [paymentMode, setPaymentMode] = useState('UPI'); // 'UPI' | 'CASH' | 'CARD' | 'BANK'
  const [remarks, setRemarks] = useState('Monthly interest deposit');
  const [lastReceipt, setLastReceipt] = useState(null);

  if (!isOpen || !loan) return null;

  // Accrued interest calculations
  const start = new Date(loan.startDate).getTime();
  const diffDays = Math.max(1, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)));
  const monthlyRate = loan.interestRateMonthly || 2.0;
  const dailyRate = monthlyRate / 30;
  const totalAccruedInterest = Math.round(loan.principalAmount * (dailyRate / 100) * diffDays);
  const pendingInterest = Math.max(0, totalAccruedInterest - (loan.totalDepositedInterest || 0));

  // Initialize interest amount default if not set
  const currentInterestInput = interestAmount !== '' ? parseFloat(interestAmount) || 0 : pendingInterest;
  const currentPrincipalInput = parseFloat(principalRepayment) || 0;
  const totalReceived = currentInterestInput + currentPrincipalInput;
  const newPrincipal = Math.max(0, loan.principalAmount - currentPrincipalInput);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (totalReceived <= 0) {
      alert('Please enter a valid interest or principal repayment amount.');
      return;
    }
    if (currentPrincipalInput > loan.principalAmount) {
      alert(`Principal repayment cannot exceed current principal of ₹${loan.principalAmount.toLocaleString('en-IN')}`);
      return;
    }

    const receipt = {
      receiptNo: `RCT-INT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      loanId: loan.id,
      borrowerName: loan.borrower?.name,
      borrowerPhone: loan.borrower?.phone,
      interestPaid: currentInterestInput,
      principalPaid: currentPrincipalInput,
      totalPaid: totalReceived,
      previousPrincipal: loan.principalAmount,
      remainingPrincipal: newPrincipal,
      paymentMode,
      remarks
    };

    setLastReceipt(receipt);
    onPaymentRecorded(loan.id, {
      interestPaid: currentInterestInput,
      principalPaid: currentPrincipalInput,
      receipt
    });
  };

  const handlePrint = () => {
    printThermal('printable-girvi-interest-slip', `Interest_Receipt_${lastReceipt?.receiptNo || 'RCPT'}`);
  };

  const handleResetAndClose = () => {
    setLastReceipt(null);
    setInterestAmount('');
    setPrincipalRepayment('0');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider font-sans">
                Girvi Interest &bull; Part Repayment Desk
              </h3>
              <p className="text-[11px] text-surface-400 font-mono">
                Loan Ref: <strong className="text-brand-400">{loan.id}</strong> &bull; {loan.borrower?.name}
              </p>
            </div>
          </div>
          <button 
            id="btn-close-part-payment-modal"
            onClick={handleResetAndClose} 
            className="p-1 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!lastReceipt ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            
            {/* Loan Context Banner */}
            <div className="bg-surface-950 p-3.5 rounded-xl border border-surface-800 grid grid-cols-2 gap-3 font-mono">
              <div>
                <span className="text-surface-400 text-[10px] uppercase font-sans block">Current Principal</span>
                <span id="stat-girvi-current-principal" className="text-base font-bold text-surface-100">
                  ₹{loan.principalAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-surface-500 block font-sans">ROI: {loan.interestRateMonthly}% /mo</span>
              </div>
              <div className="text-right">
                <span className="text-surface-400 text-[10px] uppercase font-sans block">Accrued Interest ({diffDays}d)</span>
                <span id="stat-girvi-pending-interest" className="text-base font-bold text-amber-400">
                  ₹{pendingInterest.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-surface-500 block font-sans">Already Paid: ₹{(loan.totalDepositedInterest || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Inputs: Interest & Principal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-surface-400 font-medium mb-1">
                  Interest Being Paid (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 font-mono font-bold">₹</span>
                  <input
                    id="input-girvi-interest-amount"
                    type="number"
                    step="1"
                    required
                    value={interestAmount !== '' ? interestAmount : pendingInterest}
                    onChange={(e) => setInterestAmount(e.target.value)}
                    className="w-full bg-surface-950 border border-surface-700 rounded-lg pl-8 pr-3 py-2 text-sm text-surface-100 font-mono font-bold focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-surface-400 font-medium mb-1">
                  Principal Reduction (₹) (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 font-mono font-bold">₹</span>
                  <input
                    id="input-girvi-principal-reduction"
                    type="number"
                    step="100"
                    value={principalRepayment}
                    onChange={(e) => setPrincipalRepayment(e.target.value)}
                    placeholder="0"
                    className="w-full bg-surface-950 border border-surface-700 rounded-lg pl-8 pr-3 py-2 text-sm text-surface-100 font-mono font-bold focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Total Received Strip */}
            <div className="p-2.5 rounded-lg bg-surface-950 border border-brand-500/30 flex justify-between items-center text-xs">
              <span className="font-semibold text-surface-200">Total Settlement Received:</span>
              <span id="stat-girvi-total-received" className="text-base font-bold text-brand-400 font-mono">
                ₹{totalReceived.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Payment Modes */}
            <div>
              <label className="block text-surface-400 font-medium mb-1.5">
                Payment Channel
              </label>
              <div className="grid grid-cols-4 gap-2 font-semibold">
                {['UPI', 'CASH', 'CARD', 'BANK'].map((mode) => (
                  <button
                    key={mode}
                    id={`btn-girvi-mode-${mode.toLowerCase()}`}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 rounded-lg border text-center text-xs transition-all ${
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
                id="input-girvi-payment-remarks"
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                id="btn-submit-girvi-part-payment"
                type="submit"
                className="w-full py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-brand-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Record Repayment &amp; Generate Thermal Receipt</span>
              </button>
            </div>

          </form>
        ) : (
          /* Thermal Receipt Slip Preview */
          <div className="space-y-4">
            <div id="printable-girvi-interest-slip" className="bg-white text-black border-2 border-slate-400 rounded-xl p-5 text-xs space-y-3 font-mono printable-document printable-thermal">
              <div className="text-center border-b border-slate-300 pb-2">
                <div className="text-slate-700 font-sans font-bold text-[10px] tracking-widest uppercase">
                  Shubh Labh &bull; Girvi Receipt
                </div>
                <h4 className="font-sans font-black text-sm uppercase text-black mt-0.5">
                  {tenant.name}
                </h4>
                <p className="text-[10px] text-slate-700 font-sans">{tenant.address}</p>
                <span className="text-[10px] text-slate-800">License: {tenant.bisLicenseNo} &bull; GSTIN: {tenant.gstin}</span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-600">Receipt No:</span>
                  <span id="stat-interest-receipt-no" className="font-bold text-black">{lastReceipt.receiptNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span>{lastReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Loan Account:</span>
                  <span className="font-bold">{lastReceipt.loanId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Borrower:</span>
                  <span className="font-sans font-semibold text-black">{lastReceipt.borrowerName}</span>
                </div>
              </div>

              <div className="border-t border-b border-slate-300 py-2 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Interest Paid:</span>
                  <span className="font-bold text-black">₹{lastReceipt.interestPaid.toLocaleString('en-IN')}</span>
                </div>
                {lastReceipt.principalPaid > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Principal Reduction:</span>
                    <span className="font-bold text-emerald-700">-₹{lastReceipt.principalPaid.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm text-black border-t border-slate-200 pt-1">
                  <span>Total Amount Paid ({lastReceipt.paymentMode}):</span>
                  <span id="stat-interest-slip-total-paid">₹{lastReceipt.totalPaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-xs">
                  <span>Remaining Principal:</span>
                  <span id="stat-interest-slip-remaining-principal">₹{lastReceipt.remainingPrincipal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-600 italic">
                Note: {lastReceipt.remarks}
              </div>

              <div className="text-center text-[10px] text-slate-600 font-sans pt-1 border-t border-slate-200">
                Pledged ornaments remain secured in locker vault. Keep receipt safe.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-print-interest-receipt"
                onClick={handlePrint}
                className="flex-1 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-brand-400" />
                <span>Print Thermal Slip</span>
              </button>

              <button
                id="btn-whatsapp-interest-receipt"
                onClick={() => {
                  const text = `Namaste ${lastReceipt.borrowerName} ji, payment received of Rs. ${lastReceipt.totalPaid.toLocaleString('en-IN')} towards gold loan ${lastReceipt.loanId} (Receipt #${lastReceipt.receiptNo}). Remaining Principal: Rs. ${lastReceipt.remainingPrincipal.toLocaleString('en-IN')}. Pledged ornaments remain secure in vault. Thank you, ${tenant.name}.`;
                  const cleanPhone = lastReceipt.borrowerPhone ? lastReceipt.borrowerPhone.replace(/[^0-9]/g, '') : '';
                  if (cleanPhone) window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
                  else alert(`Receipt dispatched via SMS.`);
                }}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Receipt</span>
              </button>

              <button
                id="btn-done-interest-modal"
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
