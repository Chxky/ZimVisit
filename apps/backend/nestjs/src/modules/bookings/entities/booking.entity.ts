import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BookingItem } from './booking-item.entity';
import { BookingStatus } from '../dto/booking-status.enum';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  bookingReference: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  operatorId: string;

  @Column({ type: 'varchar', default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  levyAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  platformFee: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  netAmount: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'date', nullable: true })
  checkIn: string;

  @Column({ type: 'date', nullable: true })
  checkOut: string;

  @Column({ type: 'simple-json', nullable: true })
  travelerDetails: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  qrCodeData: string;

  @Column({ nullable: true })
  qrCodeUrl: string;

  @Column({ default: false })
  isCompliant: boolean;

  @Column({ nullable: true })
  complianceReportId: string;

  @Column({ nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  confirmedAt: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  @OneToMany(() => BookingItem, (item) => item.booking, { cascade: true })
  items: BookingItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
