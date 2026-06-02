// ============================================================
// ZimVisit Traveler Portal - Login Page
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, Divider, Space, message } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  FacebookOutlined,
  ArrowRightOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

const { Title, Text, Paragraph } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithApi, demoLogin, isLoading } = useAuthStore();
  const [form] = Form.useForm();

  const handleFinish = async (values: { email: string; password: string; remember: boolean }) => {
    try {
      await loginWithApi(values.email, values.password);
      message.success('Welcome back to ZimVisit!');
      navigate('/explore');
    } catch (err: any) {
      message.error(err.message || 'Invalid email or password. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    try {
      await demoLogin('traveler');
      message.success('Welcome! Logged in as demo traveler.');
      navigate('/explore');
    } catch (err: any) {
      message.error(err.message || 'Demo login failed. Make sure the backend is running.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#ffffff',
      }}
    >
      {/* ---- Left Side: Visual ---- */}
      <div
        className="hide-mobile"
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 70%, #000000 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: 60,
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 30% 40%, rgba(245,158,11,0.1) 0%, transparent 50%), ' +
              'radial-gradient(circle at 70% 60%, rgba(22,101,52,0.15) 0%, transparent 40%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 420 }}>
          {/* Large adventure icon */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 36,
              background: 'linear-gradient(135deg, rgba(217,119,6,0.2) 0%, rgba(217,119,6,0.05) 100%)',
              border: '2px solid rgba(217,119,6,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 40px',
              fontSize: 56,
            }}
          >
            <CompassOutlined style={{ color: '#d97706' }} />
          </div>

          <Title level={2} style={{ color: '#ffffff', marginBottom: 16, fontWeight: 800, lineHeight: 1.2 }}>
            Welcome Back to{' '}
            <span style={{ color: '#d97706' }}>ZimVisit</span>
          </Title>

          <Paragraph style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, lineHeight: 1.8, marginBottom: 48 }}>
            Your next Zimbabwe adventure is waiting. Sign in to access your bookings, ZimPass, and personalized recommendations.
          </Paragraph>

          {/* Feature highlights */}
          <Space direction="vertical" size={20} style={{ textAlign: 'left', width: '100%' }}>
            {[
              { emoji: '🦁', text: 'Access your safari bookings and ZimPass' },
              { emoji: '🌊', text: 'Get personalized Victoria Falls deals' },
              { emoji: '⛰️', text: 'Track your hiking adventures' },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span style={{ fontSize: 28 }}>{f.emoji}</span>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>{f.text}</Text>
              </div>
            ))}
          </Space>
        </div>
      </div>

      {/* ---- Right Side: Form ---- */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          background: '#ffffff',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <div className="hide-desktop" style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{ fontSize: 28, fontWeight: 800 }}>
              Zim<span style={{ color: '#d97706' }}>Visit</span>
            </span>
          </div>

          <div style={{ marginBottom: 36 }}>
            <Title level={3} style={{ marginBottom: 8, fontWeight: 800 }}>
              Sign In
            </Title>
            <Text style={{ color: '#737373', fontSize: 15 }}>
              Enter your credentials to access your account
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
            initialValues={{ remember: true }}
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#a3a3a3' }} />}
                placeholder="Email address"
                style={{ height: 50, borderRadius: 12, fontSize: 15 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#a3a3a3' }} />}
                placeholder="Password"
                style={{ height: 50, borderRadius: 12, fontSize: 15 }}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox style={{ color: '#525252' }}>Remember me</Checkbox>
                </Form.Item>
                <a
                  onClick={(e) => { e.preventDefault(); message.info('Password reset coming soon'); }}
                  style={{ color: '#f59e0b', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                >
                  Forgot password?
                </a>
              </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                style={{
                  height: 52,
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
                  borderColor: '#166534',
                  boxShadow: '0 8px 24px rgba(22, 101, 52, 0.25)',
                }}
                icon={<ArrowRightOutlined />}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          {/* Divider */}
          <Divider style={{ color: '#a3a3a3', fontSize: 13 }}>or continue with</Divider>

          {/* Social Login */}
          <Space size={12} style={{ width: '100%', marginBottom: 32 }}>
            <Button
              block
              onClick={handleDemoLogin}
              icon={<GoogleOutlined />}
              style={{
                height: 48,
                borderRadius: 12,
                borderColor: '#e5e5e5',
                fontWeight: 500,
                flex: 1,
              }}
            >
              Google
            </Button>
            <Button
              block
              onClick={handleDemoLogin}
              icon={<FacebookOutlined />}
              style={{
                height: 48,
                borderRadius: 12,
                borderColor: '#e5e5e5',
                fontWeight: 500,
                flex: 1,
              }}
            >
              Facebook
            </Button>
          </Space>

          {/* Register Link */}
          <div style={{ textAlign: 'center' }}>
            <Text style={{ color: '#737373', fontSize: 15 }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: '#166534',
                  fontWeight: 600,
                }}
              >
                Create one now
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
