// ============================================================
// ZimVisit Traveler Portal - My Bookings Page
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Tag, Typography, Space, Tabs, Empty, Button, Badge, Skeleton, message, Alert } from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  SyncOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { Booking, BookingStatus } from '../types';
import { bookingsApi } from '../services/api';

const { Title, Text } = Typography;

// ---- Status Config ----
const STATUS_CONFIG: Record<BookingStatus, { color: string; label: string; icon: React.ReactNode }> = {
  pending: { color: 'gold', label: 'Pending', icon: <ExclamationCircleOutlined /> },
  confirmed: { color: 'green', label: 'Confirmed', icon: <CheckCircleFilled /> },
  'in-progress': { color: 'blue', label: 'In Progress', icon: <SyncOutlined spin /> },
  completed: { color: 'default', label: 'Completed', icon: <CheckCircleFilled /> },
  cancelled: { color: 'red', label: 'Cancelled', icon: <CloseCircleFilled /> },
  refunded: { color: 'orange', label: 'Refunded', icon: <SyncOutlined /> },
};

const PAYMENT_COLOR: Record<string, string> = {
  pending: 'gold',
  partial: 'orange',
  paid: 'green',
  refunded: 'blue',
  failed: 'red',
};

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await bookingsApi.getAll();
        const data = Array.isArray(res) ? res : (res as any).data || [];
        setAllBookings(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load bookings');
        message.error('Failed to load bookings. Please try again.');
        setAllBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filterBookings = (status: string) => {
    if (status === 'all') return allBookings;
    if (status === 'upcoming')
      return allBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');
    return allBookings.filter((b) => b.status === status);
  };

  const bookings = filterBookings(activeTab);

  const tabItems = [
    { key: 'all', label: <span>All <Badge count={allBookings.length} style={{ marginLeft: 6, backgroundColor: '#e5e5e5', color: '#525252', fontSize: 11 }} /></span> },
    { key: 'upcoming', label: <span>Upcoming <Badge count={allBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length} style={{ marginLeft: 6, backgroundColor: '#f0fdf4', color: '#166534', fontSize: 11 }} /></span> },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

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
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(245,158,11,0.08) 0%, transparent 50%)',
          }}
        />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Title level={2} style={{ color: '#ffffff', marginBottom: 8, fontWeight: 800 }}>
            My Bookings
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
            Manage your tours, hotels, and activities
          </Text>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ marginBottom: 28 }}
        />

        {/* Bookings List */}
        {loading ? (
          <Row gutter={[24, 24]}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Col xs={24} key={i}>
                <Card style={{ borderRadius: 18 }}>
                  <Skeleton active paragraph={{ rows: 4 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : error ? (
          <Card style={{ borderRadius: 18, textAlign: 'center', padding: '60px 24px' }}>
            <Empty
              description={
                <Text style={{ color: '#737373', fontSize: 16 }}>
                  {error}
                </Text>
              }
            >
              <Button
                type="primary"
                onClick={() => window.location.reload()}
                style={{ background: '#166534', borderColor: '#166534' }}
              >
                Retry
              </Button>
            </Empty>
          </Card>
        ) : bookings.length === 0 ? (
          <Card style={{ borderRadius: 18, textAlign: 'center', padding: '60px 24px' }}>
            <Empty
              description={
                <Text style={{ color: '#737373', fontSize: 16 }}>
                  No bookings found in this category.
                </Text>
              }
            >
              <Button type="primary" onClick={() => navigate('/explore')}>
                Explore Tours
              </Button>
            </Empty>
          </Card>
        ) : (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            {bookings.map((booking) => {
              const statusConf = STATUS_CONFIG[booking.status];
              return (
                <Card
                  key={booking.id}
                  hoverable
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                  style={{
                    borderRadius: 18,
                    border: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  styles={{ body: { padding: 0 } }}
                  className="card-hover-lift"
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {/* Left color strip */}
                    <div
                      style={{
                        width: 6,
                        background:
                          booking.status === 'confirmed'
                            ? '#166534'
                            : booking.status === 'pending'
                            ? '#f59e0b'
                            : booking.status === 'completed'
                            ? '#a3a3a3'
                            : '#ef4444',
                        borderRadius: '18px 0 0 18px',
                      }}
                    />

                    <div style={{ flex: 1, padding: '20px 24px' }}>
                      <Row gutter={[24, 12]} align="middle">
                        {/* Booking Info */}
                        <Col xs={24} md={10}>
                          <Space size={8} style={{ marginBottom: 8 }}>
                            <Tag
                              icon={statusConf.icon}
                              color={statusConf.color}
                              style={{ borderRadius: 8, fontWeight: 600, textTransform: 'capitalize' }}
                            >
                              {statusConf.label}
                            </Tag>
                            <Tag
                              color={PAYMENT_COLOR[booking.paymentStatus]}
                              style={{ borderRadius: 6, fontSize: 11, textTransform: 'capitalize' }}
                            >
                              {booking.paymentStatus}
                            </Tag>
                          </Space>
                          <Text
                            strong
                            style={{ display: 'block', fontSize: 16, marginBottom: 4, color: '#171717' }}
                          >
                            {booking.items.map((i) => i.itemName).join(' + ')}
                          </Text>
                          <Text style={{ color: '#a3a3a3', fontSize: 13 }}>
                            Ref: {booking.reference}
                          </Text>
                        </Col>

                        {/* Date */}
                        <Col xs={12} md={5}>
                          <Space size={6}>
                            <CalendarOutlined style={{ color: '#a3a3a3' }} />
                            <div>
                              <Text style={{ color: '#525252', fontSize: 14, display: 'block' }}>
                                {new Date(booking.startDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </Text>
                              <Text style={{ color: '#a3a3a3', fontSize: 12 }}>
                                {booking.travelers} {booking.travelers === 1 ? 'traveler' : 'travelers'}
                              </Text>
                            </div>
                          </Space>
                        </Col>

                        {/* Amount */}
                        <Col xs={12} md={5}>
                          <div>
                            <Text style={{ color: '#a3a3a3', fontSize: 12, display: 'block' }}>Total</Text>
                            <Text strong style={{ fontSize: 22, color: '#166534', fontWeight: 800 }}>
                              ${booking.totalAmount}
                            </Text>
                          </div>
                        </Col>

                        {/* Action */}
                        <Col xs={24} md={4} style={{ textAlign: 'right' }}>
                          <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            style={{
                              borderRadius: 10,
                              background: '#166534',
                              borderColor: '#166534',
                            }}
                          >
                            View
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Card>
              );
            })}
          </Space>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
