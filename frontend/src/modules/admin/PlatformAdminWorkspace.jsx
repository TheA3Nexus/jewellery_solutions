import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { RegisterClientModal } from './components/RegisterClientModal';
import { PlanUpgradeModal } from './components/PlanUpgradeModal';
import { StoreHardwareModal } from './components/StoreHardwareModal';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  CreditCard, 
  Scale, 
  Printer, 
  ArrowRight, 
  ExternalLink, 
  Phone, 
  Mail, 
  MapPin, 
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  TrendingUp,
  Coins,
  Home
} from 'lucide-react';

export const PlatformAdminWorkspace = ({ onEnterStore, onGoToHomepage }) => {
  const { 
    clientStores, 
    enterStore, 
    registerClientStore, 
    updateStorePlan, 
    toggleStoreStatus 
  } = useTenant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPlan, setSelectedPlan] = useState('ALL');
  const [viewMode, setViewMode] = useState('GRID'); // 'GRID' | 'TABLE'

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedStoreForUpgrade, setSelectedStoreForUpgrade] = useState(null);
  const [selectedStoreForHardware, setSelectedStoreForHardware] = useState(null);

  // Compute Platform Totals
  const totalStores = clientStores.length;
  const activeStores = clientStores.filter(s => s.subscriptionStatus === 'ACTIVE').length;
  const trialStores = clientStores.filter(s => s.subscriptionStatus === 'TRIAL').length;
  const expiringStores = clientStores.filter(s => s.subscriptionStatus === 'EXPIRING_SOON').length;
  
  const totalArr = clientStores.reduce((acc, s) => acc + (s.annualFee || 0), 0);
  const totalNetworkTodaySales = clientStores.reduce((acc, s) => acc + (s.metrics?.todaySales || 0), 0);
  const totalNetworkTodayGold = clientStores.reduce((acc, s) => acc + (s.metrics?.todayGoldWeight || 0), 0);
  const totalConnectedTerminals = clientStores.reduce((acc, s) => acc + (s.hardwareTerminals?.length || 0), 0);

  // Filtered Stores Roster
  const filteredStores = clientStores.filter(store => {
    const matchesSearch = 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      selectedStatus === 'ALL' || store.subscriptionStatus === selectedStatus;

    const matchesPlan = 
      selectedPlan === 'ALL' || store.plan === selectedPlan;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleEnterStoreClick = (storeId) => {
    enterStore(storeId);
    if (onEnterStore) {
      onEnterStore(storeId);
    }
  };

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'DIAMOND_ENTERPRISE':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            DIAMOND ENTERPRISE
          </span>
        );
      case 'GOLD_SHOWROOM':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-500/15 text-brand-400 border border-brand-500/30">
            GOLD SHOWROOM
          </span>
        );
      case 'SILVER_RETAIL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-500/20 text-slate-200 border border-slate-500/30">
            SILVER RETAIL
          </span>
        );
      case 'FREE_TRIAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            14-DAY TRIAL
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status, daysRemaining) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Active ({daysRemaining}d left)
          </span>
        );
      case 'EXPIRING_SOON':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Expiring ({daysRemaining}d left)
          </span>
        );
      case 'TRIAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Trial ({daysRemaining}d left)
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-card p-5 rounded-2xl border border-surface-border shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-surface-100 uppercase tracking-wide flex items-center gap-2">
                A3 Jewellery SaaS Platform Command Center
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono font-bold">
                  Super-Admin
                </span>
              </h1>
              <p className="text-xs text-surface-400 mt-0.5">
                Central Client Jeweller Accounts, Subscription Licensing, and Store Switcher.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onGoToHomepage && (
            <button
              id="admin-back-to-home-btn"
              onClick={onGoToHomepage}
              className="px-3.5 py-2 rounded-xl border border-surface-border bg-surface-canvas hover:bg-surface-hover text-surface-200 hover:text-surface-100 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Return to Public Homepage"
            >
              <Home className="w-3.5 h-3.5 text-brand-400" />
              <span>Back to Homepage (होमपेज)</span>
            </button>
          )}

          <button
            id="open-register-client-modal-btn"
            onClick={() => setIsRegisterOpen(true)}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Jeweller (नया ग्राहक जोड़ें)</span>
          </button>
        </div>
      </div>

      {/* 2. Platform KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Total Stores */}
        <div className="card-surface p-4 border border-surface-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
              Total Client Showrooms
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h3 className="text-xl font-black text-surface-100 font-mono">
                {totalStores}
              </h3>
              <span className="text-[10px] text-emerald-400 font-medium">
                ({activeStores} Active &bull; {trialStores} Trial)
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: ARR Revenue */}
        <div className="card-surface p-4 border border-surface-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
              Network Subscription ARR
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h3 className="text-xl font-black text-emerald-400 font-mono">
                ₹{(totalArr / 100000).toFixed(2)} Lakhs
              </h3>
              <span className="text-[10px] text-surface-400 font-mono">/ Year</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Today's Network Sales */}
        <div className="card-surface p-4 border border-surface-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
              Today's Network Sales Volume
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h3 className="text-xl font-black text-surface-100 font-mono">
                ₹{(totalNetworkTodaySales / 100000).toFixed(2)} L
              </h3>
              <span className="text-[10px] text-brand-400 font-mono font-semibold">
                ({totalNetworkTodayGold.toFixed(1)}g Gold)
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Connected Hardware */}
        <div className="card-surface p-4 border border-surface-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
              Connected Peripherals
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h3 className="text-xl font-black text-sky-400 font-mono">
                {totalConnectedTerminals} Terminals
              </h3>
              <span className="text-[10px] text-surface-400">Scales &amp; Tag Printers</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter, Search & View Controls */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-surface-card p-3 rounded-xl border border-surface-border">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Jeweller Name, City, Owner, GSTIN, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-canvas border border-surface-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-surface-100 focus:outline-none focus:border-brand-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center bg-surface-canvas p-1 rounded-lg border border-surface-border text-[11px]">
            {['ALL', 'ACTIVE', 'EXPIRING_SOON', 'TRIAL', 'SUSPENDED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2 py-0.5 rounded-md font-semibold transition cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-brand-500 text-white shadow-2xs'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                {st === 'ALL' ? 'All' : st === 'EXPIRING_SOON' ? 'Expiring' : st}
              </button>
            ))}
          </div>

          {/* Plan Filter */}
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="bg-surface-canvas border border-surface-border rounded-lg px-2.5 py-1 text-xs text-surface-200 focus:outline-none focus:border-brand-400 cursor-pointer"
          >
            <option value="ALL">All Plans</option>
            <option value="DIAMOND_ENTERPRISE">Diamond Enterprise</option>
            <option value="GOLD_SHOWROOM">Gold Showroom</option>
            <option value="SILVER_RETAIL">Silver Retail</option>
            <option value="FREE_TRIAL">Free Trial</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-surface-canvas p-1 rounded-lg border border-surface-border text-surface-400">
            <button
              onClick={() => setViewMode('GRID')}
              className={`p-1 rounded cursor-pointer ${viewMode === 'GRID' ? 'bg-surface-card text-brand-400 shadow-2xs' : 'hover:text-surface-200'}`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`p-1 rounded cursor-pointer ${viewMode === 'TABLE' ? 'bg-surface-card text-brand-400 shadow-2xs' : 'hover:text-surface-200'}`}
              title="Table Roster View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Client Stores Roster (Cards View) */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStores.map((store) => (
            <div 
              key={store.id}
              className="card-surface p-4 border border-surface-border hover:border-brand-400/50 transition flex flex-col justify-between space-y-4 shadow-xs group"
            >
              {/* Card Header: Store Name, City, ID */}
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-surface-400 mb-0.5">
                      <span className="font-bold text-brand-400">{store.id}</span>
                      <span>&bull;</span>
                      <span className="truncate">{store.city}, {store.state}</span>
                    </div>
                    <h3 className="text-sm font-bold text-surface-100 group-hover:text-brand-300 transition truncate">
                      {store.name}
                    </h3>
                    <p className="text-[11px] text-surface-400 truncate">
                      {store.tradeName}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {getStatusBadge(store.subscriptionStatus, store.daysRemaining)}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {getPlanBadge(store.plan)}
                  <span className="text-[10px] font-mono text-surface-400 font-semibold">
                    {store.activeCounters}/{store.maxCounters} Desks Active
                  </span>
                </div>
              </div>

              {/* Owner & Contact Pill */}
              <div className="bg-surface-canvas/60 p-2.5 rounded-xl border border-surface-border text-xs space-y-1 font-sans">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-surface-400">Proprietor:</span>
                  <span className="font-semibold text-surface-200">{store.ownerName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-surface-400 font-sans">Phone:</span>
                  <span className="text-surface-300">{store.phone}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-surface-400 font-sans">GSTIN:</span>
                  <span className="text-surface-300 truncate max-w-[150px]">{store.gstin}</span>
                </div>
              </div>

              {/* Today's Store Activity Barometer */}
              <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-surface-border/60 pt-2 font-mono">
                <div>
                  <span className="text-surface-400 font-sans text-[10px]">Today's Sales:</span>
                  <p className="font-bold text-surface-100">
                    ₹{(store.metrics?.todaySales || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <span className="text-surface-400 font-sans text-[10px]">Gold Billed:</span>
                  <p className="font-bold text-brand-400">
                    {Number(store.metrics?.todayGoldWeight || 0).toFixed(2)} g
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-2 pt-2 border-t border-surface-border">
                {/* PRIMARY ACTION: ENTER STORE (दुकान खोलें) */}
                <button
                  onClick={() => handleEnterStoreClick(store.id)}
                  className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1.5 shadow-xs"
                  title="Switch and Open this Jeweller's Store ERP"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="font-bold">Enter Store (दुकान खोलें)</span>
                </button>

                {/* Hardware Inspector */}
                <button
                  onClick={() => setSelectedStoreForHardware(store)}
                  className="p-2 rounded-xl border border-surface-border hover:bg-surface-hover text-surface-300 hover:text-surface-100 transition cursor-pointer"
                  title="View Connected Scales & Printers"
                >
                  <Scale className="w-3.5 h-3.5 text-brand-400" />
                </button>

                {/* Plan Upgrade / Renewal */}
                <button
                  onClick={() => setSelectedStoreForUpgrade(store)}
                  className="p-2 rounded-xl border border-surface-border hover:bg-surface-hover text-surface-300 hover:text-surface-100 transition cursor-pointer"
                  title="Renew or Upgrade Subscription Plan"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                </button>

                {/* Suspend / Resume Access */}
                <button
                  onClick={() => toggleStoreStatus(store.id)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    store.subscriptionStatus === 'SUSPENDED'
                      ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                      : 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                  }`}
                  title={store.subscriptionStatus === 'SUSPENDED' ? 'Resume Store Access' : 'Suspend Store Access'}
                >
                  {store.subscriptionStatus === 'SUSPENDED' ? (
                    <PlayCircle className="w-3.5 h-3.5" />
                  ) : (
                    <PauseCircle className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="card-surface border border-surface-border rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-surface-canvas border-b border-surface-border text-surface-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Store ID &amp; Name</th>
                  <th className="py-2.5 px-3">City &amp; State</th>
                  <th className="py-2.5 px-3">Proprietor &amp; Phone</th>
                  <th className="py-2.5 px-3">Plan Tier</th>
                  <th className="py-2.5 px-3">Status / Expiry</th>
                  <th className="py-2.5 px-3 text-right">Today's Sales</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-surface-200">
                {filteredStores.map((store) => (
                  <tr key={store.id} className="hover:bg-surface-hover/50 transition">
                    <td className="py-3 px-3 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-brand-400">{store.id}</span>
                        <div>
                          <p className="font-bold text-surface-100">{store.name}</p>
                          <p className="text-[10px] text-surface-400 font-mono">GST: {store.gstin}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-surface-300">
                      {store.city}, {store.state}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-surface-100">{store.ownerName}</p>
                      <p className="font-mono text-[10px] text-surface-400">{store.phone}</p>
                    </td>
                    <td className="py-3 px-3">
                      {getPlanBadge(store.plan)}
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(store.subscriptionStatus, store.daysRemaining)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-surface-100">
                      ₹{(store.metrics?.todaySales || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleEnterStoreClick(store.id)}
                        className="btn-primary text-[11px] px-3 py-1.5 flex items-center gap-1.5 mx-auto"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Enter Store</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Modals */}
      <RegisterClientModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={(formData) => registerClientStore(formData)}
      />

      <PlanUpgradeModal
        isOpen={!!selectedStoreForUpgrade}
        onClose={() => setSelectedStoreForUpgrade(null)}
        store={selectedStoreForUpgrade}
        onUpdatePlan={updateStorePlan}
      />

      <StoreHardwareModal
        isOpen={!!selectedStoreForHardware}
        onClose={() => setSelectedStoreForHardware(null)}
        store={selectedStoreForHardware}
      />
    </div>
  );
};
