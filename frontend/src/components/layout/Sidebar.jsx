import React from 'react';
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
  Moon
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

  return (
    <aside 
      className={`h-full bg-surface-card border-r border-surface-border flex flex-col justify-between transition-all duration-300 ease-in-out z-30 shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* 1. Navigation Items List: Starts directly at the top with rock-solid fixed geometry */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-1">
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
              {/* Anchored 40px Icon Slot: Exactly 12px from sidebar left edge in both states */}
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 shrink-0" />
              </div>

              {/* Text Label & Tag: Rendered cleanly when expanded */}
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

        {/* Quick Drawer Collapse / Expand Button: Zero Movement Anchored Icon */}
        {setIsCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full h-8 rounded-lg hover:bg-surface-hover text-surface-400 hover:text-surface-100 flex items-center px-1 transition-all cursor-pointer relative overflow-hidden"
            title={isCollapsed ? 'Expand Navigation Rail' : 'Collapse Navigation Rail'}
            aria-label="Toggle Navigation Rail"
          >
            {/* Anchored 40px Icon Slot: Exactly 12px from sidebar left edge in both states */}
            <div className="w-10 h-8 flex items-center justify-center shrink-0">
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-brand-accent shrink-0" />
              ) : (
                <PanelLeftClose className="w-4 h-4 shrink-0" />
              )}
            </div>

            {/* Text Label: Only shown when open */}
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
