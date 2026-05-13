import React from 'react';
import { Table, Card, Tag, Typography, Space, Avatar, Switch } from 'antd';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const staffData = [
  { key: '1', name: 'Tatenda Mukanya', email: 'tatenda@travelzim.co.zw', role: 'Admin', active: true, lastActive: '2026-05-11T14:30', bookings: 145, trustScore: 94 },
  { key: '2', name: 'Chiedza Ndlovu', email: 'chiedza@travelzim.co.zw', role: 'Agent', active: true, lastActive: '2026-05-11T09:15', bookings: 89, trustScore: 72 },
  { key: '3', name: 'Tafara Moyo', email: 'tafara@travelzim.co.zw', role: 'Agent', active: false, lastActive: '2026-05-10T22:00', bookings: 234, trustScore: 45 },
  { key: '4', name: 'Rumbi Sibanda', email: 'rumbi@travelzim.co.zw', role: 'Agent', active: true, lastActive: '2026-05-11T11:00', bookings: 67, trustScore: 88 },
  { key: '5', name: 'Tanaka Kaseke', email: 'tanaka@travelzim.co.zw', role: 'Viewer', active: true, lastActive: '2026-05-09T16:45', bookings: 12, trustScore: 61 },
];

export const Staff: React.FC = () => {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (v: string) => (
      <Space><Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#166534' }} />{v}</Space>
    )},
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role', render: (v: string) => {
      const colors: Record<string, string> = { Admin: 'blue', Agent: 'green', Viewer: 'default' };
      return <Tag color={colors[v]}>{v}</Tag>;
    }},
    { title: 'Active', dataIndex: 'active', key: 'active', render: (v: boolean) => <Switch checked={v} size="small" /> },
    { title: 'Bookings', dataIndex: 'bookings', key: 'bookings' },
    { title: 'Trust Score', dataIndex: 'trustScore', key: 'trust', render: (v: number) => (
      <Tag color={v > 80 ? 'green' : v > 60 ? 'orange' : 'red'}>{v}%</Tag>
    )},
  ];

  return (
    <div>
      <Title level={4}><TeamOutlined /> Staff Management</Title>
      <Card>
        <Table dataSource={staffData} columns={columns} pagination={false} />
      </Card>
    </div>
  );
};
