import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  CreditCard, 
  IndianRupee, 
  Clock, 
  FileText 
} from 'lucide-react';
import { UdhaarRegister } from './components/UdhaarRegister';
import { UdhaarCollectionDrawer } from './components/UdhaarCollectionDrawer';
import { CreditLimitConfig } from './components/CreditLimitConfig';
import { CustomerLedgerModal } from './components/CustomerLedgerModal';

export const CreditWorkspace = () => {
  const [activeSubTab, setActiveSubTab] = useState('REGISTER'); // 'REGISTER', 'LIMITS'
  const [selectedAccountForPayment, setSelectedAccountForPayment] = useState(null);
  const [isCollectionDrawerOpen, setIsCollectionDrawerOpen] = useState(false);
  const [selectedAccountForStatement, setSelectedAccountForStatement] = useState(null);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);

  // Initial Sample Customer Udhaar Accounts with rich Double-Entry Ledger Histories
  const [accounts, setAccounts] = useState([
    {
      id: 'UDH-01',
      customerName: 'Smt. Kamlesh Sharma',
      phone: '+91 98112 33445',
      city: 'Delhi (Chandni Chowk)',
      invoiceNo: 'INV-2026-0810',
      invoiceDate: '2026-09-12',
      totalBillAmount: 345000,
      totalPaid: 220000,
      balanceDue: 125000,
      daysOutstanding: 40,
      creditLimit: 200000,
      isBlocked: false,
      ledgerEntries: [
        {
          id: 'tx-101',
          date: '2026-09-12',
          voucherNo: 'INV-2026-0810',
          particulars: 'Sale: 22K Hallmarked Bridal Polki Necklace & Jhumkas (48.50g)',
          debit: 345000,
          credit: 0,
          balance: 345000
        },
        {
          id: 'tx-102',
          date: '2026-09-12',
          voucherNo: 'RCT-2026-0912',
          particulars: 'Advance Token Payment via HDFC Net Banking',
          debit: 0,
          credit: 150000,
          balance: 195000
        },
        {
          id: 'tx-103',
          date: '2026-09-28',
          voucherNo: 'OGX-2026-0044',
          particulars: 'Old Gold Exchange Credit (22K 10.20g Melted Ingot)',
          debit: 0,
          credit: 70000,
          balance: 125000
        }
      ]
    },
    {
      id: 'UDH-02',
      customerName: 'Shri Ramesh Chander Agrawal',
      phone: '+91 98290 88776',
      city: 'Jaipur (Johari Bazaar)',
      invoiceNo: 'INV-2026-0845',
      invoiceDate: '2026-10-04',
      totalBillAmount: 185000,
      totalPaid: 140000,
      balanceDue: 45000,
      daysOutstanding: 18,
      creditLimit: 100000,
      isBlocked: false,
      ledgerEntries: [
        {
          id: 'tx-201',
          date: '2026-10-04',
          voucherNo: 'INV-2026-0845',
          particulars: 'Sale: 22K Mens Navratna Ring & Gold Chain (26.80g)',
          debit: 185000,
          credit: 0,
          balance: 185000
        },
        {
          id: 'tx-202',
          date: '2026-10-04',
          voucherNo: 'RCT-2026-1004',
          particulars: 'Cash Advance at Counter Point of Sale',
          debit: 0,
          credit: 140000,
          balance: 45000
        }
      ]
    },
    {
      id: 'UDH-03',
      customerName: 'Vikram Singh Rathore',
      phone: '+91 94140 11992',
      city: 'Jodhpur',
      invoiceNo: 'INV-2026-0712',
      invoiceDate: '2026-08-01',
      totalBillAmount: 420000,
      totalPaid: 240000,
      balanceDue: 180000,
      daysOutstanding: 82,
      creditLimit: 150000,
      isBlocked: true,
      ledgerEntries: [
        {
          id: 'tx-301',
          date: '2026-08-01',
          voucherNo: 'INV-2026-0712',
          particulars: 'Sale: Royal Rajputi Aad & Teeka Set 22K (59.20g)',
          debit: 420000,
          credit: 0,
          balance: 420000
        },
        {
          id: 'tx-302',
          date: '2026-08-05',
          voucherNo: 'RCT-2026-0805',
          particulars: 'Cheque Clearance (SBI Chq #440912)',
          debit: 0,
          credit: 240000,
          balance: 180000
        }
      ]
    },
    {
      id: 'UDH-04',
      customerName: 'Mrs. Sunita Khandelwal',
      phone: '+91 98200 44551',
      city: 'Mumbai',
      invoiceNo: 'INV-2026-0889',
      invoiceDate: '2026-10-18',
      totalBillAmount: 265000,
      totalPaid: 200000,
      balanceDue: 65000,
      daysOutstanding: 4,
      creditLimit: 300000,
      isBlocked: false,
      ledgerEntries: [
        {
          id: 'tx-401',
          date: '2026-10-18',
          voucherNo: 'INV-2026-0889',
          particulars: 'Sale: 18K Diamond Solitaire Bangles (VVS-EF)',
          debit: 265000,
          credit: 0,
          balance: 265000
        },
        {
          id: 'tx-402',
          date: '2026-10-18',
          voucherNo: 'RCT-2026-1018',
          particulars: 'UPI Payment via GooglePay [Ref: 429103982]',
          debit: 0,
          credit: 200000,
          balance: 65000
        }
      ]
    }
  ]);

  const handleOpenCollect = (acc) => {
    setSelectedAccountForPayment(acc);
    setIsCollectionDrawerOpen(true);
  };

  const handleViewStatement = (acc) => {
    setSelectedAccountForStatement(acc);
    setIsStatementModalOpen(true);
  };

  const handlePaymentRecorded = (accId, amount, receipt) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accId) {
          const newBalance = Math.max(0, acc.balanceDue - amount);
          const newEntry = {
            id: `tx-rec-${Date.now()}`,
            date: receipt.date,
            voucherNo: receipt.receiptNo,
            particulars: `Part Payment via ${receipt.paymentMode} (${receipt.remarks || 'Customer Repayment'})`,
            debit: 0,
            credit: amount,
            balance: newBalance
          };
          const updated = {
            ...acc,
            totalPaid: acc.totalPaid + amount,
            balanceDue: newBalance,
            ledgerEntries: [...(acc.ledgerEntries || []), newEntry]
          };

          // Also update selectedAccountForStatement if this account is currently viewed
          if (selectedAccountForStatement && selectedAccountForStatement.id === accId) {
            setSelectedAccountForStatement(updated);
          }
          return updated;
        }
        return acc;
      })
    );
  };

  const handleUpdateLimit = (accId, newLimit) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === accId ? { ...acc, creditLimit: newLimit } : acc))
    );
  };

  const handleToggleBlock = (accId) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === accId ? { ...acc, isBlocked: !acc.isBlocked } : acc))
    );
  };

  return (
    <div className="space-y-6">
      {/* Subcategory Level 2 Tab Navigation */}
      <div className="flex border-b border-surface-800 text-xs font-semibold gap-1 overflow-x-auto">
        <button
          id="tab-credit-register"
          onClick={() => setActiveSubTab('REGISTER')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'REGISTER'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Customer Udhaar (Khaata) Register &amp; Aging
        </button>
        <button
          id="tab-credit-limits"
          onClick={() => setActiveSubTab('LIMITS')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'LIMITS'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Credit Ceilings &amp; Default Controls
        </button>
      </div>

      {/* Tab Content */}
      {activeSubTab === 'REGISTER' && (
        <UdhaarRegister
          accounts={accounts}
          onCollectPayment={handleOpenCollect}
          onViewStatement={handleViewStatement}
        />
      )}

      {activeSubTab === 'LIMITS' && (
        <CreditLimitConfig
          accounts={accounts}
          onUpdateLimit={handleUpdateLimit}
          onToggleBlock={handleToggleBlock}
        />
      )}

      {/* Payment Drawer Modal */}
      <UdhaarCollectionDrawer
        isOpen={isCollectionDrawerOpen}
        onClose={() => setIsCollectionDrawerOpen(false)}
        account={selectedAccountForPayment}
        onPaymentRecorded={handlePaymentRecorded}
      />

      {/* Customer Bahi-Khata Ledger Statement Modal */}
      <CustomerLedgerModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
        account={selectedAccountForStatement}
        onCollectPayment={handleOpenCollect}
      />
    </div>
  );
};
