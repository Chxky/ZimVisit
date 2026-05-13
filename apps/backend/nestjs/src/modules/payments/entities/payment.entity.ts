import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum PaymentProvider {
  PAYNOW = 'paynow',
  ECOCASH = 'ecocash',
  STRIPE = 'stripe',
  CARD = 'card',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookingId: string;

  @Column({ unique: true, nullable: true })
  transactionReference: string;

  @Column({ type: 'varchar' })
  provider: PaymentProvider;

  @Column({ type: 'varchar', default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  fees: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  providerReference: string;

  @Column({ nullable: true })
  providerStatus: string;

  @Column({ type: 'simple-json', nullable: true })
  providerResponse: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
