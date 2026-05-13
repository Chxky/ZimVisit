import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tag, Space, Typography, Card, Tabs, Switch, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { inventoryApi } from '../services/api';
import { Tour, Hotel } from '../types';

const { Title } = Typography;

export const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([inventoryApi.listTours(), inventoryApi.listHotels()])
      .then(([toursRes, hotelsRes]: any[]) => {
        setTours(toursRes || []);
        setHotels(hotelsRes || []);
      }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const toggleTourActive = async (id: string, current: boolean) => {
    try {
      await inventoryApi.updateTour(id, { isActive: !current });
      setTours(tours.map(t => t.id === id ? { ...t, isActive: !current } : t));
      message.success('Tour updated');
    } catch { message.error('Update failed'); }
  };

  const tourColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Duration', dataIndex: 'duration', key: 'duration' },
    { title: 'Capacity', key: 'capacity', render: (_: any, r: Tour) => `${r.bookedCount}/${r.maxCapacity || '∞'}` },
    { title: 'Rating', dataIndex: 'rating', key: 'rating', render: (v: number) => '★'.repeat(Math.round(v)) },
    { title: 'Active', dataIndex: 'isActive', key: 'active', render: (v: boolean, r: Tour) =>
      <Switch checked={v} onChange={() => toggleTourActive(r.id, v)} size="small" />
    },
    { title: '', key: 'actions', render: (_: any, r: Tour) =>
      <Button type="link" icon={<EditOutlined />} onClick={() => navigate(`/inventory/${r.id}/edit`)} />
    },
  ];

  const hotelColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'Rating', dataIndex: 'rating', key: 'rating', render: (v: number) => '★'.repeat(Math.round(v)) },
    { title: 'Active', dataIndex: 'isActive', key: 'active', render: (v: boolean) =>
      <Tag color={v ? 'green' : 'red'}>{v ? 'Active' : 'Inactive'}</Tag>
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={4} style={{ margin: 0 }}>Inventory Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/inventory/new')}>
          Add Listing
        </Button>
      </Space>
      <Card>
        <Tabs defaultActiveKey="tours" items={[
          { key: 'tours', label: 'Tours & Activities', children: <Table dataSource={tours} columns={tourColumns} rowKey="id" loading={loading} pagination={false} size="small" /> },
          { key: 'hotels', label: 'Hotels & Lodging', children: <Table dataSource={hotels} columns={hotelColumns} rowKey="id" loading={loading} pagination={false} size="small" /> },
        ]} />
      </Card>
    </div>
  );
};
