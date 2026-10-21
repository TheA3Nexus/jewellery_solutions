import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useHardware } from '../../context/HardwareContext';
import { 
  Scale, 
  Printer, 
  Radio, 
  TrendingUp, 
  Edit3, 
  Building2, 
  UserCheck, 
  RefreshCw,
  SlidersHorizontal,
  X,
  Check
} from 'lucide-react';

export const TopHeader = ({ activeCategory, setActiveCategory }) => {
  const { tenant, currentUser, bullionRates, updateRates } = useTenant();
  const { 
    scaleStatus, 
    printerStatus, 
    rfidStatus, 
    scaleWeight, 
    isScaleStable,
    tareScale, 
    simulateWeightPlacement 
  } = useHardware();

  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isScaleSimulatorOpen, setIsScaleSimulatorOpen] = useState(false);

  // Rate Edit Form State
  const [tempRates, setTempRates] = useState({
    gold24k: bullionRates.gold24k,
    gold22k: bullionRates.gold22k,
    gold18k: bullionRates.gold18k,
    gold14k: bullionRates.gold14k,
    silver: bullionRates.silver,
  });

  const handleRateSubmit = (e) => {
    e.preventDefault();
    updateRates({
      gold24k: parseFloat(tempRates.gold24k),
      gold22k: parseFloat(tempRates.gold22k),
      gold18k: parseFloat(tempRates.gold18k),
      gold14k: parseFloat(tempRates.gold14k),
      silver: parseFloat(tempRates.silver),
    });
    setIsRateModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-900 border-b border-surface-800 shadow-md">
      {/* Upper Utility Strip: Bullion Ticker & Peripheral Status */}
      <div className="px-4 py-1.5 border-b border-surface-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Live Rates Ticker */}
        <div className="flex items-center gap-3 overflow-x-auto py-0.5 font-mono">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-950 border border-surface-800 text-[11px] font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-emerald-400 font-semibold uppercase tracking-wider">Live Rates</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-surface-400">24K:</span>
            <span className="text-brand-400 font-semibold">₹{bullionRates.gold24k.toFixed(2)}/g</span>
          </div>
          <span className="text-surface-700">|</span>

          <div className="flex items-center gap-2">
            <span className="text-surface-400">22K:</span>
            <span className="text-brand-400 font-semibold">₹{bullionRates.gold22k.toFixed(2)}/g</span>
          </div>
          <span className="text-surface-700">|</span>

          <div className="flex items-center gap-2">
            <span className="text-surface-400">18K:</span>
            <span className="text-brand-400 font-semibold">₹{bullionRates.gold18k.toFixed(2)}/g</span>
          </div>
          <span className="text-surface-700">|</span>

          <div className="flex items-center gap-2">
            <span className="text-surface-400">Silver:</span>
            <span className="text-surface-200 font-semibold">₹{bullionRates.silver.toFixed(2)}/g</span>
          </div>

          <button
            onClick={() => setIsRateModalOpen(true)}
            className="p-1 text-surface-400 hover:text-brand-400 hover:bg-surface-800 rounded transition"
            title="Modify Daily Rates & Premium"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hardware Status Strip */}
        <div className="flex items-center gap-2 font-mono">
          {/* Weighing Scale Pill */}
          <div 
            onClick={() => setIsScaleSimulatorOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 bg-surface-950 hover:bg-surface-850 border border-surface-800 hover:border-brand-500/50 rounded-lg cursor-pointer transition"
            title="Click to open Scale Controls & Simulator"
          >
            <Scale className={`w-3.5 h-3.5 ${isScaleStable ? 'text-emerald-400' : 'text-amber-400 animate-spin'}`} />
            <div className="text-[11px] leading-none">
              <span className="text-surface-400 font-sans text-[10px] mr-1">SCALE:</span>
              <strong className="text-surface-100 font-bold">{scaleWeight.toFixed(3)} GM</strong>
            </div>
            <span className={`text-[9px] px-1 py-0.2 rounded font-sans uppercase ${
              scaleStatus === 'ONLINE' ? 'bg-emerald-950 text-emerald-400' : 'bg-surface-800 text-surface-400'
            }`}>
              {scaleStatus}
            </span>
          </div>

          {/* Printer Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-surface-950 border border-surface-800 rounded-lg text-[10px] text-surface-400 font-sans">
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>ZPL Ready</span>
          </div>

          {/* RFID Status */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-surface-950 border border-surface-800 rounded-lg text-[10px] text-surface-400 font-sans">
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            <span>UHF RFID</span>
          </div>

          {/* Cashier Badge */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-surface-800 text-[11px] text-surface-300 font-sans">
            <UserCheck className="w-3.5 h-3.5 text-brand-400" />
            <span className="font-medium">{currentUser.name}</span>
          </div>
        </div>
      </div>

      {/* Main Brand & Category Level 1 Navigation */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-950 border border-brand-500/40 flex items-center justify-center text-brand-400 font-bold text-sm shadow-inner">
            A3
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-surface-100 uppercase">
                {tenant.name}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-800 text-surface-300 border border-surface-700">
                GST: {tenant.gstin}
              </span>
            </div>
            <p className="text-[10px] text-surface-400 flex items-center gap-2">
              <span>{tenant.branch}</span>
              <span>&bull;</span>
              <span>BIS HUID Lic: {tenant.bisLicenseNo}</span>
            </p>
          </div>
        </div>

        {/* Level 1 Category Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto text-xs font-medium">
          {[
            { id: 'POS', label: 'POS & Sales' },
            { id: 'INVENTORY', label: 'Inventory & RFID' },
            { id: 'SHOWROOM', label: 'Lookbook & Display' },
            { id: 'GIRVI', label: 'Girvi / Gold Loan' },
            { id: 'SCHEMES', label: 'Savings Schemes' },
            { id: 'KARIGAR', label: 'Karigar Desk' },
            { id: 'UDHAAR', label: 'Customer Udhaar' },
            { id: 'ACCOUNTS', label: 'Day Book & Accounts' },
            { id: 'CRM', label: 'CRM & WhatsApp' },
            { id: 'SETTINGS', label: 'Settings' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg transition-all text-xs font-semibold whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-brand-500 text-surface-950 shadow-sm'
                  : 'text-surface-300 hover:text-surface-100 hover:bg-surface-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Daily Rates Modal */}
      {isRateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-surface-800 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-surface-100">Update Daily Showroom Rates</h3>
              </div>
              <button 
                onClick={() => setIsRateModalOpen(false)}
                className="text-surface-400 hover:text-surface-100 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRateSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-surface-400 text-[11px] block mb-1">24K Pure Gold Rate (₹/Gram)</label>
                <input
                  type="number"
                  step="0.01"
                  value={tempRates.gold24k}
                  onChange={(e) => {
                    const g24 = parseFloat(e.target.value) || 0;
                    setTempRates({
                      ...tempRates,
                      gold24k: g24,
                      gold22k: parseFloat((g24 * 0.9167).toFixed(2)),
                      gold18k: parseFloat((g24 * 0.75).toFixed(2)),
                      gold14k: parseFloat((g24 * 0.5833).toFixed(2))
                    });
                  }}
                  className="input-field text-brand-300 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-surface-400 text-[11px] block mb-1">22K Gold (91.6%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={tempRates.gold22k}
                    onChange={(e) => setTempRates({ ...tempRates, gold22k: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-surface-400 text-[11px] block mb-1">18K Gold (75.0%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={tempRates.gold18k}
                    onChange={(e) => setTempRates({ ...tempRates, gold18k: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="text-surface-400 text-[11px] block mb-1">Silver Rate (₹/Gram for 99.9%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={tempRates.silver}
                  onChange={(e) => setTempRates({ ...tempRates, silver: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRateModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Apply & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scale Simulator & Controls Modal */}
      {isScaleSimulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-surface-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-surface-100">Electronic Scale Control</h3>
              </div>
              <button 
                onClick={() => setIsScaleSimulatorOpen(false)}
                className="text-surface-400 hover:text-surface-100 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Weight Display */}
            <div className="bg-surface-950 border border-surface-800 rounded-xl p-4 text-center space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-surface-400 block font-mono">
                Current Tray Weight
              </span>
              <div className="text-3xl font-bold font-mono text-emerald-400 tracking-tight">
                {scaleWeight.toFixed(3)} <span className="text-xs font-normal text-surface-400">GM</span>
              </div>
              <span className="text-[10px] text-surface-400 block font-mono">
                Status: {isScaleStable ? 'STABLE' : 'UNSTABLE MOTION'}
              </span>
            </div>

            {/* Simulator Shortcut Weights */}
            <div className="space-y-2">
              <label className="text-[11px] text-surface-400 block">Simulate Jewel Placement on Scale:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => simulateWeightPlacement(4.620)}
                  className="btn-secondary text-[11px] py-1.5"
                >
                  Ring (4.620g)
                </button>
                <button
                  onClick={() => simulateWeightPlacement(14.500)}
                  className="btn-secondary text-[11px] py-1.5"
                >
                  Chain (14.500g)
                </button>
                <button
                  onClick={() => simulateWeightPlacement(21.900)}
                  className="btn-secondary text-[11px] py-1.5"
                >
                  Bangle (21.900g)
                </button>
                <button
                  onClick={() => simulateWeightPlacement(45.000)}
                  className="btn-secondary text-[11px] py-1.5"
                >
                  Silver Kada (45g)
                </button>
              </div>
            </div>

            {/* Tare Button */}
            <button
              onClick={tareScale}
              className="w-full btn-secondary text-xs"
            >
              Zero / Tare Scale
            </button>
          </div>
        </div>
      )}
    </header>
  );
};