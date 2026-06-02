import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SecurityEventService } from '../../common/security/security-event.service';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMock: any;
  let jwtServiceMock: any;
  let securityEventServiceMock: any;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    password: '$2b$12$hashedpassword',
    role: 'traveler',
    isActive: true,
    operatorId: null,
  };

  beforeEach(async () => {
    usersServiceMock = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    jwtServiceMock = {
      signAsync: jest.fn(),
      verify: jest.fn(),
    };

    securityEventServiceMock = {
      logEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: SecurityEventService, useValue: securityEventServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$12$hashedpassword');
      usersServiceMock.create.mockResolvedValue(mockUser);
      jwtServiceMock.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const dto = { email: 'test@example.com', password: 'password123', fullName: 'Test User' };
      const result = await service.register(dto);

      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(usersServiceMock.create).toHaveBeenCalled();
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.password).toBeUndefined();
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('should throw ConflictException when email already exists', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(mockUser);

      const dto = { email: 'test@example.com', password: 'password123', fullName: 'Test User' };
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtServiceMock.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const dto = { email: 'test@example.com', password: 'password123' };
      const result = await service.login(dto);

      expect(result.user.email).toBe('test@example.com');
      expect(result.user.password).toBeUndefined();
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(null);

      const dto = { email: 'wrong@example.com', password: 'password123' };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const dto = { email: 'test@example.com', password: 'wrongpassword' };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when account is deactivated', async () => {
      const deactivatedUser = { ...mockUser, isActive: false };
      usersServiceMock.findByEmail.mockResolvedValue(deactivatedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const dto = { email: 'test@example.com', password: 'password123' };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully with valid token', async () => {
      jwtServiceMock.verify.mockReturnValue({ sub: 'user-1', email: 'test@example.com', role: 'traveler' });
      usersServiceMock.findById.mockResolvedValue(mockUser);
      jwtServiceMock.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      const result = await service.refreshToken('valid-token');

      expect(jwtServiceMock.verify).toHaveBeenCalledWith('valid-token');
      expect(usersServiceMock.findById).toHaveBeenCalledWith('user-1');
      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      jwtServiceMock.verify.mockImplementation(() => { throw new Error('invalid token'); });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('sanitizeUser', () => {
    it('should strip password from user response', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      usersServiceMock.create.mockResolvedValue(mockUser);
      jwtServiceMock.signAsync.mockResolvedValue('token');

      const dto = { email: 'test@example.com', password: 'password123', fullName: 'Test User' };
      const result = await service.register(dto);

      expect(result.user).not.toHaveProperty('password');
      expect(result.user).toHaveProperty('email', 'test@example.com');
      expect(result.user).toHaveProperty('id', 'user-1');
    });
  });
});
