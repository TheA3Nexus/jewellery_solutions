import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { ActiveMembersTable } from './components/ActiveMembersTable';
import { CreateSchemePlanModal } from './components/CreateSchemePlanModal';
import { MemberPassbookModal } from './components/MemberPassbookModal';
import { LuckyDrawEngine } from './components/LuckyDrawEngine';
import { 
  Coins, 
  Plus, 
  Trophy, 
  BookOpen, 
  ShieldCheck 
} from 'lucide-react';

const INITIAL_MEMBERS = [
  {
    id: 'MEM-101',
    tokenNo: '101',
    customerName: 'Priya Sharma',
    phone: '+91 98200 11223',
    schemeName: 'Swarna Varsha 11+1 Golden Plan',
    monthlyEmi: 2000,
    tenureMonths: 11,
    bonusAmount: 2000,
    joiningGift: '10g 999 Silver Coin',
    paidInstallments: [
      { num: 1, date: '21 May 2026', amount: 2000 },
      { num: 2, date: '21 Jun 2026', amount: 2000 },
      { num: 3, date: '21 Jul 2026', amount: 2000 },
      { num: 4, date: '21 Aug 2026', amount: 2000 },
      { num: 5, date: '21 Sep 2026', amount: 2000 },
    ],
    status: 'ACTIVE'
  },
  {
    id: 'MEM-102',
    tokenNo: '102',
    customerName: 'Rajesh Verma',
    phone: '+91 98333 44556',
    schemeName: 'Swarna Varsha 11+1 Golden Plan',
    monthlyEmi: 5000,
    tenureMonths: 11,
    bonusAmount: 5000,
    joiningGift: '10g 999 Silver Coin',
    paidInstallments: [
      { num: 1, date: '10 Aug 2026', amount: 5000 },
      { num: 2, date: '10 Sep 2026', amount: 5000 },
    ],
    status: 'ACTIVE'
  }
];

export const SchemesWorkspace = () => {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('A3_SCHEME_MEMBERS');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [activeSubcategory, setActiveSubcategory] = useState('MEMBERS');
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [activePassbookMember, setActivePassbookMember] = useState(null);

  const handleCreatePlan = (newPlan) => {
    alert(`Scheme Plan "${newPlan.name}" launched with 11-month BUDS compliance.`);
  };

  const handlePayInstallment = (memberId, instNum) => {
    const updated = members.map(m => {
      if (m.id === memberId) {
        const newInstallments = [
          ...(m.paidInstallments || []),
          { num: instNum, date: new Date().toLocaleDateString('en-IN'), amount: m.monthlyEmi }
        ];
        return { ...m, paidInstallments: newInstallments };
      }
      return m;
    });

    setMembers(updated);
    localStorage.setItem('A3_SCHEME_MEMBERS', JSON.stringify(updated));

    // Update the open passbook modal with fresh data
    const refreshed = updated.find(m => m.id === memberId);
    setActivePassbookMember(refreshed);
    alert(`Installment #${instNum} (₹${refreshed.monthlyEmi}) deposited successfully.`);
  };

  return (
    <div className="space-y-4">
      
      {/* Subcategory Level 2 Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between border-b border-surface-800 pb-2 gap-2">
        <div className="flex items-center gap-1 font-sans text-xs">
          {[
            { id: 'MEMBERS', label: 'Member Passbooks & Portfolio', icon: BookOpen },
            { id: 'LUCKY_DRAW', label: 'Monthly Lucky Draw Engine', icon: Trophy }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubcategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubcategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition ${
                  isActive
                    ? 'bg-surface-800 text-brand-400 border border-brand-500/40 shadow-sm'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsCreatePlanOpen(true)}
          className="btn-primary py-1.5 px-3 text-xs font-sans font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Scheme Plan</span>
        </button>
      </div>

      {/* Subcategory 1: Active Members Table */}
      {activeSubcategory === 'MEMBERS' && (
        <ActiveMembersTable
          members={members}
          onOpenCreatePlan={() => setIsCreatePlanOpen(true)}
          onOpenPassbook={(m) => setActivePassbookMember(m)}
          onQuickCollect={(m) => setActivePassbookMember(m)}
        />
      )}

      {/* Subcategory 2: Lucky Draw Engine */}
      {activeSubcategory === 'LUCKY_DRAW' && (
        <LuckyDrawEngine members={members} />
      )}

      {/* Modal 1: Create Scheme Plan */}
      <CreateSchemePlanModal
        isOpen={isCreatePlanOpen}
        onClose={() => setIsCreatePlanOpen(false)}
        onCreatePlan={handleCreatePlan}
      />

      {/* Modal 2: Member Digital Passbook */}
      {activePassbookMember && (
        <MemberPassbookModal
          subscription={activePassbookMember}
          onClose={() => setActivePassbookMember(null)}
          onPayInstallment={handlePayInstallment}
        />
      )}

    </div>
  );
};