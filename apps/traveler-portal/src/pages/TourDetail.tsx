// ============================================================
// ZimVisit Traveler Portal - Tour Detail Page
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Rate,
  Typography,
  Space,
  Divider,
  DatePicker,
  InputNumber,
  List,
  Avatar,
  Breadcrumb,
  Spin,
  Skeleton,
  message,
} from 'antd';
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  StarFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  CalendarOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  UserOutlined,
  ArrowRightOutlined,
  HomeOutlined,
  CompassOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import type { Tour } from '../types';
import { toursApi } from '../services/api';
import { CATEGORY_IMAGES } from '../constants/images';

const { Title, Text, Paragraph } = Typography;

const TourDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [similarTours, setSimilarTours] = useState<Tour[]>([]);
  const [travelers, setTravelers] = useState(2);

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) {
        setLoading(false);
        setError('No tour ID provided.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await toursApi.getById(id);
        setTour((res as any).data || res);

        // Fetch reviews and similar tours in parallel
        const [reviewsRes, similarRes] = await Promise.allSettled([
          toursApi.getReviews(id),
          toursApi.getSimilar(id),
        ]);
        if (reviewsRes.status === 'fulfilled') {
          const r = reviewsRes.value;
          setReviews(Array.isArray(r) ? r : (r as any).data || []);
        }
        if (similarRes.status === 'fulfilled') {
          const s = similarRes.value;
          setSimilarTours(Array.isArray(s) ? s : (s as any).data || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load tour');
        message.error('Failed to load tour details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const categoryGradient: Record<string, string> = {
    'victoria-falls': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
    safari: 'linear-gradient(135deg, #84cc16 0%, #65a30d 50%, #4d7c0f 100%)',
    hiking: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)',
    cultural: 'linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)',
    lake: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)',
    wildlife: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
  };

  const categoryIcon: Record<string, string> = {
    'victoria-falls': '🌊',
    safari: '🦁',
    hiking: '🥾',
    cultural: '🏛️',
    lake: '⛵',
    wildlife: '🐘',
  };

  const diffColor: Record<string, string> = {
    easy: 'green',
    moderate: 'gold',
    challenging: 'orange',
    expert: 'red',
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Text style={{ fontSize: 16, color: '#737373' }}>{error || 'Tour not found.'}</Text>
        <Space>
          <Button type="primary" onClick={() => window.location.reload()} style={{ background: '#166534', borderColor: '#166534' }}>
            Retry
          </Button>
          <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
        </Space>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* ---- Hero Image Area ---- */}
      <div
        style={{
          height: 360,
          backgroundImage: `url(${tour.images?.[0] || CATEGORY_IMAGES[tour.category] || CATEGORY_IMAGES.safari})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Dark overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Back button */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            background: 'rgba(0,0,0,0.3)',
            borderColor: 'transparent',
            color: '#ffffff',
            backdropFilter: 'blur(8px)',
            borderRadius: 10,
            zIndex: 2,
          }}
        >
          Back
        </Button>

        {/* Share / Favorite */}
        <Space
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 2,
          }}
        >
          <Button
            icon={<ShareAltOutlined />}
            style={{
              background: 'rgba(0,0,0,0.3)',
              borderColor: 'transparent',
              color: '#ffffff',
              backdropFilter: 'blur(8px)',
              borderRadius: 10,
            }}
          />
          <Button
            icon={<HeartOutlined />}
            style={{
              background: 'rgba(0,0,0,0.3)',
              borderColor: 'transparent',
              color: '#ffffff',
              backdropFilter: 'blur(8px)',
              borderRadius: 10,
            }}
          />
        </Space>

        {/* Bottom gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
          }}
        />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        {/* Breadcrumb */}
        <Breadcrumb
          style={{ marginBottom: 24 }}
          items={[
            { title: <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}><HomeOutlined /> Home</span> },
            { title: <span onClick={() => navigate('/explore')} style={{ cursor: 'pointer' }}><CompassOutlined /> Explore</span> },
            { title: tour.name },
          ]}
        />

        <Row gutter={[36, 36]}>
          {/* ---- Main Content ---- */}
          <Col xs={24} lg={16}>
            {/* Title Section */}
            <div style={{ marginBottom: 28 }}>
              <Space size={8} style={{ marginBottom: 10 }}>
                <Tag color={diffColor[tour.difficulty]} style={{ textTransform: 'capitalize', borderRadius: 6 }}>
                  {tour.difficulty}
                </Tag>
                <Tag style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0', borderRadius: 6 }}>
                  {tour.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </Tag>
              </Space>

              <Title level={2} style={{ marginBottom: 10, fontSize: 'clamp(24px, 3vw, 34px)', lineHeight: 1.2 }}>
                {tour.name}
              </Title>

              <Space size={20} wrap>
                <Space size={4}>
                  <EnvironmentOutlined style={{ color: '#a3a3a3' }} />
                  <Text style={{ color: '#525252' }}>{tour.location}, {tour.province}</Text>
                </Space>
                <Space size={4}>
                  <StarFilled style={{ color: '#f59e0b' }} />
                  <Text strong>{tour.rating}</Text>
                  <Text style={{ color: '#a3a3a3' }}>({tour.reviewCount} reviews)</Text>
                </Space>
                <Space size={4}>
                  <ClockCircleOutlined style={{ color: '#a3a3a3' }} />
                  <Text style={{ color: '#525252' }}>{tour.duration}</Text>
                </Space>
                <Space size={4}>
                  <TeamOutlined style={{ color: '#a3a3a3' }} />
                  <Text style={{ color: '#525252' }}>Max {tour.maxGroupSize} people</Text>
                </Space>
              </Space>
            </div>

            {/* Government Compliance Banner */}
            <Card
              style={{
                borderRadius: 18,
                marginBottom: 24,
                border: '1px solid #bbf7d0',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              }}
              styles={{ body: { padding: '16px 24px' } }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <Space size={16}>
                  <Space size={6}>
                    <SafetyCertificateOutlined style={{ color: '#166534', fontSize: 16 }} />
                    <Text style={{ color: '#166534', fontWeight: 700, fontSize: 13 }}>ZTA Licensed Operator</Text>
                  </Space>
                  <Space size={6}>
                    <CheckCircleFilled style={{ color: '#166534', fontSize: 16 }} />
                    <Text style={{ color: '#166534', fontWeight: 700, fontSize: 13 }}>ZIMRA Tax Compliant</Text>
                  </Space>
                  <Space size={6}>
                    <QrcodeOutlined style={{ color: '#166534', fontSize: 16 }} />
                    <Text style={{ color: '#166534', fontWeight: 700, fontSize: 13 }}>ZimPass QR Included</Text>
                  </Space>
                </Space>
                <Tag color="success" style={{ borderRadius: 100, fontWeight: 600, fontSize: 11, padding: '2px 12px' }}>
                  GOVERNMENT VERIFIED
                </Tag>
              </div>
            </Card>

            {/* Description */}
            <Card style={{ borderRadius: 18, marginBottom: 24, border: '1px solid #f0f0f0' }} styles={{ body: { padding: 28 } }}>
              <Title level={4} style={{ marginBottom: 16 }}>About This Tour</Title>
              <Paragraph style={{ fontSize: 15, lineHeight: 1.9, color: '#404040' }}>
                {tour.description}
              </Paragraph>
            </Card>

            {/* Highlights */}
            <Card style={{ borderRadius: 18, marginBottom: 24, border: '1px solid #f0f0f0' }} styles={{ body: { padding: 28 } }}>
              <Title level={4} style={{ marginBottom: 16 }}>Highlights</Title>
              {tour.highlights && tour.highlights.length > 0 ? (
                <List
                  dataSource={tour.highlights}
                  renderItem={(item) => (
                    <List.Item style={{ border: 'none', padding: '8px 0' }}>
                      <Space size={12} align="start">
                        <CheckCircleFilled style={{ color: '#166534', fontSize: 16, marginTop: 3 }} />
                        <Text style={{ fontSize: 15, color: '#404040' }}>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              ) : (
                <Text style={{ color: '#737373', fontSize: 14 }}>
                  Contact the operator for detailed highlights of this tour.
                </Text>
              )}
            </Card>

            {/* Inclusions / Exclusions */}
            <Row gutter={24} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: 18, height: '100%', border: '1px solid #f0f0f0' }} styles={{ body: { padding: 28 } }}>
                  <Title level={4} style={{ marginBottom: 16, color: '#166534' }}>
                    <CheckCircleFilled style={{ marginRight: 8 }} />
                    What's Included
                  </Title>
                  {tour.inclusions && tour.inclusions.length > 0 ? (
                    <List
                      dataSource={tour.inclusions}
                      renderItem={(item) => (
                        <List.Item style={{ border: 'none', padding: '6px 0' }}>
                          <Space size={10}>
                            <CheckCircleFilled style={{ color: '#22c55e', fontSize: 13 }} />
                            <Text style={{ fontSize: 14 }}>{item}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Text style={{ color: '#737373', fontSize: 14 }}>
                      Contact the operator for inclusion details.
                    </Text>
                  )}
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: 18, height: '100%', border: '1px solid #f0f0f0' }} styles={{ body: { padding: 28 } }}>
                  <Title level={4} style={{ marginBottom: 16, color: '#ef4444' }}>
                    <CloseCircleFilled style={{ marginRight: 8 }} />
                    What's Not Included
                  </Title>
                  {tour.exclusions && tour.exclusions.length > 0 ? (
                    <List
                      dataSource={tour.exclusions}
                      renderItem={(item) => (
                        <List.Item style={{ border: 'none', padding: '6px 0' }}>
                          <Space size={10}>
                            <CloseCircleFilled style={{ color: '#ef4444', fontSize: 13 }} />
                            <Text style={{ fontSize: 14 }}>{item}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Text style={{ color: '#737373', fontSize: 14 }}>
                      Contact the operator for exclusion details.
                    </Text>
                  )}
                </Card>
              </Col>
            </Row>

            {/* Meeting Point */}
            <Card style={{ borderRadius: 18, marginBottom: 24, border: '1px solid #f0f0f0' }} styles={{ body: { padding: 28 } }}>
              <Title level={4} style={{ marginBottom: 16 }}>Meeting Point</Title>
              <Space size={12} align="start">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: '#f0fdf4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #bbf7d0',
                  }}
                >
                  <EnvironmentOutlined style={{ color: '#166534', fontSize: 20 }} />
                </div>
                <div>
                  <Text strong style={{ display: 'block', fontSize: 15 }}>{tour.meetingPoint}</Text>
                  <Text style={{ color: '#737373', fontSize: 13 }}>
                    Please arrive 15 minutes before the scheduled start time
                  </Text>
                </div>
              </Space>
            </Card>

            {/* Reviews Section */}
            <Card style={{ borderRadius: 18, marginBottom: 24, border: '1px solid #f0f0f0' }} styles={{ body: { padding: 28 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>
                  Reviews ({tour.reviewCount})
                </Title>
                <Space>
                  <StarFilled style={{ color: '#f59e0b', fontSize: 20 }} />
                  <Text strong style={{ fontSize: 24 }}>{tour.rating}</Text>
                  <Text style={{ color: '#a3a3a3' }}>/ 5</Text>
                </Space>
              </div>

              <List
                dataSource={reviews}
                renderItem={(review: any) => (
                  <List.Item style={{ border: 'none', padding: '16px 0' }}>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Space>
                          <Avatar
                            style={{ background: 'linear-gradient(135deg, #166534, #22c55e)', fontWeight: 700 }}
                          >
                            {review.avatar}
                          </Avatar>
                          <div>
                            <Text strong style={{ display: 'block' }}>{review.name}</Text>
                            <Text style={{ color: '#a3a3a3', fontSize: 12 }}>{review.from} · {review.date}</Text>
                          </div>
                        </Space>
                        <Rate disabled defaultValue={review.rating} style={{ fontSize: 13 }} />
                      </div>
                      <Paragraph style={{ color: '#404040', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                        {review.text}
                      </Paragraph>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* Operator Info */}
            <Card style={{ borderRadius: 18, marginBottom: 24, border: '1px solid #f0f0f0' }} styles={{ body: { padding: 28 } }}>
              <Title level={4} style={{ marginBottom: 16 }}>Tour Operator</Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Avatar
                  size={56}
                  icon={<UserOutlined />}
                  style={{ background: 'linear-gradient(135deg, #166534, #22c55e)' }}
                />
                <div>
                  <Text strong style={{ display: 'block', fontSize: 16 }}>{tour.operator.name}</Text>
                  <Space size={4}>
                    <StarFilled style={{ color: '#f59e0b', fontSize: 13 }} />
                    <Text style={{ color: '#525252' }}>{tour.operator.rating} rating</Text>
                  </Space>
                </div>
                <Tag
                  icon={<SafetyCertificateOutlined />}
                  color="green"
                  style={{ marginLeft: 'auto', borderRadius: 8, padding: '2px 12px' }}
                >
                  Verified
                </Tag>
              </div>
            </Card>

            {/* Similar Tours */}
            <div style={{ marginBottom: 24 }}>
              <Title level={4} style={{ marginBottom: 20 }}>You Might Also Like</Title>
              <Row gutter={[16, 16]}>
                {(similarTours.length > 0 ? similarTours : []).map((st: any) => (
                  <Col xs={24} sm={8} key={st.id}>
                    <Card
                      hoverable
                      onClick={() => navigate(`/tours/${st.id}`)}
                      style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                      styles={{ body: { padding: 0 } }}
                      className="card-hover-lift"
                    >
                      <div
                        style={{
                          height: 120,
                          backgroundImage: `url(${st.images?.[0] || CATEGORY_IMAGES[st.category] || CATEGORY_IMAGES.safari})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <div style={{ padding: '14px 16px' }}>
                        <Text strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>{st.name}</Text>
                        <Space size={4} style={{ marginBottom: 8 }}>
                          <EnvironmentOutlined style={{ color: '#a3a3a3', fontSize: 11 }} />
                          <Text style={{ color: '#a3a3a3', fontSize: 12 }}>{st.location}</Text>
                        </Space>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Space size={4}>
                            <StarFilled style={{ color: '#f59e0b', fontSize: 12 }} />
                            <Text style={{ fontSize: 13 }}>{st.rating}</Text>
                          </Space>
                          <Text strong style={{ color: '#166534', fontSize: 16 }}>${st.price}</Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>

          {/* ---- Sticky Booking Card (Sidebar) ---- */}
          <Col xs={24} lg={8}>
            <div style={{ position: 'sticky', top: 90 }}>
              <Card
                style={{
                  borderRadius: 20,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                }}
                styles={{ body: { padding: 0 } }}
              >
                {/* Gold accent */}
                <div
                  style={{
                    height: 4,
                    background: 'linear-gradient(90deg, #d97706, #b45309, #d97706)',
                  }}
                />

                <div style={{ padding: 28 }}>
                  {/* Price */}
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Text style={{ color: '#737373', fontSize: 13, display: 'block' }}>Starting from</Text>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
                      <Text style={{ fontSize: 40, fontWeight: 900, color: '#166534', lineHeight: 1 }}>
                        ${tour.price}
                      </Text>
                      <Text style={{ color: '#a3a3a3', fontSize: 14 }}>/person</Text>
                    </div>
                  </div>

                  <Divider style={{ margin: '0 0 24px' }} />

                  {/* Date Picker */}
                  <div style={{ marginBottom: 20 }}>
                    <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                      <CalendarOutlined style={{ marginRight: 6 }} />
                      Select Date
                    </Text>
                    <DatePicker
                      style={{ width: '100%', height: 44, borderRadius: 10 }}
                      placeholder="Choose a date"
                      size="large"
                    />
                  </div>

                  {/* Travelers */}
                  <div style={{ marginBottom: 24 }}>
                    <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                      <TeamOutlined style={{ marginRight: 6 }} />
                      Travelers
                    </Text>
                    <InputNumber
                      min={1}
                      max={tour.maxGroupSize}
                      value={travelers}
                      onChange={(val) => setTravelers(val || 1)}
                      style={{ width: '100%', height: 44, borderRadius: 10 }}
                      size="large"
                    />
                  </div>

                  {/* Total */}
                  <div
                    style={{
                      background: '#f0fdf4',
                      borderRadius: 14,
                      padding: '16px 20px',
                      marginBottom: 24,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text style={{ color: '#525252' }}>
                        ${tour.price} x {travelers} {travelers === 1 ? 'person' : 'people'}
                      </Text>
                      <Text strong>${tour.price * travelers}</Text>
                    </div>
                    <Divider style={{ margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong style={{ fontSize: 16 }}>Total</Text>
                      <Text strong style={{ fontSize: 22, color: '#166534' }}>
                        ${tour.price * travelers}
                      </Text>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <Button
                    type="primary"
                    block
                    size="large"
                    style={{
                      height: 52,
                      borderRadius: 14,
                      fontSize: 16,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
                      borderColor: '#166534',
                      boxShadow: '0 8px 24px rgba(22, 101, 52, 0.3)',
                    }}
                    icon={<DollarOutlined />}
                  >
                    Book Now
                  </Button>

                  <Text style={{ color: '#a3a3a3', fontSize: 12, display: 'block', textAlign: 'center', marginTop: 10 }}>
                    Free cancellation up to 24 hours before
                  </Text>
                </div>
              </Card>

              {/* Trust badges */}
              <Card
                style={{
                  borderRadius: 18,
                  marginTop: 16,
                  border: '1px solid #f0f0f0',
                }}
                styles={{ body: { padding: 20 } }}
              >
                <Space direction="vertical" size={14} style={{ width: '100%' }}>
                  {[
                    { icon: <SafetyCertificateOutlined />, text: 'Verified & licensed operator', color: '#166534' },
                    { icon: <DollarOutlined />, text: 'Best price guarantee', color: '#f59e0b' },
                    { icon: <CalendarOutlined />, text: 'Free cancellation 24h before', color: '#0ea5e9' },
                  ].map((badge, i) => (
                    <Space key={i} size={10}>
                      <span style={{ color: badge.color, fontSize: 16 }}>{badge.icon}</span>
                      <Text style={{ fontSize: 13, color: '#525252' }}>{badge.text}</Text>
                    </Space>
                  ))}
                </Space>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TourDetail;
