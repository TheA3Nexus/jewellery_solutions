import { printA4Landscape } from '../../../utils/printService';
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Coins, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Printer, 
  CheckCircle2, 
  AlertTriangle,
  CreditCard
} from 'lucide-react';

export const KarigarLedgerTable = ({ karigars, transactions, onSettleLabor, onSettleMetal }) => {
  const [selectedKarigarId, setSelectedKarigarId] = useState(karigars[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, METAL_ISSUE, RECEIVE, ADVANCE

  const selectedKarigar = karigars.find((k) => k.id === selectedKarigarId) || karigars[0];

  const filteredTransactions = transactions.filter((t) => {
    if (selectedKarigar && t.karigarId !== selectedKarigar.id) return false;
    if (filterType !== 'ALL' && t.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.voucherNo?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Artisan Selector & Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Artisan Profile Card */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-medium text-surface-400 mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-400" />
              Active Artisan Profile
            </div>
            <select
              value={selectedKarigarId}
              onChange={(e) => setSelectedKarigarId(e.target.value)}
              id="select-karigar-ledger" className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-sm text-surface-100 font-semibold focus:outline-none focus:border-brand-500"
            >
              {karigars.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name} ({k.specialization})
                </option>
              ))}
            </select>
          </div>
          {selectedKarigar && (
            <div className="mt-3 text-xs text-surface-400 space-y-1 border-t border-surface-800/80 pt-2">
              <div className="flex justify-between">
                <span>Workshop:</span>
                <span className="text-surface-200">{selectedKarigar.workshopCity}</span>
              </div>
              <div className="flex justify-between">
                <span>Mobile:</span>
                <span className="text-surface-200">{selectedKarigar.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Pure Metal Outstanding Balance */}
        <div className="bg-surface-900 border border-amber-500/20 rounded-xl p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Metal In Hand (Balance)
              </span>
              <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
                {selectedKarigar?.metalBalanceGrams?.toFixed(3) || '0.000'}{' '}
                <span className="text-xs font-normal text-surface-400">g</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Gold Pure Equiv
            </span>
          </div>
          <div className="mt-3 text-[11px] text-surface-400 flex justify-between">
            <span>Allowable Wastage (Ghat):</span>
            <span className="text-surface-200 font-medium">{selectedKarigar?.allowedGhatRate || '2.0'}%</span>
          </div>
        </div>

        {/* Labour Charges Balance (₹) */}
        <div className="bg-surface-900 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                Labour Balance Payable
              </span>
              <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
                ₹{(selectedKarigar?.laborBalanceRupees || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Mazdoori Due
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              id="btn-settle-labor" onClick={() => onSettleLabor(selectedKarigar)}
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-xs font-semibold text-surface-200 transition-colors flex items-center justify-center gap-1 border border-surface-600"
            >
              <CreditCard className="w-3 h-3 text-emerald-400" />
              Pay Advance / Clear
            </button>
          </div>
        </div>

        {/* Active Work Orders */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-sky-400" />
                Pending Orders
              </span>
              <div className="text-2xl font-mono font-bold text-surface-100 mt-1">
                {selectedKarigar?.activeWorkOrdersCount || 0}
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
              In Production
            </span>
          </div>
          <div className="text-[11px] text-surface-400 flex justify-between">
            <span>Avg Lead Time:</span>
            <span className="text-surface-200">5 - 8 Days</span>
          </div>
        </div>
      </div>

      {/* Ledger Table Section */}
      <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden shadow-sm">
        {/* Table Filters & Toolbar */}
        <div className="p-4 border-b border-surface-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h4 className="text-sm font-bold text-surface-200 flex items-center gap-2">
              <History className="w-4 h-4 text-brand-400" />
              Artisan Double-Entry Ledger (Metal & Labour)
            </h4>
            <div className="flex bg-surface-950 p-0.5 rounded-lg border border-surface-800 text-xs">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterType === 'ALL'
                    ? 'bg-surface-800 text-surface-100 shadow-sm'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                All Entries
              </button>
              <button
                onClick={() => setFilterType('ISSUE')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterType === 'ISSUE'
                    ? 'bg-surface-800 text-amber-400 shadow-sm'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                Metal Issue (Javak)
              </button>
              <button
                onClick={() => setFilterType('RECEIVE')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterType === 'RECEIVE'
                    ? 'bg-surface-800 text-emerald-400 shadow-sm'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                Articles Received (Aavak)
              </button>
              <button
                onClick={() => setFilterType('PAYMENT')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterType === 'PAYMENT'
                    ? 'bg-surface-800 text-sky-400 shadow-sm'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                Labour Payments
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
              <input
                type="text"
                placeholder="Search voucher, order #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-950 border border-surface-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500 w-52"
              />
            </div>
            <button
              id="btn-print-ledger" onClick={() => printA4Landscape('printable-karigar-ledger', `Karigar_Metal_Ledger_${selectedKarigar?.id || 'TX'}`)}
              className="px-3 py-1.5 rounded-lg border border-surface-700 bg-surface-800 hover:bg-surface-700 text-surface-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Statement
            </button>
          </div>
        </div>

        {/* Ledger Entries Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 text-surface-400 font-semibold uppercase tracking-wider text-[11px] border-b border-surface-800">
              <tr>
                <th className="px-4 py-3">Date & Voucher</th>
                <th className="px-4 py-3">Transaction Particulars</th>
                <th className="px-4 py-3 text-right text-amber-400">Metal Issue (+)</th>
                <th className="px-4 py-3 text-right text-emerald-400">Metal In Goods (-)</th>
                <th className="px-4 py-3 text-right text-amber-200">Net Metal Bal</th>
                <th className="px-4 py-3 text-right text-sky-700">Labour Earned (+)</th>
                <th className="px-4 py-3 text-right text-purple-700">Labour Paid (-)</th>
                <th className="px-4 py-3 text-right text-emerald-700">Labour Due</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60 font-mono">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-surface-500 font-sans">
                    No transactions recorded for this artisan.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-800/40 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-sans">
                      <div className="font-semibold text-surface-200">{tx.date}</div>
                      <div className="text-[11px] text-surface-500 font-mono">{tx.voucherNo}</div>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <div className="font-medium text-surface-100 flex items-center gap-1.5">
                        {tx.type === 'ISSUE' && <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        {tx.type === 'RECEIVE' && <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        {tx.type === 'PAYMENT' && <IndianRupee className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                        {tx.description}
                      </div>
                      <div className="text-[10px] text-surface-500">
                        Purity: {tx.purity || 'N/A'} {tx.wastageGrams ? `| Ghat: ${tx.wastageGrams}g` : ''}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-amber-400">
                      {tx.metalIssuedGrams ? `${tx.metalIssuedGrams.toFixed(3)} g` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-400">
                      {tx.metalReceivedGrams ? `${tx.metalReceivedGrams.toFixed(3)} g` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-amber-200">
                      {tx.runningMetalBalance.toFixed(3)} g
                    </td>
                    <td className="px-4 py-3 text-right text-sky-700">
                      {tx.labourEarned ? `₹${tx.labourEarned.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-purple-700">
                      {tx.labourPaid ? `₹${tx.labourPaid.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-700">
                      ₹{tx.runningLabourBalance.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-700 border border-emerald-300 font-sans">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dedicated Pure-Paper Printable Karigar Ledger (A4 Landscape) */}
      <div 
        id="printable-karigar-ledger" 
        className="hidden print:block bg-white text-black p-8 font-sans text-xs space-y-4 printable-document printable-a4"
      >
        {/* Header */}
        <div className="border-b-2 border-black pb-3 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-black">A3 LUXURY JEWELLERS</h1>
            <p className="text-[11px] text-slate-700">Artisan &amp; Workshop Bullion Accounting Division</p>
            <p className="text-[10px] text-slate-600">Zaveri Bazaar, Mumbai &bull; GSTIN: 27AABCU9603R1ZM</p>
          </div>
          <div className="text-right font-mono">
            <span className="px-2.5 py-1 text-[11px] font-bold border border-black uppercase inline-block">
              DOUBLE-ENTRY METAL &amp; LABOUR LEDGER
            </span>
            <div className="text-[10px] text-slate-700 mt-1">Generated: {new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        {/* Artisan Profile Summary */}
        <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200 font-mono text-[11px]">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Artisan Name</span>
            <strong className="text-black text-sm">{selectedKarigar?.name}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Workshop / City</span>
            <strong className="text-black">{selectedKarigar?.workshopCity}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Current Pure Metal Balance</span>
            <strong className="text-amber-800 text-sm font-black">{(selectedKarigar?.metalBalanceGrams || 0).toFixed(3)} g</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Labour Dues Payable</span>
            <strong className="text-emerald-800 text-sm font-black">₹{(selectedKarigar?.laborBalanceRupees || 0).toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Ledger Entries Table */}
        <table className="w-full text-left border-collapse border border-slate-300 font-mono text-[10px]">
          <thead className="bg-slate-100 text-black border-b border-slate-300 font-sans">
            <tr>
              <th className="p-1.5 border-r border-slate-300">Date &amp; Voucher</th>
              <th className="p-1.5 border-r border-slate-300">Particulars</th>
              <th className="p-1.5 border-r border-slate-300 text-right">Metal Issue (+g)</th>
              <th className="p-1.5 border-r border-slate-300 text-right">Metal Return (-g)</th>
              <th className="p-1.5 border-r border-slate-300 text-right">Metal Bal (g)</th>
              <th className="p-1.5 border-r border-slate-300 text-right">Labour Earned (+₹)</th>
              <th className="p-1.5 border-r border-slate-300 text-right">Labour Paid (-₹)</th>
              <th className="p-1.5 text-right">Labour Bal (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredTransactions.map((tx) => (
              <tr key={tx.id}>
                <td className="p-1.5 border-r border-slate-300 font-sans whitespace-nowrap">
                  {tx.date} &bull; {tx.voucherNo}
                </td>
                <td className="p-1.5 border-r border-slate-300 font-sans">
                  {tx.description}
                </td>
                <td className="p-1.5 border-r border-slate-300 text-right font-bold text-amber-800">
                  {tx.metalIssuedGrams ? `${tx.metalIssuedGrams.toFixed(3)} g` : '-'}
                </td>
                <td className="p-1.5 border-r border-slate-300 text-right font-bold text-emerald-800">
                  {tx.metalReceivedGrams ? `${tx.metalReceivedGrams.toFixed(3)} g` : '-'}
                </td>
                <td className="p-1.5 border-r border-slate-300 text-right font-black">
                  {tx.runningMetalBalance.toFixed(3)} g
                </td>
                <td className="p-1.5 border-r border-slate-300 text-right font-bold text-sky-800">
                  {tx.labourEarned ? `₹${tx.labourEarned.toLocaleString('en-IN')}` : '-'}
                </td>
                <td className="p-1.5 border-r border-slate-300 text-right text-purple-800">
                  {tx.labourPaid ? `₹${tx.labourPaid.toLocaleString('en-IN')}` : '-'}
                </td>
                <td className="p-1.5 text-right font-black text-emerald-800">
                  ₹{tx.runningLabourBalance.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tripartite Signatures */}
        <div className="grid grid-cols-3 gap-6 pt-6 text-center text-[10px] font-sans">
          <div className="border-t border-black pt-1">
            <span className="font-bold text-slate-800">Artisan / Karigar Signature</span>
            <p className="text-slate-500 text-[9px]">Acknowledged Ledger Balances</p>
          </div>
          <div className="border-t border-black pt-1">
            <span className="font-bold text-slate-800">Workshop Store In-Charge</span>
            <p className="text-slate-500 text-[9px]">Bullion Custody Reconciled</p>
          </div>
          <div className="border-t border-black pt-1">
            <span className="font-bold text-slate-800">Accounts &amp; Audit Manager</span>
            <p className="text-slate-500 text-[9px]">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};
