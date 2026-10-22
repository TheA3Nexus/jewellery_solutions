import React from 'react';
import { printA4 } from '../../../utils/printService';
import { 
  Hammer, 
  Printer, 
  X, 
  ShieldCheck, 
  Coins, 
  ArrowUpRight, 
  Building2 
} from 'lucide-react';

export const KarigarIssueVoucherModal = ({ 
  isOpen, 
  onClose, 
  issueData, 
  karigar, 
  tenant 
}) => {
  if (!isOpen || !issueData) return null;

  const voucherNo = issueData.voucherNo || `VCH-ISS-${Date.now().toString().slice(-4)}`;
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const issueTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Artisan Metal Issue Challan (Dhaat Javak)
              </h3>
              <span className="text-[10px] font-mono text-surface-400">
                Challan Ref: {voucherNo} &bull; Job Order: {issueData.id || 'WO-8021'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-print-issue-a4"
              onClick={() => printA4('printable-karigar-issue-slip', `Karigar_Issue_${voucherNo}`)}
              className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Challan</span>
            </button>
            <button 
              data-testid="close-modal-btn" 
              onClick={onClose} 
              className="text-surface-400 hover:text-surface-100 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper A4 Formatted Layout Container */}
        <div 
          id="printable-karigar-issue-slip" 
          className="bg-white text-black p-8 rounded-xl shadow font-sans text-xs space-y-4 border border-slate-300 printable-document printable-a4"
        >
          {/* Showroom Header */}
          <div className="border-b-2 border-black pb-3 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-black">
                {tenant?.name || 'A3 LUXURY JEWELLERS'}
              </h1>
              <p className="text-[11px] text-slate-700 mt-0.5">
                {tenant?.tagline || 'Exquisite Hallmarked Gold & Diamond Ornaments'}
              </p>
              <p className="text-[10px] text-slate-600">
                Showroom: Zaveri Bazaar, Mumbai &bull; GSTIN: {tenant?.gstin || '27AABCU9603R1ZM'} &bull; Phone: +91 98200 12345
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="px-2.5 py-1 text-[11px] font-bold border border-black uppercase inline-block">
                RAW METAL ISSUE CHALLAN (JAVAK)
              </span>
              <div className="text-[10px] text-slate-700 mt-1">Voucher: <strong>{voucherNo}</strong></div>
              <div className="text-[10px] text-slate-700">Date: {issueDate} &bull; Time: {issueTime}</div>
            </div>
          </div>

          {/* Artisan & Workshop Particulars Box */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-200 text-[11px] font-sans">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Artisan / Workshop Details</span>
              <div className="text-sm font-bold text-black mt-0.5">{karigar?.name || 'Babu Lal Goldsmith'}</div>
              <div className="text-slate-700">{karigar?.specialization || 'Handmade Bridal & Antique Kundan'}</div>
              <div className="text-slate-600 font-mono text-[10px]">{karigar?.workshopCity || 'Rajkot, Gujarat'} &bull; Mobile: {karigar?.phone || '+91 98250 11223'}</div>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-500 uppercase block font-sans font-semibold">Manufacturing Schedule</span>
              <div className="text-slate-800 text-[11px] mt-0.5">Work Order Ref: <strong>{issueData.id || 'WO-8021'}</strong></div>
              <div className="text-slate-800 text-[11px]">Allowable Ghat (Loss): <strong>{issueData.maxGhatPercent || karigar?.allowedGhatRate || 2.5}%</strong></div>
              <div className="text-slate-800 text-[11px]">Delivery Due: <strong>Within 7 Working Days</strong></div>
            </div>
          </div>

          {/* Issued Metal Specifications Table */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
              Dispatched Raw Bullion &amp; Work Order Specifications
            </h4>
            <table className="w-full text-left border-collapse border border-slate-300 font-mono text-[11px]">
              <thead className="bg-slate-100 text-black">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">#</th>
                  <th className="p-2 border-r border-slate-300 font-sans">Dispatched Metal &amp; Purity</th>
                  <th className="p-2 border-r border-slate-300 font-sans">Target Finished Ornament</th>
                  <th className="p-2 border-r border-slate-300 text-right">Target Gross Wt</th>
                  <th className="p-2 border-r border-slate-300 text-right">Allowed Ghat</th>
                  <th className="p-2 text-right">Pure Weight Issued</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 border-r border-slate-300 text-slate-500">1</td>
                  <td className="p-2 border-r border-slate-300 font-bold text-black">
                    {issueData.purity || '24K (99.9%)'} Pure Bullion
                  </td>
                  <td className="p-2 border-r border-slate-300 font-sans text-slate-800">
                    {issueData.workOrderDesc || '22K Traditional Peacock Bridal Set'}
                  </td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold text-black">
                    {(parseFloat(issueData.weightGrams) * 0.98).toFixed(3)} g
                  </td>
                  <td className="p-2 border-r border-slate-300 text-right text-slate-700">
                    {issueData.maxGhatPercent || 2.5}%
                  </td>
                  <td className="p-2 text-right font-black text-amber-700 text-sm">
                    {(parseFloat(issueData.weightGrams) || 0).toFixed(3)} g
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t border-slate-300">
                <tr>
                  <td colSpan={5} className="p-2 text-right font-sans uppercase">Total Pure Bullion Issued (Javak):</td>
                  <td className="p-2 text-right text-sm">{(parseFloat(issueData.weightGrams) || 0).toFixed(3)} g</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Cumulative Karigar Metal Account Status */}
          <div className="grid grid-cols-3 gap-3 bg-amber-50/60 p-2.5 rounded border border-amber-200 font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Previous Metal Balance</span>
              <strong className="text-black">{(karigar?.metalBalanceGrams || 0).toFixed(3)} g</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Newly Issued in Voucher</span>
              <strong className="text-amber-700">+{(parseFloat(issueData.weightGrams) || 0).toFixed(3)} g</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Updated Metal in Hand</span>
              <strong className="text-black text-xs font-black">
                {((karigar?.metalBalanceGrams || 0) + (parseFloat(issueData.weightGrams) || 0)).toFixed(3)} g
              </strong>
            </div>
          </div>

          {/* Legal Artisan Undertaking */}
          <div className="pt-2 text-[10px] text-slate-600 leading-normal border-t border-slate-200 font-sans space-y-1">
            <p>
              <strong>Artisan Undertaking &amp; Bailment Contract:</strong> The precious metal described herein is delivered solely under contract for manufacturing/jobwork. Ownership remains strictly with the showroom. The artisan agrees to manufacture the specified ornament adhering to BIS hallmark standards and return all finished goods, scrap filings (chhilan), and melting dross.
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-8 text-center text-[10px] font-sans">
            <div className="border-t border-black pt-1">
              <span className="font-bold text-slate-800">Artisan / Karigar Signature</span>
              <p className="text-slate-500 text-[9px]">Acknowledged Pure Metal Receipt</p>
            </div>
            <div className="border-t border-black pt-1">
              <span className="font-bold text-slate-800">Workshop Store In-Charge</span>
              <p className="text-slate-500 text-[9px]">Weighed &amp; Dispatched</p>
            </div>
            <div className="border-t border-black pt-1">
              <span className="font-bold text-slate-800">Showroom General Manager</span>
              <p className="text-slate-500 text-[9px]">Authorized Signatory</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
