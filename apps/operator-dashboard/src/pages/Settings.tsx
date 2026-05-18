import React, { useState } from 'react';
import {
  Card, Form, Input, Button, Typography, Switch, message,
  Descriptions, Tag, Space, Tabs, Row, Col, Badge, Select, InputNumber,
  Alert, Tooltip, Avatar,
} from 'antd';
import {
  SettingOutlined, UserOutlined, BellOutlined, CreditCardOutlined,
  KeyOutlined, SafetyOutlined, GlobalOutlined, SaveOutlined,
  CopyOutlined, CheckCircleOutlined, LockOutlined, EyeOutlined,
  EyeInvisibleOutlined, BankOutlined, MobileOutlined, MailOutlined,
  InfoCircleOutlined, ApiOutlined, ReloadOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export const Settings: React.FC = () => {
  const [profileForm] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveProfile = (values: any) => {
    console.log('Profile saved:', values);
    message.success('Profile updated successfully');
  };

  const handleSavePayment = (values: any) => {
    console.log('Payment settings saved:', values);
    message.success('Payment settings updated');
  };

  const handleSaveNotifications = () => {
    message.success('Notification preferences saved');
  };

  const mockApiKey = 'zvop_sk_live_7f3a9b2c4d5e6f7a8b9c0d1e2f3a4b5c';

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          <SettingOutlined style={{ marginRight: 8, color: '#166534' }} />
          Settings
        </Title>
        <Text type="secondary">Manage your operator profile, payments, notifications, and API access</Text>
      </div>

      {/* Operator Profile Card */}
      <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <Avatar
            size={72}
            icon={<UserOutlined />}
            style={{
              background: 'linear-gradient(135deg, #166534, #059669)',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            T
          </Avatar>
          <div>
            <Title level={4} style={{ margin: 0 }}>TravelZim Tours & Safaris</Title>
            <Text type="secondary">OP-ZIM-001 - Registered Tourism Operator</Text>
            <div style={{ marginTop: 6 }}>
              <Space>
                <Tag color="green" icon={<CheckCircleOutlined />}>Active</Tag>
                <Tag color="green" icon={<SafetyOutlined />}>BSP Connected</Tag>
                <Tag color="green" icon={<GlobalOutlined />}>Verified</Tag>
              </Space>
            </div>
          </div>
        </div>

        <Descriptions column={{ xs: 1, sm: 2, lg: 4 }} bordered size="small">
          <Descriptions.Item label="Operator ID">
            <Text copyable style={{ fontFamily: 'monospace' }}>OP-ZIM-001</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Badge status="success" text="Active" />
          </Descriptions.Item>
          <Descriptions.Item label="BSP Integration">
            <Badge status="success" text="Connected" />
          </Descriptions.Item>
          <Descriptions.Item label="Compliance Score">
            <Tag color="green" style={{ fontWeight: 700 }}>96%</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Member Since">
            <Text type="secondary">January 2024</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Total Bookings">
            <Text style={{ fontWeight: 600 }}>1,247</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Revenue (YTD)">
            <Text style={{ fontWeight: 700, color: '#166534' }}>$142,580</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Active Listings">
            <Text style={{ fontWeight: 600 }}>24</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Settings Tabs */}
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Tabs
          defaultActiveKey="profile"
          items={[
            {
              key: 'profile',
              label: (
                <Space>
                  <UserOutlined />
                  Operator Profile
                </Space>
              ),
              children: (
                <div style={{ maxWidth: 640 }}>
                  <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={handleSaveProfile}
                    initialValues={{
                      companyName: 'TravelZim Tours & Safaris',
                      email: 'admin@travelzim.co.zw',
                      phone: '+263 4 123 4567',
                      website: 'https://travelzim.co.zw',
                      address: '45 Samora Machel Ave, Harare',
                      city: 'Harare',
                      description: 'Premier tourism operator specializing in Victoria Falls tours, safari experiences, and cultural heritage trips across Zimbabwe.',
                    }}
                  >
                    <Form.Item name="companyName" label="Company Name" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                          <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="phone" label="Phone">
                          <Input prefix={<MobileOutlined style={{ color: '#94a3b8' }} />} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="website" label="Website">
                          <Input prefix={<GlobalOutlined style={{ color: '#94a3b8' }} />} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="city" label="City">
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item name="address" label="Address">
                      <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Company Description">
                      <Input.TextArea rows={4} showCount maxLength={500} />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                        Save Profile
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              ),
            },
            {
              key: 'payment',
              label: (
                <Space>
                  <CreditCardOutlined />
                  Payment Config
                </Space>
              ),
              children: (
                <div style={{ maxWidth: 640 }}>
                  <Alert
                    type="info"
                    showIcon
                    message="Payment Configuration"
                    description="Configure your payment gateways and commission settings. All payments are processed securely via ZimVisit's payment infrastructure."
                    style={{ marginBottom: 20, borderRadius: 10 }}
                  />

                  <Form
                    form={paymentForm}
                    layout="vertical"
                    onFinish={handleSavePayment}
                    initialValues={{
                      paynowKey: '••••••••••••••••',
                      ecocashMerchant: 'EC-MERCH-001',
                      commission: 12,
                      currency: 'USD',
                    }}
                  >
                    <Card bordered style={{ borderRadius: 10, marginBottom: 16 }}>
                      <Title level={5} style={{ margin: '0 0 12px 0' }}>
                        <BankOutlined style={{ marginRight: 8, color: '#166534' }} />
                        Paynow Integration
                      </Title>
                      <Form.Item name="paynowKey" label="Paynow Integration Key">
                        <Input.Password />
                      </Form.Item>
                      <Form.Item name="ecocashMerchant" label="EcoCash Merchant ID">
                        <Input />
                      </Form.Item>
                    </Card>

                    <Card bordered style={{ borderRadius: 10, marginBottom: 16 }}>
                      <Title level={5} style={{ margin: '0 0 12px 0' }}>
                        <CreditCardOutlined style={{ marginRight: 8, color: '#166534' }} />
                        Commission & Currency
                      </Title>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item name="commission" label="Default Commission Rate">
                            <InputNumber
                              min={0}
                              max={100}
                              style={{ width: '100%' }}
                              suffix="%"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="currency" label="Default Currency">
                            <Select
                              options={[
                                { value: 'USD', label: 'USD - US Dollar' },
                                { value: 'ZWL', label: 'ZWL - Zimbabwe Dollar' },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                        Save Payment Settings
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              ),
            },
            {
              key: 'notifications',
              label: (
                <Space>
                  <BellOutlined />
                  Notifications
                </Space>
              ),
              children: (
                <div style={{ maxWidth: 640 }}>
                  <Card bordered style={{ borderRadius: 10, marginBottom: 16 }}>
                    <Title level={5} style={{ margin: '0 0 16px 0' }}>Booking Notifications</Title>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {[
                        { label: 'New Booking Alerts', description: 'Get notified when a new booking is created', defaultChecked: true },
                        { label: 'Booking Status Changes', description: 'Notifications for confirmed, cancelled, or completed bookings', defaultChecked: true },
                        { label: 'Payment Received', description: 'Alert when payment is processed for a booking', defaultChecked: true },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <Text style={{ fontWeight: 600, display: 'block' }}>{item.label}</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>
                          </div>
                          <Switch defaultChecked={item.defaultChecked} />
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card bordered style={{ borderRadius: 10, marginBottom: 16 }}>
                    <Title level={5} style={{ margin: '0 0 16px 0' }}>Compliance Alerts</Title>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {[
                        { label: 'Levy Remittance Reminders', description: 'Monthly reminders for levy payments', defaultChecked: true },
                        { label: 'Compliance Score Changes', description: 'Alerts when your compliance score changes', defaultChecked: true },
                        { label: 'Flagged Bookings', description: 'Immediate notification for non-compliant bookings', defaultChecked: true },
                        { label: 'BSP Routing Failures', description: 'Alert when BSP routing fails', defaultChecked: true },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <Text style={{ fontWeight: 600, display: 'block' }}>{item.label}</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>
                          </div>
                          <Switch defaultChecked={item.defaultChecked} />
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card bordered style={{ borderRadius: 10, marginBottom: 16 }}>
                    <Title level={5} style={{ margin: '0 0 16px 0' }}>Delivery Channels</Title>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {[
                        { label: 'Email Notifications', description: 'Receive notifications via email', icon: <MailOutlined />, defaultChecked: true },
                        { label: 'SMS Notifications', description: 'Receive SMS for critical alerts', icon: <MobileOutlined />, defaultChecked: true },
                        { label: 'In-App Notifications', description: 'Show notifications in the dashboard', icon: <BellOutlined />, defaultChecked: true },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Space size={10}>
                            <div style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              background: '#f0fdf4',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#166534',
                            }}>
                              {item.icon}
                            </div>
                            <div>
                              <Text style={{ fontWeight: 600, display: 'block' }}>{item.label}</Text>
                              <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>
                            </div>
                          </Space>
                          <Switch defaultChecked={item.defaultChecked} />
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveNotifications}>
                    Save Notification Preferences
                  </Button>
                </div>
              ),
            },
            {
              key: 'api',
              label: (
                <Space>
                  <ApiOutlined />
                  API Keys
                </Space>
              ),
              children: (
                <div style={{ maxWidth: 640 }}>
                  <Alert
                    type="warning"
                    showIcon
                    message="Keep your API keys secure"
                    description="Never share your API keys publicly. If a key is compromised, regenerate it immediately."
                    style={{ marginBottom: 20, borderRadius: 10 }}
                  />

                  <Card bordered style={{ borderRadius: 10, marginBottom: 16 }}>
                    <Title level={5} style={{ margin: '0 0 16px 0' }}>
                      <KeyOutlined style={{ marginRight: 8, color: '#166534' }} />
                      Live API Key
                    </Title>
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 10,
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      marginBottom: 16,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{
                          fontFamily: 'monospace',
                          fontSize: 13,
                          color: '#475569',
                          wordBreak: 'break-all',
                        }}>
                          {showApiKey ? mockApiKey : mockApiKey.replace(/./g, '•').slice(0, 40) + '...'}
                        </Text>
                        <Space>
                          <Tooltip title={showApiKey ? 'Hide' : 'Show'}>
                            <Button
                              type="text"
                              size="small"
                              icon={showApiKey ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                              onClick={() => setShowApiKey(!showApiKey)}
                            />
                          </Tooltip>
                          <Tooltip title="Copy">
                            <Button
                              type="text"
                              size="small"
                              icon={<CopyOutlined />}
                              onClick={() => {
                                navigator.clipboard.writeText(mockApiKey);
                                message.success('API key copied to clipboard');
                              }}
                            />
                          </Tooltip>
                        </Space>
                      </div>
                    </div>
                    <Space>
                      <Button icon={<ReloadOutlined />} danger>Regenerate Key</Button>
                      <Text type="secondary" style={{ fontSize: 12 }}>Last regenerated: 30 days ago</Text>
                    </Space>
                  </Card>

                  <Card bordered style={{ borderRadius: 10, marginBottom: 16 }}>
                    <Title level={5} style={{ margin: '0 0 16px 0' }}>
                      <LockOutlined style={{ marginRight: 8, color: '#166534' }} />
                      Webhook Configuration
                    </Title>
                    <Form layout="vertical">
                      <Form.Item label="Webhook URL" help="We'll send POST requests to this URL for booking events">
                        <Input placeholder="https://your-domain.com/webhooks/zimvisit" />
                      </Form.Item>
                      <Form.Item label="Webhook Secret">
                        <Input.Password placeholder="Your webhook signing secret" />
                      </Form.Item>
                      <Button type="primary" icon={<SaveOutlined />}>Save Webhook</Button>
                    </Form>
                  </Card>

                  <Card bordered style={{ borderRadius: 10 }}>
                    <Title level={5} style={{ margin: '0 0 12px 0' }}>
                      <InfoCircleOutlined style={{ marginRight: 8, color: '#0369a1' }} />
                      API Documentation
                    </Title>
                    <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                      Integrate with the ZimVisit API to manage bookings, inventory, and compliance programmatically.
                    </Paragraph>
                    <Space>
                      <Button type="primary" ghost>View Docs</Button>
                      <Button>API Status</Button>
                    </Space>
                  </Card>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};
