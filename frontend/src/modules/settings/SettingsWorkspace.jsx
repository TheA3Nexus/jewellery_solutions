import React, { useState } from 'react';
import { 
  Building2, 
  Coins, 
  Cpu, 
  ShieldCheck, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { StoreProfileForm } from './components/StoreProfileForm';
import { RateFormulaPresets } from './components/RateFormulaPresets';
import { HardwareGatewayBridge } from './components/HardwareGatewayBridge';
import { SecurityBackupSettings } from './components/SecurityBackupSettings';

export const SettingsWorkspace = () => {
  const [activeSubTab, setActiveSubTab] = useState('PROFILE');

  return (
    <div className="space-y-6">
      {/* Subcategory Level 2 Tab Navigation */}
      <div className="flex border-b border-surface-800 text-xs font-semibold gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('PROFILE')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'PROFILE'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Store Profile &amp; Statutory Licenses
        </button>
        <button
          onClick={() => setActiveSubTab('RATES')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'RATES'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <Coins className="w-4 h-4" />
          Bullion Rate Derivation &amp; LED Board
        </button>
        <button
          onClick={() => setActiveSubTab('HARDWARE')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'HARDWARE'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Hardware Gateway Bridge (Scale, Zebra, RFID)
        </button>
        <button
          onClick={() => setActiveSubTab('SECURITY')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'SECURITY'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-surface-400 hover:text-surface-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Cloud Backups, Security &amp; RBAC
        </button>
      </div>

      {/* Subcategory Content */}
      {activeSubTab === 'PROFILE' && <StoreProfileForm />}
      {activeSubTab === 'RATES' && <RateFormulaPresets />}
      {activeSubTab === 'HARDWARE' && <HardwareGatewayBridge />}
      {activeSubTab === 'SECURITY' && <SecurityBackupSettings />}
    </div>
  );
};
