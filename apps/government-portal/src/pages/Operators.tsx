import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Tag, Typography, Input, Space, Progress, Badge } from 'antd';
import { SearchOutlined, TeamOutlined, FilterOutlined } from '@ant-design/icons';

const { Title } = Typography;

const allOperators = Array.from({ length: 48 }, (_, i) => ({
  id: `OP-${String(i + 1).padStart(3, '0')}`,
  name: ['Victoria Falls Travel', 'Zimbabwe Safari Co', 'Great Zimbabwe Tours', 'Harare City Breaks',
    'Eastern Highlands Trek', 'Kariba Lakeside Lodge', 'Bulawayo Heritage Tours', 'Mana Pools Expeditions',
    'Hwange National Safaris', 'Gonarezhou Adventures', 'Lake Kariba Houseboats', 'Matobo Hills Trekking',
    'Zambezi River Rafting', 'Chimanimani Hiking', 'Bumi Hills Lodge', 'Antelope Park Safari'][i % 16],
  email: `info@operator${i + 1}.co.zw`,
  status: ['compliant', 'amber', 'red'][i % 3] as 'compliant' | 'amber' | 'red',
  complianceRate: [98, 72, 34, 95, 91, 65, 93, 28, 87, 55, 78, 96, 44, 82, 71, 61][i % 16],
  totalRevenue: Math.floor(Math.random() * 500000) + 50000,
  totalBookings: Math.floor(Math.random() * 500) + 50,
  riskScore: Math.floor(Math.random() * 100),
}));

export const Operators: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = allOperators.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', render: (v: string, r: any) => <a onClick={() => navigate(`/operators/${r.id}`)}>{v}</a> },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => {
      const colors: Record<string, string> = { compliant: 'green', amber: 'orange', red: 'red' };
      return <Tag color={colors[s]}>{s.toUpperCase()}</Tag>;
    }},
    { title: 'Compliance', dataIndex: 'complianceRate', key: 'compliance', render: (v: number) => (
      <Progress percent={v} size="small" strokeColor={v > 80 ? '#16a34a' : v > 60 ? '#f59e0b' : '#dc2626'} />
    )},
    { title: 'Revenue', dataIndex: 'totalRevenue', key: 'revenue', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Bookings', dataIndex: 'totalBookings', key: 'bookings' },
    { title: 'Risk Score', dataIndex: 'riskScore', key: 'risk', render: (v: number) => (
      <Tag color={v > 60 ? 'red' : v > 30 ? 'orange' : 'green'}>{v}/100</Tag>
    )},
  ];

  const compliantCount = filtered.filter(o => o.status === 'compliant').length;
  const amberCount = filtered.filter(o => o.status === 'amber').length;
  const redCount = filtered.filter(o => o.status === 'red').length;

  return (
    <div>
      <Title level={4}><TeamOutlined /> Operator Registry</Title>
      <Card style={{ marginBottom: 16 }}>
        <Space size="large">
          <span><Badge color="green" /> Compliant: <strong>{compliantCount}</strong></span>
          <span><Badge color="orange" /> Amber: <strong>{amberCount}</strong></span>
          <span><Badge color="red" /> Non-Compliant: <strong>{redCount}</strong></span>
        </Space>
      </Card>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input prefix={<SearchOutlined />} placeholder="Search by name or ID..." value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ width: 300 }}
          />
        </Space>
        <Table dataSource={filtered} columns={columns} rowKey="id"
          pagination={{ pageSize: 20, showTotal: (t) => `${t} operators` }}
        />
      </Card>
    </div>
  );
};
