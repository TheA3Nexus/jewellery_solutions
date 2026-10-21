import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { StockCatalogTable } from './components/StockCatalogTable';
import { AddItemModal } from './components/AddItemModal';
import { RfidTrayAudit } from './components/RfidTrayAudit';
import { TagStudioZpl } from './components/TagStudioZpl';
import { StockAgingAnalytics } from './components/StockAgingAnalytics';
import { 
  Layers, 
  Radio, 
  Tag, 
  Hourglass, 
  Plus, 
  Boxes, 
  ShieldCheck
} from 'lucide-react';

export const InventoryWorkspace = () => {
  const { products, bullionRates } = useTenant();

  // Subcategory Level 2 Tab: 'CATALOG' | 'RFID_AUDIT' | 'TAG_STUDIO' | 'AGING'
  const [activeSubcategory, setActiveSubcategory] = useState('CATALOG');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tagTargetItem, setTagTargetItem] = useState(null);

  const handleOpenTagStudioWithItem = (item) => {
    setTagTargetItem(item);
    setActiveSubcategory('TAG_STUDIO');
  };

  const handleAddNewItem = (newItem) => {
    // In production, syncs with backend database
    products.unshift(newItem);
    alert(`Article "${newItem.name}" (${newItem.id}) registered successfully in ${newItem.trayNo}.`);
  };

  return (
    <div className="space-y-4">
      
      {/* Subcategory Level 2 Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between border-b border-surface-800 pb-2 gap-2">
        <div className="flex items-center gap-1 font-sans text-xs">
          {[
            { id: 'CATALOG', label: 'Stock Explorer & Catalog', icon: Layers },
            { id: 'RFID_AUDIT', label: '1-Click RFID Tray Audit', icon: Radio },
            { id: 'TAG_STUDIO', label: 'Barcode & ZPL Tag Studio', icon: Tag },
            { id: 'AGING', label: 'Stock Aging & Capital Analytics', icon: Hourglass }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubcategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubcategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition ${
                  isActive
                    ? 'bg-surface-800 text-brand-400 border border-brand-500/40 shadow-sm'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary py-1.5 px-3 text-xs font-sans font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Article</span>
        </button>
      </div>

      {/* Subcategory 1: Stock Explorer & Catalog */}
      {activeSubcategory === 'CATALOG' && (
        <StockCatalogTable 
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenTagStudio={handleOpenTagStudioWithItem}
        />
      )}

      {/* Subcategory 2: 1-Click RFID Smart Tray Audit */}
      {activeSubcategory === 'RFID_AUDIT' && (
        <RfidTrayAudit />
      )}

      {/* Subcategory 3: Barcode & ZPL Tag Studio */}
      {activeSubcategory === 'TAG_STUDIO' && (
        <TagStudioZpl initialItem={tagTargetItem} />
      )}

      {/* Subcategory 4: Stock Aging & Capital Analytics */}
      {activeSubcategory === 'AGING' && (
        <StockAgingAnalytics />
      )}

      {/* Add New Jewellery Article Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddNewItem}
        bullionRates={bullionRates}
      />

    </div>
  );
};