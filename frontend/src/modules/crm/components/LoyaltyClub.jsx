import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  Gift, 
  CreditCard, 
  CheckCircle2, 
  Star, 
  IndianRupee, 
  Users, 
  Crown 
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const LoyaltyClub = () => {
  const { tenant } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerForCard, setSelectedCustomerForCard] = useState(null);

  // VIP & Loyalty Members
  const [members, setMembers] = useState([
    {
      id: 'MEM-001',
      name: 'Mrs. Ananya Verma',
      phone: '+91 98201 12345',
      tier: 'IMPERIAL_PLATINUM',
      lifetimeSpend: 1450000,
      pointsBalance: 1450, // ₹14,500 value
      joinedDate: '2024-03-15',
      lastVisit: '2026-10-21'
    },
    {
      id: 'MEM-002',
      name: 'Rohan Mehta',
      phone: '+91 98991 44556',
      tier: 'GOLD_SOVEREIGN',
      lifetimeSpend: 480000,
      pointsBalance: 480, // ₹4,800 value
      joinedDate: '2025-01-10',
      lastVisit: '2026-10-21'
    },
    {
      id: 'MEM-003',
      name: 'Kavita Joshi',
      phone: '+91 98110 99887',
      tier: 'SILVER_PRIVILEGE',
      lifetimeSpend: 125000,
      pointsBalance: 125, // ₹1,250 value
      joinedDate: '2025-08-20',
      lastVisit: '2026-10-20'
    },
    {
      id: 'MEM-004',
      name: 'Suresh Kumar Agrawal',
      phone: '+91 94140 22334',
      tier: 'GOLD_SOVEREIGN',
      lifetimeSpend: 620000,
      pointsBalance: 620, // ₹6,200 value
      joinedDate: '2024-11-05',
      lastVisit: '2026-10-15'
    }
  ]);

  const filteredMembers = members.filter((m) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.tier.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRedeem = (member) => {
    alert(`Redeemed 100 loyalty points (₹1,000 credit) for ${member.name}. Applicable on next POS invoice.`);
  };

  return (
    <div className="space-y-6">
      {/* Tier Benefits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Silver Privilege */}
        <div className="bg-surface-900 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <Star className="w-4 h-4 text-slate-400" />
                Silver Privilege Club
              </span>
              <span className="text-[10px] text-surface-400 font-mono">Spend &gt; ₹50k</span>
            </div>
            <ul className="text-xs text-surface-400 space-y-1">
              <li>&bull; 1 Loyalty Point per ₹1,000 spent</li>
              <li>&bull; Complimentary annual ultrasonic cleaning</li>
              <li>&bull; Priority festive preview access</li>
            </ul>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-800 text-[11px] text-surface-500 font-mono">
            Redemption Value: 1 Pt = ₹10
          </div>
        </div>

        {/* Gold Sovereign */}
        <div className="bg-surface-900 border border-brand-500/30 rounded-xl p-4 flex flex-col justify-between bg-brand-50/40">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-brand-600 uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-500" />
                Gold Sovereign Club
              </span>
              <span className="text-[10px] text-brand-600 font-mono">Spend &gt; ₹2 Lakh</span>
            </div>
            <ul className="text-xs text-surface-300 space-y-1">
              <li>&bull; 1.5 Loyalty Points per ₹1,000 spent</li>
              <li>&bull; Free rhodium polish on diamond jewellery</li>
              <li>&bull; 15% Birthday Making Charge discount</li>
            </ul>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-800 text-[11px] text-amber-400/80 font-mono">
            Fast-Track VIP Bridal Appointments
          </div>
        </div>

        {/* Imperial Platinum VIP */}
        <div className="bg-surface-900 border border-purple-500/30 rounded-xl p-4 flex flex-col justify-between bg-purple-950/5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-purple-400" />
                Imperial Platinum VIP
              </span>
              <span className="text-[10px] text-purple-300 font-mono">Spend &gt; ₹10 Lakh</span>
            </div>
            <ul className="text-xs text-surface-300 space-y-1">
              <li>&bull; 2 Loyalty Points per ₹1,000 spent</li>
              <li>&bull; Private VIP Bridal Salon consultation</li>
              <li>&bull; Zero making charges on pure silver coins</li>
            </ul>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-800 text-[11px] text-purple-400/80 font-mono">
            Dedicated Concierge Relationship Manager
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-surface-800 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" />
            Loyalty Club Members Directory ({members.length})
          </h3>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input
              type="text"
              placeholder="Search member, phone, tier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface-950 border border-surface-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500 w-56"
            />
          </div>
        </div>

        <table className="w-full text-left text-xs text-surface-300">
          <thead className="bg-surface-950 text-surface-400 font-semibold uppercase tracking-wider text-[11px] border-b border-surface-800 font-sans">
            <tr>
              <th className="px-4 py-3">Member &amp; Mobile</th>
              <th className="px-4 py-3 text-center">Club Membership Tier</th>
              <th className="px-4 py-3 text-right">Lifetime Showroom Spend</th>
              <th className="px-4 py-3 text-right text-brand-400">Points Balance</th>
              <th className="px-4 py-3 text-right text-emerald-400">Cash Value (₹)</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/60 font-mono">
            {filteredMembers.map((m) => (
              <tr key={m.id} className="hover:bg-surface-800/40">
                <td className="px-4 py-3 font-sans">
                  <div className="font-semibold text-surface-100">{m.name}</div>
                  <div className="text-[11px] text-surface-500 font-mono">{m.phone}</div>
                </td>
                <td className="px-4 py-3 text-center font-sans">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      m.tier === 'IMPERIAL_PLATINUM'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                        : m.tier === 'GOLD_SOVEREIGN'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-500/10 text-slate-300 border border-slate-500/30'
                    }`}
                  >
                    {m.tier.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-surface-200">
                  ₹{m.lifetimeSpend.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-right font-bold text-brand-400 text-sm">
                  {m.pointsBalance} Pts
                </td>
                <td className="px-4 py-3 text-right font-bold text-emerald-400 text-sm">
                  ₹{(m.pointsBalance * 10).toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-right font-sans whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleRedeem(m)}
                      className="px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Gift className="w-3 h-3" /> Redeem
                    </button>
                    <button
                      onClick={() => setSelectedCustomerForCard(m)}
                      className="p-1 rounded bg-surface-800 hover:bg-surface-700 text-surface-300 border border-surface-700 transition-colors"
                      title="View Digital VIP Card"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Digital VIP Membership Card Modal */}
      {selectedCustomerForCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            {/* VIP Card Representation */}
            <div className="w-full aspect-[1.58/1] rounded-2xl p-5 bg-gradient-to-tr from-slate-950 via-slate-900 to-brand-900/60 border border-brand-500/40 shadow-xl flex flex-col justify-between text-left relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-amber-400 font-bold font-mono">
                    VIP Privilege Pass
                  </span>
                  <h4 className="font-black text-sm uppercase text-surface-100 mt-0.5">
                    {tenant.name}
                  </h4>
                </div>
                <Crown className="w-6 h-6 text-amber-400" />
              </div>

              <div>
                <div className="text-[11px] font-mono text-surface-400">Cardholder:</div>
                <div className="text-base font-bold text-surface-100 tracking-wide font-sans">
                  {selectedCustomerForCard.name}
                </div>
                <div className="text-xs font-mono text-brand-300 font-bold">
                  {selectedCustomerForCard.tier.replace('_', ' ')}
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-surface-800/80 pt-2 font-mono text-[10px] text-surface-400">
                <span>ID: {selectedCustomerForCard.id}</span>
                <span className="text-emerald-400 font-bold">
                  Points: {selectedCustomerForCard.pointsBalance}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedCustomerForCard(null)}
              className="w-full py-2 bg-surface-800 hover:bg-surface-700 text-surface-200 text-xs font-semibold rounded-lg border border-surface-700"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
