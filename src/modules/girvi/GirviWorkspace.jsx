import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { ActiveLoansTable } from './components/ActiveLoansTable';
import { NewLoanSanctionModal } from './components/NewLoanSanctionModal';
import { LoanSettlementModal } from './components/LoanSettlementModal';
import { PawnTicketFormGModal } from './components/PawnTicketFormGModal';
import { AuctionRadar } from './components/AuctionRadar';
import { RePledgeModal } from './components/RePledgeModal';
import { 
  Coins, 
  Plus, 
  Gavel, 
  ShieldCheck, 
  FileText,
  Lock,
  Building2
} from 'lucide-react';

const INITIAL_LOANS = [
  {
    id: 'LN-2026-1001',
    borrower: {
      name: 'Ashish Kumar Singh',
      phone: '+91 98200 44321',
      address: 'Shop 4, Market Lane, Kalbadevi, Mumbai',
      aadhaar: '8912',
      biometricVerified: true
    },
    pledgedItems: [
      {
        description: '22K Solid Gold Rope Chain',
        grossWeight: 14.500,
        lessWeight: 0.200,
        netWeight: 14.300,
        purityPercent: 91.67,
        fineWeight: 13.108,
        marketValuation: 102897,
        lockerBoxNo: 'Locker-B07'
      }
    ],
    principalAmount: 50000,
    interestRateMonthly: 2.0,
    interestModel: 'MONTHLY_SIMPLE',
    tenureMonths: 11,
    startDate: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(), // 42 days ago
    status: 'ACTIVE',
    totalDepositedInterest: 0,
    totalDepositedPrincipal: 0,
  },
  {
    id: 'LN-2026-1002',
    borrower: {
      name: 'Rishi Patel',
      phone: '+91 98111 88990',
      address: 'Sector 14, Vashi, Navi Mumbai',
      aadhaar: '3310',
      biometricVerified: true
    },
    pledgedItems: [
      {
        description: '22K Handcrafted Gold Bangles (Pair)',
        grossWeight: 28.600,
        lessWeight: 0.400,
        netWeight: 28.200,
        purityPercent: 91.67,
        fineWeight: 25.850,
        marketValuation: 202922,
        lockerBoxNo: 'Locker-C02'
      }
    ],
    principalAmount: 100000,
    interestRateMonthly: 1.8,
    interestModel: 'MONTHLY_SIMPLE',
    tenureMonths: 11,
    startDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
    status: 'ACTIVE',
    totalDepositedInterest: 0,
    totalDepositedPrincipal: 0,
  }
];

