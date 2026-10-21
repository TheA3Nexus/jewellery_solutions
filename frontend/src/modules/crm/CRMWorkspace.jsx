import React, { useState } from 'react';
import { 
  MessageCircle, 
  Award, 
  Send, 
  Gift 
} from 'lucide-react';
import { WhatsAppAutomations } from './components/WhatsAppAutomations';
import { LoyaltyClub } from './components/LoyaltyClub';

export const CRMWorkspace = () => {
  const [activeSubTab, setActiveSubTab] = useState('AUTOMATIONS'); // 'AUTOMATIONS', 'LOYALTY'

  return (
    <div className="space-y-6">
      {/* Subcategory Level 2 Tab Navigation */}
      <div className="flex border-b border-surface-800 text-xs font-semibold gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('AUTOMATIONS')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'AUTOMATIONS'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp Cloud API Automations &amp; Broadcasts
        </button>
        <button
          onClick={() => setActiveSubTab('LOYALTY')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'LOYALTY'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <Award className="w-4 h-4" />
          Loyalty Rewards &amp; VIP Club Tiers
        </button>
      </div>

      {/* Tab Content */}
      {activeSubTab === 'AUTOMATIONS' && <WhatsAppAutomations />}
      {activeSubTab === 'LOYALTY' && <LoyaltyClub />}
    </div>
  );
};
