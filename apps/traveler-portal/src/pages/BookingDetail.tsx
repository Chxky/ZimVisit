// ============================================================
// ZimVisit Traveler Portal - Booking Detail Page
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Tag,
  Typography,
  Space,
  Steps,
  Button,
  Divider,
  List,
  Descriptions,
  Breadcrumb,
  Spin,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  SyncOutlined,
  ExclamationCircleOutlined,
  QrcodeOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  TeamOutlined,
  HomeOutlined,
  FileTextOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import type { Booking, BookingStatus, BookingItem } from '../types';
import { bookingsApi } from '../services/api';

const { Title, Text, Paragraph } = Typography;

// ---- Status Config ----
const STATUS_CONFIG: Record<BookingStatus, { color: string; label: string; icon: React.ReactNode }> = {
  pending: { color: 'gold', label: 'Pending Confirmation', icon: <ExclamationCircleOutlined /> },
  confirmed: { color: 'green', label: 'Confirmed', icon: <CheckCircleFilled /> },
  'in-progress': { color: 'blue', label: 'In Progress', icon: <SyncOutlined spin /> },
  completed: { color: 'default', label: 'Completed', icon: <CheckCircleFilled /> },
  cancelled: { color: 'red', label: 'Cancelled', icon: <CloseCircleFilled /> },
  refunded: { color: 'orange', label: 'Refunded', icon: <SyncOutlined /> },
};

