import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Payment, PaymentStatus } from '../entities/payment.entity';

@Injectable()
export class EcocashProvider {
  private readonly logger = new Logger(EcocashProvider.name);

  constructor(private readonly config: ConfigService) {}

  async initiate(payment: Payment, booking: any): Promise<any> {
    const merchantId = this.config.get('ECOCASH_MERCHANT_ID');
    const apiUrl = this.config.get('ECOCASH_API_URL');

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
        headers: { 'Content-Type': 'application/json', 'X-API-Key': this.config.get('ECOCASH_API_KEY') },
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

  async handleCallback(payload: any, payment: Payment): Promise<any> {
    const incomingAmount = parseFloat(payload.amount);
    if (Math.abs(incomingAmount - parseFloat(payment.amount.toString())) > 0.01) {
      this.logger.error(`EcoCash amount mismatch! Expected: ${payment.amount}, Received: ${incomingAmount}`);
      return { success: false, error: 'EcoCash payment amount mismatch' };
    }

    return {
      success: true,
      providerReference: payload.providerReference || payload.transactionId || `ECO-${Date.now()}`,
    };
  }
}
