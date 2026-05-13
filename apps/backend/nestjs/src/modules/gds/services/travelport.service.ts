import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TravelportService {
  private readonly logger = new Logger(TravelportService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  async searchFlights(params: { origin: string; destination: string; date: string; passengers: number }) {
    this.logger.log(`Searching flights via Travelport: ${params.origin} -> ${params.destination}`);
    return { provider: 'travelport', flights: [] };
  }

  async getFlightDetails(flightId: string) {
    return { provider: 'travelport', flightId };
  }

  async bookFlight(data: any) {
    return { provider: 'travelport', success: true, reference: `TRAV-${Date.now()}` };
  }
}
