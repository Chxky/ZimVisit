import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form, Input, InputNumber, Button, Card, Typography, Select, message,
  Spin, Row, Col, Switch, Space,
} from 'antd';
import {
  ArrowLeftOutlined, SaveOutlined, PlusOutlined, UploadOutlined,
  PictureOutlined, ShopOutlined, DollarOutlined, TeamOutlined,
  EnvironmentOutlined, ClockCircleOutlined, InfoCircleOutlined,
} from '@ant-design/icons';
import { inventoryApi } from '../services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const InventoryEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [itemType, setItemType] = useState<'tour' | 'hotel'>('tour');
  const isEdit = !!id;

  useEffect(() => {
    if (id) {
      inventoryApi.getTour(id).then((res: any) => {
        form.setFieldsValue(res);
        if (res.type) setItemType(res.type);
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await inventoryApi.updateTour(id!, values);
        message.success('Listing updated successfully');
      } else {
        await inventoryApi.createTour(values);
        message.success('Listing created successfully');
      }
      navigate('/inventory');
    } catch (err: any) {
      message.error(err?.message?.[0] || 'Failed to save listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
      }}>
        <Space align="start">
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => navigate('/inventory')}
            style={{ marginTop: 2 }}
          />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {isEdit ? 'Edit Listing' : 'Create New Listing'}
            </Title>
            <Text type="secondary">
              {isEdit ? 'Update your tourism listing details' : 'Add a new tour, activity, or hotel to your inventory'}
            </Text>
          </div>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          isActive: true,
          categories: [],
          inclusions: [],
          exclusions: [],
        }}
        size="large"
      >
        <Row gutter={[20, 0]}>
          {/* Left Column - Main Content */}
          <Col xs={24} lg={16}>
            {/* Listing Type */}
            {!isEdit && (
              <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }}>
                <Title level={5} style={{ margin: '0 0 16px 0' }}>
                  <ShopOutlined style={{ marginRight: 8, color: '#166534' }} />
                  Listing Type
                </Title>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { key: 'tour', label: 'Tour / Activity', icon: <EnvironmentOutlined />, color: '#166534', bg: '#f0fdf4', border: '#166534' },
                    { key: 'hotel', label: 'Hotel / Lodging', icon: <ShopOutlined />, color: '#0369a1', bg: '#f0f9ff', border: '#0369a1' },
                  ].map((type) => (
                    <div
                      key={type.key}
                      onClick={() => setItemType(type.key as 'tour' | 'hotel')}
                      style={{
                        flex: 1,
                        padding: '16px 20px',
                        borderRadius: 10,
                        border: `2px solid ${itemType === type.key ? type.border : '#e2e8f0'}`,
                        background: itemType === type.key ? type.bg : '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: itemType === type.key ? type.color : '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: itemType === type.key ? '#fff' : '#64748b',
                        fontSize: 16,
                      }}>
                        {type.icon}
                      </div>
                      <Text style={{
                        fontWeight: itemType === type.key ? 700 : 500,
                        color: itemType === type.key ? type.color : '#475569',
                      }}>
                        {type.label}
                      </Text>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Basic Information */}
            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }}>
              <Title level={5} style={{ margin: '0 0 16px 0' }}>
                <InfoCircleOutlined style={{ marginRight: 8, color: '#166534' }} />
                Basic Information
              </Title>

              <Form.Item
                name="name"
                label="Listing Name"
                rules={[{ required: true, message: 'Please enter a name' }]}
              >
                <Input placeholder="e.g. Victoria Falls Sunset Cruise" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please add a description' }]}
              >
                <TextArea
                  rows={5}
                  placeholder="Describe your listing in detail. What makes it special? What will travelers experience?"
                  showCount
                  maxLength={2000}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="Location"
                    rules={[{ required: true, message: 'Location is required' }]}
                  >
                    <Input prefix={<EnvironmentOutlined style={{ color: '#94a3b8' }} />} placeholder="e.g. Victoria Falls" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="duration"
                    label="Duration"
                  >
                    <Input prefix={<ClockCircleOutlined style={{ color: '#94a3b8' }} />} placeholder="e.g. 3 hours, Full day" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="categories" label="Categories">
                <Select
                  mode="tags"
                  placeholder="Add categories (press Enter)"
                  options={[
                    { value: 'Safari', label: 'Safari' },
                    { value: 'Adventure', label: 'Adventure' },
                    { value: 'Cultural', label: 'Cultural' },
                    { value: 'Nature', label: 'Nature' },
                    { value: 'Water Sports', label: 'Water Sports' },
                    { value: 'City Tour', label: 'City Tour' },
                    { value: 'Heritage', label: 'Heritage' },
                  ]}
                />
              </Form.Item>
            </Card>

            {/* Pricing & Capacity */}
            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }}>
              <Title level={5} style={{ margin: '0 0 16px 0' }}>
                <DollarOutlined style={{ marginRight: 8, color: '#166534' }} />
                Pricing & Capacity
              </Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="Price (USD)"
                    rules={[{ required: true, message: 'Price is required' }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: '100%' }}
                      prefix="$"
                      placeholder="0.00"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="maxCapacity" label="Max Capacity">
                    <InputNumber
                      min={1}
                      style={{ width: '100%' }}
                      prefix={<TeamOutlined style={{ color: '#94a3b8' }} />}
                      placeholder="e.g. 20"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {itemType === 'hotel' && (
                <Form.Item name="address" label="Full Address">
                  <Input placeholder="Full street address" />
                </Form.Item>
              )}

              {itemType === 'tour' && (
                <Form.Item name="meetingPoint" label="Meeting Point">
                  <Input placeholder="Where travelers should meet" />
                </Form.Item>
              )}
            </Card>

            {/* Inclusions & Exclusions */}
            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }}>
              <Title level={5} style={{ margin: '0 0 16px 0' }}>
                What's Included
              </Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="inclusions" label="Included">
                    <Select
                      mode="tags"
                      placeholder="e.g. Transport, Lunch"
                      options={[
                        { value: 'Transport', label: 'Transport' },
                        { value: 'Lunch', label: 'Lunch' },
                        { value: 'Guide', label: 'Professional Guide' },
                        { value: 'Equipment', label: 'Equipment' },
                        { value: 'Drinks', label: 'Drinks' },
                        { value: 'Park Fees', label: 'Park Fees' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="exclusions" label="Not Included">
                    <Select
                      mode="tags"
                      placeholder="e.g. Flights, Visa"
                      options={[
                        { value: 'Flights', label: 'Flights' },
                        { value: 'Visa', label: 'Visa Fees' },
                        { value: 'Insurance', label: 'Travel Insurance' },
                        { value: 'Tips', label: 'Gratuities' },
                        { value: 'Personal Expenses', label: 'Personal Expenses' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column - Sidebar */}
          <Col xs={24} lg={8}>
            {/* Status */}
            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }}>
              <Title level={5} style={{ margin: '0 0 16px 0' }}>Status</Title>
              <Form.Item name="isActive" valuePropName="checked" style={{ marginBottom: 0 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: '#f8fafc',
                }}>
                  <div>
                    <Text style={{ fontWeight: 600, display: 'block' }}>Active Listing</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>Visible to travelers</Text>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </Card>

            {/* Image Upload Placeholder */}
            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }}>
              <Title level={5} style={{ margin: '0 0 16px 0' }}>
                <PictureOutlined style={{ marginRight: 8, color: '#166534' }} />
                Images
              </Title>
              <div style={{
                border: '2px dashed #e2e8f0',
                borderRadius: 10,
                padding: '32px 20px',
                textAlign: 'center',
                background: '#fafbfc',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#166534';
                  e.currentTarget.style.background = '#f0fdf4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#fafbfc';
                }}
              >
                <UploadOutlined style={{ fontSize: 32, color: '#94a3b8', marginBottom: 8 }} />
                <Text style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                  Click to upload images
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  PNG, JPG up to 5MB each. Max 8 images.
                </Text>
              </div>
              <div style={{ marginTop: 12 }}>
                <Space wrap>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      background: '#f1f5f9',
                      border: '1px dashed #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <PlusOutlined style={{ color: '#94a3b8' }} />
                    </div>
                  ))}
                </Space>
              </div>
            </Card>

            {/* Compliance Info */}
            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }}>
              <Title level={5} style={{ margin: '0 0 12px 0' }}>
                Compliance Notes
              </Title>
              <div style={{
                padding: '12px 14px',
                borderRadius: 10,
                background: '#f0fdf4',
                border: '1px solid #d1fae5',
              }}>
                <Text style={{ fontSize: 12, color: '#166534', lineHeight: 1.7 }}>
                  All listings are automatically checked for compliance with Zimbabwe Tourism Authority standards.
                  Ensure pricing is in USD and includes applicable levies.
                </Text>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card bordered={false} style={{ borderRadius: 12 }}>
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  block
                  icon={<SaveOutlined />}
                  style={{
                    height: 48,
                    borderRadius: 10,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
                    border: 'none',
                  }}
                >
                  {isEdit ? 'Update Listing' : 'Create Listing'}
                </Button>
                <Button
                  block
                  onClick={() => navigate('/inventory')}
                  style={{ height: 40, borderRadius: 10 }}
                >
                  Cancel
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
