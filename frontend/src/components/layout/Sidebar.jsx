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
  UserCheck,
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
  const { tenant, currentUser } = useTenant();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside 
      className={`h-screen sticky top-0 bg-surface-card border-r border-surface-border flex flex-col justify-between transition-all duration-300 z-50 shrink-0 select-none ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* 1. Header & Brand Identity */}
      <div className="p-3.5 border-b border-surface-border/80">
        <div className="flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-black text-base shadow-sm ring-1 ring-brand-400/30 shrink-0">
              A3
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <h2 className="font-bold text-xs tracking-wide text-surface-100 uppercase truncate leading-snug">
                  {tenant.name}
                </h2>
                <p className="text-[10px] text-surface-400 truncate font-mono">
                  {tenant.branch}
                </p>
              </div>
            )}
          </div>

          {/* Collapse / Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-surface-400 hover:text-surface-100 hover:bg-surface-hover rounded-lg transition-colors shrink-0 cursor-pointer"
            title={isCollapsed ? 'Expand Side Panel' : 'Collapse Side Panel'}
            aria-label={isCollapsed ? 'Expand Side Panel' : 'Collapse Side Panel'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-brand-accent" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Showroom Credentials (Visible when expanded) */}
        {!isCollapsed && (
          <div className="mt-2.5 pt-2 border-t border-surface-border/50 font-mono text-[10px] text-surface-400 flex items-center justify-between gap-1">
            <span className="truncate font-semibold text-surface-300">GST: {tenant.gstin}</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-surface-hover text-surface-300 border border-surface-border shrink-0">
              HUID Active
            </span>
          </div>
        )}
      </div>

      {/* 2. Navigation Items List */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans transition-all cursor-pointer ${
                isCollapsed ? 'justify-center px-0' : ''
              } ${
                isActive
                  ? 'bg-brand-500 text-white font-bold shadow-sm'
                  : 'text-surface-400 hover:text-surface-100 hover:bg-surface-hover font-medium'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!isCollapsed && item.tag && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-surface-hover text-surface-400'
                }`}>
                  {item.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Footer: Active Staff & Theme Switcher */}
      <div className="p-3 border-t border-surface-border/80 bg-surface-canvas/40 space-y-2">
        {/* Cashier Badge */}
        <div className={`flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : 'px-1'}`}>
          <div className="w-7 h-7 rounded-lg bg-surface-hover border border-surface-border flex items-center justify-center text-brand-accent shrink-0">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-semibold text-surface-200 block truncate leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[9px] text-surface-400 block font-mono">
                Operator &bull; Counter 01
              </span>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`w-full flex items-center gap-2 py-1.5 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-hover text-[11px] text-surface-200 font-sans transition-all shadow-2xs cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : 'px-2.5'
          }`}
          title={`Active Theme: ${theme === 'light' ? 'Boutique Light' : 'Velvet Dark'}. Click to toggle.`}
        >
          {theme === 'light' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-brand-benchmark shrink-0" />
              {!isCollapsed && <span className="font-semibold text-surface-100 truncate">Boutique Light</span>}
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              {!isCollapsed && <span className="font-semibold text-surface-100 truncate">Velvet Dark</span>}
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
