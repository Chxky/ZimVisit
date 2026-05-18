import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

// Entities
import { User } from './modules/users/entities/user.entity';
import { UserRole } from './common/interfaces/user-role.enum';
import { Operator, OperatorStatus } from './modules/operators/entities/operator.entity';
import { Booking } from './modules/bookings/entities/booking.entity';
import { BookingStatus } from './modules/bookings/dto/booking-status.enum';
import { BookingItem } from './modules/bookings/entities/booking-item.entity';
import { Payment, PaymentProvider, PaymentStatus } from './modules/payments/entities/payment.entity';
import { ComplianceReport, ComplianceStatus } from './modules/compliance/entities/compliance-report.entity';

// ─── Helpers ────────────────────────────────────────────────────────────────

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRef(prefix: string, length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}${result}`;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomDateString(start: Date, end: Date): string {
  return randomDate(start, end).toISOString().split('T')[0];
}

// ─── Data Sources ───────────────────────────────────────────────────────────

const tourNames = [
  'Victoria Falls Guided Tour', 'Zambezi River Sunset Cruise', 'Hwange Game Drive',
  'Mana Pools Walking Safari', 'Great Zimbabwe Historical Tour', 'Lake Kariba Houseboat Trip',
  'Eastern Highlands Hiking Adventure', 'Matobo Hills Rock Art Tour', 'Chimanimani Mountain Trek',
  'Nyanga National Park Expedition', 'Gonarezhou Wildlife Safari', 'Lake Chivero Day Trip',
  'Harare City Cultural Tour', 'Bulawayo Heritage Walk', 'Masvingo Ruins Experience',
  'Bungee Jumping Victoria Falls', 'White Water Rafting Zambezi', 'Helicopter Flight over Falls',
  'Elephant Back Safari', 'Lion Encounter Victoria Falls', 'Crocodile Farm Tour',
  'Treetop Canopy Walk', 'Night Game Drive Hwange', 'Bird Watching Mana Pools',
  'Fishing Safari Lake Kariba', 'Quad Biking Victoria Falls', 'Horseback Safari',
  'Painted Dog Conservation Visit', 'Chinhoyi Caves Exploration', 'Tengenenge Art Community',
];

const hotelNames = [
  'Victoria Falls Hotel', 'Ilala Lodge', 'The Kingdom Hotel', 'Elephant Hills Resort',
  'Hwange Safari Lodge', 'Somalisa Camp', 'Mana Pools Safari Lodge', 'Ruckomechi Camp',
  'Great Zimbabwe Hotel', 'Norma Jeans Lake Resort', 'Troutbeck Inn', 'Inn on Rupurara',
  'Chilo Gorge Safari Lodge', 'Camp Amalinda', 'Big Cave Camp', 'Matobo Hills Lodge',
  'Humani Lodge', 'Chilojo Lodge', 'Nyanga Gardens Lodge', 'White Horse Inn',
  'Meikles Hotel', 'Bronte Hotel', 'Cresta Lodge Harare', 'Rainbow Towers Hotel',
  'Bulawayo Club', 'Nesbitt Castle', 'Caribbea Bay Resort', 'Chrismar Hotel Kariba',
];

const addresses = [
  '12 Livingstone Way', '45 Robert Mugabe Road', '78 Samora Machel Ave',
  '23 Nelson Mandela Drive', '56 Kwame Nkrumah Ave', '90 Leopold Takawira St',
  '34 Jason Moyo Ave', '67 Herbert Chitepo St', '11 Julius Nyerere Way',
  '88 Josiah Tongogara Ave', '22 Sam Nujoma St', '55 Borrowdale Road',
  '77 Churchill Ave', '33 Angwa Street', '99 Speke Avenue',
];

// ─── Main Seed Function ─────────────────────────────────────────────────────

async function seed() {
  console.log('='.repeat(60));
  console.log('  ZimVisit Database Seed Script');
  console.log('='.repeat(60));
  console.log();

  // Create DataSource matching app.module.ts SQLite config
  const dataSource = new DataSource({
    type: 'sqljs',
    location: 'data/zimvisit.db',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
    autoSave: true,
  } as any);

  await dataSource.initialize();
  console.log('[OK] Database connection initialized');
  console.log();

  // ─── Clear existing data (idempotent) ───────────────────────────────────
  console.log('Clearing existing data...');
  const complianceRepo = dataSource.getRepository(ComplianceReport);
  const paymentRepo = dataSource.getRepository(Payment);
  const bookingItemRepo = dataSource.getRepository(BookingItem);
  const bookingRepo = dataSource.getRepository(Booking);
  const operatorRepo = dataSource.getRepository(Operator);
  const userRepo = dataSource.getRepository(User);

  await complianceRepo.clear();
  await paymentRepo.clear();
  await bookingItemRepo.clear();
  await bookingRepo.clear();
  await operatorRepo.clear();
  await userRepo.clear();
  console.log('[OK] Existing data cleared');
  console.log();

  // ─── Seed Users ─────────────────────────────────────────────────────────
  console.log('Seeding users...');
  const hashedPassword = await bcrypt.hash('demo123', 10);

  const usersData = [
    { email: 'admin@zimvisit.com', fullName: 'Tendai Moyo', role: UserRole.SYSTEM_ADMIN, phone: '+263 77 100 0001' },
    { email: 'zta@zta.gov.zw', fullName: 'Grace Ncube', role: UserRole.ZTA_OFFICIAL, phone: '+263 77 100 0002' },
    { email: 'zimra@zimra.gov.zw', fullName: 'James Mudzuri', role: UserRole.ZIMRA_OFFICIAL, phone: '+263 77 100 0003' },
    { email: 'operator@wildhorizons.co.zw', fullName: 'Sarah Banda', role: UserRole.OPERATOR_ADMIN, phone: '+263 77 100 0004', operatorId: 'op-1' },
    { email: 'operator@africansafari.co.zw', fullName: 'David Muponda', role: UserRole.OPERATOR_ADMIN, phone: '+263 77 100 0005', operatorId: 'op-2' },
    { email: 'traveler@gmail.com', fullName: 'Emma Williams', role: UserRole.TRAVELER, phone: '+263 77 200 0001' },
    { email: 'traveler2@gmail.com', fullName: 'John Smith', role: UserRole.TRAVELER, phone: '+263 77 200 0002' },
  ];

  const users: User[] = [];
  for (const data of usersData) {
    const user = userRepo.create({
      id: crypto.randomUUID(),
      email: data.email,
      fullName: data.fullName,
      password: hashedPassword,
      role: data.role,
      phone: data.phone,
      isActive: true,
      operatorId: data.operatorId || undefined,
      metadata: {},
      preferences: { currency: 'USD', language: 'en' },
    });
    users.push(await userRepo.save(user));
  }
  console.log(`  Created ${users.length} users`);

  // Identify traveler users for booking assignment
  const travelerUsers = users.filter(u => u.role === UserRole.TRAVELER);
  console.log();

  // ─── Seed Operators ─────────────────────────────────────────────────────
  console.log('Seeding operators...');

  const operatorsData = [
    { name: 'Wild Horizons', city: 'Victoria Falls', complianceRate: 95, riskScore: 12, status: OperatorStatus.ACTIVE },
    { name: 'African Safari Co', city: 'Harare', complianceRate: 88, riskScore: 25, status: OperatorStatus.ACTIVE },
    { name: 'Victoria Falls Adventures', city: 'Victoria Falls', complianceRate: 92, riskScore: 18, status: OperatorStatus.ACTIVE },
    { name: 'Zambezi Explorer', city: 'Kariba', complianceRate: 85, riskScore: 30, status: OperatorStatus.ACTIVE },
    { name: 'Hwange Safari Lodge', city: 'Hwange', complianceRate: 97, riskScore: 10, status: OperatorStatus.ACTIVE },
    { name: 'Mana Pools Expeditions', city: 'Karoi', complianceRate: 78, riskScore: 45, status: OperatorStatus.ACTIVE },
    { name: 'Great Zimbabwe Tours', city: 'Masvingo', complianceRate: 82, riskScore: 35, status: OperatorStatus.ACTIVE },
    { name: 'Kariba Houseboat Co', city: 'Kariba', complianceRate: 90, riskScore: 20, status: OperatorStatus.ACTIVE },
    { name: 'Eastern Highlands Treks', city: 'Mutare', complianceRate: 75, riskScore: 50, status: OperatorStatus.ACTIVE },
    { name: 'Matobo Hills Safari', city: 'Bulawayo', complianceRate: 88, riskScore: 28, status: OperatorStatus.ACTIVE },
    { name: 'Chimanimani Adventures', city: 'Mutare', complianceRate: 70, riskScore: 55, status: OperatorStatus.ACTIVE },
    { name: 'Nyanga Mountain Lodge', city: 'Mutare', complianceRate: 93, riskScore: 15, status: OperatorStatus.ACTIVE },
    { name: 'Gonarezhou Wildlife', city: 'Chiredzi', complianceRate: 80, riskScore: 40, status: OperatorStatus.ACTIVE },
    { name: 'Lake Chivero Resort', city: 'Harare', complianceRate: 65, riskScore: 60, status: OperatorStatus.ACTIVE },
    { name: 'Harare City Tours', city: 'Harare', complianceRate: 91, riskScore: 22, status: OperatorStatus.ACTIVE },
    { name: 'Bulawayo Heritage', city: 'Bulawayo', complianceRate: 86, riskScore: 32, status: OperatorStatus.ACTIVE },
    { name: 'Masvingo Cultural', city: 'Masvingo', complianceRate: 72, riskScore: 48, status: OperatorStatus.ACTIVE },
    { name: 'Zvishavane Eco-Tourism', city: 'Gweru', complianceRate: 60, riskScore: 70, status: OperatorStatus.ACTIVE },
    { name: 'Chinhoyi Caves Tour', city: 'Chinhoyi', complianceRate: 84, riskScore: 38, status: OperatorStatus.ACTIVE },
    { name: 'Matusadona Safari', city: 'Kariba', complianceRate: 99, riskScore: 10, status: OperatorStatus.ACTIVE },
  ];

  const operators: Operator[] = [];
  for (let i = 0; i < operatorsData.length; i++) {
    const data = operatorsData[i];
    const op = operatorRepo.create({
      id: crypto.randomUUID(),
      name: data.name,
      businessName: `${data.name} (Pvt) Ltd`,
      email: `info@${data.name.toLowerCase().replace(/[^a-z]/g, '')}.co.zw`,
      phone: `+263 ${randomInt(71, 78)} ${randomInt(100, 999)} ${randomInt(1000, 9999)}`,
      address: addresses[i % addresses.length],
      city: data.city,
      country: 'Zimbabwe',
      licenseNumber: `ZTA-${String(2024000 + i).padStart(7, '0')}`,
      taxId: `TIN-${randomInt(10000000, 99999999)}`,
      status: data.status,
      complianceRate: data.complianceRate,
      riskScore: data.riskScore,
      bspConnected: Math.random() > 0.15,
      bspReference: Math.random() > 0.15 ? `BSP-${randomInt(10000, 99999)}` : undefined,
      paymentProviders: ['ecocash', 'paynow'],
      settings: {},
      metadata: {},
      verifiedAt: data.status === OperatorStatus.ACTIVE ? randomDate(new Date('2024-01-01'), new Date('2025-06-01')) : undefined,
    });
    operators.push(await operatorRepo.save(op));
  }
  console.log(`  Created ${operators.length} operators`);
  console.log();

  // ─── Seed Bookings ──────────────────────────────────────────────────────
  console.log('Seeding bookings...');

  const statusDistribution: BookingStatus[] = [
    ...Array(120).fill(BookingStatus.CONFIRMED),    // 60%
    ...Array(50).fill(BookingStatus.COMPLETED),      // 25%
    ...Array(20).fill(BookingStatus.PENDING),        // 10%
    ...Array(10).fill(BookingStatus.CANCELLED),      // 5%
  ];

  const bookings: Booking[] = [];
  const bookingItems: BookingItem[] = [];

  for (let i = 0; i < 200; i++) {
    const status = statusDistribution[i];
    const traveler = randomPick(travelerUsers);
    const operator = randomPick(operators);
    const totalAmount = randomFloat(50, 2000);
    const taxAmount = parseFloat((totalAmount * 0.15).toFixed(2));
    const levyAmount = parseFloat((totalAmount * 0.02).toFixed(2));
    const platformFee = parseFloat((totalAmount * 0.03).toFixed(2));
    const netAmount = parseFloat((totalAmount - taxAmount - levyAmount - platformFee).toFixed(2));

    const checkIn = randomDateString(new Date('2025-01-01'), new Date('2026-12-31'));
    const checkOutDate = new Date(checkIn);
    checkOutDate.setDate(checkOutDate.getDate() + randomInt(1, 7));

    const booking = bookingRepo.create({
      id: crypto.randomUUID(),
      bookingReference: generateRef('ZV-'),
      userId: traveler.id,
      operatorId: operator.id,
      status,
      totalAmount,
      taxAmount,
      levyAmount,
      platformFee,
      netAmount,
      currency: 'USD',
      checkIn,
      checkOut: checkOutDate.toISOString().split('T')[0],
      travelerDetails: {
        name: traveler.fullName,
        email: traveler.email,
        nationality: randomPick(['Zimbabwean', 'South African', 'British', 'American', 'German', 'Australian', 'Canadian']),
        passportNumber: `AB${randomInt(1000000, 9999999)}`,
      },
      metadata: {},
      isCompliant: status === BookingStatus.COMPLETED ? Math.random() > 0.3 : false,
      paidAt: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED].includes(status)
        ? randomDate(new Date('2024-06-01'), new Date('2026-05-01'))
        : undefined,
      confirmedAt: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED].includes(status)
        ? randomDate(new Date('2024-06-01'), new Date('2026-05-01'))
        : undefined,
      cancelledAt: status === BookingStatus.CANCELLED
        ? randomDate(new Date('2024-06-01'), new Date('2026-05-01'))
        : undefined,
    });
    const savedBooking = await bookingRepo.save(booking);
    bookings.push(savedBooking);

    // Create 1-3 booking items per booking
    const numItems = randomInt(1, 3);
    let remainingAmount = totalAmount;
    for (let j = 0; j < numItems; j++) {
      const isLast = j === numItems - 1;
      const itemPrice = isLast ? remainingAmount : parseFloat((totalAmount / numItems).toFixed(2));
      remainingAmount -= itemPrice;

      const isHotel = Math.random() > 0.4;
      const itemName = isHotel ? randomPick(hotelNames) : randomPick(tourNames);

      const item = bookingItemRepo.create({
        id: crypto.randomUUID(),
        bookingId: savedBooking.id,
        itemType: isHotel ? 'hotel' : 'tour',
        itemId: `item-${randomInt(1000, 9999)}`,
        itemName,
        description: isHotel
          ? `${randomInt(1, 5)} night stay at ${itemName}`
          : `Guided ${itemName} experience`,
        startDate: checkIn,
        endDate: checkOutDate.toISOString().split('T')[0],
        price: itemPrice,
        tax: parseFloat((itemPrice * 0.15).toFixed(2)),
        quantity: isHotel ? randomInt(1, 3) : randomInt(1, 6),
        providerDetails: { operatorName: operator.name },
        gdsData: {},
        addons: {},
      });
      bookingItems.push(await bookingItemRepo.save(item));
    }
  }
  console.log(`  Created ${bookings.length} bookings`);
  console.log(`  Created ${bookingItems.length} booking items`);
  console.log();

  // ─── Seed Payments ──────────────────────────────────────────────────────
  console.log('Seeding payments...');

  const providerDistribution: PaymentProvider[] = [
    ...Array(72).fill(PaymentProvider.ECOCASH),  // 40%
    ...Array(54).fill(PaymentProvider.PAYNOW),    // 30%
    ...Array(36).fill(PaymentProvider.STRIPE),    // 20%
    ...Array(18).fill(PaymentProvider.CARD),      // 10%
  ];

  const paymentStatusDistribution: PaymentStatus[] = [
    ...Array(153).fill(PaymentStatus.SUCCESS),   // 85%
    ...Array(18).fill(PaymentStatus.PENDING),     // 10%
    ...Array(9).fill(PaymentStatus.FAILED),       // 5%
  ];

  // Only create payments for bookings that have been paid
  const payableBookings = bookings.filter(b =>
    [BookingStatus.CONFIRMED, BookingStatus.COMPLETED].includes(b.status)
  );

  const payments: Payment[] = [];
  const numPayments = Math.min(180, payableBookings.length);

  for (let i = 0; i < numPayments; i++) {
    const booking = payableBookings[i];
    const provider = providerDistribution[i % providerDistribution.length];
    const status = paymentStatusDistribution[i % paymentStatusDistribution.length];

    const txPrefix = provider === PaymentProvider.ECOCASH ? 'ECO-'
      : provider === PaymentProvider.PAYNOW ? 'PN-'
      : provider === PaymentProvider.STRIPE ? 'STR-'
      : 'CRD-';

    const payment = paymentRepo.create({
      id: crypto.randomUUID(),
      bookingId: booking.id,
      transactionReference: generateRef(txPrefix),
      provider,
      status,
      amount: booking.totalAmount,
      fees: parseFloat((booking.totalAmount * 0.025).toFixed(2)),
      currency: 'USD',
      providerReference: `${provider.toUpperCase()}-${randomInt(100000, 999999)}`,
      providerStatus: status === PaymentStatus.SUCCESS ? 'completed'
        : status === PaymentStatus.PENDING ? 'processing'
        : 'declined',
      providerResponse: {
        code: status === PaymentStatus.SUCCESS ? '00' : '51',
        message: status === PaymentStatus.SUCCESS ? 'Transaction successful' : 'Transaction declined',
      },
      metadata: {},
      paidAt: status === PaymentStatus.SUCCESS ? booking.paidAt : undefined,
    });
    payments.push(await paymentRepo.save(payment));
  }
  console.log(`  Created ${payments.length} payments`);
  console.log();

  // ─── Seed Compliance Reports ────────────────────────────────────────────
  console.log('Seeding compliance reports...');

  const complianceStatusDistribution: ComplianceStatus[] = [
    ...Array(98).fill(ComplianceStatus.COMPLIANT),       // 65%
    ...Array(23).fill(ComplianceStatus.NON_COMPLIANT),    // 15%
    ...Array(18).fill(ComplianceStatus.PENDING_REVIEW),   // 12%
    ...Array(11).fill(ComplianceStatus.FLAGGED),          // 8%
  ];

  const complianceFlags = [
    'Missing tax documentation',
    'Incorrect levy calculation',
    'Late tax remittance',
    'Unlicensed tour operation',
    'Overdue BSP reconciliation',
    'Invalid operator registration',
    'Incomplete traveler information',
    'Unauthorized payment channel',
    'Mismatched booking reference',
    'Exceeded daily transaction limit',
  ];

  const reports: ComplianceReport[] = [];
  const numReports = Math.min(150, bookings.length);

  for (let i = 0; i < numReports; i++) {
    const booking = bookings[i];
    const status = complianceStatusDistribution[i % complianceStatusDistribution.length];
    const operator = operators.find(op => op.id === booking.operatorId);

    const report = complianceRepo.create({
      id: crypto.randomUUID(),
      bookingId: booking.id,
      operatorId: booking.operatorId,
      status,
      isCompliant: status === ComplianceStatus.COMPLIANT,
      levyAmount: parseFloat((booking.totalAmount * 0.02).toFixed(2)),
      vatAmount: parseFloat((booking.totalAmount * 0.15).toFixed(2)),
      bspFee: parseFloat((booking.totalAmount * 0.03).toFixed(2)),
      bspRouted: Math.random() > 0.2,
      bspReference: `BSP-RPT-${randomInt(10000, 99999)}`,
      taxesRemitted: status === ComplianceStatus.COMPLIANT,
      levyRemitted: status === ComplianceStatus.COMPLIANT,
      auditTrail: {
        checkedAt: new Date().toISOString(),
        checkedBy: 'system',
        operatorComplianceRate: operator?.complianceRate || 0,
        operatorRiskScore: operator?.riskScore || 0,
      },
      flags: status === ComplianceStatus.NON_COMPLIANT || status === ComplianceStatus.FLAGGED
        ? [randomPick(complianceFlags), ...(Math.random() > 0.5 ? [randomPick(complianceFlags)] : [])]
        : [],
      metadata: {},
      reviewedAt: [ComplianceStatus.COMPLIANT, ComplianceStatus.NON_COMPLIANT].includes(status)
        ? randomDate(new Date('2024-06-01'), new Date('2026-05-01'))
        : undefined,
      reviewedBy: [ComplianceStatus.COMPLIANT, ComplianceStatus.NON_COMPLIANT].includes(status)
        ? randomPick(['Grace Ncube', 'James Mudzuri', 'Tendai Moyo'])
        : undefined,
      notes: status === ComplianceStatus.FLAGGED ? 'Requires manual review by ZTA compliance officer.' : undefined,
    });
    reports.push(await complianceRepo.save(report));
  }
  console.log(`  Created ${reports.length} compliance reports`);
  console.log();

  // ─── Summary ────────────────────────────────────────────────────────────
  console.log('='.repeat(60));
  console.log('  Seed Complete - Summary');
  console.log('='.repeat(60));
  console.log(`  Users:              ${users.length}`);
  console.log(`  Operators:          ${operators.length}`);
  console.log(`  Bookings:           ${bookings.length}`);
  console.log(`  Booking Items:      ${bookingItems.length}`);
  console.log(`  Payments:           ${payments.length}`);
  console.log(`  Compliance Reports: ${reports.length}`);
  console.log('='.repeat(60));
  console.log();

  await dataSource.destroy();
  console.log('[OK] Database connection closed. Done!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
