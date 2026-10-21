import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cloud, 
  Lock, 
  Download, 
  Users, 
  Fingerprint, 
  CheckCircle2, 
  AlertTriangle,
  Database,
  History,
  KeyRound
} from 'lucide-react';

export const SecurityBackupSettings = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [requireAdminForDiscount, setRequireAdminForDiscount] = useState(true);
  const [autoCloudSync, setAutoCloudSync] = useState(true);

  // Backup History Mock
  const [backupSnapshots, setBackupSnapshots] = useState([
    {
      id: 'SNP-20261021-2300',
      timestamp: '2026-10-21 11:00 PM',
      size: '24.8 MB',
      status: 'VERIFIED',
      destination: 'Cloudflare R2 (Mumbai Region)'
    },
    {
      id: 'SNP-20261020-2300',
      timestamp: '2026-10-20 11:00 PM',
      size: '24.2 MB',
      status: 'VERIFIED',
      destination: 'Cloudflare R2 (Mumbai Region)'
    },
    {
      id: 'SNP-20261019-2300',
      timestamp: '2026-10-19 11:00 PM',
      size: '23.9 MB',
      status: 'VERIFIED',
      destination: 'Cloudflare R2 (Mumbai Region)'
    }
  ]);

  // Roles & Permissions Matrix
  const roles = [
    {
      role: 'Proprietor / Managing Director',
      usersCount: 1,
      access: 'All Modules, Item Profit & Loss, Rate Formulas, Day Book Unlock, Delete/Cancel Rights'
    },
    {
      role: 'Head Cashier / Billing Staff',
      usersCount: 2,
      access: 'POS Billing, Old Gold Exchange, Customer KYC, Thermal/GST Print, Cannot View Profit'
    },
    {
      role: 'Girvi & Gold Loan Officer',
      usersCount: 1,
      access: 'Gold Loan Sanction, Interest Receipt, Form G Ticket, Vault Release requires Biometrics'
    },
    {
      role: 'Karigar Workshop Supervisor',
      usersCount: 1,
      access: 'Issue Metal (Javak), Receive Ornaments (Aavak), Wastage Audit, Labour Payments'
    }
  ];

  const handleTriggerManualBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      const newSnapshot = {
        id: `SNP-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        size: '25.1 MB',
        status: 'VERIFIED',
        destination: 'Manual Encrypted Download (.a3bak)'
      };
      setBackupSnapshots([newSnapshot, ...backupSnapshots]);

      // Trigger dummy download
      const element = document.createElement('a');
      const file = new Blob(['A3_JEWELLERY_ENCRYPTED_BACKUP_PAYLOAD_AES256'], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `A3_Backup_${new Date().toISOString().split('T')[0]}.a3bak`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              Security Governance, RBAC &amp; Cloud Snapshots
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AES-256 Encrypted
              </span>
            </h2>
            <p className="text-xs text-surface-400">
              Zero-knowledge tenant backups, biometric vault locks, and cashier authorization rules.
            </p>
          </div>
        </div>

        <button
          onClick={handleTriggerManualBackup}
          disabled={isBackingUp}
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-brand-500/20"
        >
          <Database className="w-4 h-4" />
          {isBackingUp ? 'Creating Encrypted Snapshot...' : 'Create Snapshot Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Anti-Fraud & Authorization Controls */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-surface-200 flex items-center gap-2 border-b border-surface-800 pb-2">
            <Lock className="w-4 h-4 text-brand-400" />
            Showroom Anti-Fraud &amp; Authorization Gates
          </h3>

          <div className="space-y-4 text-xs">
            {/* Biometric Thumb Requirement */}
            <div className="flex items-center justify-between p-3 bg-surface-950 rounded-lg border border-surface-800">
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-brand-400 shrink-0" />
                <div>
                  <span className="font-semibold text-surface-100 block">
                    Mandatory Biometric Fingerprint for Vault Release
                  </span>
                  <span className="text-[11px] text-surface-400">
                    Prevents unverified release of pledged gold ornaments to third parties.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={biometricEnabled}
                onChange={(e) => setBiometricEnabled(e.target.checked)}
                className="w-4 h-4 accent-brand-500 rounded"
              />
            </div>

            {/* Admin Override for Making Charge Discounts */}
            <div className="flex items-center justify-between p-3 bg-surface-950 rounded-lg border border-surface-800">
              <div className="flex items-center gap-3">
                <KeyRound className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-semibold text-surface-100 block">
                    Manager Password for Discounts &gt; 5%
                  </span>
                  <span className="text-[11px] text-surface-400">
                    Protects gross margin against unauthorized cashier discounts.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={requireAdminForDiscount}
                onChange={(e) => setRequireAdminForDiscount(e.target.checked)}
                className="w-4 h-4 accent-brand-500 rounded"
              />
            </div>

            {/* Auto Cloud Snapshot */}
            <div className="flex items-center justify-between p-3 bg-surface-950 rounded-lg border border-surface-800">
              <div className="flex items-center gap-3">
                <Cloud className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <span className="font-semibold text-surface-100 block">
                    Automatic Daily Midnight Cloud Backup
                  </span>
                  <span className="text-[11px] text-surface-400">
                    Syncs complete encrypted database to off-site cloud storage.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoCloudSync}
                onChange={(e) => setAutoCloudSync(e.target.checked)}
                className="w-4 h-4 accent-brand-500 rounded"
              />
            </div>
          </div>
        </div>

        {/* Cloud Snapshot History */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-surface-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-200 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              Recent Database Recovery Snapshots
            </h3>
            <span className="text-[10px] text-surface-400 font-mono">3 Available</span>
          </div>

          <div className="divide-y divide-surface-800/60 text-xs font-mono">
            {backupSnapshots.map((snp) => (
              <div key={snp.id} className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="font-bold text-surface-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {snp.id}
                  </div>
                  <div className="text-[11px] text-surface-500 font-sans mt-0.5">
                    {snp.timestamp} &bull; {snp.destination}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-surface-300 font-bold">{snp.size}</span>
                  <button
                    onClick={() => alert(`Downloading verified snapshot archive: ${snp.id}.a3bak`)}
                    className="p-1.5 rounded bg-surface-800 hover:bg-surface-700 text-surface-300 hover:text-surface-100 border border-surface-700"
                    title="Download Archive"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Table */}
      <div className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-surface-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" />
            Role-Based Access Control (RBAC) Staff Matrix
          </h3>
          <span className="text-xs text-surface-400 font-mono">4 System Roles Active</span>
        </div>

        <table className="w-full text-left text-xs text-surface-300">
          <thead className="bg-surface-950 text-surface-400 font-semibold uppercase tracking-wider text-[11px] border-b border-surface-800">
            <tr>
              <th className="px-4 py-3">Security Role Name</th>
              <th className="px-4 py-3 text-center">Active Users</th>
              <th className="px-4 py-3">Permission Scope &amp; Access Boundaries</th>
              <th className="px-4 py-3 text-right">Security Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/60">
            {roles.map((r, idx) => (
              <tr key={idx} className="hover:bg-surface-800/40">
                <td className="px-4 py-3 font-semibold text-surface-100">{r.role}</td>
                <td className="px-4 py-3 text-center font-mono font-bold text-brand-400">
                  {r.usersCount} Staff
                </td>
                <td className="px-4 py-3 text-surface-300">{r.access}</td>
                <td className="px-4 py-3 text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-surface-800 text-surface-300 border border-surface-700 font-mono">
                    Tier {4 - idx}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
