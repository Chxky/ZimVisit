import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Tag, Input, Space, Typography, Card, Button, Tabs, Select,
  Dropdown, Badge, Row, Col, Statistic, Checkbox,
} from 'antd';
import {
  SearchOutlined, MoreOutlined,
  DollarOutlined, CheckCircleOutlined, ClockCircleOutlined,
  EyeOutlined, DownloadOutlined, ReloadOutlined,
} from '@ant-design/icons';
import { bookingsApi } from '../services/api';
import { Booking } from '../types';

const { Title, Text } = Typography;

export const Bookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [complianceFilter, setComplianceFilter] = useState<string>('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    bookingsApi.list({ limit: 100 })
      .then((res: any) => {
        setBookings(res.items || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const filtered = bookings.filter(b => {
    const matchesSearch =
      b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
      b.items?.some(i => i.itemName.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesCompliance =
      complianceFilter === 'all' ||
      (complianceFilter === 'compliant' && b.isCompliant) ||
      (complianceFilter === 'flagged' && !b.isCompliant);
    return matchesSearch && matchesStatus && matchesCompliance;
  });

  // Stats
  const totalRevenue = filtered.reduce((sum, b) => sum + Number(b.totalAmount), 0);
  const confirmedCount = filtered.filter(b => b.status === 'confirmed' || b.status === 'completed').length;
  const pendingCount = filtered.filter(b => b.status === 'pending' || b.status === 'pending_payment').length;
  const compliantCount = filtered.filter(b => b.isCompliant).length;

  const statusTabs = [
    { key: 'all', label: `All (${bookings.length})` },
    { key: 'confirmed', label: `Confirmed (${bookings.filter(b => b.status === 'confirmed').length})` },
    { key: 'pending', label: `Pending (${bookings.filter(b => b.status === 'pending').length})` },
    { key: 'completed', label: `Completed (${bookings.filter(b => b.status === 'completed').length})` },
    { key: 'cancelled', label: `Cancelled (${bookings.filter(b => b.status === 'cancelled').length})` },
  ];

  const columns = [
    {
      title: '',
      key: 'checkbox',
      width: 40,
      render: (_: any, r: Booking) => (
        <Checkbox
          checked={selectedRows.includes(r.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows([...selectedRows, r.id]);
            } else {
              setSelectedRows(selectedRows.filter(id => id !== r.id));
            }
          }}
        />
      ),
    },
    {
      title: 'Reference',
      dataIndex: 'bookingReference',
      key: 'ref',
      render: (v: string, r: Booking) => (
        <a
          onClick={() => navigate(`/bookings/${r.id}`)}
          style={{ fontWeight: 600, color: '#166534', fontSize: 13 }}
        >
          {v}
        </a>
      ),
    },
    {
      title: 'Items',
      key: 'items',
      render: (_: any, r: Booking) => (
        <div>
          {r.items?.slice(0, 2).map((item, i) => (
            <Tag key={i} style={{ marginBottom: 2 }}>{item.itemName}</Tag>
          ))}
          {(r.items?.length || 0) > 2 && (
            <Tag>+{r.items!.length - 2} more</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'amount',
      sorter: (a: Booking, b: Booking) => Number(a.totalAmount) - Number(b.totalAmount),
      render: (v: number) => (
        <Text style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          ${Number(v).toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const colors: Record<string, string> = {
          confirmed: 'green', pending: 'orange', pending_payment: 'gold',
          cancelled: 'red', completed: 'blue', in_progress: 'purple',
        };
        return <Tag color={colors[s] || 'default'}>{s.replace('_', ' ').toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Compliance',
      dataIndex: 'isCompliant',
      key: 'compliant',
      render: (v: boolean) => (
        <Badge
          status={v ? 'success' : 'error'}
          text={<Text style={{ fontSize: 12, fontWeight: 500 }}>{v ? 'Compliant' : 'Flagged'}</Text>}
        />
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      sorter: (a: Booking, b: Booking) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (d: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 48,
      render: (_: any, r: Booking) => (
        <Dropdown
          menu={{
            items: [
              { key: 'view', icon: <EyeOutlined />, label: 'View Details', onClick: () => navigate(`/bookings/${r.id}`) },
              { type: 'divider' },
              { key: 'export', icon: <DownloadOutlined />, label: 'Export' },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  const handleExport = () => {
    const csvContent = [
      ['Reference', 'Amount', 'Status', 'Compliant', 'Date'].join(','),
      ...filtered.map(b => [
        b.bookingReference,
        b.totalAmount,
        b.status,
        b.isCompliant ? 'Yes' : 'No',
        new Date(b.createdAt).toLocaleDateString(),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>Booking Management</Title>
            <Text type="secondary">Track and manage all your tourism bookings</Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchBookings}>Refresh</Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>Export CSV</Button>
          </Space>
        </div>
      </div>

      {/* Summary Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} bodyStyle={{ padding: '14px 16px' }} style={{ borderRadius: 10 }}>
            <Statistic
              title={<Text style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revenue</Text>}
              value={totalRevenue}
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ fontSize: 20, fontWeight: 700, color: '#166534' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} bodyStyle={{ padding: '14px 16px' }} style={{ borderRadius: 10 }}>
            <Statistic
              title={<Text style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirmed</Text>}
              value={confirmedCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ fontSize: 20, fontWeight: 700, color: '#059669' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} bodyStyle={{ padding: '14px 16px' }} style={{ borderRadius: 10 }}>
            <Statistic
              title={<Text style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending</Text>}
              value={pendingCount}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} bodyStyle={{ padding: '14px 16px' }} style={{ borderRadius: 10 }}>
            <Statistic
              title={<Text style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Compliant</Text>}
              value={bookings.length > 0 ? Math.round((compliantCount / bookings.length) * 100) : 0}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ fontSize: 20, fontWeight: 700, color: '#059669' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table */}
      <Card bordered={false} style={{ borderRadius: 12 }}>
        {/* Status Tabs */}
        <Tabs
          activeKey={statusFilter}
          onChange={setStatusFilter}
          items={statusTabs}
          style={{ marginBottom: 16 }}
        />

        {/* Filters Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <Space wrap>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Search by reference or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 280 }}
              allowClear
            />
            <Select
              value={complianceFilter}
              onChange={setComplianceFilter}
              style={{ width: 160 }}
              options={[
                { value: 'all', label: 'All Compliance' },
                { value: 'compliant', label: 'Compliant Only' },
                { value: 'flagged', label: 'Flagged Only' },
              ]}
            />
          </Space>

          {selectedRows.length > 0 && (
            <Space>
              <Badge count={selectedRows.length} style={{ backgroundColor: '#166534' }}>
                <Button size="small">Selected</Button>
              </Badge>
              <Button size="small" type="primary" ghost>Bulk Export</Button>
              <Button size="small" danger onClick={() => setSelectedRows([])}>Clear</Button>
            </Space>
          )}
        </div>

        {/* Table */}
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 15,
            showTotal: (total) => (
              <Text type="secondary">{total} bookings total</Text>
            ),
            showSizeChanger: true,
            pageSizeOptions: ['10', '15', '25', '50'],
          }}
          size="middle"
        />
      </Card>
    </div>
  );
};
