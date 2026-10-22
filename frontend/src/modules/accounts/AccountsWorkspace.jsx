import React, { useState } from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  FileText, 
  Building2, 
  Coins, 
  IndianRupee,
  Layers,
  Scale
} from 'lucide-react';
import { DailyRojnamcha } from './components/DailyRojnamcha';
import { ItemProfitLossTable } from './components/ItemProfitLossTable';
import { GstTaxSummary } from './components/GstTaxSummary';
import { FinancialStatements } from './components/FinancialStatements';

export const AccountsWorkspace = () => {
  const [activeSubTab, setActiveSubTab] = useState('ROJNAMCHA');

  return (
    <div className="space-y-6">
      {/* Subcategory Level 2 Tab Navigation */}
      <div className="flex border-b border-surface-800 text-xs font-semibold gap-1 overflow-x-auto">
        <button
          id="tab-rojnamcha"
          onClick={() => setActiveSubTab('ROJNAMCHA')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'ROJNAMCHA'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Daily Rojnamcha &amp; Cash Counter
        </button>
        <button
          id="tab-profit-loss"
          onClick={() => setActiveSubTab('PROFIT_LOSS')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'PROFIT_LOSS'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Item-by-Item Profit &amp; Loss
        </button>
        <button
          id="tab-gst-radar"
          onClick={() => setActiveSubTab('GST_RADAR')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'GST_RADAR'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          GST Returns (GSTR-1, 3B, HSN)
        </button>
        <button
          id="tab-statements"
          onClick={() => setActiveSubTab('STATEMENTS')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'STATEMENTS'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Balance Sheet &amp; General Ledger
        </button>
      </div>

      {/* Subcategory Content */}
      {activeSubTab === 'ROJNAMCHA' && <DailyRojnamcha />}
      {activeSubTab === 'PROFIT_LOSS' && <ItemProfitLossTable />}
      {activeSubTab === 'GST_RADAR' && <GstTaxSummary />}
      {activeSubTab === 'STATEMENTS' && <FinancialStatements />}
    </div>
  );
};
