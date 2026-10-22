import React from 'react';
import { printA4 } from '../../../utils/printService';
import { 
  Trophy, 
  Printer, 
  X, 
  Gift, 
  CheckCircle2, 
  IndianRupee, 
  ShieldCheck,
  Building2,
  Coins
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const SchemeMaturityModal = ({
  isOpen,
  onClose,
  member,
  onRedeemAtPos
}) => {
  const { tenant } = useTenant();
  if (!isOpen || !member) return null;

  const emi = member.monthlyEmi || 2000;
  const tenure = member.tenureMonths || 11;
  const memberDeposit = tenure * emi;
  const bonusAmount = member.bonusAmount || emi;
  const totalMaturityValue = memberDeposit + bonusAmount;
  const certNo = `MAT-${member.tokenNo}-${Date.now().toString().slice(-4)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider font-sans">
                Scheme Maturity &amp; Jewellery Redemption
              </h3>
              <p className="text-[10px] text-surface-400 font-mono">
                Certificate #{certNo} &bull; Token #{member.tokenNo}
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

        {/* UI Overview */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-amber-500/10 border border-brand-500/30 text-center space-y-2">
          <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider block">
            🎉 Congratulations! 11+1 Plan Successfully Matured
          </span>
          <div className="text-xl font-bold text-surface-100">{member.customerName}</div>
          <div className="text-3xl font-mono font-black text-brand-300">
            ₹{totalMaturityValue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-surface-400">
            Total Purchase Credit Available for 22K/18K Gold &amp; Diamond Jewellery
          </p>
        </div>

        {/* Financial Tally */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-surface-950 p-3 rounded-lg border border-surface-800">
            <span className="text-surface-400 text-[10px] block">Customer 11 EMIs Deposited:</span>
            <strong className="text-surface-100 text-sm">₹{memberDeposit.toLocaleString('en-IN')}</strong>
          </div>
          <div className="bg-surface-950 p-3 rounded-lg border border-brand-500/30">
            <span className="text-brand-400 text-[10px] block">Jeweller 12th Free Bonus Contribution:</span>
            <strong className="text-brand-300 text-sm">+₹{bonusAmount.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Pure-Paper Printable Certificate Container */}
        <div
          id="printable-scheme-maturity-slip"
          className="hidden printable-document printable-a4 bg-white text-slate-950 p-6 rounded-xl border border-slate-300 font-sans text-xs space-y-4"
        >
          {/* Paper Header */}
          <div className="text-center border-b-2 border-slate-900 pb-3">
            <h2 className="text-base font-black tracking-tight text-slate-950 uppercase">
              {tenant?.businessName || 'A3 JEWELLERY & BULLION HOUSE'}
            </h2>
            <p className="text-[10px] text-slate-600 font-medium">
              {tenant?.address || 'Showroom 4, Bullion Exchange Plaza, Zaveri Bazaar, Mumbai - 400002'}
            </p>
            <p className="text-[10px] text-slate-600 font-mono mt-0.5">
              GSTIN: {tenant?.gstin || '27AAACA1234A1Z5'} &bull; Phone: {tenant?.phone || '+91 98200 12345'}
            </p>
            <div className="inline-block mt-2 px-3 py-0.5 border border-slate-900 font-bold uppercase text-[10px] tracking-wider bg-slate-100">
              SCHEME MATURITY REDEMPTION CERTIFICATE / परिपक्वता प्रमाण पत्र
            </div>
          </div>

          {/* Certificate Metadata */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-[11px] font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold font-sans">Certificate Ref:</span>
              <strong className="text-slate-900">{certNo}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold font-sans">Maturity Date:</span>
              <strong className="text-slate-900">{new Date().toLocaleDateString('en-IN')}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold font-sans">Member Name:</span>
              <strong className="text-slate-900 font-sans">{member.customerName}</strong> ({member.phone})
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold font-sans">Token / Passbook:</span>
              <strong className="text-slate-900">Token #{member.tokenNo} &bull; {member.passbookNo || 'PB-2026-0101'}</strong>
            </div>
          </div>

          {/* Tally Breakdown Table */}
          <table className="w-full text-left text-[11px] border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-slate-800">
              <tr>
                <th className="p-2 border-r border-slate-300">Description</th>
                <th className="p-2 border-r border-slate-300 text-center">Tenure</th>
                <th className="p-2 text-right">Credit Value (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              <tr>
                <td className="p-2 border-r border-slate-300 font-sans">
                  Accumulated Member Installments ({member.schemeName})
                </td>
                <td className="p-2 border-r border-slate-300 text-center">11 Months</td>
                <td className="p-2 text-right font-bold">₹{memberDeposit.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-300 font-sans text-emerald-800 font-medium">
                  Showroom Loyalty Contribution (12th Month Free Bonus EMI)
                </td>
                <td className="p-2 border-r border-slate-300 text-center text-emerald-800 font-bold">1 Month FREE</td>
                <td className="p-2 text-right font-bold text-emerald-800">+₹{bonusAmount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-900 font-mono">
              <tr>
                <td colSpan="2" className="p-2 font-sans uppercase">Total Redeemable Jewellery Credit:</td>
                <td className="p-2 text-right text-sm">₹{totalMaturityValue.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          {/* Legal Compliance */}
          <div className="text-[10px] text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
            <strong>BUDS Act 2019 Undertaking:</strong> This certificate represents an advance deposit towards physical jewellery purchase at current live gold rates. Valid for 90 days from maturity date for billing counter deduction.
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-center text-[10px]">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <span className="font-bold text-slate-800 mt-1 block">Member / Customer Signature</span>
              <span className="text-[9px] text-slate-500">I accept the maturity credit towards jewellery purchase</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <span className="font-bold text-slate-800 mt-1 block">For {tenant?.businessName || 'A3 Jewellery'}</span>
              <span className="text-[9px] text-slate-500">Authorised Signatory / Store Manager</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2 border-t border-surface-800">
          <button
            type="button"
            id="btn-print-maturity-cert"
            onClick={() => printA4('printable-scheme-maturity-slip', `Maturity_Certificate_${member.tokenNo}`)}
            className="btn-secondary flex-1 py-2 text-xs font-sans font-medium flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Maturity Certificate</span>
          </button>

          <button
            type="button"
            id="btn-redeem-pos"
            onClick={() => {
              onRedeemAtPos?.(member);
              alert(`₹${totalMaturityValue.toLocaleString('en-IN')} credited to POS Billing Desk for ${member.customerName}`);
              onClose();
            }}
            className="btn-primary flex-1 py-2 text-xs font-sans font-bold flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Redeem at POS Counter</span>
          </button>
        </div>

      </div>
    </div>
  );
};
