import React, { useState } from 'react';
import { printA4 } from '../../../utils/printService';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Calendar, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Layers, 
  Building2,
  FileSpreadsheet,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const GstTaxSummary = () => {
  const { tenant } = useTenant();
  const [returnPeriod, setReturnPeriod] = useState('2026-10'); // October 2026
  const [activeReturnTab, setActiveReturnTab] = useState('GSTR1'); // 'GSTR1', 'GSTR3B', 'HSN'

  // Summary Metrics
  const outwardTaxableValue = 1845200; // ₹18,45,200
  const totalCgstOutward = 27678; // 1.5%
  const totalSgstOutward = 27678; // 1.5%
  const totalGstOutward = totalCgstOutward + totalSgstOutward; // 3% = ₹55,356

  const inwardItcValue = 1200000; // Bullion purchased from bank
  const totalCgstItc = 18000;
  const totalSgstItc = 18000;
  const totalItcAvailable = totalCgstItc + totalSgstItc; // ₹36,000

  const netCashTaxPayable = totalGstOutward - totalItcAvailable; // ₹19,356

  // GSTR-1 Invoices Breakdown
  const b2bInvoices = [
    {
      invoiceNo: 'INV-2026-0850',
      date: '2026-10-08',
      buyerGstin: '07AAAAA0000A1Z5',
      buyerTradeName: 'Shree Krishna Jewellers Delhi',
      taxableValue: 420000,
      cgst: 6300,
      sgst: 6300,
      totalGst: 12600,
      invoiceValue: 432600
    }
  ];

  const b2csSummary = {
    stateCode: '07 - Delhi (Intra-state)',
    taxRate: '3.00%',
    taxableValue: 1425200,
    cgst: 21378,
    sgst: 21378,
    totalGst: 42756,
    invoiceCount: 28
  };

  // HSN-wise table
  const hsnSummary = [
    {
      hsnCode: '711319',
      description: 'Articles of jewellery of gold, silver or platinum',
      uqc: 'GMS (Grams)',
      totalQuantity: 245.850,
      taxableValue: 1680200,
      taxRate: '3%',
      cgst: 25203,
      sgst: 25203,
      totalTax: 50406
    },
    {
      hsnCode: '7106',
      description: 'Silver unwrought or in semi-manufactured forms',
      uqc: 'GMS (Grams)',
      totalQuantity: 1850.000,
      taxableValue: 165000,
      taxRate: '3%',
      cgst: 2475,
      sgst: 2475,
      totalTax: 4950
    }
  ];

  const handleExportJson = () => {
    const payload = {
      gstin: tenant.gstin,
      fp: returnPeriod.replace('-', ''),
      version: 'GSTR1_3.0_OFFLINE',
      hash: 'hash-mock',
      b2b: b2bInvoices,
      b2cs: [b2csSummary],
      hsn: { data: hsnSummary }
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `GSTR1_${tenant.gstin}_${returnPeriod}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Return Period Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              GST Return Filing &amp; Tax Liability Radar
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                GSTIN: {tenant.gstin}
              </span>
            </h2>
            <p className="text-xs text-surface-400">
              Rule 46 &amp; Section 16 compliant GSTR-1, GSTR-3B tax offset, and HSN 711319 reconciliations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-surface-950 border border-surface-700 px-3 py-1.5 rounded-lg text-xs text-surface-200">
            <Calendar className="w-3.5 h-3.5 text-surface-400" />
            <input
              type="month"
              id="input-gst-period"
              value={returnPeriod}
              onChange={(e) => setReturnPeriod(e.target.value)}
              className="bg-transparent focus:outline-none font-mono text-xs"
            />
          </div>

          <button
            id="btn-print-gst-summary"
            onClick={() => printA4('printable-gst-summary', `GST_Tax_Statement_${returnPeriod}`)}
            className="px-3 py-1.5 rounded-lg border border-surface-700 bg-surface-800 hover:bg-surface-700 text-surface-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print GST Statement
          </button>

          <button
            id="btn-export-gst-json"
            onClick={handleExportJson}
            className="px-3.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download GSTR-1 JSON
          </button>
        </div>
      </div>

      {/* Tax Liability vs ITC Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Outward Taxable Value */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400">
            Total Taxable Turnover
          </span>
          <div id="stat-gst-taxable" className="text-2xl font-mono font-bold text-surface-100 mt-1">
            ₹{outwardTaxableValue.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-surface-400 font-mono">
            October Sales (B2B + B2C)
          </div>
        </div>

        {/* Total Outward 3% Tax (Liability) */}
        <div className="bg-surface-900 border border-rose-500/20 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400 flex items-center justify-between">
            <span>Outward Tax (Liability)</span>
            <span className="text-[10px] text-rose-400 font-bold">3% GST</span>
          </span>
          <div id="stat-gst-outward-tax" className="text-2xl font-mono font-bold text-rose-400 mt-1">
            ₹{totalGstOutward.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-surface-400 font-mono flex justify-between">
            <span>CGST (1.5%): ₹{totalCgstOutward.toLocaleString('en-IN')}</span>
            <span>SGST (1.5%): ₹{totalSgstOutward.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Input Tax Credit (ITC Available) */}
        <div className="bg-surface-900 border border-emerald-500/20 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400 flex items-center justify-between">
            <span>Eligible ITC (Bullion Inward)</span>
            <span className="text-[10px] text-emerald-400 font-bold">GSTR-2B</span>
          </span>
          <div id="stat-gst-itc" className="text-2xl font-mono font-bold text-emerald-400 mt-1">
            ₹{totalItcAvailable.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-surface-400 font-mono flex justify-between">
            <span>CGST: ₹{totalCgstItc.toLocaleString('en-IN')}</span>
            <span>SGST: ₹{totalSgstItc.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Net Tax to Pay in Cash Ledger */}
        <div className="bg-surface-900 border border-brand-500/30 rounded-xl p-4">
          <span className="text-xs font-medium uppercase text-surface-400 flex items-center justify-between">
            <span>Net Tax to Pay (Cash Ledger)</span>
            <span className="text-[10px] text-brand-400 font-bold">Challan PMT-06</span>
          </span>
          <div id="stat-gst-net-payable" className="text-2xl font-mono font-bold text-brand-400 mt-1">
            ₹{netCashTaxPayable.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-surface-400 font-mono">
            Liability minus Input Tax Credit
          </div>
        </div>
      </div>

      {/* Return Tabs */}
      <div className="flex border-b border-surface-800 text-xs font-semibold gap-1 overflow-x-auto">
        <button
          id="tab-gst-gstr1"
          onClick={() => setActiveReturnTab('GSTR1')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeReturnTab === 'GSTR1'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          GSTR-1 Outward Supplies (B2B &amp; B2CS)
        </button>
        <button
          id="tab-gst-hsn"
          onClick={() => setActiveReturnTab('HSN')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeReturnTab === 'HSN'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Table 12: HSN Summary (HSN 711319)
        </button>
        <button
          id="tab-gst-gstr3b"
          onClick={() => setActiveReturnTab('GSTR3B')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeReturnTab === 'GSTR3B'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          GSTR-3B Tax Offset Matrix
        </button>
      </div>

      {/* GSTR-1 View */}
      {activeReturnTab === 'GSTR1' && (
        <div className="space-y-4">
          {/* Table 4: B2B Invoices */}
          <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden">
            <div className="p-3 bg-surface-950 border-b border-surface-800 flex justify-between items-center text-xs">
              <span className="font-bold text-surface-200 uppercase tracking-wider">
                Table 4: B2B Invoices (Registered Jewellery Dealers)
              </span>
              <span className="text-surface-400 font-mono">1 Invoice</span>
            </div>
            <table className="w-full text-left text-xs text-surface-300">
              <thead className="bg-surface-950/60 text-surface-400 uppercase tracking-wider text-[11px] border-b border-surface-800 font-sans">
                <tr>
                  <th className="px-4 py-3">Invoice # &amp; Date</th>
                  <th className="px-4 py-3">GSTIN of Recipient</th>
                  <th className="px-4 py-3">Trade Name</th>
                  <th className="px-4 py-3 text-right">Taxable Value</th>
                  <th className="px-4 py-3 text-right">CGST (1.5%)</th>
                  <th className="px-4 py-3 text-right">SGST (1.5%)</th>
                  <th className="px-4 py-3 text-right">Total Invoice Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60 font-mono">
                {b2bInvoices.map((inv) => (
                  <tr key={inv.invoiceNo} className="hover:bg-surface-800/40">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-surface-100">{inv.invoiceNo}</span>
                      <span className="block text-surface-500 text-[11px]">{inv.date}</span>
                    </td>
                    <td className="px-4 py-3 text-brand-400 font-bold">{inv.buyerGstin}</td>
                    <td className="px-4 py-3 font-sans text-surface-200">{inv.buyerTradeName}</td>
                    <td className="px-4 py-3 text-right">₹{inv.taxableValue.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">₹{inv.cgst.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">₹{inv.sgst.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right font-bold text-surface-100">
                      ₹{inv.invoiceValue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table 7: B2CS Small Invoices */}
          <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden">
            <div className="p-3 bg-surface-950 border-b border-surface-800 flex justify-between items-center text-xs">
              <span className="font-bold text-surface-200 uppercase tracking-wider">
                Table 7: B2CS (Retail Consumers - Net Aggregate)
              </span>
              <span className="text-surface-400 font-mono">{b2csSummary.invoiceCount} Invoices Aggregated</span>
            </div>
            <table className="w-full text-left text-xs text-surface-300">
              <thead className="bg-surface-950/60 text-surface-400 uppercase tracking-wider text-[11px] border-b border-surface-800 font-sans">
                <tr>
                  <th className="px-4 py-3">Place of Supply (POS)</th>
                  <th className="px-4 py-3 text-center">Applicable Tax Rate</th>
                  <th className="px-4 py-3 text-right">Aggregated Taxable Value</th>
                  <th className="px-4 py-3 text-right">Central Tax (CGST)</th>
                  <th className="px-4 py-3 text-right">State Tax (SGST)</th>
                  <th className="px-4 py-3 text-right">Total Cess / Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60 font-mono">
                <tr>
                  <td className="px-4 py-3 font-sans font-semibold text-surface-200">
                    {b2csSummary.stateCode}
                  </td>
                  <td className="px-4 py-3 text-center text-brand-400 font-bold">
                    {b2csSummary.taxRate}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    ₹{b2csSummary.taxableValue.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ₹{b2csSummary.cgst.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ₹{b2csSummary.sgst.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">
                    ₹{b2csSummary.totalGst.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table 12 HSN Summary View */}
      {activeReturnTab === 'HSN' && (
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-surface-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              Table 12: HSN-Wise Summary of Outward Supplies
            </h3>
            <span className="text-xs text-surface-400 font-mono">UQC: GMS (Physical Weight)</span>
          </div>
          <table className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 text-surface-400 font-semibold uppercase tracking-wider text-[11px] border-b border-surface-800 font-sans">
              <tr>
                <th className="px-4 py-3">HSN Code</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Total Quantity</th>
                <th className="px-4 py-3 text-right">Total Taxable Value</th>
                <th className="px-4 py-3 text-center">Rate</th>
                <th className="px-4 py-3 text-right">CGST (1.5%)</th>
                <th className="px-4 py-3 text-right">SGST (1.5%)</th>
                <th className="px-4 py-3 text-right text-emerald-400">Total Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60 font-mono">
              {hsnSummary.map((hsn) => (
                <tr key={hsn.hsnCode} className="hover:bg-surface-800/40">
                  <td className="px-4 py-3 font-bold text-brand-400">{hsn.hsnCode}</td>
                  <td className="px-4 py-3 font-sans text-surface-200">{hsn.description}</td>
                  <td className="px-4 py-3 text-right font-bold text-amber-400">
                    {hsn.totalQuantity.toFixed(3)} g
                  </td>
                  <td className="px-4 py-3 text-right">₹{hsn.taxableValue.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-center font-bold">{hsn.taxRate}</td>
                  <td className="px-4 py-3 text-right">₹{hsn.cgst.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right">₹{hsn.sgst.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">
                    ₹{hsn.totalTax.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* GSTR-3B Tax Offset Matrix View */}
      {activeReturnTab === 'GSTR3B' && (
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Table 5.1: Discharge of Tax Liability through ITC &amp; Cash Ledger
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-950 p-4 rounded-xl border border-surface-800 space-y-3">
              <h4 className="text-xs font-bold text-surface-200 uppercase tracking-wider">
                Central Tax (CGST) Offset
              </h4>
              <div className="flex justify-between text-xs">
                <span className="text-surface-400">Gross CGST Due:</span>
                <span className="font-mono font-bold text-surface-100">₹{totalCgstOutward.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-surface-400">Paid through CGST ITC:</span>
                <span className="font-mono text-emerald-400">-₹{totalCgstItc.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-surface-800 pt-2 flex justify-between text-xs font-bold">
                <span className="text-surface-200">Balance Payable in Cash:</span>
                <span className="font-mono text-brand-400">₹{(totalCgstOutward - totalCgstItc).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="bg-surface-950 p-4 rounded-xl border border-surface-800 space-y-3">
              <h4 className="text-xs font-bold text-surface-200 uppercase tracking-wider">
                State Tax (SGST) Offset
              </h4>
              <div className="flex justify-between text-xs">
                <span className="text-surface-400">Gross SGST Due:</span>
                <span className="font-mono font-bold text-surface-100">₹{totalSgstOutward.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-surface-400">Paid through SGST ITC:</span>
                <span className="font-mono text-emerald-400">-₹{totalSgstItc.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-surface-800 pt-2 flex justify-between text-xs font-bold">
                <span className="text-surface-200">Balance Payable in Cash:</span>
                <span className="font-mono text-brand-400">₹{(totalSgstOutward - totalSgstItc).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED PURE-PAPER A4 PORTRAIT PRINTABLE CONTAINER */}
      <div
        id="printable-gst-summary"
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
              GSTIN: <strong>{tenant?.gstin || '27AAACA1234A1Z5'}</strong> &bull; State Code: 07 (Delhi)
            </p>
          </div>
          <div className="text-right">
            <div className="inline-block px-3 py-1 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded">
              GST COMPUTATION &amp; RETURN STATEMENT
            </div>
            <div className="text-[11px] font-mono text-slate-700 mt-1">
              Filing Period: <strong>{returnPeriod}</strong>
            </div>
            <div className="text-[10px] font-semibold text-slate-500">
              Statutory Form: GSTR-1 &amp; GSTR-3B Tax Offset
            </div>
          </div>
        </div>

        {/* Executive Tax Liability Summary */}
        <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-center font-mono">
          <div className="border-r border-slate-200">
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase block">Taxable Turnover</span>
            <span className="text-sm font-bold text-slate-950">₹{outwardTaxableValue.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-r border-slate-200">
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase block">Output 3% Tax (Due)</span>
            <span className="text-sm font-bold text-rose-800">₹{totalGstOutward.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-r border-slate-200">
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase block">Eligible ITC (2B)</span>
            <span className="text-sm font-bold text-emerald-800">₹{totalItcAvailable.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase block">Net Cash Tax Payable</span>
            <span className="text-sm font-bold text-slate-950">₹{netCashTaxPayable.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Section 1: Outward Supplies */}
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide border-b border-slate-300 pb-1">
            1. GSTR-1 Outward Supplies Summary (B2B &amp; B2CS)
          </h3>
          <table className="w-full text-left text-[11px] border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-slate-800">
              <tr>
                <th className="p-2 border-r border-slate-300">Supply Category</th>
                <th className="p-2 border-r border-slate-300">Recipient Details</th>
                <th className="p-2 border-r border-slate-300 text-right">Taxable Value</th>
                <th className="p-2 border-r border-slate-300 text-right">CGST (1.5%)</th>
                <th className="p-2 border-r border-slate-300 text-right">SGST (1.5%)</th>
                <th className="p-2 text-right">Total Invoice Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              <tr>
                <td className="p-2 border-r border-slate-300 font-sans font-medium">Table 4: Registered B2B</td>
                <td className="p-2 border-r border-slate-300 font-sans">{b2bInvoices[0].buyerTradeName} ({b2bInvoices[0].buyerGstin})</td>
                <td className="p-2 border-r border-slate-300 text-right">₹{b2bInvoices[0].taxableValue.toLocaleString('en-IN')}</td>
                <td className="p-2 border-r border-slate-300 text-right">₹{b2bInvoices[0].cgst.toLocaleString('en-IN')}</td>
                <td className="p-2 border-r border-slate-300 text-right">₹{b2bInvoices[0].sgst.toLocaleString('en-IN')}</td>
                <td className="p-2 text-right font-bold">₹{b2bInvoices[0].invoiceValue.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-300 font-sans font-medium">Table 7: Consumer B2CS</td>
                <td className="p-2 border-r border-slate-300 font-sans">Retail Consumers (Aggregate: 28 Invoices)</td>
                <td className="p-2 border-r border-slate-300 text-right">₹{b2csSummary.taxableValue.toLocaleString('en-IN')}</td>
                <td className="p-2 border-r border-slate-300 text-right">₹{b2csSummary.cgst.toLocaleString('en-IN')}</td>
                <td className="p-2 border-r border-slate-300 text-right">₹{b2csSummary.sgst.toLocaleString('en-IN')}</td>
                <td className="p-2 text-right font-bold">₹{(b2csSummary.taxableValue + b2csSummary.totalGst).toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-900 font-mono">
              <tr>
                <td colSpan="2" className="p-2 font-sans uppercase">Total Outward Turnover:</td>
                <td className="p-2 text-right">₹{outwardTaxableValue.toLocaleString('en-IN')}</td>
                <td className="p-2 text-right">₹{totalCgstOutward.toLocaleString('en-IN')}</td>
                <td className="p-2 text-right">₹{totalSgstOutward.toLocaleString('en-IN')}</td>
                <td className="p-2 text-right">₹{(outwardTaxableValue + totalGstOutward).toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Section 2: HSN Summary */}
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide border-b border-slate-300 pb-1">
            2. Table 12 HSN-Wise Breakup of Precious Metal &amp; Jewellery
          </h3>
          <table className="w-full text-left text-[11px] border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-slate-800">
              <tr>
                <th className="p-2 border-r border-slate-300">HSN Code</th>
                <th className="p-2 border-r border-slate-300">Commodity Description</th>
                <th className="p-2 border-r border-slate-300 text-right">Weight (Grams)</th>
                <th className="p-2 border-r border-slate-300 text-right">Taxable Value</th>
                <th className="p-2 border-r border-slate-300 text-center">Rate</th>
                <th className="p-2 text-right">Total Tax (CGST+SGST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {hsnSummary.map(hsn => (
                <tr key={hsn.hsnCode}>
                  <td className="p-2 border-r border-slate-300 font-bold">{hsn.hsnCode}</td>
                  <td className="p-2 border-r border-slate-300 font-sans">{hsn.description}</td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold">{hsn.totalQuantity.toFixed(3)} g</td>
                  <td className="p-2 border-r border-slate-300 text-right">₹{hsn.taxableValue.toLocaleString('en-IN')}</td>
                  <td className="p-2 border-r border-slate-300 text-center">{hsn.taxRate}</td>
                  <td className="p-2 text-right font-bold">₹{hsn.totalTax.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: GSTR-3B Tax Offset */}
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide border-b border-slate-300 pb-1">
            3. GSTR-3B Tax Offset &amp; Discharge Summary (Section 49)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-300 p-3 rounded bg-slate-50 space-y-1 font-mono text-[11px]">
              <div className="font-bold font-sans uppercase text-slate-900 border-b border-slate-200 pb-1">Central Tax (CGST)</div>
              <div className="flex justify-between"><span>Output Tax Due:</span><span>₹{totalCgstOutward.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-emerald-800"><span>Less: Eligible ITC (GSTR-2B):</span><span>-₹{totalCgstItc.toLocaleString('en-IN')}</span></div>
              <div className="border-t border-slate-300 pt-1 flex justify-between font-bold text-slate-950">
                <span>Net Cash Tax Payable:</span>
                <span>₹{(totalCgstOutward - totalCgstItc).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="border border-slate-300 p-3 rounded bg-slate-50 space-y-1 font-mono text-[11px]">
              <div className="font-bold font-sans uppercase text-slate-900 border-b border-slate-200 pb-1">State Tax (SGST)</div>
              <div className="flex justify-between"><span>Output Tax Due:</span><span>₹{totalSgstOutward.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-emerald-800"><span>Less: Eligible ITC (GSTR-2B):</span><span>-₹{totalSgstItc.toLocaleString('en-IN')}</span></div>
              <div className="border-t border-slate-300 pt-1 flex justify-between font-bold text-slate-950">
                <span>Net Cash Tax Payable:</span>
                <span>₹{(totalSgstOutward - totalSgstItc).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification and Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-center text-[10px]">
          <div>
            <div className="h-10 border-b border-dashed border-slate-400"></div>
            <span className="font-bold text-slate-800 mt-1 block">Chartered Accountant / Tax Consultant</span>
            <span className="text-[9px] text-slate-500">Membership / Practice No.</span>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-400"></div>
            <span className="font-bold text-slate-800 mt-1 block">For {tenant?.businessName || 'A3 Jewellery'}</span>
            <span className="text-[9px] text-slate-500">Authorised Signatory / Managing Partner</span>
          </div>
        </div>

      </div>

    </div>
  );
};
