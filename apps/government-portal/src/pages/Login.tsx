import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Space, Tag } from 'antd';
import { MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const { Title, Text } = Typography;

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res: any = await api.post('/auth/login', values);
      setAuth(res.accessToken, res.user);
      localStorage.setItem('zimvisit_gov_token', res.accessToken);
      message.success('Welcome to the ZimVisit Government Portal');
      navigate('/', { replace: true });
    } catch (err: any) {
      message.error(err?.message?.[0] || 'Access denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #3b82f6 100%)',
    }}>
      <Card style={{ width: 440, borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <Space direction="vertical" style={{ width: '100%', textAlign: 'center', marginBottom: 24 }}>
          <SafetyCertificateOutlined style={{ fontSize: 48, color: '#1e3a5f' }} />
          <Title level={3} style={{ margin: 0 }}>ZimVisit</Title>
          <Text type="secondary">Government Oversight Portal</Text>
          <Tag color="blue" style={{ marginTop: 8 }}>ZTA | ZIMRA Authorized Access Only</Tag>
        </Space>
        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="Official email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Sign In
          </Button>
        </Form>
      </Card>
    </div>
  );
};
