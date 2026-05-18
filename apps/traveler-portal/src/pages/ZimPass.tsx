// ============================================================
// ZimVisit Traveler Portal - ZimPass QR Itinerary Page
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Tag,
  Timeline,
  Divider,
  Spin,
  message,
} from 'antd';
import {
  QrcodeOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  CompassOutlined,
  CarOutlined,
  RocketOutlined,
  PrinterOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { bookingsApi } from '../services/api';
import type { Booking } from '../types';

const { Title, Text, Paragraph } = Typography;

// ---- Mock ZimPass Itinerary Data ----
const ZIMPASS_DATA = {
  id: 'zp_001',
  bookingId: 'bk_001',
  qrCode: 'ZV-QR-001-ABCDEF',
  validFrom: '2026-06-14',
  validTo: '2026-06-16',
  status: 'active' as const,
  travelerName: 'Traveler Explorer',
  travelerEmail: 'traveler@example.com',
  items: [
    {
      id: 'zi_001',
      type: 'transfer' as const,
      title: 'Airport Pickup',
      description: 'Private transfer from Victoria Falls Airport to hotel',
      date: '2026-06-14',
      time: '14:00',
      location: 'Victoria Falls Airport',
      status: 'upcoming' as const,
      confirmationCode: 'TRF-001',
      notes: 'Driver will hold a ZimVisit sign at arrivals',
    },
    {
      id: 'zi_002',
      type: 'hotel' as const,
      title: 'Victoria Falls Hotel',
      description: 'Check-in at the historic Victoria Falls Hotel',
      date: '2026-06-14',
      time: '15:00',
      location: 'Victoria Falls Hotel, Zimbabwe',
      status: 'upcoming' as const,
      confirmationCode: 'HTL-002',
      notes: 'Deluxe room, 2 guests. Early check-in confirmed.',
    },
    {
      id: 'zi_003',
      type: 'tour' as const,
      title: 'Victoria Falls Grand Adventure',
      description: 'Full-day tour: Walking tour, helicopter flip, sunset cruise',
      date: '2026-06-15',
      time: '07:30',
      location: 'Victoria Falls Rainforest Entrance',
      status: 'upcoming' as const,
      confirmationCode: 'TOUR-003',
      notes: 'Wear comfortable shoes. Bring camera. Rain coats provided.',
    },
    {
      id: 'zi_004',
      type: 'activity' as const,
      title: 'Boma Dinner Experience',
      description: 'Traditional Zimbabwean dinner with drumming and dancing',
      date: '2026-06-15',
      time: '19:00',
      location: 'The Boma Restaurant, Victoria Falls',
      status: 'upcoming' as const,
      confirmationCode: 'ACT-004',
      notes: 'Dress code: Smart casual',
    },
    {
      id: 'zi_005',
      type: 'hotel' as const,
      title: 'Victoria Falls Hotel',
      description: 'Check-out',
      date: '2026-06-16',
      time: '11:00',
      location: 'Victoria Falls Hotel, Zimbabwe',
      status: 'upcoming' as const,
      confirmationCode: 'HTL-002',
    },
    {
      id: 'zi_006',
      type: 'transfer' as const,
      title: 'Airport Drop-off',
      description: 'Private transfer from hotel to Victoria Falls Airport',
      date: '2026-06-16',
      time: '13:00',
      location: 'Victoria Falls Hotel',
      status: 'upcoming' as const,
      confirmationCode: 'TRF-005',
      notes: 'Please be ready 15 minutes before pickup time',
    },
  ],
};

// ---- Type Icon Map ----
const TYPE_ICON: Record<string, React.ReactNode> = {
  flight: <RocketOutlined />,
  hotel: <HomeOutlined />,
  tour: <CompassOutlined />,
  transfer: <CarOutlined />,
  activity: <TeamOutlined />,
};

const TYPE_COLOR: Record<string, string> = {
  flight: '#0ea5e9',
  hotel: '#8b5cf6',
  tour: '#166534',
  transfer: '#f59e0b',
  activity: '#ef4444',
};

const TYPE_BG: Record<string, string> = {
  flight: '#f0f9ff',
  hotel: '#f5f3ff',
  tour: '#f0fdf4',
  transfer: '#fffbeb',
  activity: '#fef2f2',
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  upcoming: <ClockCircleOutlined style={{ color: '#f59e0b' }} />,
  completed: <CheckCircleFilled style={{ color: '#166534' }} />,
  skipped: <ExclamationCircleOutlined style={{ color: '#a3a3a3' }} />,
};

const ZimPass: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await bookingsApi.getById(id);
        setBooking((res as any).data || res);
      } catch (err) {
        message.error('Failed to load ZimPass data.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Derive ZimPass data from booking, fallback to mock
  const pass = booking ? {
    id: `zp_${booking.id}`,
    bookingId: booking.id,
    qrCode: booking.zimpassQR || `ZV-QR-${booking.reference}`,
    validFrom: booking.startDate,
    validTo: booking.endDate,
    status: booking.status === 'confirmed' ? 'active' as const : booking.status === 'cancelled' ? 'expired' as const : 'active' as const,
    travelerName: 'Traveler',
    travelerEmail: '',
    items: booking.items.map((item, i) => ({
      id: `zi_${item.id}`,
      type: item.type === 'tour' ? 'tour' as const : 'hotel' as const,
      title: item.itemName,
      description: item.itemName,
      date: item.date,
      time: '08:00',
      location: 'Zimbabwe',
      status: booking.status === 'completed' ? 'completed' as const : 'upcoming' as const,
      confirmationCode: `${item.type.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      notes: '',
    })),
  } : ZIMPASS_DATA;

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
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.1) 0%, transparent 50%)',
          }}
        />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <QrcodeOutlined style={{ color: '#f59e0b', fontSize: 24 }} />
            </div>
            <div>
              <Title level={2} style={{ color: '#ffffff', marginBottom: 0, fontWeight: 800 }}>
                ZimPass
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                Your Digital Travel Pass
              </Text>
            </div>
          </div>
          <Tag
            color="green"
            style={{
              borderRadius: 100,
              padding: '2px 16px',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {pass.status === 'active' ? 'Active' : pass.status === 'expired' ? 'Expired' : 'Used'}
          </Tag>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <Row gutter={[28, 28]}>
          {/* Main Itinerary */}
          <Col xs={24} lg={16}>
            {/* Validity */}
            <Card
              style={{ borderRadius: 18, marginBottom: 24, border: '1px solid #f0f0f0' }}
              styles={{ body: { padding: 24 } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <Text style={{ color: '#737373', fontSize: 13, display: 'block' }}>Validity Period</Text>
                  <Text strong style={{ fontSize: 16 }}>
                    {new Date(pass.validFrom).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} — {new Date(pass.validTo).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </Text>
                </div>
                <div>
                  <Text style={{ color: '#737373', fontSize: 13, display: 'block' }}>Traveler</Text>
                  <Text strong style={{ fontSize: 16 }}>{pass.travelerName}</Text>
                </div>
                <div>
                  <Text style={{ color: '#737373', fontSize: 13, display: 'block' }}>Pass ID</Text>
                  <Text
                    strong
                    style={{
                      fontSize: 14,
                      fontFamily: "'Courier New', monospace",
                      color: '#166534',
                    }}
                  >
                    {pass.qrCode}
                  </Text>
                </div>
              </div>
            </Card>

            {/* Instruction Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                borderRadius: 16,
                padding: '18px 24px',
                marginBottom: 24,
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <QrcodeOutlined style={{ color: '#ffffff', fontSize: 18 }} />
              </div>
              <div>
                <Text strong style={{ display: 'block', color: '#14532d', fontSize: 14 }}>
                  Show this QR at any checkpoint
                </Text>
                <Text style={{ color: '#166534', fontSize: 13 }}>
                  Present your ZimPass QR code to guides, hotel reception, and transfer drivers for seamless check-in.
                </Text>
              </div>
            </div>

            {/* Itinerary Timeline */}
            <Card
              style={{ borderRadius: 18, border: '1px solid #f0f0f0' }}
              styles={{ body: { padding: 28 } }}
            >
              <Title level={4} style={{ marginBottom: 28 }}>
                Your Itinerary
              </Title>

              {/* Group items by date */}
              {Array.from(new Set(pass.items.map((i) => i.date))).map((date) => (
                <div key={date} style={{ marginBottom: 32 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        background: '#166534',
                        color: '#ffffff',
                        padding: '6px 16px',
                        borderRadius: 100,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div style={{ flex: 1, height: 1, background: '#e5e5e5' }} />
                  </div>

                  <Timeline
                    items={pass.items
                      .filter((item) => item.date === date)
                      .map((item) => ({
                        dot: (
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: TYPE_BG[item.type],
                              border: `2px solid ${TYPE_COLOR[item.type]}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 16,
                              color: TYPE_COLOR[item.type],
                            }}
                          >
                            {TYPE_ICON[item.type]}
                          </div>
                        ),
                        children: (
                          <div
                            style={{
                              background: '#ffffff',
                              borderRadius: 14,
                              padding: '18px 22px',
                              border: '1px solid #f0f0f0',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                              marginLeft: 8,
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                              <div>
                                <Text strong style={{ display: 'block', fontSize: 16, marginBottom: 2 }}>
                                  {item.title}
                                </Text>
                                <Text style={{ color: '#737373', fontSize: 13 }}>
                                  {item.description}
                                </Text>
                              </div>
                              {STATUS_ICON[item.status]}
                            </div>

                            <Space size={16} wrap style={{ marginBottom: 8 }}>
                              <Space size={4}>
                                <ClockCircleOutlined style={{ color: '#a3a3a3', fontSize: 12 }} />
                                <Text style={{ color: '#525252', fontSize: 13, fontWeight: 600 }}>{item.time}</Text>
                              </Space>
                              <Space size={4}>
                                <EnvironmentOutlined style={{ color: '#a3a3a3', fontSize: 12 }} />
                                <Text style={{ color: '#525252', fontSize: 13 }}>{item.location}</Text>
                              </Space>
                              {item.confirmationCode && (
                                <Tag
                                  style={{
                                    borderRadius: 6,
                                    fontSize: 11,
                                    fontFamily: "'Courier New', monospace",
                                    background: '#f5f5f5',
                                    borderColor: '#e5e5e5',
                                  }}
                                >
                                  {item.confirmationCode}
                                </Tag>
                              )}
                            </Space>

                            {item.notes && (
                              <div
                                style={{
                                  background: '#fffbeb',
                                  borderRadius: 8,
                                  padding: '8px 12px',
                                  border: '1px solid #fde68a',
                                  marginTop: 8,
                                }}
                              >
                                <Text style={{ color: '#92400e', fontSize: 12 }}>
                                  <ExclamationCircleOutlined style={{ marginRight: 6 }} />
                                  {item.notes}
                                </Text>
                              </div>
                            )}
                          </div>
                        ),
                      }))}
                  />
                </div>
              ))}
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            <div style={{ position: 'sticky', top: 90 }}>
              {/* QR Code Card */}
              <Card
                style={{
                  borderRadius: 20,
                  border: '2px solid #166534',
                  boxShadow: '0 8px 32px rgba(22, 101, 52, 0.15)',
                  marginBottom: 20,
                  overflow: 'hidden',
                }}
                styles={{ body: { padding: 0 } }}
              >
                <div
                  style={{
                    background: 'linear-gradient(135deg, #166534, #14532d)',
                    padding: '20px 24px',
                    textAlign: 'center',
                  }}
                >
                  <QrcodeOutlined style={{ color: '#f59e0b', fontSize: 28, marginBottom: 8 }} />
                  <Title level={4} style={{ color: '#ffffff', margin: 0 }}>
                    Your ZimPass QR
                  </Title>
                </div>
                <div style={{ padding: 32, textAlign: 'center' }}>
                  {/* QR Code Display */}
                  <div
                    style={{
                      width: 200,
                      height: 200,
                      margin: '0 auto 24px',
                      background: '#ffffff',
                      border: '4px solid #166534',
                      borderRadius: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 10,
                        border: '2px dashed #bbf7d0',
                        borderRadius: 12,
                      }}
                    />
                    {/* Visual QR representation */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: 3,
                        padding: 16,
                      }}
                    >
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 2,
                            background:
                              [0, 1, 2, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41, 42, 43, 46, 47, 48].includes(i)
                                ? '#166534'
                                : [3, 4, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29, 31, 33, 36, 38, 40, 44, 45].includes(i)
                                ? Math.random() > 0.3
                                  ? '#166534'
                                  : '#ffffff'
                                : '#ffffff',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <Text
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: 13,
                      color: '#166534',
                      fontWeight: 700,
                      display: 'block',
                      marginBottom: 8,
                    }}
                  >
                    {pass.qrCode}
                  </Text>

                  <Text style={{ color: '#737373', fontSize: 12, display: 'block', marginBottom: 24 }}>
                    Scan at checkpoints for instant verification
                  </Text>

                  <Space direction="vertical" size={10} style={{ width: '100%' }}>
                    <Button
                      block
                      type="primary"
                      icon={<DownloadOutlined />}
                      style={{
                        height: 46,
                        borderRadius: 12,
                        fontWeight: 600,
                        background: '#166534',
                        borderColor: '#166534',
                      }}
                    >
                      Download ZimPass
                    </Button>
                    <Button
                      block
                      icon={<ShareAltOutlined />}
                      style={{ height: 46, borderRadius: 12, fontWeight: 600 }}
                    >
                      Share Itinerary
                    </Button>
                    <Button
                      block
                      icon={<PrinterOutlined />}
                      style={{ height: 46, borderRadius: 12, fontWeight: 600 }}
                    >
                      Print ZimPass
                    </Button>
                  </Space>
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card
                style={{
                  borderRadius: 18,
                  border: '1px solid #f0f0f0',
                  marginBottom: 20,
                }}
                styles={{ body: { padding: 24 } }}
              >
                <Title level={5} style={{ marginBottom: 16, color: '#ef4444' }}>
                  <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                  Emergency Contact
                </Title>
                <Space direction="vertical" size={8}>
                  <Text style={{ fontSize: 14 }}>
                    <strong>ZimVisit 24/7 Helpline</strong>
                  </Text>
                  <Text style={{ fontSize: 15, color: '#166534', fontWeight: 600 }}>
                    +263 4 ZIMVISIT
                  </Text>
                  <Text style={{ color: '#737373', fontSize: 13 }}>
                    support@zimvisit.co.zw
                  </Text>
                </Space>
              </Card>

              {/* Quick Info */}
              <Card
                style={{
                  borderRadius: 18,
                  border: '1px solid #f0f0f0',
                }}
                styles={{ body: { padding: 24 } }}
              >
                <Title level={5} style={{ marginBottom: 16 }}>
                  Travel Tips
                </Title>
                <Space direction="vertical" size={12}>
                  {[
                    'Keep your phone charged for QR scanning',
                    'Arrive 15 minutes early for each activity',
                    'Carry a printed copy as backup',
                    'Local currency is USD and ZWL',
                    'Tap water is safe in major cities',
                  ].map((tip, i) => (
                    <Text key={i} style={{ fontSize: 13, color: '#525252', display: 'flex', gap: 8 }}>
                      <CheckCircleFilled style={{ color: '#166534', marginTop: 2, flexShrink: 0 }} />
                      {tip}
                    </Text>
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

export default ZimPass;
