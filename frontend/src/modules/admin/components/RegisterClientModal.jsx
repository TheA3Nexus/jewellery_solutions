import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Monitor
} from 'lucide-react';

export const RegisterClientModal = ({ isOpen, onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    tradeName: '',
    ownerName: '',
    phone: '',
    email: '',
    city: '',
    state: 'Maharashtra',
    address: '',
    gstin: '',
    bisLicenseNo: '',
    pan: '',
    plan: 'GOLD_SHOWROOM',
    maxCounters: 3,
    seedDemoStock: true
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Showroom Name is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Contact Phone is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onRegister(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-surface-card border border-surface-border rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-surface-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-surface-100 flex items-center gap-2">
                Onboard New Jeweller Client
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase font-semibold">
                  Multi-Tenant
                </span>
              </h3>
              <p className="text-xs text-surface-400 mt-0.5">
                Register a new jewellery showroom into your SaaS network.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 1: Store & Owner Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-surface-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-400" />
              1. Showroom &amp; Owner Credentials
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  Showroom Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Jewellers & Sons"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-surface-canvas border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-100 focus:outline-none focus:border-brand-400"
                />
                {errors.name && <p className="text-rose-400 text-[10px] mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  Legal Trade Name (GST Registered)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Alankar Bhandar Pvt Ltd"
                  value={formData.tradeName}
                  onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                  className="w-full bg-surface-canvas border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-100 focus:outline-none focus:border-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  Proprietor / Owner Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Prasad Soni"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full bg-surface-canvas border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-100 focus:outline-none focus:border-brand-400"
                />
                {errors.ownerName && <p className="text-rose-400 text-[10px] mt-1">{errors.ownerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  Primary Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98200 98765"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-surface-canvas border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-100 focus:outline-none focus:border-brand-400"
                />
                {errors.phone && <p className="text-rose-400 text-[10px] mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. contact@rameshjewels.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-surface-canvas border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-100 focus:outline-none focus:border-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  City &amp; Sarafa Bazaar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Varanasi, UP"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-surface-canvas border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-100 focus:outline-none focus:border-brand-400"
                />
                {errors.city && <p className="text-rose-400 text-[10px] mt-1">{errors.city}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-300 mb-1">
                Showroom Address &amp; Landmark
              </label>
              <input
                type="text"
                placeholder="e.g. Shop 22-24, Johari Market, Near Clock Tower"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-surface-canvas border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-100 focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          {/* Section 2: Statutory & Tax Identification */}
          <div className="space-y-3 pt-2 border-t border-surface-border">
            <h4 className="text-xs font-bold text-surface-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              2. Statutory &amp; BIS Hallmarking
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  GSTIN (15 Digits)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 09AABCR8812K1Z5"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  className="w-full bg-surface-canvas border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-100 font-mono focus:outline-none focus:border-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  BIS Hallmark License
                </label>
                <input
                  type="text"
                  placeholder="e.g. HM/C-8921004"
                  value={formData.bisLicenseNo}
                  onChange={(e) => setFormData({ ...formData, bisLicenseNo: e.target.value.toUpperCase() })}
                  className="w-full bg-surface-canvas border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-100 font-mono focus:outline-none focus:border-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1">
                  PAN (Permanent Account No)
                </label>
                <input
                  type="text"
                  placeholder="e.g. AABCR8812K"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  className="w-full bg-surface-canvas border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-100 font-mono focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Subscription Plan & Billing Desks */}
          <div className="space-y-3 pt-2 border-t border-surface-border">
            <h4 className="text-xs font-bold text-surface-300 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-brand-400" />
              3. Select Subscription Tier
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {/* Free Trial */}
              <div 
                onClick={() => setFormData({ ...formData, plan: 'FREE_TRIAL', maxCounters: 2 })}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  formData.plan === 'FREE_TRIAL'
                    ? 'border-brand-400 bg-brand-500/10 text-surface-100 shadow-xs'
                    : 'border-surface-border bg-surface-canvas/50 text-surface-400 hover:border-surface-border/80'
                }`}
              >
                <span className="text-[10px] font-bold text-emerald-400 uppercase">14-Day Trial</span>
                <p className="text-xs font-bold text-surface-100 mt-0.5">Free Evaluation</p>
                <p className="text-[10px] text-surface-400 mt-1">₹0 &bull; 2 Desks</p>
              </div>

              {/* Silver Retail */}
              <div 
                onClick={() => setFormData({ ...formData, plan: 'SILVER_RETAIL', maxCounters: 1 })}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  formData.plan === 'SILVER_RETAIL'
                    ? 'border-brand-400 bg-brand-500/10 text-surface-100 shadow-xs'
                    : 'border-surface-border bg-surface-canvas/50 text-surface-400 hover:border-surface-border/80'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-300 uppercase">Silver Retail</span>
                <p className="text-xs font-bold text-surface-100 mt-0.5">₹24,000 / yr</p>
                <p className="text-[10px] text-surface-400 mt-1">1 Billing Counter</p>
              </div>

              {/* Gold Showroom */}
              <div 
                onClick={() => setFormData({ ...formData, plan: 'GOLD_SHOWROOM', maxCounters: 3 })}
                className={`p-3 rounded-xl border cursor-pointer transition relative ${
                  formData.plan === 'GOLD_SHOWROOM'
                    ? 'border-brand-400 bg-brand-500/15 text-surface-100 shadow-xs ring-1 ring-brand-400'
                    : 'border-surface-border bg-surface-canvas/50 text-surface-400 hover:border-surface-border/80'
                }`}
              >
                <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full bg-brand-500 text-white font-mono text-[8px] font-black uppercase">
                  Popular
                </span>
                <span className="text-[10px] font-bold text-brand-400 uppercase">Gold Showroom</span>
                <p className="text-xs font-bold text-surface-100 mt-0.5">₹48,000 / yr</p>
                <p className="text-[10px] text-surface-400 mt-1">3 Desks + Kitty + Scale</p>
              </div>

              {/* Diamond Enterprise */}
              <div 
                onClick={() => setFormData({ ...formData, plan: 'DIAMOND_ENTERPRISE', maxCounters: 8 })}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  formData.plan === 'DIAMOND_ENTERPRISE'
                    ? 'border-brand-400 bg-brand-500/10 text-surface-100 shadow-xs'
                    : 'border-surface-border bg-surface-canvas/50 text-surface-400 hover:border-surface-border/80'
                }`}
              >
                <span className="text-[10px] font-bold text-indigo-400 uppercase">Diamond Enterprise</span>
                <p className="text-xs font-bold text-surface-100 mt-0.5">₹1,20,000 / yr</p>
                <p className="text-[10px] text-surface-400 mt-1">8 Desks + Karigar</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-3 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-surface-border text-surface-300 hover:text-surface-100 hover:bg-surface-hover text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Onboarding &amp; Create Store</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
