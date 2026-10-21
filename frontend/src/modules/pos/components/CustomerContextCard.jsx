import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Camera, 
  Fingerprint,
  CheckCircle2
} from 'lucide-react';

export const CustomerContextCard = ({ 
  customer, 
  setCustomer, 
  grandTotal = 0 
}) => {
  const [isBiometricRegistered, setIsBiometricRegistered] = useState(false);
  const isPanMandatory = grandTotal >= 200000;

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setCustomer(prev => ({ ...prev, phone: val }));
  };

  const handleSimulateBiometric = () => {
    setIsBiometricRegistered(true);
    setCustomer(prev => ({ ...prev, biometricVerified: true }));
  };

  return (
    <div className="card-surface space-y-3">
      <div className="flex items-center justify-between border-b border-surface-800 pb-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-bold text-surface-100 uppercase tracking-wider">
            Customer Profile & Compliance
          </h3>
        </div>
        <span className="text-[10px] text-surface-400 font-mono">
          KYC &amp; Rule 114B
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Full Name */}
        <div>
          <label className="text-[10px] font-semibold text-surface-400 block mb-1">
            Customer Full Name
          </label>
          <input
            type="text"
            placeholder="e.g. Rajesh Sharma"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            className="input-field font-sans"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="text-[10px] font-semibold text-surface-400 block mb-1">
            Mobile Number (WhatsApp)
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-surface-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="tel"
              placeholder="+91 98200 12345"
              value={customer.phone}
              onChange={handlePhoneChange}
              className="input-field pl-8"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* City / Address */}
        <div>
          <label className="text-[10px] font-semibold text-surface-400 block mb-1">
            City / Village
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-surface-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. Zaveri Bazaar, Mumbai"
              value={customer.city}
              onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
              className="input-field pl-8 font-sans"
            />
          </div>
        </div>

        {/* PAN Card Input with Statutory Rule 114B Detection */}
        <div>
          <label className="text-[10px] font-semibold text-surface-400 flex items-center justify-between mb-1">
            <span>PAN Number</span>
            {isPanMandatory && (
              <span className="text-rose-400 font-bold text-[9px] uppercase">
                Mandatory &gt;= ₹2 Lakh
              </span>
            )}
          </label>
          <div className="relative">
            <FileText className="w-3.5 h-3.5 text-surface-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              maxLength={10}
              placeholder="ABCDE1234F"
              value={customer.pan}
              onChange={(e) => setCustomer({ ...customer, pan: e.target.value.toUpperCase() })}
              className={`input-field pl-8 ${
                isPanMandatory && !customer.pan
                  ? 'border-rose-500/80 ring-1 ring-rose-500/50 bg-rose-50'
                  : ''
              }`}
            />
          </div>
        </div>
      </div>

      {/* Statutory Rule 114B Alert Banner */}
      {isPanMandatory && !customer.pan && (
        <div className="p-2 rounded-lg bg-rose-50 border border-rose-300 text-[11px] text-rose-800 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
          <span>
            <strong>Income Tax Rule 114B Compliance:</strong> Quotation/Invoice total is ₹2,00,000 or higher. A valid 10-character PAN Card is legally required.
          </span>
        </div>
      )}

      {/* Optional Biometrics & Snapshot Buttons for High-Value Billing */}
      <div className="flex items-center justify-between pt-1 border-t border-surface-800/80 text-[11px]">
        <div className="flex items-center gap-1.5 text-surface-400">
          {isBiometricRegistered ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Biometric Thumb Verified</span>
            </span>
          ) : (
            <span>Counter KYC Check: Optional for retail billing</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSimulateBiometric}
            className="btn-secondary py-1 px-2.5 text-[11px]"
            title="Scan customer thumb using RD Service"
          >
            <Fingerprint className="w-3 h-3 text-brand-400" />
            <span>Finger Scan</span>
          </button>
        </div>
      </div>
    </div>
  );
};