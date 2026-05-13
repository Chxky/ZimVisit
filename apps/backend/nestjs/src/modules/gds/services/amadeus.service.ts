import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AmadeusService {
  private readonly logger = new Logger(AmadeusService.name);
  private accessToken: string | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  private async authenticate(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    const response = await firstValueFrom<{ data: { access_token: string; expires_in: number } }>(
      this.http.post(
        `${this.config.get('AMADEUS_ENDPOINT')}/v1/security/oauth2/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.get('AMADEUS_API_KEY')!,
          client_secret: this.config.get('AMADEUS_API_SECRET')!,
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      ),
    );

    this.accessToken = response.data.access_token;
    setTimeout(() => { this.accessToken = null; }, response.data.expires_in * 1000);
    return this.accessToken!;
  }

  async searchFlights(params: { origin: string; destination: string; date: string; passengers: number }) {
    const token = await this.authenticate();
    const response = await firstValueFrom<{ data: any }>(
      this.http.get(`${this.config.get('AMADEUS_ENDPOINT')}/v2/shopping/flight-offers`, {
        params: {
          originLocationCode: params.origin,
          destinationLocationCode: params.destination,
          departureDate: params.date,
          adults: params.passengers,
          currencyCode: 'USD',
          max: 20,
        },
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return { provider: 'amadeus', flights: response.data };
  }

  async getFlightDetails(flightId: string) {
    return { provider: 'amadeus', flightId };
  }

  async bookFlight(data: any) {
    return { provider: 'amadeus', success: true, reference: `AMA-${Date.now()}` };
  }
}
