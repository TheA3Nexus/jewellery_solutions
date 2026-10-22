import React from 'react';
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
  PanelLeftOpen
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

      {/* 2. Bottom Rail: Quick Drawer Collapse Button */}
      {setIsCollapsed && (
        <div className="p-2 border-t border-surface-border bg-surface-canvas/40 flex items-center justify-center shrink-0">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full h-8 rounded-lg hover:bg-surface-hover text-surface-400 hover:text-surface-100 flex items-center justify-center gap-2 text-xs font-mono transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Navigation Rail' : 'Collapse Navigation Rail'}
            aria-label="Toggle Navigation Rail"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-brand-accent" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4" />
                <span className="text-[10px] text-surface-400 font-sans">Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
};