const ITEM_TYPE_ICON: Record<string, React.ReactNode> = {
  tour: <EnvironmentOutlined />,
  hotel: <HomeOutlined />,
  activity: <FileTextOutlined />,
  transfer: <TeamOutlined />,
};

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) {
        setLoading(false);
        setError('No booking ID provided.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await bookingsApi.getById(id);
        setBooking((res as any).data || res);
      } catch (err: any) {
        setError(err.message || 'Failed to load booking');
        message.error('Failed to load booking details.');
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

  if (error || !booking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Text style={{ fontSize: 16, color: '#737373' }}>{error || 'Booking not found.'}</Text>
        <Space>
          <Button type="primary" onClick={() => window.location.reload()} style={{ background: '#166534', borderColor: '#166534' }}>
            Retry
          </Button>
          <Button onClick={() => navigate('/bookings')}>Back to Bookings</Button>
        </Space>
      </div>
    );
  }

  const statusConf = STATUS_CONFIG[booking.status];

  // Timeline steps based on status
  const timelineSteps = [
    {
      title: 'Booked',
      description: new Date(booking.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'finish' as const,
    },
    {
      title: 'Payment',
      description: booking.paymentStatus === 'paid' ? 'Paid' : 'Pending',
      status: booking.paymentStatus === 'paid' ? ('finish' as const) : ('process' as const),
    },
    {
      title: 'Confirmed',
      description: ['confirmed', 'in-progress', 'completed'].includes(booking.status)
        ? 'Operator confirmed'
        : 'Awaiting confirmation',
      status: ['confirmed', 'in-progress', 'completed'].includes(booking.status)
        ? ('finish' as const)
        : ('wait' as const),
    },
    {
      title: 'Experience',
      description: booking.status === 'completed' ? 'Completed' : booking.status === 'in-progress' ? 'In progress' : 'Upcoming',
      status:
        booking.status === 'completed'
          ? ('finish' as const)
          : booking.status === 'in-progress'
          ? ('process' as const)
          : ('wait' as const),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #052e16 0%, #166534 100%)',
          padding: '32px 24px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/bookings')}
            style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 12, padding: '4px 0' }}
          >
            Back to Bookings
          </Button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <Title level={3} style={{ color: '#ffffff', marginBottom: 4, fontWeight: 800 }}>
                Booking {booking.reference}
              </Title>
              <Space size={12}>
                <Tag
                  icon={statusConf.icon}
                  color={statusConf.color}
                  style={{ borderRadius: 8, fontWeight: 600, padding: '2px 14px', fontSize: 13 }}
                >
                  {statusConf.label}
                </Tag>
                <Tag
                  color={booking.paymentStatus === 'paid' ? 'green' : 'gold'}
                  style={{ borderRadius: 8, padding: '2px 14px', fontSize: 13, textTransform: 'capitalize' }}
                >
                  {booking.paymentStatus}
                </Tag>
              </Space>
            </div>
            <Space>
              <Button
                icon={<PrinterOutlined />}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  borderRadius: 10,
                }}
              >
                Print
              </Button>
              <Button
                icon={<ShareAltOutlined />}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  borderRadius: 10,
                }}
              >
                Share
              </Button>
            </Space>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <Row gutter={[28, 28]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            {/* Status Timeline */}
            <Card
              style={{ borderRadius: 18, marginBottom: 24, border: '1px solid #f0f0f0' }}
              styles={{ body: { padding: 28 } }}
            >
              <Title level={4} style={{ marginBottom: 24 }}>Booking Status</Title>
              <Steps
                current={timelineSteps.findIndex((s) => s.status === 'process' || s.status === 'wait')}
                items={timelineSteps}
              />
            </Card>

            {/* Items List */}
            <Card
              style={{ borderRadius: 18, marginBottom: 24, border: '1px solid #f0f0f0' }}
              styles={{ body: { padding: 28 } }}
            >
              <Title level={4} style={{ marginBottom: 20 }}>Booking Items</Title>
              <List
                dataSource={booking.items}
                renderItem={(item: BookingItem) => (
                  <List.Item
                    style={{
                      border: '1px solid #f5f5f5',
                      borderRadius: 14,
                      padding: 20,
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 16, width: '100%', flexWrap: 'wrap' }}>
                      {/* Icon */}
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 14,
                          background: '#f0fdf4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 22,
                          color: '#166534',
                          border: '1px solid #bbf7d0',
                          flexShrink: 0,
                        }}
                      >
                        {ITEM_TYPE_ICON[item.type]}
                      </div>

                      <div style={{ flex: 1, minWidth: 200 }}>
                        <Text strong style={{ display: 'block', fontSize: 16, marginBottom: 4 }}>
                          {item.itemName}
                        </Text>
                        <Space size={16} wrap>
                          <Space size={4}>
                            <CalendarOutlined style={{ color: '#a3a3a3', fontSize: 12 }} />
                            <Text style={{ color: '#525252', fontSize: 13 }}>
                              {new Date(item.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                              {item.endDate && (
                                <> - {new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
                              )}
                            </Text>
                          </Space>
                          <Space size={4}>
                            <TeamOutlined style={{ color: '#a3a3a3', fontSize: 12 }} />
                            <Text style={{ color: '#525252', fontSize: 13 }}>Qty: {item.quantity}</Text>
                          </Space>
                          <Tag
                            color={item.status === 'confirmed' ? 'green' : item.status === 'pending' ? 'gold' : 'red'}
                            style={{ borderRadius: 6, fontSize: 11, textTransform: 'capitalize' }}
                          >
                            {item.status}
                          </Tag>
                        </Space>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <Text style={{ color: '#a3a3a3', fontSize: 12, display: 'block' }}>
                          ${item.unitPrice} x {item.quantity}
                        </Text>
                        <Text strong style={{ fontSize: 20, color: '#166534' }}>
                          ${item.totalPrice}
                        </Text>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* Special Requests */}
            {booking.specialRequests && (
              <Card
                style={{ borderRadius: 18, marginBottom: 24, border: '1px solid #f0f0f0' }}
                styles={{ body: { padding: 28 } }}
              >
                <Title level={4} style={{ marginBottom: 12 }}>Special Requests</Title>
                <Paragraph style={{ color: '#525252', fontSize: 15, lineHeight: 1.7 }}>
                  {booking.specialRequests}
                </Paragraph>
              </Card>
            )}

            {/* Booking Details */}
            <Card
              style={{ borderRadius: 18, marginBottom: 24, border: '1px solid #f0f0f0' }}
              styles={{ body: { padding: 28 } }}
            >
              <Title level={4} style={{ marginBottom: 16 }}>Booking Details</Title>
              <Descriptions column={{ xs: 1, sm: 2 }} size="small">
                <Descriptions.Item label="Reference">{booking.reference}</Descriptions.Item>
                <Descriptions.Item label="Travelers">{booking.travelers}</Descriptions.Item>
                <Descriptions.Item label="Start Date">
                  {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </Descriptions.Item>
                <Descriptions.Item label="End Date">
                  {new Date(booking.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </Descriptions.Item>
                <Descriptions.Item label="Booked On">
                  {new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Method">Credit Card</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            <div style={{ position: 'sticky', top: 90 }}>
              {/* Payment Summary */}
              <Card
                style={{
                  borderRadius: 20,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  marginBottom: 20,
                  overflow: 'hidden',
                }}
                styles={{ body: { padding: 0 } }}
              >
                <div
                  style={{
                    height: 4,
                    background: 'linear-gradient(90deg, #d97706, #b45309, #d97706)',
                  }}
                />
                <div style={{ padding: 28 }}>
                  <Title level={4} style={{ marginBottom: 20 }}>Payment Summary</Title>

                  {booking.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 12,
                      }}
                    >
                      <Text style={{ color: '#525252', fontSize: 14, maxWidth: '60%' }}>
                        {item.itemName}
                      </Text>
                      <Text style={{ fontSize: 14 }}>${item.totalPrice}</Text>
                    </div>
                  ))}

                  <Divider style={{ margin: '16px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#737373' }}>Subtotal</Text>
                    <Text>${booking.totalAmount}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#737373' }}>Service Fee</Text>
                    <Text>$0</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#737373' }}>Taxes</Text>
                    <Text>Included</Text>
                  </div>

                  <Divider style={{ margin: '16px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong style={{ fontSize: 18 }}>Total Paid</Text>
                    <Text strong style={{ fontSize: 26, color: '#166534', fontWeight: 900 }}>
                      ${booking.totalAmount}
                    </Text>
                  </div>
                </div>
              </Card>

              {/* ZimPass QR Code */}
              {booking.zimpassQR && (
                <Card
                  style={{
                    borderRadius: 20,
                    border: '2px solid #166534',
                    boxShadow: '0 4px 20px rgba(22, 101, 52, 0.12)',
                    marginBottom: 20,
                    overflow: 'hidden',
                  }}
                  styles={{ body: { padding: 0 } }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #166534, #14532d)',
                      padding: '16px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <QrcodeOutlined style={{ color: '#f59e0b', fontSize: 20 }} />
                    <Text strong style={{ color: '#ffffff', fontSize: 15 }}>
                      ZimPass Digital Pass
                    </Text>
                  </div>
                  <div style={{ padding: 28, textAlign: 'center' }}>
                    {/* QR Code Placeholder */}
                    <div
                      style={{
                        width: 180,
                        height: 180,
                        margin: '0 auto 20px',
                        background: '#ffffff',
                        border: '3px solid #166534',
                        borderRadius: 16,
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
                          inset: 8,
                          border: '2px dashed #bbf7d0',
                          borderRadius: 10,
                        }}
                      />
                      <QrcodeOutlined style={{ fontSize: 48, color: '#166534', marginBottom: 8 }} />
                      <Text
                        style={{
                          fontFamily: "'Courier New', monospace",
                          fontSize: 10,
                          color: '#166534',
                          fontWeight: 600,
                        }}
                      >
                        {booking.zimpassQR}
                      </Text>
                    </div>

                    <Text style={{ color: '#737373', fontSize: 13, display: 'block', marginBottom: 20 }}>
                      Show this QR code at any ZimVisit checkpoint
                    </Text>

                    <Space size={8}>
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        style={{
                          borderRadius: 10,
                          background: '#166534',
                          borderColor: '#166534',
                        }}
                        onClick={() => navigate(`/zimpass?bookingId=${booking?.id || ''}`)}
                      >
                        View ZimPass
                      </Button>
                      <Button
                        icon={<ShareAltOutlined />}
                        style={{ borderRadius: 10 }}
                      >
                        Share
                      </Button>
                    </Space>
                  </div>
                </Card>
              )}

              {/* Actions */}
              <Card
                style={{ borderRadius: 18, border: '1px solid #f0f0f0' }}
                styles={{ body: { padding: 20 } }}
              >
                <Space direction="vertical" size={10} style={{ width: '100%' }}>
                  <Button
                    block
                    icon={<DownloadOutlined />}
                    style={{ borderRadius: 10, height: 42 }}
                  >
                    Download Receipt
                  </Button>
                  <Button
                    block
                    icon={<PrinterOutlined />}
                    style={{ borderRadius: 10, height: 42 }}
                  >
                    Print Booking
                  </Button>
                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <Button
                      block
                      danger
                      icon={<CloseCircleFilled />}
                      style={{ borderRadius: 10, height: 42 }}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </Space>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BookingDetail;
