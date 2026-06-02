import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  operatorId: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @Column('text', { array: true, nullable: true })
  amenities: string[];

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'simple-json', nullable: true })
  roomTypes: Record<string, any>;

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
