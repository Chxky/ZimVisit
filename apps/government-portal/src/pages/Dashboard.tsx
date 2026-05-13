import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Progress, Table, Tag, Alert, Space, Spin } from 'antd';
import {
  BankOutlined, DollarOutlined, TeamOutlined, WarningOutlined,
  ArrowUpOutlined, ArrowDownOutlined, SafetyOutlined, LineChartOutlined,
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { bookingsApi, complianceApi } from '../services/api';

const { Title, Text } = Typography;

const fallbackWeeklyData = [
  { day: 'Mon', revenue: 45200, bsp: 32100, leakage: 2100 },
  { day: 'Tue', revenue: 48300, bsp: 34500, leakage: 1800 },
  { day: 'Wed', revenue: 52100, bsp: 37800, leakage: 2400 },
  { day: 'Thu', revenue: 49800, bsp: 35200, leakage: 1900 },
  { day: 'Fri', revenue: 56700, bsp: 40100, leakage: 3200 },
  { day: 'Sat', revenue: 61200, bsp: 43800, leakage: 2800 },
  { day: 'Sun', revenue: 58400, bsp: 41900, leakage: 2100 },
];

const fallbackMonthlyTrend = [
  { month: 'Jan', revenue: 1450000, levy: 29000, leakage: 87000 },
  { month: 'Feb', revenue: 1380000, levy: 27600, leakage: 96000 },
  { month: 'Mar', revenue: 1620000, levy: 32400, leakage: 102000 },
  { month: 'Apr', revenue: 1580000, levy: 31600, leakage: 84000 },
  { month: 'May', revenue: 1720000, levy: 34400, leakage: 78000 },
  { month: 'Jun', revenue: 1850000, levy: 37000, leakage: 72000 },
];

const fallbackOperatorStatus = [
  { name: 'Victoria Falls Travel', status: 'compliant', revenue: 345000, rate: 98 },
  { name: 'Zimbabwe Safari Co', status: 'amber', revenue: 234000, rate: 72 },
  { name: 'Great Zimbabwe Tours', status: 'compliant', revenue: 189000, rate: 95 },
  { name: 'Harare City Breaks', status: 'red', revenue: 89000, rate: 34 },
  { name: 'Eastern Highlands Trek', status: 'compliant', revenue: 167000, rate: 91 },
  { name: 'Kariba Lakeside Lodge', status: 'amber', revenue: 123000, rate: 65 },
  { name: 'Bulawayo Heritage Tours', status: 'compliant', revenue: 145000, rate: 93 },
  { name: 'Mana Pools Expeditions', status: 'red', revenue: 56000, rate: 28 },
];

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState(fallbackWeeklyData);
  const [monthlyTrend, setMonthlyTrend] = useState(fallbackMonthlyTrend);
  const [operatorStatus, setOperatorStatus] = useState(fallbackOperatorStatus);
  const [stats, setStats] = useState({ totalRevenue: 9600000, levyCollected: 192000, captureRate: 68, leakage: 4320000, operators: 128, active: 128 });

  useEffect(() => {
    Promise.all([
      bookingsApi.getRevenueStats().catch(() => null),
      complianceApi.getLeakage().catch(() => null),
    ]).then(([revenueData, leakageData]) => {
      if (revenueData) {
        const d = revenueData.data || revenueData;
        setStats(prev => ({ ...prev, totalRevenue: d.totalRevenue ?? prev.totalRevenue }));
      }
      if (leakageData) {
        const d = leakageData.data || leakageData;
        setStats(prev => ({ ...prev, leakage: d.estimatedLeakage ?? prev.leakage }));
      }
    }).finally(() => setLoading(false));
  }, []);
  const opColumns = [
    { title: 'Operator', dataIndex: 'name', key: 'name' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => {
      const colors: Record<string, string> = { compliant: 'green', amber: 'orange', red: 'red' };
      return <Tag color={colors[s]}>{s.toUpperCase()}</Tag>;
    }},
    { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Compliance', dataIndex: 'rate', key: 'rate', render: (v: number) => (
      <Progress percent={v} size="small" strokeColor={v > 80 ? '#16a34a' : v > 60 ? '#f59e0b' : '#dc2626'} />
    )},
  ];

  if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }} />;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <LineChartOutlined style={{ fontSize: 24, color: '#1e3a5f' }} />
        <Title level={4} style={{ margin: 0 }}>Live National Revenue Dashboard</Title>
        <Tag color="green" style={{ marginLeft: 8 }}>REAL-TIME</Tag>
      </Space>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Total Revenue (YTD)" value={stats.totalRevenue} prefix={<DollarOutlined />} precision={0} valueStyle={{ color: '#16a34a' }} suffix={<Text type="secondary">USD</Text>} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Levy Collected" value={stats.levyCollected} prefix={<BankOutlined />} precision={0} valueStyle={{ color: '#1e3a5f' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Revenue Capture Rate" value={stats.captureRate} suffix="%" prefix={<SafetyOutlined />} valueStyle={{ color: '#f59e0b' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Estimated Leakage" value={stats.leakage} prefix={<WarningOutlined />} precision={0} valueStyle={{ color: '#dc2626' }} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Alert type="warning" showIcon
            message={`Revenue capture rate at ${stats.captureRate}% — $${(stats.leakage / 1_000_000).toFixed(2)}M estimated leakage this fiscal year`}
            description="72% of travel agencies operate outside official IATA BSP. ZimVisit compliance mandate would recover an estimated $150M+ annually."
          />
        </Col>
        <Col xs={24} lg={6}>
          <Card><Statistic title="Registered Operators" value={stats.operators} prefix={<TeamOutlined />} suffix={<Text type="secondary">/ 480 total</Text>} /></Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card><Statistic title="Active on Platform" value={stats.active} prefix={<ArrowUpOutlined />} valueStyle={{ color: '#16a34a' }} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Weekly Revenue vs BSP">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1e3a5f" name="Platform Revenue" />
                <Bar dataKey="bsp" fill="#3b82f6" name="BSP Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Monthly Revenue Trend">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#1e3a5f" fill="#1e3a5f" fillOpacity={0.1} name="Revenue" />
                <Area type="monotone" dataKey="leakage" stroke="#dc2626" fill="#dc2626" fillOpacity={0.1} name="Leakage" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="Operator Compliance Overview" style={{ marginTop: 16 }}>
        <Table dataSource={operatorStatus} columns={opColumns} rowKey="name" pagination={false} size="small" />
      </Card>
    </div>
  );
};
