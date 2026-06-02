// ============================================================
// ZimVisit Traveler Portal - Footer Component
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Space, Typography } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  HeartFilled,
} from '@ant-design/icons';
import { message } from 'antd';
import { showHowItWorksModal } from '../utils/modals';

const { Text, Title } = Typography;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #052e16 0%, #03190e 100%)',
        color: '#ffffff',
        paddingTop: 64,
        paddingBottom: 0,
      }}
    >
      {/* Main Footer Content */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        <Row gutter={[48, 40]}>
          {/* Brand Column */}
          <Col xs={24} sm={12} lg={6}>
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <img src="/zim-bird-logo.png" alt="Zimbabwe Bird" style={{ width: 36, height: 36, objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.4))' }} />
                <span style={{ fontSize: 22, fontWeight: 800 }}>
                  Zim<span style={{ color: '#f59e0b' }}>Visit</span>
                </span>
              </div>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: 14,
                  lineHeight: 1.8,
                  display: 'block',
                }}
              >
                Your gateway to Zimbabwe's breathtaking landscapes, rich culture, and unforgettable adventures. Book tours, hotels, and activities with a unified digital travel pass.
              </Text>
            </div>

            {/* Social Icons */}
            <Space size={12}>
              {[
                { icon: <FacebookOutlined />, label: 'Facebook' },
                { icon: <TwitterOutlined />, label: 'Twitter' },
                { icon: <InstagramOutlined />, label: 'Instagram' },
                { icon: <YoutubeOutlined />, label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  onClick={(e) => { e.preventDefault(); message.info(`${social.label} integration coming soon`); }}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.08)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 16,
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#166534';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = '#166534';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={12} sm={6} lg={4}>
            <Title level={5} style={{ color: '#f59e0b', marginBottom: 20, fontSize: 15 }}>
              Explore
            </Title>
            <Space direction="vertical" size={10}>
              {[
                { label: 'All Tours', to: '/explore' },
                { label: 'Victoria Falls', to: '/explore?location=victoria-falls' },
                { label: 'Hwange National Park', to: '/explore?location=hwange' },
                { label: 'Mana Pools', to: '/explore?location=mana-pools' },
                { label: 'AI Assistant', to: '/ai-assistant' },
                { label: 'Economic Impact', to: '/impact' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: 14,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f59e0b')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                >
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>

          {/* Company */}
          <Col xs={12} sm={6} lg={4}>
            <Title level={5} style={{ color: '#f59e0b', marginBottom: 20, fontSize: 15 }}>
              Company
            </Title>
            <Space direction="vertical" size={10}>
              {[
                { label: 'About ZimVisit', to: '/' },
                { label: 'How It Works', isModal: true },
                { label: 'Economic Impact', to: '/impact' },
                { label: 'For Operators', to: '/register' },
                { label: 'Zimbabwe Tourism', to: '/explore' },
              ].map((link) => (
                link.isModal ? (
                  <a
                    key={link.label}
                    onClick={(e) => { e.preventDefault(); showHowItWorksModal(); }}
                    style={{
                      color: 'rgba(255,255,255,0.65)',
                      fontSize: 14,
                      transition: 'color 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#f59e0b')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to!}
                    style={{
                      color: 'rgba(255,255,255,0.65)',
                      fontSize: 14,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#f59e0b')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </Space>
          </Col>

          {/* Support */}
          <Col xs={12} sm={6} lg={4}>
            <Title level={5} style={{ color: '#f59e0b', marginBottom: 20, fontSize: 15 }}>
              Support
            </Title>
            <Space direction="vertical" size={10}>
              {[
                { label: 'Help Center', to: '/help' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Cancellation Policy', to: '/cancellation' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: 14,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f59e0b')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                >
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>

          {/* Contact */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} style={{ color: '#f59e0b', marginBottom: 20, fontSize: 15 }}>
              Contact
            </Title>
            <Space direction="vertical" size={14}>
              <Space align="start">
                <EnvironmentOutlined style={{ color: '#f59e0b', fontSize: 16, marginTop: 4 }} />
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>
                  123 Samora Machel Ave<br />
                  Harare, Zimbabwe
                </Text>
              </Space>
              <Space>
                <PhoneOutlined style={{ color: '#f59e0b', fontSize: 16 }} />
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>
                  +263 4 123 4567
                </Text>
              </Space>
              <Space>
                <MailOutlined style={{ color: '#f59e0b', fontSize: 16 }} />
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>
                  hello@zimvisit.co.zw
                </Text>
              </Space>
            </Space>

            {/* Newsletter hint */}
            <div
              style={{
                marginTop: 24,
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 500 }}>
                Subscribe for travel deals
              </Text>
              <div style={{ display: 'flex', marginTop: 10, gap: 8 }}>
                <input
                  type="email"
                  placeholder="Your email"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={(e) => { e.preventDefault(); message.success('Subscribed to travel deals successfully!'); }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#f59e0b',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Divider with Zimbabwe Flag Colors */}
      <div style={{ maxWidth: 1280, margin: '48px auto 0', padding: '0 24px' }}>
        <div
          style={{
            height: 3,
            background: 'linear-gradient(90deg, #006400 20%, #FFD700 20%, #FFD700 22%, #CE1126 22%, #CE1126 42%, #FFD700 42%, #FFD700 44%, #000000 44%, #000000 56%, #FFD700 56%, #FFD700 58%, #CE1126 58%, #CE1126 78%, #FFD700 78%, #FFD700 80%, #006400 80%)',
            borderRadius: 2,
          }}
        />
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '24px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
          &copy; {currentYear} ZimVisit. All rights reserved.
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
          Powered by <span style={{ color: '#f59e0b', fontWeight: 600 }}>ZimVisit</span>{' '}
          <HeartFilled style={{ color: '#CE1126', fontSize: 12 }} /> Made in Zimbabwe
        </Text>
      </div>
    </footer>
  );
};

export default Footer;
