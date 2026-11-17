import React from 'react';
import { printA4 } from '../../../utils/printService';
import { 
  X, 
  Printer, 
  MessageCircle, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  ArrowDownRight, 
  ArrowUpRight, 
  ShieldCheck, 
  Lock,
  IndianRupee,
  Clock
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const CustomerLedgerModal = ({ 
  isOpen, 
  onClose, 
  account, 
  onCollectPayment 
}) => {
  const { tenant } = useTenant();

  if (!isOpen || !account) return null;

  const entries = account.ledgerEntries || [
    {
      id: 'tx-init',
      date: account.invoiceDate,
      voucherNo: account.invoiceNo,
      particulars: `Jewellery Purchase on Credit Invoice #${account.invoiceNo}`,
      debit: account.totalBillAmount,
      credit: 0,
      balance: account.totalBillAmount
    },
    ...(account.totalPaid > 0 ? [{
      id: 'tx-paid',
      date: account.invoiceDate,
      voucherNo: 'RCT-PART-PAY',
      particulars: 'Advance / Part Settlement at Billing Desk',
      debit: 0,
      credit: account.totalPaid,
      balance: account.balanceDue
    }] : [])
  ];

  const totalDebits = entries.reduce((sum, item) => sum + (item.debit || 0), 0);
  const totalCredits = entries.reduce((sum, item) => sum + (item.credit || 0), 0);
  const availableCreditHeadroom = Math.max(0, (account.creditLimit || 0) - account.balanceDue);

  const handlePrint = () => {
    printA4('printable-customer-ledger', `Bahi_Khata_${account.customerName.replace(/\s+/g, '_')}`);
  };

  const handleWhatsApp = () => {
    const text = `Namaste ${account.customerName} ji, here is your Bahi-Khata (Khaata Statement) summary from ${tenant.name}:
- Invoice: ${account.invoiceNo} (${account.invoiceDate})
- Total Bill: Rs. ${account.totalBillAmount.toLocaleString('en-IN')}
- Total Paid: Rs. ${account.totalPaid.toLocaleString('en-IN')}
- Pending Balance Due: Rs. ${account.balanceDue.toLocaleString('en-IN')}
- Days Outstanding: ${account.daysOutstanding} days

Kindly remit via UPI or visit our showroom. Thank you for your continued trust.`;
    const cleanPhone = account.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-4xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider font-sans">
                  Customer Khaata &amp; Bahi-Khata Ledger
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-800 text-brand-400 border border-surface-700">
                  {account.id}
                </span>
                {account.isBlocked ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 font-sans">
                    <Lock className="w-2.5 h-2.5" /> Credit Blocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">
                    <ShieldCheck className="w-2.5 h-2.5" /> Credit Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-surface-400 flex items-center gap-2 mt-0.5 font-mono">
                <strong className="text-surface-200 font-sans">{account.customerName}</strong>
                <span>&bull;</span>
                <span>{account.phone}</span>
                <span>&bull;</span>
                <span className="font-sans">{account.city}</span>
              </p>
            </div>
          </div>
          
          <button
            id="btn-close-ledger-modal"
            onClick={onClose}
            className="text-surface-400 hover:text-surface-100 p-1.5 rounded-lg hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-surface-950 p-2.5 rounded-xl border border-surface-800">
          <div className="flex items-center gap-2">
            <button
              id="btn-print-customer-ledger"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-brand-400" />
              Print A4 Bahi-Khata
            </button>
            <button
              id="btn-whatsapp-customer-ledger"
              onClick={handleWhatsApp}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Statement
            </button>
          </div>

          <button
            id="btn-ledger-collect-payment"
            onClick={() => {
              onClose();
              onCollectPayment(account);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Record Part Payment
          </button>
        </div>

        {/* Financial Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-surface-950 p-3 rounded-xl border border-surface-800">
            <span className="text-[10px] uppercase font-sans text-surface-400 block">Total Invoiced (Debit)</span>
            <span className="text-base font-bold text-surface-100 mt-0.5 block">
              ₹{totalDebits.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-surface-500 font-sans">Gross purchases on khaata</span>
          </div>

          <div className="bg-surface-950 p-3 rounded-xl border border-surface-800">
            <span className="text-[10px] uppercase font-sans text-surface-400 block">Total Received (Credit)</span>
            <span className="text-base font-bold text-emerald-400 mt-0.5 block">
              ₹{totalCredits.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-500 font-sans">Payments &amp; gold offsets</span>
          </div>

          <div className="bg-surface-950 p-3 rounded-xl border border-brand-500/30 bg-brand-500/5">
            <span className="text-[10px] uppercase font-sans text-brand-400 font-semibold block">Net Balance Due</span>
            <span id="stat-ledger-balance-due" className="text-lg font-bold text-brand-400 mt-0.5 block">
              ₹{account.balanceDue.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-surface-400 font-sans">
              Aging: <strong className={account.daysOutstanding > 60 ? 'text-rose-400' : 'text-amber-400'}>{account.daysOutstanding} Days</strong>
            </span>
          </div>

          <div className="bg-surface-950 p-3 rounded-xl border border-surface-800">
            <span className="text-[10px] uppercase font-sans text-surface-400 block">Credit Ceiling</span>
            <span className="text-base font-bold text-surface-200 mt-0.5 block">
              ₹{account.creditLimit.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-surface-400 font-sans">
              Available Headroom: ₹{availableCreditHeadroom.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Double-Entry Transaction Ledger Table */}
        <div className="border border-surface-800 rounded-xl overflow-hidden">
          <div className="bg-surface-950 px-4 py-2.5 border-b border-surface-800 flex items-center justify-between text-xs">
            <h4 className="font-bold text-surface-200 uppercase tracking-wide flex items-center gap-1.5 font-sans">
              <Calendar className="w-3.5 h-3.5 text-brand-400" />
              Itemized Khaata Ledger Entries (Double Entry)
            </h4>
            <span className="text-[11px] text-surface-400 font-mono">
              {entries.length} Transaction(s)
            </span>
          </div>

          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-950 text-surface-400 uppercase text-[10px] tracking-wider border-b border-surface-800 sticky top-0 font-sans">
                <tr>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Voucher / Ref #</th>
                  <th className="px-4 py-2.5">Particulars / Narration</th>
                  <th className="px-4 py-2.5 text-right">Debit (Dr)</th>
                  <th className="px-4 py-2.5 text-right">Credit (Cr)</th>
                  <th className="px-4 py-2.5 text-right text-brand-400">Balance Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60 text-surface-300">
                {entries.map((tx, idx) => (
                  <tr key={tx.id || idx} className="hover:bg-surface-800/40 transition-colors">
                    <td className="px-4 py-2.5 whitespace-nowrap text-surface-400">
                      {tx.date}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap font-semibold text-surface-200">
                      {tx.voucherNo}
                    </td>
                    <td className="px-4 py-2.5 font-sans text-surface-200 max-w-xs truncate">
                      {tx.particulars}
                    </td>
                    <td className="px-4 py-2.5 text-right text-rose-400">
                      {tx.debit > 0 ? `₹${tx.debit.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-4 py-2.5 text-right text-emerald-400">
                      {tx.credit > 0 ? `₹${tx.credit.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-surface-100">
                      ₹{tx.balance.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-surface-950 border-t-2 border-surface-800 font-bold text-surface-100">
                <tr>
                  <td colSpan="3" className="px-4 py-2.5 text-right font-sans uppercase text-[11px] text-surface-400">
                    Ledger Totals:
                  </td>
                  <td className="px-4 py-2.5 text-right text-rose-400">
                    ₹{totalDebits.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-2.5 text-right text-emerald-400">
                    ₹{totalCredits.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-2.5 text-right text-brand-400 text-sm">
                    ₹{account.balanceDue.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ==============================================================================
            PURE-PAPER A4 PRINTABLE DOCUMENT: BAHI-KHATA LEDGER STATEMENT
            Hidden on screen, revealed exclusively under isolated @media print iframe
        ============================================================================== */}
        <div id="printable-customer-ledger" className="hidden printable-document printable-a4 p-8 text-black bg-white font-mono text-xs space-y-4">
          
          {/* Firm Branding Header */}
          <div className="border-b-2 border-black pb-3 text-center">
            <div className="font-sans font-bold text-xs uppercase tracking-widest text-slate-700">
              Shubh Deepawali &bull; Shubh Labh &bull; Shree Ganeshay Namah
            </div>
            <h1 className="font-sans font-black text-2xl uppercase tracking-wider text-black mt-1">
              {tenant.name}
            </h1>
            <p className="text-xs font-sans text-slate-800 mt-0.5">{tenant.address}</p>
            <div className="text-[11px] font-sans text-slate-700 flex justify-center gap-4 mt-1">
              <span><strong>GSTIN:</strong> {tenant.gstin}</span>
              <span>&bull;</span>
              <span><strong>State Code:</strong> 07 (DELHI)</span>
              <span>&bull;</span>
              <span><strong>Phone:</strong> {tenant.phone}</span>
            </div>
          </div>

          {/* Statement Title & Meta */}
          <div className="flex justify-between items-center border-b border-black pb-2">
            <div>
              <h2 className="font-sans font-black text-sm uppercase tracking-wide">
                CUSTOMER BAHI-KHATA (LEDGER STATEMENT)
              </h2>
              <span className="text-[10px] text-slate-600 font-sans">
                Khaata Nakal / Jama-Namo Account Ledger
              </span>
            </div>
            <div className="text-right text-[11px]">
              <div><strong>Statement Date:</strong> {new Date().toLocaleDateString('en-IN')}</div>
              <div><strong>Khaata A/c ID:</strong> {account.id}</div>
            </div>
          </div>

          {/* Customer KYC Card */}
          <div className="border border-black p-3 rounded grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-sans uppercase font-bold text-slate-600 block">Customer Particulars</span>
              <strong className="text-sm font-sans text-black block">{account.customerName}</strong>
              <div className="mt-0.5 text-slate-800">
                <div>Address: {account.city}</div>
                <div>Mobile: {account.phone}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-sans uppercase font-bold text-slate-600 block">Credit Terms &amp; Limits</span>
              <div>Credit Ceiling: <strong>₹{account.creditLimit.toLocaleString('en-IN')}</strong></div>
              <div>Days Outstanding: <strong>{account.daysOutstanding} Days</strong></div>
              <div>Primary Invoice Ref: <strong>{account.invoiceNo}</strong> ({account.invoiceDate})</div>
              <div>Account Status: <strong>{account.isBlocked ? 'CREDIT ON HOLD' : 'REGULAR ACTIVE'}</strong></div>
            </div>
          </div>

          {/* Ledger Table */}
          <table className="w-full text-left border-collapse border border-black text-xs">
            <thead className="bg-slate-100 border-b-2 border-black font-sans font-bold text-[10px] uppercase">
              <tr>
                <th className="border border-black p-2">Date</th>
                <th className="border border-black p-2">Voucher #</th>
                <th className="border border-black p-2">Narration / Particulars</th>
                <th className="border border-black p-2 text-right">Debit (Dr) ₹</th>
                <th className="border border-black p-2 text-right">Credit (Cr) ₹</th>
                <th className="border border-black p-2 text-right">Balance Due ₹</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((tx, idx) => (
                <tr key={idx} className="border-b border-slate-300">
                  <td className="border border-black p-2 whitespace-nowrap">{tx.date}</td>
                  <td className="border border-black p-2 whitespace-nowrap font-bold">{tx.voucherNo}</td>
                  <td className="border border-black p-2 font-sans">{tx.particulars}</td>
                  <td className="border border-black p-2 text-right">{tx.debit > 0 ? tx.debit.toLocaleString('en-IN') : '-'}</td>
                  <td className="border border-black p-2 text-right">{tx.credit > 0 ? tx.credit.toLocaleString('en-IN') : '-'}</td>
                  <td className="border border-black p-2 text-right font-bold">{tx.balance.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-black font-bold bg-slate-50">
              <tr>
                <td colSpan="3" className="border border-black p-2 text-right font-sans uppercase">Total Summary:</td>
                <td className="border border-black p-2 text-right">₹{totalDebits.toLocaleString('en-IN')}</td>
                <td className="border border-black p-2 text-right">₹{totalCredits.toLocaleString('en-IN')}</td>
                <td className="border border-black p-2 text-right text-sm">₹{account.balanceDue.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          {/* Closing Balance Notice */}
          <div className="border border-black p-2.5 rounded bg-slate-50 flex justify-between items-center text-xs">
            <div>
              <span className="font-sans font-bold block uppercase text-[10px] text-slate-700">Net Outstanding Amount Due</span>
              <span className="font-sans italic text-[11px] text-slate-700">
                Please verify this ledger balance and clear outstanding dues at your earliest.
              </span>
            </div>
            <div className="text-right">
              <span className="font-black text-base">₹{account.balanceDue.toLocaleString('en-IN')}</span>
              <span className="block text-[10px] font-sans text-slate-600">Payable to {tenant.name}</span>
            </div>
          </div>

          {/* Statutory Terms & Signatures */}
          <div className="pt-2 text-[10px] font-sans text-slate-600 space-y-1">
            <p>1. Interest @ 1.5% per month will be levied if payment exceeds approved credit tenure.</p>
            <p>2. Subject to local city jurisdiction. Any discrepancy must be notified within 7 days of statement date.</p>
          </div>

          <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs font-sans">
            <div>
              <div className="border-t border-black pt-1 font-bold">
                Customer's Acknowledgment &amp; Signature
              </div>
              <span className="text-[10px] text-slate-500">I confirm having verified the ledger entries above.</span>
            </div>
            <div>
              <div className="border-t border-black pt-1 font-bold">
                For {tenant.name}
              </div>
              <span className="text-[10px] text-slate-500">Authorised Signatory / Munim Desk</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
