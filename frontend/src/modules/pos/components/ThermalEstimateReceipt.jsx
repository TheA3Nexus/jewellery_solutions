import React from 'react';
import { Printer, X, MessageCircle } from 'lucide-react';

export const ThermalEstimateReceipt = ({ invoice, onClose }) => {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-sm w-full p-4 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-surface-800 pb-2">
          <span className="text-xs font-bold text-surface-200">3-Inch Thermal Receipt Preview</span>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 80mm Thermal Receipt Simulation Container */}
        <div className="bg-white text-black p-4 rounded shadow font-mono text-[11px] space-y-2 border border-slate-300">
          <div className="text-center space-y-0.5 border-b border-dashed border-black pb-2">
            <h4 className="font-bold text-sm tracking-tight">{invoice.shopName}</h4>
            <p className="text-[10px]">{invoice.shopPhone || '+91 98200 12345'}</p>
            <div className="font-bold text-xs pt-1 uppercase">Estimation Quotation</div>
          </div>

          <div className="text-[10px] space-y-0.5 border-b border-dashed border-black pb-1.5">
            <div className="flex justify-between">
              <span>Date: {new Date(invoice.createdAt).toLocaleDateString()}</span>
              <span>Time: {new Date(invoice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div>Ref No: {invoice.id}</div>
            <div>Customer: {invoice.customer?.name || 'Walk-in'}</div>
          </div>

          {/* Items */}
          <div className="space-y-1.5 border-b border-dashed border-black pb-2">
            {invoice.items?.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="font-bold">{item.name}</div>
                <div className="text-[10px] flex justify-between">
                  <span>Gross: {item.grossWeight.toFixed(3)}g | Net: {item.netWeight.toFixed(3)}g</span>
                  <span>{item.purity}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Making: ₹{item.makingChargeTotal.toLocaleString('en-IN')}</span>
                  <span className="font-bold">₹{item.rowTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-0.5 text-[10px] border-b border-dashed border-black pb-2">
            <div className="flex justify-between">
              <span>Gross Total:</span>
              <span>₹{invoice.grossTotal.toLocaleString('en-IN')}</span>
            </div>
            {invoice.exchangeCredit > 0 && (
              <div className="flex justify-between">
                <span>Less Old Metal:</span>
                <span>-₹{invoice.exchangeCredit.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>CGST (1.5%):</span>
              <span>₹{(invoice.gstAmount / 2).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (1.5%):</span>
              <span>₹{(invoice.gstAmount / 2).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xs pt-1 border-t border-black">
              <span>NET AMOUNT:</span>
              <span>₹{invoice.grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="text-center pt-2 text-[9px]">
            <p>*** ESTIMATE ONLY &bull; NOT A TAX INVOICE ***</p>
            <p className="mt-1">Authorized Signatory</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="btn-primary flex-1 py-2 text-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print 80mm Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};