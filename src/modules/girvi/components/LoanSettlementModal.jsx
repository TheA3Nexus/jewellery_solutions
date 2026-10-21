import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Fingerprint, 
  Coins, 
  X, 
  CheckCircle2, 
  Lock, 
  Printer, 
  AlertTriangle 
} from 'lucide-react';

export const LoanSettlementModal = ({ loan, isOpen, onClose, onConfirmRelease }) => {
  if (!isOpen || !loan) return null;

  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isThumbVerified, setIsThumbVerified] = useState(false);
  const [paymentMode, setPaymentMode] = useState('CASH');

  // Calculate live accrued interest
  const start = new Date(loan.startDate).getTime();
  const diffDays = Math.max(1, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)));
  const dailyRate = (loan.interestRateMonthly || 2.0) / 30;
  const accruedInterest = Math.round(loan.principalAmount * (dailyRate / 100) * diffDays);
  const totalSettlementDue = loan.principalAmount + accruedInterest - (loan.totalDepositedInterest || 0);

  const isReleaseUnlocked = isOtpVerified || isThumbVerified;

  const handleSendOtp = () => {
    setOtpSent(true);
    setEnteredOtp('5842'); // Simulated OTP
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === '5842') {
      setIsOtpVerified(true);
    } else {
      alert('Invalid OTP entered.');
    }
  };

  const handleCompleteRelease = () => {
    if (!isReleaseUnlocked) {
      alert('Security Lock: Biometric Thumb match or OTP verification is mandatory to unlock pledged gold.');
      return;
    }

    onConfirmRelease({
      loanId: loan.id,
      settlementAmount: totalSettlementDue,
      paymentMode,
      releasedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Safe Gold Loan Release &amp; Settlement
              </h3>
              <p className="text-[11px] text-surface-400 font-mono">
                Loan Ref: {loan.id} &bull; Borrower: {loan.borrower?.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settlement Summary */}
        <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-surface-400">
            <span>Principal Sanctioned:</span>
            <span className="text-surface-100">₹{loan.principalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-surface-400">
            <span>Elapsed Time:</span>
            <span className="text-surface-200">{diffDays} Days ({loan.interestRateMonthly}%/mo)</span>
          </div>
          <div className="flex justify-between text-amber-400">
            <span>Total Accrued Interest:</span>
            <span>+₹{accruedInterest.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-t border-surface-800 pt-2 flex justify-between items-center text-sm font-bold">
            <span className="text-brand-400 font-sans">Total Net Payable:</span>
            <span className="text-surface-100 text-base">₹{totalSettlementDue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Security Release Protocol: OTP & Thumb Match */}
        <div className="p-3.5 rounded-xl bg-surface-950/80 border border-surface-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-surface-300 uppercase tracking-wider font-sans flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-brand-400" />
              <span>Identity Verification Protocol</span>
            </span>
            {isReleaseUnlocked ? (
              <span className="text-emerald-400 font-bold text-[10px] font-sans flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Release Unlocked</span>
              </span>
            ) : (
              <span className="text-rose-400 font-bold text-[10px] font-sans">
                Vault Locked
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
            {/* OTP Option */}
            <div className="p-2.5 rounded-lg bg-surface-900 border border-surface-800 space-y-2">
              <span className="text-[10px] text-surface-400 font-bold uppercase block">
                Option 1: Mobile OTP
              </span>
              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="btn-secondary w-full py-1.5 text-[11px]"
                >
                  <KeyRound className="w-3.5 h-3.5 text-brand-400" />
                  <span>Send OTP ({loan.borrower?.phone?.slice(-4)})</span>
                </button>
              ) : !isOtpVerified ? (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="Enter 4-Digit OTP"
                    className="input-field text-center font-bold font-mono py-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="btn-primary py-1 px-2.5 text-xs font-bold"
                  >
                    Verify
                  </button>
                </div>
              ) : (
                <div className="text-emerald-400 font-bold text-xs flex items-center gap-1 py-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>OTP Confirmed</span>
                </div>
              )}
            </div>

            {/* Biometric Option */}
            <div className="p-2.5 rounded-lg bg-surface-900 border border-surface-800 space-y-2">
              <span className="text-[10px] text-surface-400 font-bold uppercase block">
                Option 2: Biometric Thumb
              </span>
              <button
                type="button"
                onClick={() => setIsThumbVerified(true)}
                disabled={isThumbVerified}
                className={`btn-secondary w-full py-1.5 text-[11px] ${
                  isThumbVerified ? 'border-emerald-500 text-emerald-400' : ''
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5 text-brand-400" />
                <span>{isThumbVerified ? 'Thumb Matched' : 'Scan Thumb'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-surface-800">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1 py-2.5 text-xs font-sans"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCompleteRelease}
            disabled={!isReleaseUnlocked}
            className="btn-primary flex-1 py-2.5 text-xs font-bold font-sans"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Settlement &amp; Release Gold</span>
          </button>
        </div>

      </div>
    </div>
  );
};