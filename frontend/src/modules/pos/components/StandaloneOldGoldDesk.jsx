import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { useHardware } from '../../../context/HardwareContext';
import { 
  Coins, 
  Scale, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  UserCheck, 
  CreditCard, 
  Building2, 
  ShieldCheck, 
  RotateCcw, 
  Receipt, 
  Search,
  ExternalLink,
  QrCode
} from 'lucide-react';

export const StandaloneOldGoldDesk = () => {
  const { tenant, currentUser, bullionRates, oldGoldVouchers, recordOldGoldVoucher, updateOldGoldVoucherStatus } = useTenant();
  const { scaleWeight, isScaleStable } = useHardware();

  // Active Sub-Tab: 'NEW_ASSESSMENT' | 'VOUCHERS_REGISTER'
  const [activeTab, setActiveTab] = useState('NEW_ASSESSMENT');

  // Customer KYC Information
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    pan: '',
    city: '',
    idType: 'AADHAAR',
    idNumber: '',
    purpose: 'EXCHANGE_VOUCHER' // 'EXCHANGE_VOUCHER' | 'CASH_LIQUIDATION' | 'FAMILY_MELTING'
  });

  // Multiple Scrap Items
  const [items, setItems] = useState([
    {
      id: 'scrap-1',
      description: 'Old Broken 22K Bangle',
      metal: 'Gold', // 'Gold' | 'Silver'
      grossWeight: '',
      lessWeight: '',
      purityPercent: 88.5,
      customRate: ''
    }
  ]);

  // Settlement Configuration
  const [settlement, setSettlement] = useState({
    mode: 'SHOWROOM_VOUCHER', // 'SHOWROOM_VOUCHER' | 'BANK_TRANSFER' | 'UPI_TRANSFER' | 'CASH'
    bankName: '',
    accountNo: '',
    ifsc: '',
    upiId: '',
    remarks: ''
  });

  // Statutory Ownership Declaration Checkbox
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);

  // Selected Voucher for Printable Modal
  const [printableVoucher, setPrintableVoucher] = useState(null);

  // Search filter for History Register
  const [searchQuery, setSearchQuery] = useState('');

  // Default Scrap Rates (24K pure minus standard 2% refinery charge)
  const defaultGoldScrapRate = Math.round((bullionRates.gold24k || 14607) * 0.98);
  const defaultSilverScrapRate = Math.round((bullionRates.silver || 229.90) * 0.98);

  // Add Item Row
  const handleAddItem = (metalType = 'Gold') => {
    setItems(prev => [
      ...prev,
      {
        id: `scrap-${Date.now()}`,
        description: metalType === 'Gold' ? 'Broken Gold Jewellery' : 'Silver Utensil / Ornament',
        metal: metalType,
        grossWeight: '',
        lessWeight: '',
        purityPercent: metalType === 'Gold' ? 84.0 : 92.5,
        customRate: ''
      }
    ]);
  };

  // Remove Item Row
  const handleRemoveItem = (id) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // Update Item Property
  const handleUpdateItem = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Read scale weight into specific item
  const handleReadScaleForItem = (id) => {
    if (scaleWeight > 0) {
      handleUpdateItem(id, 'grossWeight', scaleWeight.toFixed(3));
    }
  };

  // Preset Purity Chips
  const purityPresets = {
    Gold: [
      { label: '22K (91.67%)', value: 91.67 },
      { label: '20K (83.33%)', value: 83.33 },
      { label: '18K (75.00%)', value: 75.00 },
      { label: 'Traditional (84.0%)', value: 84.00 },
      { label: 'Old Unmarked (70.0%)', value: 70.00 }
    ],
    Silver: [
      { label: 'Fine 999 (99.9%)', value: 99.90 },
      { label: 'Sterling 925 (92.5%)', value: 92.50 },
      { label: 'Traditional 800 (80.0%)', value: 80.00 }
    ]
  };

  // Calculate financials per item and totals
  const itemValuations = items.map(item => {
    const gross = parseFloat(item.grossWeight) || 0;
    const less = parseFloat(item.lessWeight) || 0;
    const net = Math.max(0, gross - less);
    const purity = parseFloat(item.purityPercent) || 0;
    const fineWeight = (net * purity) / 100;
    const defaultRate = item.metal === 'Silver' ? defaultSilverScrapRate : defaultGoldScrapRate;
    const scrapRate = item.customRate ? parseFloat(item.customRate) : defaultRate;
    const amount = Math.round(fineWeight * scrapRate);

    return {
      ...item,
      net,
      fineWeight,
      scrapRate,
      amount
    };
  });

  const totals = itemValuations.reduce((acc, curr) => ({
    gross: acc.gross + (parseFloat(curr.grossWeight) || 0),
    less: acc.less + (parseFloat(curr.lessWeight) || 0),
    net: acc.net + curr.net,
    fine: acc.fine + curr.fineWeight,
    amount: acc.amount + curr.amount
  }), { gross: 0, less: 0, net: 0, fine: 0, amount: 0 });

  // Compliance Flags
  const isHighValue = totals.amount >= 200000;
  const isCashRestricted = settlement.mode === 'CASH' && totals.amount >= 200000;
  const isCashCaution = settlement.mode === 'CASH' && totals.amount >= 10000 && totals.amount < 200000;
  const isPanMissing = isHighValue && !customer.pan.trim();

  // Reset form
  const handleResetForm = () => {
    setCustomer({
      name: '',
      phone: '',
      pan: '',
      city: '',
      idType: 'AADHAAR',
      idNumber: '',
      purpose: 'EXCHANGE_VOUCHER'
    });
    setItems([{
      id: `scrap-${Date.now()}`,
      description: 'Old Broken 22K Bangle',
      metal: 'Gold',
      grossWeight: '',
      lessWeight: '',
      purityPercent: 88.5,
      customRate: ''
    }]);
    setSettlement({
      mode: 'SHOWROOM_VOUCHER',
      bankName: '',
      accountNo: '',
      ifsc: '',
      upiId: '',
      remarks: ''
    });
    setOwnershipConfirmed(false);
  };

  // Submit and Generate URD Voucher
  const handleGenerateVoucher = () => {
    if (!customer.name.trim()) {
      alert('Please enter Customer / Seller Name for the statutory URD Purchase Voucher.');
      return;
    }
    if (totals.gross <= 0 || totals.amount <= 0) {
      alert('Please enter valid scrap ornaments and weights to calculate valuation.');
      return;
    }
    if (isCashRestricted) {
      alert('Under Income Tax Section 269ST, cash payout of ₹2,00,000 or more is strictly illegal. Please choose Bank Transfer or Showroom Voucher.');
      return;
    }
    if (isPanMissing) {
      alert('Under Rule 114B, PAN card is legally mandatory for gold transactions of ₹2,00,000 or above.');
      return;
    }
    if (!ownershipConfirmed) {
      alert('Please check the customer statutory ownership declaration before proceeding.');
      return;
    }

    const voucherSeq = (oldGoldVouchers.length + 40).toString().padStart(4, '0');
    const voucherId = `URD-${new Date().getFullYear()}-${voucherSeq}`;
    const voucherRef = settlement.mode === 'SHOWROOM_VOUCHER' 
      ? `VCHR-A3-${Math.floor(1000 + Math.random() * 9000)}` 
      : settlement.mode === 'BANK_TRANSFER' 
        ? `IMPS/${settlement.bankName || 'BANK'}/${Date.now().toString().slice(-8)}`
        : settlement.mode === 'UPI_TRANSFER'
          ? `UPI/${settlement.upiId}/${Date.now().toString().slice(-6)}`
          : `CASH-PAID-${Date.now().toString().slice(-4)}`;

    const newVoucher = {
      id: voucherId,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      timestamp: new Date().toISOString(),
      customerName: customer.name,
      customerPhone: customer.phone,
      customerPan: customer.pan,
      customerCity: customer.city || 'Local Walk-in',
      idType: customer.idType,
      idNumber: customer.idNumber,
      items: itemValuations.map(i => ({
        id: i.id,
        name: i.description,
        metal: i.metal,
        grossWeight: parseFloat(i.grossWeight) || 0,
        lessWeight: parseFloat(i.lessWeight) || 0,
        netWeight: i.net,
        purityPercent: parseFloat(i.purityPercent) || 0,
        fineWeight: i.fineWeight,
        rate: i.scrapRate,
        amount: i.amount
      })),
      totalGross: totals.gross,
      totalLess: totals.less,
      totalNet: totals.net,
      totalFine: totals.fine,
      totalAmount: totals.amount,
      settlementMode: settlement.mode,
      settlementRef: voucherRef,
      status: settlement.mode === 'SHOWROOM_VOUCHER' ? 'VOUCHER_ISSUED' : 'PAID',
      remarks: settlement.remarks || `Assessment by ${currentUser?.name || 'Head Valuer'}`,
      cashier: currentUser?.name || 'Authorized Valuer'
    };

    recordOldGoldVoucher(newVoucher);
    setPrintableVoucher(newVoucher);
    handleResetForm();
  };

  // Filtered vouchers history
  const filteredVouchers = oldGoldVouchers.filter(v => {
    const q = searchQuery.toLowerCase();
    return (
      v.id.toLowerCase().includes(q) ||
      (v.customerName && v.customerName.toLowerCase().includes(q)) ||
      (v.customerPhone && v.customerPhone.includes(q)) ||
      (v.settlementRef && v.settlementRef.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Banner & Mode Toggle */}
      <div className="card-surface p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/30 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0 shadow-xs">
            <Coins className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-surface-100 uppercase tracking-wide">
                Old Gold &amp; Scrap Purchase Desk (URD Desk)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 font-sans font-bold">
                Section 31(3)(f) CGST Active
              </span>
            </div>
            <p className="text-xs text-surface-400 mt-0.5">
              Calculate melting loss, test tunch purity, verify customer KYC, and issue legally compliant URD Purchase Vouchers.
            </p>
          </div>
        </div>

        {/* Live Rates Benchmark Pill & View Toggle */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
          <div className="px-3 py-1.5 rounded-lg bg-surface-canvas border border-surface-border text-xs font-mono shrink-0">
            <span className="text-surface-400 text-[10px] block leading-none mb-1 font-sans">LIVE BUYBACK BENCHMARK:</span>
            <div className="flex items-center gap-3">
              <span className="text-brand-benchmark font-bold">24K: ₹{defaultGoldScrapRate}/g</span>
              <span className="text-surface-600">&bull;</span>
              <span className="text-surface-200 font-semibold">Ag: ₹{defaultSilverScrapRate}/g</span>
            </div>
          </div>

          <div className="flex items-center p-0.5 bg-surface-canvas border border-surface-border rounded-lg text-xs font-sans">
            <button
              type="button"
              onClick={() => setActiveTab('NEW_ASSESSMENT')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                activeTab === 'NEW_ASSESSMENT' 
                  ? 'bg-surface-card text-brand-accent shadow-xs border border-surface-border' 
                  : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              New Assessment
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('VOUCHERS_REGISTER')}
              className={`px-3 py-1 rounded-md font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'VOUCHERS_REGISTER' 
                  ? 'bg-surface-card text-brand-accent shadow-xs border border-surface-border' 
                  : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>URD Register ({oldGoldVouchers.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: NEW SCRAP ASSESSMENT DESK */}
      {activeTab === 'NEW_ASSESSMENT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Assessment Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Scrap Items Assessment Table */}
            <div className="card-surface p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-brand-400" />
                  <h3 className="text-xs font-bold text-surface-100 uppercase tracking-wider">
                    Scrap Metal Assessment &amp; Tunch Table
                  </h3>
                </div>

                {/* Scale Live Hook Indicator */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-canvas border border-surface-border text-xs font-mono">
                    <span className={`w-2 h-2 rounded-full ${isScaleStable ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                    <span className="text-[10px] text-surface-400 font-sans">LIVE SCALE:</span>
                    <strong className="text-surface-100">{scaleWeight.toFixed(3)}g</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddItem('Gold')}
                    className="px-2.5 py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-accent border border-brand-500/30 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Gold Item</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddItem('Silver')}
                    className="px-2.5 py-1 rounded-lg bg-surface-canvas hover:bg-surface-hover text-surface-200 border border-surface-border text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Silver Item</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {items.map((item, idx) => {
                  const val = itemValuations[idx];
                  const presets = purityPresets[item.metal] || purityPresets.Gold;

                  return (
                    <div 
                      key={item.id} 
                      className="p-3 rounded-lg bg-surface-canvas border border-surface-border hover:border-brand-accent/40 space-y-2.5 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-5 h-5 rounded-full bg-surface-card border border-surface-border text-[11px] font-mono font-bold flex items-center justify-center text-surface-300">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                            placeholder="Item description (e.g. Broken 22K Bangle)"
                            className="input-field text-xs font-semibold flex-1 py-1"
                          />
                          <select
                            value={item.metal}
                            onChange={(e) => handleUpdateItem(item.id, 'metal', e.target.value)}
                            className="input-field text-xs py-1 w-24 shrink-0 font-sans"
                          >
                            <option value="Gold">Gold (Au)</option>
                            <option value="Silver">Silver (Ag)</option>
                          </select>
                        </div>

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-surface-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition"
                            title="Remove this scrap item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Weight & Purity Metrics Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
                        {/* Gross Weight with Scale Hook */}
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-surface-400 mb-1">
                            <span>Gross Wt (g)</span>
                            {scaleWeight > 0 && (
                              <button
                                type="button"
                                onClick={() => handleReadScaleForItem(item.id)}
                                className="text-brand-accent hover:underline font-bold text-[9px]"
                                title="Click to fill from live digital scale"
                              >
                                &larr; Scale
                              </button>
                            )}
                          </div>
                          <input
                            type="number"
                            step="0.001"
                            placeholder="0.000"
                            value={item.grossWeight}
                            onChange={(e) => handleUpdateItem(item.id, 'grossWeight', e.target.value)}
                            className="input-field text-xs py-1"
                          />
                        </div>

                        {/* Less / Stone / Dirt / Wax */}
                        <div>
                          <label className="text-[10px] text-surface-400 block mb-1">Less / Dust (g)</label>
                          <input
                            type="number"
                            step="0.001"
                            placeholder="0.000"
                            value={item.lessWeight}
                            onChange={(e) => handleUpdateItem(item.id, 'lessWeight', e.target.value)}
                            className="input-field text-xs py-1"
                          />
                        </div>

                        {/* Net Weight (Readonly) */}
                        <div>
                          <label className="text-[10px] text-surface-400 block mb-1">Net Wt (g)</label>
                          <div className="px-2.5 py-1 rounded-md bg-surface-card border border-surface-border text-surface-100 font-bold">
                            {val.net.toFixed(3)}g
                          </div>
                        </div>

                        {/* Tested Purity / Tunch (%) */}
                        <div>
                          <label className="text-[10px] text-surface-400 block mb-1">Tunch / Purity %</label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="88.5"
                            value={item.purityPercent}
                            onChange={(e) => handleUpdateItem(item.id, 'purityPercent', e.target.value)}
                            className="input-field text-xs py-1"
                          />
                        </div>

                        {/* Scrap Buy Rate (₹/g) */}
                        <div>
                          <label className="text-[10px] text-surface-400 block mb-1">Rate (₹/g)</label>
                          <input
                            type="number"
                            placeholder={val.scrapRate.toString()}
                            value={item.customRate}
                            onChange={(e) => handleUpdateItem(item.id, 'customRate', e.target.value)}
                            className="input-field text-xs py-1"
                          />
                        </div>
                      </div>

                      {/* Quick Purity Preset Chips & Item Valuation Strip */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-surface-border/50 text-[11px]">
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                          <span className="text-[9px] text-surface-400 uppercase font-sans mr-1">Presets:</span>
                          {presets.map(p => (
                            <button
                              key={p.label}
                              type="button"
                              onClick={() => handleUpdateItem(item.id, 'purityPercent', p.value)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                                parseFloat(item.purityPercent) === p.value
                                  ? 'bg-brand-500/20 text-brand-accent border border-brand-500/40 font-bold'
                                  : 'bg-surface-card hover:bg-surface-hover text-surface-400 border border-surface-border'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-surface-400 text-[10px]">
                            24K Fine Wt: <strong className="text-surface-200">{val.fineWeight.toFixed(3)}g</strong>
                          </span>
                          <span className="text-surface-400 text-[10px]">
                            Valuation: <strong className="text-brand-accent text-xs">₹{val.amount.toLocaleString('en-IN')}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Assessment Grand Totals Bar */}
              <div className="p-3 rounded-lg bg-surface-canvas border border-surface-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-surface-400 text-[11px]">Total Gross Wt: </span>
                  <strong className="text-surface-100">{totals.gross.toFixed(3)}g</strong>
                </div>
                <div>
                  <span className="text-surface-400 text-[11px]">Total Less: </span>
                  <strong className="text-surface-300">{totals.less.toFixed(3)}g</strong>
                </div>
                <div>
                  <span className="text-surface-400 text-[11px]">Total Net Scrap: </span>
                  <strong className="text-surface-100">{totals.net.toFixed(3)}g</strong>
                </div>
                <div>
                  <span className="text-surface-400 text-[11px]">24K Pure Recoverable: </span>
                  <strong className="text-brand-benchmark font-bold">{totals.fine.toFixed(3)}g</strong>
                </div>
                <div className="text-right">
                  <span className="text-surface-400 text-[11px] block">TOTAL NET VALUATION:</span>
                  <strong className="text-brand-accent text-base font-bold">₹{totals.amount.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            {/* Statutory Compliance Alerts */}
            {isHighValue && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 flex items-start gap-2.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">High-Value Transaction Notice (Rule 114B &amp; Section 269ST):</strong>
                  <p className="text-[11px] mt-0.5 text-amber-800">
                    This scrap transaction total is ₹{totals.amount.toLocaleString('en-IN')} (&ge; ₹2,00,000). Customer PAN is legally mandatory on the URD Purchase Voucher. Cash payout is strictly restricted to prevent tax penalties.
                  </p>
                </div>
              </div>
            )}

            {isCashCaution && (
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-700 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[11px]">
                  Cash payout above ₹10,000 requires customer identification recorded on the voucher.
                </span>
              </div>
            )}
          </div>

          {/* Customer KYC & Settlement Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Customer KYC Profile Card */}
            <div className="card-surface p-3.5 space-y-3">
              <div className="flex items-center gap-2 border-b border-surface-border pb-2">
                <UserCheck className="w-4 h-4 text-brand-400" />
                <h3 className="text-xs font-bold text-surface-100 uppercase tracking-wider">
                  Seller KYC (URD Person)
                </h3>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div>
                  <label className="text-[10px] text-surface-400 block mb-1">Customer / Seller Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Smt. Sunita Sharma"
                    value={customer.name}
                    onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field text-xs py-1"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-surface-400 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98200 12345"
                    value={customer.phone}
                    onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    className="input-field text-xs py-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-surface-400 block mb-1">
                      PAN Card {isHighValue && <span className="text-amber-500 font-bold">*</span>}
                    </label>
                    <input
                      type="text"
                      placeholder="ABCPS1234F"
                      value={customer.pan}
                      onChange={(e) => setCustomer(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                      className={`input-field text-xs py-1 uppercase ${isPanMissing ? 'border-amber-500 ring-1 ring-amber-500' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-surface-400 block mb-1">City / Area</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={customer.city}
                      onChange={(e) => setCustomer(prev => ({ ...prev, city: e.target.value }))}
                      className="input-field text-xs py-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-surface-400 block mb-1">ID Proof Type</label>
                    <select
                      value={customer.idType}
                      onChange={(e) => setCustomer(prev => ({ ...prev, idType: e.target.value }))}
                      className="input-field text-xs py-1 font-sans"
                    >
                      <option value="AADHAAR">Aadhaar Card</option>
                      <option value="PAN">PAN Card</option>
                      <option value="VOTER_ID">Voter ID</option>
                      <option value="DRIVING_LIC">Driving License</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-surface-400 block mb-1">ID Last 4 Digits</label>
                    <input
                      type="text"
                      placeholder="XXXX-9812"
                      value={customer.idNumber}
                      onChange={(e) => setCustomer(prev => ({ ...prev, idNumber: e.target.value }))}
                      className="input-field text-xs py-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payout & Settlement Mode Card */}
            <div className="card-surface p-3.5 space-y-3">
              <div className="flex items-center gap-2 border-b border-surface-border pb-2">
                <CreditCard className="w-4 h-4 text-brand-400" />
                <h3 className="text-xs font-bold text-surface-100 uppercase tracking-wider">
                  Settlement &amp; Payout Method
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-2 font-sans">
                  {[
                    { id: 'SHOWROOM_VOUCHER', label: 'Store Credit Voucher', desc: 'To purchase new jewellery' },
                    { id: 'BANK_TRANSFER', label: 'Bank Transfer (IMPS)', desc: 'Direct NEFT/RTGS' },
                    { id: 'UPI_TRANSFER', label: 'UPI / PhonePe', desc: 'Instant account payout' },
                    { id: 'CASH', label: 'Cash Payout', desc: 'Subject to Sec 269ST' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSettlement(prev => ({ ...prev, mode: m.id }))}
                      className={`p-2 rounded-lg text-left transition border ${
                        settlement.mode === m.id
                          ? 'bg-brand-500/15 border-brand-500 text-brand-accent'
                          : 'bg-surface-canvas border-surface-border text-surface-300 hover:bg-surface-hover'
                      }`}
                    >
                      <div className="font-bold text-[11px] leading-tight">{m.label}</div>
                      <div className="text-[9px] text-surface-400 mt-0.5 leading-none">{m.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Specific Fields depending on mode */}
                {settlement.mode === 'BANK_TRANSFER' && (
                  <div className="p-2 rounded-lg bg-surface-canvas border border-surface-border space-y-2 text-xs font-mono">
                    <div>
                      <label className="text-[10px] text-surface-400 block mb-0.5">Bank Name &amp; IFSC</label>
                      <input
                        type="text"
                        placeholder="e.g. HDFC Bank, HDFC0001234"
                        value={settlement.bankName}
                        onChange={(e) => setSettlement(prev => ({ ...prev, bankName: e.target.value }))}
                        className="input-field text-xs py-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-surface-400 block mb-0.5">Account Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 501002394812"
                        value={settlement.accountNo}
                        onChange={(e) => setSettlement(prev => ({ ...prev, accountNo: e.target.value }))}
                        className="input-field text-xs py-1"
                      />
                    </div>
                  </div>
                )}

                {settlement.mode === 'UPI_TRANSFER' && (
                  <div className="p-2 rounded-lg bg-surface-canvas border border-surface-border space-y-2 text-xs font-mono">
                    <label className="text-[10px] text-surface-400 block mb-0.5">Customer UPI VPA / ID</label>
                    <input
                      type="text"
                      placeholder="e.g. sunita@okaxis or 9820012345@upi"
                      value={settlement.upiId}
                      onChange={(e) => setSettlement(prev => ({ ...prev, upiId: e.target.value }))}
                      className="input-field text-xs py-1"
                    />
                  </div>
                )}

                {settlement.mode === 'SHOWROOM_VOUCHER' && (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      An exchange credit voucher will be generated for <strong>₹{totals.amount.toLocaleString('en-IN')}</strong> redeemable at any counter.
                    </span>
                  </div>
                )}

                {settlement.mode === 'CASH' && isCashRestricted && (
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 text-[11px] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      Section 269ST Violation: Cash payment &ge; ₹2,00,000 is prohibited.
                    </span>
                  </div>
                )}

                {/* Legal Declaration Checkbox */}
                <div className="pt-2 border-t border-surface-border">
                  <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-surface-300">
                    <input
                      type="checkbox"
                      checked={ownershipConfirmed}
                      onChange={(e) => setOwnershipConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-surface-input text-brand-500 focus:ring-brand-500/50 bg-surface-canvas shrink-0"
                    />
                    <span>
                      I verify that the seller has confirmed legal ownership of the ornaments, free from all encumbrances and disputes, and accepts the tested tunch purity.
                    </span>
                  </label>
                </div>

                {/* Main Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="p-2 rounded-lg border border-surface-border hover:bg-surface-hover text-surface-400 transition"
                    title="Reset assessment form"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateVoucher}
                    disabled={isCashRestricted || totals.amount <= 0 || !ownershipConfirmed}
                    className="btn-primary flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Generate URD Voucher (F8)</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: URD VOUCHERS HISTORY REGISTER */}
      {activeTab === 'VOUCHERS_REGISTER' && (
        <div className="card-surface p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-brand-400" />
              <div>
                <h3 className="text-xs font-bold text-surface-100 uppercase tracking-wider">
                  URD Purchase Vouchers Day Book &amp; Register
                </h3>
                <p className="text-[11px] text-surface-400">
                  Audit log of scrap gold purchased under Section 31(3)(f) with corresponding payout references.
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search voucher, customer, PAN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-8 text-xs py-1.5 w-full font-mono"
              />
            </div>
          </div>

          {/* Vouchers Table */}
          <div className="overflow-x-auto border border-surface-border rounded-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-canvas text-surface-400 text-[10px] uppercase border-b border-surface-border">
                <tr>
                  <th className="p-2.5">Voucher ID</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Customer / Seller</th>
                  <th className="p-2.5 text-right">Gross Wt</th>
                  <th className="p-2.5 text-right">Net Wt</th>
                  <th className="p-2.5 text-right">24K Fine Wt</th>
                  <th className="p-2.5 text-right">Total Valuation</th>
                  <th className="p-2.5">Settlement Mode</th>
                  <th className="p-2.5 text-center">Status</th>
                  <th className="p-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredVouchers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-surface-400 text-xs">
                      No URD purchase vouchers found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-surface-hover/50 transition">
                      <td className="p-2.5 font-bold text-brand-benchmark">{v.id}</td>
                      <td className="p-2.5 text-surface-300">{v.date}</td>
                      <td className="p-2.5">
                        <div className="font-semibold text-surface-100 font-sans">{v.customerName}</div>
                        <div className="text-[10px] text-surface-400">{v.customerPhone} &bull; {v.customerPan || 'NO PAN'}</div>
                      </td>
                      <td className="p-2.5 text-right text-surface-200">{(v.totalGross || 0).toFixed(3)}g</td>
                      <td className="p-2.5 text-right text-surface-200">{(v.totalNet || 0).toFixed(3)}g</td>
                      <td className="p-2.5 text-right font-bold text-brand-accent">{(v.totalFine || 0).toFixed(3)}g</td>
                      <td className="p-2.5 text-right font-bold text-surface-100">
                        ₹{(v.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-surface-canvas border border-surface-border text-surface-300 font-sans uppercase">
                          {v.settlementMode.replace('_', ' ')}
                        </span>
                        <div className="text-[9px] text-surface-500 truncate max-w-[120px]">{v.settlementRef}</div>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold ${
                          v.status === 'REDEEMED' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-300'
                            : v.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : 'bg-amber-50 text-amber-700 border border-amber-300'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => setPrintableVoucher(v)}
                          className="px-2.5 py-1 rounded bg-surface-canvas hover:bg-surface-hover border border-surface-border text-brand-accent text-[11px] font-semibold flex items-center gap-1 mx-auto transition"
                          title="Print URD Voucher"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Voucher</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRINTABLE URD PURCHASE VOUCHER MODAL */}
      {printableVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300">
            
            {/* Modal Actions Bar (Hidden in Print) */}
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-700" />
                <span className="font-bold text-xs uppercase tracking-wide text-slate-800">
                  Tax-Compliant URD Purchase Voucher Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrintableVoucher(null)}
                  className="px-3 py-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans text-slate-900 leading-normal" id="printable-urd-slip">
              
              {/* Document Header */}
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <h1 className="font-black text-lg uppercase tracking-wide text-amber-800">
                  {tenant?.name || 'A3 DIAMOND & GOLD SHOWROOM'}
                </h1>
                <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                  {tenant?.address} &bull; Phone: {tenant?.phone}
                </p>
                <div className="flex items-center justify-center gap-4 text-[10px] font-mono font-semibold text-slate-700 mt-1">
                  <span>GSTIN: {tenant?.gstin}</span>
                  <span>&bull;</span>
                  <span>BIS HUID Lic: {tenant?.bisLicenseNo}</span>
                  <span>&bull;</span>
                  <span>PAN: {tenant?.pan}</span>
                </div>
                <div className="mt-2.5 inline-block px-3 py-0.5 rounded-full bg-slate-100 border border-slate-400 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-900">
                  SELF-INVOICE / URD PURCHASE VOUCHER (SECTION 31(3)(f) CGST ACT, 2017)
                </div>
              </div>

              {/* Voucher Meta & Customer Grid */}
              <div className="grid grid-cols-2 gap-4 text-[11px] font-mono border-b border-slate-300 pb-3">
                <div className="space-y-1">
                  <div>
                    <span className="text-slate-500">Voucher No: </span>
                    <strong className="text-slate-900 font-bold">{printableVoucher.id}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Date &amp; Time: </span>
                    <strong className="text-slate-800">{printableVoucher.date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Settlement Mode: </span>
                    <strong className="text-slate-900 font-bold">{printableVoucher.settlementMode.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Ref / Voucher ID: </span>
                    <strong className="text-amber-800 font-bold">{printableVoucher.settlementRef}</strong>
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <div>
                    <span className="text-slate-500">Seller / Customer: </span>
                    <strong className="text-slate-900 font-bold">{printableVoucher.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Contact: </span>
                    <strong className="text-slate-800">{printableVoucher.customerPhone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">PAN / ID Proof: </span>
                    <strong className="text-slate-900 font-bold">{printableVoucher.customerPan || 'NOT APPLICABLE (< ₹2L)'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Location: </span>
                    <span className="text-slate-700">{printableVoucher.customerCity}</span>
                  </div>
                </div>
              </div>

              {/* Itemized Assessment Table */}
              <div>
                <table className="w-full text-left text-[11px] font-mono border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Description</th>
                      <th className="p-2 text-right">Gross Wt</th>
                      <th className="p-2 text-right">Less Wt</th>
                      <th className="p-2 text-right">Net Wt</th>
                      <th className="p-2 text-center">Tunch %</th>
                      <th className="p-2 text-right">24K Fine Wt</th>
                      <th className="p-2 text-right">Scrap Rate</th>
                      <th className="p-2 text-right">Valuation (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {printableVoucher.items?.map((item, idx) => (
                      <tr key={idx} className="text-slate-800">
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2 font-semibold font-sans">{item.name}</td>
                        <td className="p-2 text-right">{item.grossWeight.toFixed(3)}g</td>
                        <td className="p-2 text-right">{item.lessWeight.toFixed(3)}g</td>
                        <td className="p-2 text-right font-semibold">{item.netWeight.toFixed(3)}g</td>
                        <td className="p-2 text-center font-bold text-amber-800">{item.purityPercent.toFixed(1)}%</td>
                        <td className="p-2 text-right font-bold">{item.fineWeight.toFixed(3)}g</td>
                        <td className="p-2 text-right">₹{item.rate.toLocaleString('en-IN')}</td>
                        <td className="p-2 text-right font-bold">₹{item.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-400">
                    <tr>
                      <td colSpan={2} className="p-2 uppercase font-sans">Total Assessment</td>
                      <td className="p-2 text-right">{printableVoucher.totalGross.toFixed(3)}g</td>
                      <td className="p-2 text-right">{printableVoucher.totalLess.toFixed(3)}g</td>
                      <td className="p-2 text-right">{printableVoucher.totalNet.toFixed(3)}g</td>
                      <td className="p-2 text-center">-</td>
                      <td className="p-2 text-right text-amber-900">{printableVoucher.totalFine.toFixed(3)}g</td>
                      <td className="p-2 text-right">-</td>
                      <td className="p-2 text-right text-base text-amber-900">
                        ₹{printableVoucher.totalAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Statutory Legal Declaration */}
              <div className="p-2.5 rounded bg-slate-50 border border-slate-300 text-[10px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800 uppercase tracking-wider">Statutory Declaration by Seller / Customer:</p>
                <p>
                  "I hereby confirm that I am the sole and lawful owner of the gold/silver ornaments detailed above. The ornaments are free from any pledge, mortgage, lien, or police investigation. I agree to the weight, deductions, and tunch purity testing performed at the counter and acknowledge receipt of settlement in full."
                </p>
                <p className="font-mono text-[9px] text-slate-500">
                  Note: Under GST rules, this URD purchase voucher is a statutory record for reverse charge accounting and raw inventory entry.
                </p>
              </div>

              {/* Dual Signature Blocks */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-[11px] font-mono text-center">
                <div className="border-t border-slate-400 pt-1">
                  <span className="font-bold text-slate-800 block">Customer / Seller Signature</span>
                  <span className="text-[10px] text-slate-500">Name: {printableVoucher.customerName}</span>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <span className="font-bold text-slate-800 block">Authorized Showroom Valuer</span>
                  <span className="text-[10px] text-slate-500">{printableVoucher.cashier} &bull; Counter 01</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
