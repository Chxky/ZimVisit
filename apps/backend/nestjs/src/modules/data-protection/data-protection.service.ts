import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserConsent } from './entities/consent.entity';
import { GrantConsentDto } from './dto/consent.dto';
import { User } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payments/entities/payment.entity';

@Injectable()
export class DataProtectionService {
  private readonly logger = new Logger(DataProtectionService.name);

  constructor(
    @InjectRepository(UserConsent)
    private readonly consentRepo: Repository<UserConsent>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  /**
   * Grant a consent for the given user.
   */
  async grantConsent(
    userId: string,
    dto: GrantConsentDto,
    ip?: string,
    userAgent?: string,
  ): Promise<UserConsent> {
    // Check if user already has an active consent of this type
    const existing = await this.consentRepo.findOne({
      where: { userId, consentType: dto.consentType, granted: true },
    });

    if (existing) {
      throw new ConflictException(
        `User already has active consent for '${dto.consentType}'`,
      );
    }

    const consent = this.consentRepo.create({
      userId,
      consentType: dto.consentType,
      granted: true,
      ipAddress: ip,
      userAgent,
    });

    const saved = await this.consentRepo.save(consent);
    this.logger.log(`Consent '${dto.consentType}' granted for user ${userId}`);
    return saved;
  }

  /**
   * Revoke an active consent for the given user.
   */
  async revokeConsent(
    userId: string,
    consentType: string,
    ip?: string,
    userAgent?: string,
  ): Promise<UserConsent> {
    const consent = await this.consentRepo.findOne({
      where: { userId, consentType, granted: true },
    });

    if (!consent) {
      throw new NotFoundException(
        `No active consent found for type '${consentType}'`,
      );
    }

    consent.granted = false;
    consent.revokedAt = new Date();
    consent.ipAddress = ip || consent.ipAddress;
    consent.userAgent = userAgent || consent.userAgent;

    const saved = await this.consentRepo.save(consent);
    this.logger.log(`Consent '${consentType}' revoked for user ${userId}`);
    return saved;
  }

  /**
   * Get all consent records for a user (both active and revoked).
   */
  async getUserConsents(userId: string): Promise<UserConsent[]> {
    return this.consentRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Check if a user has an active (non-revoked) consent of a given type.
   */
  async hasActiveConsent(
    userId: string,
    consentType: string,
  ): Promise<boolean> {
    const consent = await this.consentRepo.findOne({
      where: { userId, consentType, granted: true },
    });
    return !!consent;
  }

  /**
   * Export all user data as a JSON object (GDPR right to data portability).
   * Includes: profile, bookings, payments, consents.
   */
  async exportUserData(userId: string): Promise<Record<string, any>> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const bookings = await this.bookingRepo.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });

    // Fetch payments linked to the user's bookings
    const bookingIds = bookings.map((b) => b.id);
    const payments =
      bookingIds.length > 0
        ? await this.paymentRepo
            .createQueryBuilder('payment')
            .where('payment.bookingId IN (:...ids)', { ids: bookingIds })
            .getMany()
        : [];

    const consents = await this.getUserConsents(userId);

    return {
      exportDate: new Date().toISOString(),
      exportVersion: '1.0',
      dataSubject: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        preferences: user.preferences,
      },
      bookings: bookings.map((b) => ({
        id: b.id,
        bookingReference: b.bookingReference,
        status: b.status,
        totalAmount: b.totalAmount,
        currency: b.currency,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        travelerDetails: b.travelerDetails,
        items: b.items,
        createdAt: b.createdAt,
      })),
      payments: payments.map((p) => ({
        id: p.id,
        bookingId: p.bookingId,
        provider: p.provider,
        status: p.status,
        amount: p.amount,
        currency: p.currency,
        createdAt: p.createdAt,
      })),
      consents: consents.map((c) => ({
        consentType: c.consentType,
        granted: c.granted,
        createdAt: c.createdAt,
        revokedAt: c.revokedAt,
      })),
    };
  }

  /**
   * Anonymize all user data (GDPR right to erasure).
   * Records are NOT deleted (audit trail requirement) -- PII is scrubbed.
   */
  async deleteUserData(userId: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Anonymize user record
    user.email = `anonymized_${userId.substring(0, 8)}@deleted.local`;
    user.fullName = 'Anonymized User';
    (user as any).phone = null;
    (user as any).avatarUrl = null;
    user.isActive = false;
    user.metadata = { anonymized: true, anonymizedAt: new Date().toISOString() };
    (user as any).preferences = null;
    await this.userRepo.save(user);

    // Anonymize traveler details in bookings
    const bookings = await this.bookingRepo.find({ where: { userId } });
    for (const booking of bookings) {
      booking.travelerDetails = { anonymized: true };
      booking.metadata = {
        ...booking.metadata,
        anonymized: true,
        anonymizedAt: new Date().toISOString(),
      };
      (booking as any).qrCodeData = null;
      (booking as any).qrCodeUrl = null;
      await this.bookingRepo.save(booking);
    }

    // Revoke all active consents
    const activeConsents = await this.consentRepo.find({
      where: { userId, granted: true },
    });
    for (const consent of activeConsents) {
      consent.granted = false;
      consent.revokedAt = new Date();
      await this.consentRepo.save(consent);
    }

    this.logger.log(`User data anonymized for user ${userId}`);
    return { message: 'User data has been anonymized successfully' };
  }
}
