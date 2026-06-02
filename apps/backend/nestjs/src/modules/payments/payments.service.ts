import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Payment, PaymentProvider, PaymentStatus } from './entities/payment.entity';
import { PaynowProvider } from './providers/paynow.provider';
import { EcocashProvider } from './providers/ecocash.provider';
import { StripeProvider } from './providers/stripe.provider';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly paynowProvider: PaynowProvider,
    private readonly ecocashProvider: EcocashProvider,
    private readonly stripeProvider: StripeProvider,
    private readonly bookingsService: BookingsService,
  ) {}

  async initiatePayment(bookingId: string, provider: PaymentProvider) {
    const booking = await this.bookingsService.findById(bookingId);

    const payment = this.paymentRepo.create({
      id: uuidv4(),
      bookingId,
      provider,
      amount: booking.totalAmount,
      transactionReference: `PAY-${uuidv4().split('-')[0].toUpperCase()}`,
      currency: 'USD',
      status: PaymentStatus.PENDING,
    });

    const saved = await this.paymentRepo.save(payment);

    let result;
    switch (provider) {
      case PaymentProvider.PAYNOW:
        result = await this.paynowProvider.initiate(saved, booking);
        break;
      case PaymentProvider.ECOCASH:
        result = await this.ecocashProvider.initiate(saved, booking);
        break;
      case PaymentProvider.STRIPE:
        result = await this.stripeProvider.initiate(saved, booking);
        break;
      default:
        throw new BadRequestException('Unsupported payment provider');
    }

    saved.providerResponse = result;
    saved.providerReference = result.reference;
    await this.paymentRepo.save(saved);

    return { payment: saved, redirectUrl: result.redirectUrl, instructions: result.instructions };
  }

  async handleCallback(provider: PaymentProvider, payload: any) {
    const transactionReference = payload.reference || payload.transactionId || payload.id;
    if (!transactionReference) {
      throw new BadRequestException('Missing transaction reference in payload');
    }

    // Lookup payment by transactionReference or providerReference
    let payment = await this.paymentRepo.findOne({
      where: [
        { transactionReference },
        { providerReference: transactionReference },
      ],
    });

    if (!payment && payload.data?.object) {
      // Stripe nested reference fallback
      const nestedRef = payload.data.object.metadata?.transactionReference || payload.data.object.id;
      if (nestedRef) {
        payment = await this.paymentRepo.findOne({
          where: [
            { transactionReference: nestedRef },
            { providerReference: nestedRef },
          ],
        });
      }
    }

    if (!payment) {
      throw new BadRequestException(`Payment not found for reference ${transactionReference}`);
    }

    // Return immediately if already processed
    if (payment.status === PaymentStatus.SUCCESS) {
      return payment;
    }

    let verificationResult;
    switch (provider) {
      case PaymentProvider.PAYNOW:
        verificationResult = await this.paynowProvider.handleCallback(payload, payment);
        break;
      case PaymentProvider.ECOCASH:
        verificationResult = await this.ecocashProvider.handleCallback(payload, payment);
        break;
      case PaymentProvider.STRIPE:
        verificationResult = await this.stripeProvider.handleWebhook(payload, payment);
        break;
      default:
        throw new BadRequestException('Unsupported payment provider');
    }

    if (!verificationResult || !verificationResult.success) {
      payment.status = PaymentStatus.FAILED;
      payment.providerResponse = {
        ...payment.providerResponse,
        error: verificationResult?.error || 'Verification failed',
      };
      await this.paymentRepo.save(payment);
      throw new BadRequestException(verificationResult?.error || 'Payment signature verification failed');
    }

    payment.status = PaymentStatus.SUCCESS;
    payment.paidAt = new Date();
    payment.providerReference = verificationResult.providerReference || payment.providerReference;
    payment.providerResponse = {
      ...payment.providerResponse,
      callbackPayload: payload,
    };

    await this.paymentRepo.save(payment);
    await this.bookingsService.markPaid(payment.bookingId);

    return payment;
  }

  async findByBooking(bookingId: string): Promise<Payment[]> {
    return this.paymentRepo.find({ where: { bookingId }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Payment | null> {
    return this.paymentRepo.findOne({ where: { id } });
  }

  async refund(paymentId: string) {
    const payment = await this.findById(paymentId);
    if (!payment) throw new BadRequestException('Payment not found');
    if (payment.status !== PaymentStatus.SUCCESS) {
      throw new BadRequestException('Payment cannot be refunded');
    }

    payment.status = PaymentStatus.REFUNDED;
    return this.paymentRepo.save(payment);
  }
}
