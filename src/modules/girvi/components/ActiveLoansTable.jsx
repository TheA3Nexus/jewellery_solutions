import React, { useState } from 'react';
import { 
  Search, 
  Coins, 
  Lock, 
  Calendar, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Plus,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export const ActiveLoansTable = ({ 
  loans, 
  onOpenSanctionModal, 
  onOpenSettlement,
  onOpenFormG
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate live accrued interest based on elapsed days
  const calculateLoanFinancials = (loan) => {
    const start = new Date(loan.startDate).getTime();
    const now = Date.now();
    const diffDays = Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)));

    // Monthly interest calculation
    const monthlyRate = loan.interestRateMonthly || 2.0;
    const dailyRate = (monthlyRate / 30);
    const accruedInterest = Math.round(loan.principalAmount * (dailyRate / 100) * diffDays);
    const totalDue = loan.principalAmount + accruedInterest - (loan.totalDepositedInterest || 0);

    return { diffDays, accruedInterest, totalDue };
  };

  const filteredLoans = loans.filter(loan => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      loan.id.toLowerCase().includes(term) ||
      loan.borrower?.name.toLowerCase().includes(term) ||
      loan.borrower?.phone.includes(term) ||
      loan.pledgedItems?.some(item => item.lockerBoxNo?.toLowerCase().includes(term))
    );
  });

  const totalPrincipalLocked = loans
    .filter(l => l.status === 'ACTIVE')
    .reduce((sum, l) => sum + (l.principalAmount || 0), 0);

  return (
    <div className="card-surface space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Loan No, Borrower, Mobile, or Locker Box..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <button
          onClick={onOpenSanctionModal}
          className="btn-primary py-2 text-xs font-sans font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Sanction New Loan</span>
        </button>
      </div>

      {/* Active Loans Table */}
      <div className="overflow-x-auto border border-surface-800 rounded-lg">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-surface-950 text-surface-400 text-[10px] uppercase border-b border-surface-800 font-sans">
            <tr>
              <th className="py-2.5 px-3">Loan ID</th>
              <th className="py-2.5 px-3">Borrower Details</th>
              <th className="py-2.5 px-3">Pledged Ornaments</th>
              <th className="py-2.5 px-3">Locker</th>
              <th className="py-2.5 px-3 text-right">Principal (₹)</th>
              <th className="py-2.5 px-3 text-right">ROI</th>
              <th className="py-2.5 px-3 text-right">Accrued Interest</th>
              <th className="py-2.5 px-3 text-right">Total Net Due</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/60">
            {filteredLoans.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-surface-500 font-sans text-xs">
                  No active gold loan accounts found.
                </td>
              </tr>
            ) : (
              filteredLoans.map((loan) => {
                const { diffDays, accruedInterest, totalDue } = calculateLoanFinancials(loan);
                const primaryItem = loan.pledgedItems?.[0];

                return (
                  <tr key={loan.id} className="hover:bg-surface-850/40 transition">
                    <td className="py-2.5 px-3 font-bold text-brand-400">
                      {loan.id}
                      <div className="text-[10px] text-surface-500 font-normal">
                        {new Date(loan.startDate).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-sans">
                      <div className="font-semibold text-surface-100">{loan.borrower?.name}</div>
                      <div className="text-[10px] text-surface-400 font-mono">
                        {loan.borrower?.phone}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-sans">
                      <div className="text-surface-200 font-medium">{primaryItem?.description}</div>
                      <div className="text-[10px] text-surface-400 font-mono">
                        Net: {primaryItem?.netWeight?.toFixed(3)}g &bull; {primaryItem?.purityPercent}% Pure
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-surface-950 border border-surface-800 text-surface-300 text-[10px] flex items-center gap-1 w-max">
                        <Lock className="w-2.5 h-2.5 text-brand-400" />
                        <span>{primaryItem?.lockerBoxNo || 'Safe'}</span>
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right font-bold text-surface-100">
                      ₹{loan.principalAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-2.5 px-3 text-right text-surface-400">
                      {loan.interestRateMonthly}% /mo
                    </td>

                    <td className="py-2.5 px-3 text-right text-amber-400 font-semibold">
                      ₹{accruedInterest.toLocaleString('en-IN')}
                      <div className="text-[9px] text-surface-500 font-normal">{diffDays} Days</div>
                    </td>

                    <td className="py-2.5 px-3 text-right font-bold text-brand-300 text-sm">
                      ₹{totalDue.toLocaleString('en-IN')}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans ${
                        loan.status === 'ACTIVE'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : 'bg-surface-800 text-surface-400'
                      }`}>
                        {loan.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-center space-x-1">
                      <button
                        onClick={() => onOpenFormG(loan)}
                        className="btn-secondary py-1 px-2 text-[10px] font-sans"
                        title="Print Pawn Ticket Form G"
                      >
                        Form G
                      </button>
                      <button
                        onClick={() => onOpenSettlement(loan)}
                        className="btn-primary py-1 px-2 text-[10px] font-sans"
                        title="Release Pledged Items / Collect Payment"
                      >
                        Release
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div>
          <span className="text-surface-400">Active Accounts: </span>
          <strong className="text-surface-100">{loans.length}</strong>
        </div>
        <div>
          <span className="text-surface-400">Total Principal Deployed: </span>
          <strong className="text-emerald-400 font-bold text-sm">
            ₹{totalPrincipalLocked.toLocaleString('en-IN')}
          </strong>
        </div>
      </div>
    </div>
  );
};