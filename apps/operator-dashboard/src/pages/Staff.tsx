import React, { useState } from 'react';
import {
  Table, Card, Tag, Typography, Space, Avatar, Button, Modal,
  Form, Input, Select, message, Badge, Row, Col, Statistic,
  Dropdown, Descriptions, Divider,
} from 'antd';
import {
  TeamOutlined, UserOutlined, PlusOutlined, MailOutlined,
  EditOutlined, MoreOutlined, SafetyOutlined, ClockCircleOutlined,
  EyeOutlined, DeleteOutlined, LockOutlined, CheckCircleOutlined,
  SearchOutlined, ExportOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface StaffMember {
  key: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  lastActive: string;
  bookings: number;
  trustScore: number;
  phone?: string;
  department?: string;
}

const staffData: StaffMember[] = [
  { key: '1', name: 'Tatenda Mukanya', email: 'tatenda@travelzim.co.zw', role: 'Admin', active: true, lastActive: '2026-05-18T14:30', bookings: 145, trustScore: 94, phone: '+263 77 123 4567', department: 'Operations' },
  { key: '2', name: 'Chiedza Ndlovu', email: 'chiedza@travelzim.co.zw', role: 'Agent', active: true, lastActive: '2026-05-18T09:15', bookings: 89, trustScore: 72, phone: '+263 77 234 5678', department: 'Sales' },
  { key: '3', name: 'Tafara Moyo', email: 'tafara@travelzim.co.zw', role: 'Agent', active: false, lastActive: '2026-05-17T22:00', bookings: 234, trustScore: 45, phone: '+263 77 345 6789', department: 'Sales' },
  { key: '4', name: 'Rumbi Sibanda', email: 'rumbi@travelzim.co.zw', role: 'Agent', active: true, lastActive: '2026-05-18T11:00', bookings: 67, trustScore: 88, phone: '+263 77 456 7890', department: 'Support' },
  { key: '5', name: 'Tanaka Kaseke', email: 'tanaka@travelzim.co.zw', role: 'Viewer', active: true, lastActive: '2026-05-16T16:45', bookings: 12, trustScore: 61, department: 'Finance' },
];

const activityLog = [
  { id: 1, user: 'Tatenda Mukanya', action: 'Confirmed booking #ZV-2984', time: '2 hours ago', type: 'booking' },
  { id: 2, user: 'Chiedza Ndlovu', action: 'Created new tour listing: Victoria Falls Sunset Cruise', time: '4 hours ago', type: 'inventory' },
  { id: 3, user: 'Rumbi Sibanda', action: 'Processed levy remittance for May 2026', time: '6 hours ago', type: 'compliance' },
  { id: 4, user: 'Tatenda Mukanya', action: 'Updated staff permissions for Tanaka Kaseke', time: '1 day ago', type: 'admin' },
  { id: 5, user: 'Chiedza Ndlovu', action: 'Exported bookings report Q2 2026', time: '1 day ago', type: 'report' },
];

export const Staff: React.FC = () => {
  const [search, setSearch] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = staffData.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = staffData.filter(s => s.active).length;
  const avgTrust = Math.round(staffData.reduce((sum, s) => sum + s.trustScore, 0) / staffData.length);
  const totalBookings = staffData.reduce((sum, s) => sum + s.bookings, 0);

  const handleInvite = (values: any) => {
    console.log('Inviting:', values);
    message.success(`Invitation sent to ${values.email}`);
    setInviteModalOpen(false);
    form.resetFields();
  };

  const handleViewStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setDetailModalOpen(true);
  };

  const columns = [
    {
      title: 'Staff Member',
      key: 'name',
      render: (_: any, r: StaffMember) => (
        <Space size={12}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{
              background: r.active
                ? 'linear-gradient(135deg, #166534, #059669)'
                : '#d1d5db',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {r.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 13 }}>{r.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (v: string) => {
        const colors: Record<string, string> = { Admin: 'blue', Agent: 'green', Viewer: 'default' };
        return <Tag color={colors[v]}>{v}</Tag>;
      },
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (v: string) => <Text style={{ fontSize: 13 }}>{v || '--'}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (v: boolean) => (
        <Badge
          status={v ? 'success' : 'default'}
          text={<Text style={{ fontSize: 12 }}>{v ? 'Active' : 'Inactive'}</Text>}
        />
      ),
    },
    {
      title: 'Bookings',
      dataIndex: 'bookings',
      key: 'bookings',
      sorter: (a: StaffMember, b: StaffMember) => a.bookings - b.bookings,
      render: (v: number) => <Text style={{ fontWeight: 600 }}>{v}</Text>,
    },
    {
      title: 'Trust Score',
      dataIndex: 'trustScore',
      key: 'trust',
      sorter: (a: StaffMember, b: StaffMember) => a.trustScore - b.trustScore,
      render: (v: number) => (
        <Space size={8}>
          <div style={{ width: 60 }}>
            <div style={{
              height: 6,
              background: '#f1f5f9',
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${v}%`,
                height: '100%',
                background: v > 80 ? '#059669' : v > 60 ? '#f59e0b' : '#dc2626',
                borderRadius: 3,
              }} />
            </div>
          </div>
          <Tag color={v > 80 ? 'green' : v > 60 ? 'orange' : 'red'} style={{ margin: 0 }}>
            {v}%
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
      render: (v: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {new Date(v).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </Text>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 48,
      render: (_: any, r: StaffMember) => (
        <Dropdown
          menu={{
            items: [
              { key: 'view', icon: <EyeOutlined />, label: 'View Profile', onClick: () => handleViewStaff(r) },
              { key: 'edit', icon: <EditOutlined />, label: 'Edit Role' },
              { type: 'divider' },
              { key: 'deactivate', icon: <LockOutlined />, label: r.active ? 'Deactivate' : 'Activate' },
              { key: 'delete', icon: <DeleteOutlined />, label: 'Remove', danger: true },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  const activityColors: Record<string, string> = {
    booking: '#059669',
    inventory: '#0369a1',
    compliance: '#f59e0b',
    admin: '#7c3aed',
    report: '#64748b',
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              <TeamOutlined style={{ marginRight: 8, color: '#166534' }} />
              Staff Management
            </Title>
            <Text type="secondary">Manage your team members, roles, and permissions</Text>
          </div>
          <Space>
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setInviteModalOpen(true)}
            >
              Invite Staff
            </Button>
          </Space>
        </div>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} bodyStyle={{ padding: '14px 16px' }} style={{ borderRadius: 10 }}>
            <Statistic
              title={<Text style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Staff</Text>}
              value={staffData.length}
              prefix={<TeamOutlined />}
              valueStyle={{ fontSize: 20, fontWeight: 700, color: '#166534' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} bodyStyle={{ padding: '14px 16px' }} style={{ borderRadius: 10 }}>
            <Statistic
              title={<Text style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active</Text>}
              value={activeCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ fontSize: 20, fontWeight: 700, color: '#059669' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} bodyStyle={{ padding: '14px 16px' }} style={{ borderRadius: 10 }}>
            <Statistic
              title={<Text style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Bookings</Text>}
              value={totalBookings}
              valueStyle={{ fontSize: 20, fontWeight: 700, color: '#0369a1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} bodyStyle={{ padding: '14px 16px' }} style={{ borderRadius: 10 }}>
            <Statistic
              title={<Text style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Trust</Text>}
              value={avgTrust}
              suffix="%"
              prefix={<SafetyOutlined />}
              valueStyle={{ fontSize: 20, fontWeight: 700, color: avgTrust > 70 ? '#059669' : '#f59e0b' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {/* Staff Table */}
        <Col xs={24} lg={16}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <Input
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                placeholder="Search staff by name, email, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 320 }}
                allowClear
              />
            </div>
            <Table
              dataSource={filtered}
              columns={columns}
              pagination={{
                pageSize: 10,
                showTotal: (total) => <Text type="secondary">{total} staff members</Text>,
              }}
              size="middle"
            />
          </Card>
        </Col>

        {/* Activity Log */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 12 }}
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#f59e0b' }} />
                <Text style={{ fontWeight: 700 }}>Recent Activity</Text>
              </Space>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {activityLog.map((log, i) => (
                <div key={log.id} style={{
                  padding: '12px 0',
                  borderBottom: i < activityLog.length - 1 ? '1px solid #f1f5f9' : 'none',
                }}>
                  <Space align="start" size={10}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: activityColors[log.type] || '#64748b',
                      marginTop: 6,
                      flexShrink: 0,
                    }} />
                    <div>
                      <Text style={{ fontSize: 13 }}>
                        <Text strong>{log.user}</Text> {log.action}
                      </Text>
                      <Text style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                        {log.time}
                      </Text>
                    </div>
                  </Space>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Invite Modal */}
      <Modal
        title={
          <Space>
            <MailOutlined style={{ color: '#166534' }} />
            <Text strong>Invite Team Member</Text>
          </Space>
        }
        open={inviteModalOpen}
        onCancel={() => setInviteModalOpen(false)}
        footer={null}
        width={480}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleInvite}
          style={{ marginTop: 16 }}
        >
          <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="colleague@company.co.zw" />
          </Form.Item>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="Full name" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select
              placeholder="Select role"
              options={[
                { value: 'Admin', label: 'Admin - Full access' },
                { value: 'Agent', label: 'Agent - Manage bookings & inventory' },
                { value: 'Viewer', label: 'Viewer - Read-only access' },
              ]}
            />
          </Form.Item>
          <Form.Item name="department" label="Department">
            <Select
              placeholder="Select department"
              options={[
                { value: 'Operations', label: 'Operations' },
                { value: 'Sales', label: 'Sales' },
                { value: 'Support', label: 'Support' },
                { value: 'Finance', label: 'Finance' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setInviteModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<MailOutlined />}>
                Send Invitation
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Staff Detail Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined style={{ color: '#166534' }} />
            <Text strong>Staff Profile</Text>
          </Space>
        }
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>Close</Button>,
          <Button key="edit" type="primary">Edit Profile</Button>,
        ]}
        width={520}
      >
        {selectedStaff && (
          <div style={{ marginTop: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Avatar
                size={64}
                icon={<UserOutlined />}
                style={{ background: 'linear-gradient(135deg, #166534, #059669)', fontSize: 24, fontWeight: 700, marginBottom: 8 }}
              >
                {selectedStaff.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Title level={4} style={{ margin: '4px 0 0' }}>{selectedStaff.name}</Title>
              <Text type="secondary">{selectedStaff.email}</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color={selectedStaff.role === 'Admin' ? 'blue' : selectedStaff.role === 'Agent' ? 'green' : 'default'}>
                  {selectedStaff.role}
                </Tag>
                <Badge status={selectedStaff.active ? 'success' : 'default'} text={selectedStaff.active ? 'Active' : 'Inactive'} />
              </div>
            </div>
            <Divider />
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Department">{selectedStaff.department || '--'}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedStaff.phone || '--'}</Descriptions.Item>
              <Descriptions.Item label="Bookings Managed">{selectedStaff.bookings}</Descriptions.Item>
              <Descriptions.Item label="Trust Score">
                <Tag color={selectedStaff.trustScore > 80 ? 'green' : selectedStaff.trustScore > 60 ? 'orange' : 'red'}>
                  {selectedStaff.trustScore}%
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Last Active">
                {new Date(selectedStaff.lastActive).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};
