import React from 'react';
import { printA4 } from '../../../utils/printService';
import { 
  Hammer, 
  Printer, 
  X, 
  ShieldCheck, 
  Coins, 
  ArrowDownLeft, 
  CheckCircle2, 
  IndianRupee 
} from 'lucide-react';

export const KarigarReceiveVoucherModal = ({ 
  isOpen, 
  onClose, 
  receiveData, 
  karigar, 
  tenant 
}) => {
  if (!isOpen || !receiveData) return null;

  const voucherNo = receiveData.voucherNo || `VCH-REC-${Date.now().toString().slice(-4)}`;
  const receiveDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const receiveTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const gross = parseFloat(receiveData.grossWeight) || 0;
  const scrap = parseFloat(receiveData.returnScrapWeight) || 0;
  const net = parseFloat(receiveData.netWeight) || gross;
  const totalAccounted = net + scrap;
  const laborEarned = parseFloat(receiveData.makingChargesPayable) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Finished Goods Inward &amp; Wastage Settlement Voucher
              </h3>
              <span className="text-[10px] font-mono text-surface-400">
                Receipt Ref: {voucherNo} &bull; Artisan: {karigar?.name || 'Babu Lal Goldsmith'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-print-receive-a4"
              onClick={() => printA4('printable-karigar-receive-slip', `Karigar_Receipt_${voucherNo}`)}
              className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Voucher</span>
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
          id="printable-karigar-receive-slip" 
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
                GOODS INWARD &amp; GHAT SETTLEMENT
              </span>
              <div className="text-[10px] text-slate-700 mt-1">Receipt Ref: <strong>{voucherNo}</strong></div>
              <div className="text-[10px] text-slate-700">Date: {receiveDate} &bull; Time: {receiveTime}</div>
            </div>
          </div>

          {/* Artisan Profile Box */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-200 text-[11px] font-sans">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Artisan / Workshop Details</span>
              <div className="text-sm font-bold text-black mt-0.5">{karigar?.name || 'Babu Lal Goldsmith'}</div>
              <div className="text-slate-700">{karigar?.specialization || 'Handmade Bridal & Antique Kundan'}</div>
              <div className="text-slate-600 font-mono text-[10px]">{karigar?.workshopCity || 'Rajkot, Gujarat'} &bull; Mobile: {karigar?.phone || '+91 98250 11223'}</div>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-500 uppercase block font-sans font-semibold">Quality &amp; Assay Summary</span>
              <div className="text-slate-800 text-[11px] mt-0.5">Assay Verification: <strong>BIS Hallmark 916 Compliant</strong></div>
              <div className="text-slate-800 text-[11px]">Wastage Allowed Rate: <strong>{karigar?.allowedGhatRate || 2.0}%</strong></div>
              <div className="text-emerald-700 font-bold text-[11px]">Status: <strong>QUALITY INSPECTED &bull; ACCEPTED</strong></div>
            </div>
          </div>

          {/* Inward Articles & Metal Recovery Table */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
              Finished Goods Inward &amp; Scrap Reconciliation
            </h4>
            <table className="w-full text-left border-collapse border border-slate-300 font-mono text-[11px]">
              <thead className="bg-slate-100 text-black">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">#</th>
                  <th className="p-2 border-r border-slate-300 font-sans">Delivered Article Description</th>
                  <th className="p-2 border-r border-slate-300 text-right">Gross Wt</th>
                  <th className="p-2 border-r border-slate-300 text-right">Net Metal Wt</th>
                  <th className="p-2 border-r border-slate-300 text-right">Return Scrap</th>
                  <th className="p-2 text-right">Total Accounted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 border-r border-slate-300 text-slate-500">1</td>
                  <td className="p-2 border-r border-slate-300 font-sans font-bold text-black">
                    {receiveData.articleName || '22K Handcrafted Filigree Necklace'}
                  </td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold text-black">
                    {gross.toFixed(3)} g
                  </td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold text-black">
                    {net.toFixed(3)} g
                  </td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold text-amber-700">
                    {scrap.toFixed(3)} g
                  </td>
                  <td className="p-2 text-right font-black text-emerald-700 text-sm">
                    {totalAccounted.toFixed(3)} g
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t border-slate-300">
                <tr>
                  <td colSpan={5} className="p-2 text-right font-sans uppercase">Total Metal Credited to Artisan Account:</td>
                  <td className="p-2 text-right text-sm">{totalAccounted.toFixed(3)} g</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Labour Charges & Mazdoori Ledger Credit */}
          <div className="grid grid-cols-2 gap-4 bg-emerald-50/70 p-3 rounded border border-emerald-200 text-[11px] font-sans">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Labour (Mazdoori) Accounting</span>
              <div className="text-black font-mono text-[11px] mt-1">
                Net Weight: <strong>{net.toFixed(3)} g</strong> &times; Making Rate: <strong>₹{(receiveData.makingRatePerGram || 750)}/g</strong>
              </div>
              <div className="text-emerald-800 text-xs font-bold mt-0.5">
                Total Labour Amount Credited to Karigar: ₹{laborEarned.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-500 uppercase block font-sans font-semibold">Updated Artisan Balance</span>
              <div className="text-slate-800 text-[11px] mt-1">
                Outstanding Pure Metal in Hand: <strong>{Math.max(0, (karigar?.metalBalanceGrams || 0) - totalAccounted).toFixed(3)} g</strong>
              </div>
              <div className="text-slate-800 text-[11px]">
                Total Labour Payable Dues: <strong>₹{((karigar?.laborBalanceRupees || 0) + laborEarned).toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          {/* Assay & QC Declaration */}
          <div className="pt-2 text-[10px] text-slate-600 leading-normal border-t border-slate-200 font-sans">
            <p>
              <strong>Quality Inspection &amp; Weight Certification:</strong> The finished article and scrap detailed above have been precision-weighed on a calibrated class-II electronic bullion scale. Purity and fineness conform to statutory hallmark standards and have been credited against the artisan's open metal ledger.
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-8 text-center text-[10px] font-sans">
            <div className="border-t border-black pt-1">
              <span className="font-bold text-slate-800">Quality Inspector / Assayer</span>
              <p className="text-slate-500 text-[9px]">Verified Purity &amp; Finish</p>
            </div>
            <div className="border-t border-black pt-1">
              <span className="font-bold text-slate-800">Workshop Store Manager</span>
              <p className="text-slate-500 text-[9px]">Received &amp; Stock Updated</p>
            </div>
            <div className="border-t border-black pt-1">
              <span className="font-bold text-slate-800">Artisan / Karigar Signature</span>
              <p className="text-slate-500 text-[9px]">Confirmed Metal &amp; Mazdoori</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
