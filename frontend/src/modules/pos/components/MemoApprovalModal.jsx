import React, { useState } from 'react';
import { 
  FileCheck, 
  X, 
  Search, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const MemoApprovalModal = ({ isOpen, onClose, onSaveMemo }) => {
  const { tenant } = useTenant();

  const [customer, setCustomer] = useState({
    name: 'Mrs. Sunita Khandelwal',
    phone: '+91 98200 44551',
    address: 'Pedder Road, Mumbai'
  });

  const [returnDueDate, setReturnDueDate] = useState(
    new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
  );

  const [items, setItems] = useState([
    {
      id: 'MEM-ITM-1',
      name: '22K Handcrafted Calcutta Kada Bangles (Pair)',
      barcode: '101004',
      purity: '22K (91.6%)',
      grossWeight: 45.200,
      approxValue: 366000
    },
    {
      id: 'MEM-ITM-2',
      name: '18K Diamond Solitaire Halo Engagement Ring',
      barcode: '101001',
      purity: '18K (75.0%)',
      grossWeight: 4.850,
      approxValue: 112000
    }
  ]);

  if (!isOpen) return null;

  const totalApproxValue = items.reduce((sum, i) => sum + i.approxValue, 0);
  const totalWeight = items.reduce((sum, i) => sum + i.grossWeight, 0);

  const handleCreateMemo = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one item for approval.');
      return;
    }

    onSaveMemo({
      id: `MEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      customer,
      items,
      returnDueDate,
      createdAt: new Date().toISOString().split('T')[0],
      totalApproxValue,
      status: 'PENDING_DECISION'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Issue Jewelry on Approval (Memo / Jangad Slip)
              </h3>
              <p className="text-[11px] text-surface-400">
                Rule 55 CGST Delivery Challan for goods sent for customer inspection and selection.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateMemo} className="space-y-4 text-xs">
          {/* Customer & Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-950 p-4 rounded-xl border border-surface-800">
            <div>
              <label className="block text-surface-400 font-medium mb-1">Customer Details</label>
              <div className="font-semibold text-surface-100">{customer.name}</div>
              <div className="text-surface-400 font-mono text-[11px]">{customer.phone} &bull; {customer.address}</div>
            </div>
            <div>
              <label className="block text-surface-400 font-medium mb-1">Return Due Date</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                <input
                  type="date"
                  value={returnDueDate}
                  onChange={(e) => setReturnDueDate(e.target.value)}
                  className="bg-surface-900 border border-surface-700 rounded-lg px-2.5 py-1 text-surface-100 font-mono text-xs focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Items On Memo Table */}
          <div className="border border-surface-800 rounded-xl overflow-hidden">
            <div className="p-3 bg-surface-950 flex justify-between items-center text-xs border-b border-surface-800">
              <span className="font-bold text-surface-200 uppercase tracking-wider">
                Articles Dispatched for Approval ({items.length})
              </span>
              <span className="font-mono text-brand-400 font-bold">
                Total Approx: ₹{totalApproxValue.toLocaleString('en-IN')}
              </span>
            </div>

            <table className="w-full text-left text-xs text-surface-300">
              <thead className="bg-surface-950/60 text-surface-400 font-semibold uppercase tracking-wider text-[11px] border-b border-surface-800 font-sans">
                <tr>
                  <th className="px-3 py-2">Article Name</th>
                  <th className="px-3 py-2">Purity</th>
                  <th className="px-3 py-2 text-right">Gross Wt</th>
                  <th className="px-3 py-2 text-right">Approx Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60 font-mono">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-800/40">
                    <td className="px-3 py-2 font-sans font-medium text-surface-100">{item.name}</td>
                    <td className="px-3 py-2 text-amber-400">{item.purity}</td>
                    <td className="px-3 py-2 text-right">{item.grossWeight.toFixed(3)} g</td>
                    <td className="px-3 py-2 text-right font-bold text-surface-100">
                      ₹{item.approxValue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-surface-950/60 rounded-xl border border-surface-800 flex items-center justify-between text-xs text-surface-400">
            <span>Stock will remain tagged as <strong>ON_APPROVAL</strong> until customer returns or purchases.</span>
            <span className="font-mono text-surface-200">Total Wt: {totalWeight.toFixed(3)} g</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-surface-800 hover:bg-surface-700 text-surface-300 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> Issue Approval Challan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
