import React, { useState } from 'react';
import { 
  Sparkles, 
  Tv, 
  Eye, 
  ShoppingBag, 
  Layers 
} from 'lucide-react';
import { TabletLookbook } from './components/TabletLookbook';
import { CustomerSecondaryDisplay } from './components/CustomerSecondaryDisplay';

export const ShowroomWorkspace = () => {
  const [activeSubTab, setActiveSubTab] = useState('LOOKBOOK'); // 'LOOKBOOK', 'CUSTOMER_DISPLAY'

  return (
    <div className="space-y-6">
      {/* Subcategory Level 2 Tab Navigation */}
      <div className="flex border-b border-surface-800 text-xs font-semibold gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('LOOKBOOK')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'LOOKBOOK'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          In-Store Digital Lookbook &amp; Assisted Selling
        </button>
        <button
          onClick={() => setActiveSubTab('CUSTOMER_DISPLAY')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'CUSTOMER_DISPLAY'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <Tv className="w-4 h-4" />
          Customer-Facing Dual Screen &amp; Live QR
        </button>
      </div>

      {/* Tab Content */}
      {activeSubTab === 'LOOKBOOK' && <TabletLookbook />}
      {activeSubTab === 'CUSTOMER_DISPLAY' && <CustomerSecondaryDisplay />}
    </div>
  );
};
