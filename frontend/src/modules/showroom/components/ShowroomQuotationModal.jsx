import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  FileText, 
  Receipt, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Clock, 
  User, 
  Phone, 
  Sparkles 
} from 'lucide-react';
import { printA4, printThermal } from '../../../utils/printService';

export const ShowroomQuotationModal = ({
  isOpen,
  onClose,
  items = [],
  bullionRates,
  tenant
}) => {
  const [customerName, setCustomerName] = useState('Smt. Sunita Agarwal');
  const [customerPhone, setCustomerPhone] = useState('+91 98231 44556');
  const [salesPerson, setSalesPerson] = useState('Ananya Verma (Counter 01)');
  const [format, setFormat] = useState('A4'); // 'A4' or 'THERMAL'

  if (!isOpen || !items || items.length === 0) return null;

  // Calculation helper
  const calculateItemPricing = (item) => {
    const is18k = item.purity.includes('18K');
    const goldRate = is18k ? (bullionRates?.gold18k || 5790) : (bullionRates?.gold22k || 7080);
    const metalCost = item.netWeight * goldRate;
    const makingCost = metalCost * (item.makingChargePercent / 100);
    const stoneCost = item.diamondValue || (item.stoneWeight > 0 ? item.stoneWeight * 1200 : 0);
    const subtotal = metalCost + makingCost + stoneCost;
    const gst = subtotal * 0.03;
    const total = Math.round(subtotal + gst);
    return { goldRate, metalCost, makingCost, stoneCost, subtotal, gst, total };
  };

  const calculatedItems = items.map((it) => ({
    ...it,
    pricing: calculateItemPricing(it)
  }));

  const totalGrossWeight = calculatedItems.reduce((acc, i) => acc + i.grossWeight, 0);
  const totalNetWeight = calculatedItems.reduce((acc, i) => acc + i.netWeight, 0);
  const totalMetalCost = calculatedItems.reduce((acc, i) => acc + i.pricing.metalCost, 0);
  const totalMakingCost = calculatedItems.reduce((acc, i) => acc + i.pricing.makingCost, 0);
  const totalStoneCost = calculatedItems.reduce((acc, i) => acc + i.pricing.stoneCost, 0);
  const totalSubtotal = calculatedItems.reduce((acc, i) => acc + i.pricing.subtotal, 0);
  const totalGst = Math.round(totalSubtotal * 0.03);
  const grandTotal = totalSubtotal + totalGst;

  const quoteNumber = `EST-2026-${Date.now().toString().slice(-4)}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    if (format === 'THERMAL') {
      printThermal('printable-showroom-quotation', `Estimate_${quoteNumber}`);
    } else {
      printA4('printable-showroom-quotation', `Estimate_${quoteNumber}`);
    }
  };

  const handleWhatsAppShare = () => {
    const summary = calculatedItems.map((i, idx) => 
      `${idx + 1}. *${i.title}* (${i.purity})\n   Net Wt: ${i.netWeight.toFixed(3)}g | Est: ₹${i.pricing.total.toLocaleString('en-IN')}`
    ).join('\n\n');

    const msg = `*${tenant?.name || 'A3 JEWELLERY'} - SHOWROOM ESTIMATE*\n` +
      `Quote No: ${quoteNumber}\n` +
      `Date: ${currentDate} (${currentTime})\n` +
      `Customer: ${customerName}\n\n` +
      `*Selected Articles:*\n${summary}\n\n` +
      `*Total Net Weight:* ${totalNetWeight.toFixed(3)}g\n` +
      `*Subtotal:* ₹${totalSubtotal.toLocaleString('en-IN')}\n` +
      `*GST (3%):* ₹${totalGst.toLocaleString('en-IN')}\n` +
      `*ESTIMATED TOTAL:* ₹${grandTotal.toLocaleString('en-IN')}\n\n` +
      `_Note: Rates are valid for today only. 100% BIS Hallmarked jewellery._`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?phone=${customerPhone.replace(/[^0-9]/g, '')}&text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-4xl w-full p-6 space-y-5 shadow-2xl my-8">
        {/* Modal Top Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-surface-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 font-mono block">
              Official Sales Counter Document
            </span>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-400" />
              Showroom Estimation &amp; Quotation Slip (कच्चा एस्टीमेट)
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Format toggle: A4 vs Thermal */}
            <div className="flex bg-surface-950 p-1 rounded-lg border border-surface-800 text-xs font-semibold">
              <button
                id="btn-format-a4"
                onClick={() => setFormat('A4')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                  format === 'A4'
                    ? 'bg-surface-800 text-surface-100 font-bold border border-surface-700'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> A4 Paper
              </button>
              <button
                id="btn-format-thermal"
                onClick={() => setFormat('THERMAL')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                  format === 'THERMAL'
                    ? 'bg-surface-800 text-surface-100 font-bold border border-surface-700'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" /> 80mm Thermal
              </button>
            </div>

            <button
              id="btn-whatsapp-estimate"
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> WhatsApp Quote
            </button>

            <button
              id="btn-print-quotation"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print {format === 'A4' ? 'A4 Document' : 'Thermal Slip'}
            </button>

            <button
              id="btn-close-quotation"
              onClick={onClose}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customer & Staff Info Bar (Editable) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-surface-950 p-3.5 rounded-xl border border-surface-800 text-xs">
          <div>
            <label className="text-[10px] text-surface-400 uppercase font-mono block mb-1">
              Customer Name:
            </label>
            <input
              id="input-estimate-customer-name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-surface-900 border border-surface-700 rounded-lg px-2.5 py-1 text-surface-100 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-surface-400 uppercase font-mono block mb-1">
              Customer Mobile No:
            </label>
            <input
              id="input-estimate-customer-phone"
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-surface-900 border border-surface-700 rounded-lg px-2.5 py-1 text-surface-100 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-surface-400 uppercase font-mono block mb-1">
              Sales Consultant:
            </label>
            <input
              id="input-estimate-salesperson"
              type="text"
              value={salesPerson}
              onChange={(e) => setSalesPerson(e.target.value)}
              className="w-full bg-surface-900 border border-surface-700 rounded-lg px-2.5 py-1 text-surface-100 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Printable Paper Document Container */}
        <div className="bg-white text-slate-950 rounded-xl p-6 sm:p-8 font-sans shadow-lg max-h-[60vh] overflow-y-auto">
          <div
            id="printable-showroom-quotation"
            className={format === 'THERMAL' ? 'printable-document printable-thermal font-mono text-[11px]' : 'printable-document printable-a4'}
          >
            {format === 'THERMAL' ? (
              // 80mm Thermal Receipt Layout
              <div className="space-y-3 p-2 text-slate-950">
                <div className="text-center border-b border-dashed border-slate-400 pb-2">
                  <h2 className="text-base font-bold uppercase tracking-wide">
                    {tenant?.name || 'A3 JEWELLERS & SONS'}
                  </h2>
                  <p className="text-[10px]">{tenant?.branch || 'Main Showroom'}</p>
                  <p className="text-[9px]">BIS License: {tenant?.bisLicenseNo || 'HM/C-7749102'}</p>
                  <div className="mt-1 font-bold text-[11px] uppercase tracking-wider">
                    *** ESTIMATE / QUOTATION ***
                  </div>
                  <p className="text-[9px] text-slate-600">(Tentative - Not a Tax Invoice)</p>
                </div>

                <div className="text-[10px] space-y-0.5 border-b border-dashed border-slate-400 pb-2">
                  <div>Ref: <span className="font-bold">{quoteNumber}</span></div>
                  <div>Date: {currentDate} {currentTime}</div>
                  <div>Customer: <span className="font-bold">{customerName}</span></div>
                  <div>Mobile: {customerPhone}</div>
                  <div>Sales Exec: {salesPerson}</div>
                </div>

                {/* Benchmark Rates */}
                <div className="text-[9px] bg-slate-100 p-1.5 rounded border border-slate-300">
                  <span className="font-bold">Today's Bullion Benchmark:</span><br />
                  24K Gold: ₹{bullionRates?.gold24k || 7720}/g | 22K: ₹{bullionRates?.gold22k || 7080}/g | 18K: ₹{bullionRates?.gold18k || 5790}/g
                </div>

                {/* Items */}
                <div className="space-y-2 border-b border-dashed border-slate-400 pb-2">
                  {calculatedItems.map((item, idx) => (
                    <div key={item.id} className="text-[10px] space-y-0.5">
                      <div className="font-bold">{idx + 1}. {item.title}</div>
                      <div className="flex justify-between text-slate-700">
                        <span>Purity: {item.purity}</span>
                        <span>Gr Wt: {item.grossWeight.toFixed(3)}g</span>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>Net Wt: {item.netWeight.toFixed(3)}g</span>
                        <span>Rate: ₹{item.pricing.goldRate}/g</span>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>Making ({item.makingChargePercent}%):</span>
                        <span>₹{Math.round(item.pricing.makingCost).toLocaleString('en-IN')}</span>
                      </div>
                      {item.pricing.stoneCost > 0 && (
                        <div className="flex justify-between text-slate-700">
                          <span>Stone / Diamond:</span>
                          <span>₹{Math.round(item.pricing.stoneCost).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold pt-0.5">
                        <span>Est Amount:</span>
                        <span>₹{item.pricing.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grand Tally */}
                <div className="text-[10px] space-y-1 border-b border-dashed border-slate-400 pb-2">
                  <div className="flex justify-between">
                    <span>Total Net Weight:</span>
                    <span className="font-bold">{totalNetWeight.toFixed(3)} g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxable Subtotal:</span>
                    <span>₹{totalSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (3%):</span>
                    <span>₹{totalGst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-900">
                    <span>FINAL ESTIMATED SUM:</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="text-[8px] text-center text-slate-600 leading-tight">
                  Rates are valid for today only until market close.<br />
                  100% Certified Hallmarked Jewellery.<br />
                  *** Thank You for Visiting! ***
                </div>
              </div>
            ) : (
              // Formal A4 Document Layout
              <div className="space-y-6 p-4">
                {/* A4 Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div>
                    <h1 className="text-xl font-black uppercase tracking-wider text-slate-950">
                      {tenant?.name || 'A3 JEWELLERS & SONS'}
                    </h1>
                    <p className="text-xs text-slate-700 font-medium">
                      {tenant?.branch || 'Flagship Luxury Showroom'}, Main Market Road
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      GSTIN: <span className="font-mono font-semibold">{tenant?.gstin || '08AABCA1234F1Z5'}</span> &bull; BIS Hallmark Lic: <span className="font-mono font-semibold">{tenant?.bisLicenseNo || 'HM/C-7749102'}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-1">
                      Jewellery Estimation Slip
                    </div>
                    <div className="text-xs font-mono text-slate-700">
                      <div>Estimate No: <span className="font-bold text-slate-950">{quoteNumber}</span></div>
                      <div>Date: {currentDate} &bull; {currentTime}</div>
                    </div>
                  </div>
                </div>

                {/* Customer & Consultant Bar */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Customer Information:</span>
                    <span className="font-bold text-slate-900 text-sm block">{customerName}</span>
                    <span className="text-slate-600 font-mono">{customerPhone}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Assisted By:</span>
                    <span className="font-bold text-slate-900 block">{salesPerson}</span>
                    <span className="text-slate-600 text-[11px]">Valid Until: End of Day ({currentDate})</span>
                  </div>
                </div>

                {/* Bullion Rates Ticker Bar */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-amber-900 uppercase text-[10px]">Today's Benchmark Bullion Rates:</span>
                  <div className="flex gap-4 text-slate-800">
                    <span>24K Gold: <b className="text-amber-800">₹{bullionRates?.gold24k || 7720}/g</b></span>
                    <span>22K Gold (916): <b className="text-amber-800">₹{bullionRates?.gold22k || 7080}/g</b></span>
                    <span>18K Gold: <b className="text-amber-800">₹{bullionRates?.gold18k || 5790}/g</b></span>
                    <span>Fine Silver: <b className="text-slate-700">₹{bullionRates?.silver || 94}/g</b></span>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-300">
                    <thead className="bg-slate-100 text-slate-900 border-b border-slate-300 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Design &amp; Description</th>
                        <th className="py-2.5 px-3">Purity</th>
                        <th className="py-2.5 px-3 text-right">Gross Wt</th>
                        <th className="py-2.5 px-3 text-right">Net Wt</th>
                        <th className="py-2.5 px-3 text-right">Rate/g</th>
                        <th className="py-2.5 px-3 text-right">Making Chg</th>
                        <th className="py-2.5 px-3 text-right">Stone / Diamond</th>
                        <th className="py-2.5 px-3 text-right">Est Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                      {calculatedItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-sans font-semibold text-slate-500">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                            {item.title}
                            <div className="text-[10px] text-slate-500 font-normal font-sans">
                              {item.stoneDescription}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-sans font-semibold text-amber-800">{item.purity}</td>
                          <td className="py-2.5 px-3 text-right">{item.grossWeight.toFixed(3)}g</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-950">{item.netWeight.toFixed(3)}g</td>
                          <td className="py-2.5 px-3 text-right">₹{item.pricing.goldRate}</td>
                          <td className="py-2.5 px-3 text-right">
                            {item.makingChargePercent}% (₹{Math.round(item.pricing.makingCost).toLocaleString('en-IN')})
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {item.pricing.stoneCost > 0 ? `₹${Math.round(item.pricing.stoneCost).toLocaleString('en-IN')}` : 'Nil'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-950 text-xs">
                            ₹{item.pricing.total.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold text-xs">
                      <tr>
                        <td colSpan={3} className="py-2.5 px-3 font-sans text-slate-800">
                          Total ({calculatedItems.length} Articles)
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">{totalGrossWeight.toFixed(3)}g</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-950">{totalNetWeight.toFixed(3)}g</td>
                        <td colSpan={3} className="py-2.5 px-3 text-right font-sans text-slate-700">Taxable Subtotal:</td>
                        <td className="py-2.5 px-3 text-right font-mono">₹{totalSubtotal.toLocaleString('en-IN')}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Tally Breakdown & Statutory Footnote */}
                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 space-y-1.5 leading-relaxed bg-slate-50">
                    <span className="font-bold text-slate-900 block uppercase text-[10px] tracking-wider">
                      Important Terms &amp; Conditions:
                    </span>
                    <p>
                      1. This document is a tentative estimate for budget evaluation and does NOT constitute a statutory Tax Invoice.
                    </p>
                    <p>
                      2. Gold and Silver rates are linked to live commodity markets and this quotation is strictly valid for the date of issue.
                    </p>
                    <p>
                      3. All jewellery pieces carry mandatory BIS Hallmarking with 6-digit laser HUID. Purity can be re-tested on our in-house Karatmeter anytime.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-slate-700">
                      <span>Pure Metal Value:</span>
                      <span>₹{Math.round(totalMetalCost).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Making &amp; Artistry Charges:</span>
                      <span>₹{Math.round(totalMakingCost).toLocaleString('en-IN')}</span>
                    </div>
                    {totalStoneCost > 0 && (
                      <div className="flex justify-between text-slate-700">
                        <span>Gemstones &amp; Certified Diamonds:</span>
                        <span>₹{Math.round(totalStoneCost).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-700 pt-1 border-t border-slate-200">
                      <span>Taxable Subtotal:</span>
                      <span className="font-bold text-slate-900">₹{totalSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>GST @ 3.0% (CGST 1.5% + SGST 1.5%):</span>
                      <span>₹{totalGst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t-2 border-slate-900 text-sm font-bold">
                      <span className="font-sans text-slate-950 font-black">ESTIMATED TOTAL PAYABLE:</span>
                      <span className="text-base text-slate-950 font-black font-mono">
                        ₹{grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs text-slate-600">
                  <div className="border-t border-slate-300 pt-2">
                    <span className="font-semibold text-slate-900 block">{salesPerson}</span>
                    <span>Prepared by Sales Executive</span>
                  </div>
                  <div className="border-t border-slate-300 pt-2">
                    <span className="font-semibold text-slate-900 block">{customerName}</span>
                    <span>Customer Signature / Acknowledgement</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
