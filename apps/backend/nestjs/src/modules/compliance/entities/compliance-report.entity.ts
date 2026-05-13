import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PENDING_REVIEW = 'pending_review',
  FLAGGED = 'flagged',
}

@Entity('compliance_reports')
export class ComplianceReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookingId: string;

  @Column({ nullable: true })
  operatorId: string;

  @Column({ type: 'varchar', default: ComplianceStatus.PENDING_REVIEW })
  status: ComplianceStatus;

  @Column({ default: false })
  isCompliant: boolean;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  levyAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  vatAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  bspFee: number;

  @Column({ default: false })
  bspRouted: boolean;

  @Column({ nullable: true })
  bspReference: string;

  @Column({ default: false })
  taxesRemitted: boolean;

  @Column({ default: false })
  levyRemitted: boolean;

  @Column({ type: 'simple-json', nullable: true })
  auditTrail: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  flags: string[];

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  reviewedAt: Date;

  @Column({ nullable: true })
  reviewedBy: string;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
