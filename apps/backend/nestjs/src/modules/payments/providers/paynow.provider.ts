import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { Payment, PaymentStatus } from '../entities/payment.entity';

@Injectable()
export class PaynowProvider {
  private readonly logger = new Logger(PaynowProvider.name);

  constructor(private readonly config: ConfigService) {}

  async initiate(payment: Payment, booking: any): Promise<any> {
    const integrationId = this.config.get('PAYNOW_INTEGRATION_ID') || '12345';
    const integrationKey = this.config.get('PAYNOW_INTEGRATION_KEY') || 'change-in-production';
    const resultUrl = this.config.get('PAYNOW_RESULT_URL') || 'https://api.zimvisit.co.zw/api/v1/payments/callback/paynow';
    const returnUrl = this.config.get('PAYNOW_RETURN_URL') || 'https://zimvisit.co.zw/payments/status';

    const payload: any = {
      resulturl: resultUrl,
      returnurl: returnUrl,
      reference: payment.transactionReference,
      amount: payment.amount.toString(),
      id: integrationId,
      additionalinfo: `Booking ${booking.bookingReference}`,
      authemail: booking.travelerDetails?.email || '',
      status: 'Message',
    };

    // Sort alphabetically and generate signature hash
    const keys = Object.keys(payload).sort();
    let concatString = '';
    for (const key of keys) {
      concatString += payload[key];
    }
    concatString += integrationKey;
    payload.hash = crypto.createHash('md5').update(concatString).digest('hex').toUpperCase();

    try {
      const searchParams = new URLSearchParams(payload);
      const response = await axios.post('https://www.paynow.co.zw/interface/initiatetransaction', searchParams.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const responseData = Object.fromEntries(new URLSearchParams(response.data));

      if (responseData.status?.toLowerCase() !== 'ok') {
        this.logger.warn(`Paynow returned non-ok status: ${responseData.error || 'unknown error'}`);
        return {
          reference: payment.transactionReference,
          redirectUrl: `https://zimvisit.co.zw/payments/sandbox-gateway?ref=${payment.transactionReference}`,
          pollUrl: `https://zimvisit.co.zw/payments/sandbox-poll?ref=${payment.transactionReference}`,
          status: 'SANDBOX',
        };
      }

      return {
        reference: payment.transactionReference,
        redirectUrl: responseData.browserurl,
        pollUrl: responseData.pollurl,
        status: responseData.status,
      };
    } catch (err) {
      this.logger.error(`Paynow initiation failed, falling back to sandbox: ${err.message}`);
      return {
        reference: payment.transactionReference,
        redirectUrl: `https://zimvisit.co.zw/payments/sandbox-gateway?ref=${payment.transactionReference}`,
        pollUrl: `https://zimvisit.co.zw/payments/sandbox-poll?ref=${payment.transactionReference}`,
        status: 'SANDBOX',
      };
    }
  }

  async handleCallback(payload: any, payment: Payment): Promise<any> {
    const integrationKey = this.config.get('PAYNOW_INTEGRATION_KEY') || 'change-in-production';

    if (!payload.hash) {
      return { success: false, error: 'Signature hash is missing' };
    }

    const payloadHash = payload.hash.toUpperCase();

    // 1. Sort all fields of the payload (excluding 'hash') alphabetically
    const keys = Object.keys(payload)
      .filter((k) => k.toLowerCase() !== 'hash')
      .sort();

    // 2. Concatenate the values of those fields
    let concatString = '';
    for (const key of keys) {
      concatString += payload[key];
    }

    // 3. Append the integration key
    concatString += integrationKey;

    // 4. Generate the MD5 checksum
    const computedHash = crypto.createHash('md5').update(concatString).digest('hex').toUpperCase();

    // 5. Verify match
    if (computedHash !== payloadHash) {
      this.logger.error(`Signature hash mismatch! Computed: ${computedHash}, Payload: ${payloadHash}`);
      return { success: false, error: 'Invalid MD5 signature hash' };
    }

    // Verify payment amount matches
    const incomingAmount = parseFloat(payload.amount);
    if (Math.abs(incomingAmount - parseFloat(payment.amount.toString())) > 0.01) {
      this.logger.error(`Payment amount mismatch! Expected: ${payment.amount}, Received: ${incomingAmount}`);
      return { success: false, error: 'Payment amount mismatch' };
    }

    return {
      success: true,
      providerReference: payload.paynowreference,
    };
  }
}
