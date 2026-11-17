import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TenantContext = createContext(null);

const API_BASE = 'http://localhost:5000/api/v1';

export const DEFAULT_CLIENT_STORES = [
  {
    id: 'JWL-MUM-01',
    code: 'A3-FLAGSHIP',
    name: 'A3 Diamond & Gold Showroom',
    tradeName: 'A3 Jewellery Solutions Pvt Ltd',
    ownerName: 'Adarsh Gupta',
    phone: '+91 98200 12345',
    email: 'billing@a3jewellery.com',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Shop 12-14, Zaveri Bazaar, Kalbadevi, Mumbai - 400002',
    gstin: '27AABCJ1234F1Z8',
    bisLicenseNo: 'HM/C-7821940',
    pan: 'AABCJ1234F',
    plan: 'DIAMOND_ENTERPRISE',
    planName: 'Diamond Enterprise Plan',
    annualFee: 120000,
    subscriptionStatus: 'ACTIVE',
    subscriptionStart: '2026-01-01',
    subscriptionExpiry: '2026-12-31',
    daysRemaining: 316,
    maxCounters: 10,
    activeCounters: 4,
    metrics: {
      todaySales: 2450800,
      todayBills: 28,
      todayGoldWeight: 168.450,
      totalStockPieces: 450,
      totalStockGoldGrams: 3200.40
    },
    hardwareTerminals: [
      { id: 'TERM-01', name: 'Main Counter Scale', type: 'SCALE', model: 'Essae Teraoka DS-852', port: 'COM3', baudRate: 9600, status: 'ONLINE' },
      { id: 'TERM-02', name: 'Tag Barcode Printer', type: 'PRINTER', model: 'Zebra ZD220 ZPL', port: 'USB001', status: 'ONLINE' },
      { id: 'TERM-03', name: 'Customer Pole Screen', type: 'POLE_DISPLAY', model: 'HDMI 1080p Screen', status: 'ACTIVE' }
    ]
  },
  {
    id: 'JWL-VNS-02',
    code: 'SHREE-RAM',
    name: 'Shree Ram Jewellers & Sons',
    tradeName: 'Shree Ram Alankar Bhandar',
    ownerName: 'Ram Prasad Verma',
    phone: '+91 98390 54321',
    email: 'ramesh@shreeramjewels.in',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    address: 'Shop 4-6, Vishwanath Gali, Chowk, Varanasi - 221001',
    gstin: '09AABCS8891J1Z2',
    bisLicenseNo: 'HM/C-6729012',
    pan: 'AABCS8891J',
    plan: 'GOLD_SHOWROOM',
    planName: 'Gold Showroom Plan',
    annualFee: 48000,
    subscriptionStatus: 'ACTIVE',
    subscriptionStart: '2026-03-15',
    subscriptionExpiry: '2027-03-14',
    daysRemaining: 116,
    maxCounters: 3,
    activeCounters: 2,
    metrics: {
      todaySales: 1240000,
      todayBills: 14,
      todayGoldWeight: 86.200,
      totalStockPieces: 310,
      totalStockGoldGrams: 2150.80
    },
    hardwareTerminals: [
      { id: 'TERM-VNS-01', name: 'Counter 1 Precision Scale', type: 'SCALE', model: 'Citizen CG-Series 0.01g', port: 'COM1', baudRate: 9600, status: 'ONLINE' },
      { id: 'TERM-VNS-02', name: 'Zebra Tag Printer', type: 'PRINTER', model: 'TSC TE244 Barcode', port: 'USB002', status: 'ONLINE' },
      { id: 'TERM-VNS-03', name: 'Customer Secondary Display', type: 'POLE_DISPLAY', model: 'Pole Display 800x480', status: 'ACTIVE' }
    ]
  },
  {
    id: 'JWL-PUN-03',
    code: 'KALYAN-HERITAGE',
    name: 'Kalyan Heritage Jewels',
    tradeName: 'Kalyan Heritage Retail LLP',
    ownerName: 'Vikram Shinde',
    phone: '+91 98220 99887',
    email: 'contact@kalyanheritage.com',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Plot 45, Laxmi Road, Near Sonya Maruti Chowk, Pune - 411030',
    gstin: '27AAGCK4412M1Z5',
    bisLicenseNo: 'HM/C-8819023',
    pan: 'AAGCK4412M',
    plan: 'GOLD_SHOWROOM',
    planName: 'Gold Showroom Plan',
    annualFee: 48000,
    subscriptionStatus: 'ACTIVE',
    subscriptionStart: '2026-02-10',
    subscriptionExpiry: '2027-02-09',
    daysRemaining: 83,
    maxCounters: 3,
    activeCounters: 3,
    metrics: {
      todaySales: 1890500,
      todayBills: 21,
      todayGoldWeight: 132.500,
      totalStockPieces: 520,
      totalStockGoldGrams: 3840.10
    },
    hardwareTerminals: [
      { id: 'TERM-PUN-01', name: 'Billing Scale A', type: 'SCALE', model: 'Phoenix Gold Balancer', port: 'COM2', baudRate: 9600, status: 'ONLINE' },
      { id: 'TERM-PUN-02', name: 'Jewellery Label Printer', type: 'PRINTER', model: 'Zebra ZD421 ZPL', port: 'USB001', status: 'ONLINE' }
    ]
  },
  {
    id: 'JWL-JPR-04',
    code: 'ZAVERI-RATNA',
    name: 'Zaveri Ratna Bhandar',
    tradeName: 'Zaveri Gems & Ornaments Pvt Ltd',
    ownerName: 'Mahesh Kothari',
    phone: '+91 94140 33221',
    email: 'info@zaveriratna.in',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'Shop 88-90, Johari Bazaar, Jaipur - 302003',
    gstin: '08AAACZ5541Q1ZP',
    bisLicenseNo: 'HM/C-9921443',
    pan: 'AAACZ5541Q',
    plan: 'DIAMOND_ENTERPRISE',
    planName: 'Diamond Enterprise Plan',
    annualFee: 120000,
    subscriptionStatus: 'ACTIVE',
    subscriptionStart: '2026-05-01',
    subscriptionExpiry: '2027-04-30',
    daysRemaining: 163,
    maxCounters: 8,
    activeCounters: 4,
    metrics: {
      todaySales: 3120000,
      todayBills: 34,
      todayGoldWeight: 220.100,
      totalStockPieces: 680,
      totalStockGoldGrams: 4950.00
    },
    hardwareTerminals: [
      { id: 'TERM-JPR-01', name: 'High Precision Balance', type: 'SCALE', model: 'Sartorius Entris II 0.001g', port: 'COM4', baudRate: 9600, status: 'ONLINE' },
      { id: 'TERM-JPR-02', name: 'Zebra RFID & Tag Printer', type: 'PRINTER', model: 'Zebra ZD621R RFID', port: 'USB003', status: 'ONLINE' }
    ]
  },
  {
    id: 'JWL-IDR-05',
    code: 'MAHALAXMI-IND',
    name: 'Mahalaxmi Gold & Silver Works',
    tradeName: 'Mahalaxmi Bullion & Ornaments',
    ownerName: 'Sanjay Soni',
    phone: '+91 98930 11223',
    email: 'sanjay@mahalaxmigold.com',
    city: 'Indore',
    state: 'Madhya Pradesh',
    address: 'Sarafa Bazaar Main Road, Near Rajwada, Indore - 452002',
    gstin: '23AABFM6621L1Z9',
    bisLicenseNo: 'HM/C-4412098',
    pan: 'AABFM6621L',
    plan: 'SILVER_RETAIL',
    planName: 'Silver Retail Plan',
    annualFee: 24000,
    subscriptionStatus: 'EXPIRING_SOON',
    subscriptionStart: '2025-11-25',
    subscriptionExpiry: '2026-11-24',
    daysRemaining: 6,
    maxCounters: 1,
    activeCounters: 1,
    metrics: {
      todaySales: 640000,
      todayBills: 9,
      todayGoldWeight: 44.800,
      totalStockPieces: 195,
      totalStockGoldGrams: 1280.40
    },
    hardwareTerminals: [
      { id: 'TERM-IDR-01', name: 'Benchtop Scale', type: 'SCALE', model: 'Wensar PGB-200 0.01g', port: 'COM1', baudRate: 9600, status: 'ONLINE' }
    ]
  },
  {
    id: 'JWL-DEL-06',
    code: 'ROYAL-DEL',
    name: 'Royal Heritage Jewels (Franchise)',
    tradeName: 'Royal Retail Associates LLP',
    ownerName: 'Kunal Aggarwal',
    phone: '+91 98110 44556',
    email: 'kunal@royalheritagejewels.com',
    city: 'New Delhi',
    state: 'Delhi',
    address: 'Block E, Inner Circle, Connaught Place, New Delhi - 110001',
    gstin: '07AAECR7734K1ZV',
    bisLicenseNo: 'HM/C-5521990',
    pan: 'AAECR7734K',
    plan: 'DIAMOND_ENTERPRISE',
    planName: 'Diamond Enterprise Plan',
    annualFee: 120000,
    subscriptionStatus: 'ACTIVE',
    subscriptionStart: '2026-06-10',
    subscriptionExpiry: '2027-06-09',
    daysRemaining: 203,
    maxCounters: 6,
    activeCounters: 3,
    metrics: {
      todaySales: 2850000,
      todayBills: 26,
      todayGoldWeight: 195.400,
      totalStockPieces: 540,
      totalStockGoldGrams: 4120.00
    },
    hardwareTerminals: [
      { id: 'TERM-DEL-01', name: 'Counter 1 Balance', type: 'SCALE', model: 'Essae Teraoka DS-852', port: 'COM2', baudRate: 9600, status: 'ONLINE' },
      { id: 'TERM-DEL-02', name: 'Zebra Tag ZPL', type: 'PRINTER', model: 'Zebra ZD220', port: 'USB001', status: 'ONLINE' }
    ]
  },
  {
    id: 'JWL-CHN-07',
    code: 'AMBIKA-CHN',
    name: 'Ambika Alankar Mandir',
    tradeName: 'Ambika Gold Mart',
    ownerName: 'Subramanian Swamy',
    phone: '+91 98400 77889',
    email: 'ambikajewels@gmail.com',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Panagal Park, Usman Road, T. Nagar, Chennai - 600017',
    gstin: '33AABPA9912Q1ZX',
    bisLicenseNo: 'HM/C-3321456',
    pan: 'AABPA9912Q',
    plan: 'FREE_TRIAL',
    planName: '14-Day Free Trial',
    annualFee: 0,
    subscriptionStatus: 'TRIAL',
    subscriptionStart: '2026-11-10',
    subscriptionExpiry: '2026-11-24',
    daysRemaining: 6,
    maxCounters: 2,
    activeCounters: 1,
    metrics: {
      todaySales: 410000,
      todayBills: 5,
      todayGoldWeight: 28.500,
      totalStockPieces: 140,
      totalStockGoldGrams: 890.00
    },
    hardwareTerminals: [
      { id: 'TERM-CHN-01', name: 'Counter Scale', type: 'SCALE', model: 'Citizen CG-Series', port: 'COM1', baudRate: 9600, status: 'ONLINE' }
    ]
  }
];

