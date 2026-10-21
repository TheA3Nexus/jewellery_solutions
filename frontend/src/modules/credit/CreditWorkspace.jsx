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

export const CreditWorkspace = () => {
  const [activeSubTab, setActiveSubTab] = useState('REGISTER'); // 'REGISTER', 'LIMITS'
  const [selectedAccountForPayment, setSelectedAccountForPayment] = useState(null);
  const [isCollectionDrawerOpen, setIsCollectionDrawerOpen] = useState(false);

  // Initial Sample Customer Udhaar Accounts
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
      isBlocked: false
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
      isBlocked: false
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
      isBlocked: true
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
      isBlocked: false
    }
  ]);

  const handleOpenCollect = (acc) => {
    setSelectedAccountForPayment(acc);
    setIsCollectionDrawerOpen(true);
  };

  const handlePaymentRecorded = (accId, amount, receipt) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accId
          ? {
              ...acc,
              totalPaid: acc.totalPaid + amount,
              balanceDue: Math.max(0, acc.balanceDue - amount)
            }
          : acc
      )
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
          onViewStatement={(acc) => alert(`Opening Khaata Ledger Statement for ${acc.customerName}...`)}
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
    </div>
  );
};
