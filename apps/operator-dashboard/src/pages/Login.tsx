import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { MailOutlined, LockOutlined, ApiOutlined } from '@ant-design/icons';
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
      localStorage.setItem('zimvisit_token', res.accessToken);
      message.success('Welcome to ZimVisit Operator Center');
      navigate('/', { replace: true });
    } catch (err: any) {
      message.error(err?.message?.[0] || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #166534 0%, #15803d 50%, #22c55e 100%)',
    }}>
      <Card style={{ width: 420, borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <Space direction="vertical" style={{ width: '100%', textAlign: 'center', marginBottom: 24 }}>
          <ApiOutlined style={{ fontSize: 48, color: '#166534' }} />
          <Title level={3} style={{ margin: 0 }}>ZimVisit</Title>
          <Text type="secondary">Operator Command Center</Text>
        </Space>
        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email address" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Password required' }]}>
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
