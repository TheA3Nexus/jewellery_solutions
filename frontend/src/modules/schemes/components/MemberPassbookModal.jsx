import React from 'react';
import { 
  BookOpen, 
  Printer, 
  MessageCircle, 
  X, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Gift, 
  ShieldCheck 
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const MemberPassbookModal = ({ subscription, onClose, onPayInstallment }) => {
  const { tenant } = useTenant();
  if (!subscription) return null;

  const totalPaid = (subscription.paidInstallments || []).length;
  const isMatured = totalPaid >= subscription.tenureMonths;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Digital Passbook &bull; {subscription.schemeName}
              </h3>
              <p className="text-[11px] text-surface-400 font-mono">
                Member: {subscription.customerName} ({subscription.phone}) &bull; Token #{subscription.tokenNo}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-surface-950 border border-surface-800 text-xs font-mono">
          <div>
            <span className="text-surface-400 text-[10px] block">Monthly EMI</span>
            <strong className="text-surface-100">₹{subscription.monthlyEmi.toLocaleString('en-IN')}</strong>
          </div>
          <div>
            <span className="text-surface-400 text-[10px] block">Total Deposited</span>
            <strong className="text-emerald-400">₹{(totalPaid * subscription.monthlyEmi).toLocaleString('en-IN')}</strong>
          </div>
          <div>
            <span className="text-surface-400 text-[10px] block">Jeweller Bonus</span>
            <strong className="text-brand-300 font-bold">+₹{subscription.bonusAmount.toLocaleString('en-IN')}</strong>
          </div>
          <div className="bg-surface-900 p-1.5 rounded border border-surface-700/60">
            <span className="text-brand-400 text-[10px] block font-semibold">Maturity Value</span>
            <strong className="text-brand-300 text-sm font-bold">
              ₹{(subscription.tenureMonths * subscription.monthlyEmi + subscription.bonusAmount).toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        {/* Installments Ledger Table */}
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
                      {isPaid ? (paymentInfo?.date || new Date().toLocaleDateString()) : '—'}
                    </td>
                    <td className="p-2.5 text-center">
                      {isPaid ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 inline-flex items-center gap-1">
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
                          onClick={() => onPayInstallment(subscription.id, instNum)}
                          className="btn-primary py-0.5 px-2 text-[10px] font-sans mx-auto"
                        >
                          Collect EMI
                        </button>
                      )}
                      {isPaid && (
                        <button
                          type="button"
                          onClick={() => alert(`Reprinting 80mm thermal receipt for Installment #${instNum}`)}
                          className="btn-secondary py-0.5 px-2 text-[10px] font-sans mx-auto"
                        >
                          Receipt
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
                <td className="p-2.5 text-brand-400">Jeweller Contribution</td>
                <td colSpan={2} className="p-2.5 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-sans bg-brand-500 text-surface-950 font-bold">
                    FREE BONUS
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BUDS Act 2019 Statutory Legal Guardrail Footer */}
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
            onClick={() => window.print()}
            className="btn-secondary flex-1 py-2 text-xs font-sans"
          >
            <Printer className="w-4 h-4" />
            <span>Print Passbook Copy</span>
          </button>

          <button
            type="button"
            onClick={() => alert(`Passbook statement & UPI Autopay link sent to ${subscription.phone}`)}
            className="btn-primary flex-1 py-2 text-xs font-sans font-bold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send WhatsApp Passbook</span>
          </button>
        </div>

      </div>
    </div>
  );
};