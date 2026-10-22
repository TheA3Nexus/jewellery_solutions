import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { useHardware } from '../../../context/HardwareContext';
import { printThermal } from '../../../utils/printService';
import { 
  Tag, 
  Printer, 
  Code, 
  Copy, 
  Check, 
  Sliders, 
  Eye, 
  FileCheck,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const TagStudioZpl = ({ initialItem }) => {
  const { tenant, products } = useTenant();
  const { printZplLabel } = useHardware();

  const [selectedItem, setSelectedItem] = useState(() => initialItem || products[0] || null);
  const [copied, setCopied] = useState(false);
  const [printed, setPrinted] = useState(false);

  // Label Dimensions (Millimeters)
  const [tagDims, setTagDims] = useState({
    widthMm: 53,
    heightMm: 12,
    tailMm: 28,
  });

  // Toggles for fields to print on tag
  const [fields, setFields] = useState({
    showFirmName: true,
    showItemCode: true,
    showHuid: true,
    showGrossWt: true,
    showNetWt: true,
    showPurity: true,
    showMakingCode: true,
    showBarcode: true,
  });

  if (!selectedItem) {
    return (
      <div className="card-surface p-8 text-center text-surface-500 font-sans text-xs">
        No jewellery article selected. Please select an article to preview tag.
      </div>
    );
  }

  // Generate Raw ZPL Code (Zebra Programming Language for 203 DPI Printers)
  const generateZplCode = () => {
    return `^XA
^PW424
^LL96
^FO20,15^A0N,20,18^FD${tenant.name.substring(0, 18)}^FS
^FO20,38^A0N,18,16^FD${selectedItem.id} | ${selectedItem.purity}^FS
^FO20,58^A0N,18,16^FDGW:${selectedItem.grossWeight.toFixed(3)}g NW:${selectedItem.netWeight.toFixed(3)}g^FS
^FO20,78^A0N,16,14^FDHUID: ${selectedItem.huid || 'HD7891'} MKG:${selectedItem.makingChargeRate}^FS
^FO250,20^BY1.5,2,40^BCN,40,N,N,N^FD${selectedItem.barcode}^FS
^FO250,68^A0N,16,14^FD${selectedItem.barcode}^FS
^XZ`;
  };

  const rawZpl = generateZplCode();

  const handleCopyZpl = () => {
    navigator.clipboard.writeText(rawZpl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectPrint = async () => {
    await printZplLabel(rawZpl);
    setPrinted(true);
    setTimeout(() => setPrinted(false), 2000);
  };

  return (
    <div className="card-surface space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-800 pb-3">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-brand-400" />
          <div>
            <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider">
              Jewellery Tag Designer &amp; Direct ZPL Studio
            </h3>
            <p className="text-[11px] text-surface-400 font-mono">
              Dumbbell (Rat-Tail) Polyester Tags &bull; Zebra &amp; TSC Thermal Transfer
            </p>
          </div>
        </div>

        {/* Article Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto font-mono text-xs">
          <span className="text-surface-400 text-[10px] font-sans">Active Item:</span>
          <select
            value={selectedItem.id}
            onChange={(e) => {
              const found = products.find(p => p.id === e.target.value);
              if (found) setSelectedItem(found);
            }}
            className="select-field text-xs py-1"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Visual Tag Representation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-3 rounded-xl bg-surface-950 border border-surface-800 space-y-2">
            <span className="text-[11px] font-bold text-surface-400 uppercase tracking-wider font-sans flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-400" />
              <span>Real-Scale Visual Tag Preview</span>
            </span>

            {/* Simulated Physical Jewelry Dumbbell Label */}
            <div className="p-6 bg-slate-900 rounded-lg flex items-center justify-center overflow-x-auto min-h-[180px]">
              <div id="printable-jewellery-tag" className="printable-document printable-thermal flex items-center shadow-2xl bg-white text-black p-1 rounded">
                
                {/* Left Tag Wing (Printed Data) */}
                <div className="w-56 h-24 bg-white text-black p-2.5 rounded-l-md font-mono text-[10px] flex flex-col justify-between border-r border-dashed border-slate-300">
                  <div>
                    <div className="font-bold text-[11px] uppercase tracking-tight text-slate-900 truncate">
                      {tenant.name}
                    </div>
                    <div className="text-slate-700 font-semibold text-[10px] mt-0.5 truncate">
                      {selectedItem.id} &bull; {selectedItem.purity}
                    </div>
                  </div>
                  <div className="text-[10px] leading-tight text-slate-800">
                    <div>GW: <strong>{selectedItem.grossWeight.toFixed(3)}g</strong></div>
                    <div>NW: <strong>{selectedItem.netWeight.toFixed(3)}g</strong></div>
                    <div className="flex justify-between items-center pt-0.5 border-t border-slate-200 mt-0.5">
                      <span>HUID: <strong>{selectedItem.huid || 'HD7891'}</strong></span>
                      <span className="text-[9px] text-slate-600">MK:{selectedItem.makingChargeRate}</span>
                    </div>
                  </div>
                </div>

                {/* Right Tag Wing (Barcode & RFID Inlay) */}
                <div className="w-36 h-24 bg-white text-black p-2 rounded-r-md font-mono text-[9px] flex flex-col items-center justify-between">
                  <div className="text-center font-bold text-slate-700 text-[10px]">
                    {selectedItem.barcode}
                  </div>
                  {/* Simulated Barcode Lines */}
                  <div className="flex items-center gap-0.5 h-10 w-full justify-center">
                    {[3,1,2,1,4,1,2,3,1,2,4,1,2,1,3,2,1,4,2,1,3,1,2,4].map((w, idx) => (
                      <div key={idx} className="bg-black h-full" style={{ width: `${w * 1.2}px` }}></div>
                    ))}
                  </div>
                  <div className="text-[8px] text-slate-500 font-bold uppercase">
                    RFID UHF &bull; BIS HUID
                  </div>
                </div>

                {/* Flexible Tail Wrap (Wraps around jewelry chain or ring) */}
                <div className="w-24 h-3 bg-white/90 border-t border-b border-r border-slate-300 rounded-r-full shadow-inner flex items-center justify-end pr-1">
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                </div>

              </div>
            </div>

            <p className="text-[10px] text-surface-500 font-sans text-center">
              Scale 1:1 preview with adhesive tail for chain/ring attachment.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              id="btn-print-browser-tag"
              type="button"
              onClick={() => printThermal('printable-jewellery-tag', `Tag_${selectedItem.barcode || selectedItem.id}`)}
              className="btn-primary py-2.5 px-3 text-xs font-sans font-bold flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tag Slip (Thermal / Windows)</span>
            </button>

            <button
              type="button"
              onClick={handleDirectPrint}
              className="btn-primary flex-1 py-2.5 text-xs font-sans font-bold"
            >
              <Printer className="w-4 h-4" />
              <span>{printed ? 'Command Sent to Printer!' : 'Print Tag via Direct USB ZPL'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyZpl}
              className="btn-secondary py-2.5 px-3 text-xs font-sans"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'ZPL Copied' : 'Copy Raw ZPL'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Raw ZPL Output & Customizer (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-3 rounded-xl bg-surface-950 border border-surface-800 space-y-2">
            <span className="text-[11px] font-bold text-surface-400 uppercase tracking-wider font-sans flex items-center gap-2">
              <Code className="w-4 h-4 text-brand-400" />
              <span>ZPL Code (Direct Thermal Protocol)</span>
            </span>
            <pre className="p-3 rounded-lg bg-surface-900 border border-surface-800 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-48">
              {rawZpl}
            </pre>
          </div>

          <div className="p-3 rounded-xl bg-surface-950 border border-surface-800 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-surface-400 uppercase tracking-wider font-sans block">
              Compatible Thermal Label Printers
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-surface-300 font-mono">
              <div className="p-2 bg-surface-900 rounded border border-surface-800">
                <strong>Zebra:</strong> ZD220, ZD230, GK420t
              </div>
              <div className="p-2 bg-surface-900 rounded border border-surface-800">
                <strong>TSC:</strong> TE244, TTP-244 Pro
              </div>
              <div className="p-2 bg-surface-900 rounded border border-surface-800">
                <strong>Citizen:</strong> CL-S621, CL-E300
              </div>
              <div className="p-2 bg-surface-900 rounded border border-surface-800">
                <strong>Argox:</strong> CP-2140, OS-214 Plus
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};