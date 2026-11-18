import React from 'react';
import { ShieldCheck, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

export const LandingFooter = ({ onOpenLogin, onEnterDemo }) => {
  return (
    <footer className="bg-surface-canvas border-t border-surface-border text-xs text-surface-400 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-10">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
                A3
              </div>
              <span className="font-bold text-sm text-surface-100 uppercase tracking-wide">
                A3 Jewellery Solution ERP
              </span>
            </div>

            <p className="text-xs text-surface-300 leading-relaxed max-w-sm">
              India's first cloud-native vertical SaaS ERP built exclusively for retail jewellery showrooms, bullion traders, and goldsmith workshops.
            </p>

            <div className="space-y-1.5 text-[11px] font-mono text-surface-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Zaveri Bazaar, Kalbadevi, Mumbai - 400002</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>+91 98200 12345 (Showroom Helpline)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>support@a3jewellery.com</span>
              </p>
            </div>
          </div>

          {/* Col 3: Core Showroom Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-surface-100 uppercase tracking-wider font-mono">
              Showroom Desks
            </h4>
            <ul className="space-y-2 text-surface-300">
              <li><a href="#features" className="hover:text-brand-400 transition">POS &amp; Counter Sales</a></li>
              <li><a href="#features" className="hover:text-brand-400 transition">Inventory &amp; RFID Tags</a></li>
              <li><a href="#features" className="hover:text-brand-400 transition">Karigar &amp; Workshop Desk</a></li>
              <li><a href="#features" className="hover:text-brand-400 transition">Swarna Nidhi Kitty Schemes</a></li>
              <li><a href="#features" className="hover:text-brand-400 transition">Girvi &amp; Gold Loan Desk</a></li>
              <li><a href="#features" className="hover:text-brand-400 transition">Lookbook &amp; Customer Display</a></li>
            </ul>
          </div>

          {/* Col 4: Hardware Ecosystem */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-surface-100 uppercase tracking-wider font-mono">
              Hardware Gateway
            </h4>
            <ul className="space-y-2 text-surface-300 font-mono text-[11px]">
              <li><a href="#hardware" className="hover:text-brand-400 transition">Essae / Citizen Precision Balances</a></li>
              <li><a href="#hardware" className="hover:text-brand-400 transition">Zebra ZD220 ZPL Tag Printers</a></li>
              <li><a href="#hardware" className="hover:text-brand-400 transition">TSC TE244 Butterfly Labels</a></li>
              <li><a href="#hardware" className="hover:text-brand-400 transition">HDMI Secondary Pole Screens</a></li>
              <li><a href="#hardware" className="hover:text-brand-400 transition">UHF RFID Bulk Tray Readers</a></li>
            </ul>
          </div>

          {/* Col 5: Statutory & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-surface-100 uppercase tracking-wider font-mono">
              Statutory Compliance
            </h4>
            <ul className="space-y-2 text-surface-300 text-[11px]">
              <li className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>BIS 6-Digit HUID Hallmarking</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Rule 114B (₹2L PAN Verification)</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Section 269ST Cash Limits</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Form G Pawn-broking Act</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenLogin}
                className="w-full btn-primary text-[11px] py-2"
              >
                Sign In to Platform
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Strip: Copyright & Disclaimer */}
        <div className="pt-6 border-t border-surface-border flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-mono text-surface-400">
          <p>
            &copy; {new Date().getFullYear()} A3 Jewellery Solutions Pvt Ltd. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AES-256 Multi-Tenant Secure</span>
            </span>
            <span>&bull;</span>
            <span>Made for Indian Jewellers</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
