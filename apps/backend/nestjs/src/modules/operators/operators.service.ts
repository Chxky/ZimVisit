import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operator } from './entities/operator.entity';

@Injectable()
export class OperatorsService {
  constructor(
    @InjectRepository(Operator)
    private readonly operatorRepo: Repository<Operator>,
  ) {}

  async findAll(page = 1, limit = 20) {
    const [items, total] = await this.operatorRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total, page, limit };
  }

  async findById(id: string): Promise<Operator | null> {
    return this.operatorRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Operator | null> {
    return this.operatorRepo.findOne({ where: { email } });
  }

  async create(data: Partial<Operator>): Promise<Operator> {
    const operator = this.operatorRepo.create(data);
    return this.operatorRepo.save(operator);
  }

  async update(id: string, data: Partial<Operator>): Promise<Operator> {
    const operator = await this.findById(id);
    if (!operator) throw new NotFoundException('Operator not found');
    Object.assign(operator, data);
    return this.operatorRepo.save(operator);
  }

  async getComplianceStats() {
    const total = await this.operatorRepo.count();
    const active = await this.operatorRepo.count({ where: { status: 'active' as any } });
    const pending = await this.operatorRepo.count({ where: { status: 'pending_verification' as any } });
    return { total, active, pending };
  }
}
