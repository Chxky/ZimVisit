import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'fullName', 'password', 'role', 'isActive', 'operatorId', 'phone', 'createdAt', 'updatedAt', 'lastLoginAt'],
    });
  }

  async findByOperator(operatorId: string): Promise<User[]> {
    return this.userRepo.find({ where: { operatorId } });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async deactivate(id: string): Promise<void> {
    await this.userRepo.update(id, { isActive: false });
  }

  async findAll(page = 1, limit = 20): Promise<{ items: User[]; total: number }> {
    const [items, total] = await this.userRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total };
  }
}
