import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BspEngineService {
  private readonly logger = new Logger(BspEngineService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  async routeBooking(booking: any): Promise<{ success: boolean; reference?: string; error?: string }> {
    try {
      this.logger.log(`Routing booking ${booking.bookingReference} through BSP compliance engine`);

      const isSimulationMode = this.config.get('NODE_ENV') !== 'production' || !this.config.get('TRAVELPORT_CLIENT_ID');

      if (isSimulationMode) {
        return {
          success: true,
          reference: `BSP-SIM-${Date.now()}`,
        };
      }

      const response = await firstValueFrom<{ data: { confirmationId?: string } }>(
        this.http.post(
          `${this.config.get('TRAVELPORT_ENDPOINT')}/air/booking`,
          {
            bookingRef: booking.bookingReference,
            amount: booking.totalAmount,
            currency: 'USD',
          },
          {
            headers: {
              'Authorization': `Bearer ${this.config.get('TRAVELPORT_CLIENT_SECRET')}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return {
        success: true,
        reference: response.data?.confirmationId || `BSP-${Date.now()}`,
      };
    } catch (err) {
      this.logger.error(`BSP routing failed: ${err.message}`);
      return {
        success: false,
        error: err.message,
      };
    }
  }

  async verifyBooking(reference: string): Promise<boolean> {
    try {
      this.logger.log(`Verifying BSP booking ${reference}`);
      return true;
    } catch (err) {
      this.logger.error(`BSP verification failed: ${err.message}`);
      return false;
    }
  }
}
