import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout, Menu, Avatar, Dropdown, Badge, Typography, Space, Button, Tooltip, Divider,
} from 'antd';
import {
  DashboardOutlined, CalendarOutlined, ShopOutlined, SafetyOutlined,
  RobotOutlined, TeamOutlined, SettingOutlined, BellOutlined, LogoutOutlined,
  UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined,
  QuestionCircleOutlined, GlobalOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { notificationsApi } from '../services/api';
import LiveAuditDemo from './LiveAuditDemo';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

const menuItems = [
  {
    key: 'section-main',
    type: 'group' as const,
    label: '',
    children: [
      { key: '/', icon: <DashboardOutlined style={{ fontSize: 18 }} />, label: 'Dashboard' },
      { key: '/bookings', icon: <CalendarOutlined style={{ fontSize: 18 }} />, label: 'Bookings' },
      { key: '/inventory', icon: <ShopOutlined style={{ fontSize: 18 }} />, label: 'Inventory' },
    ],
  },
  {
    key: 'section-ops',
    type: 'group' as const,
    label: 'OPERATIONS',
    children: [
      { key: '/compliance', icon: <SafetyOutlined style={{ fontSize: 18 }} />, label: 'Compliance' },
      { key: '/fingerprinting', icon: <RobotOutlined style={{ fontSize: 18 }} />, label: 'Agent AI' },
    ],
  },
  {
    key: 'section-admin',
    type: 'group' as const,
    label: 'ADMINISTRATION',
    children: [
      { key: '/staff', icon: <TeamOutlined style={{ fontSize: 18 }} />, label: 'Staff' },
      { key: '/settings', icon: <SettingOutlined style={{ fontSize: 18 }} />, label: 'Settings' },
    ],
  },
];

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res: any = await notificationsApi.unreadCount();
        setNotifCount(res.count);
      } catch { /* ignore */ }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const userMenu = {
    items: [
      { key: 'profile-header', label: <div style={{ padding: '4px 0' }}>
        <Text strong style={{ display: 'block' }}>{user?.fullName || 'Operator'}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>{user?.email || 'operator@zimvisit.co.zw'}</Text>
      </div>, disabled: true },
      { type: 'divider' as const },
      { key: 'profile', icon: <UserOutlined />, label: 'My Profile' },
      { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
      { type: 'divider' as const },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Sign Out', danger: true },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') {
        logout();
        navigate('/login');
      }
      if (key === 'settings') {
        navigate('/settings');
      }
    },
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      '/': 'Command Center',
      '/bookings': 'Bookings',
      '/inventory': 'Inventory',
      '/compliance': 'Compliance Center',
      '/fingerprinting': 'Agent AI',
      '/staff': 'Staff',
      '/settings': 'Settings',
    };
    const basePath = '/' + location.pathname.split('/').filter(Boolean).slice(0, 1).join('/');
    return titles[basePath] || titles['/'] || 'Dashboard';
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      {/* Skip to Content - Accessibility */}
      <a
        href="#main-content"
        className="skip-to-content"
      >
        Skip to main content
      </a>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        collapsedWidth={72}
        theme="light"
        className="glass-card"
        style={{
          borderRight: '1px solid #e2e8f0',
          background: '#ffffff',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflow: 'auto',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Logo Area */}
        <div style={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 20px',
          borderBottom: '1px solid #f1f5f9',
          gap: 12,
          transition: 'all 0.2s ease',
        }}>
          <img
            src="/zim-bird-logo.png"
            alt="ZimVisit Logo"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '2px solid #166534',
              flexShrink: 0,
            }}
          />
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <Title level={5} style={{ margin: 0, color: '#4ade80', fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px', textShadow: '0 0 10px rgba(74, 222, 128, 0.5)' }}>
                ZimVisit
              </Title>
              <Text style={{ fontSize: 11, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Operator Portal
              </Text>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div style={{ padding: '12px 0', flex: 1 }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{
              borderRight: 0,
              background: 'transparent',
            }}
          />
        </div>

        {/* Zimbabwe Flag Accent & Cyber Act */}
        {!collapsed && (
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: 12,
            right: 12,
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              borderRadius: 10,
              padding: '12px',
              border: '1px solid #d1fae5',
            }}>
              <Space size={8} align="start">
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #166534, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <GlobalOutlined style={{ color: '#fff', fontSize: 14 }} />
                </div>
                <div>
                  <Text style={{ fontSize: 12, fontWeight: 600, color: '#166534', display: 'block' }}>
                    Zimbabwe Tourism
                  </Text>
                  <Text style={{ fontSize: 10, color: '#6b7280' }}>
                    Compliant & Verified
                  </Text>
                </div>
              </Space>

              {/* Cyber Security Act Banner */}
              <div style={{
                background: '#052e16',
                border: '1px solid #166534',
                borderRadius: 6,
                padding: '8px 6px',
                textAlign: 'center',
                marginTop: 12,
              }}>
                <SafetyOutlined style={{ color: '#22c55e', fontSize: 12, marginBottom: 2 }} />
                <Text style={{ fontSize: 8, color: '#22c55e', fontWeight: 700, display: 'block', lineHeight: 1.2 }}>
                  CYBER & DATA PROTECTION ACT [CH 11:22]
                </Text>
                <Text style={{ fontSize: 7, color: '#a7f3d0', display: 'block', marginTop: 2 }}>
                  AES-256 ENCRYPTION
                </Text>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed state: Zimbabwe green dot */}
        {collapsed && (
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #166534, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <GlobalOutlined style={{ color: '#fff', fontSize: 14 }} />
            </div>
          </div>
        )}
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 72 : 260, transition: 'margin-left 0.2s ease' }}>
        {/* Header */}
        <Header role="banner" className="glass-card" style={{
          padding: '0 28px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          height: 64,
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(20px)',
          borderRadius: 0,
        }}>
          <Space align="center" size={16}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, color: '#1e293b', width: 36, height: 36 }}
            />
            <div>
              <Title level={5} style={{ margin: 0, color: '#1e293b', fontSize: 16, fontWeight: 700, textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                {getPageTitle()}
              </Title>
            </div>
          </Space>

          <Space size={8} align="center">
            {/* Zimbabwe flag accent */}
            <div style={{
              display: 'flex',
              height: 20,
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{ width: 7, background: '#009639' }} />
              <div style={{ width: 7, background: '#FFD200' }} />
              <div style={{ width: 7, background: '#DC2626' }} />
              <div style={{ width: 7, background: '#000' }} />
            </div>

            <Tooltip title="Help & Support">
              <Button
                type="text"
                icon={<QuestionCircleOutlined />}
                style={{ color: '#64748b', width: 36, height: 36 }}
              />
            </Tooltip>

            <Badge count={notifCount} size="small" offset={[-4, 4]}>
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ color: '#64748b', width: 36, height: 36 }}
              />
            </Badge>

            <Divider type="vertical" style={{ height: 24, margin: '0 4px' }} />

            <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'background 0.15s' }}
                className="hover:bg-gray-50"
              >
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #166534, #059669)',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {user?.fullName?.[0]?.toUpperCase() || 'O'}
                </Avatar>
                <div style={{ lineHeight: 1.3 }}>
                  <Text style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', display: 'block' }}>
                    {user?.fullName?.split(' ')[0] || 'Operator'}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b', display: 'block' }}>
                    {user?.role || 'Admin'}
                  </Text>
                </div>
                <DownOutlined style={{ fontSize: 10, color: '#64748b' }} />
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Main Content */}
        <Content id="main-content" role="main" tabIndex={-1} style={{
          margin: 24,
          minHeight: 280,
          outline: 'none',
        }}>
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </Content>
      </Layout>
      <LiveAuditDemo portalName="Operator Data Center" />
    </Layout>
  );
};
