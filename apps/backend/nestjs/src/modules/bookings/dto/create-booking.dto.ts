import { IsString, IsArray, IsOptional, IsNumber, IsDateString, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateBookingItemDto {
  @ApiProperty({ enum: ['flight', 'hotel', 'tour', 'transfer', 'activity'] })
  @IsString()
  itemType: string;

  @ApiProperty()
  @IsString()
  itemId: string;

  @ApiProperty()
  @IsString()
  itemName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
}

export class CreateBookingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  operatorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  checkIn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  checkOut?: string;

  @ApiProperty({ type: [CreateBookingItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBookingItemDto)
  items: CreateBookingItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  travelerDetails?: Record<string, any>;
}
