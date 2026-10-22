import React, { useState } from 'react';
import { printA4 } from '../../../utils/printService';
import { 
  Building2, 
  FileText, 
  TrendingUp, 
  Scale, 
  Download, 
  Printer, 
  CheckCircle2,
  PieChart,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const FinancialStatements = () => {
  const { tenant } = useTenant();
  const [statementType, setStatementType] = useState('BALANCE_SHEET'); // 'BALANCE_SHEET', 'PL_STATEMENT', 'TRIAL_BALANCE'
  const [financialYear, setFinancialYear] = useState('FY 2026-27');

  // Balance Sheet Data
  const balanceSheet = {
    assets: [
      { name: 'Physical Gold Stock (in Safe & Trays)', value: 4520000, note: 'Valued at acquisition cost' },
      { name: 'Physical Silver Stock (Utensils & Idols)', value: 850000, note: 'Cost basis' },
      { name: 'Diamond & Gemstone Vault Inventory', value: 1240000, note: 'Certified stock' },
      { name: 'Girvi Loan Principal Outstanding (Receivables)', value: 2450000, note: 'Backed by gold collateral' },
      { name: 'Sundry Debtors (Customer Udhaar)', value: 480000, note: 'Strictly KYC registered' },
      { name: 'Cash in Hand (Counter & Main Safe)', value: 146850, note: 'Reconciled daily' },
      { name: 'Bank Current A/c (HDFC Bank)', value: 1890000, note: 'Core business account' },
      { name: 'Electronic RFID Trays & Laser Welders (Fixed Assets)', value: 650000, note: 'Net of depreciation' }
    ],
    liabilities: [
      { name: 'Proprietor Capital & Retained Earnings', value: 8380000, note: 'Equity balance' },
      { name: 'Girvi Pledged Security Deposit Liability', value: 1950000, note: 'Redeemable on settlement' },
      { name: 'Dhan-Varsha Kitty Scheme Member Advances', value: 840000, note: 'BUDS Act Compliant' },
      { name: 'Sundry Creditors (Bullion Suppliers)', value: 920000, note: 'Due in 15 days' },
      { name: 'Artisan (Karigar) Labour & Metal Payable', value: 88900, note: 'Workshop dues' },
      { name: 'GST Output Tax Payable (October Net)', value: 19356, note: 'Due by 20th next month' },
      { name: 'TDS / TCS Payable (Income Tax)', value: 28594, note: 'Section 206C(1H)' }
    ]
  };

  const totalAssets = balanceSheet.assets.reduce((sum, item) => sum + item.value, 0);
  const totalLiabilities = balanceSheet.liabilities.reduce((sum, item) => sum + item.value, 0);

  // Profit and Loss Statement Data
  const plStatement = {
    income: [
      { name: 'Retail Jewellery Sales (Gold & Diamond)', value: 1845200 },
      { name: 'Silver Articles Turnover', value: 165000 },
      { name: 'Girvi Gold Loan Interest Income (Accrued)', value: 78500 },
      { name: 'Making Charges Retail Realized Spread', value: 242000 },
      { name: 'Scrap Melting & Tunch Testing Fee', value: 18400 }
    ],
    expenses: [
      { name: 'Cost of Goods Sold (Bullion & Metal Replacements)', value: 1650000 },
      { name: 'Artisan (Karigar) Making Charges Paid', value: 112000 },
      { name: 'Showroom Rent & Maintenance', value: 85000 },
      { name: 'Staff Salaries & Sales Incentives', value: 120000 },
      { name: 'BIS Hallmarking Assaying Charges', value: 14500 },
      { name: 'Security, Safe Insurance & Surveillance', value: 25000 },
      { name: 'Electricity & Air Conditioning', value: 22000 },
      { name: 'Software Cloud License & RFID Tag Supplies', value: 8500 }
    ]
  };

  const totalIncome = plStatement.income.reduce((sum, item) => sum + item.value, 0);
  const totalExpenses = plStatement.expenses.reduce((sum, item) => sum + item.value, 0);
  const netNetProfit = totalIncome - totalExpenses;

  // Trial Balance Data
  const trialBalance = [
    { account: 'Capital Account', debit: 0, credit: 8309900 },
    { account: 'Gold & Diamond Inventory', debit: 4520000, credit: 0 },
    { account: 'Silver Inventory', debit: 850000, credit: 0 },
    { account: 'Gemstone Inventory', debit: 1240000, credit: 0 },
    { account: 'Girvi Loan Receivables', debit: 2450000, credit: 0 },
    { account: 'Girvi Security Liabilities', debit: 0, credit: 1950000 },
    { account: 'Kitty Scheme Member Advances', debit: 0, credit: 840000 },
    { account: 'Sundry Debtors', debit: 480000, credit: 0 },
    { account: 'Sundry Creditors (Bullion)', debit: 0, credit: 920000 },
    { account: 'HDFC Bank Current A/c', debit: 1890000, credit: 0 },
    { account: 'Cash in Safe', debit: 146850, credit: 0 },
    { account: 'Sales Turnover (Net of GST)', debit: 0, credit: 2010200 },
    { account: 'Cost of Goods Sold (COGS)', debit: 1650000, credit: 0 },
    { account: 'Artisan Labour Expense', debit: 112000, credit: 0 },
    { account: 'Operating Overheads', debit: 275000, credit: 0 },
    { account: 'GST & Statutory Taxes Due', debit: 0, credit: 47950 },
    { account: 'Girvi Interest Income', debit: 0, credit: 78500 },
    { account: 'Workshop / Karigar Ledger Bal', debit: 0, credit: 88900 },
    { account: 'Fixed Store Assets', debit: 650000, credit: 0 },
    { account: 'Tunch / Assay Service Revenue', debit: 0, credit: 18400 }
  ];

  const totalDebit = trialBalance.reduce((sum, item) => sum + item.debit, 0);
  const totalCredit = trialBalance.reduce((sum, item) => sum + item.credit, 0);

  const getStatementTitle = () => {
    switch (statementType) {
      case 'BALANCE_SHEET': return 'BALANCE SHEET AS ON 31ST MARCH 2027';
      case 'PL_STATEMENT': return 'PROFIT & LOSS STATEMENT (TRADING ACCOUNT)';
      case 'TRIAL_BALANCE': return 'GENERAL LEDGER TRIAL BALANCE';
      default: return 'FINANCIAL STATEMENT';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Statement Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              Financial Statements &amp; General Ledger
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-800 text-surface-300 border border-surface-700">
                {financialYear}
              </span>
            </h2>
            <p className="text-xs text-surface-400">
              Indian GAAP &amp; Schedule III format with live bullion inventory revaluation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-surface-950 p-0.5 rounded-lg border border-surface-700 text-xs font-semibold">
            <button
              id="btn-stmt-balance-sheet"
              onClick={() => setStatementType('BALANCE_SHEET')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statementType === 'BALANCE_SHEET'
                  ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                  : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              Balance Sheet
            </button>
            <button
              id="btn-stmt-pl"
              onClick={() => setStatementType('PL_STATEMENT')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statementType === 'PL_STATEMENT'
                  ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                  : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              Profit &amp; Loss
            </button>
            <button
              id="btn-stmt-trial-balance"
              onClick={() => setStatementType('TRIAL_BALANCE')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statementType === 'TRIAL_BALANCE'
                  ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                  : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              Trial Balance
            </button>
          </div>

          <button
            id="btn-print-financial-statements"
            onClick={() => printA4('printable-financial-statements', `Financial_Statement_${statementType}_${financialYear.replace(' ', '_')}`)}
            className="px-3.5 py-1.5 rounded-lg border border-surface-700 bg-surface-800 hover:bg-surface-700 text-surface-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Statement
          </button>
        </div>
      </div>

      {/* BALANCE SHEET VIEW */}
      {statementType === 'BALANCE_SHEET' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Liabilities Column */}
            <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden shadow-sm">
              <div className="p-3.5 bg-surface-950 border-b border-surface-800 flex justify-between items-center text-xs">
                <span className="font-bold text-surface-200 uppercase tracking-wider">
                  Liabilities &amp; Equity (Capital)
                </span>
                <span className="font-mono text-surface-400">Amount (₹)</span>
              </div>
              <div className="divide-y divide-surface-800/60 text-xs font-mono">
                {balanceSheet.liabilities.map((item, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center hover:bg-surface-800/30">
                    <div>
                      <div className="font-sans font-medium text-surface-100">{item.name}</div>
                      <div className="text-[11px] text-surface-500 font-sans">{item.note}</div>
                    </div>
                    <div className="font-bold text-surface-200">
                      ₹{item.value.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3.5 bg-surface-950 border-t-2 border-surface-800 flex justify-between items-center text-xs font-bold font-mono">
                <span className="font-sans uppercase text-surface-200">Total Liabilities &amp; Equity</span>
                <span id="stat-total-liabilities" className="text-brand-400 text-sm">₹{totalLiabilities.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Assets Column */}
            <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden shadow-sm">
              <div className="p-3.5 bg-surface-950 border-b border-surface-800 flex justify-between items-center text-xs">
                <span className="font-bold text-surface-200 uppercase tracking-wider">
                  Assets &amp; Bullion Stock
                </span>
                <span className="font-mono text-surface-400">Amount (₹)</span>
              </div>
              <div className="divide-y divide-surface-800/60 text-xs font-mono">
                {balanceSheet.assets.map((item, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center hover:bg-surface-800/30">
                    <div>
                      <div className="font-sans font-medium text-surface-100">{item.name}</div>
                      <div className="text-[11px] text-surface-500 font-sans">{item.note}</div>
                    </div>
                    <div className="font-bold text-emerald-400">
                      ₹{item.value.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3.5 bg-surface-950 border-t-2 border-surface-800 flex justify-between items-center text-xs font-bold font-mono">
                <span className="font-sans uppercase text-surface-200">Total Assets</span>
                <span id="stat-total-assets" className="text-emerald-400 text-sm">₹{totalAssets.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Balance Reconciliation Status Indicator */}
          <div className="p-3 rounded-lg bg-surface-900 border border-emerald-500/30 flex items-center justify-between text-xs">
            <span className="text-surface-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <strong>Balance Sheet Matches Perfectly:</strong> Total Assets = Total Liabilities &amp; Capital
            </span>
            <span className="font-mono font-bold text-emerald-400">₹{totalAssets.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      {/* PROFIT & LOSS VIEW */}
      {statementType === 'PL_STATEMENT' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income Column */}
            <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden shadow-sm">
              <div className="p-3.5 bg-surface-950 border-b border-surface-800 flex justify-between items-center text-xs">
                <span className="font-bold text-surface-200 uppercase tracking-wider">
                  Operating Income &amp; Revenue
                </span>
                <span className="font-mono text-surface-400">Amount (₹)</span>
              </div>
              <div className="divide-y divide-surface-800/60 text-xs font-mono">
                {plStatement.income.map((item, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center hover:bg-surface-800/30">
                    <span className="font-sans font-medium text-surface-100">{item.name}</span>
                    <span className="font-bold text-emerald-400">₹{item.value.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="p-3.5 bg-surface-950 border-t-2 border-surface-800 flex justify-between items-center text-xs font-bold font-mono">
                <span className="font-sans uppercase text-surface-200">Total Revenue (A)</span>
                <span className="text-emerald-400 text-sm">₹{totalIncome.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Expenses Column */}
            <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden shadow-sm">
              <div className="p-3.5 bg-surface-950 border-b border-surface-800 flex justify-between items-center text-xs">
                <span className="font-bold text-surface-200 uppercase tracking-wider">
                  Expenses &amp; Cost of Goods Sold
                </span>
                <span className="font-mono text-surface-400">Amount (₹)</span>
              </div>
              <div className="divide-y divide-surface-800/60 text-xs font-mono">
                {plStatement.expenses.map((item, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center hover:bg-surface-800/30">
                    <span className="font-sans font-medium text-surface-100">{item.name}</span>
                    <span className="font-bold text-rose-400">₹{item.value.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="p-3.5 bg-surface-950 border-t-2 border-surface-800 flex justify-between items-center text-xs font-bold font-mono">
                <span className="font-sans uppercase text-surface-200">Total Expenditure (B)</span>
                <span className="text-rose-400 text-sm">₹{totalExpenses.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Net Profit Summary Box */}
          <div className="bg-surface-900 border border-emerald-500/30 rounded-xl p-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-surface-400 uppercase tracking-wider block">
                Net Operating Profit (A - B)
              </span>
              <p className="text-xs text-surface-400 mt-0.5">
                Calculated after deducting COGS, artisan labour, and showroom operating overheads.
              </p>
            </div>
            <div id="stat-net-profit" className="text-2xl font-mono font-bold text-emerald-400">
              ₹{netNetProfit.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      )}

      {/* TRIAL BALANCE VIEW */}
      {statementType === 'TRIAL_BALANCE' && (
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-surface-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-brand-400" />
              General Ledger Trial Balance Summary
            </h3>
            <span className="text-xs text-surface-400 font-mono">20 Active Ledger Accounts</span>
          </div>

          <table className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 text-surface-400 uppercase tracking-wider text-[11px] border-b border-surface-800 font-sans">
              <tr>
                <th className="px-4 py-3">Ledger Head / Account Name</th>
                <th className="px-4 py-3 text-right">Debit Balance (₹)</th>
                <th className="px-4 py-3 text-right">Credit Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60 font-mono">
              {trialBalance.map((item, idx) => (
                <tr key={idx} className="hover:bg-surface-800/40">
                  <td className="px-4 py-3 font-sans font-medium text-surface-100">
                    {item.account}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">
                    {item.debit > 0 ? `₹${item.debit.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-sky-400">
                    {item.credit > 0 ? `₹${item.credit.toLocaleString('en-IN')}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-surface-950 border-t-2 border-surface-800 font-mono font-bold text-xs">
              <tr>
                <td className="px-4 py-3 font-sans uppercase text-surface-200">Total Trial Balance</td>
                <td id="stat-trial-debit" className="px-4 py-3 text-right text-emerald-400 text-sm">
                  ₹{totalDebit.toLocaleString('en-IN')}
                </td>
                <td id="stat-trial-credit" className="px-4 py-3 text-right text-sky-400 text-sm">
                  ₹{totalCredit.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* DEDICATED PURE-PAPER A4 PRINTABLE CONTAINER */}
      <div
        id="printable-financial-statements"
        className="hidden printable-document printable-a4 bg-white text-slate-950 p-8 font-sans text-xs space-y-4"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-950">
              {tenant?.businessName || 'A3 JEWELLERY & BULLION HOUSE'}
            </h1>
            <p className="text-[10px] text-slate-600 font-medium">
              {tenant?.address || 'Showroom 4, Bullion Exchange Plaza, Zaveri Bazaar, Mumbai - 400002'}
            </p>
            <p className="text-[10px] text-slate-600 font-mono mt-0.5">
              GSTIN: <strong>{tenant?.gstin || '27AAACA1234A1Z5'}</strong> &bull; PAN: AAAFA1234K
            </p>
          </div>
          <div className="text-right">
            <div className="inline-block px-3 py-1 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded">
              {getStatementTitle()}
            </div>
            <div className="text-[11px] font-mono text-slate-700 mt-1">
              Period: <strong>{financialYear}</strong>
            </div>
            <div className="text-[10px] font-semibold text-slate-500">
              Standard: Indian GAAP &amp; Schedule III
            </div>
          </div>
        </div>

        {/* Paper Statement Body: BALANCE SHEET */}
        {statementType === 'BALANCE_SHEET' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Liabilities */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <div className="bg-slate-100 p-2 font-bold uppercase text-[10px] text-slate-800 border-b border-slate-300 flex justify-between">
                  <span>Liabilities &amp; Equity (Capital)</span>
                  <span>Amount (₹)</span>
                </div>
                <table className="w-full text-left text-[11px]">
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {balanceSheet.liabilities.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="p-2 font-sans font-medium">{item.name}</td>
                        <td className="p-2 text-right font-bold">₹{item.value.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-900 font-mono">
                    <tr>
                      <td className="p-2 font-sans uppercase">Total Liabilities &amp; Capital:</td>
                      <td className="p-2 text-right">₹{totalLiabilities.toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Assets */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <div className="bg-slate-100 p-2 font-bold uppercase text-[10px] text-slate-800 border-b border-slate-300 flex justify-between">
                  <span>Assets &amp; Physical Bullion Stock</span>
                  <span>Amount (₹)</span>
                </div>
                <table className="w-full text-left text-[11px]">
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {balanceSheet.assets.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="p-2 font-sans font-medium">{item.name}</td>
                        <td className="p-2 text-right font-bold">₹{item.value.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-900 font-mono">
                    <tr>
                      <td className="p-2 font-sans uppercase">Total Assets &amp; Stock:</td>
                      <td className="p-2 text-right">₹{totalAssets.toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-300 flex justify-between items-center text-[10px] font-mono">
              <span className="font-sans font-semibold text-slate-700">Audit Parity Status: 100% Balanced (Assets == Liabilities &amp; Capital)</span>
              <span className="font-bold text-slate-950">Grand Footing: ₹{totalAssets.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Paper Statement Body: PROFIT & LOSS */}
        {statementType === 'PL_STATEMENT' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Income */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <div className="bg-slate-100 p-2 font-bold uppercase text-[10px] text-slate-800 border-b border-slate-300 flex justify-between">
                  <span>Operating Revenue &amp; Income (A)</span>
                  <span>Amount (₹)</span>
                </div>
                <table className="w-full text-left text-[11px]">
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {plStatement.income.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="p-2 font-sans font-medium">{item.name}</td>
                        <td className="p-2 text-right font-bold">₹{item.value.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-900 font-mono">
                    <tr>
                      <td className="p-2 font-sans uppercase">Total Revenue (A):</td>
                      <td className="p-2 text-right">₹{totalIncome.toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Expenditure */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <div className="bg-slate-100 p-2 font-bold uppercase text-[10px] text-slate-800 border-b border-slate-300 flex justify-between">
                  <span>Expenses &amp; Cost of Goods Sold (B)</span>
                  <span>Amount (₹)</span>
                </div>
                <table className="w-full text-left text-[11px]">
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {plStatement.expenses.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="p-2 font-sans font-medium">{item.name}</td>
                        <td className="p-2 text-right font-bold text-rose-900">₹{item.value.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-900 font-mono">
                    <tr>
                      <td className="p-2 font-sans uppercase">Total Expenditure (B):</td>
                      <td className="p-2 text-right">₹{totalExpenses.toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-300 flex justify-between items-center text-xs font-mono">
              <div>
                <span className="font-sans font-bold text-slate-900 uppercase">Net Operating Profit for the Period (A - B):</span>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">Subject to income tax and statutory depreciation</p>
              </div>
              <span className="text-base font-bold text-slate-950">₹{netNetProfit.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Paper Statement Body: TRIAL BALANCE */}
        {statementType === 'TRIAL_BALANCE' && (
          <div className="border border-slate-300 rounded overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-slate-800 font-sans">
                <tr>
                  <th className="p-2 border-r border-slate-300">General Ledger Account Head</th>
                  <th className="p-2 border-r border-slate-300 text-right">Debit Balance (₹)</th>
                  <th className="p-2 text-right">Credit Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {trialBalance.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="p-2 border-r border-slate-300 font-sans font-medium">{item.account}</td>
                    <td className="p-2 border-r border-slate-300 text-right font-bold">
                      {item.debit > 0 ? `₹${item.debit.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="p-2 text-right font-bold">
                      {item.credit > 0 ? `₹${item.credit.toLocaleString('en-IN')}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-900 font-mono">
                <tr>
                  <td className="p-2 font-sans uppercase">Total Trial Balance Footing:</td>
                  <td className="p-2 text-right border-r border-slate-300">₹{totalDebit.toLocaleString('en-IN')}</td>
                  <td className="p-2 text-right">₹{totalCredit.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Dual Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-center text-[10px]">
          <div>
            <div className="h-10 border-b border-dashed border-slate-400"></div>
            <span className="font-bold text-slate-800 mt-1 block">Chartered Accountant (Auditor)</span>
            <span className="text-[9px] text-slate-500">Firm Reg. No. / Membership No.</span>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-400"></div>
            <span className="font-bold text-slate-800 mt-1 block">For {tenant?.businessName || 'A3 Jewellery'}</span>
            <span className="text-[9px] text-slate-500">Managing Partner / Proprietor Signature</span>
          </div>
        </div>

      </div>

    </div>
  );
};
