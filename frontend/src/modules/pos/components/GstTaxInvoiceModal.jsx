import { printA4 } from '../../../utils/printService';
import React from 'react';
import { Printer, MessageCircle, X, ShieldCheck, Download } from 'lucide-react';

export const GstTaxInvoiceModal = ({ invoice, onClose, onWhatsAppShare }) => {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-4xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
              Official GST Tax Invoice Preview
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300">
              Rule 46 Compliant
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onWhatsAppShare(invoice)}
              className="btn-secondary py-1.5 px-3 text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp PDF</span>
            </button>
            <button
              onClick={() => printA4('printable-tax-invoice', `Tax_Invoice_${invoice.id || 'INV'}`)}
              className="btn-primary py-1.5 px-3 text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Invoice</span>
            </button>
            <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper A4 Formatted Layout Container */}
        <div id="printable-tax-invoice" className="bg-white text-black p-8 rounded-xl shadow font-sans text-xs space-y-4 border border-slate-300 printable-document printable-a4">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                {invoice.shopName}
              </h2>
              <p className="text-[11px] text-slate-600 font-mono mt-0.5">{invoice.shopAddress}</p>
              <p className="text-[11px] text-slate-600">
                <strong>GSTIN:</strong> {invoice.shopGstin} &bull; <strong>BIS Lic:</strong> {invoice.shopBisNo}
              </p>
              <p className="text-[11px] text-slate-600"><strong>Phone:</strong> {invoice.shopPhone}</p>
            </div>
            <div className="text-right space-y-1 font-mono">
              <div className="inline-block px-2.5 py-1 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded">
                TAX INVOICE
              </div>
              <div className="text-[11px]"><strong>Invoice No:</strong> {invoice.id}</div>
              <div className="text-[11px]"><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</div>
              <div className="text-[11px]"><strong>Place of Supply:</strong> Maharashtra (Code: 27)</div>
            </div>
          </div>

          {/* Billed To / Buyer Details */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3 font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block mb-0.5">
                Details of Buyer / Receiver:
              </span>
              <div className="font-bold text-slate-900 text-xs">{invoice.customer?.name || 'Walk-in Customer'}</div>
              <div>Address: {invoice.customer?.city || 'Local Customer'}</div>
              <div>Phone: {invoice.customer?.phone || 'N/A'}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block mb-0.5">
                Statutory Identifiers:
              </span>
              <div><strong>PAN:</strong> {invoice.customer?.pan || 'N/A'}</div>
              <div><strong>State Code:</strong> 27 (Intra-State)</div>
              <div><strong>Reverse Charge:</strong> No</div>
            </div>
          </div>

          {/* Table of Articles */}
          <div className="border border-slate-300 rounded overflow-hidden">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase border-b border-slate-300">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Product Description</th>
                  <th className="p-2">HSN</th>
                  <th className="p-2">HUID</th>
                  <th className="p-2 text-right">Gross (g)</th>
                  <th className="p-2 text-right">Net (g)</th>
                  <th className="p-2 text-right">Rate (₹/g)</th>
                  <th className="p-2 text-right">Making (₹)</th>
                  <th className="p-2 text-right">Final Amt (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">
                      <strong className="text-slate-900">{item.name}</strong>
                      <div className="text-[10px] text-slate-500">{item.purity} &bull; {item.category}</div>
                    </td>
                    <td className="p-2">711319</td>
                    <td className="p-2 font-bold">{item.huid || 'N/A'}</td>
                    <td className="p-2 text-right">{item.grossWeight.toFixed(3)}</td>
                    <td className="p-2 text-right font-bold">{item.netWeight.toFixed(3)}</td>
                    <td className="p-2 text-right">₹{item.ratePerGram.toFixed(2)}</td>
                    <td className="p-2 text-right">₹{item.makingChargeTotal.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right font-bold text-slate-900">
                      ₹{item.rowTotal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown & Split Payments */}
          <div className="grid grid-cols-2 gap-4 font-mono text-[11px] pt-2">
            
            {/* Left: Payment Breakdown */}
            <div className="border border-slate-200 rounded p-3 space-y-1">
              <span className="font-sans font-bold text-[10px] uppercase text-slate-600 block mb-1">
                Settlement &amp; Mode of Payment
              </span>
              <div className="flex justify-between">
                <span>Cash Received:</span>
                <span>₹{(invoice.paymentBreakdown?.cash || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Card Received:</span>
                <span>₹{(invoice.paymentBreakdown?.card || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Dynamic UPI:</span>
                <span>₹{(invoice.paymentBreakdown?.upi || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Cheque / RTGS:</span>
                <span>₹{(invoice.paymentBreakdown?.cheque || 0).toLocaleString('en-IN')}</span>
              </div>
              {invoice.exchangeCredit > 0 && (
                <div className="flex justify-between font-bold text-slate-700 border-t border-slate-200 pt-1">
                  <span>Old Metal Received:</span>
                  <span>-₹{invoice.exchangeCredit.toLocaleString('en-IN')}</span>
                </div>
              )}
              {invoice.paymentBreakdown?.udhaar > 0 && (
                <div className="flex justify-between font-bold text-rose-600 border-t border-slate-200 pt-1">
                  <span>Carried to Khata (Udhaar):</span>
                  <span>₹{invoice.paymentBreakdown.udhaar.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Right: Tax Summary */}
            <div className="border border-slate-200 rounded p-3 space-y-1">
              <div className="flex justify-between">
                <span>Gross Jewellery Value:</span>
                <span>₹{invoice.grossTotal.toLocaleString('en-IN')}</span>
              </div>
              {invoice.exchangeCredit > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Less Exchange Credit:</span>
                  <span>-₹{invoice.exchangeCredit.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>Taxable Value:</span>
                <span>₹{invoice.taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (1.5%):</span>
                <span>₹{(invoice.gstAmount / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (1.5%):</span>
                <span>₹{(invoice.gstAmount / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-900 pt-1.5 font-bold text-sm text-slate-900">
                <span>Total Invoice Value:</span>
                <span>₹{invoice.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>

          {/* Terms & Signatures */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-[10px]">
            <div>
              <p className="font-bold">Terms &amp; Conditions:</p>
              <p className="text-slate-500 mt-0.5">
                1. Certified that the gold jewelry conforms to BIS Hallmarking standards.
                2. Goods once sold cannot be returned without original invoice.
                3. Subject to local jurisdiction only.
              </p>
            </div>
            <div className="text-right flex flex-col justify-end">
              <div className="h-10"></div>
              <div className="border-t border-slate-400 pt-1 inline-block font-bold">
                For {invoice.shopName} (Authorized Signatory)
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};