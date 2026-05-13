import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { Booking } from './entities/booking.entity';
import { BookingItem } from './entities/booking-item.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from './dto/booking-status.enum';
import { ComplianceService } from '../compliance/compliance.service';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(BookingItem)
    private readonly bookingItemRepo: Repository<BookingItem>,
    private readonly complianceService: ComplianceService,
  ) {}

  async create(userId: string, dto: CreateBookingDto): Promise<Booking> {
    const reference = await this.generateReference();

    const totalAmount = dto.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const levyRate = parseFloat(process.env.TOURISM_LEVY_RATE || '0.02');
    const vatRate = parseFloat(process.env.VAT_RATE || '0.15');
    const platformFeeRate = parseFloat(process.env.BSP_PLATFORM_FEE || '0.03');

    const levyAmount = totalAmount * levyRate;
    const taxAmount = totalAmount * vatRate;
    const platformFee = totalAmount * platformFeeRate;
    const netAmount = totalAmount - levyAmount - taxAmount - platformFee;

    const booking = this.bookingRepo.create({
      id: uuidv4(),
      bookingReference: reference,
      userId,
      operatorId: dto.operatorId,
      status: BookingStatus.PENDING,
      totalAmount,
      taxAmount,
      levyAmount,
      platformFee,
      netAmount,
      checkIn: dto.checkIn,
      checkOut: dto.checkOut,
      travelerDetails: dto.travelerDetails,
      items: dto.items.map((item) => this.bookingItemRepo.create(item)),
    });

    const saved = await this.bookingRepo.save(booking);

    await this.generateQRCode(saved);

    try {
      const complianceReport = await this.complianceService.checkBookingCompliance(saved.id, saved);
      saved.isCompliant = complianceReport.isCompliant;
      saved.complianceReportId = complianceReport.id;
      await this.bookingRepo.save(saved);
    } catch (err) {
      this.logger.warn(`Compliance check failed for booking ${saved.id}: ${err.message}`);
    }

    return this.findById(saved.id);
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findByReference(ref: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { bookingReference: ref },
      relations: ['items'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    const [items, total] = await this.bookingRepo.findAndCount({
      where: { userId },
      relations: ['items'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total };
  }

  async findByOperator(operatorId: string, page = 1, limit = 20) {
    const [items, total] = await this.bookingRepo.findAndCount({
      where: { operatorId },
      relations: ['items'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total };
  }

  async updateStatus(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findById(id);

    if (dto.status === BookingStatus.CONFIRMED && booking.status === BookingStatus.PENDING) {
      booking.confirmedAt = new Date();
    }
    if (dto.status === BookingStatus.CANCELLED) {
      booking.cancelledAt = new Date();
    }

    booking.status = dto.status!;
    return this.bookingRepo.save(booking);
  }

  async markPaid(id: string): Promise<Booking> {
    const booking = await this.findById(id);
    booking.status = BookingStatus.CONFIRMED;
    booking.paidAt = new Date();
    booking.confirmedAt = new Date();
    booking.isCompliant = true;
    return this.bookingRepo.save(booking);
  }

  async cancel(id: string, userId: string): Promise<Booking> {
    const booking = await this.findById(id);
    if (booking.userId !== userId) {
      throw new BadRequestException('Not authorized to cancel this booking');
    }
    if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking cannot be cancelled');
    }
    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = new Date();
    return this.bookingRepo.save(booking);
  }

  private async generateReference(): Promise<string> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let ref: string;
    let exists = true;

    while (exists) {
      ref = 'ZV';
      for (let i = 0; i < 6; i++) {
        ref += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const existing = await this.bookingRepo.findOne({ where: { bookingReference: ref } });
      exists = !!existing;
    }
    return ref!;
  }

  private async generateQRCode(booking: Booking): Promise<void> {
    try {
      const qrData = JSON.stringify({
        ref: booking.bookingReference,
        id: booking.id,
        userId: booking.userId,
        type: 'zimpass',
      });
      const qrUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 2 });
      booking.qrCodeData = qrData;
      booking.qrCodeUrl = qrUrl;
      await this.bookingRepo.save(booking);
    } catch (err) {
      this.logger.error(`QR generation failed: ${err.message}`);
    }
  }

  async getRevenueStats(startDate?: string, endDate?: string) {
    const query = this.bookingRepo.createQueryBuilder('booking')
      .select('COUNT(booking.id)', 'totalBookings')
      .addSelect('SUM(booking.totalAmount)', 'totalRevenue')
      .addSelect('SUM(booking.taxAmount)', 'totalTax')
      .addSelect('SUM(booking.levyAmount)', 'totalLevy')
      .addSelect('SUM(booking.platformFee)', 'totalFees')
      .addSelect('SUM(booking.netAmount)', 'totalNet')
      .where('booking.status != :cancelled', { cancelled: BookingStatus.CANCELLED });

    if (startDate) query.andWhere('booking.createdAt >= :start', { start: startDate });
    if (endDate) query.andWhere('booking.createdAt <= :end', { end: endDate });

    return query.getRawOne();
  }

  async getComplianceStats() {
    const total = await this.bookingRepo.count();
    const compliant = await this.bookingRepo.count({ where: { isCompliant: true } });
    return {
      total,
      compliant,
      nonCompliant: total - compliant,
      complianceRate: total > 0 ? (compliant / total) * 100 : 0,
    };
  }
}
