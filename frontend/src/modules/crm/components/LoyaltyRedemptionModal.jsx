import React, { useState } from 'react';
import { 
  X, 
  Gift, 
  Printer, 
  CheckCircle2, 
  CreditCard, 
  Award, 
  ShieldCheck, 
  User, 
  Phone 
} from 'lucide-react';
import { printThermal } from '../../../utils/printService';

export const LoyaltyRedemptionModal = ({
  isOpen,
  onClose,
  member,
  tenant,
  onRedeemSuccess
}) => {
  const [pointsToRedeem, setPointsToRedeem] = useState(100);
  const [redemptionSuccess, setRedemptionSuccess] = useState(false);

  if (!isOpen || !member) return null;

  const pointsValueInRupees = (Number(pointsToRedeem) || 0) * 10;
  const remainingPoints = member.pointsBalance - (Number(pointsToRedeem) || 0);
  const voucherNo = `LPT-VCH-${Date.now().toString().slice(-4)}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleConfirmRedeem = () => {
    if (pointsToRedeem <= 0 || pointsToRedeem > member.pointsBalance) {
      alert('Invalid points amount. Must be between 1 and available balance.');
      return;
    }
    setRedemptionSuccess(true);
    onRedeemSuccess(member.id, Number(pointsToRedeem));
  };

  const handlePrintSlip = () => {
    printThermal('printable-loyalty-slip', `Loyalty_Slip_${voucherNo}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-100">
                Redeem VIP Loyalty Points
              </h3>
              <span className="text-[10px] text-surface-400 font-mono">
                Conversion Rate: 1 Point = ₹10.00
              </span>
            </div>
          </div>
          <button
            id="btn-close-redeem-modal"
            onClick={onClose}
            className="p-1 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Summary Card */}
        <div className="bg-surface-950 p-3.5 rounded-xl border border-surface-800 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold text-surface-100 text-sm block">{member.name}</span>
              <span className="text-[11px] text-surface-400 font-mono">{member.phone}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30 font-sans">
              {member.tier.replace('_', ' ')}
            </span>
          </div>

          <div className="pt-2 border-t border-surface-800/80 grid grid-cols-2 gap-2 font-mono">
            <div>
              <span className="text-surface-500 text-[10px] block">Available Points:</span>
              <span className="text-brand-400 font-bold text-sm">{member.pointsBalance} Pts</span>
            </div>
            <div className="text-right">
              <span className="text-surface-500 text-[10px] block">Max Cash Credit:</span>
              <span className="text-emerald-400 font-bold text-sm">₹{(member.pointsBalance * 10).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Form Inputs & Calculations */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] uppercase font-mono text-surface-400 block mb-1">
              Points to Redeem:
            </label>
            <input
              id="input-redeem-points"
              type="number"
              min="1"
              max={member.pointsBalance}
              value={pointsToRedeem}
              onChange={(e) => setPointsToRedeem(Math.min(member.pointsBalance, Math.max(0, parseInt(e.target.value, 10) || 0)))}
              className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono font-bold text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex justify-between items-center text-xs">
            <span className="text-emerald-300 font-semibold">Instant Invoice Credit:</span>
            <span id="stat-redeem-rupee-val" className="text-base font-black text-emerald-400 font-mono">
              ₹{pointsValueInRupees.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between text-[11px] text-surface-400 font-mono px-1">
            <span>Remaining Points Balance:</span>
            <span className="text-surface-200 font-bold">{remainingPoints} Pts</span>
          </div>
        </div>

        {/* Printable Thermal Voucher Slip */}
        <div className="hidden">
          <div id="printable-loyalty-slip" className="printable-document printable-thermal p-2 font-mono text-[10px] text-slate-950">
            <div className="text-center border-b border-dashed border-slate-400 pb-2">
              <h2 className="text-sm font-bold uppercase">{tenant?.name || 'A3 JEWELLERY & SONS'}</h2>
              <p className="text-[9px]">{tenant?.branch || 'Flagship Showroom'}</p>
              <div className="font-bold text-[11px] uppercase mt-1">*** LOYALTY REDEMPTION VOUCHER ***</div>
            </div>
            <div className="space-y-0.5 border-b border-dashed border-slate-400 py-2">
              <div>Voucher No: <span className="font-bold">{voucherNo}</span></div>
              <div>Date &amp; Time: {currentDate} {currentTime}</div>
              <div>Member: <span className="font-bold">{member.name}</span></div>
              <div>Tier: {member.tier.replace('_', ' ')}</div>
            </div>
            <div className="space-y-1 border-b border-dashed border-slate-400 py-2">
              <div className="flex justify-between">
                <span>Points Redeemed:</span>
                <span className="font-bold">{pointsToRedeem} Pts</span>
              </div>
              <div className="flex justify-between font-bold text-xs">
                <span>INVOICE CREDIT APPLIED:</span>
                <span>₹{pointsValueInRupees.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[9px] text-slate-600">
                <span>New Points Balance:</span>
                <span>{remainingPoints} Pts</span>
              </div>
            </div>
            <div className="text-center pt-2 text-[8px] text-slate-600">
              Valid for immediate POS deduction.<br />
              Authorized Cashier Signature: _________
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-2">
          {!redemptionSuccess ? (
            <button
              id="btn-confirm-redeem"
              onClick={handleConfirmRedeem}
              className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm &amp; Apply ₹{pointsValueInRupees.toLocaleString('en-IN')} Discount
            </button>
          ) : (
            <div className="space-y-2 animate-in fade-in">
              <div 
                id="alert-redeem-success"
                className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ₹{pointsValueInRupees.toLocaleString('en-IN')} Discount Applied to Active Bill!
              </div>
              <button
                id="btn-print-loyalty-slip"
                onClick={handlePrintSlip}
                className="w-full py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4 text-brand-400" />
                Print 80mm Redemption Slip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
