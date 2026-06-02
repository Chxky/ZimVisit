import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let dataSourceMock: any;

  beforeEach(async () => {
    dataSourceMock = {
      query: jest.fn().mockResolvedValue([{ 1: 1 }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return service health statistics in basic check', () => {
      const result = controller.check();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('service', 'zimvisit-api');
    });
  });

  describe('liveness', () => {
    it('should verify liveness of the service', () => {
      const result = controller.liveness();
      expect(result).toHaveProperty('status', 'alive');
    });
  });

  describe('readiness', () => {
    it('should return unready if Redis or DB is disconnected', async () => {
      // Mock checkTcpConnection to reject so Redis shows disconnected
      jest.spyOn(controller as any, 'checkTcpConnection').mockRejectedValue(new Error('Connection failed'));

      const result = await controller.readiness();
      expect(result.status).toBe('unready');
      expect(result.database).toBe('connected');
      expect(result.redis).toContain('disconnected');
    });

    it('should return ready if both DB and Redis are active', async () => {
      // Mock checkTcpConnection to resolve successfully
      jest.spyOn(controller as any, 'checkTcpConnection').mockResolvedValue(undefined);

      const result = await controller.readiness();
      expect(result.status).toBe('ready');
      expect(result.database).toBe('connected');
      expect(result.redis).toBe('connected');
    });
  });
});
