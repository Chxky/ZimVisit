import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LevyCalculatorService } from './levy-calculator.service';

describe('LevyCalculatorService', () => {
  let service: LevyCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LevyCalculatorService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: string) => {
              if (key === 'TOURISM_LEVY_RATE') return '0.02';
              if (key === 'VAT_RATE') return '0.15';
              if (key === 'BSP_PLATFORM_FEE') return '0.03';
              return defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<LevyCalculatorService>(LevyCalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateLevy', () => {
    it('should calculate tourism levy (2%) correctly and round to 2 decimal places', () => {
      expect(service.calculateLevy(100)).toBe(2);
      expect(service.calculateLevy(1000)).toBe(20);
      expect(service.calculateLevy(250.75)).toBe(5.01); // Float precision: 250.75 * 0.02 * 100 is 501.4999... -> 5.01
    });
  });

  describe('calculateVAT', () => {
    it('should calculate VAT (15%) correctly and round to 2 decimal places', () => {
      expect(service.calculateVAT(100)).toBe(15);
      expect(service.calculateVAT(250.75)).toBe(37.61); // 250.75 * 0.15 = 37.6125 -> rounded to 37.61
    });
  });

  describe('calculateBSPFee', () => {
    it('should calculate BSP fee (3%) correctly and round to 2 decimal places', () => {
      expect(service.calculateBSPFee(100)).toBe(3);
      expect(service.calculateBSPFee(250.75)).toBe(7.52); // 250.75 * 0.03 = 7.5225 -> rounded to 7.52
    });
  });

  describe('calculateAll', () => {
    it('should calculate all levy, VAT, and fees correctly and aggregate net amounts', () => {
      const result = service.calculateAll(1000);
      expect(result).toEqual({
        grossAmount: 1000,
        levy: 20,
        vat: 150,
        bspFee: 30,
        totalDeductions: 200,
        netAmount: 800,
        levyRate: 0.02,
        vatRate: 0.15,
        bspFeeRate: 0.03,
      });
    });
  });
});
