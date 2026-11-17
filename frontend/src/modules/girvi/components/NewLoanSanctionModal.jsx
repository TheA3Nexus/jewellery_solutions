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
    purityPercent: 91.67, // 22K standard
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
  const goldRate = (bullionRates && bullionRates.gold24k) ? bullionRates.gold24k : 7200;
  const gross = parseFloat(item.grossWeight) || 0;
  const less = parseFloat(item.lessWeight) || 0;
  const netWeight = Math.max(0, gross - less);
  const fineWeight = (netWeight * item.purityPercent) / 100;
  const marketValuation = Math.round(fineWeight * goldRate);
  const maxLtvSanctionable = Math.round(marketValuation * 0.75); // Statutory 75% LTV Cap

  const principal = parseFloat(loanTerms.principalAmount) || 0;
  const isLtvExceeded = principal > maxLtvSanctionable && marketValuation > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!borrower.name || !borrower.phone || gross <= 0 || principal <= 0) {
      alert('Please fill all mandatory borrower, pledged ornament, and principal fields.');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const loanId = `LN-${new Date().getFullYear()}-${randomNum}`;
    const packetNo = `PKT-${new Date().getFullYear()}-${randomNum}`;

    const newLoan = {
      id: loanId,
      packetNo,
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
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider font-sans">
                Sanction New Girvi (Gold Loan)
              </h3>
              <p className="text-[11px] text-surface-400 font-mono">
                State Moneylenders Act Compliance &bull; Pawn Ticket Form G &bull; Form 8
              </p>
            </div>
          </div>
          <button 
            id="btn-close-sanction-modal"
            onClick={onClose} 
            className="text-surface-400 hover:text-surface-100 p-1.5 rounded-lg hover:bg-surface-800 transition-colors"
          >
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
                  id="input-borrower-name"
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
                  id="input-borrower-phone"
                  type="tel"
                  required
                  placeholder="+91 98200 12345"
                  value={borrower.phone}
                  onChange={(e) => setBorrower({ ...borrower, phone: e.target.value })}
                  className="input-field font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Aadhaar (Last 4 Digits)</label>
                <input
                  id="input-borrower-aadhaar"
                  type="text"
                  maxLength={4}
                  placeholder="e.g. 5432"
                  value={borrower.aadhaar}
                  onChange={(e) => setBorrower({ ...borrower, aadhaar: e.target.value })}
                  className="input-field font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Residential Address</label>
                <input
                  id="input-borrower-address"
                  type="text"
                  placeholder="Local village / town address"
                  value={borrower.address}
                  onChange={(e) => setBorrower({ ...borrower, address: e.target.value })}
                  className="input-field font-sans"
                />
              </div>

              <div className="flex items-end gap-2 font-sans">
                <button
                  id="btn-capture-biometric-thumb"
                  type="button"
                  onClick={() => setBorrower(prev => ({ ...prev, biometricVerified: true }))}
                  className={`btn-secondary flex-1 py-2 text-xs flex items-center justify-center gap-1.5 ${
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
                id="btn-fetch-scale-wt"
                type="button"
                onClick={() => setItem(prev => ({ ...prev, grossWeight: (scaleWeight > 0 ? scaleWeight : 14.500).toFixed(3) }))}
                className="btn-secondary py-1 px-2.5 text-[11px] font-sans text-emerald-400 flex items-center gap-1"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Fetch Scale ({(scaleWeight > 0 ? scaleWeight : 14.500).toFixed(3)}g)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Ornament Description *</label>
                <input
                  id="input-ornament-description"
                  type="text"
                  required
                  placeholder="e.g. 22K Hallmarked Gold Chain with Locket"
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
                    id="input-ornament-locker-box"
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
                  id="input-ornament-gross-wt"
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
                  id="input-ornament-less-wt"
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
                  id="input-ornament-purity"
                  type="number"
                  step="0.01"
                  value={item.purityPercent}
                  onChange={(e) => setItem({ ...item, purityPercent: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Calculated Fine Gold</label>
                <div id="stat-calculated-fine-gold" className="px-3 py-2 bg-surface-900 border border-surface-700/60 rounded-lg text-xs font-bold text-brand-300">
                  {fineWeight.toFixed(3)} GM
                </div>
              </div>
            </div>

            {/* Valuation Summary Strip */}
            <div className="p-2.5 rounded-lg bg-surface-900 border border-surface-800 flex flex-wrap items-center justify-between gap-3 text-[11px]">
              <div>
                <span className="text-surface-400">Pure Gold Market Value: </span>
                <strong id="stat-market-valuation" className="text-surface-100">₹{marketValuation.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-surface-400">Max Statutory Limit (75% LTV): </span>
                <strong id="stat-max-ltv-sanctionable" className="text-emerald-400 font-bold">₹{maxLtvSanctionable.toLocaleString('en-IN')}</strong>
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
                  id="input-loan-principal"
                  type="number"
                  required
                  value={loanTerms.principalAmount}
                  onChange={(e) => setLoanTerms({ ...loanTerms, principalAmount: e.target.value })}
                  className={`input-field font-bold text-sm ${
                    isLtvExceeded ? 'border-rose-500 text-rose-400' : 'text-brand-400'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] text-surface-400 font-sans block mb-1">Monthly Interest Rate (%)</label>
                <input
                  id="input-loan-interest-rate"
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
                  id="select-interest-model"
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
              <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-[10px] text-rose-400 flex items-center gap-1.5 font-sans">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
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
              id="btn-submit-sanction-loan"
              type="submit"
              className="btn-primary flex-1 py-2.5 text-xs font-bold font-sans flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Sanction Loan &amp; Issue Form G</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
