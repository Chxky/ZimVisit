import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum OperatorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

@Entity('operators')
export class Operator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  businessName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ default: 'Zimbabwe' })
  country: string;

  @Column({ nullable: true, unique: true })
  licenseNumber: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ type: 'varchar', default: OperatorStatus.PENDING_VERIFICATION })
  status: OperatorStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  complianceRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  riskScore: number;

  @Column({ default: false })
  bspConnected: boolean;

  @Column({ nullable: true })
  bspReference: string;

  @Column({ type: 'simple-json', nullable: true })
  paymentProviders: string[];

  @Column({ type: 'simple-json', nullable: true })
  settings: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  verifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
