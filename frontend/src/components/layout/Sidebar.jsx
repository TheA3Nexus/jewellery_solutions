import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useTenant } from '../../context/TenantContext';
import { 
  Building2,
  CreditCard, 
  Boxes, 
  Layers, 
  Coins, 
  CalendarCheck, 
  Hammer, 
  BookOpen, 
  TrendingUp, 
  MessageSquare, 
  SlidersHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'POS', label: 'POS & Counter Sales', icon: CreditCard, tag: 'Counter' },
  { id: 'INVENTORY', label: 'Inventory & RFID', icon: Boxes },
  { id: 'SHOWROOM', label: 'Showroom Lookbook', icon: Layers },
  { id: 'GIRVI', label: 'Girvi / Gold Loan', icon: Coins },
  { id: 'SCHEMES', label: 'Savings Schemes', icon: CalendarCheck },
  { id: 'KARIGAR', label: 'Karigar Desk', icon: Hammer },
  { id: 'UDHAAR', label: 'Customer Udhaar', icon: BookOpen },
  { id: 'ACCOUNTS', label: 'Day Book & Accounts', icon: TrendingUp },
  { id: 'CRM', label: 'WhatsApp CRM', icon: MessageSquare },
  { id: 'SETTINGS', label: 'System Settings', icon: SlidersHorizontal }
];

export const Sidebar = ({ activeCategory, setActiveCategory, isCollapsed, setIsCollapsed }) => {
  const { theme, toggleTheme } = useTheme();
  const { clientStores, isImpersonating } = useTenant();

  return (
    <aside 
      className={`h-full bg-surface-card border-r border-surface-border flex flex-col justify-between transition-all duration-300 ease-in-out z-30 shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* 1. Navigation Items List: Starts directly at the top with rock-solid fixed geometry */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-1">
        {/* Master Platform Admin Command Item */}
        <div className="pb-2 mb-2 border-b border-surface-border">
          <button
            id="nav-item-master-admin"
            onClick={() => setActiveCategory('MASTER_ADMIN')}
            className={`w-full h-11 rounded-xl flex items-center px-1 transition-all cursor-pointer relative overflow-hidden ${
              activeCategory === 'MASTER_ADMIN'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white font-black shadow-xs ring-1 ring-brand-400/40'
                : 'bg-surface-canvas/80 text-brand-400 hover:text-brand-300 hover:bg-surface-hover border border-brand-500/30 font-bold'
            }`}
            title={isCollapsed ? 'Master Jeweller Clients' : undefined}
          >
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <Building2 className={`w-4 h-4 shrink-0 ${activeCategory === 'MASTER_ADMIN' ? 'text-white' : 'text-brand-400'}`} />
            </div>

            {!isCollapsed && (
              <div className="flex items-center justify-between min-w-0 flex-1 pl-1 pr-2">
                <span className="truncate text-xs font-bold font-sans text-left">
                  Master Dashboard
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0 ml-1 ${
                  activeCategory === 'MASTER_ADMIN'
                    ? 'bg-white/20 text-white'
                    : 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
                }`}>
                  {clientStores?.length || 7} Stores
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Store Modules Subheading */}
        {!isCollapsed && (
          <div className="px-2 pt-1 pb-1 flex items-center justify-between text-[10px] font-bold text-surface-400 uppercase tracking-wider font-mono">
            <span>Store Operations</span>
            {isImpersonating && (
              <span className="text-[9px] text-amber-400 font-bold normal-case">
                Live Store
              </span>
            )}
          </div>
        )}

        {/* Store Operation Modules */}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id.toLowerCase()}`}
              onClick={() => setActiveCategory(item.id)}
              className={`w-full h-10 rounded-xl flex items-center px-1 transition-all cursor-pointer relative overflow-hidden ${
                isActive
                  ? 'bg-brand-500 text-white font-bold shadow-xs'
                  : 'text-surface-400 hover:text-surface-100 hover:bg-surface-hover font-medium'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Anchored 40px Icon Slot */}
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 shrink-0" />
              </div>

              {/* Text Label & Tag */}
              {!isCollapsed && (
                <div className="flex items-center justify-between min-w-0 flex-1 pl-1 pr-2">
                  <span className="truncate text-xs font-sans text-left">
                    {item.label}
                  </span>
                  {item.tag && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold shrink-0 ml-1 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-surface-hover text-surface-300'
                    }`}>
                      {item.tag}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Bottom Rail: Theme Switcher & Quick Drawer Collapse Button */}
      <div className="p-2 border-t border-surface-border bg-surface-canvas/40 space-y-1.5 shrink-0">
        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full h-9 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-hover text-surface-200 text-xs font-sans transition-all shadow-2xs cursor-pointer flex items-center px-1"
          title={`Active: ${theme === 'light' ? 'Light theme' : 'Dark theme'}. Click to switch.`}
          aria-label={theme === 'light' ? 'Light theme' : 'Dark theme'}
        >
          <div className="w-10 h-9 flex items-center justify-center shrink-0">
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-brand-benchmark shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-brand-accent shrink-0" />
            )}
          </div>
          {!isCollapsed && (
            <span className="truncate text-xs font-medium text-surface-100 pl-1 pr-2">
              {theme === 'light' ? 'Light theme' : 'Dark theme'}
            </span>
          )}
        </button>

        {/* Quick Drawer Collapse / Expand Button */}
        {setIsCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full h-8 rounded-lg hover:bg-surface-hover text-surface-400 hover:text-surface-100 flex items-center px-1 transition-all cursor-pointer relative overflow-hidden"
            title={isCollapsed ? 'Expand Navigation Rail' : 'Collapse Navigation Rail'}
            aria-label="Toggle Navigation Rail"
          >
            <div className="w-10 h-8 flex items-center justify-center shrink-0">
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-brand-accent shrink-0" />
              ) : (
                <PanelLeftClose className="w-4 h-4 shrink-0" />
              )}
            </div>

            {!isCollapsed && (
              <span className="truncate text-xs font-sans text-surface-400 pl-1 pr-2">
                Collapse Sidebar
              </span>
            )}
          </button>
        )}
      </div>
    </aside>
  );
};
