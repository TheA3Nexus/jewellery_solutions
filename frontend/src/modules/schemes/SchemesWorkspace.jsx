import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { ActiveMembersTable } from './components/ActiveMembersTable';
import { CreateSchemePlanModal } from './components/CreateSchemePlanModal';
import { EnrollMemberModal } from './components/EnrollMemberModal';
import { MemberPassbookModal } from './components/MemberPassbookModal';
import { SchemeMaturityModal } from './components/SchemeMaturityModal';
import { LuckyDrawEngine } from './components/LuckyDrawEngine';
import { 
  Coins, 
  Plus, 
  Trophy, 
  BookOpen, 
  ShieldCheck,
  UserPlus
} from 'lucide-react';

const INITIAL_MEMBERS = [
  {
    id: 'MEM-101',
    tokenNo: '101',
    passbookNo: 'PB-2026-0101',
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
    passbookNo: 'PB-2026-0102',
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
  },
  {
    id: 'MEM-103',
    tokenNo: '103',
    passbookNo: 'PB-2026-0103',
    customerName: 'Ananya Deshmukh',
    phone: '+91 98111 22334',
    schemeName: 'Swarna Varsha 11+1 Golden Plan',
    monthlyEmi: 5000,
    tenureMonths: 11,
    bonusAmount: 5000,
    joiningGift: '10g 999 Silver Coin',
    paidInstallments: [
      { num: 1, date: '15 Nov 2025', amount: 5000 },
      { num: 2, date: '15 Dec 2025', amount: 5000 },
      { num: 3, date: '15 Jan 2026', amount: 5000 },
      { num: 4, date: '15 Feb 2026', amount: 5000 },
      { num: 5, date: '15 Mar 2026', amount: 5000 },
      { num: 6, date: '15 Apr 2026', amount: 5000 },
      { num: 7, date: '15 May 2026', amount: 5000 },
      { num: 8, date: '15 Jun 2026', amount: 5000 },
      { num: 9, date: '15 Jul 2026', amount: 5000 },
      { num: 10, date: '15 Aug 2026', amount: 5000 },
      { num: 11, date: '15 Sep 2026', amount: 5000 },
    ],
    status: 'MATURED'
  }
];

export const SchemesWorkspace = () => {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('A3_SCHEME_MEMBERS');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [activeSubcategory, setActiveSubcategory] = useState('MEMBERS');
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [isEnrollMemberOpen, setIsEnrollMemberOpen] = useState(false);
  const [activePassbookMember, setActivePassbookMember] = useState(null);
  const [activeMaturityMember, setActiveMaturityMember] = useState(null);

  const handleCreatePlan = (newPlan) => {
    alert(`Scheme Plan "${newPlan.name}" launched with 11-month BUDS compliance.`);
  };

  const handleEnrollMember = (newMember) => {
    const updated = [newMember, ...members];
    setMembers(updated);
    localStorage.setItem('A3_SCHEME_MEMBERS', JSON.stringify(updated));
    setActivePassbookMember(newMember);
  };

  const handlePayInstallment = (memberId, instNum) => {
    const updated = members.map(m => {
      if (m.id === memberId) {
        const newInstallments = [
          ...(m.paidInstallments || []),
          { num: instNum, date: new Date().toLocaleDateString('en-IN'), amount: m.monthlyEmi }
        ];
        const isNowMatured = newInstallments.length >= m.tenureMonths;
        return { 
          ...m, 
          paidInstallments: newInstallments,
          status: isNowMatured ? 'MATURED' : m.status
        };
      }
      return m;
    });

    setMembers(updated);
    localStorage.setItem('A3_SCHEME_MEMBERS', JSON.stringify(updated));

    // Update open passbook modal
    const refreshed = updated.find(m => m.id === memberId);
    setActivePassbookMember(refreshed);
  };

  const handleRedeemAtPos = (member) => {
    const updated = members.map(m => 
      m.id === member.id ? { ...m, status: 'REDEEMED' } : m
    );
    setMembers(updated);
    localStorage.setItem('A3_SCHEME_MEMBERS', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4">
      
      {/* Subcategory Level 2 Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between border-b border-surface-800 pb-2 gap-2">
        <div className="flex items-center gap-1 font-sans text-xs">
          <button
            id="tab-scheme-members"
            onClick={() => setActiveSubcategory('MEMBERS')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition ${
              activeSubcategory === 'MEMBERS'
                ? 'bg-surface-800 text-brand-400 border border-brand-500/40 shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-850'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Member Passbooks &amp; Portfolio</span>
          </button>

          <button
            id="tab-scheme-lucky-draw"
            onClick={() => setActiveSubcategory('LUCKY_DRAW')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition ${
              activeSubcategory === 'LUCKY_DRAW'
                ? 'bg-surface-800 text-brand-400 border border-brand-500/40 shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-850'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Monthly Lucky Draw Engine</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-workspace-enroll"
            onClick={() => setIsEnrollMemberOpen(true)}
            className="btn-primary py-1.5 px-3 text-xs font-sans font-bold flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Member</span>
          </button>

          <button
            id="btn-workspace-new-plan"
            onClick={() => setIsCreatePlanOpen(true)}
            className="btn-secondary py-1.5 px-3 text-xs font-sans font-medium flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Scheme Plan</span>
          </button>
        </div>
      </div>

      {/* Subcategory 1: Active Members Table */}
      {activeSubcategory === 'MEMBERS' && (
        <ActiveMembersTable
          members={members}
          onOpenCreatePlan={() => setIsCreatePlanOpen(true)}
          onOpenEnrollMember={() => setIsEnrollMemberOpen(true)}
          onOpenPassbook={(m) => setActivePassbookMember(m)}
          onOpenMaturity={(m) => setActiveMaturityMember(m)}
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

      {/* Modal 2: Enroll Member Modal */}
      <EnrollMemberModal
        isOpen={isEnrollMemberOpen}
        onClose={() => setIsEnrollMemberOpen(false)}
        onEnrollMember={handleEnrollMember}
      />

      {/* Modal 3: Member Digital Passbook */}
      {activePassbookMember && (
        <MemberPassbookModal
          subscription={activePassbookMember}
          onClose={() => setActivePassbookMember(null)}
          onPayInstallment={handlePayInstallment}
          onOpenMaturity={(m) => {
            setActivePassbookMember(null);
            setActiveMaturityMember(m);
          }}
        />
      )}

      {/* Modal 4: Scheme Maturity Redemption */}
      {activeMaturityMember && (
        <SchemeMaturityModal
          isOpen={Boolean(activeMaturityMember)}
          onClose={() => setActiveMaturityMember(null)}
          member={activeMaturityMember}
          onRedeemAtPos={handleRedeemAtPos}
        />
      )}

    </div>
  );
};
