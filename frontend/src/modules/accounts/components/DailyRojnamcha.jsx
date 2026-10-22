import React, { useState } from 'react';
import { printA4Landscape } from '../../../utils/printService';
import { useTenant } from '../../../context/TenantContext';
import { 
  BookOpen, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Coins, 
  IndianRupee, 
  Lock, 
  Unlock, 
  Calendar, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Plus,
  Receipt,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { RecordExpenseModal } from './RecordExpenseModal';
import { PettyExpenseVoucherModal } from './PettyExpenseVoucherModal';

export const DailyRojnamcha = () => {
  const { tenant } = useTenant();
  const [selectedDate, setSelectedDate] = useState('2026-10-21');
  const [isDayLocked, setIsDayLocked] = useState(false);
  const [showDenominations, setShowDenominations] = useState(false);

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [activeExpenseVoucher, setActiveExpenseVoucher] = useState(null);

  // Cash Denomination Breakdown
  const [notes, setNotes] = useState({
    n500: 240, // ₹1,20,000
    n200: 65,  // ₹13,000
    n100: 120, // ₹12,000
    n50: 30,   // ₹1,500
    coins: 450 // ₹450
  });

  const physicalCashCounted =
    notes.n500 * 500 +
    notes.n200 * 200 +
    notes.n100 * 100 +
    notes.n50 * 50 +
    notes.coins;

  // Day Book Ledger Entries
  const [entries, setEntries] = useState([
    {
      id: 'ROJ-01',
      time: '10:15 AM',
      voucherNo: 'OPN-CASH',
      particulars: 'Opening Balance (Cash in Counter Safe)',
      category: 'OPENING',
      type: 'IN',
      cash: 45000,
      bankUpi: 0,
      goldGrams: 0,
      counterStaff: 'Manoj (Cashier)'
    },
    {
      id: 'ROJ-02',
      time: '11:30 AM',
      voucherNo: 'INV-2026-0891',
      particulars: 'Sale: 22K Peacock Necklace (Cust: Mrs. Ananya Verma)',
      category: 'SALE',
      type: 'IN',
      cash: 65000,
      bankUpi: 185000,
      goldGrams: -32.400,
      counterStaff: 'Rajesh S.'
    },
    {
      id: 'ROJ-03',
      time: '12:45 PM',
      voucherNo: 'OG-EXCH-402',
      particulars: 'Old Gold Exchange Purchase (916 Scrap Ornaments)',
      category: 'OLD_GOLD',
      type: 'OUT',
      cash: -15000,
      bankUpi: 0,
      goldGrams: 18.250,
      counterStaff: 'Manoj (Cashier)'
    },
    {
      id: 'ROJ-04',
      time: '02:15 PM',
      voucherNo: 'GRV-INT-1088',
      particulars: 'Girvi Loan Interest Received (Acc: GL-2026-4091)',
      category: 'LOAN_INTEREST',
      type: 'IN',
      cash: 3600,
      bankUpi: 0,
      goldGrams: 0,
      counterStaff: 'Suresh Girvi'
    },
    {
      id: 'ROJ-05',
      time: '03:30 PM',
      voucherNo: 'SCH-EMI-8820',
      particulars: 'Dhan-Varsha Monthly Kitty Installment (Cust: Kavita J.)',
      category: 'SCHEME',
      type: 'IN',
      cash: 5000,
      bankUpi: 0,
      goldGrams: 0,
      counterStaff: 'Manoj (Cashier)'
    },
    {
      id: 'ROJ-06',
      time: '04:45 PM',
      voucherNo: 'KRG-PAY-301',
      particulars: 'Artisan Mazdoori Advance Paid to Babu Lal Goldsmith',
      category: 'KARIGAR_PAY',
      type: 'OUT',
      cash: -10000,
      bankUpi: 0,
      goldGrams: 0,
      counterStaff: 'Owner'
    },
    {
      id: 'ROJ-07',
      time: '05:30 PM',
      voucherNo: 'PETTY-TEA-99',
      particulars: 'Showroom Tea, Refreshment & Security Sweeper expense',
      category: 'PETTY_EXPENSE',
      type: 'OUT',
      cash: -650,
      bankUpi: 0,
      goldGrams: 0,
      counterStaff: 'Manoj (Cashier)'
    },
    {
      id: 'ROJ-08',
      time: '06:15 PM',
      voucherNo: 'INV-2026-0892',
      particulars: 'Sale: 18K Diamond Solitaire Ring (Cust: Rohan Mehta)',
      category: 'SALE',
      type: 'IN',
      cash: 54000,
      bankUpi: 75000,
      goldGrams: -4.850,
      counterStaff: 'Pooja (Sales)'
    }
  ]);

  // Calculations
  const totalCashIn = entries
    .filter((e) => e.cash > 0)
    .reduce((sum, e) => sum + e.cash, 0);

  const totalCashOut = entries
    .filter((e) => e.cash < 0)
    .reduce((sum, e) => sum + Math.abs(e.cash), 0);

  const netClosingCashBook = totalCashIn - totalCashOut;
  const totalDigitalIn = entries.reduce((sum, e) => sum + e.bankUpi, 0);
  const netGoldMovement = entries.reduce((sum, e) => sum + e.goldGrams, 0);
  const cashDiscrepancy = physicalCashCounted - netClosingCashBook;

  // Record Expense Handler
  const handleRecordExpense = (expense) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const vchNo = `EXP-${Date.now().toString().slice(-4)}`;

    const newEntry = {
      id: `ROJ-EXP-${Date.now()}`,
      time: timeStr,
      voucherNo: vchNo,
      particulars: `${expense.particulars} (Paid to: ${expense.paidTo})`,
      category: expense.category,
      type: 'OUT',
      cash: expense.paymentMode === 'CASH' ? -expense.amount : 0,
      bankUpi: expense.paymentMode === 'UPI' ? -expense.amount : 0,
      goldGrams: 0,
      counterStaff: expense.counterStaff
    };

    setEntries((prev) => [...prev, newEntry]);
    setActiveExpenseVoucher({
      ...expense,
      voucherNo: vchNo,
      time: timeStr,
      date: selectedDate
    });
  };

  const handleLockDay = () => {
    if (Math.abs(cashDiscrepancy) > 0) {
      const confirmLock = window.confirm(
        `Physical cash ₹${physicalCashCounted.toLocaleString('en-IN')} does not match book cash ₹${netClosingCashBook.toLocaleString('en-IN')} (Diff: ₹${cashDiscrepancy}). Are you sure you want to lock the Day Book?`
      );
      if (!confirmLock) return;
    }
    setIsDayLocked(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Summary Strip */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              Daily Rojnamcha &amp; Cash Register
              {isDayLocked ? (
                <span id="badge-day-locked" className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Day Closed &amp; Locked
                </span>
              ) : (
                <span id="badge-day-open" className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Unlock className="w-3 h-3" /> Counter Open
                </span>
              )}
            </h2>
            <p className="text-xs text-surface-400">
              Real-time daily cash tally, electronic payments, and physical bullion movement reconciliation.
            </p>
          </div>
        </div>

        {/* Date Selector & Action Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-surface-950 border border-surface-700 px-3 py-1.5 rounded-lg text-xs text-surface-200">
            <Calendar className="w-3.5 h-3.5 text-surface-400" />
            <input
              type="date"
              id="input-daybook-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent focus:outline-none font-mono text-xs"
            />
          </div>

          <button
            id="btn-open-expense-modal"
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-surface-700 bg-surface-800 hover:bg-surface-700 text-surface-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400" />
            Record Expense (खर्चा)
          </button>

          <button
            id="btn-print-daybook"
            onClick={() => printA4Landscape('printable-rojnamcha-sheet', `Daily_Rojnamcha_${selectedDate}`)}
            className="px-3 py-1.5 rounded-lg border border-surface-700 bg-surface-800 hover:bg-surface-700 text-surface-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Rojnamcha
          </button>

          {!isDayLocked ? (
            <button
              id="btn-lock-day"
              onClick={handleLockDay}
              className="px-3.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              Sign Off &amp; Lock Day
            </button>
          ) : (
            <button
              id="btn-unlock-day"
              onClick={() => setIsDayLocked(false)}
              className="px-3 py-1.5 rounded-lg border border-surface-700 bg-surface-800 text-surface-400 text-xs font-medium flex items-center gap-1 hover:text-surface-200"
            >
              <Unlock className="w-3.5 h-3.5" />
              Unlock (Manager Auth)
            </button>
          )}
        </div>
      </div>

      {/* KPI Tally Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Cash in Hand (System Calculated) */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            Book Cash in Safe
          </span>
          <div id="stat-book-cash" className="text-2xl font-mono font-bold text-emerald-400 mt-1">
            ₹{netClosingCashBook.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-surface-400 flex justify-between font-mono">
            <span>In: ₹{totalCashIn.toLocaleString('en-IN')}</span>
            <span>Out: ₹{totalCashOut.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Physical Cash Counted */}
        <div className={`bg-surface-900 border rounded-xl p-4 ${cashDiscrepancy === 0 ? 'border-surface-700/60' : 'border-rose-500/50 bg-rose-950/20'}`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
              Counted Physical Cash
            </span>
            <button
              id="btn-toggle-denominations"
              onClick={() => setShowDenominations(!showDenominations)}
              className="text-[10px] font-semibold text-brand-400 hover:underline uppercase"
            >
              {showDenominations ? 'Hide Counts' : 'Denominations'}
            </button>
          </div>
          <div id="stat-physical-cash" className="text-2xl font-mono font-bold text-surface-100 mt-1">
            ₹{physicalCashCounted.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] flex justify-between font-mono">
            <span className="text-surface-400">Drawer Match:</span>
            {cashDiscrepancy === 0 ? (
              <span id="stat-drawer-status" className="text-emerald-400 font-bold">100% Balanced</span>
            ) : (
              <span id="stat-drawer-status" className="text-rose-400 font-bold">
                {cashDiscrepancy > 0 ? `+₹${cashDiscrepancy} Excess` : `-₹${Math.abs(cashDiscrepancy)} Short`}
              </span>
            )}
          </div>
        </div>

        {/* Digital Bank & UPI Collections */}
        <div className="bg-surface-900 border border-sky-500/20 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-sky-400" />
            Digital Inflows (UPI/Cards)
          </span>
          <div id="stat-digital-cash" className="text-2xl font-mono font-bold text-sky-400 mt-1">
            ₹{totalDigitalIn.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-surface-400 font-mono">
            Auto-reconciled to HDFC Bank A/c
          </div>
        </div>

        {/* Net Bullion Movement */}
        <div className="bg-surface-900 border border-amber-500/20 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            Net Gold Movement
          </span>
          <div id="stat-gold-movement" className="text-2xl font-mono font-bold text-amber-400 mt-1">
            {netGoldMovement >= 0 ? `+${netGoldMovement.toFixed(3)}` : netGoldMovement.toFixed(3)}{' '}
            <span className="text-xs font-normal text-surface-400">g</span>
          </div>
          <div className="mt-2 text-[11px] text-surface-400 font-mono">
            {netGoldMovement < 0 ? 'Net Outflow (Showroom Sales)' : 'Net Inflow (Scrap/Bullion)'}
          </div>
        </div>
      </div>

      {/* Denomination Drawer Panel (Toggleable) */}
      {showDenominations && (
        <div id="panel-denominations" className="bg-surface-900 border border-surface-700/80 rounded-xl p-4 animate-in fade-in duration-200">
          <div className="text-xs font-bold uppercase tracking-wider text-surface-300 mb-3 flex items-center justify-between">
            <span>Physical Cash Drawer Denominations Entry</span>
            <span className="font-mono text-brand-400">Total Counted: ₹{physicalCashCounted.toLocaleString('en-IN')}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
            <div className="bg-surface-950 p-2.5 rounded-lg border border-surface-800">
              <span className="text-surface-400 text-[11px] block">₹500 Notes</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  id="input-denom-500"
                  value={notes.n500}
                  onChange={(e) => setNotes({ ...notes, n500: parseInt(e.target.value) || 0 })}
                  className="w-16 bg-surface-900 border border-surface-700 rounded px-2 py-1 text-surface-100 text-center font-bold"
                />
                <span className="text-surface-400">= ₹{(notes.n500 * 500).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="bg-surface-950 p-2.5 rounded-lg border border-surface-800">
              <span className="text-surface-400 text-[11px] block">₹200 Notes</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  id="input-denom-200"
                  value={notes.n200}
                  onChange={(e) => setNotes({ ...notes, n200: parseInt(e.target.value) || 0 })}
                  className="w-16 bg-surface-900 border border-surface-700 rounded px-2 py-1 text-surface-100 text-center font-bold"
                />
                <span className="text-surface-400">= ₹{(notes.n200 * 200).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="bg-surface-950 p-2.5 rounded-lg border border-surface-800">
              <span className="text-surface-400 text-[11px] block">₹100 Notes</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  id="input-denom-100"
                  value={notes.n100}
                  onChange={(e) => setNotes({ ...notes, n100: parseInt(e.target.value) || 0 })}
                  className="w-16 bg-surface-900 border border-surface-700 rounded px-2 py-1 text-surface-100 text-center font-bold"
                />
                <span className="text-surface-400">= ₹{(notes.n100 * 100).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="bg-surface-950 p-2.5 rounded-lg border border-surface-800">
              <span className="text-surface-400 text-[11px] block">₹50 Notes</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  id="input-denom-50"
                  value={notes.n50}
                  onChange={(e) => setNotes({ ...notes, n50: parseInt(e.target.value) || 0 })}
                  className="w-16 bg-surface-900 border border-surface-700 rounded px-2 py-1 text-surface-100 text-center font-bold"
                />
                <span className="text-surface-400">= ₹{(notes.n50 * 50).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="bg-surface-950 p-2.5 rounded-lg border border-surface-800">
              <span className="text-surface-400 text-[11px] block">₹20 / ₹10 / Coins</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  id="input-denom-coins"
                  value={notes.coins}
                  onChange={(e) => setNotes({ ...notes, coins: parseInt(e.target.value) || 0 })}
                  className="w-20 bg-surface-900 border border-surface-700 rounded px-2 py-1 text-surface-100 text-center font-bold"
                />
                <span className="text-surface-400">= ₹{notes.coins.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rojnamcha Transactions Ledger UI */}
      <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-surface-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-400" />
            Day Book Chronological Audit Log
          </h3>
          <span className="text-xs text-surface-400 font-mono">
            {entries.length} Transactions Recorded for {selectedDate}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 text-surface-400 font-semibold uppercase tracking-wider text-[11px] border-b border-surface-800 font-sans">
              <tr>
                <th className="px-4 py-3">Time &amp; Voucher</th>
                <th className="px-4 py-3">Account Particulars &amp; Narration</th>
                <th className="px-4 py-3">Head</th>
                <th className="px-4 py-3 text-right text-emerald-400">Cash In (+)</th>
                <th className="px-4 py-3 text-right text-rose-400">Cash Out (-)</th>
                <th className="px-4 py-3 text-right text-sky-400">Digital / Bank</th>
                <th className="px-4 py-3 text-right text-amber-400">Metal Movement</th>
                <th className="px-4 py-3 text-right">Cashier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60 font-mono">
              {entries.map((item) => (
                <tr key={item.id} className="hover:bg-surface-800/40 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-surface-200 font-semibold block">{item.time}</span>
                    <span className="text-[11px] text-surface-500 font-sans">{item.voucherNo}</span>
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <div className="font-medium text-surface-100">{item.particulars}</div>
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase bg-surface-800 text-surface-300 border border-surface-700">
                      {item.category?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">
                    {item.cash > 0 ? `₹${item.cash.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-rose-400">
                    {item.cash < 0 ? `₹${Math.abs(item.cash).toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right text-sky-400 font-semibold">
                    {item.bankUpi !== 0 ? `₹${Math.abs(item.bankUpi).toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {item.goldGrams !== 0 ? (
                      <span className={item.goldGrams > 0 ? 'text-amber-400' : 'text-surface-400'}>
                        {item.goldGrams > 0 ? `+${item.goldGrams.toFixed(3)} g` : `${item.goldGrams.toFixed(3)} g`}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-surface-400 font-sans text-[11px]">
                    {item.counterStaff}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Total Footer Row */}
            <tfoot className="bg-surface-950 font-bold border-t-2 border-surface-800 font-mono text-xs">
              <tr>
                <td colSpan="3" className="px-4 py-3 font-sans text-surface-200 uppercase tracking-wider">
                  Day Total Summary
                </td>
                <td className="px-4 py-3 text-right text-emerald-400">
                  ₹{totalCashIn.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-right text-rose-400">
                  ₹{totalCashOut.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-right text-sky-400">
                  ₹{totalDigitalIn.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-right text-amber-400">
                  {netGoldMovement >= 0 ? `+${netGoldMovement.toFixed(3)}` : netGoldMovement.toFixed(3)} g
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* DEDICATED PURE-PAPER A4 LANDSCAPE PRINTABLE CONTAINER */}
      <div
        id="printable-rojnamcha-sheet"
        className="hidden printable-document printable-a4 bg-white text-slate-950 p-8 font-sans text-xs space-y-4"
      >
        {/* Paper Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-950">
              {tenant?.businessName || 'A3 JEWELLERY & BULLION HOUSE'}
            </h1>
            <p className="text-[10px] text-slate-600 font-medium">
              {tenant?.address || 'Showroom 4, Bullion Exchange Plaza, Zaveri Bazaar, Mumbai - 400002'}
            </p>
            <p className="text-[10px] text-slate-600 font-mono mt-0.5">
              GSTIN: {tenant?.gstin || '27AAACA1234A1Z5'} &bull; Phone: {tenant?.phone || '+91 98200 12345'}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-block px-3 py-1 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded">
              DAILY ROJNAMCHA &bull; दैनिक रोकड़ बही
            </div>
            <div className="text-[11px] font-mono text-slate-700 mt-1">
              Date: <strong>{selectedDate}</strong>
            </div>
            <div className="text-[10px] font-semibold text-slate-500">
              Audit Status: {isDayLocked ? 'CLOSED & LOCKED' : 'OPEN / ACTIVE'}
            </div>
          </div>
        </div>

        {/* Paper Summary Metrics Bar */}
        <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-center font-mono">
          <div className="border-r border-slate-200">
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase block">Total Cash In</span>
            <span className="text-sm font-bold text-emerald-800">₹{totalCashIn.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-r border-slate-200">
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase block">Total Cash Out</span>
            <span className="text-sm font-bold text-rose-800">₹{totalCashOut.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-r border-slate-200">
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase block">Closing Book Cash</span>
            <span className="text-sm font-bold text-slate-950">₹{netClosingCashBook.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase block">Counted Drawer Cash</span>
            <span className="text-sm font-bold text-slate-950">₹{physicalCashCounted.toLocaleString('en-IN')}</span>
            <span className="text-[9px] block text-slate-500">
              {cashDiscrepancy === 0 ? '(100% Balanced)' : `(Diff: ₹${cashDiscrepancy})`}
            </span>
          </div>
        </div>

        {/* Daybook Table */}
        <table className="w-full text-left text-[11px] border border-slate-300">
          <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-slate-800 font-sans">
            <tr>
              <th className="p-2 border-r border-slate-300">Time &amp; Vch #</th>
              <th className="p-2 border-r border-slate-300">Particulars &amp; Narration</th>
              <th className="p-2 border-r border-slate-300">Category</th>
              <th className="p-2 border-r border-slate-300 text-right">Cash In (+)</th>
              <th className="p-2 border-r border-slate-300 text-right">Cash Out (-)</th>
              <th className="p-2 border-r border-slate-300 text-right">Bank / Digital</th>
              <th className="p-2 border-r border-slate-300 text-right">Bullion (g)</th>
              <th className="p-2 text-right">Cashier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono">
            {entries.map((item) => (
              <tr key={item.id} className="border-b border-slate-200">
                <td className="p-2 border-r border-slate-300 whitespace-nowrap">
                  <span className="font-semibold">{item.time}</span>
                  <span className="text-[10px] text-slate-500 block">{item.voucherNo}</span>
                </td>
                <td className="p-2 border-r border-slate-300 font-sans">{item.particulars}</td>
                <td className="p-2 border-r border-slate-300 font-sans text-[10px] uppercase font-semibold">
                  {item.category?.replace('_', ' ')}
                </td>
                <td className="p-2 border-r border-slate-300 text-right font-bold">
                  {item.cash > 0 ? `₹${item.cash.toLocaleString('en-IN')}` : '-'}
                </td>
                <td className="p-2 border-r border-slate-300 text-right font-bold text-rose-900">
                  {item.cash < 0 ? `₹${Math.abs(item.cash).toLocaleString('en-IN')}` : '-'}
                </td>
                <td className="p-2 border-r border-slate-300 text-right font-medium">
                  {item.bankUpi !== 0 ? `₹${Math.abs(item.bankUpi).toLocaleString('en-IN')}` : '-'}
                </td>
                <td className="p-2 border-r border-slate-300 text-right">
                  {item.goldGrams !== 0 ? (item.goldGrams > 0 ? `+${item.goldGrams.toFixed(3)}g` : `${item.goldGrams.toFixed(3)}g`) : '-'}
                </td>
                <td className="p-2 text-right font-sans text-[10px]">{item.counterStaff}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-900 font-mono text-[11px]">
            <tr>
              <td colSpan="3" className="p-2 font-sans uppercase">Total Day Tally:</td>
              <td className="p-2 text-right">₹{totalCashIn.toLocaleString('en-IN')}</td>
              <td className="p-2 text-right">₹{totalCashOut.toLocaleString('en-IN')}</td>
              <td className="p-2 text-right">₹{totalDigitalIn.toLocaleString('en-IN')}</td>
              <td className="p-2 text-right">{netGoldMovement.toFixed(3)} g</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        {/* Physical Signatures */}
        <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-200 text-center text-[10px]">
          <div>
            <div className="h-10 border-b border-dashed border-slate-400"></div>
            <span className="font-bold text-slate-800 mt-1 block">Head Cashier / Counter In-Charge</span>
            <span className="text-[9px] text-slate-500">(रोकड़िया / काउंटर प्रभारी)</span>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-400"></div>
            <span className="font-bold text-slate-800 mt-1 block">Internal Auditor / Accountant</span>
            <span className="text-[9px] text-slate-500">(आंतरिक लेखा परीक्षक)</span>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-400"></div>
            <span className="font-bold text-slate-800 mt-1 block">Managing Partner / Proprietor</span>
            <span className="text-[9px] text-slate-500">(मालिक / अधिकृत हस्ताक्षरकर्ता)</span>
          </div>
        </div>

      </div>

      {/* Record Expense Modal */}
      <RecordExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onRecordExpense={handleRecordExpense}
      />

      {/* Printable Expense Voucher Modal */}
      <PettyExpenseVoucherModal
        isOpen={Boolean(activeExpenseVoucher)}
        onClose={() => setActiveExpenseVoucher(null)}
        expenseData={activeExpenseVoucher}
        tenant={tenant}
      />

    </div>
  );
};
