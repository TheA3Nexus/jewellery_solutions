import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useTenant } from '../../../context/TenantContext';
import { 
  Building2, 
  LogIn, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const LandingNavbar = ({ onOpenLogin, onEnterDemo }) => {
  const { theme, toggleTheme } = useTheme();
  const { bullionRates } = useTenant();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Modules & Features', href: '#features' },
    { label: 'Hardware Gateway', href: '#hardware' },
    { label: 'Swarna Nidhi Kitty', href: '#schemes' },
    { label: 'Girvi Gold Loan', href: '#girvi' },
    { label: 'Subscription Pricing', href: '#pricing' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-200 select-none ${
      isScrolled 
        ? 'bg-surface-card/95 backdrop-blur-md border-b border-surface-border shadow-md py-2.5' 
        : 'bg-surface-card border-b border-surface-border/60 py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* 1. Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-black text-sm shadow-xs ring-1 ring-brand-400/30">
            A3
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-surface-100 tracking-wider uppercase font-sans">
                A3 Jewels
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase">
                Cloud ERP
              </span>
            </div>
            <p className="text-[10px] text-surface-400 font-medium">
              Enterprise Jewellery SaaS &amp; POS
            </p>
          </div>
        </div>

        {/* 2. Center: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-surface-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="hover:text-brand-400 transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* 3. Right: Live Bullion Pill, Theme Toggle, Login & Demo CTAs */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live Bullion Ticker Pill (Hidden on Mobile) */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-canvas border border-surface-border font-mono text-[11px] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-surface-400 font-sans text-[10px]">24K Gold:</span>
            <strong className="text-brand-400 font-bold">₹{Number(bullionRates.gold24k || 14607).toFixed(0)}/g</strong>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-hover text-surface-300 hover:text-surface-100 transition shadow-2xs cursor-pointer"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-brand-accent" /> : <Sun className="w-4 h-4 text-brand-benchmark" />}
          </button>

          {/* Interactive Demo CTA */}
          <button
            onClick={onEnterDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-brand-500/30 bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 font-bold text-xs transition cursor-pointer shadow-2xs"
          >
            <span>Live Showroom Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* MAIN LOGIN BUTTON: Role-Based Sign In */}
          <button
            id="landing-navbar-login-btn"
            onClick={onOpenLogin}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 shadow-xs"
            title="Sign In to Showroom Counter or Company Master Panel"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="font-bold">Login (साइन इन)</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-surface-border text-surface-300 hover:text-surface-100 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-card border-b border-surface-border p-4 space-y-3 animate-in fade-in duration-150">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="block py-2 text-xs font-semibold text-surface-200 hover:text-brand-400 border-b border-surface-border/50"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onEnterDemo(); }}
              className="w-full py-2.5 rounded-xl border border-brand-500/30 text-brand-300 font-bold text-xs text-center"
            >
              Explore Live Showroom Demo
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
              className="w-full btn-primary py-2.5 text-xs text-center flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login to Counter (साइन इन)</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
