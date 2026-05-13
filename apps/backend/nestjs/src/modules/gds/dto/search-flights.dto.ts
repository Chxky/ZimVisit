import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchFlightsDto {
  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsString()
  date: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  passengers: number;
}
