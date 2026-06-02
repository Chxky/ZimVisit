import { Controller, Post, Body, HttpCode, HttpStatus, Res, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { BruteForceGuard } from '../../common/security/brute-force.guard';

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' as const : 'lax' as const,
  path: '/',
};

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
    res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken };
  }

  @Public()
  @Post('login')
  @UseGuards(BruteForceGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const ip = (req as any).clientIp || req.ip || 'unknown';
    const result = await this.authService.login(dto, ip);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken };
  }

  @Public()
  @Post('demo-login')
  @UseGuards(BruteForceGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Quick demo login by role (admin, government, operator, traveler)' })
  @ApiResponse({ status: 200, description: 'Demo login successful' })
  @ApiResponse({ status: 401, description: 'Demo user not found' })
  async demoLogin(@Body('role') role: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const demoUsers: Record<string, string> = {
      admin: 'admin@zimvisit.com',
      government: 'zta@zta.gov.zw',
      operator: 'operator@wildhorizons.co.zw',
      traveler: 'traveler@gmail.com',
    };
    const email = demoUsers[role] || demoUsers['traveler'];
    const ip = (req as any).clientIp || req.ip || 'unknown';
    const result = await this.authService.login({ email, password: 'demo123' }, ip);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body('refreshToken') token: string, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.refreshToken(token);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return result;
  }
}