const DEFAULT_RATES = {
  gold24k: 14607.00, // Per gram (₹14,607 / 1g)
  gold22k: 13389.00, // 91.6% purity
  gold18k: 10955.00, // 75.0% purity
  gold14k: 8520.00,  // 58.33% purity
  silver: 229.90,    // 99.9% fine silver per gram
  silver925: 212.66, // 92.5% sterling silver per gram
  mcxGold: 146070.00,
  mcxSilver: 229900.00,
  lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  source: 'MCX Spot Benchmark + Showroom Premium'
};

const INITIAL_CATALOG = [
  {
    id: 'A3-RNG-101',
    barcode: '101001',
    rfidTag: 'E280116060000204A1B2C301',
    name: '22K Floral Diamond Cut Ring',
    category: 'Rings',
    metal: 'Gold',
    purity: '22K',
    purityPercent: 91.67,
    huid: 'HD7891',
    grossWeight: 4.820,
    stoneWeight: 0.200,
    netWeight: 4.620,
    wastagePercent: 3.0,
    makingChargeType: 'PER_GRAM',
    makingChargeRate: 650,
    hallmarkCharge: 45.00,
    trayNo: 'Tray-A04',
    status: 'IN_STOCK',
  },
  {
    id: 'A3-CHN-204',
    barcode: '101002',
    rfidTag: 'E280116060000204A1B2C302',
    name: '22K Classic Hollow Rope Chain',
    category: 'Chains',
    metal: 'Gold',
    purity: '22K',
    purityPercent: 91.67,
    huid: 'KC4429',
    grossWeight: 14.500,
    stoneWeight: 0.000,
    netWeight: 14.500,
    wastagePercent: 2.5,
    makingChargeType: 'PERCENTAGE',
    makingChargeRate: 9.5,
    hallmarkCharge: 45.00,
    trayNo: 'Tray-C01',
    status: 'IN_STOCK',
  },
  {
    id: 'A3-BNG-305',
    barcode: '101003',
    rfidTag: 'E280116060000204A1B2C303',
    name: '22K Antique Filigree Bangle (Single)',
    category: 'Bangles',
    metal: 'Gold',
    purity: '22K',
    purityPercent: 91.67,
    huid: 'BN9812',
    grossWeight: 22.350,
    stoneWeight: 0.450,
    netWeight: 21.900,
    wastagePercent: 3.5,
    makingChargeType: 'PER_GRAM',
    makingChargeRate: 750,
    hallmarkCharge: 45.00,
    trayNo: 'Tray-B02',
    status: 'IN_STOCK',
  },
  {
    id: 'A3-PND-402',
    barcode: '101004',
    rfidTag: 'E280116060000204A1B2C304',
    name: '18K Diamond Solitaire Pendant',
    category: 'Pendants',
    metal: 'Gold',
    purity: '18K',
    purityPercent: 75.00,
    huid: 'PD3301',
    grossWeight: 3.250,
    stoneWeight: 0.350,
    netWeight: 2.900,
    wastagePercent: 2.0,
    makingChargeType: 'FLAT',
    makingChargeRate: 3500,
    diamondCarat: 0.50,
    diamondClarity: 'VVS1',
    diamondColor: 'G-H',
    diamondPrice: 38000,
    hallmarkCharge: 45.00,
    trayNo: 'Tray-D07',
    status: 'IN_STOCK',
  },
  {
    id: 'A3-SLV-501',
    barcode: '101005',
    rfidTag: 'E280116060000204A1B2C305',
    name: '925 Sterling Silver Royal Kada',
    category: 'Silver Articles',
    metal: 'Silver',
    purity: '925',
    purityPercent: 92.50,
    huid: 'SL8840',
    grossWeight: 45.000,
    stoneWeight: 0.000,
    netWeight: 45.000,
    wastagePercent: 0.0,
    makingChargeType: 'PER_GRAM',
    makingChargeRate: 25,
    hallmarkCharge: 0.00,
    trayNo: 'Tray-S01',
    status: 'IN_STOCK',
  }
];

