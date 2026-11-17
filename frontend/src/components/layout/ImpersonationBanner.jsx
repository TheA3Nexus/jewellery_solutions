import React from 'react';
import { useTenant } from '../../context/TenantContext';
import { 
  Building2, 
  ExternalLink, 
  ArrowLeft, 
  ShieldCheck, 
  ChevronDown, 
  Store,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const ImpersonationBanner = ({ onExitToMasterAdmin }) => {
  const { 
    isImpersonating, 
    activeStore, 
    clientStores, 
    enterStore, 
    exitToMasterAdmin 
  } = useTenant();

  if (!isImpersonating || !activeStore) return null;

  const handleExit = () => {
    exitToMasterAdmin();
    if (onExitToMasterAdmin) {
      onExitToMasterAdmin();
    }
  };

  const handleSwitchStore = (e) => {
    const targetStoreId = e.target.value;
    if (targetStoreId) {
      enterStore(targetStoreId);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-brand-500/40 text-surface-100 px-3 py-1.5 text-xs shadow-md shrink-0 z-50 select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Left: Store Identification */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super-Admin Mode</span>
          </div>

          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-surface-400">Viewing Store:</span>
            <strong className="text-brand-300 font-bold tracking-wide">
              {activeStore.name}
            </strong>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-card border border-surface-border text-surface-300">
              {activeStore.id}
            </span>
            <span className="text-surface-400">&bull;</span>
            <span className="text-surface-300 font-medium">{activeStore.city}</span>
          </div>

          <span className="hidden md:inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
            {activeStore.planName}
          </span>
        </div>

        {/* Right: Quick Switcher Dropdown & Exit Button */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Quick Store Switcher */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-surface-400 hidden lg:inline">Switch Store:</span>
            <select
              value={activeStore.id}
              onChange={handleSwitchStore}
              className="bg-surface-card border border-brand-500/30 rounded-lg px-2 py-1 text-[11px] text-brand-300 font-semibold focus:outline-none focus:border-brand-400 cursor-pointer"
            >
              {clientStores.map((s) => (
                <option key={s.id} value={s.id} className="bg-surface-card text-surface-100">
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          {/* Exit to Master Dashboard */}
          <button
            id="exit-to-master-admin-btn"
            onClick={handleExit}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-xs transition cursor-pointer"
            title="Exit Store and return to SaaS Platform Master Admin"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Master Admin (डैशबोर्ड लौटें)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
