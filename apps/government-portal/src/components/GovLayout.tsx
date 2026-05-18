import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout, Menu, Avatar, Dropdown, Typography, Space, Button, Badge, Divider,
} from 'antd';
import {
  DashboardOutlined, TeamOutlined, DollarOutlined, SafetyOutlined,
  BarChartOutlined, LogoutOutlined, UserOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined,
  SettingOutlined, SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

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
        color: '#94a3b8',
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
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

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
            <Text style={{ fontSize: 11, color: '#94a3b8' }}>2 minutes ago</Text>
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
            <Text style={{ fontSize: 11, color: '#94a3b8' }}>15 minutes ago</Text>
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
            <Text style={{ fontSize: 11, color: '#94a3b8' }}>1 hour ago</Text>
          </div>
        ),
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
          <img src="/logo.svg" alt="ZimVisit" />
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="logo-text">ZimVisit</span>
              <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Government Portal
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <SafetyCertificateOutlined style={{ color: '#f59e0b', fontSize: 14 }} />
              <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                ZTA Authorized Access
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
              <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tourism Authority Oversight
              </Text>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
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
                  <Text style={{ fontSize: 10, color: '#94a3b8' }}>
                    {user?.role || 'Administrator'}
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </div>
        </header>

        {/* Page Content */}
        <Content style={{
          margin: 24,
          minHeight: 'calc(100vh - 64px - 48px)',
        }}>
          <div className="page-enter">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
