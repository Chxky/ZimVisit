// ============================================================
// ZimVisit Traveler Portal - Footer Component
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Space, Divider, Typography } from 'antd';
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
                <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
                  <path
                    d="M32 8C24 8 18 14 16 20C14 26 15 32 18 36C14 38 10 42 8 48C10 47 13 46 16 46C18 50 22 54 28 56C30 56 32 56 34 56C40 54 44 50 46 46C49 46 52 47 54 48C52 42 48 38 44 36C47 32 48 26 46 20C44 14 38 8 32 8Z"
                    fill="#f59e0b"
                    stroke="#92400e"
                    strokeWidth="1.5"
                  />
                  <path d="M28 12C28 8 30 4 32 2C34 4 36 8 36 12" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <circle cx="28" cy="22" r="2.5" fill="#92400e" />
                  <path d="M22 24L16 22L22 26Z" fill="#b45309" />
                </svg>
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
                  href="#"
                  aria-label={social.label}
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
                { label: 'About Us', to: '/about' },
                { label: 'Careers', to: '/careers' },
                { label: 'Press', to: '/press' },
                { label: 'Blog', to: '/blog' },
                { label: 'Partners', to: '/partners' },
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
