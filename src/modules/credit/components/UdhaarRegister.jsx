import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  Phone, 
  MessageCircle, 
  CreditCard, 
  Printer, 
  FileText,
  ArrowUpRight
} from 'lucide-react';

export const UdhaarRegister = ({ accounts, onCollectPayment, onViewStatement }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgingBucket, setSelectedAgingBucket] = useState('ALL'); // 'ALL', '0_30', '31_60', 'OVER_60'

  const filteredAccounts = accounts.filter((acc) => {
    if (selectedAgingBucket === '0_30' && acc.daysOutstanding > 30) return false;
    if (selectedAgingBucket === '31_60' && (acc.daysOutstanding <= 30 || acc.daysOutstanding > 60)) return false;
    if (selectedAgingBucket === 'OVER_60' && acc.daysOutstanding <= 60) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        acc.customerName.toLowerCase().includes(q) ||
        acc.phone.includes(q) ||
        acc.invoiceNo.toLowerCase().includes(q) ||
        acc.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalOutstanding = accounts.reduce((sum, a) => sum + a.balanceDue, 0);
  const current0to30 = accounts.filter((a) => a.daysOutstanding <= 30).reduce((sum, a) => sum + a.balanceDue, 0);
  const overdue31to60 = accounts.filter((a) => a.daysOutstanding > 30 && a.daysOutstanding <= 60).reduce((sum, a) => sum + a.balanceDue, 0);
  const criticalOver60 = accounts.filter((a) => a.daysOutstanding > 60).reduce((sum, a) => sum + a.balanceDue, 0);

  const handleSendWhatsAppReminder = (account) => {
    const text = `Respected ${account.customerName}, gentle reminder from A3 Jewellery regarding your pending balance of Rs. ${account.balanceDue.toLocaleString('en-IN')} against bill ${account.invoiceNo} dated ${account.invoiceDate}. Kindly clear at your earliest convenience or pay via UPI. Thank you.`;
    const url = `https://wa.me/91${account.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Aging Portfolio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Outstanding */}
        <div className="bg-surface-900 border border-brand-500/20 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-brand-400" />
            Total Udhaar Outstanding
          </span>
          <div className="text-2xl font-mono font-bold text-brand-400 mt-1">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-surface-400 font-mono">
            {accounts.length} Active Customer Khaatas
          </div>
        </div>

        {/* 0-30 Days (Current Healthy) */}
        <div className="bg-surface-900 border border-emerald-500/20 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            Current (0 - 30 Days)
          </span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
            ₹{current0to30.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-mono">
            Normal settlement cycle
          </div>
        </div>

        {/* 31-60 Days (Follow-up Due) */}
        <div className="bg-surface-900 border border-amber-500/20 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Overdue (31 - 60 Days)
          </span>
          <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
            ₹{overdue31to60.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-amber-400 font-mono">
            Follow-up call advised
          </div>
        </div>

        {/* >60 Days (Critical Attention) */}
        <div className="bg-surface-900 border border-rose-500/20 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Critical (&gt; 60 Days)
          </span>
          <div className="text-2xl font-mono font-bold text-rose-400 mt-1">
            ₹{criticalOver60.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-rose-400 font-mono">
            Requires personal visit
          </div>
        </div>
      </div>

      {/* Register Table Panel */}
      <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden shadow-sm">
        {/* Table Filter Toolbar */}
        <div className="p-4 border-b border-surface-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              Customer Credit (Khaata) Roster
            </h3>
            <div className="flex bg-surface-950 p-0.5 rounded-lg border border-surface-800 text-xs font-semibold">
              <button
                onClick={() => setSelectedAgingBucket('ALL')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedAgingBucket === 'ALL'
                    ? 'bg-surface-800 text-surface-100 shadow-sm'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                All Accounts ({accounts.length})
              </button>
              <button
                onClick={() => setSelectedAgingBucket('0_30')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedAgingBucket === '0_30'
                    ? 'bg-surface-800 text-emerald-400 shadow-sm'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                0 - 30 Days
              </button>
              <button
                onClick={() => setSelectedAgingBucket('31_60')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedAgingBucket === '31_60'
                    ? 'bg-surface-800 text-amber-400 shadow-sm'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                31 - 60 Days
              </button>
              <button
                onClick={() => setSelectedAgingBucket('OVER_60')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedAgingBucket === 'OVER_60'
                    ? 'bg-surface-800 text-rose-400 shadow-sm'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                &gt; 60 Days Overdue
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
              <input
                type="text"
                placeholder="Search Name, Phone, Bill #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-surface-950 border border-surface-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500 w-52"
              />
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg border border-surface-700 bg-surface-800 hover:bg-surface-700 text-surface-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Roster
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 text-surface-400 font-semibold uppercase tracking-wider text-[11px] border-b border-surface-800 font-sans">
              <tr>
                <th className="px-4 py-3">Customer &amp; Location</th>
                <th className="px-4 py-3">Bill # &amp; Date</th>
                <th className="px-4 py-3 text-right">Bill Total</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-right text-brand-400">Balance Due</th>
                <th className="px-4 py-3 text-center">Aging Days</th>
                <th className="px-4 py-3">Credit Limit Used</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60 font-mono">
              {filteredAccounts.map((acc) => {
                const limitUtilization = acc.creditLimit > 0 ? Math.round((acc.balanceDue / acc.creditLimit) * 100) : 0;
                return (
                  <tr key={acc.id} className="hover:bg-surface-800/40 transition-colors">
                    <td className="px-4 py-3 font-sans">
                      <div className="font-semibold text-surface-100">{acc.customerName}</div>
                      <div className="text-[11px] text-surface-400 flex items-center gap-2 mt-0.5 font-mono">
                        <span>{acc.phone}</span>
                        <span>&bull;</span>
                        <span className="font-sans">{acc.city}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans whitespace-nowrap">
                      <span className="text-surface-200 font-semibold font-mono block">{acc.invoiceNo}</span>
                      <span className="text-[11px] text-surface-500">{acc.invoiceDate}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-surface-300">
                      ₹{acc.totalBillAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-400">
                      ₹{acc.totalPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-brand-400 text-sm">
                      ₹{acc.balanceDue.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-center font-sans">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          acc.daysOutstanding <= 30
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : acc.daysOutstanding <= 60
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {acc.daysOutstanding} Days
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[10px] text-surface-400">
                          <span>₹{(acc.creditLimit / 1000).toFixed(0)}k Max</span>
                          <span className={limitUtilization >= 80 ? 'text-rose-400 font-bold' : ''}>
                            {limitUtilization}%
                          </span>
                        </div>
                        <div className="w-full bg-surface-800 h-1 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              limitUtilization >= 90
                                ? 'bg-rose-500'
                                : limitUtilization >= 70
                                ? 'bg-amber-500'
                                : 'bg-brand-500'
                            }`}
                            style={{ width: `${Math.min(100, limitUtilization)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-sans whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onCollectPayment(acc)}
                          className="px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <CreditCard className="w-3 h-3" />
                          Collect
                        </button>
                        <button
                          onClick={() => handleSendWhatsAppReminder(acc)}
                          className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                          title="Send WhatsApp Reminder"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onViewStatement(acc)}
                          className="p-1 rounded bg-surface-800 hover:bg-surface-700 text-surface-300 border border-surface-700 transition-colors"
                          title="View Khaata Statement"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
