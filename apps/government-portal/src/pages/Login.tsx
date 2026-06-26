import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message, Space, Checkbox } from 'antd';
import { MailOutlined, LockOutlined, SafetyCertificateOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

const { Title, Text } = Typography;

/* ── Particle Background ──────────────────────────────────── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animFrame = useRef<number>(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['rgba(245,158,11,', 'rgba(49,46,129,', 'rgba(30,27,75,', 'rgba(255,255,255,'];
    particles.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  useEffect(() => {
    init();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i];
          const b = particles.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(245,158,11,${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrame.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrame.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};

/* ── Login Page ───────────────────────────────────────────── */
export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // fake network delay
      const mockUser = { id: 'gov-123', email: values.email || 'admin@gov.zw', name: 'Gov Admin', fullName: 'Gov Admin', role: 'government' };
      const mockToken = 'mock-gov-token';
      setAuth(mockToken, mockUser);
      localStorage.setItem('zimvisit_gov_token', mockToken);
      message.success('Welcome to the ZimVisit Government Portal');
      navigate('/', { replace: true });
    } catch (err: any) {
      message.error(err?.message?.[0] || 'Access denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <img src="/gov-login-bg.png" alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', pointerEvents: 'none',
        }}
      />
      <ParticleCanvas />

      {/* Decorative circles */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '10%',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(49,46,129,0.08) 0%, transparent 70%)',
        animation: 'float 12s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      {/* Login Card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: 460,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Government Seal */}
        <div style={{
          textAlign: 'center',
          marginBottom: 32,
          animation: mounted ? 'fadeInUp 0.6s ease-out 0.2s both' : 'none',
        }}>
          <div style={{
            width: 80,
            height: 80,
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(30,27,75,0.25))',
            border: '2px solid rgba(245,158,11,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 20px rgba(245,158,11,0.3)',
          }}>
            <img src="/zim-bird-logo.png" alt="ZimVisit" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          </div>
          <Title level={2} style={{
            color: '#f8fafc',
            margin: 0,
            fontWeight: 800,
            letterSpacing: '-0.5px',
          }}>
            ZimVisit
          </Title>
          <Text style={{
            color: 'rgba(248,250,252,0.6)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            Government Oversight Portal
          </Text>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderRadius: 16,
          padding: '40px 36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
          animation: mounted ? 'fadeInUp 0.6s ease-out 0.4s both' : 'none',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <Space direction="vertical" size={4}>
              <Text style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                Authorized personnel only
              </Text>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                background: 'rgba(30,27,75,0.06)',
                borderRadius: 20,
              }}>
                <SafetyCertificateOutlined style={{ fontSize: 12, color: '#1e1b4b' }} />
                <Text style={{ fontSize: 11, color: '#1e1b4b', fontWeight: 600 }}>
                  ZTA | ZIMRA SECURED
                </Text>
              </div>
            </Space>
          </div>

          <Form
            layout="vertical"
            onFinish={onFinish}
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your official email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#64748b' }} />}
                placeholder="Official email address"
                style={{
                  height: 48,
                  borderRadius: 10,
                  borderColor: '#e2e8f0',
                  fontSize: 14,
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#64748b' }} />}
                placeholder="Password"
                style={{
                  height: 48,
                  borderRadius: 10,
                  borderColor: '#e2e8f0',
                  fontSize: 14,
                }}
              />
            </Form.Item>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <Checkbox>Remember me</Checkbox>
              <a onClick={(e) => { e.preventDefault(); message.info('Contact system administrator for password resets.'); }} style={{ fontSize: 13, color: '#312e81', fontWeight: 500, cursor: 'pointer' }}>
                Forgot password?
              </a>
            </div>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                style={{
                  height: 48,
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(30,27,75,0.35)',
                }}
              >
                Sign In to Portal
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            paddingTop: 16,
            borderTop: '1px solid #f1f5f9',
          }}>
            <Text style={{ fontSize: 11, color: '#64748b' }}>
              Protected by 256-bit encryption | Zimbabwe Tourism Authority
            </Text>
          </div>

          {/* Quick Demo Access */}
          <div style={{ marginTop: 16 }}>
            <Button
              block
              size="large"
              loading={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await new Promise(resolve => setTimeout(resolve, 800)); // fake network delay
                  const mockUser = { id: 'gov-123', email: 'admin@gov.zw', name: 'Gov Admin', fullName: 'Gov Admin', role: 'government' };
                  const mockToken = 'mock-gov-token';
                  setAuth(mockToken, mockUser);
                  localStorage.setItem('zimvisit_gov_token', mockToken);
                  message.success('Demo access granted - Government Portal');
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
            <Text style={{ display: 'block', textAlign: 'center', marginTop: 8, fontSize: 11, color: '#64748b' }}>
              Authorized government personnel only
            </Text>
          </div>
        </div>

        {/* Bottom Badge */}
        <div style={{
          textAlign: 'center',
          marginTop: 24,
          animation: mounted ? 'fadeInUp 0.6s ease-out 0.6s both' : 'none',
        }}>
          <Text style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)' }}>
            Republic of Zimbabwe | Ministry of Environment, Climate, Tourism & Hospitality Industry
          </Text>
        </div>
      </div>
    </div>
  );
};
