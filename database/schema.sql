-- ZimVisit Database Schema
-- PostgreSQL 15+

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS
-- =====================================================
CREATE TYPE user_role AS ENUM ('traveler', 'operator', 'operator_agent', 'operator_admin', 'zta_official', 'zimra_official', 'system_admin');
CREATE TYPE booking_status AS ENUM ('pending', 'pending_payment', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded', 'partially_refunded');
CREATE TYPE payment_provider AS ENUM ('paynow', 'ecocash', 'stripe', 'card');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'success', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE compliance_status AS ENUM ('compliant', 'non_compliant', 'pending_review', 'flagged');
CREATE TYPE operator_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE notification_type AS ENUM ('booking_update', 'payment_update', 'compliance_alert', 'system', 'promotion');

-- =====================================================
-- USERS & AUTH
-- =====================================================
CREATE TABLE users (
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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_operator ON users(operator_id);

-- =====================================================
-- OPERATORS
-- =====================================================
CREATE TABLE operators (
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

CREATE INDEX idx_operators_status ON operators(status);
CREATE INDEX idx_operators_license ON operators(license_number);

-- =====================================================
-- BOOKINGS
-- =====================================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    operator_id UUID REFERENCES operators(id),
    status booking_status DEFAULT 'pending',
    total_amount DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    levy_amount DECIMAL(12,2) DEFAULT 0,
    platform_fee DECIMAL(12,2) DEFAULT 0,
    net_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    check_in DATE,
    check_out DATE,
    traveler_details JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    qr_code_data TEXT,
    qr_code_url TEXT,
    is_compliant BOOLEAN DEFAULT false,
    compliance_report_id UUID,
    paid_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_operator ON bookings(operator_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created ON bookings(created_at);
CREATE INDEX idx_bookings_compliant ON bookings(is_compliant);

-- Booking Items
CREATE TABLE booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    item_id VARCHAR(255),
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    price DECIMAL(12,2) NOT NULL,
    tax DECIMAL(12,2) DEFAULT 0,
    quantity INTEGER DEFAULT 1,
    provider_details JSONB DEFAULT '{}',
    gds_data JSONB DEFAULT '{}',
    addons JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_booking_items_booking ON booking_items(booking_id);

-- =====================================================
-- PAYMENTS
-- =====================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    transaction_reference VARCHAR(255) UNIQUE,
    provider payment_provider NOT NULL,
    status payment_status DEFAULT 'pending',
    amount DECIMAL(12,2) NOT NULL,
    fees DECIMAL(12,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    provider_reference VARCHAR(255),
    provider_status VARCHAR(100),
    provider_response JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_transaction ON payments(transaction_reference);

-- =====================================================
-- INVENTORY
-- =====================================================
CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    images TEXT[] DEFAULT '{}',
    categories VARCHAR[] DEFAULT '{}',
    duration VARCHAR(100),
    location VARCHAR(255),
    meeting_point VARCHAR(255),
    max_capacity INTEGER,
    booked_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    inclusions TEXT[] DEFAULT '{}',
    exclusions TEXT[] DEFAULT '{}',
    availability JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tours_operator ON tours(operator_id);
CREATE INDEX idx_tours_location ON tours(location);
CREATE INDEX idx_tours_active ON tours(is_active);

CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Zimbabwe',
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT false,
    room_types JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMPLIANCE
-- =====================================================
CREATE TABLE compliance_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    operator_id UUID REFERENCES operators(id),
    status compliance_status DEFAULT 'pending_review',
    is_compliant BOOLEAN DEFAULT false,
    levy_amount DECIMAL(12,2) DEFAULT 0,
    vat_amount DECIMAL(12,2) DEFAULT 0,
    bsp_fee DECIMAL(12,2) DEFAULT 0,
    bsp_routed BOOLEAN DEFAULT false,
    bsp_reference VARCHAR(255),
    taxes_remitted BOOLEAN DEFAULT false,
    levy_remitted BOOLEAN DEFAULT false,
    audit_trail JSONB DEFAULT '{}',
    flags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_compliance_booking ON compliance_reports(booking_id);
CREATE INDEX idx_compliance_operator ON compliance_reports(operator_id);
CREATE INDEX idx_compliance_status ON compliance_reports(status);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    operator_id UUID REFERENCES operators(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'system',
    reference_id UUID,
    reference_type VARCHAR(50),
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- =====================================================
-- REVENUE LOG (for government analytics)
-- =====================================================
CREATE TABLE revenue_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    total_revenue DECIMAL(14,2) DEFAULT 0,
    platform_revenue DECIMAL(14,2) DEFAULT 0,
    bsp_revenue DECIMAL(14,2) DEFAULT 0,
    tax_collected DECIMAL(14,2) DEFAULT 0,
    levy_collected DECIMAL(14,2) DEFAULT 0,
    leakage_estimated DECIMAL(14,2) DEFAULT 0,
    booking_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_revenue_date ON revenue_log(date);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;

-- Users can see their own data
CREATE POLICY user_self_access ON users
    FOR ALL USING (id = current_setting('app.current_user_id')::UUID);

-- Operators see their own bookings
CREATE POLICY operator_booking_access ON bookings
    FOR ALL USING (operator_id = current_setting('app.current_operator_id')::UUID);

-- Government sees all bookings
CREATE POLICY government_booking_access ON bookings
    FOR SELECT USING (current_setting('app.current_user_role') IN ('zta_official', 'zimra_official', 'system_admin'));

-- =====================================================
-- TRIGGER: Auto-update updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER operators_updated_at BEFORE UPDATE ON operators FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER compliance_updated_at BEFORE UPDATE ON compliance_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tours_updated_at BEFORE UPDATE ON tours FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER hotels_updated_at BEFORE UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- SEED DATA
-- =====================================================
INSERT INTO revenue_log (date, total_revenue, platform_revenue, bsp_revenue, tax_collected, levy_collected, leakage_estimated, booking_count)
SELECT
    d::date,
    (random() * 50000 + 30000)::numeric(14,2),
    (random() * 35000 + 20000)::numeric(14,2),
    (random() * 25000 + 15000)::numeric(14,2),
    (random() * 7500 + 4500)::numeric(14,2),
    (random() * 1000 + 600)::numeric(14,2),
    (random() * 8000 + 4000)::numeric(14,2),
    (random() * 15 + 5)::int
FROM generate_series('2026-01-01'::date, '2026-05-11'::date, '1 day'::interval) AS d;
