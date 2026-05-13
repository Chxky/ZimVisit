import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout, Menu, Avatar, Dropdown, Typography, Space, Button, theme, Tag,
} from 'antd';
import {
  DashboardOutlined, TeamOutlined, DollarOutlined, SafetyOutlined,
  BarChartOutlined, SettingOutlined, LogoutOutlined, UserOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, BankOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'National Dashboard' },
  { key: '/operators', icon: <TeamOutlined />, label: 'Operators' },
  { key: '/compliance-grid', icon: <SafetyOutlined />, label: 'Compliance Grid' },
  { key: '/revenue', icon: <DollarOutlined />, label: 'Revenue Analytics' },
  { key: '/risk-forecast', icon: <BarChartOutlined />, label: 'Risk Forecaster' },
];

export const GovLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Sign Out', danger: true },
    ],
    onClick: ({ key }: { key: string }) => { if (key === 'logout') { logout(); navigate('/login'); } },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}
        style={{ background: '#0f172a' }}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1e293b' }}>
          <BankOutlined style={{ fontSize: 24, color: '#3b82f6', marginRight: collapsed ? 0 : 8 }} />
          {!collapsed && <Text strong style={{ fontSize: 18, color: '#f8fafc' }}>ZimVisit</Text>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Space>
            <Tag color="blue" icon={<SafetyOutlined />}>ZTA Oversight</Tag>
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1e3a5f' }} />
                <Text>{user?.fullName || 'Official'}</Text>
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
