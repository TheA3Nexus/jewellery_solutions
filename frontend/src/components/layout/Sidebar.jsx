import React from 'react';
import { useTenant } from '../../context/TenantContext';
import { useTheme } from '../../context/ThemeContext';
import { 
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
  UserCheck
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
  const { tenant, currentUser } = useTenant();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside 
      className={`h-screen sticky top-0 bg-surface-card border-r border-surface-border flex flex-col justify-between transition-all duration-300 ease-in-out z-50 shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* 1. Header: Fixed 64px (h-16) Height in BOTH states for Zero Vertical Shift */}
      <div className="h-16 shrink-0 border-b border-surface-border flex items-center px-2">
        {!isCollapsed ? (
          <div className="w-full h-10 flex items-center justify-between px-1">
            {/* Showroom Brand Logo & Name */}
            <div className="flex items-center gap-2 overflow-hidden min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-black text-xs shadow-xs shrink-0 ring-1 ring-brand-400/30">
                A3
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-xs tracking-wide text-surface-100 uppercase truncate leading-snug">
                  {tenant.name}
                </h2>
                <p className="text-[10px] text-surface-400 truncate font-mono">
                  {tenant.branch}
                </p>
              </div>
            </div>

            {/* Collapse Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 text-surface-400 hover:text-surface-100 hover:bg-surface-hover rounded-lg transition-colors shrink-0 cursor-pointer"
              title="Collapse Side Panel"
              aria-label="Collapse Side Panel"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Collapsed State: Expand Button Centered in Fixed 64px Header */
          <div className="w-full h-10 flex items-center justify-center px-1">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="w-10 h-10 rounded-xl hover:bg-surface-hover flex items-center justify-center text-surface-400 hover:text-brand-accent transition-colors cursor-pointer group"
              title="Expand Side Panel"
              aria-label="Expand Side Panel"
            >
              <PanelLeftOpen className="w-5 h-5 text-brand-accent transition-transform group-hover:scale-110" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Navigation Items List: Strict Fixed Geometry for Zero Movement */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              className={`w-full h-10 rounded-xl flex items-center px-1 transition-all cursor-pointer relative overflow-hidden ${
                isActive
                  ? 'bg-brand-500 text-white font-bold shadow-xs'
                  : 'text-surface-400 hover:text-surface-100 hover:bg-surface-hover font-medium'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Anchored 40px Icon Slot: Exactly 12px from sidebar left edge in both states */}
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 shrink-0" />
              </div>

              {/* Text Label & Tag: Only rendered when expanded */}
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

      {/* 3. Footer: Operator Badge & Theme Switcher */}
      <div className="p-2 border-t border-surface-border bg-surface-canvas/40 space-y-1.5 shrink-0">
        {/* Cashier Badge */}
        <div 
          className="w-full h-9 flex items-center px-1"
          title={isCollapsed ? `${currentUser.name} (Operator - Counter 01)` : undefined}
        >
          <div className="w-10 h-9 flex items-center justify-center shrink-0">
            <div className="w-7 h-7 rounded-lg bg-surface-hover border border-surface-border flex items-center justify-center text-brand-accent">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1 pl-1 pr-2">
              <span className="text-[11px] font-semibold text-surface-200 block truncate leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[9px] text-surface-400 block font-mono truncate">
                Operator &bull; Counter 01
              </span>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full h-8 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-hover text-[11px] text-surface-200 font-sans transition-all shadow-2xs cursor-pointer flex items-center px-1"
          title={`Active Theme: ${theme === 'light' ? 'Boutique Light' : 'Velvet Dark'}. Click to toggle.`}
        >
          <div className="w-10 h-8 flex items-center justify-center shrink-0">
            {theme === 'light' ? (
              <Sun className="w-3.5 h-3.5 text-brand-benchmark" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-brand-accent" />
            )}
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-surface-100 truncate pl-1 pr-2">
              {theme === 'light' ? 'Boutique Light' : 'Velvet Dark'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
