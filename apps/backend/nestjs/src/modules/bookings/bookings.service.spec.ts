import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { BookingItem } from './entities/booking-item.entity';
import { BookingStatus } from './dto/booking-status.enum';
import { ComplianceService } from '../compliance/compliance.service';

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepoMock: any;
  let bookingItemRepoMock: any;
  let complianceServiceMock: any;

  const mockBooking = {
    id: 'booking-1',
    bookingReference: 'ZV123456',
    userId: 'user-1',
    operatorId: 'operator-1',
    status: BookingStatus.PENDING,
    totalAmount: 1000,
    taxAmount: 150,
    levyAmount: 20,
    platformFee: 30,
    netAmount: 800,
    isCompliant: false,
    checkIn: '2026-06-01',
    checkOut: '2026-06-05',
    travelerDetails: {},
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockComplianceReport = {
    id: 'compliance-1',
    isCompliant: true,
    bookingId: 'booking-1',
  };

  beforeEach(async () => {
    bookingRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      findAndCount: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    bookingItemRepoMock = {
      create: jest.fn(),
    };

    complianceServiceMock = {
      checkBookingCompliance: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: bookingRepoMock },
        { provide: getRepositoryToken(BookingItem), useValue: bookingItemRepoMock },
        { provide: ComplianceService, useValue: complianceServiceMock },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking with compliance check', async () => {
      bookingRepoMock.findOne
        .mockResolvedValueOnce(null) // generateReference check
        .mockResolvedValueOnce(mockBooking); // final findById
      bookingRepoMock.create.mockReturnValue(mockBooking);
      bookingRepoMock.save.mockResolvedValue(mockBooking);
      bookingItemRepoMock.create.mockReturnValue({});
      complianceServiceMock.checkBookingCompliance.mockResolvedValue(mockComplianceReport);

      jest.spyOn(service as any, 'generateQRCode').mockResolvedValue(undefined);

      const dto = {
        operatorId: 'operator-1',
        checkIn: '2026-06-01',
        checkOut: '2026-06-05',
        items: [{ itemType: 'tour', itemId: 'tour-1', itemName: 'Victoria Falls Tour', price: 1000, quantity: 1 }],
        travelerDetails: {},
      };

      const result = await service.create('user-1', dto);

      expect(bookingRepoMock.create).toHaveBeenCalled();
      expect(bookingRepoMock.save).toHaveBeenCalled();
      expect(complianceServiceMock.checkBookingCompliance).toHaveBeenCalled();
      expect(result).toEqual(mockBooking);
    });

    it('should still create booking when compliance check fails', async () => {
      bookingRepoMock.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockBooking);
      bookingRepoMock.create.mockReturnValue(mockBooking);
      bookingRepoMock.save.mockResolvedValue(mockBooking);
      bookingItemRepoMock.create.mockReturnValue({});
      complianceServiceMock.checkBookingCompliance.mockRejectedValue(new Error('Compliance service down'));

      jest.spyOn(service as any, 'generateQRCode').mockResolvedValue(undefined);

      const dto = {
        operatorId: 'operator-1',
        checkIn: '2026-06-01',
        checkOut: '2026-06-05',
        items: [{ itemType: 'tour', itemId: 'tour-1', itemName: 'Victoria Falls Tour', price: 500, quantity: 1 }],
        travelerDetails: {},
      };

      const result = await service.create('user-1', dto);

      expect(result).toEqual(mockBooking);
      expect(complianceServiceMock.checkBookingCompliance).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a booking when found', async () => {
      bookingRepoMock.findOne.mockResolvedValue(mockBooking);

      const result = await service.findById('booking-1');

      expect(result).toEqual(mockBooking);
      expect(bookingRepoMock.findOne).toHaveBeenCalledWith({
        where: { id: 'booking-1' },
        relations: ['items'],
      });
    });

    it('should throw NotFoundException when booking not found', async () => {
      bookingRepoMock.findOne.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByReference', () => {
    it('should return a booking by reference', async () => {
      bookingRepoMock.findOne.mockResolvedValue(mockBooking);

      const result = await service.findByReference('ZV123456');

      expect(result).toEqual(mockBooking);
    });

    it('should throw NotFoundException when reference not found', async () => {
      bookingRepoMock.findOne.mockResolvedValue(null);

      await expect(service.findByReference('INVALID')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser', () => {
    it('should return paginated results', async () => {
      bookingRepoMock.findAndCount.mockResolvedValue([[mockBooking], 1]);

      const result = await service.findByUser('user-1', 1, 20);

      expect(result.items).toEqual([mockBooking]);
      expect(result.total).toBe(1);
    });
  });

  describe('updateStatus', () => {
    it('should confirm a pending booking', async () => {
      bookingRepoMock.findOne.mockResolvedValue({ ...mockBooking, status: BookingStatus.PENDING });
      bookingRepoMock.save.mockImplementation((b: any) => Promise.resolve(b));

      const result = await service.updateStatus('booking-1', { status: BookingStatus.CONFIRMED });

      expect(result.status).toBe(BookingStatus.CONFIRMED);
      expect(result.confirmedAt).toBeDefined();
    });

    it('should cancel a booking', async () => {
      bookingRepoMock.findOne.mockResolvedValue({ ...mockBooking, status: BookingStatus.PENDING });
      bookingRepoMock.save.mockImplementation((b: any) => Promise.resolve(b));

      const result = await service.updateStatus('booking-1', { status: BookingStatus.CANCELLED });

      expect(result.status).toBe(BookingStatus.CANCELLED);
      expect(result.cancelledAt).toBeDefined();
    });
  });

  describe('markPaid', () => {
    it('should set status to CONFIRMED and mark as paid', async () => {
      bookingRepoMock.findOne.mockResolvedValue({ ...mockBooking });
      bookingRepoMock.save.mockImplementation((b: any) => Promise.resolve(b));

      const result = await service.markPaid('booking-1');

      expect(result.status).toBe(BookingStatus.CONFIRMED);
      expect(result.paidAt).toBeDefined();
      expect(result.confirmedAt).toBeDefined();
      expect(result.isCompliant).toBe(true);
    });
  });

  describe('cancel', () => {
    it('should cancel a booking successfully', async () => {
      bookingRepoMock.findOne.mockResolvedValue({ ...mockBooking, status: BookingStatus.PENDING });
      bookingRepoMock.save.mockImplementation((b: any) => Promise.resolve(b));

      const result = await service.cancel('booking-1', 'user-1');

      expect(result.status).toBe(BookingStatus.CANCELLED);
    });

    it('should throw BadRequestException when user is not authorized', async () => {
      bookingRepoMock.findOne.mockResolvedValue({ ...mockBooking, status: BookingStatus.PENDING });

      await expect(service.cancel('booking-1', 'wrong-user')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when booking is already completed', async () => {
      bookingRepoMock.findOne.mockResolvedValue({ ...mockBooking, status: BookingStatus.COMPLETED });

      await expect(service.cancel('booking-1', 'user-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getRevenueStats', () => {
    it('should return aggregated revenue stats', async () => {
      const mockStats = {
        totalBookings: '10',
        totalRevenue: '5000',
        totalTax: '750',
        totalLevy: '100',
        totalFees: '150',
        totalNet: '4000',
      };

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockStats),
      };

      bookingRepoMock.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getRevenueStats('2026-01-01', '2026-12-31');

      expect(result).toEqual(mockStats);
    });
  });

  describe('getComplianceStats', () => {
    it('should return compliance counts', async () => {
      bookingRepoMock.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(8); // compliant

      const result = await service.getComplianceStats();

      expect(result.total).toBe(10);
      expect(result.compliant).toBe(8);
      expect(result.nonCompliant).toBe(2);
      expect(result.complianceRate).toBe(80);
    });
  });
});
