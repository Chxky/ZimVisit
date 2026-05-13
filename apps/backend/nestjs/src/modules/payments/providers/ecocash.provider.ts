import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Payment, PaymentStatus } from '../entities/payment.entity';

@Injectable()
export class EcocashProvider {
  private readonly logger = new Logger(EcocashProvider.name);

  constructor(private readonly config: ConfigService) {}

  async initiate(payment: Payment, booking: any): Promise<any> {
    const merchantId = this.config.get('ECOCHASH_MERCHANT_ID');
    const apiUrl = this.config.get('ECOCHASH_API_URL');

    const payload = {
      merchantId,
      transactionId: payment.transactionReference,
      amount: payment.amount,
      currency: 'USD',
      customerPhone: booking.travelerDetails?.phone || '',
      description: `Booking ${booking.bookingReference}`,
    };

    try {
      const response = await axios.post(`${apiUrl}/transaction/initiate`, payload, {
        headers: { 'Content-Type': 'application/json', 'X-API-Key': this.config.get('ECOCHASH_API_KEY') },
      });

      return {
        reference: payment.transactionReference,
        instructions: `Dial *151*1*7*${merchantId}*${payment.amount}# to complete payment`,
        pollUrl: response.data?.pollUrl,
      };
    } catch (err) {
      this.logger.error(`EcoCash initiation failed: ${err.message}`);
      return { reference: payment.transactionReference, error: err.message };
    }
  }

  async handleCallback(payload: any): Promise<any> {
    return { id: payload.id, status: PaymentStatus.SUCCESS, providerReference: payload.transactionId };
  }
}
