import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Button, Tag, Space, Typography, Card, Tabs, Switch, Input,
  Row, Col, Statistic, Badge, Dropdown, Empty,
} from 'antd';
import {
  PlusOutlined, EditOutlined, SearchOutlined, MoreOutlined,
  ShopOutlined, EnvironmentOutlined, ClockCircleOutlined,
  EyeOutlined, DeleteOutlined,
  AppstoreOutlined, UnorderedListOutlined, StarFilled, HomeOutlined,
} from '@ant-design/icons';
import { inventoryApi } from '../services/api';
import { Tour, Hotel } from '../types';
import { message } from 'antd';

const { Title, Text } = Typography;

export const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

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
      message.success('Tour status updated');
    } catch { message.error('Failed to update tour'); }
  };

  const filteredTours = tours.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.location?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredHotels = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city?.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const activeTours = tours.filter(t => t.isActive).length;
  const avgTourRating = tours.length > 0
    ? (tours.reduce((sum, t) => sum + (t.rating || 0), 0) / tours.length).toFixed(1)
    : '0';

  const tourColumns = [
    {
      title: 'Tour',
      key: 'tour',
      render: (_: any, r: Tour) => (
        <Space size={12}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: r.images?.[0] ? `url(${r.images[0]}) center/cover` : 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {!r.images?.[0] && <ShopOutlined style={{ color: '#166534', fontSize: 18 }} />}
          </div>
          <div>
            <Text strong style={{ display: 'block', fontSize: 13 }}>{r.name}</Text>
            <Space size={4}>
              <EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 11 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>{r.location || 'No location'}</Text>
            </Space>
          </div>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: Tour, b: Tour) => (a.price || 0) - (b.price || 0),
      render: (v: number) => (
        <Text style={{ fontWeight: 700, color: '#166534' }}>${(v || 0).toLocaleString()}</Text>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (v: string) => (
        <Space size={4}>
          <ClockCircleOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
          <Text style={{ fontSize: 13 }}>{v || '--'}</Text>
        </Space>
      ),
    },
    {
      title: 'Capacity',
      key: 'capacity',
      render: (_: any, r: Tour) => {
        const percent = r.maxCapacity ? Math.round((r.bookedCount / r.maxCapacity) * 100) : 0;
        return (
          <div>
            <Text style={{ fontSize: 13 }}>
              <Text strong>{r.bookedCount}</Text>
              <Text type="secondary"> / {r.maxCapacity || '∞'}</Text>
            </Text>
            {r.maxCapacity && (
              <div style={{ marginTop: 4 }}>
                <div style={{
                  width: '100%',
                  height: 4,
                  background: '#f1f5f9',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${percent}%`,
                    height: '100%',
                    background: percent > 80 ? '#dc2626' : percent > 50 ? '#f59e0b' : '#059669',
                    borderRadius: 2,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (_: any, r: Tour) => (
        <Space size={6}>
          <StarFilled style={{ color: '#f59e0b', fontSize: 13 }} />
          <Text style={{ fontWeight: 600 }}>{(r.rating || 0).toFixed(1)}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>({r.reviewCount || 0})</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'active',
      render: (v: boolean, r: Tour) => (
        <Switch
          checked={v}
          onChange={() => toggleTourActive(r.id, v)}
          size="small"
          checkedChildren="Live"
          unCheckedChildren="Off"
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 48,
      render: (_: any, r: Tour) => (
        <Dropdown
          menu={{
            items: [
              { key: 'edit', icon: <EditOutlined />, label: 'Edit Tour', onClick: () => navigate(`/inventory/${r.id}/edit`) },
              { key: 'view', icon: <EyeOutlined />, label: 'View Details' },
              { type: 'divider' },
              { key: 'delete', icon: <DeleteOutlined />, label: 'Delete', danger: true },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  const hotelColumns = [
    {
      title: 'Hotel',
      key: 'hotel',
      render: (_: any, r: Hotel) => (
        <Space size={12}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: r.images?.[0] ? `url(${r.images[0]}) center/cover` : 'linear-gradient(135deg, #f0f9ff, #dbeafe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {!r.images?.[0] && <HomeOutlined style={{ color: '#0369a1', fontSize: 18 }} />}
          </div>
          <div>
            <Text strong style={{ display: 'block', fontSize: 13 }}>{r.name}</Text>
            <Space size={4}>
              <EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 11 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>{r.city || r.address}</Text>
            </Space>
          </div>
        </Space>
      ),
    },
    {
      title: 'Amenities',
      dataIndex: 'amenities',
      key: 'amenities',
      render: (v: string[]) => (
        <Space wrap size={4}>
          {v?.slice(0, 3).map((a, i) => <Tag key={i} style={{ fontSize: 11 }}>{a}</Tag>)}
          {(v?.length || 0) > 3 && <Tag>+{v!.length - 3}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (_: any, r: Hotel) => (
        <Space size={6}>
          <StarFilled style={{ color: '#f59e0b', fontSize: 13 }} />
          <Text style={{ fontWeight: 600 }}>{(r.rating || 0).toFixed(1)}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'active',
      render: (v: boolean) => (
        <Badge status={v ? 'success' : 'default'} text={v ? 'Active' : 'Inactive'} />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 48,
      render: () => (
        <Button type="text" icon={<MoreOutlined />} size="small" />
      ),
    },
  ];

  const TourGrid = ({ data }: { data: Tour[] }) => (
    <Row gutter={[16, 16]}>
      {data.map((tour) => (
        <Col xs={24} sm={12} lg={8} xl={6} key={tour.id}>
          <Card
            hoverable
            bordered={false}
            style={{ borderRadius: 12, overflow: 'hidden' }}
            cover={
              <div style={{
                height: 140,
                background: tour.images?.[0]
                  ? `url(${tour.images[0]}) center/cover`
                  : 'linear-gradient(135deg, #166534 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                {!tour.images?.[0] && <ShopOutlined style={{ fontSize: 36, color: 'rgba(255,255,255,0.4)' }} />}
                <div style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                }}>
                  <Badge status={tour.isActive ? 'success' : 'default'} />
                </div>
              </div>
            }
            bodyStyle={{ padding: 14 }}
            onClick={() => navigate(`/inventory/${tour.id}/edit`)}
          >
            <div>
              <Text strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>{tour.name}</Text>
              <Space size={4} style={{ marginBottom: 8 }}>
                <EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 11 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>{tour.location}</Text>
              </Space>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: 700, color: '#166534', fontSize: 16 }}>
                  ${tour.price}
                </Text>
                <Space size={4}>
                  <StarFilled style={{ color: '#f59e0b', fontSize: 12 }} />
                  <Text style={{ fontSize: 12, fontWeight: 600 }}>{(tour.rating || 0).toFixed(1)}</Text>
                </Space>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>Inventory Management</Title>
            <Text type="secondary">Manage your tours, activities, and hotel listings</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/inventory/new')}
            style={{ height: 40, borderRadius: 8 }}
          >
            Add Listing
          </Button>
        </div>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} bodyStyle={{ padding: '14px 16px' }} style={{ borderRadius: 10 }}>
            <Statistic
              title={<Text style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tours</Text>}
              value={tours.length}
              prefix={<ShopOutlined />}
              valueStyle={{ fontSize: 20, fontWeight: 700, color: '#166534' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} bodyStyle={{ padding: '14px 16px' }} style={{ borderRadius: 10 }}>
            <Statistic
              title={<Text style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hotels</Text>}
              value={hotels.length}
              prefix={<HomeOutlined />}
              valueStyle={{ fontSize: 20, fontWeight: 700, color: '#0369a1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} bodyStyle={{ padding: '14px 16px' }} style={{ borderRadius: 10 }}>
            <Statistic
              title={<Text style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Tours</Text>}
              value={activeTours}
              prefix={<Badge status="success" />}
              valueStyle={{ fontSize: 20, fontWeight: 700, color: '#059669' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} bodyStyle={{ padding: '14px 16px' }} style={{ borderRadius: 10 }}>
            <Statistic
              title={<Text style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Rating</Text>}
              value={avgTourRating}
              prefix={<StarFilled style={{ color: '#f59e0b' }} />}
              valueStyle={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card bordered={false} style={{ borderRadius: 12 }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Search by name, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Space>
            <Button.Group>
              <Button
                type={viewMode === 'table' ? 'primary' : 'default'}
                icon={<UnorderedListOutlined />}
                onClick={() => setViewMode('table')}
              />
              <Button
                type={viewMode === 'grid' ? 'primary' : 'default'}
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode('grid')}
              />
            </Button.Group>
          </Space>
        </div>

        <Tabs
          defaultActiveKey="tours"
          items={[
            {
              key: 'tours',
              label: (
                <Space>
                  <ShopOutlined />
                  Tours & Activities
                  <Badge count={tours.length} style={{ backgroundColor: '#166534' }} />
                </Space>
              ),
              children: viewMode === 'table' ? (
                <Table
                  dataSource={filteredTours}
                  columns={tourColumns}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showTotal: (total) => <Text type="secondary">{total} tours</Text>,
                  }}
                  size="middle"
                />
              ) : (
                filteredTours.length > 0 ? (
                  <TourGrid data={filteredTours} />
                ) : (
                  <Empty description="No tours found" />
                )
              ),
            },
            {
              key: 'hotels',
              label: (
                <Space>
                  <HomeOutlined />
                  Hotels & Lodging
                  <Badge count={hotels.length} style={{ backgroundColor: '#0369a1' }} />
                </Space>
              ),
              children: (
                <Table
                  dataSource={filteredHotels}
                  columns={hotelColumns}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showTotal: (total) => <Text type="secondary">{total} hotels</Text>,
                  }}
                  size="middle"
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};
