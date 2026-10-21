import React, { useState } from 'react';
import { TenantProvider } from './context/TenantContext';
import { HardwareProvider } from './context/HardwareContext';
import { TopHeader } from './components/layout/TopHeader';
import { POSWorkspace } from './modules/pos/POSWorkspace';
import { InventoryWorkspace } from './modules/inventory/InventoryWorkspace';
import { ShowroomWorkspace } from './modules/showroom/ShowroomWorkspace';
import { GirviWorkspace } from './modules/girvi/GirviWorkspace';
import { SchemesWorkspace } from './modules/schemes/SchemesWorkspace';
import { KarigarWorkspace } from './modules/karigar/KarigarWorkspace';
import { CreditWorkspace } from './modules/credit/CreditWorkspace';
import { AccountsWorkspace } from './modules/accounts/AccountsWorkspace';
import { CRMWorkspace } from './modules/crm/CRMWorkspace';
import { SettingsWorkspace } from './modules/settings/SettingsWorkspace';
import { 
  CreditCard, 
  Tag, 
  Coins, 
  Sparkles, 
  Hammer, 
  BookOpen, 
  Settings as SettingsIcon,
  CheckCircle2,
  Layers
} from 'lucide-react';

function AppContent() {
  const [activeCategory, setActiveCategory] = useState('POS');

  const renderActiveCategory = () => {
    switch (activeCategory) {
      case 'POS':
        return <POSWorkspace />;
      case 'INVENTORY':
        return <InventoryWorkspace />;
      case 'SHOWROOM':
        return <ShowroomWorkspace />;
      case 'GIRVI':
        return <GirviWorkspace />;
      case 'SCHEMES':
        return <SchemesWorkspace />;
      case 'KARIGAR':
        return <KarigarWorkspace />;
      case 'UDHAAR':
        return <CreditWorkspace />;
      case 'ACCOUNTS':
        return <AccountsWorkspace />;
      case 'CRM':
        return <CRMWorkspace />;
      case 'SETTINGS':
        return <SettingsWorkspace />;
      default:
        return (
          <div className="card-surface p-12 text-center max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 bg-surface-850 text-brand-500 rounded-full flex items-center justify-center mx-auto border border-surface-700 shadow-xs">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-surface-100 uppercase tracking-wider">
                {activeCategory} Module
              </h3>
              <p className="text-xs text-surface-400 mt-1">
                This domain is queued for implementation in the next phase. Click <strong>POS &amp; Sales</strong> in the top bar to test the completed billing counter.
              </p>
            </div>
            <button
              onClick={() => setActiveCategory('POS')}
              className="btn-primary text-xs mx-auto"
            >
              Switch to POS Counter
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-surface-200 flex flex-col font-sans">
      <TopHeader activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-5">
        {renderActiveCategory()}
      </main>
      <footer className="border-t border-surface-800 bg-surface-900 py-3 px-4 text-center text-xs text-surface-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 font-mono text-[11px]">
          <span className="font-semibold text-surface-300">A3 Jewellery Solution &bull; Luxury Showroom ERP</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Section 269ST &amp; Rule 114B Enforced</span>
            </span>
            <span className="text-surface-700">&bull;</span>
            <span className="text-surface-400 font-medium">BIS HUID Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TenantProvider>
      <HardwareProvider>
        <AppContent />
      </HardwareProvider>
    </TenantProvider>
  );
}
