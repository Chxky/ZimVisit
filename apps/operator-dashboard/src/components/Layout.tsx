import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout, Menu, Avatar, Dropdown, Badge, Typography, Space, Button, theme,
} from 'antd';
import {
  DashboardOutlined, CalendarOutlined, ShopOutlined, SafetyOutlined,
  RobotOutlined, TeamOutlined, SettingOutlined, BellOutlined, LogoutOutlined,
  UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { notificationsApi } from '../services/api';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/bookings', icon: <CalendarOutlined />, label: 'Bookings' },
  { key: '/inventory', icon: <ShopOutlined />, label: 'Inventory' },
  { key: '/compliance', icon: <SafetyOutlined />, label: 'Compliance' },
  { key: '/fingerprinting', icon: <RobotOutlined />, label: 'Agent AI' },
  { key: '/staff', icon: <TeamOutlined />, label: 'Staff' },
  { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
];

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

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
      { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Sign Out', danger: true },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') { logout(); navigate('/login'); }
    },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light"
        style={{ borderRight: '1px solid #f0f0f0' }}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Text strong style={{ fontSize: collapsed ? 16 : 20, color: '#166534' }}>
            {collapsed ? 'ZV' : 'ZimVisit'}
          </Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <Space>
            <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </Space>
          <Space size="middle">
            <Badge count={notifCount} size="small">
              <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#166534' }} />
                <Text>{user?.fullName || 'Operator'}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
