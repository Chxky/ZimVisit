import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LevyCalculatorService {
  private readonly tourismLevyRate: number;
  private readonly vatRate: number;
  private readonly bspFeeRate: number;

  constructor(private readonly config: ConfigService) {
    this.tourismLevyRate = parseFloat(config.get('TOURISM_LEVY_RATE', '0.02'));
    this.vatRate = parseFloat(config.get('VAT_RATE', '0.15'));
    this.bspFeeRate = parseFloat(config.get('BSP_PLATFORM_FEE', '0.03'));
  }

  calculateLevy(amount: number): number {
    return Math.round(amount * this.tourismLevyRate * 100) / 100;
  }

  calculateVAT(amount: number): number {
    return Math.round(amount * this.vatRate * 100) / 100;
  }

  calculateBSPFee(amount: number): number {
    return Math.round(amount * this.bspFeeRate * 100) / 100;
  }

  calculateAll(amount: number) {
    return {
      grossAmount: amount,
      levy: this.calculateLevy(amount),
      vat: this.calculateVAT(amount),
      bspFee: this.calculateBSPFee(amount),
      totalDeductions: this.calculateLevy(amount) + this.calculateVAT(amount) + this.calculateBSPFee(amount),
      netAmount: amount - this.calculateLevy(amount) - this.calculateVAT(amount) - this.calculateBSPFee(amount),
      levyRate: this.tourismLevyRate,
      vatRate: this.vatRate,
      bspFeeRate: this.bspFeeRate,
    };
  }
}
