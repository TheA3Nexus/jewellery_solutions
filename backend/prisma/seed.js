const prisma = require('../src/utils/prisma');

async function main() {
  console.log('[SEED] Seeding default store profile into GoDaddy MySQL...');

  // 1. Default Tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'A3_JEWELLERY_01' },
    update: {},
    create: {
      id: 'A3_JEWELLERY_01',
      name: 'A3 Diamond & Gold Showroom',
      tradeName: 'A3 Jewellery Solutions Pvt Ltd',
      branch: 'Flagship Showroom (Counter 01)',
      city: 'Mumbai',
      address: 'Shop 12-14, Zaveri Bazaar, Kalbadevi, Mumbai - 400002',
      phone: '+91 98200 12345',
      email: 'billing@a3jewellery.com',
      gstin: '27AABCJ1234F1Z8',
      pan: 'AABCJ1234F',
      bisLicenseNo: 'HM/C-7821940',
      moneyLendingLicense: 'MH/ML-2024/99120',
      bankName: 'HDFC Bank Ltd',
      accountNumber: '50200088992211',
      ifscCode: 'HDFC0000123',
      upiVpa: 'a3jewellers@hdfcbank'
    }
  });

  // 2. Default User
  await prisma.user.upsert({
    where: { email: 'billing@a3jewellery.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Aditya Raj',
      email: 'billing@a3jewellery.com',
      phone: '+91 98200 12345',
      passwordHash: '$2a$10$hashed_password_mock',
      role: 'ADMIN',
      isActive: true
    }
  });

  // 3. Initial Products
  const sampleProducts = [
    {
      barcode: '101001',
      rfidTag: 'E280116060000204A1B2C301',
      name: '22K Floral Diamond Cut Ring',
      category: 'Rings',
      metal: 'Gold',
      purity: '22K',
      purityPercent: 91.67,
      huid: 'HD7891',
      grossWeight: 4.8200,
      stoneWeight: 0.2000,
      netWeight: 4.6200,
      wastagePercent: 3.0,
      makingChargeType: 'PER_GRAM',
      makingChargeRate: 650.00,
      hallmarkCharge: 45.00,
      trayNo: 'Tray-A04',
      status: 'IN_STOCK'
    },
    {
      barcode: '101002',
      rfidTag: 'E280116060000204A1B2C302',
      name: '22K Classic Hollow Rope Chain',
      category: 'Chains',
      metal: 'Gold',
      purity: '22K',
      purityPercent: 91.67,
      huid: 'HD4421',
      grossWeight: 18.5000,
      stoneWeight: 0.0000,
      netWeight: 18.5000,
      wastagePercent: 2.5,
      makingChargeType: 'PER_GRAM',
      makingChargeRate: 450.00,
      hallmarkCharge: 45.00,
      trayNo: 'Tray-B01',
      status: 'IN_STOCK'
    },
    {
      barcode: '101003',
      rfidTag: 'E280116060000204A1B2C303',
      name: '18K Diamond Solitaire Halo Ring',
      category: 'Rings',
      metal: 'Gold',
      purity: '18K',
      purityPercent: 75.00,
      huid: 'HD9902',
      grossWeight: 3.8500,
      stoneWeight: 0.4500,
      netWeight: 3.4000,
      wastagePercent: 0.0,
      makingChargeType: 'FLAT',
      makingChargeRate: 3500.00,
      hallmarkCharge: 45.00,
      trayNo: 'Tray-D02',
      status: 'IN_STOCK'
    },
    {
      barcode: '101004',
      rfidTag: 'E280116060000204A1B2C304',
      name: '22K Traditional Peacock Choker Necklace',
      category: 'Necklaces',
      metal: 'Gold',
      purity: '22K',
      purityPercent: 91.67,
      huid: 'HD3310',
      grossWeight: 42.1500,
      stoneWeight: 2.1000,
      netWeight: 40.0500,
      wastagePercent: 4.0,
      makingChargeType: 'PERCENTAGE',
      makingChargeRate: 12.00,
      hallmarkCharge: 45.00,
      trayNo: 'Tray-N05',
      status: 'IN_STOCK'
    },
    {
      barcode: '101005',
      rfidTag: 'E280116060000204A1B2C305',
      name: '925 Sterling Silver Royal Kada',
      category: 'Silver Articles',
      metal: 'Silver',
      purity: '925',
      purityPercent: 92.50,
      huid: 'SL8840',
      grossWeight: 45.0000,
      stoneWeight: 0.0000,
      netWeight: 45.0000,
      wastagePercent: 0.0,
      makingChargeType: 'PER_GRAM',
      makingChargeRate: 25.00,
      hallmarkCharge: 0.00,
      trayNo: 'Tray-S01',
      status: 'IN_STOCK'
    }
  ];

  for (const item of sampleProducts) {
    await prisma.product.upsert({
      where: { barcode: item.barcode },
      update: {},
      create: {
        tenantId: tenant.id,
        ...item
      }
    });
  }

  // 4. Sample Karigars
  const sampleKarigars = [
    {
      id: 'KRG-01',
      name: 'Babu Lal Goldsmith',
      specialization: 'Handmade Bridal & Antique Kundan',
      workshopCity: 'Rajkot, Gujarat',
      phone: '+91 98250 11223',
      metalBalanceGrams: 42.4500,
      laborBalanceRupees: 18500.00,
      allowedGhatRate: 2.50
    },
    {
      id: 'KRG-02',
      name: 'Gopal Verma (V.G. Chains)',
      specialization: 'Hollow Chains & Italian Casting',
      workshopCity: 'Coimbatore, TN',
      phone: '+91 94431 88990',
      metalBalanceGrams: 115.8000,
      laborBalanceRupees: 42000.00,
      allowedGhatRate: 1.80
    }
  ];

  for (const k of sampleKarigars) {
    await prisma.karigarAccount.upsert({
      where: { id: k.id },
      update: {},
      create: {
        tenantId: tenant.id,
        ...k
      }
    });
  }

  console.log('[SEED] Seeding completed successfully in GoDaddy MySQL!');
}

main()
  .catch((e) => {
    console.error('[SEED ERROR]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
