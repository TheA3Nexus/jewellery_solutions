import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  Coins, 
  IndianRupee, 
  CheckCircle2, 
  Percent, 
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';

export const RePledgeModal = ({ isOpen, onClose, onSaveRePledge }) => {
  const [bankName, setBankName] = useState('State Bank of India (Bullion SME Branch)');
  const [bankLoanAccountNo, setBankLoanAccountNo] = useState('SBI-GL-998812');
  const [metalGramsPledged, setMetalGramsPledged] = useState('245.500');
  const [sanctionedAmount, setSanctionedAmount] = useState('1450000');
  const [bankInterestRate, setBankInterestRate] = useState('8.85'); // % p.a.
  const [tenureMonths, setTenureMonths] = useState('12');
  const [remarks, setRemarks] = useState('Re-pledged 5 customer packets to raise showroom working capital');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const gms = parseFloat(metalGramsPledged);
    const amt = parseFloat(sanctionedAmount);

    if (isNaN(gms) || gms <= 0 || isNaN(amt) || amt <= 0) {
      alert('Please enter valid gold weight and bank loan amount.');
      return;
    }

    onSaveRePledge({
      id: `RPL-${Math.floor(1000 + Math.random() * 9000)}`,
      bankName,
      bankLoanAccountNo,
      metalGramsPledged: gms,
      sanctionedAmount: amt,
      bankInterestRate: parseFloat(bankInterestRate) || 8.85,
      tenureMonths: parseInt(tenureMonths) || 12,
      sanctionDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE_WITH_BANK'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Bank Re-Pledge Facility (Third-Party Working Capital)
              </h3>
              <p className="text-[11px] text-surface-400">
                Pledge gold packets to Commercial Banks/NBFCs at wholesale rates to generate liquidity.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-surface-400 font-medium mb-1">Commercial Bank / NBFC Institution</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
              className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-semibold focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-surface-400 font-medium mb-1">Bank Loan Account Number</label>
              <input
                type="text"
                value={bankLoanAccountNo}
                onChange={(e) => setBankLoanAccountNo(e.target.value)}
                required
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono font-bold focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">Total Gold Weight Pledged (Grams)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  value={metalGramsPledged}
                  onChange={(e) => setMetalGramsPledged(e.target.value)}
                  required
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-bold focus:outline-none focus:border-brand-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 font-mono">g</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-surface-400 font-medium mb-1">Sanctioned Capital (₹)</label>
              <input
                type="number"
                value={sanctionedAmount}
                onChange={(e) => setSanctionedAmount(e.target.value)}
                required
                className="w-full bg-surface-950 border border-emerald-500/40 rounded-lg px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">Bank Interest Rate (% p.a.)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  value={bankInterestRate}
                  onChange={(e) => setBankInterestRate(e.target.value)}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 font-mono">%</span>
              </div>
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">Tenure (Months)</label>
              <input
                type="number"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-surface-400 font-medium mb-1">Narration &amp; Packet Reference</label>
            <textarea
              rows="2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Action */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-surface-800 hover:bg-surface-700 text-surface-300 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Bank Re-Pledge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
