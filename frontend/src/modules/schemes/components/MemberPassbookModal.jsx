import React, { useState } from 'react';
import { printA4 } from '../../../utils/printService';
import { 
  BookOpen, 
  Printer, 
  MessageCircle, 
  X, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Gift, 
  ShieldCheck,
  Building2,
  Trophy,
  Receipt
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const MemberPassbookModal = ({ 
  subscription, 
  onClose, 
  onPayInstallment,
  onOpenMaturity
}) => {
  const { tenant } = useTenant();
  const [activeReceiptInstallment, setActiveReceiptInstallment] = useState(null);

  if (!subscription) return null;

  const totalPaid = (subscription.paidInstallments || []).length;
  const isMatured = totalPaid >= subscription.tenureMonths;
  const totalDeposited = totalPaid * subscription.monthlyEmi;
  const maturityValue = subscription.tenureMonths * subscription.monthlyEmi + subscription.bonusAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider font-sans">
                Digital Passbook &bull; {subscription.schemeName}
              </h3>
              <p className="text-[11px] text-surface-400 font-mono">
                Member: {subscription.customerName} ({subscription.phone}) &bull; Token #{subscription.tokenNo}
              </p>
            </div>
          </div>
          <button
            data-testid="close-modal-btn"
            onClick={onClose}
            className="text-surface-400 hover:text-surface-100 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-surface-950 border border-surface-800 text-xs font-mono">
          <div>
            <span className="text-surface-400 text-[10px] block font-sans">Monthly EMI</span>
            <strong className="text-surface-100">₹{subscription.monthlyEmi.toLocaleString('en-IN')}</strong>
          </div>
          <div>
            <span className="text-surface-400 text-[10px] block font-sans">Total Deposited</span>
            <strong id="stat-passbook-deposited" className="text-emerald-400">
              ₹{totalDeposited.toLocaleString('en-IN')}
            </strong>
          </div>
          <div>
            <span className="text-surface-400 text-[10px] block font-sans">Jeweller Bonus</span>
            <strong className="text-brand-300 font-bold">+₹{subscription.bonusAmount.toLocaleString('en-IN')}</strong>
          </div>
          <div className="bg-surface-900 p-1.5 rounded border border-surface-700/60">
            <span className="text-brand-400 text-[10px] block font-semibold font-sans">Maturity Value</span>
            <strong id="stat-passbook-maturity" className="text-brand-300 text-sm font-bold">
              ₹{maturityValue.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        {/* Maturity Ready Banner if 11 installments completed */}
        {isMatured && (
          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-brand-400 shrink-0" />
              <div>
                <span className="font-bold text-surface-100 block font-sans">
                  All 11 Installments Completed! Scheme is Matured.
                </span>
                <span className="text-[11px] text-surface-400">
                  Total credit ₹{maturityValue.toLocaleString('en-IN')} is ready for jewellery billing.
                </span>
              </div>
            </div>
            <button
              id="btn-open-maturity-modal"
              onClick={() => onOpenMaturity?.(subscription)}
              className="btn-primary py-1.5 px-3 text-xs font-bold"
            >
              Maturity Certificate
            </button>
          </div>
        )}

        {/* Installments Ledger Table UI */}
        <div className="border border-surface-800 rounded-lg overflow-hidden font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-surface-950 text-surface-400 text-[10px] uppercase border-b border-surface-800 font-sans">
              <tr>
                <th className="p-2.5">Instalment #</th>
                <th className="p-2.5">Due Date</th>
                <th className="p-2.5 text-right">Amount (₹)</th>
                <th className="p-2.5">Payment Date</th>
                <th className="p-2.5 text-center">Status</th>
                <th className="p-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60">
              {Array.from({ length: subscription.tenureMonths }).map((_, idx) => {
                const instNum = idx + 1;
                const isPaid = instNum <= totalPaid;
                const paymentInfo = subscription.paidInstallments?.[idx];

                // Simulated due dates
                const dueDate = new Date();
                dueDate.setMonth(dueDate.getMonth() + idx - totalPaid);

                return (
                  <tr key={instNum} className="hover:bg-surface-850/40 transition">
                    <td className="p-2.5 font-bold text-surface-200">
                      EMI {instNum.toString().padStart(2, '0')}
                    </td>
                    <td className="p-2.5 text-surface-400">{dueDate.toLocaleDateString()}</td>
                    <td className="p-2.5 text-right font-bold text-surface-100">
                      ₹{subscription.monthlyEmi.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2.5 text-surface-300">
                      {isPaid ? (paymentInfo?.date || new Date().toLocaleDateString('en-IN')) : '—'}
                    </td>
                    <td className="p-2.5 text-center">
                      {isPaid ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Paid</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-surface-800 text-surface-400">
                          Due
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      {!isPaid && instNum === totalPaid + 1 && (
                        <button
                          type="button"
                          id="btn-collect-next-emi"
                          onClick={() => onPayInstallment(subscription.id, instNum)}
                          className="btn-primary py-0.5 px-2.5 text-[10px] font-sans mx-auto font-bold shadow-sm"
                        >
                          Collect EMI
                        </button>
                      )}
                      {isPaid && (
                        <button
                          type="button"
                          onClick={() => printA4('printable-passbook-sheet', `Passbook_${subscription.tokenNo}`)}
                          className="btn-secondary py-0.5 px-2 text-[10px] font-sans mx-auto text-surface-300 hover:text-surface-100"
                        >
                          Print Slip
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* 12th Month Bonus Row */}
              <tr className="bg-brand-950/20 font-bold border-t border-brand-500/30">
                <td className="p-2.5 text-brand-300">Bonus EMI (12th)</td>
                <td className="p-2.5 text-brand-400">Maturity Date</td>
                <td className="p-2.5 text-right text-brand-300">
                  ₹{subscription.bonusAmount.toLocaleString('en-IN')}
                </td>
                <td className="p-2.5 text-brand-400 font-sans">Jeweller Contribution</td>
                <td colSpan={2} className="p-2.5 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-sans bg-brand-500 text-slate-950 font-black">
                    FREE BONUS
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BUDS Act 2019 Legal Shield */}
        <div className="p-3 rounded-lg bg-surface-950 border border-surface-800 text-[10px] text-surface-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>BUDS Act 2019 Legal Compliance:</strong> This savings scheme is strictly an advance payment towards the purchase of physical gold/silver jewelry to be delivered within 365 days. Cash refunds are legally prohibited; accumulated maturity must be redeemed at the billing counter.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2 border-t border-surface-800">
          <button
            type="button"
            id="btn-print-passbook"
            onClick={() => printA4('printable-passbook-sheet', `Passbook_${subscription.tokenNo || 'SCHEME'}`)}
            className="btn-secondary flex-1 py-2 text-xs font-sans flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Passbook Copy</span>
          </button>

          <button
            type="button"
            onClick={() => alert(`Passbook statement & UPI Autopay link sent to ${subscription.phone}`)}
            className="btn-primary flex-1 py-2 text-xs font-sans font-bold flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send WhatsApp Passbook</span>
          </button>
        </div>

        {/* DEDICATED PURE-PAPER A4 PRINTABLE PASSBOOK SHEET CONTAINER */}
        <div
          id="printable-passbook-sheet"
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
                GSTIN: <strong>{tenant?.gstin || '27AAACA1234A1Z5'}</strong> &bull; Phone: {tenant?.phone || '+91 98200 12345'}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded">
                SWARNA NIDHI PASSBOOK &bull; स्वर्ण निधि पासबुक
              </div>
              <div className="text-[11px] font-mono text-slate-700 mt-1">
                Passbook No: <strong>{subscription.passbookNo || `PB-2026-${subscription.tokenNo?.padStart(4, '0')}`}</strong>
              </div>
              <div className="text-[10px] font-semibold text-slate-500">
                Token Ref: #{subscription.tokenNo} &bull; BUDS Act 2019 Compliant
              </div>
            </div>
          </div>

          {/* Member & Plan Details Box */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-[11px] font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Account Holder Name:</span>
              <strong className="text-slate-900 font-sans text-sm">{subscription.customerName}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Registered Phone:</span>
              <strong className="text-slate-900">{subscription.phone}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Scheme Plan:</span>
              <strong className="text-slate-900 font-sans">{subscription.schemeName}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Joining Gift Received:</span>
              <strong className="text-slate-900 font-sans">{subscription.joiningGift || '10g 999 Fine Silver Coin'}</strong>
            </div>
          </div>

          {/* Key Financial Metric Badges */}
          <div className="grid grid-cols-4 gap-3 text-center border border-slate-200 p-2.5 rounded bg-slate-50 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block text-[9px] font-sans uppercase">Monthly Installment</span>
              <strong className="text-slate-950">₹{subscription.monthlyEmi.toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] font-sans uppercase">Total Deposited</span>
              <strong className="text-emerald-800">₹{totalDeposited.toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] font-sans uppercase">Free Bonus Month</span>
              <strong className="text-slate-950">+₹{subscription.bonusAmount.toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] font-sans uppercase">Maturity Value</span>
              <strong className="text-slate-950 text-sm">₹{maturityValue.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Passbook Ledger Table */}
          <table className="w-full text-left text-[11px] border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-slate-800 font-sans">
              <tr>
                <th className="p-2 border-r border-slate-300">EMI #</th>
                <th className="p-2 border-r border-slate-300">Due Date</th>
                <th className="p-2 border-r border-slate-300 text-right">Amount (₹)</th>
                <th className="p-2 border-r border-slate-300">Payment Date</th>
                <th className="p-2 border-r border-slate-300 text-center">Status</th>
                <th className="p-2 text-center">Cashier Stamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {Array.from({ length: subscription.tenureMonths }).map((_, idx) => {
                const instNum = idx + 1;
                const isPaid = instNum <= totalPaid;
                const paymentInfo = subscription.paidInstallments?.[idx];

                const dueDate = new Date();
                dueDate.setMonth(dueDate.getMonth() + idx - totalPaid);

                return (
                  <tr key={instNum} className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-300 font-bold">EMI {instNum.toString().padStart(2, '0')}</td>
                    <td className="p-2 border-r border-slate-300">{dueDate.toLocaleDateString()}</td>
                    <td className="p-2 border-r border-slate-300 text-right font-bold">
                      ₹{subscription.monthlyEmi.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-sans">
                      {isPaid ? (paymentInfo?.date || new Date().toLocaleDateString('en-IN')) : '—'}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center font-sans">
                      {isPaid ? (
                        <span className="font-bold text-emerald-800">PAID</span>
                      ) : (
                        <span className="text-slate-400">DUE</span>
                      )}
                    </td>
                    <td className="p-2 text-center font-sans text-[10px] text-slate-600">
                      {isPaid ? 'Verified & Sealed' : '—'}
                    </td>
                  </tr>
                );
              })}

              {/* 12th Month Free Bonus Row */}
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-900">
                <td className="p-2 border-r border-slate-300 text-slate-950 font-sans">12th Month FREE</td>
                <td className="p-2 border-r border-slate-300 font-sans">Maturity Month</td>
                <td className="p-2 border-r border-slate-300 text-right text-slate-950">
                  ₹{subscription.bonusAmount.toLocaleString('en-IN')}
                </td>
                <td className="p-2 border-r border-slate-300 font-sans text-slate-700">Jeweller Bonus Contribution</td>
                <td colSpan={2} className="p-2 text-center font-sans text-emerald-800 font-black">
                  FREE BONUS CREDIT
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-900 font-mono text-[11px]">
              <tr>
                <td colSpan="2" className="p-2 font-sans uppercase">Total Redeemable Jewellery Credit:</td>
                <td className="p-2 text-right text-sm">₹{maturityValue.toLocaleString('en-IN')}</td>
                <td colSpan="3" className="p-2 text-right font-sans text-[10px] text-slate-500">
                  (11 Member EMIs + 1 Jeweller Free Bonus EMI)
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Legal Compliance & Rules */}
          <div className="text-[10px] text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
            <div><strong>Terms &amp; BUDS Act 2019 Undertaking:</strong></div>
            <div>1. Installments are payable on or before the due date of every calendar month.</div>
            <div>2. Accumulated maturity credit can strictly be redeemed against physical gold, diamond, or silver jewellery.</div>
            <div>3. Cash refunds or interest payouts are strictly prohibited under Indian law (BUDS Act 2019).</div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-center text-[10px]">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <span className="font-bold text-slate-800 mt-1 block">Account Holder / Member Signature</span>
              <span className="text-[9px] text-slate-500">Authorized Passbook Signatory</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <span className="font-bold text-slate-800 mt-1 block">For {tenant?.businessName || 'A3 Jewellery'}</span>
              <span className="text-[9px] text-slate-500">Cashier Stamp &amp; Authorized Signatory</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
