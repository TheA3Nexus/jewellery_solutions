import React, { useState } from 'react';
import { printA4, printThermal } from '../../../utils/printService';
import { 
  Printer, 
  X, 
  ShieldCheck, 
  QrCode, 
  Tag, 
  Lock, 
  Building2, 
  User, 
  Phone, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const PawnTicketFormGModal = ({ loan, onClose }) => {
  const { tenant } = useTenant();
  const [activePrintView, setActivePrintView] = useState('FORM_G'); // 'FORM_G' | 'PACKET_TAG'

  if (!loan) return null;

  const item = loan.pledgedItems?.[0] || {
    description: 'Gold Ornament',
    grossWeight: 0,
    lessWeight: 0,
    netWeight: 0,
    purityPercent: 91.67,
    fineWeight: 0,
    marketValuation: 0,
    lockerBoxNo: 'Locker-01'
  };

  const packetNo = loan.packetNo || `PKT-${loan.id.replace('LN-', '')}`;

  const handlePrintFormG = () => {
    printA4('printable-pawn-ticket', `Pawn_Ticket_Form_G_${loan.id}`);
  };

  const handlePrintPacketTag = () => {
    printThermal('printable-girvi-packet-tag', `Vault_Tag_${packetNo}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[94vh]">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider font-sans">
                Statutory Pawn Ticket &bull; Form G &amp; Form 8
              </h3>
              <p className="text-[11px] text-surface-400 font-mono">
                Loan ID: <strong className="text-brand-400">{loan.id}</strong> &bull; Packet #{packetNo}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              id="btn-print-pawn-ticket"
              onClick={handlePrintFormG}
              className="px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-brand-400" />
              <span>Print Form G (A4)</span>
            </button>

            <button
              id="btn-print-packet-tag"
              onClick={handlePrintPacketTag}
              className="px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Vault Tag</span>
            </button>

            <button 
              id="btn-close-form-g-modal"
              onClick={onClose} 
              className="text-surface-400 hover:text-surface-100 p-1.5 rounded-lg hover:bg-surface-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex bg-surface-950 p-1 rounded-lg border border-surface-800 text-xs font-semibold w-max">
          <button
            onClick={() => setActivePrintView('FORM_G')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activePrintView === 'FORM_G'
                ? 'bg-surface-800 text-surface-100 shadow-sm'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Statutory Form G &bull; Pawn Ticket (A4)
          </button>
          <button
            onClick={() => setActivePrintView('PACKET_TAG')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activePrintView === 'PACKET_TAG'
                ? 'bg-surface-800 text-amber-400 shadow-sm'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Security Vault Pouch Tag (80mm)
          </button>
        </div>

        {/* ==============================================================================
            A4 STATUTORY PAWN TICKET (FORM G & FORM 8)
        ============================================================================== */}
        <div 
          id="printable-pawn-ticket" 
          className={`bg-white text-black p-8 rounded-xl font-mono text-xs space-y-4 border border-slate-300 printable-document printable-a4 ${
            activePrintView !== 'FORM_G' ? 'hidden' : 'block'
          }`}
        >
          {/* Header */}
          <div className="text-center space-y-1 border-b-2 border-black pb-3">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-700 font-sans">
              Shubh Labh &bull; Shree Ganeshay Namah
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-black font-sans">
              {tenant.name}
            </h2>
            <p className="text-xs text-slate-700 font-sans">
              {tenant.address} &bull; Phone: {tenant.phone}
            </p>
            <div className="font-black text-sm pt-1 uppercase tracking-wider text-black font-sans">
              PAWN TICKET FORM G [Section 11(b)(i) and Rule 12]
            </div>
            <div className="text-[10px] text-slate-600 font-sans flex justify-center gap-4">
              <span><strong>Moneylenders License:</strong> {tenant.bisLicenseNo}</span>
              <span>&bull;</span>
              <span><strong>GSTIN:</strong> {tenant.gstin}</span>
            </div>
          </div>

          {/* Meta Details */}
          <div className="grid grid-cols-2 gap-4 border-b border-black pb-3 text-xs">
            <div>
              <div><strong>Pawn Ticket No:</strong> {loan.id}</div>
              <div><strong>Pawner (Borrower):</strong> {loan.borrower?.name}</div>
              <div><strong>Address:</strong> {loan.borrower?.address || 'Registered Town'}</div>
              <div><strong>Contact Phone:</strong> {loan.borrower?.phone}</div>
              <div><strong>Aadhaar / ID Ref:</strong> {loan.borrower?.aadhaar ? `XXXX-XXXX-${loan.borrower.aadhaar}` : 'Verified'}</div>
            </div>
            <div className="text-right">
              <div><strong>Sanction Date:</strong> {new Date(loan.startDate).toLocaleDateString('en-IN')}</div>
              <div><strong>Vault / Safe Location:</strong> {item.lockerBoxNo || 'Locker-01'}</div>
              <div><strong>Security Packet No:</strong> {packetNo}</div>
              <div><strong>Tenure:</strong> {loan.tenureMonths || 11} Months</div>
              <div><strong>Statutory Due Date:</strong> {new Date(new Date(loan.startDate).getTime() + (loan.tenureMonths || 11) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          {/* Table of Pledged Articles */}
          <div className="border border-black rounded overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-black uppercase border-b-2 border-black font-bold font-sans text-[11px]">
                <tr>
                  <th className="p-2 border-r border-black">Article Description</th>
                  <th className="p-2 text-right border-r border-black">Gross (g)</th>
                  <th className="p-2 text-right border-r border-black">Less / Tare (g)</th>
                  <th className="p-2 text-right border-r border-black">Net Wt (g)</th>
                  <th className="p-2 text-right border-r border-black">Purity %</th>
                  <th className="p-2 text-right border-r border-black">Fine 24K (g)</th>
                  <th className="p-2 text-right">Valuation (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {(loan.pledgedItems || [item]).map((itm, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-bold font-sans border-r border-black">{itm.description}</td>
                    <td className="p-2 text-right border-r border-black">{itm.grossWeight?.toFixed(3)}</td>
                    <td className="p-2 text-right border-r border-black">{itm.lessWeight?.toFixed(3)}</td>
                    <td className="p-2 text-right font-bold border-r border-black">{itm.netWeight?.toFixed(3)}</td>
                    <td className="p-2 text-right border-r border-black">{itm.purityPercent}%</td>
                    <td className="p-2 text-right font-bold border-r border-black">{itm.fineWeight?.toFixed(3)}</td>
                    <td className="p-2 text-right font-bold">₹{itm.marketValuation?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="p-3 rounded bg-slate-50 border border-black space-y-1 text-xs">
            <div className="flex justify-between font-black text-sm text-black">
              <span>PRINCIPAL SUM ADVANCED:</span>
              <span id="stat-pawn-principal">₹{loan.principalAmount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-800">
              <span>Monthly Interest Rate:</span>
              <span>{loan.interestRateMonthly}% per month ({loan.interestRateMonthly * 12}% per annum)</span>
            </div>
            <div className="flex justify-between text-slate-800">
              <span>Interest Model:</span>
              <span>{loan.interestModel || 'Monthly Simple Interest'}</span>
            </div>
          </div>

          {/* Statutory Terms & Conditions */}
          <div className="text-[10px] text-slate-700 space-y-1 border-t border-black pt-2 font-sans leading-relaxed">
            <p className="font-bold uppercase text-black">Statutory Conditions &amp; Notice under Section 11 &amp; Rule 12:</p>
            <p>1. The pledged ornaments must be redeemed within {loan.tenureMonths || 11} months from the sanction date upon payment of principal and accrued interest.</p>
            <p>2. Failure to pay monthly interest or clear dues within {loan.tenureMonths || 11} months gives the pawnbroker the statutory right to issue a 15-day final legal notice and put articles to Public Auction through a certified auctioneer.</p>
            <p>3. Pledged gold is stored securely in fire-proof locker vaults and insured against burglary and fire.</p>
            <p>4. In case of duplicate ticket requirement, pawner must present identity proof and an affidavit.</p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 text-xs text-black border-t border-black font-sans">
            <div>
              <div className="border-t border-black pt-1 font-bold">
                Pawner (Borrower) Signature
              </div>
              <span className="text-[10px] text-slate-600">I confirm the article weights and agree to terms above.</span>
            </div>
            <div className="text-right">
              <div className="border-t border-black pt-1 font-bold">
                For {tenant.name}
              </div>
              <span className="text-[10px] text-slate-600">Licensed Pawnbroker / Authorised Signatory</span>
            </div>
          </div>
        </div>

        {/* ==============================================================================
            80MM THERMAL VAULT SECURITY PACKET TAG
        ============================================================================== */}
        <div 
          id="printable-girvi-packet-tag"
          className={`bg-white text-black p-4 rounded-xl font-mono text-xs space-y-2 border-2 border-dashed border-slate-400 printable-document printable-thermal max-w-xs mx-auto ${
            activePrintView !== 'PACKET_TAG' ? 'hidden' : 'block'
          }`}
        >
          <div className="text-center border-b border-black pb-1.5">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-700">Vault Security Seal</span>
            <h4 className="font-sans font-black text-xs uppercase text-black">{tenant.name}</h4>
            <div className="text-sm font-black text-black mt-1 font-mono">{packetNo}</div>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-600">Loan Ref:</span>
              <span className="font-bold">{loan.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Borrower:</span>
              <span className="font-sans font-semibold">{loan.borrower?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Sanction Date:</span>
              <span>{new Date(loan.startDate).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Locker Vault:</span>
              <span className="font-bold">{item.lockerBoxNo || 'Safe'}</span>
            </div>
          </div>

          <div className="border-t border-b border-black py-1.5 space-y-1 text-[11px]">
            <div className="font-bold text-black font-sans">{item.description}</div>
            <div className="flex justify-between">
              <span>Gross Wt: <strong>{item.grossWeight?.toFixed(3)}g</strong></span>
              <span>Net Wt: <strong>{item.netWeight?.toFixed(3)}g</strong></span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Purity: {item.purityPercent}%</span>
              <span>Fine Gold: <strong>{item.fineWeight?.toFixed(3)}g</strong></span>
            </div>
          </div>

          <div className="flex justify-between text-xs font-bold pt-1">
            <span>Principal:</span>
            <span>₹{loan.principalAmount?.toLocaleString('en-IN')}</span>
          </div>

          <div className="text-center text-[9px] text-slate-500 font-sans pt-1">
            Do not tamper or open without dual biometric / OTP authorization.
          </div>
        </div>

      </div>
    </div>
  );
};
