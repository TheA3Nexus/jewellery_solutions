import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  CheckCircle2, 
  Coins, 
  Plus, 
  CreditCard,
  Gift
} from 'lucide-react';

export const ActiveMembersTable = ({ 
  members, 
  onOpenCreatePlan, 
  onOpenPassbook,
  onQuickCollect
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(m => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.customerName.toLowerCase().includes(term) ||
      m.phone.includes(term) ||
      m.tokenNo.includes(term) ||
      m.schemeName.toLowerCase().includes(term)
    );
  });

  const totalFundCollected = members.reduce((sum, m) => {
    const paidCount = (m.paidInstallments || []).length;
    return sum + (paidCount * m.monthlyEmi);
  }, 0);

  return (
    <div className="card-surface space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Member Name, Phone, Token No, or Scheme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <button
          onClick={onOpenCreatePlan}
          className="btn-primary py-2 text-xs font-sans font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Scheme Plan</span>
        </button>
      </div>

      {/* Members Table */}
      <div className="overflow-x-auto border border-surface-800 rounded-lg font-mono text-xs">
        <table className="w-full text-left">
          <thead className="bg-surface-950 text-surface-400 text-[10px] uppercase border-b border-surface-800 font-sans">
            <tr>
              <th className="p-2.5">Token No</th>
              <th className="p-2.5">Member Name</th>
              <th className="p-2.5">Scheme Plan</th>
              <th className="p-2.5 text-right">Monthly EMI</th>
              <th className="p-2.5 text-center">Progress (EMIs)</th>
              <th className="p-2.5 text-right">Deposited Fund</th>
              <th className="p-2.5 text-right">Bonus (12th)</th>
              <th className="p-2.5 text-center">Passbook &amp; Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/60">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-surface-500 font-sans text-xs">
                  No scheme members enrolled yet.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => {
                const paidCount = (m.paidInstallments || []).length;
                const totalPaid = paidCount * m.monthlyEmi;

                return (
                  <tr key={m.id} className="hover:bg-surface-850/40 transition">
                    <td className="p-2.5 font-bold text-brand-400">
                      #{m.tokenNo}
                    </td>

                    <td className="p-2.5 font-sans">
                      <div className="font-semibold text-surface-100">{m.customerName}</div>
                      <div className="text-[10px] text-surface-400 font-mono">{m.phone}</div>
                    </td>

                    <td className="p-2.5 font-sans">
                      <div className="text-surface-200 font-medium">{m.schemeName}</div>
                      <div className="text-[10px] text-brand-400 font-mono">Gift: {m.joiningGift}</div>
                    </td>

                    <td className="p-2.5 text-right font-bold text-surface-100">
                      ₹{m.monthlyEmi.toLocaleString('en-IN')}
                    </td>

                    <td className="p-2.5 text-center font-bold">
                      <span className="px-2 py-0.5 rounded bg-surface-950 border border-surface-800 text-brand-300">
                        {paidCount} / {m.tenureMonths} EMIs
                      </span>
                    </td>

                    <td className="p-2.5 text-right font-bold text-emerald-400">
                      ₹{totalPaid.toLocaleString('en-IN')}
                    </td>

                    <td className="p-2.5 text-right font-bold text-brand-300">
                      +₹{m.bonusAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="p-2.5 text-center space-x-1 font-sans">
                      <button
                        onClick={() => onOpenPassbook(m)}
                        className="btn-secondary py-1 px-2.5 text-[10px]"
                        title="Open Digital Passbook"
                      >
                        <BookOpen className="w-3 h-3 text-brand-400" />
                        <span>Passbook</span>
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
          <span className="text-surface-400">Total Enrolled Members: </span>
          <strong className="text-surface-100">{members.length}</strong>
        </div>
        <div>
          <span className="text-surface-400">Cumulative Deposits Collected: </span>
          <strong className="text-emerald-400 font-bold text-sm">
            ₹{totalFundCollected.toLocaleString('en-IN')}
          </strong>
        </div>
      </div>
    </div>
  );
};