import React from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, Space, DatePicker, Tabs } from 'antd';
import { DollarOutlined, RiseOutlined, FallOutlined, BankOutlined, PercentageOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area } from 'recharts';

const { Title } = Typography;

const monthlyData = [
  { month: 'Jan', platform: 1450000, bsp: 980000, levy: 29000, leakage: 87000 },
  { month: 'Feb', platform: 1380000, bsp: 920000, levy: 27600, leakage: 96000 },
  { month: 'Mar', platform: 1620000, bsp: 1100000, levy: 32400, leakage: 102000 },
  { month: 'Apr', platform: 1580000, bsp: 1050000, levy: 31600, leakage: 84000 },
  { month: 'May', platform: 1720000, bsp: 1180000, levy: 34400, leakage: 78000 },
  { month: 'Jun', platform: 1850000, bsp: 1250000, levy: 37000, leakage: 72000 },
];

const comparisonData = [
  { year: '2022', official: 8200000, estimated: 14500000, capture: 57 },
  { year: '2023', official: 9100000, estimated: 16200000, capture: 56 },
  { year: '2024', official: 10500000, estimated: 17800000, capture: 59 },
  { year: '2025', official: 11200000, estimated: 19000000, capture: 61 },
  { year: '2026', official: 9600000, estimated: 16000000, capture: 68 },
];

const taxBreakdown = [
  { category: 'Tourism Levy (2%)', collected: 192000, expected: 320000, gap: 128000 },
  { category: 'VAT (15%)', collected: 1440000, expected: 2400000, gap: 960000 },
  { category: 'BSP Fees (3%)', collected: 288000, expected: 480000, gap: 192000 },
  { category: 'Corporate Tax', collected: 2150000, expected: 3800000, gap: 1650000 },
];

export const Revenue: React.FC = () => {
  const taxColumns = [
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Collected', dataIndex: 'collected', key: 'collected', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Expected', dataIndex: 'expected', key: 'expected', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Gap', dataIndex: 'gap', key: 'gap', render: (v: number) => <Tag color="red">-${v.toLocaleString()}</Tag> },
    { title: 'Capture', key: 'rate', render: (_: any, r: any) => <Tag color={r.gap > 500000 ? 'red' : 'orange'}>{Math.round((r.collected / r.expected) * 100)}%</Tag> },
  ];

  return (
    <div>
      <Title level={4}><DollarOutlined /> Revenue Analytics</Title>
      <Space style={{ marginBottom: 16 }}>
        <DatePicker.RangePicker />
      </Space>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Platform Revenue (YTD)" value={9600000} prefix="$" precision={0} valueStyle={{ color: '#16a34a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="BSP Revenue (YTD)" value={6480000} prefix="$" precision={0} valueStyle={{ color: '#1e3a5f' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Levy Collected" value={192000} prefix="$" precision={0} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Revenue Capture Rate" value={68} suffix="%" valueStyle={{ color: '#f59e0b' }} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Revenue: Platform vs BSP">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="platform" fill="#1e3a5f" name="Platform Revenue" />
                <Bar dataKey="bsp" fill="#3b82f6" name="Official IATA BSP" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Revenue Capture Rate Trend">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="official" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Official BSP" />
                <Area type="monotone" dataKey="estimated" stroke="#dc2626" fill="#dc2626" fillOpacity={0.1} name="Estimated Total" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Revenue Leakage by Month">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leakage" stroke="#dc2626" strokeWidth={2} dot={{ fill: '#dc2626' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Tax & Levy Collection Gap">
            <Table dataSource={taxBreakdown} columns={taxColumns} rowKey="category" pagination={false} size="small" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
