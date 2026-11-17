import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Calendar, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Filter, 
  Plus, 
  X, 
  Smartphone, 
  MessageCircle, 
  Gift, 
  Coins 
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';

export const FestivalCampaigns = () => {
  const { tenant } = useTenant();

  const [campaigns, setCampaigns] = useState([
    {
      id: 'CMP-2026-01',
      title: 'Dhanteras & Diwali Shubh Muhurat Gold Booking',
      festival: 'Diwali & Dhanteras',
      targetAudience: 'ALL_CUSTOMERS',
      targetLabel: 'All Registered Customers (1,480)',
      recipientCount: 1480,
      offerCode: 'DHAN-GOLD-2026',
      offerSummary: '0% Making Charges on Diamond Jewellery + Complimentary 10g Pure Silver Coin on Gold > 20g',
      status: 'SCHEDULED',
      scheduledDate: '28-Oct-2026 (09:00 AM)',
      estReach: '98.5%',
      estRevenue: '₹48.5 Lakh'
    },
    {
      id: 'CMP-2026-02',
      title: 'Imperial Bridal Trousseau Private Salon Consultation',
      festival: 'Winter Wedding Season',
      targetAudience: 'VIP_PLATINUM',
      targetLabel: 'Imperial Platinum & Sovereign VIPs (142)',
      recipientCount: 142,
      offerCode: 'BRIDAL-ROYAL-VIP',
      offerSummary: 'Exclusive private suite appointment with Master Artisan + Custom bespoke Polki design sketch',
      status: 'ACTIVE',
      scheduledDate: 'Ongoing Daily',
      estReach: '99.2%',
      estRevenue: '₹82.0 Lakh'
    },
    {
      id: 'CMP-2026-03',
      title: 'Akshaya Tritiya Rate-Lock Advance Booking',
      festival: 'Akshaya Tritiya',
      targetAudience: 'SAVINGS_SCHEME',
      targetLabel: 'Swarna Nidhi Kitty Savers (320)',
      recipientCount: 320,
      offerCode: 'AKSHAYA-LOCK-10',
      offerSummary: 'Lock current bullion rate with 10% token advance. Hedge against festive price spikes.',
      status: 'DRAFT',
      scheduledDate: '15-Apr-2027',
      estReach: '97.8%',
      estRevenue: '₹24.0 Lakh'
    },
    {
      id: 'CMP-2026-04',
      title: 'Old Gold Exchange Mahotsav (100% Value Guarantee)',
      festival: 'Karwa Chauth Special',
      targetAudience: 'DORMANT_CUSTOMERS',
      targetLabel: 'Dormant Customers (> 6 Months) (480)',
      recipientCount: 480,
      offerCode: 'ZERO-MELT-2026',
      offerSummary: 'Get 100% full valuation on old family gold with zero melting deduction on new 22K hallmarked jewellery.',
      status: 'ACTIVE',
      scheduledDate: 'Ongoing this week',
      estReach: '96.4%',
      estRevenue: '₹31.2 Lakh'
    }
  ]);

  const [selectedCampaignForPreview, setSelectedCampaignForPreview] = useState(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [broadcastDoneNotice, setBroadcastDoneNotice] = useState(null);

  // New Campaign Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [newCampaignFestival, setNewCampaignFestival] = useState('Diwali & Dhanteras');
  const [newCampaignAudience, setNewCampaignAudience] = useState('ALL_CUSTOMERS');
  const [newCampaignOffer, setNewCampaignOffer] = useState('');

  const handleLaunchBroadcast = (campaign) => {
    setIsBroadcasting(true);
    setBroadcastProgress(15);
    const interval = setInterval(() => {
      setBroadcastProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBroadcasting(false);
          setBroadcastDoneNotice(`Campaign "${campaign.title}" successfully dispatched to ${campaign.recipientCount} verified WhatsApp numbers!`);
          setTimeout(() => setBroadcastDoneNotice(null), 4500);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!newCampaignTitle) return;

    const newCamp = {
      id: `CMP-2026-${(campaigns.length + 1).toString().padStart(2, '0')}`,
      title: newCampaignTitle,
      festival: newCampaignFestival,
      targetAudience: newCampaignAudience,
      targetLabel: newCampaignAudience === 'ALL_CUSTOMERS' ? 'All Registered Customers (1,480)' : 'Filtered VIP Members',
      recipientCount: newCampaignAudience === 'ALL_CUSTOMERS' ? 1480 : 250,
      offerCode: `FEST-${Date.now().toString().slice(-4)}`,
      offerSummary: newCampaignOffer || 'Special Festive Discount on Making Charges',
      status: 'SCHEDULED',
      scheduledDate: 'Scheduled for Tomorrow',
      estReach: '98.0%',
      estRevenue: '₹25.0 Lakh'
    };

    setCampaigns([newCamp, ...campaigns]);
    setIsCreateModalOpen(false);
    setNewCampaignTitle('');
    setNewCampaignOffer('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metric Deck */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              Festive Marketing &amp; Broadcast Campaign Desk
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Diwali &amp; Wedding Season Engine
              </span>
            </h2>
            <p className="text-xs text-surface-400">
              Run targeted, high-conversion WhatsApp broadcasts for Dhanteras, Akshaya Tritiya, Karwa Chauth, and VIP Bridal appointments.
            </p>
          </div>
        </div>

        <button
          id="btn-create-campaign"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Festive Campaign
        </button>
      </div>

      {/* Broadcast Toast Notification */}
      {broadcastDoneNotice && (
        <div 
          id="alert-broadcast-success"
          className="bg-emerald-950/80 border-2 border-emerald-500 rounded-xl p-3.5 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          {broadcastDoneNotice}
        </div>
      )}

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400 block mb-1">
            Opt-in WhatsApp Reach
          </span>
          <div id="stat-crm-optin-reach" className="text-2xl font-black text-surface-100 font-mono">
            1,480
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> 100% Verified Mobile Numbers
          </span>
        </div>

        <div className="bg-surface-900 border border-surface-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400 block mb-1">
            Active Festive Campaigns
          </span>
          <div id="stat-crm-active-campaigns" className="text-2xl font-black text-amber-400 font-mono">
            {campaigns.filter((c) => c.status === 'ACTIVE' || c.status === 'SCHEDULED').length}
          </div>
          <span className="text-[11px] text-surface-400 mt-1 block">
            Diwali, Dhanteras &amp; Bridal
          </span>
        </div>

        <div className="bg-surface-900 border border-surface-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400 block mb-1">
            Projected Pipeline Value
          </span>
          <div id="stat-crm-pipeline-val" className="text-2xl font-black text-brand-300 font-mono">
            ₹1.85 Cr
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block font-semibold">
            Based on historical conversions
          </span>
        </div>

        <div className="bg-surface-900 border border-surface-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400 block mb-1">
            Avg Meta Message Open Rate
          </span>
          <div id="stat-crm-open-rate" className="text-2xl font-black text-sky-400 font-mono">
            94.6%
          </div>
          <span className="text-[11px] text-surface-400 mt-1 block font-mono">
            Direct customer WhatsApp reads
          </span>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            id={`card-campaign-${camp.id}`}
            className="bg-surface-900 border border-surface-700/60 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-md hover:border-amber-500/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {camp.festival}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    camp.status === 'ACTIVE'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : camp.status === 'SCHEDULED'
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      : 'bg-surface-800 text-surface-400'
                  }`}
                >
                  {camp.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-surface-100 group-hover:text-brand-400 transition-colors">
                  {camp.title}
                </h3>
                <p className="text-xs text-surface-300 mt-1 leading-relaxed">
                  {camp.offerSummary}
                </p>
              </div>

              <div className="bg-surface-950 p-3 rounded-xl border border-surface-800 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-surface-400">
                  <span>Audience Segment:</span>
                  <span className="text-surface-200 font-semibold">{camp.targetLabel}</span>
                </div>
                <div className="flex justify-between text-surface-400">
                  <span>Voucher Offer Code:</span>
                  <span className="text-amber-400 font-bold">{camp.offerCode}</span>
                </div>
                <div className="flex justify-between text-surface-400">
                  <span>Target Date / Schedule:</span>
                  <span className="text-surface-200">{camp.scheduledDate}</span>
                </div>
                <div className="flex justify-between text-surface-400">
                  <span>Estimated Demand:</span>
                  <span className="text-emerald-400 font-bold">{camp.estRevenue}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-800">
              <button
                id={`btn-preview-camp-${camp.id}`}
                onClick={() => setSelectedCampaignForPreview(camp)}
                className="py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-surface-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-surface-700 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5" /> WhatsApp Preview
              </button>
              <button
                id={`btn-dispatch-camp-${camp.id}`}
                disabled={isBroadcasting}
                onClick={() => handleLaunchBroadcast(camp)}
                className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" /> Broadcast Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcasting Progress Overlay */}
      {isBroadcasting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-md w-full p-6 space-y-4 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-surface-100">
              Dispatching Meta Cloud API WhatsApp Broadcast
            </h3>
            <p className="text-xs text-surface-400">
              Broadcasting encrypted WhatsApp messages via official Business WABA pipeline. Please do not close this window.
            </p>
            <div className="w-full bg-surface-950 h-3 rounded-full overflow-hidden border border-surface-800">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${broadcastProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {broadcastProgress}% Completed
            </span>
          </div>
        </div>
      )}

      {/* WhatsApp Message Preview Modal */}
      {selectedCampaignForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-surface-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono block">
                  Interactive WhatsApp Preview
                </span>
                <h3 className="text-sm font-bold text-surface-100">
                  {selectedCampaignForPreview.title}
                </h3>
              </div>
              <button
                id="btn-close-camp-preview"
                onClick={() => setSelectedCampaignForPreview(null)}
                className="p-1 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Smartphone Chat Bubble */}
            <div className="bg-emerald-50/60 p-4 rounded-2xl border-2 border-surface-700">
              <div className="bg-[#E7FFDB] border border-emerald-300 rounded-xl p-3.5 text-xs text-slate-950 space-y-2 shadow-sm font-sans leading-relaxed">
                <div className="flex items-center gap-1.5 pb-1 border-b border-emerald-500/20">
                  <div className="w-5 h-5 rounded-full bg-brand-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                    A3
                  </div>
                  <span className="font-bold text-[11px]">{tenant?.name || 'A3 JEWELLERY & SONS'}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 ml-auto" />
                </div>

                <p>Namaste <strong>{'{{CustomerName}}'}</strong> ji! 🪔✨</p>
                <p>
                  Wishing you and your family divine prosperity on this auspicious occasion of <strong>{selectedCampaignForPreview.festival}</strong>!
                </p>

                <div className="bg-white/90 p-2.5 rounded-lg border border-emerald-400 space-y-1 text-[11px]">
                  <div className="font-bold text-slate-900">Festive Showroom Offer:</div>
                  <p className="text-slate-700">{selectedCampaignForPreview.offerSummary}</p>
                  <div className="pt-1 font-mono text-[10px] flex justify-between">
                    <span>Voucher Code: <b className="text-amber-800">{selectedCampaignForPreview.offerCode}</b></span>
                    <span className="text-emerald-700 font-bold">Valid till Diwali</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-600">
                  Visit our {tenant?.branch || 'Flagship Showroom'} today to experience our certified BIS Hallmarked jewellery collection.
                </p>

                <div className="pt-1 space-y-1">
                  <button className="w-full py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm">
                    <Calendar className="w-3.5 h-3.5" /> Book Showroom Appointment
                  </button>
                  <button className="w-full py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 font-semibold text-[11px] flex items-center justify-center gap-1">
                    View Digital Lookbook Online
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const camp = selectedCampaignForPreview;
                setSelectedCampaignForPreview(null);
                handleLaunchBroadcast(camp);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" /> Broadcast to {selectedCampaignForPreview.recipientCount} Customers
            </button>
          </div>
        </div>
      )}

      {/* Create New Campaign Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-surface-800 pb-3">
              <h3 className="text-base font-bold text-surface-100 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                Create New Festive Broadcast Campaign
              </h3>
              <button
                id="btn-close-create-camp"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-mono text-surface-400 block mb-1">
                  Campaign Title:
                </label>
                <input
                  id="input-camp-title"
                  type="text"
                  required
                  placeholder="e.g. Dhanteras 24K Gold Coin Pre-Booking"
                  value={newCampaignTitle}
                  onChange={(e) => setNewCampaignTitle(e.target.value)}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-mono text-surface-400 block mb-1">
                    Occasion / Festival:
                  </label>
                  <select
                    id="select-camp-festival"
                    value={newCampaignFestival}
                    onChange={(e) => setNewCampaignFestival(e.target.value)}
                    className="w-full bg-surface-950 border border-surface-700 rounded-lg px-2.5 py-2 text-surface-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="Diwali & Dhanteras">Diwali &amp; Dhanteras</option>
                    <option value="Akshaya Tritiya">Akshaya Tritiya</option>
                    <option value="Winter Wedding Season">Winter Wedding Season</option>
                    <option value="Karwa Chauth">Karwa Chauth</option>
                    <option value="New Year Gold Gala">New Year Gold Gala</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-surface-400 block mb-1">
                    Target Customer Audience:
                  </label>
                  <select
                    id="select-camp-audience"
                    value={newCampaignAudience}
                    onChange={(e) => setNewCampaignAudience(e.target.value)}
                    className="w-full bg-surface-950 border border-surface-700 rounded-lg px-2.5 py-2 text-surface-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="ALL_CUSTOMERS">All Customers (1,480)</option>
                    <option value="VIP_PLATINUM">Imperial Platinum VIPs (142)</option>
                    <option value="SAVINGS_SCHEME">Swarna Nidhi Kitty Savers (320)</option>
                    <option value="DORMANT_CUSTOMERS">Dormant Clients &gt; 6 Mos (480)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-surface-400 block mb-1">
                  Festive Offer &amp; Promotion Details:
                </label>
                <textarea
                  id="input-camp-offer"
                  rows={3}
                  required
                  placeholder="e.g. Free 10g 999 Silver Coin with every 22K Gold Jewellery purchase above 25 grams. 0% Making charges on Diamond Jewellery."
                  value={newCampaignOffer}
                  onChange={(e) => setNewCampaignOffer(e.target.value)}
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg p-2.5 text-surface-100 focus:outline-none focus:border-brand-500 leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button
                  id="btn-submit-create-camp"
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Save &amp; Schedule Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
