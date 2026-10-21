import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  Save, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  Phone, 
  Mail,
  QrCode
} from 'lucide-react';

export const StoreProfileForm = () => {
  const { tenant, updateTenant } = useTenant();

  const [formData, setFormData] = useState({
    name: tenant.name || 'A3 Diamond & Gold Showroom',
    tradeName: tenant.tradeName || 'A3 Jewellery Solutions Pvt Ltd',
    branch: tenant.branch || 'Flagship Showroom (Counter 01)',
    city: tenant.city || 'Mumbai',
    address: tenant.address || 'Shop 12-14, Zaveri Bazaar, Kalbadevi, Mumbai - 400002',
    phone: tenant.phone || '+91 98200 12345',
    email: tenant.email || 'billing@a3jewellery.com',
    gstin: tenant.gstin || '27AABCJ1234F1Z8',
    pan: tenant.pan || 'AABCJ1234F',
    bisLicenseNo: tenant.bisLicenseNo || 'HM/C-7821940',
    assayCenter: tenant.assayCenter || 'MMTC-PAMP Assaying & Hallmarking Centre, Mumbai',
    moneyLendingLicense: tenant.moneyLendingLicense || 'MH/ML-2024/99120',
    bankName: tenant.bankName || 'HDFC Bank Ltd',
    accountNumber: tenant.accountNumber || '50200088992211',
    ifscCode: tenant.ifscCode || 'HDFC0000123',
    upiVpa: tenant.upiVpa || 'a3jewellers@hdfcbank'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTenant(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              Store Profile &amp; Statutory Credentials
              {isSaved && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3 h-3" /> Saved Successfully
                </span>
              )}
            </h2>
            <p className="text-xs text-surface-400">
              Tax invoice headers, BIS hallmarking license credentials, and bank settlement configuration.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-brand-500/20"
        >
          <Save className="w-4 h-4" />
          Save Store Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Business Identity & Showroom Info */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-surface-200 flex items-center gap-2 border-b border-surface-800 pb-2">
            <Building2 className="w-4 h-4 text-brand-400" />
            Showroom Identity &amp; Contact Details
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-surface-400 font-medium mb-1">
                Display Showroom Name (Printed on Top of Invoice)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">
                Legal Entity / Trade Name (Registered under GST)
              </label>
              <input
                type="text"
                name="tradeName"
                value={formData.tradeName}
                onChange={handleChange}
                required
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-surface-400 font-medium mb-1">Branch / Counter</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-surface-400 font-medium mb-1">City / Region</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">Physical Showroom Address</label>
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-surface-400 font-medium mb-1">Official Mobile / Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-surface-400 font-medium mb-1">Billing Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Statutory Compliance Credentials */}
        <div className="bg-surface-900 border border-surface-700/60 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-surface-200 flex items-center gap-2 border-b border-surface-800 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Statutory &amp; BIS Regulatory Licenses
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-surface-400 font-medium mb-1">GSTIN Number (15 Digits)</label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-brand-400 font-mono font-bold focus:outline-none focus:border-brand-500 uppercase"
                />
              </div>
              <div>
                <label className="block text-surface-400 font-medium mb-1">Income Tax PAN</label>
                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono font-bold focus:outline-none focus:border-brand-500 uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">
                BIS Hallmarking License Number (Rule 46 Mandatory)
              </label>
              <input
                type="text"
                name="bisLicenseNo"
                value={formData.bisLicenseNo}
                onChange={handleChange}
                required
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono font-bold focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">
                Assaying &amp; Hallmarking Center (AHC) Mapping
              </label>
              <input
                type="text"
                name="assayCenter"
                value={formData.assayCenter}
                onChange={handleChange}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">
                State Money Lending License (Pawn Broker Reg No)
              </label>
              <input
                type="text"
                name="moneyLendingLicense"
                value={formData.moneyLendingLicense}
                onChange={handleChange}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Bank Account & Dynamic UPI QR Settlement */}
        <div className="md:col-span-2 bg-surface-900 border border-surface-700/60 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-surface-200 flex items-center gap-2 border-b border-surface-800 pb-2">
            <CreditCard className="w-4 h-4 text-sky-400" />
            Bank Settlement Account &amp; Dynamic UPI QR Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-surface-400 font-medium mb-1">Settlement Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">Current Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 font-mono uppercase focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-surface-400 font-medium mb-1">
                UPI VPA (QR Payment Link)
              </label>
              <div className="relative">
                <QrCode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  type="text"
                  name="upiVpa"
                  value={formData.upiVpa}
                  onChange={handleChange}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg pl-9 pr-3 py-2 text-sky-400 font-mono font-bold focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
