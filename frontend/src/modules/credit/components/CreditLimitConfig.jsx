import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  IndianRupee,
  UserX
} from 'lucide-react';

export const CreditLimitConfig = ({ accounts, onUpdateLimit, onToggleBlock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [tempLimit, setTempLimit] = useState('');

  const filtered = accounts.filter((acc) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        acc.customerName.toLowerCase().includes(q) ||
        acc.phone.includes(q) ||
        acc.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStartEdit = (acc) => {
    setEditingId(acc.id);
    setTempLimit(acc.creditLimit.toString());
  };

  const handleSaveEdit = (id) => {
    const limit = parseFloat(tempLimit);
    if (!isNaN(limit) && limit >= 0) {
      onUpdateLimit(id, limit);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Risk Policy Overview */}
      <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brand-400" />
            Credit Ceilings &amp; Default Protection Controls
          </h3>
          <p className="text-xs text-surface-400 mt-1">
            Set maximum credit ceilings per customer. Cashiers cannot complete credit bills exceeding these limits without Admin PIN override.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input
              id="input-search-limits"
              type="text"
              placeholder="Filter customer limits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface-950 border border-surface-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500 w-52"
            />
          </div>
        </div>
      </div>

      {/* Credit Limits Grid Table */}
      <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-surface-300">
          <thead className="bg-surface-950 text-surface-400 font-semibold uppercase tracking-wider text-[11px] border-b border-surface-800 font-sans">
            <tr>
              <th className="px-4 py-3">Customer Identity</th>
              <th className="px-4 py-3 text-right">Current Due (₹)</th>
              <th className="px-4 py-3 text-right">Credit Ceiling (₹)</th>
              <th className="px-4 py-3 text-center">Credit Status</th>
              <th className="px-4 py-3 text-center">Risk Tier</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/60 font-mono">
            {filtered.map((acc) => (
              <tr key={acc.id} id={`row-limit-${acc.id}`} className="hover:bg-surface-800/40">
                <td className="px-4 py-3 font-sans">
                  <div className="font-semibold text-surface-100">{acc.customerName}</div>
                  <div className="text-[11px] text-surface-400 font-mono mt-0.5">
                    {acc.phone} &bull; {acc.city}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-bold text-brand-400">
                  ₹{acc.balanceDue.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-right">
                  {editingId === acc.id ? (
                    <div className="flex items-center justify-end gap-1">
                      <input
                        id={`input-limit-${acc.id}`}
                        type="number"
                        value={tempLimit}
                        onChange={(e) => setTempLimit(e.target.value)}
                        className="w-24 bg-surface-950 border border-surface-600 rounded px-2 py-0.5 text-surface-100 text-right font-bold"
                      />
                      <button
                        id={`btn-save-limit-${acc.id}`}
                        onClick={() => handleSaveEdit(acc.id)}
                        className="px-2 py-0.5 rounded bg-brand-500 text-slate-950 text-[10px] font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <span id={`span-limit-${acc.id}`} className="font-bold text-surface-200">
                      ₹{acc.creditLimit.toLocaleString('en-IN')}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center font-sans">
                  {acc.isBlocked ? (
                    <span id={`badge-block-status-${acc.id}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <Lock className="w-3 h-3" /> Credit Blocked
                    </span>
                  ) : (
                    <span id={`badge-block-status-${acc.id}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Unlock className="w-3 h-3" /> Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center font-sans">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      acc.daysOutstanding > 60
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : acc.daysOutstanding > 30
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                    }`}
                  >
                    {acc.daysOutstanding > 60 ? 'High Risk' : acc.daysOutstanding > 30 ? 'Moderate' : 'VIP / Prime'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-sans whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      id={`btn-edit-limit-${acc.id}`}
                      onClick={() => handleStartEdit(acc)}
                      className="px-2 py-1 rounded bg-surface-800 hover:bg-surface-700 text-surface-300 text-xs font-semibold flex items-center gap-1 border border-surface-700 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" /> Edit Limit
                    </button>
                    <button
                      id={`btn-toggle-block-${acc.id}`}
                      onClick={() => onToggleBlock(acc.id)}
                      className={`px-2 py-1 rounded text-xs font-semibold border transition-colors ${
                        acc.isBlocked
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                      }`}
                    >
                      {acc.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
