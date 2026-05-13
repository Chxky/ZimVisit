import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentStatus } from '../entities/payment.entity';

@Injectable()
export class StripeProvider {
  private readonly logger = new Logger(StripeProvider.name);

  constructor(private readonly config: ConfigService) {}

  async initiate(payment: Payment, booking: any): Promise<any> {
    return {
      reference: payment.transactionReference,
      redirectUrl: `https://checkout.stripe.com/pay/${payment.transactionReference}`,
    };
  }

  async handleWebhook(payload: any): Promise<any> {
    return { id: payload.id, status: PaymentStatus.SUCCESS, providerReference: payload.id };
  }
}
