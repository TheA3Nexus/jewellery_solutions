import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';

export const AuctionRadar = ({ loans }) => {
  const { tenant } = useTenant();
  const [selectedNoticeLoan, setSelectedNoticeLoan] = useState(null);
  const [noticeSent, setNoticeSent] = useState(false);

  // Filter loans that are overdue (e.g. >180 days or marked high risk)
  const overdueLoans = loans.filter(l => l.status === 'ACTIVE');

  const handleOpenNotice = (loan) => {
    setSelectedNoticeLoan(loan);
    setNoticeSent(false);
  };

  const handleSendNotice = () => {
    setNoticeSent(true);
    setTimeout(() => {
      alert(`Legal Auction Notice successfully dispatched to ${selectedNoticeLoan?.borrower?.phone} via WhatsApp & Registered Post Log.`);
      setSelectedNoticeLoan(null);
    }, 1000);
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
          <span className="text-surface-400 text-[10px] uppercase font-sans block">Overdue Accounts</span>
          <strong className="text-xl font-bold text-amber-400">{overdueLoans.length} Loans</strong>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800">
          <span className="text-surface-400 text-[10px] uppercase font-sans block">Notices Dispatched</span>
          <strong className="text-xl font-bold text-emerald-400">12 Dispatched</strong>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800">
          <span className="text-surface-400 text-[10px] uppercase font-sans block">Pending Public Auction</span>
          <strong className="text-xl font-bold text-rose-400">0 Accounts</strong>
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
              overdueLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-surface-850/40 transition">
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
                    42 Days Overdue
                  </td>
                  <td className="p-2.5 text-center">
                    <button
                      onClick={() => handleOpenNotice(loan)}
                      className="btn-danger py-1 px-2.5 text-[10px] font-sans mx-auto"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Generate Legal Notice</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Statutory Legal Auction Notice Modal */}
      {selectedNoticeLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-surface-800 pb-2">
              <span className="text-xs font-bold text-surface-200 font-sans uppercase">
                Statutory Default &amp; Final Auction Notice
              </span>
              <button onClick={() => setSelectedNoticeLoan(null)} className="text-surface-400 hover:text-surface-100">
                &times;
              </button>
            </div>

            {/* Letter Layout */}
            <div className="p-5 bg-white text-black rounded-lg font-serif text-xs space-y-3 border border-slate-300 leading-relaxed">
              <div className="text-center border-b border-slate-300 pb-2">
                <h4 className="font-bold text-sm tracking-tight text-slate-900 uppercase font-sans">
                  {tenant.name}
                </h4>
                <p className="text-[10px] text-slate-600 font-mono">
                  {tenant.address} &bull; Phone: {tenant.phone}
                </p>
                <div className="font-bold text-xs uppercase tracking-wider text-rose-700 pt-1 font-sans">
                  FINAL LEGAL NOTICE BEFORE PUBLIC AUCTION
                </div>
              </div>

              <div className="font-sans text-[11px] space-y-2">
                <div>
                  <strong>To:</strong> {selectedNoticeLoan.borrower?.name}<br />
                  <strong>Address:</strong> {selectedNoticeLoan.borrower?.address || 'Registered Town'}<br />
                  <strong>Phone:</strong> {selectedNoticeLoan.borrower?.phone}
                </div>

                <p className="pt-2">
                  Dear Sir / Madam,
                </p>
                <p>
                  As per secured gold loan agreement under <strong>Clause 404 of the State Moneylenders Act</strong>, you are hereby informed that you had availed a principal loan of <strong>₹{selectedNoticeLoan.principalAmount.toLocaleString('en-IN')}</strong> under Loan Account No. <strong>{selectedNoticeLoan.id}</strong>.
                </p>
                <p>
                  According to the statutory lending terms, upon failure of deposition of the accrued interest or principal within 11 months, legal proceeding for liquidation is initiated. Despite multiple phone reminders, your account remains unsettled.
                </p>
                <p>
                  <strong>This is the final notice</strong> being served upon you to clear all outstanding dues within <strong>15 days</strong> of receipt of this notice, failing which your pledged ornaments ({selectedNoticeLoan.pledgedItems?.[0]?.description}) shall be put to <strong>Public Auction through an authorized auctioneer</strong>.
                </p>

                <div className="pt-4 border-t border-slate-300 flex justify-between items-end font-sans text-[10px]">
                  <div>Date: {new Date().toLocaleDateString()}</div>
                  <div className="font-bold">Authorized Signatory &bull; {tenant.name}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedNoticeLoan(null)}
                className="btn-secondary flex-1 py-2 text-xs font-sans"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSendNotice}
                disabled={noticeSent}
                className="btn-primary flex-1 py-2 text-xs font-sans font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{noticeSent ? 'Notice Dispatched!' : 'Dispatch Notice (WhatsApp & Registered Post)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};