export const TenantProvider = ({ children }) => {
  // Master Client Stores Registry (All registered jewellers)
  const [clientStores, setClientStores] = useState(() => {
    const saved = localStorage.getItem('A3_CLIENT_STORES_REGISTRY');
    return saved ? JSON.parse(saved) : DEFAULT_CLIENT_STORES;
  });

  // Currently selected store ID
  const [activeStoreId, setActiveStoreId] = useState(() => {
    const saved = localStorage.getItem('A3_ACTIVE_STORE_ID');
    return saved || 'JWL-MUM-01';
  });

  // Impersonation state (when platform admin is viewing a specific jeweller's store)
  const [isImpersonating, setIsImpersonating] = useState(() => {
    const saved = localStorage.getItem('A3_IS_IMPERSONATING');
    return saved === 'true';
  });

  // Current active store tenant profile
  const [tenant, setTenant] = useState(() => {
    const saved = localStorage.getItem('A3_TENANT_PROFILE');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const defaultStore = DEFAULT_CLIENT_STORES[0];
    return {
      id: defaultStore.id,
      code: defaultStore.code,
      name: defaultStore.name,
      tradeName: defaultStore.tradeName,
      branch: `${defaultStore.city} Flagship Showroom`,
      city: defaultStore.city,
      state: defaultStore.state,
      address: defaultStore.address,
      phone: defaultStore.phone,
      email: defaultStore.email,
      gstin: defaultStore.gstin,
      bisLicenseNo: defaultStore.bisLicenseNo,
      pan: defaultStore.pan,
      plan: defaultStore.plan,
      planName: defaultStore.planName,
    };
  });

  const [bullionRates, setBullionRates] = useState(() => {
    const saved = localStorage.getItem('A3_BULLION_RATES');
    return saved ? JSON.parse(saved) : DEFAULT_RATES;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('A3_PRODUCTS_CATALOG');
    return saved ? JSON.parse(saved) : INITIAL_CATALOG;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('A3_INVOICE_ARCHIVE');
    return saved ? JSON.parse(saved) : [];
  });

  const [oldGoldVouchers, setOldGoldVouchers] = useState(() => {
    const saved = localStorage.getItem('A3_OLD_GOLD_VOUCHERS');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'URD-2026-0038',
        date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-IN'),
        customerName: 'Smt. Kavita Sharma',
        customerPhone: '+91 98201 54321',
        customerPan: 'ABCPS4521E',
        customerCity: 'Kalbadevi, Mumbai',
        items: [
          { id: 'item-1', name: 'Broken 22K Antique Bangle', metal: 'Gold', grossWeight: 14.250, lessWeight: 0.350, netWeight: 13.900, purityPercent: 88.5, fineWeight: 12.301, rate: 14315, amount: 176088 }
        ],
        totalGross: 14.250,
        totalLess: 0.350,
        totalNet: 13.900,
        totalFine: 12.301,
        totalAmount: 176088,
        settlementMode: 'SHOWROOM_VOUCHER',
        settlementRef: 'VCHR-KVT-8821',
        status: 'REDEEMED',
        remarks: 'Redeemed against Invoice INV-A3-2026-1048'
      },
      {
        id: 'URD-2026-0039',
        date: new Date(Date.now() - 86400000).toLocaleDateString('en-IN'),
        customerName: 'Rajesh Verma',
        customerPhone: '+91 98190 67890',
        customerPan: 'BKRPV7712K',
        customerCity: 'Zaveri Bazaar, Mumbai',
        items: [
          { id: 'item-1', name: 'Old Gold Chain (Broken Links)', metal: 'Gold', grossWeight: 8.400, lessWeight: 0.100, netWeight: 8.300, purityPercent: 75.0, fineWeight: 6.225, rate: 14315, amount: 89110 },
          { id: 'item-2', name: 'Silver Puja Coins (2 pcs)', metal: 'Silver', grossWeight: 20.000, lessWeight: 0.000, netWeight: 20.000, purityPercent: 99.9, fineWeight: 19.980, rate: 229.90, amount: 4593 }
        ],
        totalGross: 28.400,
        totalLess: 0.100,
        totalNet: 28.300,
        totalFine: 26.205,
        totalAmount: 93703,
        settlementMode: 'BANK_TRANSFER',
        settlementRef: 'IMPS/HDFC/629104812',
        status: 'PAID',
        remarks: 'Direct IMPS payout credited to HDFC A/c'
      }
    ];
  });

  const [isBackendOnline, setIsBackendOnline] = useState(false);

  const [currentUser] = useState({
    id: 'EMP-01',
    name: 'Aditya Raj',
    role: 'HEAD_CASHIER',
    counter: 'Counter 01'
  });

  // Save clientStores to LocalStorage
  useEffect(() => {
    localStorage.setItem('A3_CLIENT_STORES_REGISTRY', JSON.stringify(clientStores));
  }, [clientStores]);

  useEffect(() => {
    localStorage.setItem('A3_ACTIVE_STORE_ID', activeStoreId);
  }, [activeStoreId]);

  useEffect(() => {
    localStorage.setItem('A3_IS_IMPERSONATING', isImpersonating ? 'true' : 'false');
  }, [isImpersonating]);

  // Sync to local cache
  useEffect(() => {
    localStorage.setItem('A3_TENANT_PROFILE', JSON.stringify(tenant));
  }, [tenant]);

  useEffect(() => {
    localStorage.setItem('A3_BULLION_RATES', JSON.stringify(bullionRates));
  }, [bullionRates]);

  useEffect(() => {
    localStorage.setItem('A3_PRODUCTS_CATALOG', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('A3_INVOICE_ARCHIVE', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('A3_OLD_GOLD_VOUCHERS', JSON.stringify(oldGoldVouchers));
  }, [oldGoldVouchers]);

  // Switch to a specific jeweller client store (Impersonation Mode)
  const enterStore = useCallback((storeId) => {
    const targetStore = clientStores.find(s => s.id === storeId);
    if (!targetStore) return false;

    setActiveStoreId(storeId);
    setIsImpersonating(true);

    const updatedProfile = {
      id: targetStore.id,
      code: targetStore.code,
      name: targetStore.name,
      tradeName: targetStore.tradeName,
      branch: `${targetStore.city} Branch`,
      city: targetStore.city,
      state: targetStore.state,
      address: targetStore.address,
      phone: targetStore.phone,
      email: targetStore.email,
      gstin: targetStore.gstin,
      bisLicenseNo: targetStore.bisLicenseNo,
      pan: targetStore.pan,
      plan: targetStore.plan,
      planName: targetStore.planName,
    };

    setTenant(updatedProfile);
    localStorage.setItem('A3_TENANT_PROFILE', JSON.stringify(updatedProfile));
    localStorage.setItem('A3_ACTIVE_STORE_ID', storeId);
    localStorage.setItem('A3_IS_IMPERSONATING', 'true');
    return true;
  }, [clientStores]);

  // Exit from store view back to Platform Master Admin
  const exitToMasterAdmin = useCallback(() => {
    setIsImpersonating(false);
    localStorage.setItem('A3_IS_IMPERSONATING', 'false');
  }, []);

  // Register a new Jeweller Client Store
  const registerClientStore = useCallback((newStoreData) => {
    const generatedId = `JWL-${(newStoreData.city || 'IND').slice(0, 3).toUpperCase()}-${(clientStores.length + 1).toString().padStart(2, '0')}`;
    const generatedCode = (newStoreData.name || 'JEWELLER').toUpperCase().replace(/[^A-Z0-9]/g, '-').slice(0, 14);

    const fullStore = {
      id: generatedId,
      code: generatedCode,
      name: newStoreData.name,
      tradeName: newStoreData.tradeName || newStoreData.name,
      ownerName: newStoreData.ownerName,
      phone: newStoreData.phone,
      email: newStoreData.email,
      city: newStoreData.city,
      state: newStoreData.state,
      address: newStoreData.address,
      gstin: newStoreData.gstin || '27AABCJ0000Z1Z1',
      bisLicenseNo: newStoreData.bisLicenseNo || 'HM/C-0000000',
      pan: newStoreData.pan || 'AABCJ0000Z',
      plan: newStoreData.plan || 'GOLD_SHOWROOM',
      planName: newStoreData.plan === 'DIAMOND_ENTERPRISE' ? 'Diamond Enterprise Plan' :
                newStoreData.plan === 'SILVER_RETAIL' ? 'Silver Retail Plan' :
                newStoreData.plan === 'FREE_TRIAL' ? '14-Day Free Trial' : 'Gold Showroom Plan',
      annualFee: newStoreData.plan === 'DIAMOND_ENTERPRISE' ? 120000 :
                 newStoreData.plan === 'SILVER_RETAIL' ? 24000 :
                 newStoreData.plan === 'FREE_TRIAL' ? 0 : 48000,
      subscriptionStatus: newStoreData.plan === 'FREE_TRIAL' ? 'TRIAL' : 'ACTIVE',
      subscriptionStart: new Date().toISOString().split('T')[0],
      subscriptionExpiry: new Date(Date.now() + (newStoreData.plan === 'FREE_TRIAL' ? 14 : 365) * 86400000).toISOString().split('T')[0],
      daysRemaining: newStoreData.plan === 'FREE_TRIAL' ? 14 : 365,
      maxCounters: Number(newStoreData.maxCounters || 3),
      activeCounters: 1,
      metrics: {
        todaySales: 0,
        todayBills: 0,
        todayGoldWeight: 0.000,
        totalStockPieces: 50,
        totalStockGoldGrams: 350.00
      },
      hardwareTerminals: [
        { id: `TERM-${generatedId}-01`, name: 'Counter 1 Precision Scale', type: 'SCALE', model: 'Essae 0.01g', port: 'COM1', baudRate: 9600, status: 'ONLINE' },
        { id: `TERM-${generatedId}-02`, name: 'Jewellery Tag Printer', type: 'PRINTER', model: 'Zebra ZD220', port: 'USB001', status: 'ONLINE' }
      ]
    };

    setClientStores(prev => [fullStore, ...prev]);
    return { success: true, store: fullStore };
  }, [clientStores.length]);

  // Update client store subscription plan
  const updateStorePlan = useCallback((storeId, newPlan, validityDays = 365) => {
    setClientStores(prev => prev.map(s => {
      if (s.id !== storeId) return s;
      const fee = newPlan === 'DIAMOND_ENTERPRISE' ? 120000 :
                  newPlan === 'SILVER_RETAIL' ? 24000 :
                  newPlan === 'FREE_TRIAL' ? 0 : 48000;
      const planName = newPlan === 'DIAMOND_ENTERPRISE' ? 'Diamond Enterprise Plan' :
                       newPlan === 'SILVER_RETAIL' ? 'Silver Retail Plan' :
                       newPlan === 'FREE_TRIAL' ? '14-Day Free Trial' : 'Gold Showroom Plan';

      return {
        ...s,
        plan: newPlan,
        planName,
        annualFee: fee,
        subscriptionStatus: 'ACTIVE',
        subscriptionStart: new Date().toISOString().split('T')[0],
        subscriptionExpiry: new Date(Date.now() + validityDays * 86400000).toISOString().split('T')[0],
        daysRemaining: validityDays
      };
    }));
  }, []);

  // Toggle store status (ACTIVE <-> SUSPENDED)
  const toggleStoreStatus = useCallback((storeId) => {
    setClientStores(prev => prev.map(s => {
      if (s.id !== storeId) return s;
      const newStatus = s.subscriptionStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
      return { ...s, subscriptionStatus: newStatus };
    }));
  }, []);

  // Fetch Products Catalog from Live Backend
  const reloadCatalog = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/products?status=ALL`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const normalized = json.data.map(p => ({
            ...p,
            grossWeight: parseFloat(p.grossWeight || 0),
            netWeight: parseFloat(p.netWeight || 0),
            stoneWeight: parseFloat(p.stoneWeight || 0),
            purityPercent: parseFloat(p.purityPercent || 91.67),
            makingChargeRate: parseFloat(p.makingChargeRate || 0),
            hallmarkCharge: parseFloat(p.hallmarkCharge || 0),
            wastagePercent: parseFloat(p.wastagePercent || 0)
          }));
          setProducts(normalized);
          return normalized;
        }
      }
    } catch (err) {
      console.warn('[TENANT_CONTEXT] Using local cached catalog.');
    }
    return products;
  }, [products]);

  // Fetch Invoices
  const reloadInvoices = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/billing/invoices`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setInvoices(json.data);
          return json.data;
        }
      }
    } catch (err) {
      console.warn('[TENANT_CONTEXT] Using local cached invoices.');
    }
    return invoices;
  }, [invoices]);

  // Check Backend Health
  const reloadTenant = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const json = await res.json();
        setIsBackendOnline(json.status === 'ONLINE');
      } else {
        setIsBackendOnline(false);
      }
    } catch (err) {
      setIsBackendOnline(false);
    }
  }, []);

  // Initialize
  useEffect(() => {
    reloadTenant();
    reloadCatalog();
    reloadInvoices();
  }, [reloadTenant, reloadCatalog, reloadInvoices]);

  // Mutators
  const updateTenant = (updatedFields) => {
    setTenant(prev => {
      const merged = { ...prev, ...updatedFields };
      return merged;
    });
  };

  const updateRates = (newRates) => {
    setBullionRates(prev => ({
      ...prev,
      ...newRates,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }));
  };

  const addProduct = async (productData) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const json = await res.json();
      if (json.success && json.data) {
        const normalized = {
          ...json.data,
          grossWeight: parseFloat(json.data.grossWeight || 0),
          netWeight: parseFloat(json.data.netWeight || 0),
          stoneWeight: parseFloat(json.data.stoneWeight || 0),
          purityPercent: parseFloat(json.data.purityPercent || 91.67),
          makingChargeRate: parseFloat(json.data.makingChargeRate || 0),
          hallmarkCharge: parseFloat(json.data.hallmarkCharge || 0),
          wastagePercent: parseFloat(json.data.wastagePercent || 0)
        };
        setProducts(prev => [normalized, ...prev]);
        return { success: true, data: normalized };
      }
      return { success: false, message: json.message };
    } catch (err) {
      // Local fallback
      const localItem = {
        id: `A3-${Date.now().toString().slice(-4)}`,
        ...productData,
        status: 'IN_STOCK'
      };
      setProducts(prev => [localItem, ...prev]);
      return { success: true, data: localItem };
    }
  };

  const markProductSold = (productId, invoiceNo) => {
    setProducts(prev => prev.map(item => 
      item.id === productId || item.barcode === productId
        ? { ...item, status: 'SOLD', soldInvoiceNo: invoiceNo, soldAt: new Date().toISOString() }
        : item
    ));
  };

  // Record completed sale invoice
  const recordOldGoldVouchers = (voucher) => {
    setOldGoldVouchers(prev => [voucher, ...prev]);
    return { success: true, data: voucher };
  };

  const updateOldGoldVoucherStatus = (id, status) => {
    setOldGoldVouchers(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  const recordInvoice = async (newInvoice) => {
    try {
      const res = await fetch(`${API_BASE}/billing/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice)
      });
      const json = await res.json();
      if (json.success && json.data) {
        setInvoices(prev => [json.data, ...prev]);
        reloadCatalog();
        return { success: true, data: json.data };
      }
      return { success: false, message: json.message };
    } catch (err) {
      // Local fallback
      setInvoices(prev => [newInvoice, ...prev]);
      return { success: true, data: newInvoice };
    }
  };

  // Find currently active store details
  const activeStore = clientStores.find(s => s.id === activeStoreId) || clientStores[0];

  return (
    <TenantContext.Provider
      value={{
        // Client stores registry & multi-tenancy
        clientStores,
        activeStoreId,
        activeStore,
        isImpersonating,
        enterStore,
        exitToMasterAdmin,
        registerClientStore,
        updateStorePlan,
        toggleStoreStatus,
        // Individual store tenant data
        tenant,
        updateTenant,
        currentUser,
        bullionRates,
        updateRates,
        products,
        addProduct,
        markProductSold,
        invoices,
        recordInvoice,
        oldGoldVouchers,
        recordOldGoldVoucher: recordOldGoldVouchers,
        updateOldGoldVoucherStatus,
        reloadCatalog,
        reloadInvoices,
        reloadTenant,
        isBackendOnline
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
