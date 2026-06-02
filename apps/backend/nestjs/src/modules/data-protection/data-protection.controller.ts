import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { DataProtectionService } from './data-protection.service';
import { GrantConsentDto } from './dto/consent.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Data Protection')
@ApiBearerAuth('access-token')
@Controller('data-protection')
export class DataProtectionController {
  constructor(
    private readonly dataProtectionService: DataProtectionService,
  ) {}

  @Post('consent')
  @ApiOperation({ summary: 'Grant a consent (terms, privacy, marketing, analytics)' })
  async grantConsent(
    @CurrentUser('id') userId: string,
    @Body() dto: GrantConsentDto,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.dataProtectionService.grantConsent(userId, dto, ip, userAgent);
  }

  @Delete('consent/:consentType')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke an active consent by type' })
  async revokeConsent(
    @CurrentUser('id') userId: string,
    @Param('consentType') consentType: string,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.dataProtectionService.revokeConsent(
      userId,
      consentType,
      ip,
      userAgent,
    );
  }

  @Get('consent')
  @ApiOperation({ summary: 'Get all consents for the current user' })
  async getUserConsents(@CurrentUser('id') userId: string) {
    return this.dataProtectionService.getUserConsents(userId);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export all user data as JSON (GDPR data portability)' })
  async exportUserData(
    @CurrentUser('id') userId: string,
    @Res() res: Response,
  ) {
    const data = await this.dataProtectionService.exportUserData(userId);

    const filename = `zimvisit-data-export-${new Date().toISOString().split('T')[0]}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`,
    );
    res.json(data);
  }

  @Delete('account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Anonymize / delete the current user account and all associated data' })
  async deleteAccount(@CurrentUser('id') userId: string) {
    return this.dataProtectionService.deleteUserData(userId);
  }
}