export const GirviWorkspace = () => {
  const [loans, setLoans] = useState(() => {
    const saved = localStorage.getItem('A3_GIRVI_LOANS');
    return saved ? JSON.parse(saved) : INITIAL_LOANS;
  });

  const [activeSubcategory, setActiveSubcategory] = useState('ACTIVE_LOANS');
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);
  const [isRePledgeModalOpen, setIsRePledgeModalOpen] = useState(false);
  const [activeSettlementLoan, setActiveSettlementLoan] = useState(null);
  const [activeFormGLoan, setActiveFormGLoan] = useState(null);

  const [rePledges, setRePledges] = useState([
    {
      id: 'RPL-8012',
      bankName: 'State Bank of India (Bullion SME Branch)',
      bankLoanAccountNo: 'SBI-GL-998812',
      metalGramsPledged: 245.5,
      sanctionedAmount: 1450000,
      bankInterestRate: 8.85,
      tenureMonths: 12,
      sanctionDate: '2026-09-15',
      status: 'ACTIVE_WITH_BANK'
    }
  ]);

  const handleSanctionLoan = (newLoan) => {
    const updated = [newLoan, ...loans];
    setLoans(updated);
    localStorage.setItem('A3_GIRVI_LOANS', JSON.stringify(updated));
    setActiveFormGLoan(newLoan); // Open Form G directly upon sanction
  };

  const handleConfirmRelease = ({ loanId, settlementAmount, paymentMode }) => {
    const updated = loans.map(l => 
      l.id === loanId 
        ? { ...l, status: 'RELEASED', releasedAt: new Date().toISOString(), settlementAmount, paymentMode }
        : l
    );
    setLoans(updated);
    localStorage.setItem('A3_GIRVI_LOANS', JSON.stringify(updated));
    alert(`Loan ${loanId} settled successfully! Ornament released from locker vault.`);
  };

  return (
    <div className="space-y-4">
      
      {/* Subcategory Level 2 Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between border-b border-surface-800 pb-2 gap-2">
        <div className="flex items-center gap-1 font-sans text-xs">
          {[
            { id: 'ACTIVE_LOANS', label: 'Active Loan Portfolio', icon: Coins },
            { id: 'AUCTION_RADAR', label: 'Default & Auction Radar', icon: Gavel },
            { id: 'RE_PLEDGE', label: 'Bank Re-Pledge (Liquidity)', icon: Building2 }
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
          onClick={() => setIsSanctionModalOpen(true)}
          className="btn-primary py-1.5 px-3 text-xs font-sans font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Gold Loan</span>
        </button>
      </div>

      {/* Subcategory 1: Active Loans Table */}
      {activeSubcategory === 'ACTIVE_LOANS' && (
        <ActiveLoansTable
          loans={loans}
          onOpenSanctionModal={() => setIsSanctionModalOpen(true)}
          onOpenSettlement={(loan) => setActiveSettlementLoan(loan)}
          onOpenFormG={(loan) => setActiveFormGLoan(loan)}
        />
      )}

      {/* Subcategory 2: Default & Auction Radar */}
      {activeSubcategory === 'AUCTION_RADAR' && (
        <AuctionRadar loans={loans} />
      )}

      {/* Subcategory 3: Bank Re-Pledge Roster */}
      {activeSubcategory === 'RE_PLEDGE' && (
        <div className="card-surface p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-surface-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-400" />
                Bank Re-Pledge Portfolio (Institutional Liquidity)
              </h3>
              <p className="text-xs text-surface-400">
                Tracking pledged gold packets deposited with Commercial Banks/NBFCs at wholesale interest rates.
              </p>
            </div>
            <button
              onClick={() => setIsRePledgeModalOpen(true)}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" /> Re-Pledge to Bank
            </button>
          </div>

          <table className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 text-surface-400 uppercase tracking-wider text-[11px] border-b border-surface-800">
              <tr>
                <th className="p-2.5">Bank / NBFC &amp; Loan A/c</th>
                <th className="p-2.5 text-right">Gold Pledged</th>
                <th className="p-2.5 text-right">Sanctioned Amount</th>
                <th className="p-2.5 text-center">Interest Rate</th>
                <th className="p-2.5 text-center">Sanction Date</th>
                <th className="p-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60 font-mono">
              {rePledges.map((rpl) => (
                <tr key={rpl.id} className="hover:bg-surface-800/40">
                  <td className="p-2.5 font-sans">
                    <div className="font-semibold text-surface-100">{rpl.bankName}</div>
                    <div className="text-[11px] text-brand-400 font-mono">{rpl.bankLoanAccountNo}</div>
                  </td>
                  <td className="p-2.5 text-right font-bold text-amber-400">{rpl.metalGramsPledged.toFixed(3)} g</td>
                  <td className="p-2.5 text-right font-bold text-emerald-400 text-sm">
                    ₹{rpl.sanctionedAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-2.5 text-center">{rpl.bankInterestRate}% p.a.</td>
                  <td className="p-2.5 text-center">{rpl.sanctionDate}</td>
                  <td className="p-2.5 text-center font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      With Bank
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal 1: Sanction New Loan */}
      <NewLoanSanctionModal
        isOpen={isSanctionModalOpen}
        onClose={() => setIsSanctionModalOpen(false)}
        onSanctionLoan={handleSanctionLoan}
      />

      {/* Modal: Bank Re-Pledge */}
      <RePledgeModal
        isOpen={isRePledgeModalOpen}
        onClose={() => setIsRePledgeModalOpen(false)}
        onSaveRePledge={(rpl) => setRePledges([rpl, ...rePledges])}
      />

      {/* Modal 2: Loan Safe Release & Settlement */}
      {activeSettlementLoan && (
        <LoanSettlementModal
          loan={activeSettlementLoan}
          isOpen={Boolean(activeSettlementLoan)}
          onClose={() => setActiveSettlementLoan(null)}
          onConfirmRelease={handleConfirmRelease}
        />
      )}

      {/* Modal 3: Pawn Ticket Form G & Form 8 */}
      {activeFormGLoan && (
        <PawnTicketFormGModal
          loan={activeFormGLoan}
          onClose={() => setActiveFormGLoan(null)}
        />
      )}

    </div>
  );
};