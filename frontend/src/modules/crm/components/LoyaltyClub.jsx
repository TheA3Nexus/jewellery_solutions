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
  Crown, 
  Plus, 
  X, 
  QrCode, 
  ShieldCheck, 
  Filter 
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { LoyaltyRedemptionModal } from './LoyaltyRedemptionModal';

export const LoyaltyClub = () => {
  const { tenant } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState('ALL');
  const [selectedCustomerForCard, setSelectedCustomerForCard] = useState(null);
  const [memberForRedemption, setMemberForRedemption] = useState(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

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

  // Form state for adding member
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberTier, setNewMemberTier] = useState('GOLD_SOVEREIGN');
  const [newMemberSpend, setNewMemberSpend] = useState(250000);

  const filteredMembers = members.filter((m) => {
    if (selectedTierFilter !== 'ALL' && m.tier !== selectedTierFilter) return false;
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

  const handleRedeemSuccess = (memberId, pointsDeducted) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, pointsBalance: Math.max(0, m.pointsBalance - pointsDeducted) }
          : m
      )
    );
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName || !newMemberPhone) return;

    const initialPoints = Math.round(newMemberSpend / 1000);
    const newM = {
      id: `MEM-${(members.length + 1).toString().padStart(3, '0')}`,
      name: newMemberName,
      phone: newMemberPhone,
      tier: newMemberTier,
      lifetimeSpend: Number(newMemberSpend) || 0,
      pointsBalance: initialPoints,
      joinedDate: new Date().toISOString().split('T')[0],
      lastVisit: 'Today'
    };

    setMembers([newM, ...members]);
    setIsAddMemberModalOpen(false);
    setNewMemberName('');
    setNewMemberPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              VIP Customer Loyalty Rewards &amp; Point Ledger
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                1 Point = ₹10 Credit
              </span>
            </h2>
            <p className="text-xs text-surface-400">
              Reward repeat patrons, track membership tiers, and issue instant counter point redemptions on POS invoices.
            </p>
          </div>
        </div>

        <button
          id="btn-add-loyalty-member"
          onClick={() => setIsAddMemberModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Enroll New VIP Member
        </button>
      </div>

      {/* Tier Benefits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Silver Privilege */}
        <div className="bg-surface-900 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <Star className="w-4 h-4 text-slate-400" />
                Silver Privilege Club
              </span>
              <span className="text-[10px] text-surface-400 font-mono">Spend &gt; ₹50k</span>
            </div>
            <ul className="text-xs text-surface-300 space-y-1.5 mt-2">
              <li>&bull; 1 Loyalty Point per ₹1,000 spent</li>
              <li>&bull; Complimentary annual ultrasonic jewellery cleaning</li>
              <li>&bull; Priority festive collection preview access</li>
            </ul>
          </div>
          <div className="mt-4 pt-2 border-t border-surface-800 text-[11px] text-surface-400 font-mono flex justify-between">
            <span>Redemption Value:</span>
            <span className="text-brand-400 font-bold">1 Pt = ₹10 Credit</span>
          </div>
        </div>

        {/* Gold Sovereign */}
        <div className="bg-gradient-to-br from-amber-950/20 via-surface-900 to-surface-950 border border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Gold Sovereign Club
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Spend &gt; ₹2 Lakh</span>
            </div>
            <ul className="text-xs text-surface-200 space-y-1.5 mt-2">
              <li>&bull; 1.5 Loyalty Points per ₹1,000 spent</li>
              <li>&bull; Free rhodium polish on diamond jewellery</li>
              <li>&bull; 15% Birthday Making Charge discount coupon</li>
            </ul>
          </div>
          <div className="mt-4 pt-2 border-t border-surface-800 text-[11px] text-amber-400 font-mono flex justify-between">
            <span>VIP Bridal Access:</span>
            <span className="font-bold">Fast-Track Appointments</span>
          </div>
        </div>

        {/* Imperial Platinum VIP */}
        <div className="bg-gradient-to-br from-purple-950/20 via-surface-900 to-surface-950 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-purple-400" />
                Imperial Platinum VIP
              </span>
              <span className="text-[10px] text-purple-300 font-mono">Spend &gt; ₹10 Lakh</span>
            </div>
            <ul className="text-xs text-surface-200 space-y-1.5 mt-2">
              <li>&bull; 2 Loyalty Points per ₹1,000 spent</li>
              <li>&bull; Private VIP Bridal Salon consultation</li>
              <li>&bull; Zero making charges on pure silver bullion coins</li>
            </ul>
          </div>
          <div className="mt-4 pt-2 border-t border-surface-800 text-[11px] text-purple-300 font-mono flex justify-between">
            <span>Dedicated Service:</span>
            <span className="font-bold">Concierge Relationship Mgr</span>
          </div>
        </div>
      </div>

      {/* Filter Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex bg-surface-950 p-1 rounded-xl border border-surface-800 text-xs font-semibold overflow-x-auto">
          <button
            id="btn-tier-all"
            onClick={() => setSelectedTierFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedTierFilter === 'ALL'
                ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            All Tiers ({members.length})
          </button>
          <button
            id="btn-tier-platinum"
            onClick={() => setSelectedTierFilter('IMPERIAL_PLATINUM')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedTierFilter === 'IMPERIAL_PLATINUM'
                ? 'bg-purple-600 text-white shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Imperial Platinum
          </button>
          <button
            id="btn-tier-gold"
            onClick={() => setSelectedTierFilter('GOLD_SOVEREIGN')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedTierFilter === 'GOLD_SOVEREIGN'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Gold Sovereign
          </button>
          <button
            id="btn-tier-silver"
            onClick={() => setSelectedTierFilter('SILVER_PRIVILEGE')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedTierFilter === 'SILVER_PRIVILEGE'
                ? 'bg-surface-700 text-white shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Silver Privilege
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input
            id="input-search-loyalty"
            type="text"
            placeholder="Search member, mobile, tier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 bg-surface-950 border border-surface-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Members Directory Table */}
      <div className="bg-surface-900 border border-surface-700/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-surface-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" />
            Active VIP Customer Ledger ({filteredMembers.length})
          </h3>
          <span className="text-xs text-surface-400 font-mono">
            Auto-Sync with POS Billing
          </span>
        </div>

        <div className="overflow-x-auto">
          <table id="table-loyalty-members" className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 text-surface-400 font-semibold uppercase tracking-wider text-[11px] border-b border-surface-800 font-sans">
              <tr>
                <th className="px-4 py-3">Member &amp; Mobile</th>
                <th className="px-4 py-3 text-center">Membership Tier</th>
                <th className="px-4 py-3 text-right">Lifetime Spend</th>
                <th className="px-4 py-3 text-right text-brand-400">Points Balance</th>
                <th className="px-4 py-3 text-right text-emerald-400">Cash Credit (₹)</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60 font-mono">
              {filteredMembers.map((m) => (
                <tr key={m.id} id={`row-member-${m.id}`} className="hover:bg-surface-800/40 transition-colors">
                  <td className="px-4 py-3 font-sans">
                    <div className="font-semibold text-surface-100">{m.name}</div>
                    <div className="text-[11px] text-surface-400 font-mono">{m.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-center font-sans">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        m.tier === 'IMPERIAL_PLATINUM'
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : m.tier === 'GOLD_SOVEREIGN'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
                      }`}
                    >
                      {m.tier.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-surface-200">
                    ₹{m.lifetimeSpend.toLocaleString('en-IN')}
                  </td>
                  <td id={`stat-points-${m.id}`} className="px-4 py-3 text-right font-bold text-brand-400 text-sm">
                    {m.pointsBalance} Pts
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400 text-sm">
                    ₹{(m.pointsBalance * 10).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right font-sans whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        id={`btn-redeem-${m.id}`}
                        onClick={() => setMemberForRedemption(m)}
                        className="px-2.5 py-1 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                      >
                        <Gift className="w-3 h-3" /> Redeem
                      </button>
                      <button
                        id={`btn-view-card-${m.id}`}
                        onClick={() => setSelectedCustomerForCard(m)}
                        className="p-1 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 border border-surface-700 transition-colors"
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
      </div>

      {/* Digital VIP Membership Card Modal */}
      {selectedCustomerForCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            {/* VIP Card Representation */}
            <div className="w-full aspect-[1.58/1] rounded-2xl p-5 bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/60 border border-amber-500/40 shadow-xl flex flex-col justify-between text-left relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-amber-400 font-bold font-mono">
                    VIP Privilege Pass
                  </span>
                  <h4 className="font-black text-sm uppercase text-surface-100 mt-0.5">
                    {tenant?.name || 'A3 JEWELLERY & SONS'}
                  </h4>
                </div>
                <Crown className="w-6 h-6 text-amber-400" />
              </div>

              <div>
                <div className="text-[10px] font-mono text-surface-400">Cardholder:</div>
                <div className="text-base font-bold text-surface-100 tracking-wide font-sans">
                  {selectedCustomerForCard.name}
                </div>
                <div className="text-xs font-mono text-amber-400 font-bold">
                  {selectedCustomerForCard.tier.replace('_', ' ')}
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-surface-800/80 pt-2 font-mono text-[10px] text-surface-400">
                <span>ID: {selectedCustomerForCard.id}</span>
                <span className="text-emerald-400 font-bold">
                  Points: {selectedCustomerForCard.pointsBalance} (₹{(selectedCustomerForCard.pointsBalance * 10).toLocaleString('en-IN')})
                </span>
              </div>
            </div>

            <button
              id="btn-close-vip-card"
              onClick={() => setSelectedCustomerForCard(null)}
              className="w-full py-2 bg-surface-800 hover:bg-surface-700 text-surface-200 text-xs font-semibold rounded-xl border border-surface-700 transition-colors"
            >
              Close Card View
            </button>
          </div>
        </div>
      )}

      {/* Enroll New VIP Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-surface-800 pb-3">
              <h3 className="text-base font-bold text-surface-100 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Enroll New VIP Member
              </h3>
              <button
                id="btn-close-add-member"
                onClick={() => setIsAddMemberModalOpen(false)}
                className="p-1 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] uppercase font-mono text-surface-400 block mb-1">
                  Customer Full Name:
                </label>
                <input
                  id="input-member-name"
                  type="text"
                  required
                  placeholder="e.g. Smt. Meenakshi Sundaram"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-surface-400 block mb-1">
                  Mobile Number:
                </label>
                <input
                  id="input-member-phone"
                  type="text"
                  required
                  placeholder="e.g. +91 98450 11223"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-mono text-surface-400 block mb-1">
                    Initial Membership Tier:
                  </label>
                  <select
                    id="select-member-tier"
                    value={newMemberTier}
                    onChange={(e) => setNewMemberTier(e.target.value)}
                    className="w-full bg-surface-950 border border-surface-700 rounded-lg px-2.5 py-2 text-surface-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="IMPERIAL_PLATINUM">Imperial Platinum VIP</option>
                    <option value="GOLD_SOVEREIGN">Gold Sovereign</option>
                    <option value="SILVER_PRIVILEGE">Silver Privilege</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-surface-400 block mb-1">
                    Historical Spend (₹):
                  </label>
                  <input
                    id="input-member-spend"
                    type="number"
                    value={newMemberSpend}
                    onChange={(e) => setNewMemberSpend(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-surface-950 border border-surface-700 rounded-lg px-2.5 py-2 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-submit-member"
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Issue VIP Membership Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loyalty Points Redemption Modal */}
      <LoyaltyRedemptionModal
        isOpen={!!memberForRedemption}
        onClose={() => setMemberForRedemption(null)}
        member={memberForRedemption}
        tenant={tenant}
        onRedeemSuccess={handleRedeemSuccess}
      />
    </div>
  );
};
