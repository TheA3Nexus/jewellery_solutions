import React from 'react';
import { printA4 } from '../../../utils/printService';
import { 
  FileCheck, 
  Printer, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Radio, 
  Building2 
} from 'lucide-react';

export const TrayAuditCertificateModal = ({ 
  isOpen, 
  onClose, 
  trayNo, 
  expectedItems, 
  scannedRfidTags, 
  tenant 
}) => {
  if (!isOpen) return null;

  const matchedItems = expectedItems.filter(item => scannedRfidTags.includes(item.rfidTag));
  const missingItems = expectedItems.filter(item => !scannedRfidTags.includes(item.rfidTag));
  const isPerfect = missingItems.length === 0;

  const totalExpectedWeight = expectedItems.reduce((sum, i) => sum + (i.netWeight || 0), 0);
  const totalVerifiedWeight = matchedItems.reduce((sum, i) => sum + (i.netWeight || 0), 0);
  const auditDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const auditTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const auditRef = `AUD-${trayNo.replace(/[^A-Za-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-4xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center border-b border-surface-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
                Physical Tray Audit &amp; Reconciliation Certificate
              </h3>
              <span className="text-[10px] font-mono text-surface-400">
                UHF RFID Instant Scan &bull; Ref: {auditRef} &bull; {trayNo}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-print-audit-a4"
              onClick={() => printA4('printable-tray-audit-sheet', `Tray_Audit_${trayNo}_${auditRef}`)}
              className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Certificate</span>
            </button>
            <button 
              data-testid="close-modal-btn" 
              onClick={onClose} 
              className="text-surface-400 hover:text-surface-100 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper A4 Formatted Layout Container */}
        <div 
          id="printable-tray-audit-sheet" 
          className="bg-white text-black p-8 rounded-xl shadow font-sans text-xs space-y-4 border border-slate-300 printable-document printable-a4"
        >
          {/* Showroom Header */}
          <div className="border-b-2 border-black pb-3 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-black">
                {tenant?.name || 'A3 LUXURY JEWELLERS'}
              </h1>
              <p className="text-[11px] text-slate-700 mt-0.5">
                {tenant?.tagline || 'Exquisite Hallmarked Gold & Diamond Ornaments'}
              </p>
              <p className="text-[10px] text-slate-600">
                Showroom: Zaveri Bazaar, Mumbai &bull; GSTIN: {tenant?.gstin || '27AABCU9603R1ZM'} &bull; Phone: +91 98200 12345
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="px-2.5 py-1 text-[11px] font-bold border border-black uppercase inline-block">
                STOCK AUDIT CERTIFICATE
              </span>
              <div className="text-[10px] text-slate-700 mt-1">Audit Ref: <strong>{auditRef}</strong></div>
              <div className="text-[10px] text-slate-700">Date: {auditDate} &bull; Time: {auditTime}</div>
            </div>
          </div>

          {/* Audit Metadata & Summary Block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200 font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Tray ID / Location</span>
              <strong className="text-sm font-bold text-black">{trayNo}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Expected Count</span>
              <strong className="text-sm font-bold text-black">{expectedItems.length} Articles</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Scanned &amp; Verified</span>
              <strong className="text-sm font-bold text-emerald-700">{matchedItems.length} Verified</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Missing Discrepancies</span>
              <strong className={`text-sm font-bold ${isPerfect ? 'text-black' : 'text-rose-700'}`}>
                {missingItems.length} {missingItems.length > 0 ? 'ALERT' : 'Nil'}
              </strong>
            </div>
          </div>

          {/* Security Alert if items are missing */}
          {!isPerfect && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded text-rose-900 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <strong>DISCREPANCY ALERT:</strong> {missingItems.length} article(s) registered in {trayNo} were unaccounted for during UHF RFID transponder scanning. Immediate CCTV counter review recommended.
              </div>
            </div>
          )}

          {/* Verified Items Table */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
              Tray Reconciliation Ledger ({trayNo})
            </h4>
            <table className="w-full text-left border-collapse border border-slate-300 font-mono text-[10px]">
              <thead className="bg-slate-100 text-black">
                <tr className="border-b border-slate-300">
                  <th className="p-1.5 border-r border-slate-300">#</th>
                  <th className="p-1.5 border-r border-slate-300 font-sans">Item Code</th>
                  <th className="p-1.5 border-r border-slate-300 font-sans">Description</th>
                  <th className="p-1.5 border-r border-slate-300">HUID</th>
                  <th className="p-1.5 border-r border-slate-300">RFID EPC</th>
                  <th className="p-1.5 border-r border-slate-300">Purity</th>
                  <th className="p-1.5 border-r border-slate-300 text-right">Net Wt</th>
                  <th className="p-1.5 text-center font-sans">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {expectedItems.map((item, index) => {
                  const verified = scannedRfidTags.includes(item.rfidTag);
                  return (
                    <tr key={item.id} className={verified ? '' : 'bg-rose-50 font-bold'}>
                      <td className="p-1.5 border-r border-slate-300 text-slate-500">{index + 1}</td>
                      <td className="p-1.5 border-r border-slate-300 font-bold text-black">{item.id}</td>
                      <td className="p-1.5 border-r border-slate-300 font-sans text-slate-800">{item.name}</td>
                      <td className="p-1.5 border-r border-slate-300 font-bold">{item.huid || 'HD7891'}</td>
                      <td className="p-1.5 border-r border-slate-300 text-[9px] text-slate-600">{item.rfidTag}</td>
                      <td className="p-1.5 border-r border-slate-300">{item.purity}</td>
                      <td className="p-1.5 border-r border-slate-300 text-right font-bold text-black">
                        {(parseFloat(item.netWeight) || 0).toFixed(3)}g
                      </td>
                      <td className="p-1.5 text-center font-sans">
                        {verified ? (
                          <span className="text-emerald-700 font-bold">VERIFIED</span>
                        ) : (
                          <span className="text-rose-700 font-bold">MISSING</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t border-slate-300">
                <tr>
                  <td colSpan={6} className="p-1.5 text-right font-sans uppercase">Total Tray Net Gold:</td>
                  <td className="p-1.5 text-right">{totalExpectedWeight.toFixed(3)}g</td>
                  <td className="p-1.5 text-center font-sans">
                    {isPerfect ? '100% Match' : `${matchedItems.length}/${expectedItems.length}`}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Statutory Certification Statement */}
          <div className="pt-2 text-[10px] text-slate-600 leading-normal border-t border-slate-200 font-sans">
            <p>
              <strong>Certification:</strong> This physical stock audit document certifies that the showroom tray designated above underwent rapid zero-line-of-sight electronic tally via UHF RFID sensing. The items listed have been verified against active perpetual inventory records in accordance with Showroom Loss Prevention Standards.
            </p>
          </div>

          {/* Authorized Signature Blocks */}
          <div className="grid grid-cols-3 gap-6 pt-8 text-center text-[10px] font-sans">
            <div className="border-t border-black pt-1">
              <span className="font-bold text-slate-800">Floor Counter In-Charge</span>
              <p className="text-slate-500 text-[9px]">Verified On-Site</p>
            </div>
            <div className="border-t border-black pt-1">
              <span className="font-bold text-slate-800">Inventory Audit Officer</span>
              <p className="text-slate-500 text-[9px]">RFID Mat Reconciliation</p>
            </div>
            <div className="border-t border-black pt-1">
              <span className="font-bold text-slate-800">Showroom General Manager</span>
              <p className="text-slate-500 text-[9px]">Authorized Signatory</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
