import React, { useState } from 'react';
import { 
  Hammer, 
  PlusCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Coins, 
  Search,
  Filter,
  BadgePercent
} from 'lucide-react';
import { IssueMetalModal } from './components/IssueMetalModal';
import { ReceiveGoodsModal } from './components/ReceiveGoodsModal';
import { KarigarLedgerTable } from './components/KarigarLedgerTable';
import { AlloyConversionCalculator } from './components/AlloyConversionCalculator';
import { Calculator } from 'lucide-react';

export const KarigarWorkspace = () => {
  const [activeTab, setActiveTab] = useState('LEDGER'); // 'LEDGER', 'ORDERS', 'HISTORY'
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  // Initial Artisan Profiles
  const [karigars, setKarigars] = useState([
    {
      id: 'KRG-01',
      name: 'Babu Lal Goldsmith',
      specialization: 'Handmade Bridal & Antique Kundan',
      workshopCity: 'Rajkot, Gujarat',
      phone: '+91 98250 11223',
      metalBalanceGrams: 42.450,
      laborBalanceRupees: 18500,
      allowedGhatRate: 2.5,
      activeWorkOrdersCount: 3
    },
    {
      id: 'KRG-02',
      name: 'Gopal Verma (V.G. Chains)',
      specialization: 'Hollow Chains & Italian Casting',
      workshopCity: 'Coimbatore, TN',
      phone: '+91 94431 88990',
      metalBalanceGrams: 115.800,
      laborBalanceRupees: 42000,
      allowedGhatRate: 1.8,
      activeWorkOrdersCount: 5
    },
    {
      id: 'KRG-03',
      name: 'Radhe Shyam Silversmith',
      specialization: 'Silver Utensils & Handcrafted Idols',
      workshopCity: 'Mathura, UP',
      phone: '+91 98371 44556',
      metalBalanceGrams: 1450.000,
      laborBalanceRupees: 28400,
      allowedGhatRate: 3.0,
      activeWorkOrdersCount: 2
    }
  ]);

  // Load Artisans from GoDaddy MySQL backend on mount
  React.useEffect(() => {
    fetch('http://localhost:5000/api/v1/karigar/accounts')
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const normalized = json.data.map(k => ({
            ...k,
            metalBalanceGrams: parseFloat(k.metalBalanceGrams || 0),
            laborBalanceRupees: parseFloat(k.laborBalanceRupees || 0),
            allowedGhatRate: parseFloat(k.allowedGhatRate || 2.0),
            activeWorkOrdersCount: k._count?.transactions || 2
          }));
          setKarigars(normalized);
        }
      })
      .catch(() => {});
  }, []);

  // Initial Artisan Double-Entry Transactions
  const [transactions, setTransactions] = useState([
    {
      id: 'TX-901',
      karigarId: 'KRG-01',
      date: '2026-10-18',
      voucherNo: 'VCH-ISS-104',
      type: 'ISSUE',
      description: '24K Pure Gold Bar Issued for Bridal Choker',
      purity: '24K (99.9%)',
      metalIssuedGrams: 50.000,
      metalReceivedGrams: null,
      wastageGrams: null,
      runningMetalBalance: 50.000,
      labourEarned: null,
      labourPaid: null,
      runningLabourBalance: 0
    },
    {
      id: 'TX-902',
      karigarId: 'KRG-01',
      date: '2026-10-20',
      voucherNo: 'VCH-REC-208',
      type: 'RECEIVE',
      description: 'Received 22K Peacock Choker + Scrap Shavings',
      purity: '22K (91.6%)',
      metalIssuedGrams: null,
      metalReceivedGrams: 48.750,
      wastageGrams: 1.250,
      runningMetalBalance: 0.000,
      labourEarned: 22500,
      labourPaid: null,
      runningLabourBalance: 22500
    },
    {
      id: 'TX-903',
      karigarId: 'KRG-01',
      date: '2026-10-21',
      voucherNo: 'VCH-PAY-301',
      type: 'PAYMENT',
      description: 'Labour Advance Paid via NEFT / Cash voucher',
      purity: null,
      metalIssuedGrams: null,
      metalReceivedGrams: null,
      wastageGrams: null,
      runningMetalBalance: 0.000,
      labourEarned: null,
      labourPaid: 10000,
      runningLabourBalance: 12500
    },
    {
      id: 'TX-904',
      karigarId: 'KRG-01',
      date: '2026-10-21',
      voucherNo: 'VCH-ISS-109',
      type: 'ISSUE',
      description: '24K Gold Bar Issued for Jhumka Earrings',
      purity: '24K (99.9%)',
      metalIssuedGrams: 42.450,
      metalReceivedGrams: null,
      wastageGrams: null,
      runningMetalBalance: 42.450,
      labourEarned: null,
      labourPaid: null,
      runningLabourBalance: 18500
    }
  ]);

  // Active Job Orders / Work Slips
  const [workOrders, setWorkOrders] = useState([
    {
      id: 'WO-8021',
      karigarName: 'Babu Lal Goldsmith',
      articleName: '22K Filigree Peacock Jhumka Set',
      weightIssued: 42.450,
      targetGrossWeight: 40.000,
      issuedDate: '2026-10-21',
      dueDate: '2026-10-28',
      stage: 'DIE_CASTING',
      progress: 35
    },
    {
      id: 'WO-8019',
      karigarName: 'Gopal Verma (V.G. Chains)',
      articleName: '22K Italian Rope Chain 24-inch (3 Pcs)',
      weightIssued: 115.800,
      targetGrossWeight: 112.500,
      issuedDate: '2026-10-17',
      dueDate: '2026-10-23',
      stage: 'STONE_SETTING',
      progress: 75
    },
    {
      id: 'WO-7992',
      karigarName: 'Radhe Shyam Silversmith',
      articleName: '92.5 Sterling Silver Puja Thali with Kalash',
      weightIssued: 1450.000,
      targetGrossWeight: 1420.000,
      issuedDate: '2026-10-15',
      dueDate: '2026-10-22',
      stage: 'POLISHING',
      progress: 90
    }
  ]);

  const handleIssueMetal = async (payload) => {
    const karigar = karigars.find((k) => k.id === payload.karigarId);
    const newMetalBal = (karigar?.metalBalanceGrams || 0) + payload.weightGrams;

    // Update Karigar state
    setKarigars((prev) =>
      prev.map((k) =>
        k.id === payload.karigarId
          ? {
              ...k,
              metalBalanceGrams: newMetalBal,
              activeWorkOrdersCount: k.activeWorkOrdersCount + 1
            }
          : k
      )
    );

    // Append to transactions ledger
    const newTx = {
      id: `TX-${Date.now()}`,
      karigarId: payload.karigarId,
      date: new Date().toISOString().split('T')[0],
      voucherNo: `VCH-ISS-${Math.floor(100 + Math.random() * 900)}`,
      type: 'ISSUE',
      description: payload.workOrderDesc || 'Pure metal issued for manufacturing',
      purity: payload.purity,
      metalIssuedGrams: payload.weightGrams,
      metalReceivedGrams: null,
      wastageGrams: null,
      runningMetalBalance: newMetalBal,
      labourEarned: null,
      labourPaid: null,
      runningLabourBalance: karigar?.laborBalanceRupees || 0
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Persist to GoDaddy MySQL
    try {
      await fetch('http://localhost:5000/api/v1/karigar/issue-metal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          karigarId: payload.karigarId,
          metalIssuedGrams: payload.weightGrams,
          purity: payload.purity,
          description: payload.workOrderDesc
        })
      });
    } catch (e) {}

    // Append to work orders
    const newOrder = {
      id: payload.id,
      karigarName: karigar?.name || 'Artisan',
      articleName: payload.workOrderDesc,
      weightIssued: payload.weightGrams,
      targetGrossWeight: payload.weightGrams * 0.98,
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      stage: 'MELTING',
      progress: 15
    };
    setWorkOrders((prev) => [newOrder, ...prev]);
  };

  const handleReceiveGoods = async (payload) => {
    const karigar = karigars.find((k) => k.id === payload.karigarId);
    const metalAccounted = payload.grossWeight + payload.returnScrapWeight;
    const newMetalBal = Math.max(0, (karigar?.metalBalanceGrams || 0) - metalAccounted);
    const newLaborBal = (karigar?.laborBalanceRupees || 0) + payload.makingChargesPayable;

    // Update Karigar state
    setKarigars((prev) =>
      prev.map((k) =>
        k.id === payload.karigarId
          ? {
              ...k,
              metalBalanceGrams: newMetalBal,
              laborBalanceRupees: newLaborBal,
              activeWorkOrdersCount: Math.max(0, k.activeWorkOrdersCount - 1)
            }
          : k
      )
    );

    // Append to transactions ledger
    const newTx = {
      id: `TX-${Date.now()}`,
      karigarId: payload.karigarId,
      date: new Date().toISOString().split('T')[0],
      voucherNo: `VCH-REC-${Math.floor(100 + Math.random() * 900)}`,
      type: 'RECEIVE',
      description: `Received: ${payload.articleName} (Scrap: ${payload.returnScrapWeight.toFixed(3)}g)`,
      purity: '22K (91.6%)',
      metalIssuedGrams: null,
      metalReceivedGrams: metalAccounted,
      wastageGrams: null,
      runningMetalBalance: newMetalBal,
      labourEarned: payload.makingChargesPayable,
      labourPaid: null,
      runningLabourBalance: newLaborBal
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Persist to GoDaddy MySQL
    try {
      await fetch('http://localhost:5000/api/v1/karigar/receive-goods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          karigarId: payload.karigarId,
          metalReceivedGrams: metalAccounted,
          wastageGrams: payload.returnScrapWeight,
          labourEarned: payload.makingChargesPayable,
          description: payload.articleName
        })
      });
    } catch (e) {}
  };

  const handleSettleLabor = async (karigar) => {
    const amountStr = prompt(`Enter advance / labour payment amount to ${karigar.name} (Current Due: ₹${karigar.laborBalanceRupees}):`, karigar.laborBalanceRupees);
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    const newLaborBal = Math.max(0, karigar.laborBalanceRupees - amount);

    setKarigars((prev) =>
      prev.map((k) =>
        k.id === karigar.id
          ? { ...k, laborBalanceRupees: newLaborBal }
          : k
      )
    );

    const newTx = {
      id: `TX-${Date.now()}`,
      karigarId: karigar.id,
      date: new Date().toISOString().split('T')[0],
      voucherNo: `VCH-PAY-${Math.floor(100 + Math.random() * 900)}`,
      type: 'PAYMENT',
      description: 'Labour Settlement / Cash Advance Payment',
      purity: null,
      metalIssuedGrams: null,
      metalReceivedGrams: null,
      wastageGrams: null,
      runningMetalBalance: karigar.metalBalanceGrams,
      labourEarned: null,
      labourPaid: amount,
      runningLabourBalance: newLaborBal
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              Artisan & Karigar Workshop Desk
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Bullion Accounting
              </span>
            </h2>
            <p className="text-xs text-surface-400">
              Double-entry pure metal accountability, loss percentage (ghat) audit, and labour reconciliation.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/20"
          >
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            Issue Pure Metal (Javak)
          </button>
          <button
            onClick={() => setIsReceiveModalOpen(true)}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20"
          >
            <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
            Receive Articles (Aavak)
          </button>
        </div>
      </div>

      {/* Subcategory Navigation Tabs */}
      <div className="flex border-b border-surface-800 text-xs font-semibold gap-1">
        <button
          onClick={() => setActiveTab('LEDGER')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'LEDGER'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <Coins className="w-4 h-4" />
          Double-Entry Ledger (Metal & Labour)
        </button>
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'ORDERS'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          Active Work Orders & Production Pipeline ({workOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('ALLOY_CALCULATOR')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'ALLOY_CALCULATOR'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Bullion Melting &amp; Alloy Ratio Calculator
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'LEDGER' && (
        <KarigarLedgerTable
          karigars={karigars}
          transactions={transactions}
          onSettleLabor={handleSettleLabor}
        />
      )}

      {activeTab === 'ORDERS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workOrders.map((wo) => (
            <div
              key={wo.id}
              className="bg-surface-900 border border-surface-700/60 rounded-xl p-4 flex flex-col justify-between hover:border-surface-600 transition-colors shadow-sm"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono font-bold text-brand-400">{wo.id}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-surface-800 text-surface-300 border border-surface-700">
                    {wo.stage.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-surface-100">{wo.articleName}</h4>
                <div className="text-xs text-surface-400 mt-1">Artisan: {wo.karigarName}</div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs bg-surface-950 p-2.5 rounded-lg border border-surface-800/80 font-mono">
                  <div>
                    <span className="text-surface-500 text-[10px] block font-sans">Metal Issued:</span>
                    <span className="text-amber-400 font-bold">{wo.weightIssued.toFixed(3)} g</span>
                  </div>
                  <div>
                    <span className="text-surface-500 text-[10px] block font-sans">Target Weight:</span>
                    <span className="text-surface-200 font-bold">{wo.targetGrossWeight.toFixed(3)} g</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-surface-400">Production Progress</span>
                    <span className="text-brand-400 font-bold">{wo.progress}%</span>
                  </div>
                  <div className="w-full bg-surface-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${wo.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-800 flex justify-between items-center text-xs text-surface-400">
                <span>Due Date: {wo.dueDate}</span>
                <button
                  onClick={() => setIsReceiveModalOpen(true)}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                >
                  Receive Finished <ArrowDownLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ALLOY_CALCULATOR' && <AlloyConversionCalculator />}

      {/* Modals */}
      <IssueMetalModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onIssueMetal={handleIssueMetal}
        karigars={karigars}
      />

      <ReceiveGoodsModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        onReceiveGoods={handleReceiveGoods}
        karigars={karigars}
      />
    </div>
  );
};
