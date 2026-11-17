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
  CreditCard,
  TrendingUp,
  Scale
} from 'lucide-react';

export const ActiveLoansTable = ({ 
  loans, 
  onOpenSanctionModal, 
  onOpenSettlement,
  onOpenFormG,
  onOpenPartPayment
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
      loan.borrower?.name?.toLowerCase().includes(term) ||
      loan.borrower?.phone?.includes(term) ||
      loan.pledgedItems?.some(item => item.lockerBoxNo?.toLowerCase().includes(term))
    );
  });

  const activeLoansList = loans.filter(l => l.status === 'ACTIVE');
  const totalPrincipalLocked = activeLoansList.reduce((sum, l) => sum + (parseFloat(l.principalAmount) || 0), 0);
  const totalGoldGrams = activeLoansList.reduce((sum, l) => {
    const itemGrams = (l.pledgedItems || []).reduce((s, itm) => s + (parseFloat(itm.netWeight) || 0), 0);
    return sum + itemGrams;
  }, 0);
  const totalAccruedInterestAll = activeLoansList.reduce((sum, l) => {
    const { accruedInterest } = calculateLoanFinancials(l);
    return sum + (Number(accruedInterest) || 0);
  }, 0);

  return (
    <div className="space-y-4">
      
      {/* Portfolio Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-surface-900 border border-brand-500/20">
          <span className="text-surface-400 text-[10px] uppercase font-sans flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-brand-400" />
            <span>Active Gold Loans</span>
          </span>
          <div id="stat-girvi-active-count" className="text-2xl font-bold text-brand-400 mt-1">
            {activeLoansList.length} Accounts
          </div>
          <div className="text-[10px] text-surface-500 font-sans mt-0.5">Under safe vault custody</div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-900 border border-emerald-500/20">
          <span className="text-surface-400 text-[10px] uppercase font-sans flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Principal Deployed</span>
          </span>
          <div id="stat-girvi-total-principal" className="text-2xl font-bold text-emerald-400 mt-1">
            ₹{totalPrincipalLocked.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-surface-500 font-sans mt-0.5">Active capital in circulation</div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-900 border border-amber-500/20">
          <span className="text-surface-400 text-[10px] uppercase font-sans flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Pledged Gold in Vault</span>
          </span>
          <div id="stat-girvi-total-gold-wt" className="text-2xl font-bold text-amber-400 mt-1">
            {(Number(totalGoldGrams) || 0).toFixed(3)}g
          </div>
          <div className="text-[10px] text-surface-500 font-sans mt-0.5">Fire-proof safe locker weight</div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-900 border border-purple-500/20">
          <span className="text-surface-400 text-[10px] uppercase font-sans flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-purple-400" />
            <span>Accrued Interest Due</span>
          </span>
          <div id="stat-girvi-total-accrued-int" className="text-2xl font-bold text-purple-300 mt-1">
            ₹{totalAccruedInterestAll.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-surface-500 font-sans mt-0.5">Cumulative monthly yield</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card-surface space-y-4">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="input-search-girvi"
              type="text"
              placeholder="Search by Loan No, Borrower, Mobile, or Locker Box..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9 pr-3 py-2 text-xs"
            />
          </div>

          <button
            id="btn-new-girvi-loan"
            onClick={onOpenSanctionModal}
            className="btn-primary py-2 px-3 text-xs font-sans font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Sanction New Gold Loan</span>
          </button>
        </div>

        {/* Active Loans Table */}
        <div className="overflow-x-auto border border-surface-800 rounded-lg">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-950 text-surface-400 text-[10px] uppercase border-b border-surface-800 font-sans">
              <tr>
                <th className="py-2.5 px-3">Loan ID &amp; Date</th>
                <th className="py-2.5 px-3">Borrower Details</th>
                <th className="py-2.5 px-3">Pledged Ornaments</th>
                <th className="py-2.5 px-3">Vault Safe</th>
                <th className="py-2.5 px-3 text-right">Principal (₹)</th>
                <th className="py-2.5 px-3 text-right">ROI</th>
                <th className="py-2.5 px-3 text-right">Accrued Interest</th>
                <th className="py-2.5 px-3 text-right">Total Net Due</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-surface-500 font-sans text-xs">
                    No active gold loan accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => {
                  const { diffDays, accruedInterest, totalDue } = calculateLoanFinancials(loan);
                  const primaryItem = loan.pledgedItems?.[0];

                  return (
                    <tr key={loan.id} id={`row-girvi-${loan.id}`} className="hover:bg-surface-850/40 transition">
                      <td className="py-2.5 px-3 font-bold text-brand-400">
                        {loan.id}
                        <div className="text-[10px] text-surface-500 font-normal">
                          {new Date(loan.startDate).toLocaleDateString('en-IN')}
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
                          Net: <strong className="text-amber-400">{(parseFloat(primaryItem?.netWeight) || 0).toFixed(3)}g</strong> &bull; {primaryItem?.purityPercent}% Pure
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-surface-950 border border-surface-800 text-surface-300 text-[10px] flex items-center gap-1 w-max font-mono">
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
                        <div className="text-[9px] text-surface-500 font-normal">{diffDays} Days Active</div>
                      </td>

                      <td className="py-2.5 px-3 text-right font-bold text-brand-400 text-sm">
                        ₹{totalDue.toLocaleString('en-IN')}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                          loan.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-surface-800 text-surface-400'
                        }`}>
                          {loan.status}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right font-sans whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`btn-open-form-g-${loan.id}`}
                            onClick={() => onOpenFormG(loan)}
                            className="btn-secondary py-1 px-2 text-[10px] font-sans"
                            title="Print Statutory Form G Pawn Ticket"
                          >
                            Form G
                          </button>
                          
                          {loan.status === 'ACTIVE' && (
                            <>
                              <button
                                id={`btn-open-part-payment-${loan.id}`}
                                onClick={() => onOpenPartPayment(loan)}
                                className="px-2 py-1 rounded bg-surface-800 hover:bg-surface-700 text-amber-400 border border-surface-700 text-[10px] font-semibold transition-colors"
                                title="Deposit Monthly Interest / Part Repayment"
                              >
                                Pay Interest
                              </button>

                              <button
                                id={`btn-open-settlement-${loan.id}`}
                                onClick={() => onOpenSettlement(loan)}
                                className="px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-[10px] transition-colors"
                                title="Full Loan Settlement & Gold Release"
                              >
                                Release
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Roster Stats */}
        <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div>
            <span className="text-surface-400">Total Filtered Accounts: </span>
            <strong className="text-surface-100">{filteredLoans.length}</strong>
          </div>
          <div>
            <span className="text-surface-400">Active Capital: </span>
            <strong className="text-emerald-400 font-bold">₹{totalPrincipalLocked.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
