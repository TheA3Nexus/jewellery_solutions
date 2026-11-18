import React, { useState } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { ModuleShowcase } from './components/ModuleShowcase';
import { HardwareSection } from './components/HardwareSection';
import { PricingSection } from './components/PricingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { LandingFooter } from './components/LandingFooter';
import { RoleLoginModal } from './components/RoleLoginModal';

export const LandingPage = ({ onNavigateToApp, onNavigateToMasterAdmin }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginSuccess = ({ role, destination, store }) => {
    if (destination === 'MASTER_ADMIN' || role === 'SUPER_ADMIN') {
      onNavigateToMasterAdmin();
    } else {
      onNavigateToApp(destination || 'POS');
    }
  };

  const handleEnterDemo = () => {
    onNavigateToApp('POS');
  };

  const handleSelectPlan = (planId) => {
    setIsLoginModalOpen(true);
  };

  const handleExploreModule = (moduleId) => {
    onNavigateToApp(moduleId);
  };

  return (
    <div className="min-h-screen bg-surface-canvas text-surface-secondary font-sans selection:bg-brand-500/30">
      {/* 1. Global Announcement Ticker */}
      <AnnouncementBar 
        onCtaClick={handleEnterDemo}
      />

      {/* 2. Top Luxury Navbar with Login CTA */}
      <LandingNavbar 
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onEnterDemo={handleEnterDemo}
      />

      {/* 3. Hero Section */}
      <HeroSection 
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onEnterDemo={handleEnterDemo}
      />

      {/* 4. Core Showroom Modules Tabbed Tour */}
      <ModuleShowcase 
        onExploreModule={handleExploreModule}
      />

      {/* 5. Hardware Ecosystem (Precision Scale, Zebra Tag, Customer Display) */}
      <HardwareSection />

      {/* 6. Transparent Subscription Pricing Plans */}
      <PricingSection 
        onSelectPlan={handleSelectPlan}
      />

      {/* 7. Sarafa Bazaar Testimonials & Social Proof */}
      <TestimonialsSection />

      {/* 8. Luxury Footer with Sitemaps & Compliance Notes */}
      <LandingFooter 
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onEnterDemo={handleEnterDemo}
      />

      {/* 9. Interactive Role-Based Login Modal */}
      <RoleLoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};
