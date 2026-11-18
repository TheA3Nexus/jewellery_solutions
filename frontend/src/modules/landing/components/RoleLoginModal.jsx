import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { 
  Building2, 
  Store, 
  Key, 
  Lock, 
  UserCheck, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';

export const RoleLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { clientStores, enterStore } = useTenant();

  // Role Tab: 'COMPANY_ADMIN' | 'JEWELLER_CLIENT' | 'QUICK_DEMO'
  const [activeRole, setActiveRole] = useState('COMPANY_ADMIN');

  // Company Admin Form State
  const [adminId, setAdminId] = useState('admin@a3jewellery.com');
  const [adminPasscode, setAdminPasscode] = useState('admin2026');

  // Jeweller Client Form State
  const [selectedStoreId, setSelectedStoreId] = useState(clientStores[0]?.id || 'JWL-MUM-01');
  const [cashierPin, setCashierPin] = useState('1234');

  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Handle Company Master Admin Sign In
  const handleCompanyAdminLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!adminId.trim() || !adminPasscode.trim()) {
      setErrorMessage('Please enter Master Admin credentials.');
      return;
    }

    // Authenticate Super-Admin
    onLoginSuccess({
      role: 'SUPER_ADMIN',
      user: { name: 'Adarsh Gupta (Company Owner)', email: adminId, role: 'PLATFORM_SUPER_ADMIN' },
      destination: 'MASTER_ADMIN'
    });
    onClose();
  };

  // Handle Jeweller Client Showroom Sign In
  const handleJewellerClientLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedStoreId) {
      setErrorMessage('Please select your registered jewellery store.');
      return;
    }

    // Switch store in TenantContext
    enterStore(selectedStoreId);

    const store = clientStores.find(s => s.id === selectedStoreId);

    onLoginSuccess({
      role: 'STORE_OWNER',
      store: store,
      destination: 'POS'
    });
    onClose();
  };

  // Handle Instant 1-Click Demo Access
  const handleQuickDemoLogin = (storeId) => {
    const targetId = storeId || 'JWL-MUM-01';
    enterStore(targetId);
    onLoginSuccess({
      role: 'STORE_OWNER',
      destination: 'POS'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="bg-surface-card border border-surface-border rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative select-none">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-surface-border pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
              A3
            </div>
            <div>
              <h3 className="text-base font-bold text-surface-100 flex items-center gap-2">
                A3 Jewels ERP Access Portal
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase">
                  Multi-Role
                </span>
              </h3>
              <p className="text-xs text-surface-400 mt-0.5">
                Sign in to your Showroom Counter or Company Master Panel.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-100 p-1.5 rounded-lg hover:bg-surface-hover transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-surface-canvas p-1 rounded-xl border border-surface-border">
          <button
            type="button"
            onClick={() => { setActiveRole('COMPANY_ADMIN'); setErrorMessage(''); }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeRole === 'COMPANY_ADMIN'
                ? 'bg-brand-500 text-slate-950 shadow-xs'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Company Owner (Admin)</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveRole('JEWELLER_CLIENT'); setErrorMessage(''); }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeRole === 'JEWELLER_CLIENT'
                ? 'bg-brand-500 text-slate-950 shadow-xs'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Jeweller Client (Dukan)</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ROLE 1: COMPANY MASTER ADMIN LOGIN */}
        {activeRole === 'COMPANY_ADMIN' && (
          <form onSubmit={handleCompanyAdminLogin} className="space-y-4 animate-in fade-in duration-100">
            <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs space-y-1">
              <span className="font-bold text-brand-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>SaaS Platform Owner Master Panel</span>
              </span>
              <p className="text-[11px] text-surface-300">
                Manage registered jewellers, track platform revenue &amp; ARR growth, create announcements, and inspect client stores.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Company Admin Email / User ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="admin@a3jewellery.com"
                  className="w-full bg-surface-canvas border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-surface-100 font-mono focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Security Passcode / Master Key
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-canvas border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-surface-100 font-mono focus:outline-none focus:border-brand-400"
                />
              </div>
              <span className="text-[10px] text-surface-400 mt-1 block">
                Local Dev Key pre-filled: <code className="text-brand-400 font-mono">admin2026</code>
              </span>
            </div>

            <button
              type="submit"
              id="login-master-admin-submit-btn"
              className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-2 shadow-md cursor-pointer font-bold"
            >
              <Building2 className="w-4 h-4" />
              <span>Login to Company Master Dashboard (मास्टर पैनल)</span>
            </button>
          </form>
        )}

        {/* ROLE 2: JEWELLER CLIENT SHOWROOM LOGIN */}
        {activeRole === 'JEWELLER_CLIENT' && (
          <form onSubmit={handleJewellerClientLogin} className="space-y-4 animate-in fade-in duration-100">
            <div className="p-3 rounded-xl bg-surface-canvas border border-surface-border text-xs space-y-1">
              <span className="font-bold text-surface-100 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-brand-400" />
                <span>Jeweller Showroom Login</span>
              </span>
              <p className="text-[11px] text-surface-400">
                Log in to your specific jewellery store to run billing, gold stock, Karigar job cards, and Swarna Nidhi schemes.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Select Your Registered Showroom
              </label>
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="w-full bg-surface-canvas border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-100 focus:outline-none focus:border-brand-400 cursor-pointer"
              >
                {clientStores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city}) &bull; {s.planName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Cashier / Manager PIN (4 Digits)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={4}
                  value={cashierPin}
                  onChange={(e) => setCashierPin(e.target.value)}
                  placeholder="1234"
                  className="w-full bg-surface-canvas border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-surface-100 font-mono tracking-widest focus:outline-none focus:border-brand-400"
                />
              </div>
              <span className="text-[10px] text-surface-400 mt-1 block">
                Default PIN: <code className="text-brand-400 font-mono">1234</code>
              </span>
            </div>

            <button
              type="submit"
              id="login-jeweller-store-submit-btn"
              className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-2 shadow-md cursor-pointer font-bold"
            >
              <Store className="w-4 h-4" />
              <span>Enter Showroom ERP (दुकान खोलें)</span>
            </button>
          </form>
        )}

        {/* 1-Click Fast Guest Demo Shortcut */}
        <div className="pt-2 border-t border-surface-border">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('JWL-MUM-01')}
            className="w-full py-2.5 rounded-xl border border-brand-500/30 bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant 1-Click Guest Demo (Mumbai Flagship Showroom)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
