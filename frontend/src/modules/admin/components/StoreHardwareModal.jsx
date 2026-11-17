import React from 'react';
import { 
  X, 
  Scale, 
  Printer, 
  Monitor, 
  CheckCircle2, 
  Radio, 
  HardDrive,
  Cpu
} from 'lucide-react';

export const StoreHardwareModal = ({ isOpen, onClose, store }) => {
  if (!isOpen || !store) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-card border border-surface-border rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex justify-between items-center border-b border-surface-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-canvas border border-surface-border text-surface-200 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-100">
                Connected Hardware &amp; Desks
              </h3>
              <p className="text-xs text-surface-400 truncate max-w-[320px]">
                {store.name} &bull; {store.city}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-100 p-1.5 rounded-lg hover:bg-surface-hover transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Counters Quota Strip */}
        <div className="grid grid-cols-2 gap-3 bg-surface-canvas/60 p-3 rounded-xl border border-surface-border text-xs">
          <div>
            <span className="text-surface-400">Allowed Billing Desks:</span>
            <p className="font-bold text-surface-100 font-mono text-sm mt-0.5">
              {store.maxCounters} Desks
            </p>
          </div>
          <div>
            <span className="text-surface-400">Currently Active Counters:</span>
            <p className="font-bold text-emerald-400 font-mono text-sm mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {store.activeCounters} Online
            </p>
          </div>
        </div>

        {/* Peripherals List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-surface-300 uppercase tracking-wider">
            Connected Showroom Peripherals
          </h4>

          <div className="space-y-2">
            {(store.hardwareTerminals || []).map((term) => {
              const Icon = term.type === 'SCALE' ? Scale :
                           term.type === 'PRINTER' ? Printer : Monitor;
              return (
                <div 
                  key={term.id}
                  className="p-3 rounded-xl border border-surface-border bg-surface-card flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-canvas border border-surface-border flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-brand-400" />
                    </div>
                    <div>
                      <p className="font-bold text-surface-100">{term.name}</p>
                      <p className="text-[11px] text-surface-400 font-mono">
                        {term.model} {term.port ? `(${term.port})` : ''}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    {term.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-surface-border">
          <button
            onClick={onClose}
            className="btn-primary text-xs px-4 py-2"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
