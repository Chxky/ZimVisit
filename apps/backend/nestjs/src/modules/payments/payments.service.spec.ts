import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { Payment, PaymentProvider, PaymentStatus } from './entities/payment.entity';
import { PaynowProvider } from './providers/paynow.provider';
import { EcocashProvider } from './providers/ecocash.provider';
import { StripeProvider } from './providers/stripe.provider';
import { BookingsService } from '../bookings/bookings.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentRepoMock: any;
  let paynowProviderMock: any;
  let ecocashProviderMock: any;
  let stripeProviderMock: any;
  let bookingsServiceMock: any;

  const mockBooking = {
    id: 'booking-1',
    totalAmount: 1000,
    bookingReference: 'ZV123456',
  };

  const mockPayment = {
    id: 'payment-1',
    bookingId: 'booking-1',
    provider: PaymentProvider.PAYNOW,
    status: PaymentStatus.PENDING,
    amount: 1000,
    currency: 'USD',
    transactionReference: 'PAY-ABC123',
    providerReference: null,
    providerResponse: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    paymentRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    paynowProviderMock = {
      initiate: jest.fn(),
      handleCallback: jest.fn(),
    };

    ecocashProviderMock = {
      initiate: jest.fn(),
      handleCallback: jest.fn(),
    };

    stripeProviderMock = {
      initiate: jest.fn(),
      handleWebhook: jest.fn(),
    };

    bookingsServiceMock = {
      findById: jest.fn(),
      markPaid: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: getRepositoryToken(Payment), useValue: paymentRepoMock },
        { provide: PaynowProvider, useValue: paynowProviderMock },
        { provide: EcocashProvider, useValue: ecocashProviderMock },
        { provide: StripeProvider, useValue: stripeProviderMock },
        { provide: BookingsService, useValue: bookingsServiceMock },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initiatePayment', () => {
    it('should initiate payment with PAYNOW provider', async () => {
      bookingsServiceMock.findById.mockResolvedValue(mockBooking);
      paymentRepoMock.create.mockReturnValue(mockPayment);
      paymentRepoMock.save.mockResolvedValue(mockPayment);
      paynowProviderMock.initiate.mockResolvedValue({
        redirectUrl: 'https://paynow.example.com',
        reference: 'PN-REF-123',
      });

      const result = await service.initiatePayment('booking-1', PaymentProvider.PAYNOW);

      expect(result.payment).toBeDefined();
      expect(result.redirectUrl).toBe('https://paynow.example.com');
      expect(paynowProviderMock.initiate).toHaveBeenCalled();
    });

    it('should initiate payment with ECOCASH provider', async () => {
      bookingsServiceMock.findById.mockResolvedValue(mockBooking);
      paymentRepoMock.create.mockReturnValue(mockPayment);
      paymentRepoMock.save.mockResolvedValue(mockPayment);
      ecocashProviderMock.initiate.mockResolvedValue({
        instructions: 'Dial *151#',
        reference: 'EC-REF-123',
      });

      const result = await service.initiatePayment('booking-1', PaymentProvider.ECOCASH);

      expect(result.payment).toBeDefined();
      expect(result.instructions).toBe('Dial *151#');
      expect(ecocashProviderMock.initiate).toHaveBeenCalled();
    });

    it('should initiate payment with STRIPE provider', async () => {
      bookingsServiceMock.findById.mockResolvedValue(mockBooking);
      paymentRepoMock.create.mockReturnValue(mockPayment);
      paymentRepoMock.save.mockResolvedValue(mockPayment);
      stripeProviderMock.initiate.mockResolvedValue({
        redirectUrl: 'https://checkout.stripe.com',
        reference: 'ST-REF-123',
      });

      const result = await service.initiatePayment('booking-1', PaymentProvider.STRIPE);

      expect(result.payment).toBeDefined();
      expect(result.redirectUrl).toBe('https://checkout.stripe.com');
      expect(stripeProviderMock.initiate).toHaveBeenCalled();
    });

    it('should throw BadRequestException for unsupported provider', async () => {
      bookingsServiceMock.findById.mockResolvedValue(mockBooking);
      paymentRepoMock.create.mockReturnValue(mockPayment);
      paymentRepoMock.save.mockResolvedValue(mockPayment);

      await expect(
        service.initiatePayment('booking-1', 'unsupported' as PaymentProvider),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('handleCallback', () => {
    it('should handle successful callback', async () => {
      const pendingPayment = { ...mockPayment, status: PaymentStatus.PENDING };
      paymentRepoMock.findOne.mockResolvedValue(pendingPayment);
      paynowProviderMock.handleCallback.mockResolvedValue({ success: true, providerReference: 'PN-CONFIRMED' });
      paymentRepoMock.save.mockImplementation((p: any) => Promise.resolve(p));
      bookingsServiceMock.markPaid.mockResolvedValue({});

      const result = await service.handleCallback(PaymentProvider.PAYNOW, { reference: 'PAY-ABC123' });

      expect(result.status).toBe(PaymentStatus.SUCCESS);
      expect(bookingsServiceMock.markPaid).toHaveBeenCalledWith('booking-1');
    });

    it('should return existing payment if already processed', async () => {
      const successPayment = { ...mockPayment, status: PaymentStatus.SUCCESS };
      paymentRepoMock.findOne.mockResolvedValue(successPayment);

      const result = await service.handleCallback(PaymentProvider.PAYNOW, { reference: 'PAY-ABC123' });

      expect(result.status).toBe(PaymentStatus.SUCCESS);
      expect(paynowProviderMock.handleCallback).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when payment not found', async () => {
      paymentRepoMock.findOne.mockResolvedValue(null);

      await expect(
        service.handleCallback(PaymentProvider.PAYNOW, { reference: 'INVALID' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when verification fails', async () => {
      const pendingPayment = { ...mockPayment, status: PaymentStatus.PENDING };
      paymentRepoMock.findOne.mockResolvedValue(pendingPayment);
      paynowProviderMock.handleCallback.mockResolvedValue({ success: false, error: 'Signature mismatch' });
      paymentRepoMock.save.mockImplementation((p: any) => Promise.resolve(p));

      await expect(
        service.handleCallback(PaymentProvider.PAYNOW, { reference: 'PAY-ABC123' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByBooking', () => {
    it('should return payments for a booking', async () => {
      paymentRepoMock.find.mockResolvedValue([mockPayment]);

      const result = await service.findByBooking('booking-1');

      expect(result).toEqual([mockPayment]);
      expect(paymentRepoMock.find).toHaveBeenCalledWith({
        where: { bookingId: 'booking-1' },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findById', () => {
    it('should return a payment by id', async () => {
      paymentRepoMock.findOne.mockResolvedValue(mockPayment);

      const result = await service.findById('payment-1');

      expect(result).toEqual(mockPayment);
    });

    it('should return null when payment not found', async () => {
      paymentRepoMock.findOne.mockResolvedValue(null);

      const result = await service.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('refund', () => {
    it('should refund a successful payment', async () => {
      const successPayment = { ...mockPayment, status: PaymentStatus.SUCCESS };
      paymentRepoMock.findOne.mockResolvedValue(successPayment);
      paymentRepoMock.save.mockImplementation((p: any) => Promise.resolve(p));

      const result = await service.refund('payment-1');

      expect(result.status).toBe(PaymentStatus.REFUNDED);
    });

    it('should throw BadRequestException when payment not found', async () => {
      paymentRepoMock.findOne.mockResolvedValue(null);

      await expect(service.refund('nonexistent')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when payment is not in SUCCESS status', async () => {
      const pendingPayment = { ...mockPayment, status: PaymentStatus.PENDING };
      paymentRepoMock.findOne.mockResolvedValue(pendingPayment);

      await expect(service.refund('payment-1')).rejects.toThrow(BadRequestException);
    });
  });
});
