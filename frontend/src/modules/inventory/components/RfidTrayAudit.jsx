import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ShieldAlert, 
  FileSpreadsheet, 
  Layers, 
  Scan,
} from 'lucide-react';

export const RfidTrayAudit = () => {
  const { products } = useTenant();

  // Selected tray for auditing
  const [selectedTray, setSelectedTray] = useState('Tray-A04');
  const [isScanning, setIsScanning] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);

  // Simulated scan results
  const [scannedRfidTags, setScannedRfidTags] = useState([]);

  // Get list of unique trays
  const availableTrays = Array.from(new Set(products.map(p => p.trayNo).filter(Boolean)));

  // Expected items in the selected tray (In Stock only)
  const expectedItems = products.filter(p => p.trayNo === selectedTray && p.status === 'IN_STOCK');

  // Trigger 3-second rapid batch RFID scan
  const handleStartRfidScan = (simulateMissing = false) => {
    setIsScanning(true);
    setAuditComplete(false);

    setTimeout(() => {
      let tags = expectedItems.map(item => item.rfidTag);

      // If simulateMissing is true, omit the first item to trigger a RED ALERT
      if (simulateMissing && tags.length > 0) {
        tags = tags.slice(1);
      }

      setScannedRfidTags(tags);
      setIsScanning(false);
      setAuditComplete(true);
    }, 1500);
  };

  // Matched items
  const matchedItems = expectedItems.filter(item => scannedRfidTags.includes(item.rfidTag));
  
  // Missing items (Red Alert)
  const missingItems = expectedItems.filter(item => !scannedRfidTags.includes(item.rfidTag));

  return (
    <div className="card-surface space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-surface-950 border border-brand-500/40 flex items-center justify-center text-brand-400">
            <Radio className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider flex items-center gap-2">
              <span>RFID Smart Tray Instant Audit</span>
              <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800 px-2 py-0.2 rounded font-mono">
                UHF 865-867 MHz
              </span>
            </h3>
            <p className="text-[11px] text-surface-400 font-mono">
              Zero Line-of-Sight Stock Tally &bull; 3-Second Counter Reconciliation
            </p>
          </div>
        </div>

        {/* Tray Selector & Scan Action */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedTray}
            onChange={(e) => {
              setSelectedTray(e.target.value);
              setAuditComplete(false);
              setScannedRfidTags([]);
            }}
            className="select-field font-mono text-xs w-auto"
          >
            {availableTrays.map(tray => (
              <option key={tray} value={tray}>{tray}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => handleStartRfidScan(false)}
            disabled={isScanning || expectedItems.length === 0}
            className="btn-primary py-2 px-3 text-xs font-sans whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Tray...' : 'Scan Mat (All Present)'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleStartRfidScan(true)}
            disabled={isScanning || expectedItems.length === 0}
            className="btn-danger py-2 px-3 text-xs font-sans whitespace-nowrap"
            title="Simulate 1 missing item to test security alarm"
          >
            <span>Simulate Missing</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-surface-950 border border-surface-800">
          <span className="text-surface-400 text-[10px] block uppercase font-sans">
            Expected in {selectedTray}
          </span>
          <strong className="text-lg font-bold text-surface-100">
            {expectedItems.length} Articles
          </strong>
        </div>

        <div className="p-3 rounded-xl bg-surface-950 border border-surface-800">
          <span className="text-surface-400 text-[10px] block uppercase font-sans">
            Scanned &amp; Verified
          </span>
          <strong className="text-lg font-bold text-emerald-700">
            {auditComplete ? matchedItems.length : 0} Verified
          </strong>
        </div>

        <div className={`p-3 rounded-xl border ${
          auditComplete && missingItems.length > 0 
            ? 'bg-rose-50 border-rose-300 text-rose-800' 
            : 'bg-surface-950 border-surface-800 text-surface-400'
        }`}>
          <span className="text-[10px] block uppercase font-sans font-bold">
            Missing Discrepancies
          </span>
          <strong className={`text-lg font-bold ${
            auditComplete && missingItems.length > 0 ? 'text-rose-700' : 'text-surface-300'
          }`}>
            {auditComplete ? missingItems.length : 0} Missing
          </strong>
        </div>
      </div>

      {/* Red Alert Banner if Missing */}
      {auditComplete && missingItems.length > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start justify-between gap-3 animate-in zoom-in-95 duration-150">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                Security Alert: {missingItems.length} Jewellery Article(s) Unaccounted For
              </h4>
              <p className="text-[11px] text-rose-700 mt-0.5 font-sans">
                These items are officially marked as IN_STOCK in {selectedTray}, but their RFID transponders failed to respond on the scanning mat.
              </p>
            </div>
          </div>
          <button
            onClick={() => alert(`Logged security incident for ${missingItems.length} missing articles in ${selectedTray}. Security team alerted.`)}
            className="btn-danger py-1.5 px-3 text-xs whitespace-nowrap"
          >
            Log Incident Report
          </button>
        </div>
      )}

      {/* Audit Items Table */}
      <div className="overflow-x-auto border border-surface-800 rounded-lg font-mono text-xs">
        <table className="w-full text-left">
          <thead className="bg-surface-950 text-surface-400 text-[10px] uppercase border-b border-surface-800 font-sans">
            <tr>
              <th className="p-2.5">Item Code</th>
              <th className="p-2.5">Description</th>
              <th className="p-2.5">RFID EPC Tag</th>
              <th className="p-2.5">HUID</th>
              <th className="p-2.5 text-right">Net Wt</th>
              <th className="p-2.5 text-center">Audit Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/60">
            {expectedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-surface-500 font-sans text-xs">
                  No jewellery articles are currently assigned to {selectedTray}.
                </td>
              </tr>
            ) : (
              expectedItems.map(item => {
                const isMatched = auditComplete && scannedRfidTags.includes(item.rfidTag);
                const isMissing = auditComplete && !scannedRfidTags.includes(item.rfidTag);

                return (
                  <tr key={item.id} className="hover:bg-surface-850/40 transition">
                    <td className="p-2.5 font-bold text-brand-400">{item.id}</td>
                    <td className="p-2.5 font-sans font-medium text-surface-100">{item.name}</td>
                    <td className="p-2.5 text-[11px] text-surface-400">{item.rfidTag}</td>
                    <td className="p-2.5 font-bold text-surface-200">{item.huid || 'N/A'}</td>
                    <td className="p-2.5 text-right font-bold text-surface-100">{item.netWeight.toFixed(3)}g</td>
                    <td className="p-2.5 text-center">
                      {!auditComplete ? (
                        <span className="text-[10px] text-surface-500 font-sans">Pending Scan</span>
                      ) : isMatched ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center justify-center gap-1 w-24 mx-auto">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-rose-50 text-rose-700 border border-rose-300 flex items-center justify-center gap-1 w-24 mx-auto">
                          <AlertTriangle className="w-3 h-3" />
                          <span>MISSING</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};