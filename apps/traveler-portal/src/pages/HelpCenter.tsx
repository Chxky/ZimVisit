// ============================================================
// ZimVisit Traveler Portal - Help Center Page
// ============================================================

import React, { useState } from 'react';
import { Typography, Card, Space, Collapse, Input, Row, Col, Tag, Button } from 'antd';
import {
  QuestionCircleOutlined,
  SearchOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  TeamOutlined,
  CompassOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const FAQ_ITEMS = [
  {
    key: '1',
    label: 'How do I book a tour on ZimVisit?',
    children: (
      <Paragraph>
        Browse our <a href="/explore">Explore page</a> to find tours, click on any tour for details,
        then select your preferred date and number of travelers. Click "Book Now" and follow the
        payment prompts. You'll receive a confirmation email with your ZimPass QR code.
      </Paragraph>
    ),
  },
  {
    key: '2',
    label: 'What payment methods do you accept?',
    children: (
      <Paragraph>
        We accept EcoCash, Paynow (local Zimbabwe payments), Visa, and Mastercard via Stripe.
        All payments are processed securely in USD. Your payment information is encrypted and
        never stored on our servers.
      </Paragraph>
    ),
  },
  {
    key: '3',
    label: 'Can I cancel or modify my booking?',
    children: (
      <Paragraph>
        Yes! You can cancel or modify bookings up to 48 hours before the scheduled date for a
        full refund. Cancellations within 48 hours may incur a fee. Visit our{' '}
        <a href="/cancellation">Cancellation Policy</a> for full details.
      </Paragraph>
    ),
  },
  {
    key: '4',
    label: 'What is ZimPass?',
    children: (
      <Paragraph>
        ZimPass is your digital travel companion. After booking, you receive a QR-coded itinerary
        that serves as your digital pass for all booked activities. Show it at each destination
        for seamless check-in. Access your ZimPass from your dashboard after logging in.
      </Paragraph>
    ),
  },
  {
    key: '5',
    label: 'Is my personal information safe?',
    children: (
      <Paragraph>
        Absolutely. We comply with Zimbabwe's Cyber and Data Protection Act (2021) and
        international data protection standards. Your data is encrypted, stored securely, and
        never shared with third parties without your consent. Read our full{' '}
        <a href="/privacy">Privacy Policy</a>.
      </Paragraph>
    ),
  },
  {
    key: '6',
    label: 'How do I contact a tour operator?',
    children: (
      <Paragraph>
        Each tour page displays the operator's information. You can also reach out through our
        <a href="/contact"> Contact Us</a> page, and we'll connect you directly with the operator.
        All operators on ZimVisit are verified by the Zimbabwe Tourism Authority.
      </Paragraph>
    ),
  },
  {
    key: '7',
    label: 'Are the tours suitable for children?',
    children: (
      <Paragraph>
        Many tours are family-friendly. Check the tour details page for age recommendations and
        difficulty levels. Safari tours typically welcome children aged 6+, while adventure
        activities may have higher age requirements. Contact the operator for specific queries.
      </Paragraph>
    ),
  },
  {
    key: '8',
    label: 'What happens if a tour is cancelled by the operator?',
    children: (
      <Paragraph>
        If an operator cancels a tour, you'll receive a full refund within 5-7 business days.
        We'll also help you find an alternative tour or date. Weather-related cancellations
        are rescheduled at no extra cost.
      </Paragraph>
    ),
  },
];

const QUICK_LINKS = [
  { icon: <BookOutlined />, title: 'My Bookings', desc: 'View and manage your bookings', href: '/bookings' },
  { icon: <SafetyCertificateOutlined />, title: 'Privacy Policy', desc: 'How we protect your data', href: '/privacy' },
  { icon: <DollarOutlined />, title: 'Cancellation Policy', desc: 'Refund and cancellation terms', href: '/cancellation' },
  { icon: <MessageOutlined />, title: 'Contact Us', desc: 'Get in touch with our team', href: '/contact' },
];

const HelpCenter: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredFaq = search
    ? FAQ_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      )
    : FAQ_ITEMS;

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
          <QuestionCircleOutlined style={{ fontSize: 48, color: '#f59e0b', marginBottom: 16 }} />
          <Title level={2} style={{ color: '#ffffff', marginBottom: 8, fontWeight: 800 }}>
            Help Center
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, display: 'block', marginBottom: 24 }}>
            Find answers to frequently asked questions about ZimVisit
          </Text>
          <Input
            size="large"
            placeholder="Search for help..."
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 520, borderRadius: 12 }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* Quick Links */}
        <Row gutter={[20, 20]} style={{ marginBottom: 40 }}>
          {QUICK_LINKS.map((link) => (
            <Col xs={12} sm={6} key={link.title}>
              <a href={link.href} style={{ textDecoration: 'none' }}>
                <Card
                  hoverable
                  style={{ borderRadius: 16, textAlign: 'center', border: '1px solid #f0f0f0' }}
                  styles={{ body: { padding: '24px 16px' } }}
                >
                  <div style={{ fontSize: 28, color: '#166534', marginBottom: 8 }}>{link.icon}</div>
                  <Text style={{ fontWeight: 600, fontSize: 14, display: 'block' }}>{link.title}</Text>
                  <Text style={{ color: '#737373', fontSize: 12 }}>{link.desc}</Text>
                </Card>
              </a>
            </Col>
          ))}
        </Row>

        {/* FAQ */}
        <Title level={3} style={{ marginBottom: 20 }}>
          Frequently Asked Questions
        </Title>
        <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0' }}>
          <Collapse
            accordion
            items={filteredFaq.map((item) => ({
              key: item.key,
              label: <Text style={{ fontWeight: 600, fontSize: 15 }}>{item.label}</Text>,
              children: item.children,
            }))}
            style={{ background: 'transparent', border: 'none' }}
          />
          {filteredFaq.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Text style={{ color: '#737373' }}>No results found for "{search}"</Text>
            </div>
          )}
        </Card>

        {/* Still Need Help */}
        <Card
          style={{
            marginTop: 40,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #052e16 0%, #166534 100%)',
            border: 'none',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ color: '#ffffff', marginBottom: 8 }}>Still Need Help?</Title>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, display: 'block', marginBottom: 24 }}>
              Our support team is available Monday - Friday, 8am - 5pm (CAT)
            </Text>
            <Space size={16} wrap>
              <Button
                size="large"
                icon={<MailOutlined />}
                href="mailto:hello@zimvisit.co.zw"
                style={{ borderRadius: 10 }}
              >
                Email Us
              </Button>
              <Button
                size="large"
                icon={<PhoneOutlined />}
                href="tel:+26341234567"
                style={{ borderRadius: 10 }}
              >
                Call Us
              </Button>
              <Button
                size="large"
                type="primary"
                icon={<MessageOutlined />}
                href="/contact"
                style={{ borderRadius: 10, background: '#f59e0b', borderColor: '#f59e0b' }}
              >
                Contact Form
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;
