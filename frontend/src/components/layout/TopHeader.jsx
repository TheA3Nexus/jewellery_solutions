import React, { useState, useRef } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useHardware } from '../../context/HardwareContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Scale, 
  Printer, 
  Radio, 
  Edit3, 
  UserCheck, 
  SlidersHorizontal,
  X,
  Check,
  Sun,
  Moon,
  CreditCard,
  Boxes,
  Layers,
  Coins,
  CalendarCheck,
  Hammer,
  BookOpen,
  TrendingUp,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'POS', label: 'POS & Sales', icon: CreditCard },
  { id: 'INVENTORY', label: 'Inventory & RFID', icon: Boxes },
  { id: 'SHOWROOM', label: 'Lookbook', icon: Layers },
  { id: 'GIRVI', label: 'Girvi Loans', icon: Coins },
  { id: 'SCHEMES', label: 'Savings Schemes', icon: CalendarCheck },
  { id: 'KARIGAR', label: 'Karigar Desk', icon: Hammer },
  { id: 'UDHAAR', label: 'Customer Udhaar', icon: BookOpen },
  { id: 'ACCOUNTS', label: 'Day Book & Accounts', icon: TrendingUp },
  { id: 'CRM', label: 'WhatsApp CRM', icon: MessageSquare },
  { id: 'SETTINGS', label: 'Settings', icon: SlidersHorizontal }
];

