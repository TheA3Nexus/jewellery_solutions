import React, { useState } from 'react';
import { 
  Bookmark, 
  X, 
  Coins, 
  IndianRupee, 
  Calendar, 
  CheckCircle2, 
  Printer, 
  Lock 
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const AdvanceGoldBookingModal = ({ isOpen, onClose, onSaveBooking }) => {
  const { tenant, bullionRates } = useTenant();

  const [customer, setCustomer] = useState({
    name: 'Mrs. Rekha Singhal',
    phone: '+91 98370 55667',
    city: 'Agra'
  });

  const [bookingPurity, setBookingPurity] = useState('22K');
  const [lockedRate, setLockedRate] = useState(bullionRates.gold22k || 7196);
  const [targetGrams, setTargetGrams] = useState('50.000');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]
  );
  const [advanceDeposit, setAdvanceDeposit] = useState('100000');
  const [paymentMode, setPaymentMode] = useState('BANK_NEFT');

  if (!isOpen) return null;

  const totalBookingValue = (parseFloat(targetGrams) || 0) * lockedRate;
  const advancePercent = totalBookingValue > 0 ? ((parseFloat(advanceDeposit) || 0) / totalBookingValue) * 100 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const gms = parseFloat(targetGrams);
    const dep = parseFloat(advanceDeposit);

    if (isNaN(gms) || gms <= 0 || isNaN(dep) || dep <= 0) {
      alert('Please enter valid booking grams and advance deposit.');
      return;
    }

    onSaveBooking({
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      customer,
      bookingPurity,
      lockedRate,
      targetGrams: gms,
      totalBookingValue,
      advanceDeposit: dep,
      paymentMode,
      deliveryDate,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE_LOCKED'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Advance Gold Rate Booking (Rate Lock)
              </h3>
              <p className="text-[11px] text-surface-400">
                Lock today's gold rate against cash/bank deposit for future wedding deliveries.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Customer */}
          <div className="bg-surface-950 p-3.5 rounded-xl border border-surface-800 space-y-2">
            <span className="font-semibold text-surface-300 block text-[11px] uppercase tracking-wider">
              Customer Profile
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-surface-400 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full bg-surface-900 border border-surface-700 rounded-lg px-2.5 py-1.5 text-surface-100 font-semibold"
                />
              </div>
              <div>
                <label className="block text-surface-400 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full bg-surface-900 border border-surface-700 rounded-lg px-2.5 py-1.5 text-surface-100 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Rate & Grams Lock Matrix */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-surface-400 mb-1">Locked Rate (₹ / g)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-500 font-mono">₹</span>
                <input
                  type="number"
                  value={lockedRate}
                  onChange={(e) => setLockedRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-surface-950 border border-amber-500/40 rounded-lg pl-6 pr-2 py-1.5 text-amber-400 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-surface-400 mb-1">Booking Weight (Grams)</label>
              <input
                type="number"
                step="0.001"
                value={targetGrams}
                onChange={(e) => setTargetGrams(e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-2.5 py-1.5 text-surface-100 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-surface-400 mb-1">Delivery Target Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-2 py-1.5 text-surface-100 font-mono"
              />
            </div>
          </div>

          {/* Advance Deposit Collection */}
          <div className="bg-surface-950 p-4 rounded-xl border border-surface-800 space-y-3 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-surface-400 font-sans">Total Estimated Metal Value:</span>
              <span className="font-bold text-surface-100">₹{Math.round(totalBookingValue).toLocaleString('en-IN')}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-800">
              <div>
                <label className="block text-surface-400 mb-1 font-sans">Advance Deposit Collected (₹)</label>
                <input
                  type="number"
                  value={advanceDeposit}
                  onChange={(e) => setAdvanceDeposit(e.target.value)}
                  className="w-full bg-surface-900 border border-surface-700 rounded-lg px-2.5 py-1.5 text-emerald-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-surface-400 mb-1 font-sans">Payment Channel</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full bg-surface-900 border border-surface-700 rounded-lg px-2.5 py-1.5 text-surface-200"
                >
                  <option value="BANK_NEFT">Bank RTGS / NEFT</option>
                  <option value="UPI">UPI Dynamic QR</option>
                  <option value="CHEQUE">Cheque / Demand Draft</option>
                  <option value="CASH">Cash (under ₹2 Lakh)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between text-[11px] pt-1">
              <span className="text-surface-400 font-sans">Deposit Ratio:</span>
              <span className="text-brand-400 font-bold">{advancePercent.toFixed(1)}% of total order</span>
            </div>
          </div>

          {/* Action */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-surface-800 hover:bg-surface-700 text-surface-300 rounded-xl font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Lock className="w-4 h-4" /> Issue Rate Lock Slip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
