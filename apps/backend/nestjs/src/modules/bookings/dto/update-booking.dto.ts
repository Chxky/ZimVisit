import { IsOptional, IsEnum } from 'class-validator';
import { BookingStatus } from './booking-status.enum';

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  travelerDetails?: Record<string, any>;
}
