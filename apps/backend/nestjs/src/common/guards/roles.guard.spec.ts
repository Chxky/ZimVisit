import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../interfaces/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflectorMock: jest.Mocked<Reflector>;

  const mockContext = (user?: any): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
      }),
    } as any;
  };

  beforeEach(() => {
    reflectorMock = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new RolesGuard(reflectorMock);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles are required', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);

    const context = mockContext({ role: UserRole.TRAVELER });
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should allow access when user has a matching role', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([UserRole.OPERATOR, UserRole.TRAVELER]);

    const context = mockContext({ role: UserRole.TRAVELER });
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access when user has wrong role', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([UserRole.SYSTEM_ADMIN]);

    const context = mockContext({ role: UserRole.TRAVELER });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should deny access when no user in request', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([UserRole.SYSTEM_ADMIN]);

    const context = mockContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
