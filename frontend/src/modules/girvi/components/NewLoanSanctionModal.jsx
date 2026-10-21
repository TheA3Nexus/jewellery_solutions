import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { useHardware } from '../../../context/HardwareContext';
import { 
  Coins, 
  Plus, 
  X, 
  Scale, 
  User, 
  Phone, 
  ShieldCheck, 
  Camera, 
  Fingerprint, 
  Lock, 
  Check, 
  AlertTriangle,
  FileText
} from 'lucide-react';

export const NewLoanSanctionModal = ({ isOpen, onClose, onSanctionLoan }) => {
  const { tenant, bullionRates } = useTenant();
  const { scaleWeight } = useHardware();

  // Borrower profile
  const [borrower, setBorrower] = useState({
    name: '',
    phone: '',
    address: '',
    aadhaar: '',
    pan: '',
    biometricVerified: false
  });

  // Pledged ornament
  const [item, setItem] = useState({
    description: 'Gold Chain (22K) with Locket',
    grossWeight: '',
    lessWeight: '0.200',
    purityPercent: 75.0, // 18K or 22K
    lockerBoxNo: 'Locker-B07'
  });

  // Loan parameters
  const [loanTerms, setLoanTerms] = useState({
    principalAmount: '50000',
    interestRateMonthly: '2.0', // 2% per month (24% per annum)
    interestModel: 'MONTHLY_SIMPLE', // 'MONTHLY_SIMPLE' | 'COMPOUND' | 'HALF_MONTH_SLAB'
    tenureMonths: 11,
    deductFirstMonthInt: false,
  });

  if (!isOpen) return null;

  // Valuation
  const gross = parseFloat(item.grossWeight) || 0;
  const less = parseFloat(item.lessWeight) || 0;
  const netWeight = Math.max(0, gross - less);
  const fineWeight = (netWeight * item.purityPercent) / 100;
  const marketValuation = Math.round(fineWeight * bullionRates.gold24k);
  const maxLtvSanctionable = Math.round(marketValuation * 0.75); // 75% LTV Cap

  const principal = parseFloat(loanTerms.principalAmount) || 0;
  const isLtvExceeded = principal > maxLtvSanctionable && marketValuation > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!borrower.name || !borrower.phone || gross <= 0 || principal <= 0) {
      alert('Please fill all mandatory borrower, pledged ornament, and principal fields.');
      return;
    }

    const loanId = `LN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLoan = {
      id: loanId,
      borrower,
      pledgedItems: [
        {
          description: item.description,
          grossWeight: gross,
          lessWeight: less,
          netWeight: parseFloat(netWeight.toFixed(3)),
          purityPercent: item.purityPercent,
          fineWeight: parseFloat(fineWeight.toFixed(3)),
          marketValuation,
          lockerBoxNo: item.lockerBoxNo
        }
      ],
      principalAmount: principal,
      interestRateMonthly: parseFloat(loanTerms.interestRateMonthly),
      interestModel: loanTerms.interestModel,
      tenureMonths: parseInt(loanTerms.tenureMonths, 10),
      deductFirstMonthInt: loanTerms.deductFirstMonthInt,
      startDate: new Date().toISOString(),
      status: 'ACTIVE',
      totalDepositedInterest: 0,
      totalDepositedPrincipal: 0,
    };

    onSanctionLoan(newLoan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Sanction New Girvi (Gold Loan)
              </h3>
              <p className="text-[11px] text-surface-400 font-mono">
                State Moneylenders Act Compliance &bull; Pawn Ticket Form G &bull; Form 8
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          
          {/* Section 1: Borrower KYC & Biometrics */}
          <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-3">
            <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider font-sans flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Borrower Information &amp; Biometric KYC</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Borrower Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ashish Kumar Singh"
                  value={borrower.name}
                  onChange={(e) => setBorrower({ ...borrower, name: e.target.value })}
                  className="input-field font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Mobile (for OTP Release) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98200 12345"
                  value={borrower.phone}
                  onChange={(e) => setBorrower({ ...borrower, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Aadhaar (Last 4 Digits)</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="e.g. 5432"
                  value={borrower.aadhaar}
                  onChange={(e) => setBorrower({ ...borrower, aadhaar: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Local village / town address"
                  value={borrower.address}
                  onChange={(e) => setBorrower({ ...borrower, address: e.target.value })}
                  className="input-field font-sans"
                />
              </div>

              <div className="flex items-end gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => setBorrower(prev => ({ ...prev, biometricVerified: true }))}
                  className={`btn-secondary flex-1 py-2 text-xs ${
                    borrower.biometricVerified ? 'border-emerald-500 text-emerald-400' : ''
                  }`}
                >
                  <Fingerprint className="w-4 h-4 text-brand-400" />
                  <span>{borrower.biometricVerified ? 'Thumb Captured' : 'Capture Biometric Thumb'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Pledged Ornaments & Live Valuation */}
          <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider font-sans flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <span>Pledged Ornaments &amp; Vault Allocation</span>
              </span>
              <button
                type="button"
                onClick={() => setItem(prev => ({ ...prev, grossWeight: scaleWeight.toFixed(3) }))}
                className="btn-secondary py-1 px-2.5 text-[11px] font-sans text-emerald-400"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Fetch Scale ({scaleWeight.toFixed(3)}g)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Ornament Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 22K Hallmarked Gold Ring with Ruby"
                  value={item.description}
                  onChange={(e) => setItem({ ...item, description: e.target.value })}
                  className="input-field font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Vault / Locker Box No</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-surface-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={item.lockerBoxNo}
                    onChange={(e) => setItem({ ...item, lockerBoxNo: e.target.value })}
                    className="input-field pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Gross Wt (g) *</label>
                <input
                  type="number"
                  step="0.001"
                  required
                  placeholder="0.000"
                  value={item.grossWeight}
                  onChange={(e) => setItem({ ...item, grossWeight: e.target.value })}
                  className="input-field font-bold text-surface-100"
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Less Wt (Wax/Thread)</label>
                <input
                  type="number"
                  step="0.001"
                  value={item.lessWeight}
                  onChange={(e) => setItem({ ...item, lessWeight: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Purity (Tunch %)</label>
                <input
                  type="number"
                  step="0.1"
                  value={item.purityPercent}
                  onChange={(e) => setItem({ ...item, purityPercent: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Calculated Fine Gold</label>
                <div className="px-3 py-2 bg-surface-900 border border-surface-700/60 rounded-lg text-xs font-bold text-brand-300">
                  {fineWeight.toFixed(3)} GM
                </div>
              </div>
            </div>

            {/* Valuation Summary Strip */}
            <div className="p-2.5 rounded-lg bg-surface-900 border border-surface-800 flex flex-wrap items-center justify-between gap-3 text-[11px]">
              <div>
                <span className="text-surface-400">Pure Gold Value: </span>
                <strong className="text-surface-100">₹{marketValuation.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-surface-400">Max Sanctionable Limit (75% LTV): </span>
                <strong className="text-emerald-400 font-bold">₹{maxLtvSanctionable.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          {/* Section 3: Loan Financials & Interest Engine */}
          <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-3">
            <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider font-sans flex items-center gap-2">
              <Coins className="w-4 h-4" />
              <span>Loan Amount &amp; Interest Structure</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Principal Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={loanTerms.principalAmount}
                  onChange={(e) => setLoanTerms({ ...loanTerms, principalAmount: e.target.value })}
                  className={`input-field font-bold text-sm ${
                    isLtvExceeded ? 'border-rose-500 text-rose-700 bg-rose-50' : 'text-brand-600'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Monthly Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={loanTerms.interestRateMonthly}
                  onChange={(e) => setLoanTerms({ ...loanTerms, interestRateMonthly: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Interest Calculation Engine</label>
                <select
                  value={loanTerms.interestModel}
                  onChange={(e) => setLoanTerms({ ...loanTerms, interestModel: e.target.value })}
                  className="select-field font-sans text-xs"
                >
                  <option value="MONTHLY_SIMPLE">Monthly Simple Interest</option>
                  <option value="COMPOUND">Compound Monthly</option>
                  <option value="HALF_MONTH_SLAB">Half-Month (15-Day Slab)</option>
                  <option value="WEEKLY">Weekly Collection</option>
                </select>
              </div>
            </div>

            {isLtvExceeded && (
              <div className="p-2 rounded bg-rose-50 border border-rose-300 text-[10px] text-rose-800 flex items-center gap-1.5 font-sans">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>
                  LTV Warning: Principal exceeds statutory 75% market valuation limit (₹{maxLtvSanctionable.toLocaleString('en-IN')}).
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-2 border-t border-surface-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-2.5 text-xs font-sans"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 py-2.5 text-xs font-bold font-sans"
            >
              <Check className="w-4 h-4" />
              <span>Sanction Loan &amp; Print Form 8</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};