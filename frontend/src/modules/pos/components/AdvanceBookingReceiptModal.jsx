import React from 'react';
import { printA4, printThermal } from '../../../utils/printService';
import { Printer, X, Bookmark, ShieldCheck, Lock } from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const AdvanceBookingReceiptModal = ({ booking, onClose }) => {
  const { tenant } = useTenant();

  if (!booking) return null;

  const totalBookingValue = booking.totalBookingValue || (booking.targetGrams * booking.lockedRate);
  const balancePayable = Math.max(0, totalBookingValue - (booking.advanceDeposit || 0));
  const advancePercent = totalBookingValue > 0 ? ((booking.advanceDeposit / totalBookingValue) * 100).toFixed(1) : '0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Gold Rate Lock Certificate &amp; Deposit Receipt
              </h3>
              <span className="text-[10px] font-mono text-surface-400">
                Booking Ref: {booking.id} &bull; Delivery: {booking.deliveryDate}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => printThermal('printable-rate-lock-thermal', `RateLock_Slip_${booking.id}`)}
              className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print 80mm Slip</span>
            </button>
            <button
              onClick={() => printA4('printable-rate-lock-certificate', `RateLock_Cert_${booking.id}`)}
              className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Certificate</span>
            </button>
            <button data-testid="close-modal-btn" onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper A4 Formatted Layout Container */}
        <div id="printable-rate-lock-certificate" className="bg-white text-black p-8 rounded-xl shadow font-sans text-xs space-y-4 border border-slate-300 printable-document printable-a4">
          
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
              <div className="inline-block px-2.5 py-1 bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded">
                RATE LOCK CERTIFICATE
              </div>
              <div className="text-[11px]"><strong>Booking Ref:</strong> {booking.id}</div>
              <div className="text-[11px]"><strong>Date:</strong> {booking.bookingDate || new Date().toLocaleDateString()}</div>
              <div className="text-[11px] text-amber-800 font-bold"><strong>Target Delivery:</strong> {booking.deliveryDate}</div>
            </div>
          </div>

          {/* Customer Profile */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3 font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block mb-0.5">
                Client / Beneficiary Details:
              </span>
              <div className="font-bold text-slate-900 text-xs">{booking.customer?.name}</div>
              <div>Phone: {booking.customer?.phone}</div>
              <div>City: {booking.customer?.city || 'Local Customer'}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block mb-0.5">
                Contractual Guarantee:
              </span>
              <div className="font-bold text-emerald-800">BULLION RATE FIRMLY PROTECTED</div>
              <div>Protection: Immune to Bullion Market Spikes</div>
              <div>Status: Rate Confirmed &amp; Deposit Received</div>
            </div>
          </div>

          {/* Rate Lock Details Matrix */}
          <div className="border border-slate-300 rounded overflow-hidden">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase border-b border-slate-300">
                <tr>
                  <th className="p-2.5">Bullion Specification</th>
                  <th className="p-2.5 text-right">Locked Rate (₹/g)</th>
                  <th className="p-2.5 text-right">Target Weight</th>
                  <th className="p-2.5 text-right">Total Order Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5">
                    <strong className="text-slate-900">{booking.bookingPurity || '22K (91.6% BIS)'} Gold</strong>
                    <div className="text-[10px] text-slate-500">Hallmarked Jewellery Rate Benchmark</div>
                  </td>
                  <td className="p-2.5 text-right text-amber-800 font-bold text-sm">
                    ₹{booking.lockedRate.toLocaleString('en-IN')} /g
                  </td>
                  <td className="p-2.5 text-right font-bold text-slate-900">
                    {parseFloat(booking.targetGrams || 0).toFixed(3)} g
                  </td>
                  <td className="p-2.5 text-right font-bold text-slate-900 text-sm">
                    ₹{Math.round(totalBookingValue).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Settlement & Balance Breakdown */}
          <div className="grid grid-cols-2 gap-4 font-mono text-[11px] pt-2">
            
            {/* Left: Advance Collection Details */}
            <div className="border border-slate-200 rounded p-3 space-y-1">
              <span className="font-sans font-bold text-[10px] uppercase text-slate-600 block mb-1">
                Advance Deposit Record
              </span>
              <div className="flex justify-between">
                <span>Advance Amount Paid:</span>
                <span className="font-bold text-emerald-800">₹{parseFloat(booking.advanceDeposit || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Mode:</span>
                <span>{booking.paymentMode || 'BANK_NEFT'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Advance Ratio:</span>
                <span>{advancePercent}% of Order</span>
              </div>
            </div>

            {/* Right: Balance Due Matrix */}
            <div className="border border-slate-200 rounded p-3 space-y-1 bg-amber-50/50">
              <span className="font-sans font-bold text-[10px] uppercase text-slate-600 block mb-1">
                Estimated Delivery Settlement
              </span>
              <div className="flex justify-between">
                <span>Locked Metal Subtotal:</span>
                <span>₹{Math.round(totalBookingValue).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-800">
                <span>Less Advance Adjusted:</span>
                <span>-₹{parseFloat(booking.advanceDeposit || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-300 pt-1 text-xs">
                <span>Balance Metal Due:</span>
                <span>₹{Math.round(balancePayable).toLocaleString('en-IN')}*</span>
              </div>
              <div className="text-[9px] text-slate-500 pt-0.5">
                *Making charges, stone value, and 3% GST will be added at final delivery invoice.
              </div>
            </div>

          </div>

          {/* Standard Jewellery Terms */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[10px] space-y-1">
            <p className="font-bold text-slate-800 uppercase">Rate Lock Contractual Rules:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
              <li>The bullion rate of <strong>₹{booking.lockedRate}/g</strong> is firmly locked and protected for the customer against market price surges up to <strong>{booking.deliveryDate}</strong>.</li>
              <li>At the time of jewelry delivery, making charges, hallmark fees, and 3% GST will be applied as per the final selected ornaments.</li>
              <li>The advance deposit is non-refundable; if delivery is not taken within 30 days of the target date, the deposit may be converted to standard store credit at prevailing rates.</li>
            </ol>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-[11px]">
            <div>
              <div className="h-12 border-b border-slate-400"></div>
              <div className="pt-1.5 font-bold text-slate-800">
                Customer Signature &amp; Acceptance
              </div>
              <div className="text-[10px] text-slate-500">
                (I agree to the rate lock terms and delivery schedule)
              </div>
            </div>
            <div className="text-right flex flex-col justify-end">
              <div className="h-12 border-b border-slate-400"></div>
              <div className="pt-1.5 font-bold text-slate-800">
                For {tenant?.name || 'A3 LUXURY JEWELLERS'}
              </div>
              <div className="text-[10px] text-slate-500">
                Authorized Signatory &amp; Cashier Stamp
              </div>
            </div>
          </div>

        </div>

        {/* Hidden 80mm Thermal Receipt Version for Thermal Printers */}
        <div id="printable-rate-lock-thermal" className="hidden printable-document printable-thermal bg-white text-black p-4 font-mono text-[11px] space-y-2 border border-slate-300">
          <div className="text-center space-y-0.5 border-b border-dashed border-black pb-2">
            <h4 className="font-bold text-sm">{tenant?.name || 'A3 LUXURY JEWELLERS'}</h4>
            <p className="text-[10px]">{tenant?.phone || '+91 98200 12345'}</p>
            <div className="font-bold text-xs pt-1 uppercase">Gold Rate Lock Receipt</div>
          </div>
          <div className="text-[10px] space-y-0.5 border-b border-dashed border-black pb-1.5">
            <div>Ref: {booking.id}</div>
            <div>Date: {booking.bookingDate || new Date().toLocaleDateString()}</div>
            <div>Customer: {booking.customer?.name} ({booking.customer?.phone})</div>
            <div>Target Delivery: {booking.deliveryDate}</div>
          </div>
          <div className="space-y-1 border-b border-dashed border-black pb-2 text-[10px]">
            <div className="flex justify-between">
              <span>Purity:</span>
              <span className="font-bold">{booking.bookingPurity || '22K'}</span>
            </div>
            <div className="flex justify-between">
              <span>Locked Rate:</span>
              <span className="font-bold">₹{booking.lockedRate}/g</span>
            </div>
            <div className="flex justify-between">
              <span>Booked Weight:</span>
              <span className="font-bold">{parseFloat(booking.targetGrams || 0).toFixed(3)}g</span>
            </div>
            <div className="flex justify-between">
              <span>Metal Value:</span>
              <span>₹{Math.round(totalBookingValue).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-bold text-xs pt-1 border-t border-black">
              <span>ADVANCE PAID:</span>
              <span>₹{parseFloat(booking.advanceDeposit || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Balance Due:</span>
              <span>₹{Math.round(balancePayable).toLocaleString('en-IN')}*</span>
            </div>
          </div>
          <div className="text-center pt-2 text-[9px]">
            <p>*Rate locked until {booking.deliveryDate}</p>
            <p className="mt-1">Authorized Signatory</p>
          </div>
        </div>

      </div>
    </div>
  );
};
