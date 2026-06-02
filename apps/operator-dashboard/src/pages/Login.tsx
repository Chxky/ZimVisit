import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message, Space, Checkbox, Divider } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined, GlobalOutlined, RightOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

const { Title, Text, Paragraph } = Typography;

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // fake network delay
      const mockUser = { id: 'operator-123', email: values.email || 'operator@wildhorizons.co.zw', name: 'Wild Horizons', role: 'operator' };
      const mockToken = 'mock-operator-token';
      setAuth(mockToken, mockUser);
      localStorage.setItem('zimvisit_token', mockToken);
      message.success('Welcome back to ZimVisit');
      navigate('/', { replace: true });
    } catch (err: any) {
      message.error(err?.message?.[0] || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Left Panel - Brand */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(rgba(5, 46, 22, 0.75), rgba(5, 46, 22, 0.85)), url("/zim-big-five.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decorative elements */}
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,119,6,0.15) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%)',
        }} />

        {/* Decorative grid lines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
            <img src="/logo.svg" alt="ZimVisit" style={{ width: 52, height: 52, borderRadius: 12 }} />
            <div>
              <Title level={2} style={{ margin: 0, color: '#fff', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>
                ZimVisit
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Tourism Platform
              </Text>
            </div>
          </div>

          <Title level={1} style={{
            color: '#fff',
            fontSize: 42,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 20,
            letterSpacing: '-0.5px',
          }}>
            Operator<br />
            Command Center
          </Title>

          <Paragraph style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 17,
            lineHeight: 1.7,
            maxWidth: 440,
            marginBottom: 48,
          }}>
            Manage your tourism operations, track compliance, and grow your business
            with Zimbabwe's leading tourism intelligence platform.
          </Paragraph>

          {/* Feature highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: <SafetyOutlined />, text: 'Real-time BSP compliance monitoring' },
              { icon: <GlobalOutlined />, text: 'AI-powered agent fingerprinting' },
              { icon: <RightOutlined />, text: 'Unified booking & inventory management' },
            ].map((feature, i) => (
              <Space key={i} size={14} style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d97706',
                  fontSize: 14,
                }}>
                  {feature.icon}
                </div>
                {feature.text}
              </Space>
            ))}
          </div>

          {/* Bottom stats */}
          <div style={{
            marginTop: 64,
            display: 'flex',
            gap: 40,
          }}>
            {[
              { value: '200+', label: 'Operators' },
              { value: '98.5%', label: 'Compliance Rate' },
              { value: '$2.4M', label: 'Revenue Tracked' },
            ].map((stat, i) => (
              <div key={i}>
                <Text style={{ color: '#d97706', fontSize: 24, fontWeight: 800, display: 'block' }}>
                  {stat.value}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {stat.label}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div style={{
        width: 520,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 64px',
        background: '#ffffff',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 40 }}>
            <Title level={3} style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>
              Welcome back
            </Title>
            <Text style={{ color: '#64748b', fontSize: 14 }}>
              Sign in to your operator dashboard
            </Text>
          </div>

          <Form
            layout="vertical"
            onFinish={onFinish}
            size="large"
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
                placeholder="you@company.co.zw"
                style={{ height: 48, borderRadius: 10 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                placeholder="Enter your password"
                style={{ height: 48, borderRadius: 10 }}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a onClick={(e) => { e.preventDefault(); message.info('Password reset coming soon'); }} style={{ color: '#166534', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                Forgot password?
              </a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 48,
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(22, 101, 52, 0.3)',
                }}
              >
                Sign In to Dashboard
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '24px 0' }}>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>SECURE LOGIN</Text>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <Space size={6} style={{ color: '#94a3b8', fontSize: 12 }}>
              <SafetyOutlined style={{ color: '#059669' }} />
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                Protected by ZimVisit Security
              </Text>
            </Space>
          </div>

          {/* Quick Demo Access */}
          <div style={{ marginTop: 24 }}>
            <Button
              block
              size="large"
              loading={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await new Promise(resolve => setTimeout(resolve, 800)); // fake network delay
                  const mockUser = { id: 'operator-123', email: 'operator@wildhorizons.co.zw', name: 'Wild Horizons', role: 'operator' };
                  const mockToken = 'mock-operator-token';
                  setAuth(mockToken, mockUser);
                  localStorage.setItem('zimvisit_token', mockToken);
                  message.success('Demo access granted - Operator Dashboard');
                  navigate('/', { replace: true });
                } catch (err: any) {
                  message.error('Demo login failed. Please try again.');
                } finally {
                  setLoading(false);
                }
              }}
              style={{
                height: 44,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                border: 'none',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
              }}
            >
              Quick Demo Access
            </Button>
            <Text style={{ display: 'block', textAlign: 'center', marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
              Uses demo credentials: operator@wildhorizons.co.zw / demo123
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};
