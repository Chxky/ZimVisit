import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const VALID_CONSENT_TYPES = ['terms', 'privacy', 'marketing', 'analytics'] as const;

export class GrantConsentDto {
  @ApiProperty({
    description: 'Type of consent to grant',
    enum: VALID_CONSENT_TYPES,
    example: 'privacy',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(VALID_CONSENT_TYPES, {
    message: `consentType must be one of: ${VALID_CONSENT_TYPES.join(', ')}`,
  })
  consentType: string;
}

export class RevokeConsentDto {
  @ApiProperty({
    description: 'Type of consent to revoke',
    enum: VALID_CONSENT_TYPES,
    example: 'marketing',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(VALID_CONSENT_TYPES, {
    message: `consentType must be one of: ${VALID_CONSENT_TYPES.join(', ')}`,
  })
  consentType: string;
}
