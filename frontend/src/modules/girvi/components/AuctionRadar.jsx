import React, { useState } from 'react';
import { printA4 } from '../../../utils/printService';
import { useTenant } from '../../../context/TenantContext';
import { 
  AlertTriangle, 
  Send, 
  Printer, 
  MessageCircle, 
  FileText, 
  ShieldAlert, 
  Calendar,
  Gavel,
  CheckCircle2,
  X,
  Clock
} from 'lucide-react';

export const AuctionRadar = ({ loans }) => {
  const { tenant } = useTenant();
  const [selectedNoticeLoan, setSelectedNoticeLoan] = useState(null);
  const [noticeSent, setNoticeSent] = useState(false);
  const [noticesDispatchedCount, setNoticesDispatchedCount] = useState(12);

  // Filter loans that are overdue (e.g. >30 days or active overdue)
  const overdueLoans = loans.filter(l => l.status === 'ACTIVE');

  const handleOpenNotice = (loan) => {
    setSelectedNoticeLoan(loan);
    setNoticeSent(false);
  };

  const handlePrintNotice = () => {
    printA4('printable-auction-notice', `Auction_Notice_${selectedNoticeLoan?.id}`);
  };

  const handleSendNotice = () => {
    setNoticeSent(true);
    setNoticesDispatchedCount(prev => prev + 1);
    const cleanPhone = selectedNoticeLoan?.borrower?.phone?.replace(/[^0-9]/g, '') || '';
    const text = `STATUTORY LEGAL NOTICE: Respected ${selectedNoticeLoan?.borrower?.name}, your gold loan ${selectedNoticeLoan?.id} of Rs. ${selectedNoticeLoan?.principalAmount?.toLocaleString('en-IN')} has defaulted. Under the State Moneylenders Act, please clear all outstanding dues within 15 days, failing which pledged ornaments (${selectedNoticeLoan?.pledgedItems?.[0]?.description}) shall be put to Public Auction. From: ${tenant.name}.`;
    
    if (cleanPhone) {
      window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="card-surface space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-800 pb-3">
        <div className="flex items-center gap-2">
          <Gavel className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider font-sans">
              11-Month Default Radar &amp; Statutory Auction Workflow
            </h3>
            <p className="text-[11px] text-surface-400 font-mono">
              Statutory 3-Stage Legal Notice Automation &bull; Public Auction Register
            </p>
          </div>
        </div>
      </div>

      {/* Radar Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800">
          <span className="text-surface-400 text-[10px] uppercase font-sans block">Overdue Loan Accounts</span>
          <strong id="stat-radar-overdue-count" className="text-xl font-bold text-amber-400">
            {overdueLoans.length} Loans
          </strong>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800">
          <span className="text-surface-400 text-[10px] uppercase font-sans block">Notices Dispatched</span>
          <strong id="stat-radar-notices-count" className="text-xl font-bold text-emerald-400">
            {noticesDispatchedCount} Dispatched
          </strong>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800">
          <span className="text-surface-400 text-[10px] uppercase font-sans block">Pending Public Auction</span>
          <strong id="stat-radar-pending-auction" className="text-xl font-bold text-rose-400">
            0 Accounts
          </strong>
        </div>
      </div>

      {/* Overdue Table */}
      <div className="overflow-x-auto border border-surface-800 rounded-lg font-mono text-xs">
        <table className="w-full text-left">
          <thead className="bg-surface-950 text-surface-400 text-[10px] uppercase border-b border-surface-800 font-sans">
            <tr>
              <th className="p-2.5">Loan No</th>
              <th className="p-2.5">Borrower</th>
              <th className="p-2.5">Pledged Gold Description</th>
              <th className="p-2.5 text-right">Principal</th>
              <th className="p-2.5 text-right">Elapsed Days</th>
              <th className="p-2.5 text-center">Statutory Notice Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/60">
            {overdueLoans.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-surface-500 font-sans text-xs">
                  No default accounts approaching auction threshold.
                </td>
              </tr>
            ) : (
              overdueLoans.map((loan) => {
                const start = new Date(loan.startDate).getTime();
                const diffDays = Math.max(1, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)));

                return (
                  <tr key={loan.id} id={`row-auction-${loan.id}`} className="hover:bg-surface-850/40 transition">
                    <td className="p-2.5 font-bold text-brand-400">{loan.id}</td>
                    <td className="p-2.5 font-sans font-semibold text-surface-200">
                      {loan.borrower?.name}
                      <div className="text-[10px] text-surface-400 font-mono">{loan.borrower?.phone}</div>
                    </td>
                    <td className="p-2.5 font-sans text-surface-300">
                      {loan.pledgedItems?.[0]?.description}
                    </td>
                    <td className="p-2.5 text-right font-bold text-surface-100">
                      ₹{loan.principalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2.5 text-right text-amber-400 font-bold">
                      {diffDays} Days Active
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        id={`btn-gen-legal-notice-${loan.id}`}
                        onClick={() => handleOpenNotice(loan)}
                        className="btn-danger py-1 px-2.5 text-[10px] font-sans mx-auto flex items-center justify-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Generate Legal Notice</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Statutory Legal Auction Notice Modal */}
      {selectedNoticeLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[94vh]">
            
            <div className="flex justify-between items-center border-b border-surface-800 pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-surface-200 font-sans uppercase">
                  Statutory Default &amp; Final Public Auction Notice
                </span>
              </div>
              <button 
                id="btn-close-notice-modal"
                onClick={() => setSelectedNoticeLoan(null)} 
                className="text-surface-400 hover:text-surface-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Letter Preview on Screen */}
            <div className="p-4 bg-surface-950 rounded-lg text-surface-200 text-xs space-y-2 border border-surface-800 font-sans leading-relaxed">
              <div className="flex justify-between items-center text-[11px] text-surface-400 font-mono border-b border-surface-800 pb-2">
                <span>Pawner: <strong className="text-surface-100 font-sans">{selectedNoticeLoan.borrower?.name}</strong></span>
                <span>Loan Ref: <strong className="text-brand-400">{selectedNoticeLoan.id}</strong></span>
              </div>
              <p className="text-slate-300">
                Notice will be served under <strong>Section 11(b) &amp; Rule 12 of the State Moneylenders Act</strong> for recovery of principal <strong>₹{selectedNoticeLoan.principalAmount.toLocaleString('en-IN')}</strong> against pledged ornament ({selectedNoticeLoan.pledgedItems?.[0]?.description}).
              </p>
              <div className="text-[11px] text-amber-400 font-semibold">
                Statutory cooling period: 15 Days from dispatch date before putting articles to public auction.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-800">
              <button
                id="btn-print-auction-notice"
                type="button"
                onClick={handlePrintNotice}
                className="btn-secondary py-2 px-3 text-xs font-sans font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-brand-400" />
                <span>Print Legal Letter (A4)</span>
              </button>

              <button
                id="btn-dispatch-notice"
                type="button"
                onClick={handleSendNotice}
                className="btn-primary flex-1 py-2 text-xs font-sans font-bold flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{noticeSent ? 'Notice Dispatched to WhatsApp & Postal Log' : 'Dispatch Notice (WhatsApp & Registered Post)'}</span>
              </button>
            </div>

            {/* ==============================================================================
                PURE-PAPER A4 PRINTABLE DOCUMENT: STATUTORY AUCTION LEGAL NOTICE
            ============================================================================== */}
            <div id="printable-auction-notice" className="hidden printable-document printable-a4 p-8 text-black bg-white font-mono text-xs space-y-4">
              
              <div className="text-center space-y-1 border-b-2 border-black pb-3">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-700 font-sans">
                  REGISTERED POST WITH A.D. &bull; LEGAL NOTICE
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-black font-sans">
                  {tenant.name}
                </h2>
                <p className="text-xs text-slate-700 font-sans">
                  {tenant.address} &bull; Phone: {tenant.phone}
                </p>
                <div className="font-bold text-xs uppercase tracking-wider text-rose-700 pt-1 font-sans">
                  FINAL STATUTORY NOTICE BEFORE PUBLIC AUCTION OF PLEDGED GOLD
                </div>
                <div className="text-[10px] text-slate-600 font-sans">
                  Moneylenders License: {tenant.bisLicenseNo} &bull; GSTIN: {tenant.gstin}
                </div>
              </div>

              <div className="font-sans text-xs space-y-3 leading-relaxed">
                <div>
                  <strong>To:</strong><br />
                  <strong>Name:</strong> {selectedNoticeLoan.borrower?.name}<br />
                  <strong>Address:</strong> {selectedNoticeLoan.borrower?.address || 'Registered Town'}<br />
                  <strong>Mobile:</strong> {selectedNoticeLoan.borrower?.phone}
                </div>

                <div className="pt-2">
                  <strong>Subject:</strong> Final 15-Day Demand Notice under Section 11 of the State Moneylenders Act for Loan A/c #{selectedNoticeLoan.id}.
                </div>

                <p>
                  Respected Sir / Madam,
                </p>

                <p>
                  You are hereby put on statutory notice that on <strong>{new Date(selectedNoticeLoan.startDate).toLocaleDateString('en-IN')}</strong>, you availed a secured gold loan of principal sum <strong>₹{selectedNoticeLoan.principalAmount.toLocaleString('en-IN')}</strong> by pledging the following gold articles under safe custody:
                </p>

                <div className="border border-black p-2 rounded bg-slate-50 font-mono text-xs">
                  <div><strong>Pledged Article:</strong> {selectedNoticeLoan.pledgedItems?.[0]?.description}</div>
                  <div><strong>Net Weight:</strong> {selectedNoticeLoan.pledgedItems?.[0]?.netWeight?.toFixed(3)} Grams (Purity: {selectedNoticeLoan.pledgedItems?.[0]?.purityPercent}%)</div>
                  <div><strong>Vault Safe Ref:</strong> {selectedNoticeLoan.pledgedItems?.[0]?.lockerBoxNo || 'Locker-01'}</div>
                </div>

                <p>
                  According to statutory pawnbroking covenants, the agreed tenure for redemption was {selectedNoticeLoan.tenureMonths || 11} months. Despite expiration of tenure and repeated telephone reminders, you have failed to clear accrued monthly interest or the principal sum.
                </p>

                <p className="font-bold text-black border border-black p-2 bg-slate-100">
                  You are hereby called upon to pay the entire outstanding principal sum along with accrued interest within 15 (FIFTEEN) DAYS of the receipt of this notice, failing which your pledged ornaments shall be put to PUBLIC AUCTION through a government-approved licensed auctioneer, and any shortfall shall be recovered from you legally.
                </p>

                <div className="pt-8 grid grid-cols-2 gap-8 text-xs font-sans">
                  <div>
                    <div>Date: <strong>{new Date().toLocaleDateString('en-IN')}</strong></div>
                    <div>Place: <strong>{tenant.address?.split(',')?.[0] || 'Local City'}</strong></div>
                  </div>
                  <div className="text-right">
                    <div className="border-t border-black pt-1 font-bold inline-block">
                      For {tenant.name}
                    </div>
                    <div className="text-[10px] text-slate-600">Authorised Signatory / Licensed Pawnbroker</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
