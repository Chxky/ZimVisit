import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflectorMock: jest.Mocked<Reflector>;

  const mockContext = (): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  beforeEach(() => {
    reflectorMock = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new JwtAuthGuard(reflectorMock);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow public routes without authentication', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(true);

    const context = mockContext();
    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });

  it('should call super.canActivate for non-public routes', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);

    const context = mockContext();
    const superCanActivate = jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate').mockReturnValue(true);

    guard.canActivate(context);

    expect(superCanActivate).toHaveBeenCalledWith(context);

    superCanActivate.mockRestore();
  });

  describe('handleRequest', () => {
    it('should return user when valid', () => {
      const user = { id: 'user-1', email: 'test@example.com' };
      const result = guard.handleRequest(null, user);

      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException when user is null', () => {
      expect(() => guard.handleRequest(null, null)).toThrow(UnauthorizedException);
    });

    it('should throw the original error when err is present', () => {
      const error = new Error('Token expired');

      expect(() => guard.handleRequest(error, null)).toThrow('Token expired');
    });
  });
});
