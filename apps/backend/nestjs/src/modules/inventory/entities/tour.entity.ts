import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  operatorId: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  currency: string;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @Column('text', { array: true, nullable: true })
  categories: string[];

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  meetingPoint: string;

  @Column({ nullable: true })
  maxCapacity: number;

  @Column({ default: 0 })
  bookedCount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'simple-json', nullable: true })
  inclusions: string[];

  @Column({ type: 'simple-json', nullable: true })
  exclusions: string[];

  @Column({ type: 'simple-json', nullable: true })
  availability: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
