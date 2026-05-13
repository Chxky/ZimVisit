import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, Min } from 'class-validator';

export class CreateTourDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  meetingPoint?: string;

  @IsOptional()
  @IsNumber()
  maxCapacity?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  inclusions?: string[];

  @IsOptional()
  @IsArray()
  exclusions?: string[];
}
