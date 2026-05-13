import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Button, Card, Typography, Select, message, Spin } from 'antd';
import { inventoryApi } from '../services/api';

const { Title } = Typography;
const { TextArea } = Input;

export const InventoryEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!id;

  useEffect(() => {
    if (id) {
      inventoryApi.getTour(id).then((res: any) => {
        form.setFieldsValue(res);
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await inventoryApi.updateTour(id!, values);
        message.success('Tour updated');
      } else {
        await inventoryApi.createTour(values);
        message.success('Tour created');
      }
      navigate('/inventory');
    } catch (err: any) {
      message.error(err?.message?.[0] || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={4}>{isEdit ? 'Edit Tour' : 'New Tour Listing'}</Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Tour Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input placeholder="e.g. Victoria Falls" />
          </Form.Item>
          <Form.Item name="duration" label="Duration" rules={[{ required: true }]}>
            <Input placeholder="e.g. 3 hours, Full day" />
          </Form.Item>
          <Form.Item name="price" label="Price (USD)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="maxCapacity" label="Max Capacity">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="categories" label="Categories">
            <Select mode="tags" placeholder="e.g. Safari, Adventure, Cultural" />
          </Form.Item>
          <Form.Item name="meetingPoint" label="Meeting Point">
            <Input />
          </Form.Item>
          <Form.Item name="inclusions" label="Inclusions">
            <Select mode="tags" placeholder="What's included" />
          </Form.Item>
          <Form.Item name="exclusions" label="Exclusions">
            <Select mode="tags" placeholder="What's excluded" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} size="large">
            {isEdit ? 'Update Tour' : 'Create Tour'}
          </Button>
        </Form>
      </Card>
    </div>
  );
};
