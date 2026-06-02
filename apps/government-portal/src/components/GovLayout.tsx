import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout, Menu, Avatar, Dropdown, Typography, Space, Button, Badge, Divider, Modal, message,
} from 'antd';
import {
  DashboardOutlined, TeamOutlined, DollarOutlined, SafetyOutlined,
  BarChartOutlined, LogoutOutlined, UserOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined,
  SettingOutlined, SafetyCertificateOutlined,
  WarningOutlined, LockOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

import LiveAuditDemo from './LiveAuditDemo';

const { Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined style={{ fontSize: 18 }} />,
    label: 'National Dashboard',
  },
  {
    key: '/operators',
    icon: <TeamOutlined style={{ fontSize: 18 }} />,
    label: 'Operator Registry',
  },
  {
    key: '/compliance-grid',
    icon: <SafetyOutlined style={{ fontSize: 18 }} />,
    label: 'Compliance Grid',
  },
  {
    key: '/revenue',
    icon: <DollarOutlined style={{ fontSize: 18 }} />,
    label: 'Revenue Analytics',
  },
  {
    key: '/risk-forecast',
    icon: <BarChartOutlined style={{ fontSize: 18 }} />,
    label: 'Risk Forecaster',
  },
];

const LiveClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      lineHeight: 1.2,
    }}>
      <Text style={{
        fontSize: 16,
        fontWeight: 700,
        color: '#1e1b4b',
        fontFamily: "'Inter', monospace",
        letterSpacing: '0.5px',
      }}>
        {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </Text>
      <Text style={{
        fontSize: 11,
        color: '#64748b',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {time.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
      </Text>
    </div>
  );
};

export const GovLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');
  const [sessionCountdown, setSessionCountdown] = useState(300); // 5 minutes
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Connection Status Polling ──────────────────────────────
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch('/health', { signal: AbortSignal.timeout(5000) });
        setConnectionStatus(res.ok ? 'connected' : 'disconnected');
      } catch {
        setConnectionStatus('disconnected');
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Session Timeout (25 min inactivity → 5 min warning) ──
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    setSessionWarning(false);
    setSessionCountdown(300);
    inactivityTimer.current = setTimeout(() => {
      setSessionWarning(true);
      setSessionCountdown(300);
      countdownTimer.current = setInterval(() => {
        setSessionCountdown((prev) => {
          if (prev <= 1) {
            if (countdownTimer.current) clearInterval(countdownTimer.current);
            logout();
            navigate('/login');
            message.error('Session expired due to inactivity');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 25 * 60 * 1000); // 25 minutes
  }, [logout, navigate]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handler = () => resetInactivityTimer();
    events.forEach((e) => document.addEventListener(e, handler));
    resetInactivityTimer();
    return () => {
      events.forEach((e) => document.removeEventListener(e, handler));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  }, [resetInactivityTimer]);

  const handleContinueSession = () => {
    resetInactivityTimer();
    message.success('Session extended');
  };

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile',
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Settings',
      },
      { type: 'divider' as const },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Sign Out',
        danger: true,
      },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') {
        logout();
        navigate('/login');
      }
    },
  };

  const notificationMenu = {
    items: [
      {
        key: '1',
        label: (
          <div style={{ maxWidth: 280 }}>
            <Text strong style={{ fontSize: 12, color: '#dc2626' }}>Critical Alert</Text>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
              Mana Pools Expeditions flagged for immediate audit
            </div>
            <Text style={{ fontSize: 11, color: '#64748b' }}>2 minutes ago</Text>
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div style={{ maxWidth: 280 }}>
            <Text strong style={{ fontSize: 12, color: '#f59e0b' }}>Compliance Warning</Text>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
              3 operators approaching amber threshold
            </div>
            <Text style={{ fontSize: 11, color: '#64748b' }}>15 minutes ago</Text>
          </div>
        ),
      },
      {
        key: '3',
        label: (
          <div style={{ maxWidth: 280 }}>
            <Text strong style={{ fontSize: 12, color: '#059669' }}>Revenue Milestone</Text>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
              Daily revenue exceeded $50,000 target
            </div>
            <Text style={{ fontSize: 11, color: '#64748b' }}>1 hour ago</Text>
          </div>
        ),
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <div className="watermark-bg" />
      {/* Skip to Content - Accessibility */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          top: -100,
          left: 16,
          zIndex: 9999,
          padding: '10px 20px',
          background: '#1e1b4b',
          color: '#f8fafc',
          borderRadius: '0 0 8px 8px',
          fontWeight: 600,
          fontSize: 13,
          textDecoration: 'none',
          transition: 'top 0.2s ease',
        }}
        onFocus={(e) => { (e.target as HTMLElement).style.top = '0'; }}
        onBlur={(e) => { (e.target as HTMLElement).style.top = '-100px'; }}
      >
        Skip to main content
      </a>

      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        collapsedWidth={80}
        className="sidebar-gradient"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflow: 'auto',
        }}
      >
        {/* Logo */}
        <div className="sidebar-logo" onClick={() => navigate('/')}>
          <img src="/zim-bird-logo.png" alt="ZimVisit Logo" style={{ width: collapsed ? 36 : 48, height: collapsed ? 36 : 48, objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="logo-text">ZimVisit</span>
              <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Government Oversight Portal
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: 'transparent',
            borderRight: 0,
            marginTop: 8,
            padding: '0 4px',
          }}
        />

        {/* Sidebar Footer */}
        {!collapsed && (
          <div className="sidebar-footer">
            {/* Data Classification */}
            <div style={{
              padding: '6px 12px',
              background: 'rgba(220,38,38,0.12)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: 6,
              marginBottom: 12,
              textAlign: 'center',
            }}>
              <Text style={{ fontSize: 10, color: '#fca5a5', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                OFFICIAL — SENSITIVE
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <SafetyCertificateOutlined style={{ color: '#d97706', fontSize: 14 }} />
              <Text style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>
                ZTA Authorized Access
              </Text>
            </div>
            
            {/* Cyber Security Act Banner */}
            <div style={{
              background: '#052e16',
              border: '1px solid #166534',
              borderRadius: 6,
              padding: '10px 8px',
              textAlign: 'center',
              marginTop: 12,
              marginBottom: 8
            }}>
              <LockOutlined style={{ color: '#22c55e', fontSize: 14, marginBottom: 4 }} />
              <Text style={{ fontSize: 9, color: '#22c55e', fontWeight: 700, display: 'block', lineHeight: 1.2 }}>
                SECURED UNDER ZIMBABWE CYBER & DATA PROTECTION ACT [CH 11:22]
              </Text>
              <Text style={{ fontSize: 8, color: '#a7f3d0', display: 'block', marginTop: 4 }}>
                AES-256 ENCRYPTION ACTIVE
              </Text>
            </div>

            <div style={{ fontSize: 10, color: '#475569' }}>
              System v2.4.1 | Encrypted
            </div>
          </div>
        )}
      </Sider>

      {/* Main Content */}
      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'margin-left 0.2s' }}>
        {/* Header */}
        <header className="gov-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 18, color: '#475569' }}
            />

            {/* Zimbabwe Flag Accent */}
            <div style={{
              display: 'flex',
              height: 28,
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <div style={{ width: 8, background: '#de2010' }} />
              <div style={{ width: 8, background: '#ffd200' }} />
              <div style={{ width: 8, background: '#009739' }} />
              <div style={{ width: 8, background: '#000000' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <Text style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b' }}>
                Republic of Zimbabwe
              </Text>
              <Text style={{ fontSize: 10, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tourism Authority Oversight
              </Text>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Connection Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: connectionStatus === 'connected' ? '#22c55e' : '#ef4444',
                boxShadow: connectionStatus === 'connected' ? '0 0 6px rgba(34,197,94,0.5)' : '0 0 6px rgba(239,68,68,0.5)',
                transition: 'all 0.3s',
              }} />
              <Text style={{ fontSize: 11, color: connectionStatus === 'connected' ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </Text>
            </div>

            <Divider type="vertical" style={{ height: 32, borderColor: '#e2e8f0' }} />

            <LiveClock />

            <Divider type="vertical" style={{ height: 32, borderColor: '#e2e8f0' }} />

            {/* Notifications */}
            <Dropdown menu={notificationMenu} placement="bottomRight" trigger={['click']}>
              <Badge count={3} size="small" offset={[-2, 4]}>
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  style={{ fontSize: 18, color: '#475569' }}
                />
              </Badge>
            </Dropdown>

            {/* User Menu */}
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'background 0.2s' }}>
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                    fontSize: 14,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <Text style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                    {user?.fullName || 'Government Official'}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#64748b' }}>
                    {user?.role || 'Administrator'}
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </div>
        </header>

        {/* Page Content */}
        <Content id="main-content" tabIndex={-1} style={{
          margin: 24,
          minHeight: 'calc(100vh - 64px - 48px)',
        }}>
          <div className="page-enter">
            <Outlet />
          </div>
        </Content>
      </Layout>
      <LiveAuditDemo portalName="Government Oversight Portal" />

      {/* Session Timeout Warning Modal */}
      <Modal
        open={sessionWarning}
        title={
          <Space>
            <WarningOutlined style={{ color: '#f59e0b' }} />
            <span>Session Expiring</span>
          </Space>
        }
        centered
        closable={false}
        maskClosable={false}
        footer={[
          <Button key="logout" danger onClick={() => { logout(); navigate('/login'); }}>
            Sign Out
          </Button>,
          <Button key="continue" type="primary" onClick={handleContinueSession}>
            Continue Session
          </Button>,
        ]}
        styles={{ body: { textAlign: 'center', padding: '24px 16px' } }}
      >
        <div style={{ fontSize: 48, fontWeight: 800, color: '#f59e0b', fontFamily: "'Inter', monospace" }}>
          {formatCountdown(sessionCountdown)}
        </div>
        <Text style={{ fontSize: 14, color: '#64748b', display: 'block', marginTop: 8 }}>
          Your session will expire due to inactivity.
          <br />
          Click "Continue Session" to stay signed in.
        </Text>
      </Modal>
    </Layout>
  );
};
