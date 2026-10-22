import React from 'react';
import { printA4 } from '../../../utils/printService';
import { Printer, X, ShieldCheck, FileCheck } from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const MemoDeliveryChallanModal = ({ memo, onClose }) => {
  const { tenant } = useTenant();

  if (!memo) return null;

  const totalGrossWeight = (memo.items || []).reduce((sum, i) => sum + (parseFloat(i.grossWeight) || 0), 0);
  const totalApproxValue = memo.totalApproxValue || (memo.items || []).reduce((sum, i) => sum + (parseFloat(i.approxValue) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-4xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Jewelry On Approval Challan (Jangad Memo)
              </h3>
              <span className="text-[10px] font-mono text-surface-400">
                Rule 55 CGST Delivery Challan &bull; Ref: {memo.id}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => printA4('printable-memo-challan', `Memo_Challan_${memo.id}`)}
              className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Challan</span>
            </button>
            <button data-testid="close-modal-btn" onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper A4 Formatted Layout Container */}
        <div id="printable-memo-challan" className="bg-white text-black p-8 rounded-xl shadow font-sans text-xs space-y-4 border border-slate-300 printable-document printable-a4">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                {tenant?.name || 'A3 LUXURY JEWELLERS'}
              </h2>
              <p className="text-[11px] text-slate-600 font-mono mt-0.5">{tenant?.address || 'Showroom Address'}</p>
              <p className="text-[11px] text-slate-600">
                <strong>GSTIN:</strong> {tenant?.gstin || '27AAACP0123M1Z5'} &bull; <strong>BIS Lic:</strong> {tenant?.bisLicenseNo || 'HM/C-7890123'}
              </p>
              <p className="text-[11px] text-slate-600"><strong>Phone:</strong> {tenant?.phone || '+91 98200 12345'}</p>
            </div>
            <div className="text-right space-y-1 font-mono">
              <div className="inline-block px-2.5 py-1 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded">
                DELIVERY CHALLAN
              </div>
              <div className="text-[10px] text-slate-500 font-sans font-semibold">
                (Rule 55 of CGST Rules, 2017)
              </div>
              <div className="text-[11px]"><strong>Challan No:</strong> {memo.id}</div>
              <div className="text-[11px]"><strong>Date:</strong> {memo.createdAt ? new Date(memo.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</div>
              <div className="text-[11px] text-rose-700 font-bold"><strong>Return Due Date:</strong> {memo.returnDueDate}</div>
            </div>
          </div>

          {/* Consignee & Reason for Transportation */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3 font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block mb-0.5">
                Consignee / Client Details:
              </span>
              <div className="font-bold text-slate-900 text-xs">{memo.customer?.name}</div>
              <div>Address: {memo.customer?.address || 'Pedder Road, Mumbai'}</div>
              <div>Phone: {memo.customer?.phone}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block mb-0.5">
                Statutory Supply Classification:
              </span>
              <div className="font-bold text-slate-900">SUPPLY ON APPROVAL / JANGAD</div>
              <div>Transportation Reason: Goods Sent for Customer Selection</div>
              <div>Tax Liability: Not a Sale (Tax payable upon approval)</div>
            </div>
          </div>

          {/* Table of Articles Dispatched */}
          <div className="border border-slate-300 rounded overflow-hidden">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase border-b border-slate-300">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Description of Jewelry Articles</th>
                  <th className="p-2">Barcode / HUID</th>
                  <th className="p-2">Purity</th>
                  <th className="p-2 text-right">Gross Wt (g)</th>
                  <th className="p-2 text-right">Approx Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(memo.items || []).map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2 font-medium text-slate-900">{item.name}</td>
                    <td className="p-2">{item.barcode || item.huid || 'HD7891'}</td>
                    <td className="p-2 text-amber-700 font-semibold">{item.purity || '22K'}</td>
                    <td className="p-2 text-right">{parseFloat(item.grossWeight || 0).toFixed(3)}</td>
                    <td className="p-2 text-right font-bold text-slate-900">
                      ₹{Math.round(item.approxValue || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold">
                <tr>
                  <td colSpan={4} className="p-2 text-right uppercase">Total Dispatch Summary:</td>
                  <td className="p-2 text-right text-slate-900">{totalGrossWeight.toFixed(3)} g</td>
                  <td className="p-2 text-right text-slate-900">₹{Math.round(totalApproxValue).toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Legal Terms & Conditions for Approval */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[10px] space-y-1">
            <p className="font-bold text-slate-800 uppercase">Statutory Conditions of Jangad / Approval Dispatch:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
              <li>The articles listed above are delivered on approval/examination only and do NOT constitute a sale.</li>
              <li>Absolute ownership and title of all goods remain with <strong>{tenant?.name || 'A3 LUXURY JEWELLERS'}</strong> until an official Tax Invoice is generated and payment is realized.</li>
              <li>The customer agrees to safely safeguard the articles and return any unselected jewelry in original condition on or before <strong>{memo.returnDueDate}</strong>.</li>
              <li>Any loss, damage, theft, or substitution while in possession shall be reimbursed at full market value.</li>
            </ol>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-[11px]">
            <div>
              <div className="h-12 border-b border-slate-400"></div>
              <div className="pt-1.5 font-bold text-slate-800">
                Receiver's Signature / Acknowledgment
              </div>
              <div className="text-[10px] text-slate-500">
                (I acknowledge receipt of above goods in safe condition on approval)
              </div>
            </div>
            <div className="text-right flex flex-col justify-end">
              <div className="h-12 border-b border-slate-400"></div>
              <div className="pt-1.5 font-bold text-slate-800">
                For {tenant?.name || 'A3 LUXURY JEWELLERS'}
              </div>
              <div className="text-[10px] text-slate-500">
                Authorized Signatory &amp; Showroom Seal
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
