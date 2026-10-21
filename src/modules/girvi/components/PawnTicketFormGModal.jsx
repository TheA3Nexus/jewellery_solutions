import React from 'react';
import { Printer, X, ShieldCheck } from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const PawnTicketFormGModal = ({ loan, onClose }) => {
  const { tenant } = useTenant();
  if (!loan) return null;

  const item = loan.pledgedItems?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
              Statutory Pawn Ticket &bull; Form G &amp; Form 8
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="btn-primary py-1.5 px-3 text-xs font-sans font-bold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Form G</span>
            </button>
            <button onClick={onClose} className="text-surface-400 hover:text-surface-100 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form G Layout (Paper Style) */}
        <div className="bg-white text-black p-6 rounded-xl font-mono text-[11px] space-y-3 border border-slate-300">
          
          <div className="text-center space-y-1 border-b-2 border-black pb-2">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-800">SHUBH LABH</div>
            <h2 className="text-base font-bold uppercase tracking-tight text-slate-900">{tenant.name}</h2>
            <p className="text-[10px] text-slate-600">
              {tenant.address} &bull; Phone: {tenant.phone}
            </p>
            <div className="font-bold text-xs pt-1 uppercase tracking-wider">
              PAWN TICKET FORM G [Section 11(b)(i) and Rule(12)]
            </div>
            <p className="text-[9px] text-slate-500">Moneylenders License Reg No: {tenant.bisLicenseNo}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-2 text-[11px]">
            <div>
              <div><strong>Loan Serial No:</strong> {loan.id}</div>
              <div><strong>Pawner (Borrower):</strong> {loan.borrower?.name}</div>
              <div><strong>Address:</strong> {loan.borrower?.address || 'Local Town'}</div>
              <div><strong>Contact:</strong> {loan.borrower?.phone}</div>
            </div>
            <div className="text-right">
              <div><strong>Sanction Date:</strong> {new Date(loan.startDate).toLocaleDateString()}</div>
              <div><strong>Vault / Locker No:</strong> {item?.lockerBoxNo || 'Locker-01'}</div>
              <div><strong>Tenure:</strong> 11 Months</div>
            </div>
          </div>

          {/* Table of Pledged Articles */}
          <div className="border border-slate-300 rounded overflow-hidden">
            <table className="w-full text-left text-[10px]">
              <thead className="bg-slate-100 text-slate-800 uppercase border-b border-slate-300 font-bold">
                <tr>
                  <th className="p-2">Article Description</th>
                  <th className="p-2 text-right">Gross (g)</th>
                  <th className="p-2 text-right">Net Wt (g)</th>
                  <th className="p-2 text-right">Tunch %</th>
                  <th className="p-2 text-right">Pure Gold (g)</th>
                  <th className="p-2 text-right">Valuation (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 font-bold">{item?.description}</td>
                  <td className="p-2 text-right">{item?.grossWeight?.toFixed(3)}</td>
                  <td className="p-2 text-right font-bold">{item?.netWeight?.toFixed(3)}</td>
                  <td className="p-2 text-right">{item?.purityPercent}%</td>
                  <td className="p-2 text-right font-bold">{item?.fineWeight?.toFixed(3)}</td>
                  <td className="p-2 text-right font-bold text-slate-900">
                    ₹{item?.marketValuation?.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex justify-between font-bold text-xs text-slate-900">
              <span>PRINCIPAL AMOUNT ADVANCED:</span>
              <span>₹{loan.principalAmount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-700">
              <span>Agreed Interest Rate:</span>
              <span>{loan.interestRateMonthly}% Monthly ({loan.interestRateMonthly * 12}% Annually)</span>
            </div>
          </div>

          {/* Statutory Terms & Conditions */}
          <div className="text-[9px] text-slate-600 space-y-1 border-t border-slate-200 pt-2 font-sans">
            <p className="font-bold uppercase text-slate-800">Statutory Notice under Section 11 &amp; Rule 12:</p>
            <p>1. The pledged articles must be redeemed within 11 months from the date of loan sanction.</p>
            <p>2. Failure to pay monthly interest or clear principal within 11 months shall empower the pawnbroker to issue statutory notices and put the articles to public auction.</p>
            <p>3. Pledged gold is insured in fire-proof locker vaults.</p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-4 pt-6 text-[10px] text-slate-800 border-t border-slate-300">
            <div>
              <div className="h-6"></div>
              <div className="border-t border-slate-400 pt-1 font-bold inline-block">
                Customer (Pawner) Signature
              </div>
            </div>
            <div className="text-right">
              <div className="h-6"></div>
              <div className="border-t border-slate-400 pt-1 font-bold inline-block">
                For {tenant.name} (Pawnbroker)
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};