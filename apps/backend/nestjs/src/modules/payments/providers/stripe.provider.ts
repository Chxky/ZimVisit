import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class StripeProvider {
  private readonly logger = new Logger(StripeProvider.name);

  constructor(private readonly config: ConfigService) {}

  async initiate(payment: Payment, _booking: any): Promise<any> {
    const isSimulationMode =
      this.config.get('NODE_ENV') !== 'production' || !this.config.get('STRIPE_SECRET_KEY');

    if (isSimulationMode) {
      return {
        reference: payment.transactionReference,
        redirectUrl: `https://zimvisit.co.zw/payments/sandbox-gateway/stripe?ref=${payment.transactionReference}&amount=${payment.amount}`,
      };
    }

    return {
      reference: payment.transactionReference,
      redirectUrl: `https://checkout.stripe.com/pay/${payment.transactionReference}`,
    };
  }

  async handleWebhook(payload: any, payment: Payment): Promise<any> {
    const eventType = payload.type || 'checkout.session.completed';
    if (eventType !== 'checkout.session.completed') {
      return { success: false, error: `Unhandled Stripe event type: ${eventType}` };
    }

    const session = payload.data?.object;
    if (!session) {
      return { success: false, error: 'Missing session object in Stripe callback' };
    }

    // Stripe specifies amounts in cents
    if (session.amount_total === null || session.amount_total === undefined) {
      this.logger.error('Stripe session missing amount_total');
      return { success: false, error: 'Stripe session missing amount_total' };
    }
    const stripeAmountUSD = parseFloat((session.amount_total / 100).toFixed(2));
    const expectedAmount = parseFloat(payment.amount.toString());

    if (Math.abs(stripeAmountUSD - expectedAmount) > 0.01) {
      this.logger.error(`Stripe amount mismatch! Expected: ${expectedAmount}, Received: ${stripeAmountUSD}`);
      return { success: false, error: 'Stripe payment amount mismatch' };
    }

    return {
      success: true,
      providerReference: session.id || payload.id,
    };
  }
}
