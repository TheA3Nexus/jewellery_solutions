import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Coins, 
  ShoppingBag, 
  Eye, 
  X, 
  Check, 
  Heart,
  Share2, 
  Tag, 
  Scale, 
  FileText, 
  Printer, 
  ArrowUpDown,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ShowroomQuotationModal } from './ShowroomQuotationModal';

export const TabletLookbook = () => {
  const { tenant, bullionRates } = useTenant();

  const [selectedCollection, setSelectedCollection] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('DEFAULT');
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [pushedToPosAlert, setPushedToPosAlert] = useState(null);

  // Showroom Quotation Modal state
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const [quotationItems, setQuotationItems] = useState([]);

  // Luxury Curated Showroom Catalogue
  const lookbookItems = [
    {
      id: 'LB-BRD-01',
      title: 'Royal Peacock Kundan Bridal Choker Set',
      collection: 'ROYAL_BRIDAL',
      purity: '22K (91.6% BIS)',
      metalType: 'Yellow Gold',
      grossWeight: 54.800,
      netWeight: 48.200,
      stoneWeight: 6.600,
      stoneDescription: 'Uncut Polki & Zambian Emeralds',
      makingChargePercent: 14.0,
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      description: 'Handcrafted by master artisans of Rajasthan featuring delicate Meenakari enamel work on reverse side and certified natural emerald drops.',
      isTrending: true
    },
    {
      id: 'LB-DMD-02',
      title: 'VVS Diamond Solitaire Cascading Necklace',
      collection: 'DIAMOND',
      purity: '18K (75.0% BIS)',
      metalType: 'Rose Gold & White Gold',
      grossWeight: 28.450,
      netWeight: 26.100,
      stoneWeight: 2.350, // Carats
      stoneDescription: '2.35 Cts VVS-EF Certified Diamonds (IGI)',
      makingChargePercent: 12.0,
      diamondValue: 145000,
      imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
      description: 'Modern European design with brilliant cushion-cut diamonds handset in micro-pave prong settings with luminous rhodium finish.',
      isTrending: true
    },
    {
      id: 'LB-TMP-03',
      title: 'Antique Lakshmi Heritage Temple Kada (Pair)',
      collection: 'TEMPLE',
      purity: '22K (91.6% BIS)',
      metalType: 'Antique Matte Gold',
      grossWeight: 62.300,
      netWeight: 62.300,
      stoneWeight: 0.000,
      stoneDescription: 'Solid 22K Gold Repoussé',
      makingChargePercent: 15.0,
      imageUrl: 'https://images.unsplash.com/photo-1611591475879-da0066288ab0?auto=format&fit=crop&w=600&q=80',
      description: 'Sacred temple motifs hand-embossed in high-relief Nakashi technique with ruby-red cabochon highlights.',
      isTrending: false
    },
    {
      id: 'LB-DLW-04',
      title: 'Contemporary Geometric Honeycomb Drop Earrings',
      collection: 'DAILY_WEAR',
      purity: '18K (75.0% BIS)',
      metalType: 'Yellow Gold',
      grossWeight: 6.250,
      netWeight: 6.100,
      stoneWeight: 0.150,
      stoneDescription: 'Star-cut micro diamonds',
      makingChargePercent: 10.0,
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
      description: 'Ultra-lightweight laser-cut honeycomb design suitable for modern corporate and evening wear.',
      isTrending: false
    },
    {
      id: 'LB-BRD-05',
      title: 'Imperial Nizam Jadau Chandbali Earrings',
      collection: 'ROYAL_BRIDAL',
      purity: '22K (91.6% BIS)',
      metalType: 'Yellow Gold',
      grossWeight: 34.600,
      netWeight: 29.400,
      stoneWeight: 5.200,
      stoneDescription: 'Basra Pearl Tassels & Natural Rubies',
      makingChargePercent: 16.0,
      imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
      description: 'Classic crescent moon Chandbali design with authentic Basra seed pearls and hand-set foil-backed gemstones.',
      isTrending: true
    },
    {
      id: 'LB-DMD-06',
      title: 'Eternal Halo Diamond Engagement Solitaire Ring',
      collection: 'DIAMOND',
      purity: '18K (75.0% BIS)',
      metalType: 'Platinum & 18K Yellow Gold',
      grossWeight: 4.800,
      netWeight: 4.550,
      stoneWeight: 1.050, // Carats
      stoneDescription: '1.05 Ct Round Brilliant Cut (D / VVS1 GIA)',
      makingChargePercent: 8.0,
      diamondValue: 220000,
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      description: 'Certified 1-carat triple excellent cut diamond center surrounded by a delicate shimmering halo.',
      isTrending: true
    }
  ];

  // Dynamic Live Pricing Calculator based on current bullion rates
  const calculateLivePrice = (item) => {
    const is18k = item.purity.includes('18K');
    const goldRate = is18k ? (bullionRates?.gold18k || 5790) : (bullionRates?.gold22k || 7080);
    const metalCost = item.netWeight * goldRate;
    const makingCost = metalCost * (item.makingChargePercent / 100);
    const stoneCost = item.diamondValue || (item.stoneWeight > 0 ? item.stoneWeight * 1200 : 0);
    const subtotal = metalCost + makingCost + stoneCost;
    const gst3Percent = subtotal * 0.03;
    return Math.round(subtotal + gst3Percent);
  };

  // Filter and sort items
  const filteredItems = lookbookItems
    .filter((item) => {
      if (selectedCollection === 'WISHLIST') {
        return wishlist.includes(item.id);
      }
      if (selectedCollection !== 'ALL' && item.collection !== selectedCollection) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.purity.toLowerCase().includes(q) ||
          item.metalType.toLowerCase().includes(q) ||
          item.stoneDescription.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (selectedSort === 'PRICE_LOW_HIGH') {
        return calculateLivePrice(a) - calculateLivePrice(b);
      }
      if (selectedSort === 'PRICE_HIGH_LOW') {
        return calculateLivePrice(b) - calculateLivePrice(a);
      }
      if (selectedSort === 'WEIGHT_LOW_HIGH') {
        return a.netWeight - b.netWeight;
      }
      if (selectedSort === 'WEIGHT_HIGH_LOW') {
        return b.netWeight - a.netWeight;
      }
      return 0;
    });

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((x) => x !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const handlePushToPos = (item) => {
    setPushedToPosAlert(`"${item.title}" pushed to Active POS Billing Counter.`);
    setTimeout(() => setPushedToPosAlert(null), 3500);
  };

  const openQuotationForItem = (item) => {
    setQuotationItems([item]);
    setIsQuotationOpen(true);
  };

  const openQuotationForWishlist = () => {
    const items = lookbookItems.filter((i) => wishlist.includes(i.id));
    if (items.length > 0) {
      setQuotationItems(items);
      setIsQuotationOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Alert */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-900 border border-surface-800 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              In-Store Digital Lookbook &amp; Assisted Selling
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Live Dynamic Pricing
              </span>
            </h2>
            <p className="text-xs text-surface-400">
              Interactive high-resolution tablet presentation catalogue with real-time bullion rate sync and instant quotation generation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {wishlist.length > 0 && (
            <button
              id="btn-open-wishlist-quotation"
              onClick={openQuotationForWishlist}
              className="px-3.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              Quote Shortlisted ({wishlist.length})
            </button>
          )}

          {pushedToPosAlert && (
            <div 
              id="alert-pushed-pos"
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in"
            >
              <Check className="w-4 h-4" />
              {pushedToPosAlert}
            </div>
          )}
        </div>
      </div>

      {/* Filter Category Pills, Search & Sort */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex bg-surface-950 p-1 rounded-xl border border-surface-800 text-xs font-semibold overflow-x-auto">
          <button
            id="btn-filter-all"
            onClick={() => setSelectedCollection('ALL')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedCollection === 'ALL'
                ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            All Collections
          </button>
          <button
            id="btn-filter-bridal"
            onClick={() => setSelectedCollection('ROYAL_BRIDAL')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedCollection === 'ROYAL_BRIDAL'
                ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Royal Bridal Heritage
          </button>
          <button
            id="btn-filter-diamond"
            onClick={() => setSelectedCollection('DIAMOND')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedCollection === 'DIAMOND'
                ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Diamond &amp; Solitaires
          </button>
          <button
            id="btn-filter-temple"
            onClick={() => setSelectedCollection('TEMPLE')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedCollection === 'TEMPLE'
                ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Temple Antique Gold
          </button>
          <button
            id="btn-filter-daily"
            onClick={() => setSelectedCollection('DAILY_WEAR')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedCollection === 'DAILY_WEAR'
                ? 'bg-brand-500 text-slate-950 shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Daily Wear Elegance
          </button>
          <button
            id="btn-filter-wishlist"
            onClick={() => setSelectedCollection('WISHLIST')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              selectedCollection === 'WISHLIST'
                ? 'bg-rose-500 text-white shadow-sm font-bold'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Wishlist ({wishlist.length})
          </button>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input
              id="input-search-lookbook"
              type="text"
              placeholder="Search designs, stones, metal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-950 border border-surface-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-surface-950 border border-surface-700 rounded-lg px-2.5 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-surface-400 shrink-0" />
            <select
              id="select-sort-lookbook"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-transparent text-surface-200 focus:outline-none text-xs cursor-pointer"
            >
              <option value="DEFAULT" className="bg-surface-900">Featured Curation</option>
              <option value="PRICE_LOW_HIGH" className="bg-surface-900">Price: Low to High</option>
              <option value="PRICE_HIGH_LOW" className="bg-surface-900">Price: High to Low</option>
              <option value="WEIGHT_LOW_HIGH" className="bg-surface-900">Net Weight: Light to Heavy</option>
              <option value="WEIGHT_HIGH_LOW" className="bg-surface-900">Net Weight: Heavy to Light</option>
            </select>
          </div>
        </div>
      </div>

      {/* Luxury Jewellery Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-surface-900 border border-surface-800 rounded-2xl p-12 text-center text-surface-400 space-y-3">
          <BookOpen className="w-10 h-10 text-surface-600 mx-auto" />
          <h3 className="text-base font-bold text-surface-200">No Designs Found</h3>
          <p className="text-xs max-w-sm mx-auto">
            {selectedCollection === 'WISHLIST'
              ? 'Your wishlist is currently empty. Tap the heart icon on any piece to shortlist it for customer presentation.'
              : 'No jewellery articles matched your search or collection filter criteria.'}
          </p>
          <button
            onClick={() => { setSelectedCollection('ALL'); setSearchQuery(''); }}
            className="px-4 py-1.5 rounded-lg bg-surface-800 text-surface-200 hover:bg-surface-700 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const estimatedPrice = calculateLivePrice(item);
            const isWishlisted = wishlist.includes(item.id);

            return (
              <div
                key={item.id}
                id={`card-lookbook-${item.id}`}
                className="bg-surface-900 border border-surface-700/60 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between group hover:border-brand-500/50 transition-all duration-300"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative aspect-[4/3] bg-surface-950 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-surface-950/85 backdrop-blur-md text-amber-400 border border-amber-500/30">
                        {item.purity}
                      </span>
                      {item.isTrending && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-500/85 backdrop-blur-md text-white">
                          Curated
                        </span>
                      )}
                    </div>

                    <button
                      id={`btn-wishlist-${item.id}`}
                      onClick={() => toggleWishlist(item.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-surface-950/70 backdrop-blur-md text-surface-200 hover:text-rose-400 transition-colors shadow-md"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Bottom Image Overlay Details */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <div className="text-white text-xs font-mono">
                        <span className="text-[11px] text-surface-300 block">Gross Wt:</span>
                        <span className="font-bold">{item.grossWeight.toFixed(3)} g</span>
                      </div>
                      <div className="text-right text-white font-mono">
                        <span className="text-[10px] text-amber-400 block font-sans">Live Showroom Est:</span>
                        <span id={`stat-price-${item.id}`} className="text-base font-bold text-brand-300">
                          ₹{estimatedPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-surface-100 group-hover:text-brand-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-surface-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-surface-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-surface-400">
                      <div>
                        <span>Net Metal: </span>
                        <span className="text-surface-200 font-semibold">{item.netWeight.toFixed(3)} g</span>
                      </div>
                      <div>
                        <span>Gems: </span>
                        <span className="text-surface-200 font-semibold">
                          {item.stoneWeight > 0 ? `${item.stoneWeight} g` : 'Pure Metal'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: 3 Action Grid */}
                <div className="p-4 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`btn-details-${item.id}`}
                      onClick={() => setSelectedItemForModal(item)}
                      className="py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-surface-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-surface-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Full Details
                    </button>
                    <button
                      id={`btn-quote-${item.id}`}
                      onClick={() => openQuotationForItem(item)}
                      className="py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-amber-400 font-semibold text-xs flex items-center justify-center gap-1.5 border border-amber-500/30 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" /> Quotation
                    </button>
                  </div>
                  <button
                    id={`btn-push-pos-${item.id}`}
                    onClick={() => handlePushToPos(item)}
                    className="w-full py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Push to Active Billing Counter
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-surface-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 font-mono">
                {selectedItemForModal.purity} &bull; {selectedItemForModal.metalType}
              </span>
              <button
                id="btn-modal-close"
                onClick={() => setSelectedItemForModal(null)}
                className="p-1 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-surface-950 border border-surface-800">
                <img
                  src={selectedItemForModal.imageUrl}
                  alt={selectedItemForModal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 text-xs">
                <h3 className="text-base font-bold text-surface-100">{selectedItemForModal.title}</h3>
                <p className="text-surface-400 leading-relaxed">{selectedItemForModal.description}</p>

                <div className="bg-surface-950 rounded-xl p-3 border border-surface-800 space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-surface-400">Gross Weight:</span>
                    <span className="font-bold text-surface-200">{selectedItemForModal.grossWeight.toFixed(3)} g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Net Metal Weight:</span>
                    <span className="font-bold text-amber-400">{selectedItemForModal.netWeight.toFixed(3)} g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Stone / Diamond:</span>
                    <span className="text-surface-200">{selectedItemForModal.stoneDescription}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Making Charges:</span>
                    <span className="text-emerald-400 font-semibold">{selectedItemForModal.makingChargePercent}% on metal value</span>
                  </div>
                  <div className="border-t border-surface-800 pt-2 flex justify-between font-bold text-sm">
                    <span className="text-surface-200 font-sans">Live Total (incl. 3% GST):</span>
                    <span className="text-brand-400">
                      ₹{calculateLivePrice(selectedItemForModal).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button
                    id="btn-modal-print-estimate"
                    onClick={() => {
                      const item = selectedItemForModal;
                      setSelectedItemForModal(null);
                      openQuotationForItem(item);
                    }}
                    className="py-2.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Quotation Slip
                  </button>
                  <button
                    id="btn-modal-push-pos"
                    onClick={() => {
                      handlePushToPos(selectedItemForModal);
                      setSelectedItemForModal(null);
                    }}
                    className="py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Push to Billing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Showroom Quotation Modal */}
      <ShowroomQuotationModal
        isOpen={isQuotationOpen}
        onClose={() => setIsQuotationOpen(false)}
        items={quotationItems}
        bullionRates={bullionRates}
        tenant={tenant}
      />
    </div>
  );
};
