import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Booking } from './booking.entity';

@Entity('booking_items')
export class BookingItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookingId: string;

  @ManyToOne(() => Booking, (booking) => booking.items)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column()
  itemType: string;

  @Column()
  itemId: string;

  @Column()
  itemName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  tax: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'simple-json', nullable: true })
  providerDetails: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  gdsData: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  addons: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
