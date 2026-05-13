import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Space, Spin } from 'antd';
import { ArrowUpOutlined, DollarOutlined, CheckCircleOutlined, CloseCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { bookingsApi, complianceApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Booking } from '../types';

const { Title } = Typography;

export const Dashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingRes, complianceRes]: any[] = await Promise.all([
          bookingsApi.list({ limit: 5 }),
          complianceApi.getOperatorCompliance(user?.operatorId || ''),
        ]);
        setBookings(bookingRes.items || []);
        
        const totalRevenue = (bookingRes.items || []).reduce((sum: number, b: Booking) => sum + Number(b.totalAmount), 0);
        const compliantBookings = (bookingRes.items || []).filter((b: Booking) => b.isCompliant).length;
        
        setStats({
          totalBookings: bookingRes.total || 0,
          totalRevenue,
          compliantRate: (bookingRes.items || []).length > 0
            ? Math.round((compliantBookings / (bookingRes.items || []).length) * 100) : 0,
          complianceScore: complianceRes.complianceRate || 0,
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const columns = [
    { title: 'Reference', dataIndex: 'bookingReference', key: 'ref' },
    { title: 'Amount', dataIndex: 'totalAmount', key: 'amount', render: (v: number) => `$${Number(v).toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => {
      const colors: Record<string, string> = { confirmed: 'green', pending: 'orange', cancelled: 'red', completed: 'blue' };
      return <Tag color={colors[s] || 'default'}>{s.toUpperCase()}</Tag>;
    }},
    { title: 'Compliance', dataIndex: 'isCompliant', key: 'compliance', render: (v: boolean) =>
      <Tag color={v ? 'green' : 'red'}>{v ? 'Compliant' : 'Flagged'}</Tag>
    },
    { title: 'Date', dataIndex: 'createdAt', key: 'date', render: (d: string) => new Date(d).toLocaleDateString() },
  ];

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Title level={4}>Welcome, {user?.fullName}</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="Total Bookings" value={stats.totalBookings} prefix={<ShoppingCartOutlined />} valueStyle={{ color: '#166534' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="Revenue" value={stats.totalRevenue} prefix={<DollarOutlined />} precision={2} valueStyle={{ color: '#16a34a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="Compliance Rate" value={stats.complianceScore} suffix="%" prefix={<CheckCircleOutlined />} valueStyle={{ color: '#16a34a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="This Month" value={12} prefix={<ArrowUpOutlined />} suffix="bookings" valueStyle={{ color: '#2563eb' }} />
          </Card>
        </Col>
      </Row>
      <Card title="Recent Bookings" extra={<a href="/bookings">View All</a>}>
        <Table dataSource={bookings} columns={columns} rowKey="id" pagination={false} size="small" />
      </Card>
    </div>
  );
};
