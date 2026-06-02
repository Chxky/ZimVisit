import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID generation
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // Create enum types
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('traveler', 'operator', 'operator_agent', 'operator_admin', 'zta_official', 'zimra_official', 'system_admin');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE booking_status AS ENUM ('pending', 'pending_payment', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded', 'partially_refunded');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE payment_provider AS ENUM ('paynow', 'ecocash', 'stripe', 'card');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'success', 'failed', 'refunded', 'partially_refunded');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE compliance_status AS ENUM ('compliant', 'non_compliant', 'pending_review', 'flagged');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE operator_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE notification_type AS ENUM ('booking_update', 'payment_update', 'compliance_alert', 'system', 'promotion');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    // Users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role user_role NOT NULL DEFAULT 'traveler',
        phone VARCHAR(50) UNIQUE,
        avatar_url TEXT,
        is_active BOOLEAN DEFAULT true,
        operator_id UUID,
        metadata JSONB DEFAULT '{}',
        preferences JSONB DEFAULT '{}',
        last_login_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_users_operator ON users(operator_id)`);

    // Operators table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS operators (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        business_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        city VARCHAR(100),
        country VARCHAR(100) DEFAULT 'Zimbabwe',
        license_number VARCHAR(100) UNIQUE,
        tax_id VARCHAR(100),
        status operator_status DEFAULT 'pending_verification',
        compliance_rate DECIMAL(5,2) DEFAULT 0,
        risk_score DECIMAL(5,2) DEFAULT 0,
        bsp_connected BOOLEAN DEFAULT false,
        bsp_reference VARCHAR(255),
        payment_providers JSONB DEFAULT '[]',
        settings JSONB DEFAULT '{}',
        metadata JSONB DEFAULT '{}',
        verified_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_operators_status ON operators(status)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_operators_license ON operators(license_number)`);

    // Bookings table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        booking_reference VARCHAR(20) UNIQUE NOT NULL,
        user_id UUID NOT NULL REFERENCES users(id),
        operator_id UUID REFERENCES operators(id),
        status booking_status NOT NULL DEFAULT 'pending',
        total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
        levy_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
        tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
        platform_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
        net_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
        currency VARCHAR(3) DEFAULT 'USD',
        qr_code TEXT,
        travel_date DATE,
        return_date DATE,
        destination VARCHAR(255),
        notes TEXT,
        metadata JSONB DEFAULT '{}',
        paid_at TIMESTAMP WITH TIME ZONE,
        cancelled_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_bookings_operator ON bookings(operator_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date)`);

    // Booking items table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS booking_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        item_type VARCHAR(50) NOT NULL,
        item_id UUID,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        quantity INTEGER DEFAULT 1,
        unit_price DECIMAL(12,2) NOT NULL,
        total_price DECIMAL(12,2) NOT NULL,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_booking_items_booking ON booking_items(booking_id)`);

    // Payments table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        booking_id UUID NOT NULL REFERENCES bookings(id),
        provider payment_provider NOT NULL,
        status payment_status NOT NULL DEFAULT 'pending',
        amount DECIMAL(12,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        transaction_reference VARCHAR(255),
        provider_reference VARCHAR(255),
        provider_response JSONB DEFAULT '{}',
        metadata JSONB DEFAULT '{}',
        paid_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(transaction_reference)`);

    // Tours table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tours (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        operator_id UUID REFERENCES operators(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        destination VARCHAR(255),
        duration_hours INTEGER,
        price DECIMAL(12,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        max_participants INTEGER,
        image_url TEXT,
        gallery JSONB DEFAULT '[]',
        includes JSONB DEFAULT '[]',
        excludes JSONB DEFAULT '[]',
        difficulty VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_tours_operator ON tours(operator_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_tours_category ON tours(category)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_tours_destination ON tours(destination)`);

    // Hotels table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        operator_id UUID REFERENCES operators(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        address TEXT,
        city VARCHAR(100),
        country VARCHAR(100) DEFAULT 'Zimbabwe',
        star_rating INTEGER,
        price_from DECIMAL(12,2),
        currency VARCHAR(3) DEFAULT 'USD',
        image_url TEXT,
        gallery JSONB DEFAULT '[]',
        amenities JSONB DEFAULT '[]',
        is_active BOOLEAN DEFAULT true,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_hotels_operator ON hotels(operator_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city)`);

    // Compliance reports table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS compliance_reports (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        booking_id UUID NOT NULL REFERENCES bookings(id),
        operator_id UUID REFERENCES operators(id),
        status compliance_status NOT NULL DEFAULT 'pending_review',
        levy_amount DECIMAL(12,2) DEFAULT 0,
        vat_amount DECIMAL(12,2) DEFAULT 0,
        bsp_fee DECIMAL(12,2) DEFAULT 0,
        bsp_routed BOOLEAN DEFAULT false,
        bsp_reference VARCHAR(255),
        taxes_remitted BOOLEAN DEFAULT false,
        levy_remitted BOOLEAN DEFAULT false,
        is_compliant BOOLEAN DEFAULT false,
        risk_score DECIMAL(5,2) DEFAULT 0,
        audit_trail JSONB DEFAULT '{}',
        reviewed_by UUID REFERENCES users(id),
        reviewed_at TIMESTAMP WITH TIME ZONE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_compliance_booking ON compliance_reports(booking_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_compliance_operator ON compliance_reports(operator_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_compliance_status ON compliance_reports(status)`);

    // Notifications table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id),
        type notification_type NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT false,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read)`);

    // Revenue log table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS revenue_log (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        date DATE NOT NULL,
        total_revenue DECIMAL(12,2) DEFAULT 0,
        levy_collected DECIMAL(12,2) DEFAULT 0,
        vat_collected DECIMAL(12,2) DEFAULT 0,
        bsp_fees DECIMAL(12,2) DEFAULT 0,
        bookings_count INTEGER DEFAULT 0,
        compliance_rate DECIMAL(5,2) DEFAULT 0,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_revenue_log_date ON revenue_log(date)`);

    // Audit log table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id UUID,
        user_id UUID,
        user_email VARCHAR(255),
        changes JSONB DEFAULT '{}',
        ip_address VARCHAR(45),
        user_agent TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp)`);

    // User consents table (for GDPR/data protection)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_consents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id),
        consent_type VARCHAR(100) NOT NULL,
        granted BOOLEAN NOT NULL DEFAULT true,
        revoked_at TIMESTAMP WITH TIME ZONE,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_consents_user ON user_consents(user_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_consents_type ON user_consents(consent_type)`);

    // Updated_at trigger function
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Apply triggers to tables with updated_at
    const tablesWithUpdatedAt = ['users', 'operators', 'bookings', 'payments', 'tours', 'hotels', 'compliance_reports'];
    for (const table of tablesWithUpdatedAt) {
      await queryRunner.query(`
        DO $$ BEGIN
          CREATE TRIGGER update_${table}_updated_at
            BEFORE UPDATE ON ${table}
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    const tablesWithUpdatedAt = ['users', 'operators', 'bookings', 'payments', 'tours', 'hotels', 'compliance_reports'];
    for (const table of tablesWithUpdatedAt) {
      await queryRunner.query(`DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table}`);
    }
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column()`);

    // Drop tables in reverse order (respecting foreign keys)
    await queryRunner.query(`DROP TABLE IF EXISTS user_consents`);
    await queryRunner.query(`DROP TABLE IF EXISTS audit_logs`);
    await queryRunner.query(`DROP TABLE IF EXISTS revenue_log`);
    await queryRunner.query(`DROP TABLE IF EXISTS notifications`);
    await queryRunner.query(`DROP TABLE IF EXISTS compliance_reports`);
    await queryRunner.query(`DROP TABLE IF EXISTS hotels`);
    await queryRunner.query(`DROP TABLE IF EXISTS tours`);
    await queryRunner.query(`DROP TABLE IF EXISTS payments`);
    await queryRunner.query(`DROP TABLE IF EXISTS booking_items`);
    await queryRunner.query(`DROP TABLE IF EXISTS bookings`);
    await queryRunner.query(`DROP TABLE IF EXISTS operators`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE IF EXISTS notification_type`);
    await queryRunner.query(`DROP TYPE IF EXISTS operator_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS compliance_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS payment_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS payment_provider`);
    await queryRunner.query(`DROP TYPE IF EXISTS booking_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role`);
  }
}
