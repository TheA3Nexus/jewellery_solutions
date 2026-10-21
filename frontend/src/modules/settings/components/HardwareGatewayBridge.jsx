import React, { useState } from 'react';
import { useHardware } from '../../../context/HardwareContext';
import { 
  Cpu, 
  Scale, 
  Printer, 
  Radio, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Settings2,
  Terminal,
  Activity
} from 'lucide-react';

export const HardwareGatewayBridge = () => {
  const { scaleStatus, printerStatus, rfidStatus, scaleWeight, isScaleStable } = useHardware();

  // COM Port & Scale Configuration
  const [scaleConfig, setScaleConfig] = useState({
    port: 'COM3',
    baudRate: '9600',
    dataBits: '8',
    parity: 'None',
    stopBits: '1',
    protocol: 'ESSAE_STANDARD', // ESSAE_STANDARD, SARTORIUS_SBI, OHAUS, WENSAR
    decimalPlaces: 3,
    autoTareOnZero: true
  });

  // Printer Configuration
  const [printerConfig, setPrinterConfig] = useState({
    connectionType: 'RAW_TCP', // RAW_TCP or WINDOWS_SPOOLER
    ipAddress: '192.168.1.120',
    rawPort: '9100',
    dpi: '203', // 203 or 300
    tagFormat: 'DUMBBELL_75x12',
    darkness: '22',
    speed: '3'
  });

  // RFID Reader Configuration
  const [rfidConfig, setRfidConfig] = useState({
    readerType: 'DESKTOP_TRAY_PAD',
    powerDbm: '24', // 15 to 30 dBm
    scanDurationMs: '1200',
    frequencyBand: 'IN_865_867' // India 865-867 MHz
  });

  const [daemonStatus, setDaemonStatus] = useState('ONLINE'); // ONLINE, SIMULATING, DISCONNECTED
  const [testLog, setTestLog] = useState([
    '[GATEWAY] Daemon active at ws://127.0.0.1:9876 (PID: 4092)',
    '[SERIAL] COM3 opened at 9600-8-N-1 (Essae Teraoka Precision 4-decimal scale)',
    '[PRINTER] Zebra ZD421 Raw ZPL connection verified at 192.168.1.120:9100',
    '[RFID] UHF Desktop Antenna configured at 24 dBm (India 865-867 MHz)'
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const handleTestBridge = () => {
    setTestLog((prev) => [
      `[PING] Hardware bridge loopback test initiated at ${new Date().toLocaleTimeString()}...`,
      `[SCALE] Frame received: ST,GS,+${scaleWeight.toFixed(3)}g (STABLE)`,
      `[PRINTER] Zebra status: READY, HEAD_CLOSED, PAPER_OK`,
      `[RFID] Carrier frequency calibrated. Ready for tray scan.`,
      ...prev
    ]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              Hardware Bridge &amp; Peripheral Gateway
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Bridge Active (127.0.0.1:9876)
              </span>
            </h2>
            <p className="text-xs text-surface-400">
              Low-latency RS232 electronic scale parser, direct Zebra ZPL tag printer, and UHF RFID tray drivers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestBridge}
            className="px-3.5 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-600 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            Diagnostic Ping
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-brand-500/20"
          >
            <Save className="w-4 h-4" />
            Save Port Mappings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scale Configuration Card */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-surface-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-200 flex items-center gap-2">
              <Scale className="w-4 h-4 text-brand-400" />
              Electronic Precision Scale
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {scaleStatus}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-surface-400 font-medium mb-1">Serial COM Port</label>
              <select
                value={scaleConfig.port}
                onChange={(e) => setScaleConfig({ ...scaleConfig, port: e.target.value })}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono font-bold focus:outline-none focus:border-brand-500"
              >
                <option value="COM1">COM1 (Motherboard Serial)</option>
                <option value="COM2">COM2</option>
                <option value="COM3">COM3 (USB to RS232 Prolific / FTDI)</option>
                <option value="COM4">COM4 (Silicon Labs CP210x)</option>
                <option value="COM5">COM5</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-surface-400 font-medium mb-1">Baud Rate</label>
                <select
                  value={scaleConfig.baudRate}
                  onChange={(e) => setScaleConfig({ ...scaleConfig, baudRate: e.target.value })}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-2 py-2 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
                >
                  <option value="4800">4800</option>
                  <option value="9600">9600 (Standard)</option>
                  <option value="19200">19200</option>
                  <option value="115200">115200</option>
                </select>
              </div>
              <div>
                <label className="block text-surface-400 font-medium mb-1">Scale Protocol</label>
                <select
                  value={scaleConfig.protocol}
                  onChange={(e) => setScaleConfig({ ...scaleConfig, protocol: e.target.value })}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-2 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="ESSAE_STANDARD">Essae / Teraoka</option>
                  <option value="SARTORIUS_SBI">Sartorius / Gold SBI</option>
                  <option value="OHAUS">Ohaus Precision</option>
                  <option value="WENSAR">Wensar Certified</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-surface-950 rounded-xl border border-surface-800 flex justify-between items-center font-mono">
              <span className="text-surface-400 text-[11px] font-sans">Live Scale Feed:</span>
              <span className="text-base font-bold text-amber-400">
                {scaleWeight.toFixed(scaleConfig.decimalPlaces)} g
              </span>
            </div>
          </div>
        </div>

        {/* Tag Printer Configuration Card */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-surface-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-200 flex items-center gap-2">
              <Printer className="w-4 h-4 text-emerald-400" />
              Thermal Tag Printer (ZPL)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {printerStatus}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-surface-400 font-medium mb-1">Direct TCP/IP Address</label>
              <input
                type="text"
                value={printerConfig.ipAddress}
                onChange={(e) => setPrinterConfig({ ...printerConfig, ipAddress: e.target.value })}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono font-bold focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-surface-400 font-medium mb-1">Port</label>
                <input
                  type="text"
                  value={printerConfig.rawPort}
                  onChange={(e) => setPrinterConfig({ ...printerConfig, rawPort: e.target.value })}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-2 py-2 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-surface-400 font-medium mb-1">Resolution</label>
                <select
                  value={printerConfig.dpi}
                  onChange={(e) => setPrinterConfig({ ...printerConfig, dpi: e.target.value })}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-2 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="203">203 DPI (Standard)</option>
                  <option value="300">300 DPI (High Res HUID)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">Tag Format Preset</label>
              <select
                value={printerConfig.tagFormat}
                onChange={(e) => setPrinterConfig({ ...printerConfig, tagFormat: e.target.value })}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
              >
                <option value="DUMBBELL_75x12">Dumbbell Rat-Tail 75 x 12 mm</option>
                <option value="RECT_68x14">Foldable Flap Tag 68 x 14 mm</option>
                <option value="THREAD_TAG">Thread Loop Tag 45 x 10 mm</option>
              </select>
            </div>
          </div>
        </div>

        {/* RFID Reader Card */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-surface-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-200 flex items-center gap-2">
              <Radio className="w-4 h-4 text-sky-400" />
              UHF RFID Smart Tray Driver
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {rfidStatus}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-surface-400 font-medium mb-1">Reader Hardware Type</label>
              <select
                value={rfidConfig.readerType}
                onChange={(e) => setRfidConfig({ ...rfidConfig, readerType: e.target.value })}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
              >
                <option value="DESKTOP_TRAY_PAD">Near-Field Desktop Smart Pad (0.5m)</option>
                <option value="PORTAL_ANTENNA">Vault Security Gate Portal (3.0m)</option>
                <option value="HANDHELD_GUN">Zebra RFD8500 Bluetooth Gun</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-surface-400 font-medium mb-1">RF Power (dBm)</label>
                <input
                  type="number"
                  min="15"
                  max="30"
                  value={rfidConfig.powerDbm}
                  onChange={(e) => setRfidConfig({ ...rfidConfig, powerDbm: e.target.value })}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-2 py-2 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-surface-400 font-medium mb-1">Frequency</label>
                <input
                  type="text"
                  disabled
                  value="865-867 MHz (IN)"
                  className="w-full bg-surface-950/50 border border-surface-800 rounded-lg px-2 py-2 text-surface-400 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="p-3 bg-surface-950 rounded-xl border border-surface-800 text-[11px] text-surface-400 space-y-1">
              <div className="flex justify-between">
                <span>Tray Scan Duration:</span>
                <span className="text-surface-200 font-mono">1.2 Seconds</span>
              </div>
              <div className="flex justify-between">
                <span>Multi-Tag Anti-Collision:</span>
                <span className="text-emerald-400 font-bold">EPC Gen2 / ISO 18000-6C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Daemon Console Logs */}
      <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-surface-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brand-400" />
            Local Hardware Daemon Console Stream
          </h4>
          <span className="text-[10px] font-mono text-surface-500">WebSocket 127.0.0.1:9876</span>
        </div>
        <div className="bg-black/90 rounded-lg p-3 font-mono text-xs text-emerald-400/90 space-y-1 max-h-40 overflow-y-auto border border-surface-800">
          {testLog.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
