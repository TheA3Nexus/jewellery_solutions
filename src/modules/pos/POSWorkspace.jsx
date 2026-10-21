import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useHardware } from '../../context/HardwareContext';
import { CustomerContextCard } from './components/CustomerContextCard';
import { ProductIngestionTable } from './components/ProductIngestionTable';
import { OldGoldExchangeDrawer } from './components/OldGoldExchangeDrawer';
import { SplitPaymentModal } from './components/SplitPaymentModal';
import { ThermalEstimateReceipt } from './components/ThermalEstimateReceipt';
import { GstTaxInvoiceModal } from './components/GstTaxInvoiceModal';
import { MemoApprovalModal } from './components/MemoApprovalModal';
import { AdvanceGoldBookingModal } from './components/AdvanceGoldBookingModal';
import { 
  CreditCard, 
  ArrowRight, 
  RefreshCw, 
  Printer, 
  MessageCircle, 
  Check, 
  Trash2, 
  FileText,
  Coins,
  History,
  QrCode,
  ShieldCheck,
  Search,
  FileCheck,
  Bookmark
} from 'lucide-react';

export const POSWorkspace = () => {
  const { tenant, bullionRates, markProductSold, recordInvoice, invoices } = useTenant();
  const { scaleWeight } = useHardware();

  // Subcategory Level 2 Tab: 'DIRECT_BILLING' | 'OLD_GOLD_DESK' | 'INVOICE_HISTORY'
  const [activeSubcategory, setActiveSubcategory] = useState('DIRECT_BILLING');

  // Customer Profile State
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    city: '',
    pan: '',
  });

  // Cart State
  const [cart, setCart] = useState([]);

  // Old Gold Exchange State
  const [exchange, setExchange] = useState({
    active: false,
    grossWeight: '',
    lessWeight: '',
    purityPercent: 84.5,
    customRate: '',
  });

  // Modals State
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [isAdvanceBookingOpen, setIsAdvanceBookingOpen] = useState(false);
  const [activeEstimateInvoice, setActiveEstimateInvoice] = useState(null);
  const [activeTaxInvoice, setActiveTaxInvoice] = useState(null);
  const [invoiceSuccess, setInvoiceSuccess] = useState(null);

  // Memos & Advance Gold Bookings Register State
  const [memos, setMemos] = useState([
    {
      id: 'MEMO-8801',
      customer: { name: 'Mrs. Sunita Khandelwal', phone: '+91 98200 44551', address: 'Pedder Road, Mumbai' },
      items: [
        { name: '22K Handcrafted Calcutta Kada Bangles', grossWeight: 45.2, approxValue: 366000 }
      ],
      returnDueDate: '2026-10-24',
      totalApproxValue: 366000,
      status: 'PENDING_DECISION'
    }
  ]);

  const [advanceBookings, setAdvanceBookings] = useState([
    {
      id: 'BKG-9901',
      customer: { name: 'Mrs. Rekha Singhal', phone: '+91 98370 55667', city: 'Agra' },
      bookingPurity: '22K',
      lockedRate: 7196,
      targetGrams: 50.0,
      totalBookingValue: 359800,
      advanceDeposit: 100000,
      deliveryDate: '2026-12-15',
      bookingDate: '2026-10-21',
      status: 'ACTIVE_LOCKED'
    }
  ]);

  // Compute Total Financials
  const grossTotal = cart.reduce((sum, item) => sum + (item.rowTotal || 0), 0);

  let exchangeCredit = 0;
  if (exchange.active) {
    const gross = parseFloat(exchange.grossWeight) || 0;
    const less = parseFloat(exchange.lessWeight) || 0;
    const net = Math.max(0, gross - less);
    const purity = parseFloat(exchange.purityPercent) || 84.0;
    const fineWeight = (net * purity) / 100;
    const scrapRate = exchange.customRate 
      ? parseFloat(exchange.customRate) 
      : Math.round(bullionRates.gold24k * 0.98);
    exchangeCredit = Math.round(fineWeight * scrapRate);
  }

  const taxableAmount = Math.max(0, grossTotal - exchangeCredit);
  const gstAmount = Math.round(taxableAmount * 0.03); // 3% GST (1.5% CGST + 1.5% SGST)
  const grandTotal = taxableAmount + gstAmount;

  const isPanMandatory = grandTotal >= 200000;

  // Finalize Sale from Split Payment Modal
  const handleFinalizeSale = async ({ paymentBreakdown, cardDetails, chequeDetails, invoiceType }) => {
    const invoiceCounter = invoices.length + 101;
    const fallbackId = `INV-${new Date().getFullYear()}-${invoiceCounter}`;

    const newInvoice = {
      id: fallbackId,
      invoiceNo: fallbackId,
      shopName: tenant.name,
      shopAddress: tenant.address,
      shopPhone: tenant.phone,
      shopGstin: tenant.gstin,
      shopBisNo: tenant.bisLicenseNo,
      createdAt: new Date().toISOString(),
      customer,
      items: cart.map(item => ({
        ...item,
        productId: item.productId || item.id,
        itemName: item.name,
        grossWeight: item.grossWeight,
        netWeight: item.netWeight,
        purity: item.purity,
        goldRate: item.rate || bullionRates.gold22k,
        makingCharges: item.makingCharges || 0,
        stoneCharges: item.stoneCharges || 0,
        totalAmount: item.rowTotal || item.finalPrice
      })),
      grossTotal,
      subtotal: grossTotal,
      exchangeCredit,
      hasExchange: exchange.active,
      exchangeDetails: exchange.active ? exchange : null,
      taxableAmount,
      gstAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      grandTotal,
      paymentMode: paymentBreakdown?.cash && paymentBreakdown?.upi ? 'SPLIT' : (paymentBreakdown?.upi ? 'UPI' : (paymentBreakdown?.card ? 'CARD' : 'CASH')),
      paymentBreakdown,
      cardDetails,
      chequeDetails,
      invoiceType: invoiceType || 'TAX_INVOICE',
      oldGoldExchange: exchange.active ? {
        grossWeight: exchange.grossWeight,
        lessWeight: exchange.lessWeight,
        netWeight: Math.max(0, parseFloat(exchange.grossWeight || 0) - parseFloat(exchange.lessWeight || 0)),
        purityPercent: exchange.purityPercent,
        fineGoldWeight: ((Math.max(0, parseFloat(exchange.grossWeight || 0) - parseFloat(exchange.lessWeight || 0))) * parseFloat(exchange.purityPercent || 84)) / 100,
        scrapRate: exchange.customRate || Math.round(bullionRates.gold24k * 0.98),
        totalCredit: exchangeCredit
      } : null
    };

    // Mark products as sold in local catalog
    cart.forEach(item => {
      markProductSold(item.id, fallbackId);
    });

    // Record invoice in history and persist to GoDaddy MySQL
    let finalInvoice = newInvoice;
    try {
      const res = await recordInvoice(newInvoice);
      if (res?.success && res?.data) {
        finalInvoice = {
          ...newInvoice,
          ...res.data,
          id: res.data.invoiceNo || res.data.id || fallbackId,
          invoiceNo: res.data.invoiceNo || fallbackId
        };
      }
    } catch (e) {
      console.warn('Saved invoice in offline mode:', e);
    }

    setIsSplitModalOpen(false);
    setInvoiceSuccess(finalInvoice);

    if (invoiceType === 'ESTIMATE') {
      setActiveEstimateInvoice(finalInvoice);
    } else {
      setActiveTaxInvoice(finalInvoice);
    }
  };

  const handleClearBill = () => {
    setCart([]);
    setCustomer({ name: '', phone: '', city: '', pan: '' });
    setExchange({ active: false, grossWeight: '', lessWeight: '', purityPercent: 84.5, customRate: '' });
    setInvoiceSuccess(null);
  };

  return (
    <div className="space-y-4">
      
      {/* Subcategory Level 2 Tab Navigation */}
      <div className="flex items-center justify-between border-b border-surface-800 pb-2">
        <div className="flex items-center gap-1 font-sans text-xs">
          {[
            { id: 'DIRECT_BILLING', label: 'Direct Counter Sale', icon: CreditCard },
            { id: 'OLD_GOLD_DESK', label: 'Old Gold Exchange Desk', icon: Coins },
            { id: 'MEMO_APPROVALS', label: 'Approval / Memo Slips', icon: FileCheck },
            { id: 'ADVANCE_BOOKING', label: 'Gold Rate Booking', icon: Bookmark },
            { id: 'INVOICE_HISTORY', label: 'Sales & Invoices Register', icon: History }
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

        <div className="text-[11px] text-surface-400 font-mono">
          Shortcut: <span className="text-brand-300 font-bold">F2</span> (Read Scale) &bull; <span className="text-brand-300 font-bold">F8</span> (Checkout)
        </div>
      </div>

      {/* View 1: Direct Counter Sale (Primary) */}
      {activeSubcategory === 'DIRECT_BILLING' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Customer Profile + Product Table + Old Gold (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <CustomerContextCard 
              customer={customer} 
              setCustomer={setCustomer} 
              grandTotal={grandTotal} 
            />

            <ProductIngestionTable 
              cart={cart} 
              setCart={setCart} 
            />

            <OldGoldExchangeDrawer 
              exchange={exchange} 
              setExchange={setExchange} 
            />
          </div>

          {/* Right Column: Checkout Summary & Action Dock (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Grand Total Summary Card */}
            <div className="card-surface space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-surface-800 pb-2">
                <span className="text-xs font-bold text-surface-100 uppercase tracking-wider font-sans">
                  Billing Summary
                </span>
                <span className="text-[10px] text-surface-400">
                  {cart.length} Articles Selected
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-surface-400">
                  <span>Gross Jewellery Total:</span>
                  <span className="text-surface-200">₹{grossTotal.toLocaleString('en-IN')}</span>
                </div>

                {exchange.active && exchangeCredit > 0 && (
                  <div className="flex justify-between text-brand-400 font-semibold">
                    <span>Less Old Gold Credit:</span>
                    <span>-₹{exchangeCredit.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-surface-400">
                  <span>Taxable Subtotal:</span>
                  <span className="text-surface-200">₹{taxableAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-surface-400">
                  <span>GST Total (3%):</span>
                  <span className="text-surface-200">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="border-t border-surface-800 pt-2 flex justify-between items-center">
                  <span className="text-sm font-bold text-brand-400 font-sans">Grand Total:</span>
                  <span className="text-xl font-bold text-surface-100">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Statutory PAN warning indicator */}
              {isPanMandatory && !customer.pan && (
                <div className="p-2 rounded bg-amber-950/40 border border-amber-800/40 text-[10px] text-amber-300 font-sans">
                  Rule 114B: Invoice &gt;= ₹2 Lakh requires Customer PAN before finalizing.
                </div>
              )}

              {/* Main Checkout Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSplitModalOpen(true)}
                  disabled={cart.length === 0 || (isPanMandatory && !customer.pan)}
                  className="w-full btn-primary py-3 text-xs uppercase tracking-wider font-bold"
                >
                  <span>Split Payment &amp; Settle (F8)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearBill}
                    className="w-full btn-secondary py-2 text-xs text-rose-300 hover:text-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Active Counter</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Assistance Box */}
            <div className="card-surface space-y-2 text-xs">
              <div className="flex items-center gap-2 text-brand-400 font-bold uppercase text-[10px] tracking-wider font-sans">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Guardrails Enforced</span>
              </div>
              <ul className="text-[11px] text-surface-400 space-y-1 list-disc list-inside">
                <li>Section 269ST blocks single cash collections &ge; ₹2,00,000.</li>
                <li>Rule 114B makes PAN mandatory for bills &ge; ₹2,00,000.</li>
                <li>GST auto-computed at 1.5% CGST + 1.5% SGST.</li>
                <li>6-digit HUID code verified on all hallmarked items.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* View 2: Old Gold Exchange Desk */}
      {activeSubcategory === 'OLD_GOLD_DESK' && (
        <div className="card-surface max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-800 pb-2">
            <Coins className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100">Standalone Scrap Gold &amp; Tunch Desk</h3>
              <p className="text-xs text-surface-400">Calculate melting loss, tunch purity, and cash payout without a purchase bill.</p>
            </div>
          </div>
          <OldGoldExchangeDrawer exchange={exchange} setExchange={setExchange} />
        </div>
      )}

      {/* View 3: Invoices History */}
      {activeSubcategory === 'INVOICE_HISTORY' && (
        <div className="card-surface space-y-3">
          <div className="flex items-center justify-between border-b border-surface-800 pb-2">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-brand-400" />
              <h3 className="text-xs font-bold text-surface-100 uppercase tracking-wider">
                Recent Showroom Invoices &amp; Estimates
              </h3>
            </div>
            <span className="text-xs text-surface-400 font-mono">
              Total Invoices: {invoices.length}
            </span>
          </div>

          <div className="overflow-x-auto border border-surface-800 rounded-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-950 text-surface-400 text-[10px] uppercase border-b border-surface-800">
                <tr>
                  <th className="p-2.5">Invoice ID</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Customer</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5 text-right">Items</th>
                  <th className="p-2.5 text-right">Grand Total</th>
                  <th className="p-2.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-surface-500 font-sans text-xs">
                      No invoices recorded yet. Completed sales will appear here.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-surface-850/40 transition">
                      <td className="p-2.5 font-bold text-brand-400">{inv.id}</td>
                      <td className="p-2.5 text-surface-400">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td className="p-2.5 font-sans font-semibold text-surface-200">{inv.customer?.name || 'Walk-in'}</td>
                      <td className="p-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-sans ${
                          inv.invoiceType === 'TAX_INVOICE' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : 'bg-surface-800 text-surface-300'
                        }`}>
                          {inv.invoiceType}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">{inv.items?.length || 0}</td>
                      <td className="p-2.5 text-right font-bold text-surface-100">₹{inv.grandTotal.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-center space-x-1.5">
                        <button
                          onClick={() => {
                            if (inv.invoiceType === 'TAX_INVOICE') setActiveTaxInvoice(inv);
                            else setActiveEstimateInvoice(inv);
                          }}
                          className="btn-secondary py-1 px-2 text-[10px]"
                        >
                          View / Print
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

      {/* View 4: Approval / Memo Management */}
      {activeSubcategory === 'MEMO_APPROVALS' && (
        <div className="card-surface p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-surface-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-brand-400" />
                Jewelry On Approval (Memo / Jangad Register)
              </h3>
              <p className="text-xs text-surface-400">
                Ornaments issued to trusted clients for family selection prior to tax invoice generation.
              </p>
            </div>
            <button
              onClick={() => setIsMemoModalOpen(true)}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" /> Issue New Memo
            </button>
          </div>

          <table className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 text-surface-400 uppercase tracking-wider text-[11px] border-b border-surface-800">
              <tr>
                <th className="p-2.5">Memo ID &amp; Date</th>
                <th className="p-2.5">Customer &amp; Phone</th>
                <th className="p-2.5">Articles Dispatched</th>
                <th className="p-2.5 text-right">Approx Value (₹)</th>
                <th className="p-2.5 text-center">Return Due Date</th>
                <th className="p-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60 font-mono">
              {memos.map((memo) => (
                <tr key={memo.id} className="hover:bg-surface-800/40">
                  <td className="p-2.5 font-bold text-brand-400">{memo.id}</td>
                  <td className="p-2.5 font-sans">
                    <div className="font-semibold text-surface-100">{memo.customer.name}</div>
                    <div className="text-[11px] text-surface-500 font-mono">{memo.customer.phone}</div>
                  </td>
                  <td className="p-2.5 font-sans text-surface-200">
                    {memo.items.map((i) => `${i.name} (${i.grossWeight}g)`).join(', ')}
                  </td>
                  <td className="p-2.5 text-right font-bold text-surface-100">
                    ₹{memo.totalApproxValue.toLocaleString('en-IN')}
                  </td>
                  <td className="p-2.5 text-center">{memo.returnDueDate}</td>
                  <td className="p-2.5 text-center font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      On Approval
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View 5: Advance Gold Rate Booking Register */}
      {activeSubcategory === 'ADVANCE_BOOKING' && (
        <div className="card-surface p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-surface-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                Advance Gold Rate Booking Register (Wedding Rate Locks)
              </h3>
              <p className="text-xs text-surface-400">
                Gold rates locked against customer advance deposits with future delivery dates.
              </p>
            </div>
            <button
              onClick={() => setIsAdvanceBookingOpen(true)}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" /> Book Gold Rate
            </button>
          </div>

          <table className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 text-surface-400 uppercase tracking-wider text-[11px] border-b border-surface-800">
              <tr>
                <th className="p-2.5">Booking # &amp; Date</th>
                <th className="p-2.5">Customer</th>
                <th className="p-2.5 text-right">Locked Rate (₹/g)</th>
                <th className="p-2.5 text-right">Weight Booked</th>
                <th className="p-2.5 text-right">Advance Deposited</th>
                <th className="p-2.5 text-center">Delivery Target</th>
                <th className="p-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60 font-mono">
              {advanceBookings.map((bkg) => (
                <tr key={bkg.id} className="hover:bg-surface-800/40">
                  <td className="p-2.5 font-bold text-brand-400">{bkg.id}</td>
                  <td className="p-2.5 font-sans">
                    <div className="font-semibold text-surface-100">{bkg.customer.name}</div>
                    <div className="text-[11px] text-surface-500 font-mono">{bkg.customer.phone}</div>
                  </td>
                  <td className="p-2.5 text-right text-amber-400 font-bold">₹{bkg.lockedRate} /g</td>
                  <td className="p-2.5 text-right">{bkg.targetGrams.toFixed(3)} g</td>
                  <td className="p-2.5 text-right text-emerald-400 font-bold">
                    ₹{bkg.advanceDeposit.toLocaleString('en-IN')}
                  </td>
                  <td className="p-2.5 text-center">{bkg.deliveryDate}</td>
                  <td className="p-2.5 text-center font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Rate Locked
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Split Payment Modal */}
      <SplitPaymentModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        totals={{ grossTotal, exchangeCredit, taxableAmount, gstAmount, grandTotal }}
        customer={customer}
        onFinalizeSale={handleFinalizeSale}
      />

      {/* Memo Approval Modal */}
      <MemoApprovalModal
        isOpen={isMemoModalOpen}
        onClose={() => setIsMemoModalOpen(false)}
        onSaveMemo={(memo) => setMemos([memo, ...memos])}
      />

      {/* Advance Gold Rate Booking Modal */}
      <AdvanceGoldBookingModal
        isOpen={isAdvanceBookingOpen}
        onClose={() => setIsAdvanceBookingOpen(false)}
        onSaveBooking={(bkg) => setAdvanceBookings([bkg, ...advanceBookings])}
      />

      {/* Thermal Estimate Receipt Modal */}
      {activeEstimateInvoice && (
        <ThermalEstimateReceipt
          invoice={activeEstimateInvoice}
          onClose={() => setActiveEstimateInvoice(null)}
        />
      )}

      {/* Official GST Tax Invoice Modal */}
      {activeTaxInvoice && (
        <GstTaxInvoiceModal
          invoice={activeTaxInvoice}
          onClose={() => setActiveTaxInvoice(null)}
          onWhatsAppShare={(inv) => alert(`WhatsApp PDF dispatched to ${inv.customer?.phone || '+91 98200 12345'}`)}
        />
      )}

    </div>
  );
};