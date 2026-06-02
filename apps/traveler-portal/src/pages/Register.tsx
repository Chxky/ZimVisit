// ============================================================
// ZimVisit Traveler Portal - Register Page
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Divider, Space, message } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  FacebookOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

const { Title, Text, Paragraph } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerWithApi, isLoading } = useAuthStore();
  const [form] = Form.useForm();

  const handleFinish = async (values: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    try {
      await registerWithApi(values);
      message.success('Welcome to ZimVisit! Your adventure begins now.');
      navigate('/explore');
    } catch (err: any) {
      message.error(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    message.success('OAuth Demo successful! Welcome to ZimVisit.');
    navigate('/explore');
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
          background: 'linear-gradient(135deg, #14532d 0%, #166534 30%, #052e16 60%, #000000 100%)',
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
              'radial-gradient(circle at 70% 30%, rgba(245,158,11,0.1) 0%, transparent 50%), ' +
              'radial-gradient(circle at 30% 70%, rgba(22,101,52,0.15) 0%, transparent 40%)',
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
              background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.05) 100%)',
              border: '2px solid rgba(245,158,11,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 40px',
              fontSize: 56,
            }}
          >
            <span style={{ color: '#f59e0b' }}>🇿🇼</span>
          </div>

          <Title level={2} style={{ color: '#ffffff', marginBottom: 16, fontWeight: 800, lineHeight: 1.2 }}>
            Start Your{' '}
            <span style={{ color: '#f59e0b' }}>Journey</span>
          </Title>

          <Paragraph style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, lineHeight: 1.8, marginBottom: 48 }}>
            Create your free account and unlock access to the best tours, hotels, and experiences Zimbabwe has to offer.
          </Paragraph>

          {/* Benefits */}
          <Space direction="vertical" size={16} style={{ textAlign: 'left', width: '100%' }}>
            {[
              { icon: <CompassOutlined />, text: 'Browse 200+ verified tours and activities' },
              { icon: <SafetyCertificateOutlined />, text: 'Secure booking with flexible cancellation' },
              { icon: <span style={{ fontSize: 20 }}>🎫</span>, text: 'Unified ZimPass digital travel pass' },
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
                <span style={{ fontSize: 22, color: '#f59e0b', width: 28, textAlign: 'center' }}>
                  {f.icon}
                </span>
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
              Zim<span style={{ color: '#f59e0b' }}>Visit</span>
            </span>
          </div>

          <div style={{ marginBottom: 36 }}>
            <Title level={3} style={{ marginBottom: 8, fontWeight: 800 }}>
              Create Account
            </Title>
            <Text style={{ color: '#737373', fontSize: 15 }}>
              Join thousands of travelers exploring Zimbabwe
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#a3a3a3' }} />}
                placeholder="Full name"
                style={{ height: 50, borderRadius: 12, fontSize: 15 }}
              />
            </Form.Item>

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
              name="phone"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: '#a3a3a3' }} />}
                placeholder="Phone number"
                style={{ height: 50, borderRadius: 12, fontSize: 15 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please create a password' },
                { min: 8, message: 'Password must be at least 8 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#a3a3a3' }} />}
                placeholder="Create a password"
                style={{ height: 50, borderRadius: 12, fontSize: 15 }}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#a3a3a3' }} />}
                placeholder="Confirm password"
                style={{ height: 50, borderRadius: 12, fontSize: 15 }}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 28 }}>
              <Text style={{ color: '#737373', fontSize: 13 }}>
                By creating an account, you agree to our{' '}
                <a style={{ color: '#166534', fontWeight: 500 }}>Terms of Service</a>
                {' '}and{' '}
                <a style={{ color: '#166534', fontWeight: 500 }}>Privacy Policy</a>
              </Text>
            </Form.Item>

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
                Create Account
              </Button>
            </Form.Item>
          </Form>

          {/* Divider */}
          <Divider style={{ color: '#a3a3a3', fontSize: 13 }}>or sign up with</Divider>

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

          {/* Login Link */}
          <div style={{ textAlign: 'center' }}>
            <Text style={{ color: '#737373', fontSize: 15 }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#166534',
                  fontWeight: 600,
                }}
              >
                Sign in
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
