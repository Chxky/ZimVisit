import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1717000000000 implements MigrationInterface {
  name = 'InitialSchema1717000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enums
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "user_role" AS ENUM ('traveler', 'operator', 'operator_agent', 'operator_admin', 'zta_official', 'zimra_official', 'system_admin');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "booking_status" AS ENUM ('pending', 'pending_payment', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded', 'partially_refunded');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "payment_provider" AS ENUM ('paynow', 'ecocash', 'stripe', 'card');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "payment_status" AS ENUM ('pending', 'processing', 'success', 'failed', 'refunded', 'partially_refunded');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "compliance_status" AS ENUM ('compliant', 'non_compliant', 'pending_review', 'flagged');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "operator_status" AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "notification_type" AS ENUM ('booking_update', 'payment_update', 'compliance_alert', 'system', 'promotion');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    // Users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "full_name" VARCHAR(255) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "role" user_role NOT NULL DEFAULT 'traveler',
        "phone" VARCHAR(50) UNIQUE,
        "avatar_url" TEXT,
        "is_active" BOOLEAN DEFAULT true,
        "operator_id" UUID,
        "metadata" JSONB DEFAULT '{}',
        "preferences" JSONB DEFAULT '{}',
        "last_login_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Operators table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "operators" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(255) NOT NULL,
        "business_name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "phone" VARCHAR(50),
        "address" TEXT,
        "city" VARCHAR(100),
        "country" VARCHAR(100) DEFAULT 'Zimbabwe',
        "license_number" VARCHAR(100) UNIQUE,
        "tax_id" VARCHAR(100),
        "status" operator_status DEFAULT 'pending_verification',
        "compliance_rate" DECIMAL(5,2) DEFAULT 0,
        "risk_score" DECIMAL(5,2) DEFAULT 0,
        "bsp_connected" BOOLEAN DEFAULT false,
        "bsp_reference" VARCHAR(255),
        "payment_providers" JSONB DEFAULT '[]',
        "settings" JSONB DEFAULT '{}',
        "metadata" JSONB DEFAULT '{}',
        "verified_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Bookings table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bookings" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "booking_reference" VARCHAR(20) UNIQUE NOT NULL,
        "user_id" UUID NOT NULL REFERENCES "users"("id"),
        "operator_id" UUID REFERENCES "operators"("id"),
        "status" booking_status DEFAULT 'pending',
        "total_amount" DECIMAL(12,2) NOT NULL,
        "tax_amount" DECIMAL(12,2) DEFAULT 0,
        "levy_amount" DECIMAL(12,2) DEFAULT 0,
        "platform_fee" DECIMAL(12,2) DEFAULT 0,
        "net_amount" DECIMAL(12,2) NOT NULL,
        "currency" VARCHAR(3) DEFAULT 'USD',
        "check_in" DATE,
        "check_out" DATE,
        "traveler_details" JSONB DEFAULT '{}',
        "metadata" JSONB DEFAULT '{}',
        "qr_code_data" TEXT,
        "qr_code_url" TEXT,
        "is_compliant" BOOLEAN DEFAULT false,
        "compliance_report_id" UUID,
        "paid_at" TIMESTAMP WITH TIME ZONE,
        "confirmed_at" TIMESTAMP WITH TIME ZONE,
        "cancelled_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Booking items table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "booking_items" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "booking_id" UUID NOT NULL REFERENCES "bookings"("id") ON DELETE CASCADE,
        "item_type" VARCHAR(50) NOT NULL,
        "item_id" VARCHAR(255),
        "item_name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "start_date" DATE,
        "end_date" DATE,
        "price" DECIMAL(12,2) NOT NULL,
        "tax" DECIMAL(12,2) DEFAULT 0,
        "quantity" INTEGER DEFAULT 1,
        "provider_details" JSONB DEFAULT '{}',
        "gds_data" JSONB DEFAULT '{}',
        "addons" JSONB DEFAULT '{}',
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Payments table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "payments" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "booking_id" UUID NOT NULL REFERENCES "bookings"("id"),
        "transaction_reference" VARCHAR(255) UNIQUE,
        "provider" payment_provider NOT NULL,
        "status" payment_status DEFAULT 'pending',
        "amount" DECIMAL(12,2) NOT NULL,
        "fees" DECIMAL(12,2) DEFAULT 0,
        "currency" VARCHAR(3) DEFAULT 'USD',
        "provider_reference" VARCHAR(255),
        "provider_status" VARCHAR(100),
        "provider_response" JSONB DEFAULT '{}',
        "metadata" JSONB DEFAULT '{}',
        "paid_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Tours table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tours" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "operator_id" UUID NOT NULL REFERENCES "operators"("id"),
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "price" DECIMAL(10,2) NOT NULL,
        "currency" VARCHAR(3) DEFAULT 'USD',
        "images" TEXT[] DEFAULT '{}',
        "categories" VARCHAR[] DEFAULT '{}',
        "duration" VARCHAR(100),
        "location" VARCHAR(255),
        "meeting_point" VARCHAR(255),
        "max_capacity" INTEGER,
        "booked_count" INTEGER DEFAULT 0,
        "is_active" BOOLEAN DEFAULT true,
        "inclusions" TEXT[] DEFAULT '{}',
        "exclusions" TEXT[] DEFAULT '{}',
        "availability" JSONB DEFAULT '{}',
        "metadata" JSONB DEFAULT '{}',
        "rating" DECIMAL(2,1) DEFAULT 0,
        "review_count" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Hotels table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "hotels" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "operator_id" UUID NOT NULL REFERENCES "operators"("id"),
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "city" VARCHAR(100),
        "country" VARCHAR(100) DEFAULT 'Zimbabwe',
        "images" TEXT[] DEFAULT '{}',
        "amenities" TEXT[] DEFAULT '{}',
        "is_active" BOOLEAN DEFAULT false,
        "room_types" JSONB DEFAULT '{}',
        "metadata" JSONB DEFAULT '{}',
        "rating" DECIMAL(2,1) DEFAULT 0,
        "review_count" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Compliance reports table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "compliance_reports" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "booking_id" UUID NOT NULL REFERENCES "bookings"("id"),
        "operator_id" UUID REFERENCES "operators"("id"),
        "status" compliance_status DEFAULT 'pending_review',
        "is_compliant" BOOLEAN DEFAULT false,
        "levy_amount" DECIMAL(12,2) DEFAULT 0,
        "vat_amount" DECIMAL(12,2) DEFAULT 0,
        "bsp_fee" DECIMAL(12,2) DEFAULT 0,
        "bsp_routed" BOOLEAN DEFAULT false,
        "bsp_reference" VARCHAR(255),
        "taxes_remitted" BOOLEAN DEFAULT false,
        "levy_remitted" BOOLEAN DEFAULT false,
        "audit_trail" JSONB DEFAULT '{}',
        "flags" TEXT[] DEFAULT '{}',
        "metadata" JSONB DEFAULT '{}',
        "reviewed_at" TIMESTAMP WITH TIME ZONE,
        "reviewed_by" UUID REFERENCES "users"("id"),
        "notes" TEXT,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Audit logs table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "action" VARCHAR(255) NOT NULL,
        "entity_type" VARCHAR(255) NOT NULL,
        "entity_id" VARCHAR(255) NOT NULL,
        "user_id" VARCHAR(255) NOT NULL,
        "user_email" VARCHAR(255),
        "changes" JSONB DEFAULT '{}',
        "ip_address" VARCHAR(45),
        "user_agent" TEXT,
        "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // User consents table (GDPR)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_consents" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" VARCHAR(255) NOT NULL,
        "consent_type" VARCHAR(100) NOT NULL,
        "granted" BOOLEAN NOT NULL DEFAULT true,
        "revoked_at" TIMESTAMP WITH TIME ZONE,
        "ip_address" VARCHAR(45),
        "user_agent" TEXT,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Notifications table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "operator_id" UUID REFERENCES "operators"("id"),
        "title" VARCHAR(255) NOT NULL,
        "message" TEXT NOT NULL,
        "type" notification_type DEFAULT 'system',
        "reference_id" UUID,
        "reference_type" VARCHAR(50),
        "is_read" BOOLEAN DEFAULT false,
        "metadata" JSONB DEFAULT '{}',
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Revenue log table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "revenue_log" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "date" DATE NOT NULL,
        "total_revenue" DECIMAL(14,2) DEFAULT 0,
        "platform_revenue" DECIMAL(14,2) DEFAULT 0,
        "bsp_revenue" DECIMAL(14,2) DEFAULT 0,
        "tax_collected" DECIMAL(14,2) DEFAULT 0,
        "levy_collected" DECIMAL(14,2) DEFAULT 0,
        "leakage_estimated" DECIMAL(14,2) DEFAULT 0,
        "booking_count" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Indexes
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users"("role");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_users_operator" ON "users"("operator_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_operators_status" ON "operators"("status");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_operators_license" ON "operators"("license_number");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_bookings_reference" ON "bookings"("booking_reference");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_bookings_user" ON "bookings"("user_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_bookings_operator" ON "bookings"("operator_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_bookings_status" ON "bookings"("status");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_bookings_created" ON "bookings"("created_at");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_bookings_compliant" ON "bookings"("is_compliant");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_booking_items_booking" ON "booking_items"("booking_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_payments_booking" ON "payments"("booking_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_payments_transaction" ON "payments"("transaction_reference");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_tours_operator" ON "tours"("operator_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_tours_location" ON "tours"("location");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_tours_active" ON "tours"("is_active");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_compliance_booking" ON "compliance_reports"("booking_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_compliance_operator" ON "compliance_reports"("operator_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_compliance_status" ON "compliance_reports"("status");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_audit_action" ON "audit_logs"("action");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_audit_entity" ON "audit_logs"("entity_type", "entity_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_audit_user" ON "audit_logs"("user_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_audit_timestamp" ON "audit_logs"("timestamp");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_user_consents_user" ON "user_consents"("user_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_notifications_user" ON "notifications"("user_id");`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "idx_revenue_date" ON "revenue_log"("date");`);

    // Updated_at triggers
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    const tablesWithUpdatedAt = ['users', 'bookings', 'payments', 'operators', 'compliance_reports', 'tours', 'hotels'];
    for (const table of tablesWithUpdatedAt) {
      await queryRunner.query(`
        DO $$ BEGIN
          CREATE TRIGGER ${table}_updated_at BEFORE UPDATE ON "${table}" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_consents" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "revenue_log" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "compliance_reports" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "hotels" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tours" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payments" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "booking_items" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "bookings" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "operators" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "notification_type";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "operator_status";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "compliance_status";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_status";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_provider";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "booking_status";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role";`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at();`);
  }
}
