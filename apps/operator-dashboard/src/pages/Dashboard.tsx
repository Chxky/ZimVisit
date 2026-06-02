import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Table, Tag, Typography, Space, Spin, Progress, Button, Badge } from 'antd';
import {
  ArrowUpOutlined, DollarOutlined, CheckCircleOutlined,
  ShoppingCartOutlined, CalendarOutlined, WarningOutlined, BellOutlined,
  RightOutlined, SafetyOutlined, TeamOutlined, RiseOutlined,
  ClockCircleOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { bookingsApi, complianceApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Booking } from '../types';

const { Title, Text } = Typography;

// Mock chart data
const revenueData = [
  { month: 'Jan', revenue: 18200, bookings: 42 },
  { month: 'Feb', revenue: 22400, bookings: 51 },
  { month: 'Mar', revenue: 19800, bookings: 46 },
  { month: 'Apr', revenue: 28600, bookings: 63 },
  { month: 'May', revenue: 32100, bookings: 72 },
  { month: 'Jun', revenue: 27500, bookings: 58 },
  { month: 'Jul', revenue: 35800, bookings: 81 },
  { month: 'Aug', revenue: 31200, bookings: 69 },
  { month: 'Sep', revenue: 29400, bookings: 65 },
  { month: 'Oct', revenue: 34700, bookings: 78 },
  { month: 'Nov', revenue: 38200, bookings: 85 },
  { month: 'Dec', revenue: 41500, bookings: 92 },
];

const compliancePieData = [
  { name: 'Compliant', value: 87, color: '#059669' },
  { name: 'Pending', value: 8, color: '#f59e0b' },
  { name: 'Flagged', value: 5, color: '#dc2626' },
];

const quickActions = [
  { key: 'bookings', label: 'New Booking', icon: <CalendarOutlined />, color: '#4ade80', bg: 'rgba(22, 163, 74, 0.1)', path: '/bookings' },
  { key: 'inventory', label: 'Add Listing', icon: <ShoppingCartOutlined />, color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)', path: '/inventory/new' },
  { key: 'compliance', label: 'View Compliance', icon: <SafetyOutlined />, color: '#34d399', bg: 'rgba(5, 150, 105, 0.1)', path: '/compliance' },
  { key: 'staff', label: 'Manage Staff', icon: <TeamOutlined />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', path: '/staff' },
];

const alerts = [
  { id: 1, type: 'warning' as const, message: 'Levy payment for 3 bookings pending remittance', time: '2 hours ago' },
  { id: 2, type: 'error' as const, message: 'Booking #ZV-2984 flagged for compliance review', time: '4 hours ago' },
  { id: 3, type: 'success' as const, message: 'Monthly compliance report generated successfully', time: '1 day ago' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        backdropFilter: 'blur(10px)',
      }}>
        <Text style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>{label}</Text>
        <Text style={{ fontSize: 14, fontWeight: 700, color: '#4ade80' }}>
          ${payload[0].value.toLocaleString()}
        </Text>
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
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
          complianceScore: complianceRes.complianceRate || 87,
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
    {
      title: 'Reference',
      dataIndex: 'bookingReference',
      key: 'ref',
      render: (v: string, r: Booking) => (
        <a onClick={() => navigate(`/bookings/${r.id}`)} style={{ fontWeight: 600, color: '#4ade80' }}>
          {v}
        </a>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'amount',
      render: (v: number) => (
        <Text style={{ fontWeight: 600, color: '#1e293b' }}>${Number(v).toLocaleString()}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const colors: Record<string, string> = {
          confirmed: 'green', pending: 'orange', cancelled: 'red', completed: 'blue',
          in_progress: 'purple', pending_payment: 'gold',
        };
        return <Tag color={colors[s] || 'default'}>{s.replace('_', ' ').toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Compliance',
      dataIndex: 'isCompliant',
      key: 'compliance',
      render: (v: boolean) => (
        <Badge status={v ? 'success' : 'error'} text={v ? 'Compliant' : 'Flagged'} />
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (d: string) => (
        <Text type="secondary">{new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={4} style={{ margin: 0, color: '#1e293b' }}>
              Welcome back, {user?.fullName?.split(' ')[0] || 'Operator'}
            </Title>
            <Text type="secondary" style={{ color: '#64748b' }}>Here is your business at a glance</Text>
          </div>
          <Space>
            <Button icon={<CalendarOutlined />}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </Button>
          </Space>
        </div>
      </div>

      {/* Stat Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }} className="stagger-children">
        <Col xs={24} sm={12} lg={6}>
          <div className="card-stat animate-fade-in-up" style={{ position: 'relative' }}>
            <Card bordered={false} className="glass-card" style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ color: '#64748b', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Total Revenue
                  </Text>
                  <Title level={3} style={{ margin: '4px 0 0 0', color: '#4ade80', textShadow: '0 0 10px rgba(74, 222, 128, 0.3)' }}>
                    ${stats.totalRevenue?.toLocaleString() || '0'}
                  </Title>
                </div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(74, 222, 128, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <DollarOutlined style={{ fontSize: 20, color: '#4ade80' }} />
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Tag color="green" style={{ margin: 0, borderRadius: 10 }}>
                  <ArrowUpOutlined /> 12.5%
                </Tag>
                <Text style={{ fontSize: 12, color: '#64748b' }}>vs last month</Text>
              </div>
            </Card>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="card-stat animate-fade-in-up" style={{ position: 'relative' }}>
            <Card bordered={false} className="glass-card" style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ color: '#64748b', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Total Bookings
                  </Text>
                  <Title level={3} style={{ margin: '4px 0 0 0', color: '#d97706', textShadow: '0 0 10px rgba(217, 119, 6, 0.3)' }}>
                    {stats.totalBookings || 0}
                  </Title>
                </div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(251, 191, 36, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <ShoppingCartOutlined style={{ fontSize: 20, color: '#d97706' }} />
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Tag color="gold" style={{ margin: 0, borderRadius: 10 }}>
                  <ArrowUpOutlined /> 8.3%
                </Tag>
                <Text style={{ fontSize: 12, color: '#64748b' }}>vs last month</Text>
              </div>
            </Card>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="card-stat animate-fade-in-up" style={{ position: 'relative' }}>
            <Card bordered={false} className="glass-card" style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ color: '#64748b', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Compliance Rate
                  </Text>
                  <Title level={3} style={{ margin: '4px 0 0 0', color: '#4ade80', textShadow: '0 0 10px rgba(74, 222, 128, 0.3)' }}>
                    {stats.complianceScore || 0}%
                  </Title>
                </div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <SafetyOutlined style={{ fontSize: 20, color: '#34d399' }} />
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <Progress
                  percent={stats.complianceScore || 0}
                  strokeColor={stats.complianceScore >= 80 ? '#059669' : stats.complianceScore >= 60 ? '#f59e0b' : '#dc2626'}
                  showInfo={false}
                  size="small"
                />
              </div>
            </Card>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="card-stat animate-fade-in-up" style={{ position: 'relative' }}>
            <Card bordered={false} className="glass-card" style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ color: '#64748b', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Active Listings
                  </Text>
                  <Title level={3} style={{ margin: '4px 0 0 0', color: '#f59e0b', textShadow: '0 0 10px rgba(245, 158, 11, 0.3)' }}>
                    24
                  </Title>
                </div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(245, 158, 11, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <RiseOutlined style={{ fontSize: 20, color: '#f59e0b' }} />
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Tag color="orange" style={{ margin: 0, borderRadius: 10 }}>
                  <ArrowUpOutlined /> 3 new
                </Tag>
                <Text style={{ fontSize: 12, color: '#64748b' }}>this month</Text>
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Main Content Grid */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Revenue Chart */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <Text style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Revenue Trend</Text>
                <Tag color="green" style={{ background: 'rgba(74, 222, 128, 0.1)', borderColor: 'rgba(74, 222, 128, 0.3)' }}>+12.5% YoY</Tag>
              </Space>
            }
            bordered={false}
            className="glass-card"
            style={{ borderRadius: 12 }}
            extra={
              <Space>
                <Button size="small" type="text" style={{ color: '#64748b' }}>Week</Button>
                <Button size="small" type="primary" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', border: 'none', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)' }}>Month</Button>
                <Button size="small" type="text" style={{ color: '#64748b' }}>Year</Button>
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4ade80"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  className="recharts-area-area"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Compliance Ring + Quick Actions */}
        <Col xs={24} lg={8}>
          <Row gutter={[20, 20]}>
            {/* Compliance Ring */}
            <Col span={24}>
              <Card
                bordered={false}
                className="glass-card"
                style={{ borderRadius: 12 }}
                title={<Text style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Compliance Status</Text>}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                  <div style={{ position: 'relative', width: 120, height: 120 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={compliancePieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={38}
                          outerRadius={55}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {compliancePieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                    }}>
                      <Text style={{ fontSize: 24, fontWeight: 800, color: '#059669', display: 'block', lineHeight: 1 }}>
                        87%
                      </Text>
                      <Text style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Compliant
                      </Text>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {compliancePieData.map((item) => (
                      <Space key={item.name} size={10}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                        <Text style={{ fontSize: 13, color: '#64748b' }}>{item.name}</Text>
                        <Text style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{item.value}%</Text>
                      </Space>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>

            {/* Quick Actions */}
            <Col span={24}>
              <Card
                bordered={false}
                className="glass-card"
                style={{ borderRadius: 12 }}
                title={<Text style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Quick Actions</Text>}
                bodyStyle={{ padding: '12px 16px' }}
              >
                <Row gutter={[10, 10]}>
                  {quickActions.map((action) => (
                    <Col span={12} key={action.key}>
                      <div
                        onClick={() => navigate(action.path)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 10,
                          background: action.bg,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: '1px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = action.color;
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <Space size={10}>
                          <div style={{ color: action.color, fontSize: 16 }}>{action.icon}</div>
                          <Text style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{action.label}</Text>
                        </Space>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Bottom Section */}
      <Row gutter={[20, 20]}>
        {/* Recent Bookings */}
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            className="glass-card"
            style={{ borderRadius: 12 }}
            title={
              <Space>
                <Text style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Recent Bookings</Text>
                <Badge count={bookings.length} style={{ backgroundColor: '#16a34a', boxShadow: '0 0 10px rgba(22, 163, 74, 0.4)' }} />
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('/bookings')} style={{ fontWeight: 600 }}>
                View All <RightOutlined />
              </Button>
            }
          >
            <Table
              dataSource={bookings}
              columns={columns}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Alerts Panel */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            className="glass-card"
            style={{ borderRadius: 12 }}
            title={
              <Space>
                <BellOutlined style={{ color: '#d97706', textShadow: '0 0 10px rgba(217, 119, 6, 0.5)' }} />
                <Text style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Alerts & Notifications</Text>
              </Space>
            }
            extra={
              <Button type="link" size="small" style={{ fontWeight: 500 }}>
                Mark all read
              </Button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: alert.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : alert.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    border: `1px solid ${alert.type === 'warning' ? 'rgba(245, 158, 11, 0.2)' : alert.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                  }}
                >
                  <Space align="start" size={10}>
                    {alert.type === 'warning' && <ExclamationCircleOutlined style={{ color: '#fcd34d', marginTop: 2 }} />}
                    {alert.type === 'error' && <WarningOutlined style={{ color: '#fca5a5', marginTop: 2 }} />}
                    {alert.type === 'success' && <CheckCircleOutlined style={{ color: '#6ee7b7', marginTop: 2 }} />}
                    <div>
                      <Text style={{ fontSize: 13, color: '#1e293b', display: 'block', lineHeight: 1.5 }}>
                        {alert.message}
                      </Text>
                      <Space size={4} style={{ marginTop: 4 }}>
                        <ClockCircleOutlined style={{ fontSize: 11, color: '#64748b' }} />
                        <Text style={{ fontSize: 11, color: '#64748b' }}>{alert.time}</Text>
                      </Space>
                    </div>
                  </Space>
                </div>
              ))}
            </div>

            {/* Compliance Tip */}
            <div style={{
              marginTop: 20,
              padding: '14px 16px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(5, 150, 105, 0.1))',
              border: '1px solid rgba(74, 222, 128, 0.2)',
            }}>
              <Space align="start" size={10}>
                <SafetyOutlined style={{ color: '#4ade80', fontSize: 16, marginTop: 2 }} />
                <div>
                  <Text style={{ fontSize: 13, fontWeight: 600, color: '#4ade80', display: 'block' }}>
                    Compliance Tip
                  </Text>
                  <Text style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
                    Ensure all bookings are routed through BSP within 48 hours to maintain your compliance score.
                  </Text>
                </div>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
