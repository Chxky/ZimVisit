import { Injectable, Logger } from '@nestjs/common';
import { TravelportService } from './services/travelport.service';
import { AmadeusService } from './services/amadeus.service';

@Injectable()
export class GdsService {
  private readonly logger = new Logger(GdsService.name);

  constructor(
    private readonly travelport: TravelportService,
    private readonly amadeus: AmadeusService,
  ) {}

  async searchFlights(params: { origin: string; destination: string; date: string; passengers: number }) {
    try {
      return await this.amadeus.searchFlights(params);
    } catch (err) {
      this.logger.warn(`Amadeus search failed, trying Travelport: ${err.message}`);
      return this.travelport.searchFlights(params);
    }
  }

  async getFlightDetails(flightId: string, provider: string) {
    if (provider === 'amadeus') return this.amadeus.getFlightDetails(flightId);
    return this.travelport.getFlightDetails(flightId);
  }

  async bookFlight(bookingData: any, provider: string) {
    if (provider === 'amadeus') return this.amadeus.bookFlight(bookingData);
    return this.travelport.bookFlight(bookingData);
  }
}
