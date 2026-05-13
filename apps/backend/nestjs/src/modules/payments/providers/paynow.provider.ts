import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Payment, PaymentProvider, PaymentStatus } from '../entities/payment.entity';

@Injectable()
export class PaynowProvider {
  private readonly logger = new Logger(PaynowProvider.name);

  constructor(private readonly config: ConfigService) {}

  async initiate(payment: Payment, booking: any): Promise<any> {
    const integrationKey = this.config.get('PAYNOW_INTEGRATION_KEY');
    const resultUrl = this.config.get('PAYNOW_RESULT_URL');
    const returnUrl = this.config.get('PAYNOW_RETURN_URL');

    const payload = {
      integration_key: integrationKey,
      result_url: resultUrl,
      return_url: returnUrl,
      reference: payment.transactionReference,
      amount: payment.amount,
      currency: 'USD',
      description: `Booking ${booking.bookingReference}`,
      email: booking.travelerDetails?.email || '',
    };

    try {
      const response = await axios.post('https://www.paynow.co.zw/interface/initiatetransaction', payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      return {
        reference: payment.transactionReference,
        redirectUrl: response.data?.redirect_url,
        pollUrl: response.data?.poll_url,
        status: response.data?.status,
      };
    } catch (err) {
      this.logger.error(`Paynow initiation failed: ${err.message}`);
      return { reference: payment.transactionReference, redirectUrl: null, error: err.message };
    }
  }

  async handleCallback(payload: any): Promise<any> {
    return { id: payload.id, status: PaymentStatus.SUCCESS, providerReference: payload.reference };
  }
}
