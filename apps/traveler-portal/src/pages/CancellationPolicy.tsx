// ============================================================
// ZimVisit Traveler Portal - Cancellation Policy Page
// ============================================================

import React from 'react';
import { Typography, Card, Space, Alert, Row, Col, Tag, Divider, Timeline } from 'antd';
import {
  CloseCircleOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const CancellationPolicy: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #052e16 0%, #166534 100%)',
          padding: '48px 24px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(245,158,11,0.1) 0%, transparent 50%)',
          }}
        />
        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <CloseCircleOutlined style={{ fontSize: 48, color: '#f59e0b', marginBottom: 16 }} />
          <Title level={2} style={{ color: '#ffffff', marginBottom: 8, fontWeight: 800 }}>
            Cancellation Policy
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
            Last updated: May 2026 &middot; Effective immediately upon posting
          </Text>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* Quick Summary */}
        <Alert
          message="Quick Summary"
          description="Cancel 48+ hours before your tour for a full refund. Within 48 hours, a cancellation fee may apply. Operator-initiated cancellations are always fully refunded."
          type="info"
          showIcon
          style={{ marginBottom: 32, borderRadius: 12 }}
        />

        {/* Refund Tiers */}
        <Title level={3} style={{ marginBottom: 20 }}>Refund Schedule</Title>
        <Row gutter={[20, 20]} style={{ marginBottom: 40 }}>
          <Col xs={24} sm={8}>
            <Card
              style={{
                borderRadius: 16,
                border: '2px solid #22c55e',
                textAlign: 'center',
              }}
              styles={{ body: { padding: 28 } }}
            >
              <CheckCircleFilled style={{ fontSize: 40, color: '#22c55e', marginBottom: 12 }} />
              <Title level={4} style={{ color: '#166534', marginBottom: 4 }}>Full Refund</Title>
              <Tag color="green" style={{ marginBottom: 12 }}>48+ hours before</Tag>
              <Paragraph style={{ color: '#737373', fontSize: 14, marginBottom: 0 }}>
                Cancel at least 48 hours before your scheduled tour start time and receive a 100% refund.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{
                borderRadius: 16,
                border: '2px solid #f59e0b',
                textAlign: 'center',
              }}
              styles={{ body: { padding: 28 } }}
            >
              <ExclamationCircleOutlined style={{ fontSize: 40, color: '#f59e0b', marginBottom: 12 }} />
              <Title level={4} style={{ color: '#92400e', marginBottom: 4 }}>Partial Refund</Title>
              <Tag color="gold" style={{ marginBottom: 12 }}>24-48 hours before</Tag>
              <Paragraph style={{ color: '#737373', fontSize: 14, marginBottom: 0 }}>
                Cancellations within 24-48 hours receive a 50% refund. The remaining amount covers operator preparation costs.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{
                borderRadius: 16,
                border: '2px solid #ef4444',
                textAlign: 'center',
              }}
              styles={{ body: { padding: 28 } }}
            >
              <CloseCircleOutlined style={{ fontSize: 40, color: '#ef4444', marginBottom: 12 }} />
              <Title level={4} style={{ color: '#991b1b', marginBottom: 4 }}>No Refund</Title>
              <Tag color="red" style={{ marginBottom: 12 }}>Less than 24 hours</Tag>
              <Paragraph style={{ color: '#737373', fontSize: 14, marginBottom: 0 }}>
                Cancellations within 24 hours of the tour are not eligible for a refund due to operator commitments.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        {/* Detailed Policy */}
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0' }} styles={{ body: { padding: 32 } }}>
              <Title level={3} style={{ marginBottom: 20 }}>Detailed Policy</Title>

              <Title level={5} style={{ marginTop: 20 }}>1. Traveler-Initiated Cancellations</Title>
              <Paragraph>
                You may cancel any booking through your ZimVisit dashboard. The refund amount depends on when you cancel relative to the scheduled tour start time:
              </Paragraph>
              <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
                <li><Paragraph><strong>48+ hours before:</strong> Full refund (100%) processed within 5-7 business days.</Paragraph></li>
                <li><Paragraph><strong>24-48 hours before:</strong> Partial refund (50%) processed within 7-10 business days.</Paragraph></li>
                <li><Paragraph><strong>Less than 24 hours:</strong> No refund. You may reschedule subject to availability.</Paragraph></li>
                <li><Paragraph><strong>No-show:</strong> No refund. Failure to arrive at the meeting point without prior notice is treated as a no-show.</Paragraph></li>
              </ul>

              <Title level={5} style={{ marginTop: 20 }}>2. Operator-Initiated Cancellations</Title>
              <Paragraph>
                If a tour operator cancels a booking for any reason (weather, safety, insufficient participants), you are entitled to:
              </Paragraph>
              <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
                <li><Paragraph>Full refund (100%) processed within 3-5 business days.</Paragraph></li>
                <li><Paragraph>Free rescheduling to an alternative date (subject to availability).</Paragraph></li>
                <li><Paragraph>Credit toward another ZimVisit tour of equal or lesser value.</Paragraph></li>
              </ul>

              <Title level={5} style={{ marginTop: 20 }}>3. Weather & Force Majeure</Title>
              <Paragraph>
                Tours cancelled due to severe weather conditions, natural disasters, or government restrictions are rescheduled at no additional cost. If rescheduling is not possible, a full refund is issued.
              </Paragraph>

              <Title level={5} style={{ marginTop: 20 }}>4. How to Cancel</Title>
              <Paragraph>
                To cancel a booking, log in to your ZimVisit account, go to <strong>My Bookings</strong>, select the booking, and click <strong>Cancel Booking</strong>. You can also contact our support team for assistance.
              </Paragraph>

              <Title level={5} style={{ marginTop: 20 }}>5. Refund Processing</Title>
              <Paragraph>
                Refunds are processed to the original payment method. Processing times vary by payment provider:
              </Paragraph>
              <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
                <li><Paragraph><strong>EcoCash / Paynow:</strong> 3-5 business days.</Paragraph></li>
                <li><Paragraph><strong>Visa / Mastercard (Stripe):</strong> 5-10 business days.</Paragraph></li>
              </ul>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0' }} styles={{ body: { padding: 24 } }}>
                <Title level={4} style={{ marginBottom: 16 }}>Need Help?</Title>
                <Space direction="vertical" size={12}>
                  <a href="/help" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534' }}>
                    <SafetyCertificateOutlined /> Help Center
                  </a>
                  <a href="/contact" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534' }}>
                    <MailOutlined /> Contact Us
                  </a>
                  <a href="tel:+26341234567" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534' }}>
                    <PhoneOutlined /> +263 4 123 4567
                  </a>
                </Space>
              </Card>

              <Alert
                message="Travel Insurance"
                description="We strongly recommend purchasing travel insurance to protect against unexpected cancellations, medical emergencies, and trip interruptions."
                type="warning"
                showIcon
                style={{ borderRadius: 12 }}
              />
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CancellationPolicy;
