import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Card, Tag, Typography, Row, Col, Statistic, Progress, Table, Button, Alert, Space } from 'antd';
import { ArrowLeftOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const operator = {
  id: 'OP-001',
  name: 'Victoria Falls Travel',
  email: 'info@victoriafallstravel.co.zw',
  phone: '+263 77 123 4567',
  address: '123 Livingstone Way, Victoria Falls, Zimbabwe',
  licenseNumber: 'ZTA-2018-0456',
  status: 'amber' as const,
  complianceRate: 72,
  riskScore: 45,
  totalRevenue: 345000,
  totalLevy: 6900,
  totalBookings: 456,
  agentCount: 12,
  registrationDate: '2018-03-15',
  lastAudit: '2026-02-20',
  recentFlags: ['3 late levy remittances', 'BSP reference mismatch on 2 bookings', 'High-velocity booking from new agent'],
};

const recentBookings = [
  { ref: 'ZV-BK-001', amount: 2450, status: 'confirmed', compliant: true, date: '2026-05-10' },
  { ref: 'ZV-BK-002', amount: 3800, status: 'pending', compliant: false, date: '2026-05-09' },
  { ref: 'ZV-BK-003', amount: 1200, status: 'confirmed', compliant: true, date: '2026-05-08' },
  { ref: 'ZV-BK-004', amount: 5600, status: 'completed', compliant: false, date: '2026-05-07' },
  { ref: 'ZV-BK-005', amount: 890, status: 'cancelled', compliant: true, date: '2026-05-06' },
];

export const OperatorDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const columns = [
    { title: 'Reference', dataIndex: 'ref', key: 'ref' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag>{s}</Tag> },
    { title: 'Compliant', dataIndex: 'compliant', key: 'compliant', render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? 'Yes' : 'No'}</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/operators')}>Back</Button>
        <Title level={4} style={{ margin: 0 }}>{operator.name}</Title>
        <Tag color={operator.status === 'amber' ? 'orange' : 'red'}>{operator.status.toUpperCase()}</Tag>
      </Space>

      {operator.recentFlags.length > 0 && (
        <Alert type="warning" showIcon icon={<WarningOutlined />} message="Recent Compliance Flags"
          description={operator.recentFlags.map((f, i) => <div key={i}>• {f}</div>)}
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Revenue" value={operator.totalRevenue} prefix="$" precision={0} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Levy Remitted" value={operator.totalLevy} prefix="$" valueStyle={{ color: '#16a34a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Total Bookings" value={operator.totalBookings} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Agents" value={operator.agentCount} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="Compliance Rate">
            <Progress percent={operator.complianceRate} strokeColor={operator.complianceRate > 80 ? '#16a34a' : operator.complianceRate > 60 ? '#f59e0b' : '#dc2626'} type="dashboard" />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Risk Score">
            <Progress percent={operator.riskScore} strokeColor={operator.riskScore > 60 ? '#dc2626' : operator.riskScore > 30 ? '#f59e0b' : '#16a34a'} type="dashboard" />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" block icon={<CheckCircleOutlined />}>Issue Compliance Certificate</Button>
              <Button block icon={<WarningOutlined />}>Schedule Audit</Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card title="Operator Details" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="License">{operator.licenseNumber}</Descriptions.Item>
          <Descriptions.Item label="Registered">{operator.registrationDate}</Descriptions.Item>
          <Descriptions.Item label="Last Audit">{operator.lastAudit}</Descriptions.Item>
          <Descriptions.Item label="Email">{operator.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{operator.phone}</Descriptions.Item>
          <Descriptions.Item label="Address">{operator.address}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Recent Bookings">
        <Table dataSource={recentBookings} columns={columns} rowKey="ref" pagination={false} size="small" />
      </Card>
    </div>
  );
};
