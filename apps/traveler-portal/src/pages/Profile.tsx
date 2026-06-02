// ============================================================
// ZimVisit Traveler Portal - Profile Page
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Avatar,
  Form,
  Input,
  Tag,
  Divider,
  Switch,
  Skeleton,
  Spin,
  Empty,
  message,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined,
  HeartOutlined,
  CompassOutlined,
  BellOutlined,
  LockOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import type { Booking } from '../types';
import { bookingsApi } from '../services/api';

const { Title, Text, Paragraph } = Typography;

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const handleSave = () => {
    form.validateFields().then(() => {
      message.success('Profile updated successfully!');
      setEditing(false);
    });
  };

  // Fetch bookings for travel stats
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setStatsLoading(true);
        const res = await bookingsApi.getAll();
        const data = Array.isArray(res) ? res : (res as any).data || [];
        setBookings(data);
      } catch (err: any) {
        setStatsError(err.message || 'Failed to load travel stats');
      } finally {
        setStatsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Calculate travel stats from real booking data
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const allDestinations = new Set(
    bookings.flatMap((b) => b.items.map((i) => i.itemName))
  );
  const totalNights = bookings.reduce((sum, b) => {
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return sum + nights;
  }, 0);

  const travelStats = {
    tripsCompleted: completedBookings.length + confirmedBookings.length,
    destinationsVisited: allDestinations.size,
    countriesVisited: 1,
    totalNights,
    favoriteDestination: 'Zimbabwe',
    memberSince: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'Recently',
  };

  // Travel interests
  const interests = ['Safari', 'Hiking', 'Cultural Heritage', 'Photography', 'Wildlife', 'Adventure'];

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
              'radial-gradient(circle at 70% 30%, rgba(245,158,11,0.1) 0%, transparent 50%)',
          }}
        />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Title level={2} style={{ color: '#ffffff', marginBottom: 8, fontWeight: 800 }}>
            My Profile
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
            Manage your account and travel preferences
          </Text>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <Row gutter={[28, 28]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            {/* Profile Card */}
            <Card
              style={{
                borderRadius: 20,
                border: '1px solid #f0f0f0',
                marginBottom: 24,
                overflow: 'hidden',
              }}
              styles={{ body: { padding: 0 } }}
            >
              {/* Cover */}
              <div
                style={{
                  height: 120,
                  background: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  }}
                />
              </div>

              <div style={{ padding: '0 32px 32px' }}>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: -40, marginBottom: 24 }}>
                  <div style={{ position: 'relative' }}>
                    <Avatar
                      size={96}
                      icon={<UserOutlined />}
                      src={user?.avatar}
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        border: '4px solid #ffffff',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        fontSize: 40,
                      }}
                    />
                    <Button
                      shape="circle"
                      size="small"
                      icon={<CameraOutlined />}
                      style={{
                        position: 'absolute',
                        bottom: 4,
                        right: 4,
                        background: '#166534',
                        borderColor: '#166534',
                        color: '#ffffff',
                        width: 28,
                        height: 28,
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Title level={3} style={{ marginBottom: 2 }}>
                      {user?.fullName || 'Traveler Explorer'}
                    </Title>
                    <Space size={12}>
                      <Tag
                        color="green"
                        style={{ borderRadius: 100, padding: '2px 14px', fontWeight: 600 }}
                        icon={<CheckCircleFilled />}
                      >
                        Verified Traveler
                      </Tag>
                      <Text style={{ color: '#737373', fontSize: 13 }}>
                        Member since {travelStats.memberSince}
                      </Text>
                    </Space>
                  </div>
                  <Button
                    icon={editing ? <SaveOutlined /> : <EditOutlined />}
                    type={editing ? 'primary' : 'default'}
                    onClick={editing ? handleSave : () => setEditing(true)}
                    style={{
                      borderRadius: 10,
                      ...(editing
                        ? { background: '#166534', borderColor: '#166534' }
                        : {}),
                    }}
                  >
                    {editing ? 'Save' : 'Edit Profile'}
                  </Button>
                </div>

                {/* Profile Form */}
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{
                    fullName: user?.fullName || 'Traveler Explorer',
                    email: user?.email || 'traveler@example.com',
                    phone: user?.phone || '+263 77 123 4567',
                    bio: 'Passionate traveler exploring the beauty of Zimbabwe. Love safaris, hiking, and cultural experiences.',
                    location: 'Harare, Zimbabwe',
                    nationality: 'Zimbabwean',
                  }}
                  disabled={!editing}
                  requiredMark={false}
                >
                  <Row gutter={20}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="fullName" label="Full Name">
                        <Input prefix={<UserOutlined style={{ color: '#a3a3a3' }} />} style={{ borderRadius: 10, height: 44 }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="email" label="Email">
                        <Input prefix={<MailOutlined style={{ color: '#a3a3a3' }} />} style={{ borderRadius: 10, height: 44 }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="phone" label="Phone">
                        <Input prefix={<PhoneOutlined style={{ color: '#a3a3a3' }} />} style={{ borderRadius: 10, height: 44 }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="location" label="Location">
                        <Input prefix={<EnvironmentOutlined style={{ color: '#a3a3a3' }} />} style={{ borderRadius: 10, height: 44 }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="nationality" label="Nationality">
                        <Input prefix={<GlobalOutlined style={{ color: '#a3a3a3' }} />} style={{ borderRadius: 10, height: 44 }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item name="bio" label="Bio">
                        <Input.TextArea
                          rows={3}
                          style={{ borderRadius: 10 }}
                          placeholder="Tell us about your travel style..."
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Card>

            {/* Travel Interests */}
            <Card
              style={{ borderRadius: 18, marginBottom: 24, border: '1px solid #f0f0f0' }}
              styles={{ body: { padding: 28 } }}
            >
              <Title level={4} style={{ marginBottom: 16 }}>
                <HeartOutlined style={{ marginRight: 8, color: '#ef4444' }} />
                Travel Interests
              </Title>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {interests.map((interest) => (
                  <Tag
                    key={interest}
                    style={{
                      padding: '6px 18px',
                      borderRadius: 100,
                      fontSize: 14,
                      fontWeight: 500,
                      background: '#f0fdf4',
                      color: '#166534',
                      borderColor: '#bbf7d0',
                      cursor: editing ? 'pointer' : 'default',
                    }}
                  >
                    {interest}
                  </Tag>
                ))}
                {editing && (
                  <Tag
                    style={{
                      padding: '6px 18px',
                      borderRadius: 100,
                      fontSize: 14,
                      fontWeight: 500,
                      borderStyle: 'dashed',
                      cursor: 'pointer',
                    }}
                  >
                    + Add Interest
                  </Tag>
                )}
              </div>
            </Card>

            {/* Preferences */}
            <Card
              style={{ borderRadius: 18, marginBottom: 24, border: '1px solid #f0f0f0' }}
              styles={{ body: { padding: 28 } }}
            >
              <Title level={4} style={{ marginBottom: 20 }}>
                <BellOutlined style={{ marginRight: 8 }} />
                Preferences
              </Title>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {[
                  { label: 'Email notifications for booking updates', defaultChecked: true },
                  { label: 'SMS alerts for trip reminders', defaultChecked: true },
                  { label: 'Push notifications for deals', defaultChecked: false },
                  { label: 'Newsletter with travel inspiration', defaultChecked: true },
                  { label: 'Share travel stats publicly', defaultChecked: false },
                ].map((pref, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: i < 4 ? '1px solid #f5f5f5' : 'none',
                    }}
                  >
                    <Text style={{ fontSize: 15 }}>{pref.label}</Text>
                    <Switch defaultChecked={pref.defaultChecked} />
                  </div>
                ))}
              </Space>
            </Card>

            {/* Security */}
            <Card
              style={{ borderRadius: 18, border: '1px solid #f0f0f0' }}
              styles={{ body: { padding: 28 } }}
            >
              <Title level={4} style={{ marginBottom: 20 }}>
                <LockOutlined style={{ marginRight: 8 }} />
                Security
              </Title>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 0',
                    borderBottom: '1px solid #f5f5f5',
                  }}
                >
                  <div>
                    <Text strong style={{ display: 'block', fontSize: 15 }}>Password</Text>
                    <Text style={{ color: '#737373', fontSize: 13 }}>Last changed 3 months ago</Text>
                  </div>
                  <Button style={{ borderRadius: 10 }}>Change Password</Button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 0',
                  }}
                >
                  <div>
                    <Text strong style={{ display: 'block', fontSize: 15 }}>Two-Factor Authentication</Text>
                    <Text style={{ color: '#737373', fontSize: 13 }}>Add an extra layer of security</Text>
                  </div>
                  <Tag color="orange" style={{ borderRadius: 8 }}>Not Enabled</Tag>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            <div style={{ position: 'sticky', top: 90 }}>
              {/* Travel Stats */}
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
                    background: 'linear-gradient(135deg, #166534, #14532d)',
                    padding: '20px 24px',
                    textAlign: 'center',
                  }}
                >
                  <TrophyOutlined style={{ color: '#f59e0b', fontSize: 28, marginBottom: 8 }} />
                  <Title level={4} style={{ color: '#ffffff', margin: 0 }}>
                    Travel Stats
                  </Title>
                </div>
                <div style={{ padding: 24 }}>
                  {statsLoading ? (
                    <Skeleton active paragraph={{ rows: 4 }} />
                  ) : statsError ? (
                    <Empty
                      description={<Text style={{ color: '#737373' }}>Could not load stats</Text>}
                      style={{ padding: '20px 0' }}
                    />
                  ) : (
                    <>
                      <Row gutter={[16, 20]}>
                        <Col span={12}>
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                fontSize: 32,
                                fontWeight: 900,
                                color: '#166534',
                                lineHeight: 1,
                                marginBottom: 4,
                              }}
                            >
                              {travelStats.tripsCompleted}
                            </div>
                            <Text style={{ color: '#737373', fontSize: 13 }}>Trips Completed</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                fontSize: 32,
                                fontWeight: 900,
                                color: '#f59e0b',
                                lineHeight: 1,
                                marginBottom: 4,
                              }}
                            >
                              {travelStats.destinationsVisited}
                            </div>
                            <Text style={{ color: '#737373', fontSize: 13 }}>Destinations</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                fontSize: 32,
                                fontWeight: 900,
                                color: '#0ea5e9',
                                lineHeight: 1,
                                marginBottom: 4,
                              }}
                            >
                              {travelStats.countriesVisited}
                            </div>
                            <Text style={{ color: '#737373', fontSize: 13 }}>Countries</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                fontSize: 32,
                                fontWeight: 900,
                                color: '#8b5cf6',
                                lineHeight: 1,
                                marginBottom: 4,
                              }}
                            >
                              {travelStats.totalNights}
                            </div>
                            <Text style={{ color: '#737373', fontSize: 13 }}>Total Nights</Text>
                          </div>
                        </Col>
                      </Row>

                      <Divider style={{ margin: '20px 0' }} />

                      <div style={{ textAlign: 'center' }}>
                        <Text style={{ color: '#737373', fontSize: 12, display: 'block' }}>Favorite Destination</Text>
                        <Text strong style={{ fontSize: 16, color: '#166534' }}>
                          <CompassOutlined style={{ marginRight: 6 }} />
                          {travelStats.favoriteDestination}
                        </Text>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Badges */}
              <Card
                style={{ borderRadius: 18, border: '1px solid #f0f0f0', marginBottom: 20 }}
                styles={{ body: { padding: 24 } }}
              >
                <Title level={5} style={{ marginBottom: 16 }}>
                  <SafetyCertificateOutlined style={{ marginRight: 8, color: '#f59e0b' }} />
                  Achievements
                </Title>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  {[
                    { icon: '🦁', name: 'Safari Explorer', desc: 'Completed 3 safari tours', color: '#84cc16' },
                    { icon: '🌊', name: 'Falls Witness', desc: 'Visited Victoria Falls', color: '#0ea5e9' },
                    { icon: '⛰️', name: 'Mountain Trekker', desc: 'Summited a peak', color: '#16a34a' },
                    { icon: '🏛️', name: 'Heritage Seeker', desc: 'Visited Great Zimbabwe', color: '#a855f7' },
                  ].map((badge, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 14px',
                        background: '#fafafa',
                        borderRadius: 12,
                      }}
                    >
                      <span style={{ fontSize: 24 }}>{badge.icon}</span>
                      <div>
                        <Text strong style={{ display: 'block', fontSize: 14 }}>{badge.name}</Text>
                        <Text style={{ color: '#737373', fontSize: 12 }}>{badge.desc}</Text>
                      </div>
                    </div>
                  ))}
                </Space>
              </Card>

              {/* Quick Actions */}
              <Card
                style={{ borderRadius: 18, border: '1px solid #f0f0f0' }}
                styles={{ body: { padding: 20 } }}
              >
                <Space direction="vertical" size={10} style={{ width: '100%' }}>
                  <Button
                    block
                    icon={<CompassOutlined />}
                    href="/explore"
                    style={{ borderRadius: 10, height: 42, textAlign: 'left' }}
                  >
                    Explore New Tours
                  </Button>
                  <Button
                    block
                    icon={<HeartOutlined />}
                    style={{ borderRadius: 10, height: 42, textAlign: 'left' }}
                  >
                    My Wishlist
                  </Button>
                  <Button
                    block
                    icon={<GlobalOutlined />}
                    style={{ borderRadius: 10, height: 42, textAlign: 'left' }}
                  >
                    Travel History
                  </Button>
                </Space>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Profile;
