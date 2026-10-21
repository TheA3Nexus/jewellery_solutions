import React, { createContext, useContext, useState, useEffect } from 'react';

const TenantContext = createContext(null);

const DEFAULT_TENANT = {
  id: 'A3_JEWELLERY_01',
  name: 'A3 Diamond & Gold Showroom',
  tradeName: 'A3 Jewellery Solutions Pvt Ltd',
  branch: 'Flagship Showroom (Counter 01)',
  city: 'Mumbai',
  address: 'Shop 12-14, Zaveri Bazaar, Kalbadevi, Mumbai - 400002',
  phone: '+91 98200 12345',
  email: 'billing@a3jewellery.com',
  gstin: '27AABCJ1234F1Z8',
  bisLicenseNo: 'HM/C-7821940',
  pan: 'AABCJ1234F',
};

const DEFAULT_RATES = {
  gold24k: 7850.00, // Per gram (₹78,500 / 10g)
  gold22k: 7196.00, // 91.6% purity
  gold18k: 5888.00, // 75.0% purity
  gold14k: 4579.00, // 58.33% purity
  silver: 96.50,    // 99.9% fine silver per gram
  silver925: 89.26, // 92.5% sterling silver per gram
  mcxGold: 78240.00,
  mcxSilver: 96150.00,
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
    makingChargeRate: 650, // ₹650 per gram
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
    makingChargeRate: 9.5, // 9.5%
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
  const [tenant, setTenant] = useState(() => {
    const saved = localStorage.getItem('A3_TENANT_PROFILE');
    return saved ? JSON.parse(saved) : DEFAULT_TENANT;
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

  const [currentUser] = useState({
    id: 'EMP-01',
    name: 'Aditya Raj',
    role: 'HEAD_CASHIER',
    counter: 'Counter 01'
  });

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

  // Live Bullion Rates Sync with Backend 5-Minute Scraper & WebSocket
  useEffect(() => {
    fetch('http://localhost:5000/api/v1/rates/live')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setBullionRates((prev) => ({
            ...prev,
            ...json.data
          }));
        }
      })
      .catch(() => {});

    let ws;
    try {
      ws = new WebSocket('ws://localhost:5000/ws/rates');
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.data) {
            setBullionRates((prev) => ({
              ...prev,
              ...message.data
            }));
          }
        } catch (e) {}
      };
    } catch (e) {}

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const updateTenant = (updates) => {
    setTenant(prev => ({
      ...prev,
      ...updates
    }));
  };

  const updateRates = (newRates) => {
    setBullionRates(prev => ({
      ...prev,
      ...newRates,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }));
  };

  const markProductSold = (productId, invoiceNo) => {
    setProducts(prev => prev.map(item => 
      item.id === productId 
        ? { ...item, status: 'SOLD', soldInvoiceNo: invoiceNo, soldAt: new Date().toISOString() }
        : item
    ));
  };

  const recordInvoice = (newInvoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
  };

  return (
    <TenantContext.Provider
      value={{
        tenant,
        updateTenant,
        currentUser,
        bullionRates,
        updateRates,
        products,
        markProductSold,
        invoices,
        recordInvoice
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