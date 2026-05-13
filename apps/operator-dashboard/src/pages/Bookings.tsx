import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Input, Space, Typography, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { bookingsApi } from '../services/api';
import { Booking } from '../types';

const { Title } = Typography;

export const Bookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    bookingsApi.list({ limit: 100 }).then((res: any) => {
      setBookings(res.items || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: 'Reference', dataIndex: 'bookingReference', key: 'ref', render: (v: string, r: Booking) =>
      <a onClick={() => navigate(`/bookings/${r.id}`)}>{v}</a>
    },
    { title: 'Items', key: 'items', render: (_: any, r: Booking) => r.items?.map(i => i.itemName).join(', ') },
    { title: 'Amount', dataIndex: 'totalAmount', key: 'amount', render: (v: number) => `$${Number(v).toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => {
      const colors: Record<string, string> = { confirmed: 'green', pending: 'orange', pending_payment: 'gold', cancelled: 'red', completed: 'blue', in_progress: 'purple' };
      return <Tag color={colors[s] || 'default'}>{s.replace('_', ' ').toUpperCase()}</Tag>;
    }},
    { title: 'Compliant', dataIndex: 'isCompliant', key: 'compliant', render: (v: boolean) =>
      <Tag color={v ? 'green' : 'red'}>{v ? 'Yes' : 'No'}</Tag>
    },
    { title: 'Date', dataIndex: 'createdAt', key: 'date', render: (d: string) => new Date(d).toLocaleDateString() },
  ];

  const filtered = bookings.filter(b =>
    b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
    b.items?.some(i => i.itemName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <Title level={4}>Booking Management</Title>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input prefix={<SearchOutlined />} placeholder="Search by reference or item..." value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ width: 300 }}
          />
        </Space>
        <Table dataSource={filtered} columns={columns} rowKey="id" loading={loading}
          pagination={{ pageSize: 20, showTotal: (total) => `${total} bookings` }}
        />
      </Card>
    </div>
  );
};
