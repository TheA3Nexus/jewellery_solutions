import React, { useState } from 'react';
import { printA4 } from '../../../utils/printService';
import { 
  ShieldCheck, 
  KeyRound, 
  Fingerprint, 
  Coins, 
  X, 
  CheckCircle2, 
  Lock, 
  Printer, 
  AlertTriangle,
  FileText,
  UserCheck
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const LoanSettlementModal = ({ loan, isOpen, onClose, onConfirmRelease }) => {
  const { tenant } = useTenant();

  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isThumbVerified, setIsThumbVerified] = useState(false);
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [isSettlementCompleted, setIsSettlementCompleted] = useState(false);
  const [settlementReceipt, setSettlementReceipt] = useState(null);

  if (!isOpen || !loan) return null;

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

    const receipt = {
      releaseVoucherNo: `REL-GIRVI-${Math.floor(1000 + Math.random() * 9000)}`,
      releaseDate: new Date().toISOString().split('T')[0],
      loanId: loan.id,
      borrowerName: loan.borrower?.name,
      borrowerPhone: loan.borrower?.phone,
      borrowerAddress: loan.borrower?.address || 'Registered Town',
      principalAmount: loan.principalAmount,
      accruedInterest,
      totalSettlementDue,
      paymentMode,
      pledgedItems: loan.pledgedItems || [],
      lockerBoxNo: loan.pledgedItems?.[0]?.lockerBoxNo || 'Locker-01'
    };

    setSettlementReceipt(receipt);
    setIsSettlementCompleted(true);
    onConfirmRelease({
      loanId: loan.id,
      settlementAmount: totalSettlementDue,
      paymentMode,
      releaseVoucherNo: receipt.releaseVoucherNo
    });
  };

  const handlePrintReleaseSlip = () => {
    printA4('printable-gold-release-slip', `Ornament_Release_${loan.id}`);
  };

  const handleResetAndClose = () => {
    setIsSettlementCompleted(false);
    setSettlementReceipt(null);
    setIsOtpVerified(false);
    setIsThumbVerified(false);
    setOtpSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[94vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider font-sans">
                Safe Gold Loan Release &amp; Full Settlement
              </h3>
              <p className="text-[11px] text-surface-400 font-mono">
                Loan Ref: <strong className="text-brand-400">{loan.id}</strong> &bull; Borrower: {loan.borrower?.name}
              </p>
            </div>
          </div>
          <button 
            id="btn-close-settlement-modal"
            onClick={handleResetAndClose} 
            className="text-surface-400 hover:text-surface-100 p-1.5 rounded-lg hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSettlementCompleted ? (
          <div className="space-y-4">
            
            {/* Settlement Summary */}
            <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-surface-400">
                <span>Principal Sanctioned:</span>
                <span className="text-surface-100 font-bold">₹{loan.principalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-surface-400">
                <span>Elapsed Duration:</span>
                <span className="text-surface-200">{diffDays} Days ({loan.interestRateMonthly}% /mo)</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Total Accrued Interest:</span>
                <span>+₹{accruedInterest.toLocaleString('en-IN')}</span>
              </div>
              {(loan.totalDepositedInterest || 0) > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Less Previously Deposited Interest:</span>
                  <span>-₹{(loan.totalDepositedInterest || 0).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t border-surface-800 pt-2 flex justify-between items-center text-sm font-bold">
                <span className="text-brand-400 font-sans">Total Net Settlement Amount:</span>
                <span id="stat-settlement-total-due" className="text-surface-100 text-base">
                  ₹{totalSettlementDue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Pledged Ornaments to be Released from Locker */}
            <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-2">
              <span className="text-[11px] font-bold text-surface-300 uppercase tracking-wider font-sans flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-400" />
                <span>Ornaments to be Unlocked &amp; Handed Over</span>
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-[10px] uppercase text-surface-400 border-b border-surface-800 font-sans">
                    <tr>
                      <th className="py-1 px-2">Article</th>
                      <th className="py-1 px-2 text-right">Net Wt</th>
                      <th className="py-1 px-2 text-right">Purity</th>
                      <th className="py-1 px-2 text-center">Locker Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-800/60 text-surface-200">
                    {(loan.pledgedItems || []).map((itm, i) => (
                      <tr key={i}>
                        <td className="py-1.5 px-2 font-sans font-semibold">{itm.description}</td>
                        <td className="py-1.5 px-2 text-right font-bold text-amber-400">{itm.netWeight?.toFixed(3)}g</td>
                        <td className="py-1.5 px-2 text-right">{itm.purityPercent}%</td>
                        <td className="py-1.5 px-2 text-center">
                          <span className="px-2 py-0.5 rounded bg-surface-900 border border-surface-700 text-brand-300 text-[10px]">
                            {itm.lockerBoxNo || 'Safe'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Release Protocol: OTP & Thumb Match */}
            <div className="p-3.5 rounded-xl bg-surface-950/80 border border-surface-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-surface-300 uppercase tracking-wider font-sans flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-brand-400" />
                  <span>Borrower Verification (Vault Security Protocol)</span>
                </span>
                {isReleaseUnlocked ? (
                  <span id="badge-vault-unlocked" className="text-emerald-400 font-bold text-[10px] font-sans flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Vault Unlocked</span>
                  </span>
                ) : (
                  <span id="badge-vault-locked" className="text-rose-400 font-bold text-[10px] font-sans bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    Vault Locked
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-sans">
                {/* OTP Option */}
                <div className="p-2.5 rounded-lg bg-surface-900 border border-surface-800 space-y-2">
                  <span className="text-[10px] text-surface-400 font-bold uppercase block">
                    Option 1: Mobile OTP
                  </span>
                  {!otpSent ? (
                    <button
                      id="btn-send-settlement-otp"
                      type="button"
                      onClick={handleSendOtp}
                      className="btn-secondary w-full py-1.5 text-[11px] flex items-center justify-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-brand-400" />
                      <span>Send OTP ({loan.borrower?.phone?.slice(-4) || 'XXXX'})</span>
                    </button>
                  ) : !isOtpVerified ? (
                    <div className="flex gap-1.5">
                      <input
                        id="input-settlement-otp"
                        type="text"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="input-field text-center font-bold font-mono py-1 text-xs"
                      />
                      <button
                        id="btn-verify-settlement-otp"
                        type="button"
                        onClick={handleVerifyOtp}
                        className="btn-primary py-1 px-3 text-xs font-bold"
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
                    id="btn-verify-settlement-thumb"
                    type="button"
                    onClick={() => setIsThumbVerified(true)}
                    disabled={isThumbVerified}
                    className={`btn-secondary w-full py-1.5 text-[11px] flex items-center justify-center gap-1.5 ${
                      isThumbVerified ? 'border-emerald-500 text-emerald-400' : ''
                    }`}
                  >
                    <Fingerprint className="w-3.5 h-3.5 text-brand-400" />
                    <span>{isThumbVerified ? 'Thumb Matched' : 'Scan Thumb Match'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Channel Selection */}
            <div>
              <label className="block text-surface-400 font-medium mb-1.5 text-xs font-sans">
                Settlement Payment Channel
              </label>
              <div className="grid grid-cols-4 gap-2 font-semibold text-xs font-sans">
                {['CASH', 'UPI', 'CARD', 'BANK'].map((mode) => (
                  <button
                    key={mode}
                    id={`btn-settle-mode-${mode.toLowerCase()}`}
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

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-surface-800">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="btn-secondary flex-1 py-2.5 text-xs font-sans"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-full-release"
                type="button"
                onClick={handleCompleteRelease}
                disabled={!isReleaseUnlocked}
                className="btn-primary flex-1 py-2.5 text-xs font-bold font-sans flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Settlement &amp; Release Gold</span>
              </button>
            </div>

          </div>
        ) : (
          /* Settlement Complete & Release Voucher View */
          <div className="space-y-4">
            
            {/* Success Banner */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-sans">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-surface-100 block">Loan Account Fully Settled &amp; Closed!</strong>
                  <span className="text-surface-400 text-[11px]">
                    Vault location <strong>{settlementReceipt.lockerBoxNo}</strong> is cleared. Voucher #{settlementReceipt.releaseVoucherNo}.
                  </span>
                </div>
              </div>
              <button
                id="btn-print-release-voucher"
                onClick={handlePrintReleaseSlip}
                className="btn-primary py-1.5 px-3 text-xs font-bold font-sans flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print A4 Release Slip</span>
              </button>
            </div>

            {/* ==============================================================================
                PURE-PAPER A4 PRINTABLE DOCUMENT: ORNAMENT RELEASE & REDEMPTION VOUCHER
            ============================================================================== */}
            <div id="printable-gold-release-slip" className="bg-white text-black p-8 rounded-xl font-mono text-xs space-y-4 border border-slate-300 printable-document printable-a4">
              
              {/* Header */}
              <div className="text-center space-y-1 border-b-2 border-black pb-3">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-700 font-sans">
                  Shubh Labh &bull; Shree Ganeshay Namah
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-black font-sans">
                  {tenant.name}
                </h2>
                <p className="text-xs text-slate-700 font-sans">{tenant.address} &bull; Phone: {tenant.phone}</p>
                <div className="font-black text-sm pt-1 uppercase tracking-wider text-black font-sans">
                  ORNAMENT REDEMPTION &amp; FULL SETTLEMENT VOUCHER
                </div>
                <div className="text-[10px] text-slate-600 font-sans">
                  Moneylenders License: {tenant.bisLicenseNo} &bull; GSTIN: {tenant.gstin}
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 border-b border-black pb-3 text-xs">
                <div>
                  <div><strong>Voucher Ref No:</strong> {settlementReceipt.releaseVoucherNo}</div>
                  <div><strong>Loan Account ID:</strong> {settlementReceipt.loanId}</div>
                  <div><strong>Pawner (Borrower):</strong> {settlementReceipt.borrowerName}</div>
                  <div><strong>Phone:</strong> {settlementReceipt.borrowerPhone}</div>
                </div>
                <div className="text-right">
                  <div><strong>Settlement Date:</strong> {settlementReceipt.releaseDate}</div>
                  <div><strong>Payment Mode:</strong> {settlementReceipt.paymentMode}</div>
                  <div><strong>Vault Safe Ref:</strong> {settlementReceipt.lockerBoxNo}</div>
                  <div><strong>Status:</strong> <span className="font-black">FULLY REDEEMED / CLOSED</span></div>
                </div>
              </div>

              {/* Released Articles Table */}
              <div className="border border-black rounded overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-black uppercase border-b-2 border-black font-bold font-sans text-[11px]">
                    <tr>
                      <th className="p-2 border-r border-black">Released Article Description</th>
                      <th className="p-2 text-right border-r border-black">Gross (g)</th>
                      <th className="p-2 text-right border-r border-black">Net Wt (g)</th>
                      <th className="p-2 text-right border-r border-black">Purity %</th>
                      <th className="p-2 text-right">Fine Gold (g)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {(settlementReceipt.pledgedItems || []).map((itm, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-bold font-sans border-r border-black">{itm.description}</td>
                        <td className="p-2 text-right border-r border-black">{itm.grossWeight?.toFixed(3)}</td>
                        <td className="p-2 text-right font-bold border-r border-black">{itm.netWeight?.toFixed(3)}</td>
                        <td className="p-2 text-right border-r border-black">{itm.purityPercent}%</td>
                        <td className="p-2 text-right font-bold">{itm.fineWeight?.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Settlement Breakdown */}
              <div className="p-3 rounded bg-slate-50 border border-black space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Principal Sanctioned:</span>
                  <span>₹{settlementReceipt.principalAmount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accrued Interest Settled:</span>
                  <span>+₹{settlementReceipt.accruedInterest?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-black border-t border-black pt-1">
                  <span>TOTAL AMOUNT CLEARED:</span>
                  <span id="stat-slip-cleared-amount">₹{settlementReceipt.totalSettlementDue?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Pawner Discharge Acknowledgment Declaration */}
              <div className="p-3 rounded border border-black bg-slate-50 text-[11px] font-sans leading-relaxed text-slate-800">
                <strong>Pawner's Official Discharge &amp; Handover Confirmation:</strong>
                <p className="mt-1">
                  "Maine apne uprokt girvi rakhe huye swarn aabhushan bina kisi hani ya shikayat ke sakushal praapt kar liye hain. Is rin khate ki samast rashi ka purna bhugtan kar diya gaya hai aur ab pawnbroker ke prati koi bhedbhav ya shart baaki nahi hai."
                </p>
                <p className="mt-0.5 italic text-[10px] text-slate-600">
                  (I hereby confirm the physical receipt of my pledged ornaments in original sound condition. The pawnbroker is fully released of all custody obligations.)
                </p>
              </div>

              {/* Dual Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-xs text-black border-t border-black font-sans">
                <div>
                  <div className="border-t border-black pt-1 font-bold">
                    Pawner (Borrower) Signature
                  </div>
                  <span className="text-[10px] text-slate-600">Physical Ornaments Received in Hand</span>
                </div>
                <div className="text-right">
                  <div className="border-t border-black pt-1 font-bold">
                    For {tenant.name}
                  </div>
                  <span className="text-[10px] text-slate-600">Authorised Cashier &amp; Vault Custodian</span>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                id="btn-done-settlement"
                onClick={handleResetAndClose}
                className="py-2 px-4 rounded-xl bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-700 text-xs font-semibold transition-colors"
              >
                Close &amp; Return to Portfolio
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
