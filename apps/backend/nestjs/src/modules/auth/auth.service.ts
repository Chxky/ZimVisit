import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { BruteForceGuard } from '../../common/security/brute-force.guard';
import { SecurityEventService } from '../../common/security/security-event.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly securityEventService: SecurityEventService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto, ip?: string) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      if (ip) {
        BruteForceGuard.recordFailure(ip);
        this.securityEventService.logEvent({
          type: 'failed_login',
          ip,
          details: `Failed login attempt for email: ${dto.email} (user not found)`,
        });
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      if (ip) {
        BruteForceGuard.recordFailure(ip);
        this.securityEventService.logEvent({
          type: 'failed_login',
          ip,
          userId: user.id,
          details: `Failed login attempt for email: ${dto.email} (invalid password)`,
        });
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      if (ip) {
        this.securityEventService.logEvent({
          type: 'failed_login',
          ip,
          userId: user.id,
          details: `Login attempt for deactivated account: ${dto.email}`,
        });
      }
      throw new UnauthorizedException('Account is deactivated');
    }

    // Clear failures on successful login
    if (ip) {
      BruteForceGuard.clearFailures(ip);
    }

    const tokens = await this.generateTokens(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      operatorId: user.operatorId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { password, ...rest } = user;
    return rest;
  }
}
