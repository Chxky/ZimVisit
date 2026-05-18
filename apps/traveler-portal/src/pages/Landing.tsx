// ============================================================
// ZimVisit Traveler Portal - Landing Page
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Row, Col, Card, Rate, Typography, Space, Tag, message } from 'antd';
import {
  SearchOutlined,
  CompassOutlined,
  SafetyCertificateOutlined,
  QrcodeOutlined,
  ArrowRightOutlined,
  EnvironmentOutlined,
  StarFilled,
  TeamOutlined,
  GlobalOutlined,
  SmileOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  DownOutlined,
  UserOutlined,
  HeartFilled,
  SwapOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { DESTINATION_IMAGES, GOVERNMENT_BRANDING } from '../constants/images';

const { Title, Text, Paragraph } = Typography;

// ---- Intersection Observer Hook ----
const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
};

// ============================================================
// Landing Page Component
// ============================================================
const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { demoLogin, isLoading: demoLoading } = useAuthStore();
  const [searchValue, setSearchValue] = useState('');

  const handleDemoLogin = async (role: string = 'traveler') => {
    try {
      await demoLogin(role);
      message.success('Welcome! Logged in as demo traveler.');
      navigate('/explore');
    } catch (err: any) {
      message.error(err.message || 'Demo login failed — make sure the backend is running.');
    }
  };

  // Scroll reveal refs
  const destinationsReveal = useScrollReveal();
  const howItWorksReveal = useScrollReveal();
  const statsReveal = useScrollReveal();
  const budgetReveal = useScrollReveal();
  const testimonialsReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  const handleSearch = () => {
    navigate(`/explore${searchValue ? `?q=${encodeURIComponent(searchValue)}` : ''}`);
  };

  // ---- Destinations Data ----
  const destinations = [
    {
      name: 'Victoria Falls',
      province: 'Matabeleland North',
      description: 'The Smoke That Thunders — one of the Seven Natural Wonders of the World',
      image: DESTINATION_IMAGES['Victoria Falls'],
      color: '#0ea5e9',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      tourCount: 42,
      highlight: 'Mosi-oa-Tunya',
    },
    {
      name: 'Hwange National Park',
      province: 'Matabeleland North',
      description: "Zimbabwe's largest national park with over 40,000 elephants",
      image: DESTINATION_IMAGES['Hwange National Park'],
      color: '#84cc16',
      gradient: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
      tourCount: 35,
      highlight: 'Big Five Safari',
    },
    {
      name: 'Mana Pools',
      province: 'Mashonaland West',
      description: 'UNESCO World Heritage Site — pristine wilderness along the Zambezi',
      image: DESTINATION_IMAGES['Mana Pools'],
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      tourCount: 28,
      highlight: 'Walking Safaris',
    },
    {
      name: 'Great Zimbabwe',
      province: 'Masvingo',
      description: 'Ancient stone city ruins — the largest stone structures in sub-Saharan Africa',
      image: DESTINATION_IMAGES['Great Zimbabwe'],
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
      tourCount: 18,
      highlight: 'UNESCO Heritage',
    },
    {
      name: 'Lake Kariba',
      province: 'Mashonaland West',
      description: "The world's largest man-made lake by volume — sunsets and houseboats",
      image: DESTINATION_IMAGES['Lake Kariba'],
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      tourCount: 22,
      highlight: 'Houseboat Cruises',
    },
    {
      name: 'Eastern Highlands',
      province: 'Manicaland',
      description: 'Misty mountains, tea estates, and the stunning Nyanga and Chimanimani ranges',
      image: DESTINATION_IMAGES['Nyanga'],
      color: '#16a34a',
      gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      tourCount: 24,
      highlight: 'Mountain Trails',
    },
  ];

  // ---- How It Works Steps ----
  const steps = [
    {
      icon: <SearchOutlined />,
      title: 'Search & Discover',
      description: 'Browse hundreds of tours, hotels, and activities across Zimbabwe. Filter by location, budget, and interests.',
      color: '#166534',
      bgColor: '#f0fdf4',
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: 'Book with Confidence',
      description: 'Secure your booking with flexible payment options. Name your budget and let operators compete for your business.',
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
    {
      icon: <QrcodeOutlined />,
      title: 'ZimPass QR Itinerary',
      description: 'Get your unified digital travel pass with QR codes for every booking. Show and go at any checkpoint.',
      color: '#0ea5e9',
      bgColor: '#f0f9ff',
    },
  ];

  // ---- Stats ----
  const stats = [
    { number: '200+', label: 'Verified Operators', icon: <TeamOutlined /> },
    { number: '50+', label: 'Destinations', icon: <EnvironmentOutlined /> },
    { number: '10,000+', label: 'Happy Travelers', icon: <SmileOutlined /> },
    { number: '98%', label: 'Satisfaction Rate', icon: <TrophyOutlined /> },
  ];

  // ---- Testimonials ----
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      from: 'London, UK',
      avatar: 'SM',
      rating: 5,
      text: "ZimVisit made planning our Zimbabwe honeymoon effortless. The ZimPass QR system was brilliant — we just showed our phones at every checkpoint. Victoria Falls was beyond anything I'd imagined!",
      tour: 'Victoria Falls Adventure Package',
    },
    {
      name: 'David Chen',
      from: 'Sydney, Australia',
      avatar: 'DC',
      rating: 5,
      text: "The Name Your Budget feature is genius. I set my price for a Hwange safari and got three competitive offers within hours. Saved 30% compared to booking directly. Incredible wildlife experience.",
      tour: 'Hwange Big Five Safari',
    },
    {
      name: 'Amara Okafor',
      from: 'Lagos, Nigeria',
      avatar: 'AO',
      rating: 5,
      text: 'As an African traveler, it was wonderful to see a platform that truly celebrates our continent. The cultural tour of Great Zimbabwe was deeply moving. The whole booking process was seamless.',
      tour: 'Great Zimbabwe Heritage Tour',
    },
  ];

  // ============================================================
  return (
    <div style={{ overflow: 'hidden' }}>
      {/* ===================== GOVERNMENT BRANDING BAR ===================== */}
      <div
        style={{
          background: 'linear-gradient(90deg, #052e16 0%, #14532d 50%, #052e16 100%)',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          borderBottom: '2px solid #f59e0b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
            <path d="M32 8C24 8 18 14 16 20C14 26 15 32 18 36C14 38 10 42 8 48C10 47 13 46 16 46C18 50 22 54 28 56C30 56 32 56 34 56C40 54 44 50 46 46C49 46 52 47 54 48C52 42 48 38 44 36C47 32 48 26 46 20C44 14 38 8 32 8Z" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5"/>
          </svg>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {GOVERNMENT_BRANDING.authority}
          </Text>
        </div>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.3)' }} />
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, letterSpacing: 0.5 }}>
          {GOVERNMENT_BRANDING.ministry}
        </Text>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.3)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
          <Text style={{ color: '#22c55e', fontSize: 11, fontWeight: 600 }}>VERIFIED PLATFORM</Text>
        </div>
      </div>

      {/* ===================== HERO SECTION ===================== */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${DESTINATION_IMAGES['Victoria Falls']})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
          marginTop: -100,
          paddingTop: 100,
        }}
      >
        {/* Dark overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(5,46,22,0.92) 0%, rgba(20,83,45,0.88) 25%, rgba(22,101,52,0.85) 50%, rgba(5,46,22,0.92) 75%, rgba(0,0,0,0.95) 100%)',
          }}
        />
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 20% 50%, rgba(245, 158, 11, 0.12) 0%, transparent 50%), ' +
              'radial-gradient(ellipse at 80% 30%, rgba(22, 101, 52, 0.2) 0%, transparent 50%), ' +
              'radial-gradient(ellipse at 50% 80%, rgba(14, 165, 233, 0.08) 0%, transparent 40%)',
          }}
        />
        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating shapes */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(22,101,52,0.12) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite reverse',
          }}
        />

        <div
          className="hero-overlay"
          style={{
            maxWidth: 900,
            margin: '0 auto',
            padding: '0 24px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Badge */}
          <div
            className="animate-fade-in-down"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 100,
              marginBottom: 32,
            }}
          >
            <span style={{ fontSize: 16 }}>🇿🇼</span>
            <Text style={{ color: '#fcd34d', fontSize: 13, fontWeight: 600 }}>
              Zimbabwe's #1 Travel Platform
            </Text>
          </div>

          {/* Main Heading */}
          <Title
            level={1}
            className="animate-fade-in-up"
            style={{
              color: '#ffffff',
              fontSize: 'clamp(36px, 6vw, 68px)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: '-1px',
            }}
          >
            Discover{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Zimbabwe
            </span>
          </Title>

          {/* Subtitle */}
          <Paragraph
            className="animate-fade-in-up"
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 'clamp(16px, 2vw, 20px)',
              lineHeight: 1.7,
              maxWidth: 640,
              margin: '0 auto 40px',
              fontWeight: 400,
            }}
          >
            Book tours, hotels, and activities with a unified digital travel pass.
            From Victoria Falls to the Eastern Highlands — your adventure starts here.
          </Paragraph>

          {/* Search Bar */}
          <div
            className="animate-fade-in-up"
            style={{
              display: 'flex',
              gap: 12,
              maxWidth: 580,
              margin: '0 auto 32px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Input
              size="large"
              placeholder="Where do you want to explore?"
              prefix={<SearchOutlined style={{ color: '#a3a3a3' }} />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              style={{
                flex: 1,
                minWidth: 260,
                height: 54,
                borderRadius: 14,
                fontSize: 15,
                background: 'rgba(255,255,255,0.95)',
                border: '2px solid transparent',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}
            />
            <Button
              type="primary"
              size="large"
              onClick={handleSearch}
              style={{
                height: 54,
                padding: '0 32px',
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderColor: '#f59e0b',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
              }}
            >
              Explore
              <ArrowRightOutlined />
            </Button>
          </div>

          {/* CTA Buttons */}
          <div
            className="animate-fade-in-up"
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              size="large"
              onClick={() => navigate('/explore')}
              style={{
                height: 48,
                padding: '0 28px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                background: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.25)',
                color: '#ffffff',
                backdropFilter: 'blur(8px)',
              }}
              icon={<CompassOutlined />}
            >
              Browse All Tours
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/register')}
              style={{
                height: 48,
                padding: '0 28px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                background: 'transparent',
                borderColor: 'rgba(245, 158, 11, 0.5)',
                color: '#fcd34d',
              }}
              icon={<DollarOutlined />}
            >
              Name Your Budget
            </Button>
            <Button
              size="large"
              loading={demoLoading}
              onClick={() => handleDemoLogin('traveler')}
              style={{
                height: 48,
                padding: '0 28px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderColor: '#f59e0b',
                color: '#ffffff',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
              }}
              icon={<ThunderboltOutlined />}
            >
              Try as Traveler
            </Button>
          </div>

          {/* Scroll indicator */}
          <div
            style={{
              marginTop: 60,
              animation: 'float 2s ease-in-out infinite',
            }}
          >
            <DownOutlined style={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
          </div>
        </div>
      </section>

      {/* ===================== FEATURED DESTINATIONS ===================== */}
      <section
        id="destinations"
        ref={destinationsReveal.ref}
        className="section-pattern"
        style={{
          padding: '100px 24px',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 60,
            opacity: destinationsReveal.visible ? 1 : 0,
            transform: destinationsReveal.visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s ease',
          }}
        >
          <Tag
            color="green"
            style={{
              marginBottom: 16,
              padding: '4px 16px',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            POPULAR DESTINATIONS
          </Tag>
          <Title level={2} style={{ marginBottom: 12, fontSize: 'clamp(28px, 4vw, 40px)' }}>
            Where Will Your Adventure Take You?
          </Title>
          <Text style={{ color: '#737373', fontSize: 17, maxWidth: 600, display: 'block', margin: '0 auto' }}>
            From thundering waterfalls to ancient ruins, Zimbabwe offers experiences that will stay with you forever.
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {destinations.map((dest, i) => (
            <Col xs={24} sm={12} lg={8} key={dest.name}>
              <div
                style={{
                  opacity: destinationsReveal.visible ? 1 : 0,
                  transform: destinationsReveal.visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.6s ease ${i * 0.1}s`,
                }}
              >
                <Card
                  hoverable
                  onClick={() => navigate(`/explore?location=${dest.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  styles={{
                    body: { padding: 0 },
                  }}
                  className="card-hover"
                >
                  {/* Card Header with Real Image */}
                  <div
                    style={{
                      height: 180,
                      backgroundImage: `url(${dest.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Dark overlay for text readability */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
                      }}
                    />
                    {/* Tour count badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: 'rgba(0,0,0,0.35)',
                        backdropFilter: 'blur(8px)',
                        color: '#ffffff',
                        padding: '4px 12px',
                        borderRadius: 100,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {dest.tourCount} tours
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '20px 24px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Title level={4} style={{ margin: 0, fontSize: 19 }}>
                        {dest.name}
                      </Title>
                    </div>
                    <Space size={4} style={{ marginBottom: 10 }}>
                      <EnvironmentOutlined style={{ color: '#a3a3a3', fontSize: 12 }} />
                      <Text style={{ color: '#a3a3a3', fontSize: 13 }}>{dest.province}</Text>
                    </Space>
                    <Paragraph
                      style={{ color: '#525252', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}
                      ellipsis={{ rows: 2 }}
                    >
                      {dest.description}
                    </Paragraph>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Tag
                        style={{
                          background: dest.gradient || '#f0fdf4',
                          color: dest.color,
                          border: `1px solid ${dest.color}30`,
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        {dest.highlight}
                      </Tag>
                      <Button
                        type="link"
                        style={{ color: dest.color, fontWeight: 600, padding: 0 }}
                        icon={<ArrowRightOutlined />}
                      >
                        Explore
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section
        id="how-it-works"
        ref={howItWorksReveal.ref}
        style={{
          padding: '100px 24px',
          background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              textAlign: 'center',
              marginBottom: 60,
              opacity: howItWorksReveal.visible ? 1 : 0,
              transform: howItWorksReveal.visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s ease',
            }}
          >
            <Tag
              color="gold"
              style={{
                marginBottom: 16,
                padding: '4px 16px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              HOW IT WORKS
            </Tag>
            <Title level={2} style={{ marginBottom: 12, fontSize: 'clamp(28px, 4vw, 40px)' }}>
              Three Steps to Your Adventure
            </Title>
            <Text style={{ color: '#737373', fontSize: 17, maxWidth: 550, display: 'block', margin: '0 auto' }}>
              From browsing to boarding — ZimVisit makes every step seamless.
            </Text>
          </div>

          <Row gutter={[40, 40]} justify="center">
            {steps.map((step, i) => (
              <Col xs={24} sm={8} key={step.title}>
                <div
                  style={{
                    textAlign: 'center',
                    opacity: howItWorksReveal.visible ? 1 : 0,
                    transform: howItWorksReveal.visible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `all 0.6s ease ${i * 0.15}s`,
                  }}
                >
                  {/* Step Number */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: step.color,
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      marginBottom: 20,
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: 24,
                      background: step.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      fontSize: 36,
                      color: step.color,
                      border: `2px solid ${step.color}20`,
                    }}
                  >
                    {step.icon}
                  </div>

                  <Title level={4} style={{ marginBottom: 12, fontSize: 20 }}>
                    {step.title}
                  </Title>
                  <Text style={{ color: '#737373', fontSize: 15, lineHeight: 1.7, display: 'block', maxWidth: 280, margin: '0 auto' }}>
                    {step.description}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section
        ref={statsReveal.ref}
        style={{
          padding: '80px 24px',
          background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(245,158,11,0.1) 0%, transparent 50%), ' +
              'radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 0%, transparent 40%)',
          }}
        />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Row gutter={[32, 32]} justify="center">
            {stats.map((stat, i) => (
              <Col xs={12} sm={6} key={stat.label}>
                <div
                  style={{
                    textAlign: 'center',
                    opacity: statsReveal.visible ? 1 : 0,
                    transform: statsReveal.visible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.5s ease ${i * 0.1}s`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
                      color: '#f59e0b',
                      marginBottom: 12,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(32px, 5vw, 48px)',
                      fontWeight: 900,
                      color: '#ffffff',
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {stat.number}
                  </div>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 500 }}>
                    {stat.label}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ===================== NAME YOUR BUDGET ===================== */}
      <section
        ref={budgetReveal.ref}
        className="section-pattern"
        style={{ padding: '100px 24px' }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Row gutter={[60, 40]} align="middle">
            <Col xs={24} lg={12}>
              <div
                style={{
                  opacity: budgetReveal.visible ? 1 : 0,
                  transform: budgetReveal.visible ? 'translateX(0)' : 'translateX(-30px)',
                  transition: 'all 0.6s ease',
                }}
              >
                <Tag
                  color="gold"
                  style={{
                    marginBottom: 16,
                    padding: '4px 16px',
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  REVERSE AUCTION
                </Tag>
                <Title level={2} style={{ marginBottom: 16, fontSize: 'clamp(28px, 4vw, 38px)' }}>
                  Name Your Budget,{' '}
                  <span style={{ color: '#f59e0b' }}>Get the Best Deal</span>
                </Title>
                <Paragraph style={{ color: '#525252', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                  Tired of fixed prices? With ZimVisit's reverse auction, you set your budget for a tour or activity,
                  and verified operators compete to offer you the best experience at your price. It's simple:
                  you save money, they fill their seats.
                </Paragraph>

                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  {[
                    { icon: <DollarOutlined />, text: 'Set your desired price for any activity' },
                    { icon: <SwapOutlined />, text: 'Receive competing offers from operators' },
                    { icon: <TrophyOutlined />, text: 'Choose the best offer and book instantly' },
                  ].map((item, i) => (
                    <Space key={i} size={14} align="start">
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          background: '#fffbeb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#f59e0b',
                          fontSize: 18,
                          flexShrink: 0,
                          border: '1px solid #fde68a',
                        }}
                      >
                        {item.icon}
                      </div>
                      <Text style={{ fontSize: 15, color: '#404040', lineHeight: 1.6, paddingTop: 4 }}>
                        {item.text}
                      </Text>
                    </Space>
                  ))}
                </Space>

                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate('/register')}
                  style={{
                    marginTop: 36,
                    height: 50,
                    padding: '0 36px',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderColor: '#f59e0b',
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)',
                  }}
                  icon={<ThunderboltOutlined />}
                >
                  Try Name Your Budget
                </Button>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <div
                style={{
                  opacity: budgetReveal.visible ? 1 : 0,
                  transform: budgetReveal.visible ? 'translateX(0)' : 'translateX(30px)',
                  transition: 'all 0.6s ease 0.2s',
                }}
              >
                {/* Mock Budget Card */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 24,
                    padding: 36,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Gold accent */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)',
                    }}
                  />

                  <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 20,
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        fontSize: 28,
                        color: '#ffffff',
                        boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <DollarOutlined />
                    </div>
                    <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                      Victoria Falls Day Trip
                    </Title>
                    <Text style={{ color: '#737373' }}>Your Budget</Text>
                  </div>

                  <div
                    style={{
                      background: '#fffbeb',
                      borderRadius: 16,
                      padding: '20px 24px',
                      textAlign: 'center',
                      marginBottom: 24,
                      border: '2px dashed #fde68a',
                    }}
                  >
                    <Text style={{ color: '#92400e', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                      YOUR PRICE
                    </Text>
                    <div style={{ fontSize: 40, fontWeight: 900, color: '#f59e0b' }}>
                      $85
                    </div>
                    <Text style={{ color: '#a3a3a3', fontSize: 12, textDecoration: 'line-through' }}>
                      Market price: $120
                    </Text>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 0',
                      borderTop: '1px solid #f0f0f0',
                    }}
                  >
                    <div>
                      <Text style={{ color: '#737373', fontSize: 12, display: 'block' }}>Offers Received</Text>
                      <Text strong style={{ color: '#166534', fontSize: 18 }}>3 operators</Text>
                    </div>
                    <Tag
                      color="green"
                      style={{
                        padding: '4px 16px',
                        borderRadius: 100,
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      Best: $82
                    </Tag>
                  </div>

                  <Button
                    block
                    type="primary"
                    size="large"
                    style={{
                      marginTop: 16,
                      height: 48,
                      borderRadius: 12,
                      fontWeight: 700,
                      background: '#166534',
                      borderColor: '#166534',
                    }}
                  >
                    View Offers
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section
        ref={testimonialsReveal.ref}
        style={{
          padding: '100px 24px',
          background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              textAlign: 'center',
              marginBottom: 60,
              opacity: testimonialsReveal.visible ? 1 : 0,
              transform: testimonialsReveal.visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s ease',
            }}
          >
            <Tag
              color="green"
              style={{
                marginBottom: 16,
                padding: '4px 16px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              TRAVELER STORIES
            </Tag>
            <Title level={2} style={{ marginBottom: 12, fontSize: 'clamp(28px, 4vw, 40px)' }}>
              What Our Travelers Say
            </Title>
            <Text style={{ color: '#737373', fontSize: 17, maxWidth: 550, display: 'block', margin: '0 auto' }}>
              Real experiences from real travelers who discovered Zimbabwe through ZimVisit.
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            {testimonials.map((t, i) => (
              <Col xs={24} md={8} key={t.name}>
                <Card
                  style={{
                    borderRadius: 20,
                    border: '1px solid #f0f0f0',
                    height: '100%',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    opacity: testimonialsReveal.visible ? 1 : 0,
                    transform: testimonialsReveal.visible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `all 0.6s ease ${i * 0.1}s`,
                  }}
                  styles={{ body: { padding: 32 } }}
                  className="card-hover-lift"
                >
                  {/* Quote icon */}
                  <div
                    style={{
                      fontSize: 40,
                      color: '#166534',
                      opacity: 0.15,
                      marginBottom: -10,
                      fontFamily: 'Georgia, serif',
                      lineHeight: 1,
                    }}
                  >
                    &ldquo;
                  </div>

                  <Paragraph
                    style={{
                      fontSize: 15,
                      color: '#404040',
                      lineHeight: 1.8,
                      marginBottom: 24,
                      minHeight: 100,
                    }}
                  >
                    {t.text}
                  </Paragraph>

                  <Rate
                    disabled
                    defaultValue={t.rating}
                    style={{ fontSize: 14, marginBottom: 16 }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid #f5f5f5', paddingTop: 16 }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #166534, #22c55e)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <Text strong style={{ display: 'block', fontSize: 15 }}>{t.name}</Text>
                      <Text style={{ color: '#a3a3a3', fontSize: 13 }}>{t.from}</Text>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 16,
                      padding: '8px 14px',
                      background: '#f0fdf4',
                      borderRadius: 10,
                      display: 'inline-block',
                    }}
                  >
                    <Text style={{ color: '#166534', fontSize: 12, fontWeight: 500 }}>
                      <HeartFilled style={{ marginRight: 6, color: '#ef4444' }} />
                      {t.tour}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section
        ref={ctaReveal.ref}
        style={{
          padding: '100px 24px',
          background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 60%)',
          }}
        />

        <div
          style={{
            maxWidth: 700,
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
            opacity: ctaReveal.visible ? 1 : 0,
            transform: ctaReveal.visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s ease',
          }}
        >
          <div
            style={{
              fontSize: 56,
              marginBottom: 24,
            }}
          >
            🇿🇼
          </div>

          <Title
            level={2}
            style={{
              color: '#ffffff',
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontWeight: 900,
              marginBottom: 16,
              lineHeight: 1.2,
            }}
          >
            Start Your{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Zimbabwe Adventure
            </span>
          </Title>

          <Paragraph
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 18,
              lineHeight: 1.7,
              marginBottom: 40,
            }}
          >
            Join thousands of travelers who have discovered the magic of Zimbabwe.
            Your adventure is just one click away.
          </Paragraph>

          <Space size={16} wrap>
            <Button
              size="large"
              onClick={() => navigate('/register')}
              style={{
                height: 54,
                padding: '0 40px',
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderColor: '#f59e0b',
                color: '#ffffff',
                boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
              }}
              icon={<UserOutlined />}
            >
              Create Free Account
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/explore')}
              style={{
                height: 54,
                padding: '0 40px',
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 600,
                background: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.25)',
                color: '#ffffff',
                backdropFilter: 'blur(8px)',
              }}
              icon={<CompassOutlined />}
            >
              Explore Tours
            </Button>
          </Space>
        </div>
      </section>

      {/* ===================== DEMO ACCOUNTS ===================== */}
      <section
        style={{
          padding: '60px 24px',
          background: '#ffffff',
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <Tag
            color="orange"
            style={{
              marginBottom: 16,
              padding: '4px 16px',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            DEMO ACCOUNTS
          </Tag>
          <Title level={3} style={{ marginBottom: 8 }}>
            Try ZimVisit Instantly
          </Title>
          <Text style={{ color: '#737373', fontSize: 15, display: 'block', marginBottom: 36 }}>
            Explore the platform with pre-configured demo accounts. No registration required.
          </Text>

          <Row gutter={[24, 24]} justify="center">
            {[
              {
                role: 'Government',
                email: 'zta@zta.gov.zw',
                password: 'demo123',
                color: '#1e1b4b',
                bgColor: '#eef2ff',
                icon: <SafetyCertificateOutlined />,
                portal: 'Government Portal',
              },
              {
                role: 'Operator',
                email: 'operator@wildhorizons.co.zw',
                password: 'demo123',
                color: '#166534',
                bgColor: '#f0fdf4',
                icon: <GlobalOutlined />,
                portal: 'Operator Dashboard',
              },
              {
                role: 'Traveler',
                email: 'traveler@gmail.com',
                password: 'demo123',
                color: '#0ea5e9',
                bgColor: '#f0f9ff',
                icon: <UserOutlined />,
                portal: 'Traveler Portal',
              },
            ].map((account) => (
              <Col xs={24} sm={8} key={account.role}>
                <Card
                  style={{
                    borderRadius: 16,
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  }}
                  styles={{ body: { padding: 28, textAlign: 'center' } }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: account.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: 24,
                      color: account.color,
                    }}
                  >
                    {account.icon}
                  </div>
                  <Title level={5} style={{ marginBottom: 4 }}>
                    {account.role}
                  </Title>
                  <Text style={{ color: '#a3a3a3', fontSize: 12, display: 'block', marginBottom: 16 }}>
                    {account.portal}
                  </Text>
                  <div
                    style={{
                      background: '#fafafa',
                      borderRadius: 10,
                      padding: '12px 16px',
                      textAlign: 'left',
                    }}
                  >
                    <Text style={{ fontSize: 12, color: '#737373', display: 'block', marginBottom: 2 }}>
                      Email
                    </Text>
                    <Text
                      copyable
                      style={{ fontSize: 13, color: '#171717', fontWeight: 600, display: 'block', marginBottom: 8 }}
                    >
                      {account.email}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#737373', display: 'block', marginBottom: 2 }}>
                      Password
                    </Text>
                    <Text
                      copyable
                      style={{ fontSize: 13, color: '#171717', fontWeight: 600, display: 'block' }}
                    >
                      {account.password}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Landing;
