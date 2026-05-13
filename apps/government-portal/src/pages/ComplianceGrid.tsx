import React from 'react';
import { Table, Card, Tag, Typography, Progress, Badge, Input, Space, Row, Col, Statistic } from 'antd';
import { SearchOutlined, SafetyOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const operatorsGrid = [
  { id: 'OP-001', name: 'Victoria Falls Travel', status: 'compliant', rate: 98, score: 18, bookings: 456, revenue: 345000, levy: 6900, lastAudit: '2026-04-15', agents: 12, bspConnected: true },
  { id: 'OP-002', name: 'Zimbabwe Safari Co', status: 'amber', rate: 72, score: 45, bookings: 312, revenue: 234000, levy: 4680, lastAudit: '2026-01-20', agents: 8, bspConnected: true },
  { id: 'OP-003', name: 'Great Zimbabwe Tours', status: 'compliant', rate: 95, score: 18, bookings: 267, revenue: 189000, levy: 3780, lastAudit: '2026-03-10', agents: 5, bspConnected: true },
  { id: 'OP-004', name: 'Harare City Breaks', status: 'red', rate: 34, score: 76, bookings: 145, revenue: 89000, levy: 1780, lastAudit: '2025-11-05', agents: 15, bspConnected: false },
  { id: 'OP-005', name: 'Eastern Highlands Trek', status: 'compliant', rate: 91, score: 22, bookings: 198, revenue: 167000, levy: 3340, lastAudit: '2026-02-28', agents: 4, bspConnected: true },
  { id: 'OP-006', name: 'Kariba Lakeside Lodge', status: 'amber', rate: 65, score: 45, bookings: 178, revenue: 123000, levy: 2460, lastAudit: '2025-12-12', agents: 6, bspConnected: true },
  { id: 'OP-007', name: 'Bulawayo Heritage Tours', status: 'compliant', rate: 93, score: 15, bookings: 189, revenue: 145000, levy: 2900, lastAudit: '2026-04-01', agents: 3, bspConnected: true },
  { id: 'OP-008', name: 'Mana Pools Expeditions', status: 'red', rate: 28, score: 89, bookings: 89, revenue: 56000, levy: 1120, lastAudit: '2025-08-15', agents: 2, bspConnected: false },
];

export const ComplianceGrid: React.FC = () => {
  const [search, setSearch] = React.useState('');

  const filtered = operatorsGrid.filter(o => o.name.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { title: 'Operator', dataIndex: 'name', key: 'name', render: (v: string, r: any) => (
      <Space><Badge status={r.status === 'compliant' ? 'success' : r.status === 'amber' ? 'warning' : 'error'} />{v}</Space>
    )},
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => {
      const colors: Record<string, string> = { compliant: 'green', amber: 'orange', red: 'red' };
      return <Tag color={colors[s]} style={{ width: 90, textAlign: 'center' }}>{s.toUpperCase()}</Tag>;
    }},
    { title: 'Compliance Rate', dataIndex: 'rate', key: 'rate', render: (v: number) => (
      <Progress percent={v} size="small" strokeColor={v > 80 ? '#16a34a' : v > 60 ? '#f59e0b' : '#dc2626'} />
    )},
    { title: 'Risk Score', dataIndex: 'score', key: 'score', render: (v: number) => (
      <Tag color={v > 60 ? 'red' : v > 30 ? 'orange' : 'green'}>{v}/100</Tag>
    )},
    { title: 'Bookings', dataIndex: 'bookings', key: 'bookings' },
    { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Levy', dataIndex: 'levy', key: 'levy', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'BSP', dataIndex: 'bspConnected', key: 'bsp', render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? 'Connected' : 'Disconnected'}</Tag> },
    { title: 'Last Audit', dataIndex: 'lastAudit', key: 'audit' },
    { title: 'Agents', dataIndex: 'agents', key: 'agents' },
  ];

  return (
    <div>
      <Title level={4}><SafetyOutlined /> Operator Compliance Grid</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderLeft: '4px solid #16a34a' }}>
            <Statistic title="Compliant" value={operatorsGrid.filter(o => o.status === 'compliant').length}
              prefix={<CheckCircleOutlined />} valueStyle={{ color: '#16a34a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderLeft: '4px solid #f59e0b' }}>
            <Statistic title="Amber (Approaching Issues)" value={operatorsGrid.filter(o => o.status === 'amber').length}
              prefix={<WarningOutlined />} valueStyle={{ color: '#f59e0b' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderLeft: '4px solid #dc2626' }}>
            <Statistic title="Red (Non-Compliant)" value={operatorsGrid.filter(o => o.status === 'red').length}
              prefix={<CloseCircleOutlined />} valueStyle={{ color: '#dc2626' }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input prefix={<SearchOutlined />} placeholder="Search by name or ID..." value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ width: 300 }}
          />
          <Tag color="green"><CheckCircleOutlined /> Green = Compliant</Tag>
          <Tag color="orange"><WarningOutlined /> Amber = Approaching Issues</Tag>
          <Tag color="red"><CloseCircleOutlined /> Red = Non-Compliant</Tag>
        </Space>
        <Table dataSource={filtered} columns={columns} rowKey="id"
          pagination={{ pageSize: 20 }}
          rowClassName={(record: any) => record.status === 'red' ? 'ant-table-row-danger' : ''}
        />
      </Card>
    </div>
  );
};