export const TopHeader = ({ activeCategory, setActiveCategory }) => {
  const { tenant, currentUser, bullionRates, updateRates } = useTenant();
  const { theme, toggleTheme } = useTheme();
  const navScrollRef = useRef(null);

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

  const scrollNav = (direction) => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({
        left: direction === 'left' ? -180 : 180,
        behavior: 'smooth'
      });
    }
  };

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
    <header className="sticky top-0 z-40 bg-surface-card border-b border-surface-border shadow-sm">
      {/* Upper Utility Strip: Bullion Ticker & Peripheral Status */}
      <div className="px-4 py-1.5 border-b border-surface-border/80 bg-surface-canvas/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Live Rates Ticker */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-[10px] font-sans font-bold text-emerald-700 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="uppercase tracking-wider">Live Rates</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-surface-400 font-sans">24K:</span>
            <strong className="text-brand-benchmark font-bold">₹{bullionRates.gold24k.toFixed(2)}/g</strong>
          </div>
          <span className="text-surface-700/60">&bull;</span>

          <div className="flex items-center gap-1.5">
            <span className="text-surface-400 font-sans">22K:</span>
            <strong className="text-brand-accent font-bold">₹{bullionRates.gold22k.toFixed(2)}/g</strong>
          </div>
          <span className="text-surface-700/60">&bull;</span>

          <div className="flex items-center gap-1.5">
            <span className="text-surface-400 font-sans">18K:</span>
            <strong className="text-brand-accent font-semibold">₹{bullionRates.gold18k.toFixed(2)}/g</strong>
          </div>
          <span className="text-surface-700/60">&bull;</span>

          <div className="flex items-center gap-1.5">
            <span className="text-surface-400 font-sans">Silver:</span>
            <strong className="text-surface-200 font-semibold">₹{bullionRates.silver.toFixed(2)}/g</strong>
          </div>

          <button
            type="button"
            onClick={() => setIsRateModalOpen(true)}
            className="p-1 text-surface-400 hover:text-brand-accent hover:bg-surface-hover rounded-md transition cursor-pointer"
            title="Modify Daily Rates & Premium"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hardware Status Strip */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Weighing Scale Pill */}
          <div 
            onClick={() => setIsScaleSimulatorOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 bg-surface-card hover:bg-surface-hover border border-surface-border hover:border-brand-accent/50 rounded-lg cursor-pointer transition shadow-2xs"
            title="Click to open Scale Controls & Simulator"
          >
            <Scale className={`w-3.5 h-3.5 ${isScaleStable ? 'text-emerald-700' : 'text-amber-700 animate-spin'}`} />
            <div className="text-[11px] leading-none">
              <span className="text-surface-400 font-sans text-[10px] mr-1">SCALE:</span>
              <strong className="text-surface-100 font-bold">{scaleWeight.toFixed(3)} GM</strong>
            </div>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-bold ${
              scaleStatus === 'ONLINE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-surface-hover text-surface-400'
            }`}>
              {scaleStatus}
            </span>
          </div>

          {/* Printer Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-surface-card border border-surface-border rounded-lg text-[10px] text-surface-400 font-sans">
            <Printer className="w-3.5 h-3.5 text-emerald-700" />
            <span>ZPL Ready</span>
          </div>

          {/* RFID Status */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-surface-card border border-surface-border rounded-lg text-[10px] text-surface-400 font-sans">
            <Radio className="w-3.5 h-3.5 text-sky-600" />
            <span>UHF RFID</span>
          </div>

          {/* Cashier Badge */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-surface-border text-[11px] text-surface-300 font-sans">
            <UserCheck className="w-3.5 h-3.5 text-brand-accent" />
            <span className="font-medium">{currentUser.name}</span>
          </div>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2 py-1 bg-surface-card hover:bg-surface-hover border border-surface-border rounded-lg text-[10px] text-surface-200 font-sans transition-all shadow-card cursor-pointer"
            title={`Active Theme: ${theme === 'light' ? 'Boutique Light' : 'Velvet Dark'}. Click to toggle.`}
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-brand-benchmark" />
                <span className="font-semibold text-surface-100">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-brand-accent" />
                <span className="font-semibold text-surface-100">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Brand & Category Navigation Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-6">
        
        {/* Brand Identity & Metadata */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-black text-sm shadow-sm ring-1 ring-brand-400/30">
            A3
          </div>
          <div className="space-y-0.5">
            <h1 className="font-bold text-sm tracking-wide text-surface-100 uppercase font-sans leading-none">
              {tenant.name}
            </h1>
            <div className="flex items-center gap-2 font-mono text-[10px] text-surface-400 whitespace-nowrap mt-0.5">
              <span className="font-medium text-surface-300">{tenant.branch}</span>
              <span className="text-surface-700/60">&bull;</span>
              <span className="px-1.5 py-0.2 rounded bg-surface-hover text-surface-200 border border-surface-border font-semibold">
                GSTIN: {tenant.gstin}
              </span>
              <span className="text-surface-700/60">&bull;</span>
              <span>BIS HUID: {tenant.bisLicenseNo}</span>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar (Clean Scrollable without any horizontal scrollbars) */}
        <div className="relative flex items-center min-w-0 flex-1 justify-end">
          <button
            type="button"
            onClick={() => scrollNav('left')}
            className="hidden 2xl:hidden lg:flex items-center justify-center p-1.5 text-surface-400 hover:text-surface-100 hover:bg-surface-hover rounded-md shrink-0 mr-1 cursor-pointer transition"
            aria-label="Scroll navigation left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <nav 
            ref={navScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-500 text-white font-semibold shadow-sm'
                      : 'text-surface-400 hover:text-surface-100 hover:bg-surface-hover font-medium'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => scrollNav('right')}
            className="hidden 2xl:hidden lg:flex items-center justify-center p-1.5 text-surface-400 hover:text-surface-100 hover:bg-surface-hover rounded-md shrink-0 ml-1 cursor-pointer transition"
            aria-label="Scroll navigation right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Daily Rates Modal */}
      {isRateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-surface-card border border-surface-border rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-accent" />
                <h3 className="text-sm font-bold text-surface-100">Update Daily Showroom Rates</h3>
              </div>
              <button 
                onClick={() => setIsRateModalOpen(false)}
                className="text-surface-400 hover:text-surface-100 p-1 rounded-lg cursor-pointer"
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
                  className="input-field text-brand-benchmark font-bold"
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
          <div className="bg-surface-card border border-surface-border rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-surface-100">Electronic Scale Control</h3>
              </div>
              <button 
                onClick={() => setIsScaleSimulatorOpen(false)}
                className="text-surface-400 hover:text-surface-100 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Weight Display */}
            <div className="bg-surface-canvas border border-surface-border rounded-xl p-4 text-center space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-surface-400 block font-mono">
                Current Tray Weight
              </span>
              <div className="text-3xl font-bold font-mono text-emerald-700 tracking-tight">
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
