// ============================================================
// ZimVisit Traveler Portal - Navbar Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Avatar, Space, Drawer, Menu } from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  BookOutlined,
  QrcodeOutlined,
  ProfileOutlined,
  CompassOutlined,
  LoginOutlined,
  DownOutlined,
  RobotOutlined,
  FundOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuthStore } from '../store/authStore';

// ---- Inline SVG: Zimbabwe Bird (simplified) ----
const ZimbabweBird: React.FC<{ size?: number; color?: string }> = ({
  size = 36,
  color = '#f59e0b',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Bird body */}
    <path
      d="M32 8C24 8 18 14 16 20C14 26 15 32 18 36C14 38 10 42 8 48C10 47 13 46 16 46C18 50 22 54 28 56C30 56 32 56 34 56C40 54 44 50 46 46C49 46 52 47 54 48C52 42 48 38 44 36C47 32 48 26 46 20C44 14 38 8 32 8Z"
      fill={color}
      stroke="#92400e"
      strokeWidth="1.5"
    />
    {/* Head crest */}
    <path
      d="M28 12C28 8 30 4 32 2C34 4 36 8 36 12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Eye */}
    <circle cx="28" cy="22" r="2.5" fill="#92400e" />
    <circle cx="28" cy="22" r="1" fill="#ffffff" />
    {/* Beak */}
    <path
      d="M22 24L16 22L22 26Z"
      fill="#b45309"
      stroke="#92400e"
      strokeWidth="0.5"
    />
    {/* Wing detail */}
    <path
      d="M24 32C28 30 36 30 40 32"
      stroke="#92400e"
      strokeWidth="1"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
    />
    <path
      d="M22 36C27 34 37 34 42 36"
      stroke="#92400e"
      strokeWidth="1"
      strokeLinecap="round"
      fill="none"
      opacity="0.4"
    />
    {/* Tail feathers */}
    <path
      d="M28 52L24 60L28 58L32 62L36 58L40 60L36 52"
      fill={color}
      stroke="#92400e"
      strokeWidth="1"
    />
    {/* Legs */}
    <path
      d="M28 48L26 54M26 54L22 56M26 54L30 56"
      stroke="#92400e"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M36 48L38 54M38 54L34 56M38 54L42 56"
      stroke="#92400e"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Track scroll for background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // User dropdown menu
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: <Link to="/profile">My Profile</Link>,
    },
    {
      key: 'bookings',
      icon: <BookOutlined />,
      label: <Link to="/bookings">My Bookings</Link>,
    },
    {
      key: 'zimpass',
      icon: <QrcodeOutlined />,
      label: <Link to="/zimpass">ZimPass</Link>,
    },
    {
      key: 'impact',
      icon: <FundOutlined />,
      label: <Link to="/impact">Economic Impact</Link>,
    },
    {
      key: 'ai-assistant',
      icon: <RobotOutlined />,
      label: <Link to="/ai-assistant">AI Assistant</Link>,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Mobile nav items
  const mobileMenuItems: MenuProps['items'] = [
    { key: '/', label: <Link to="/">Home</Link> },
    { key: '/explore', label: <Link to="/explore">Explore</Link> },
    ...(isAuthenticated
      ? [
          { key: '/bookings', label: <Link to="/bookings">My Bookings</Link> },
          { key: '/zimpass', label: <Link to="/zimpass">ZimPass</Link> },
          { key: '/impact', label: <Link to="/impact">Economic Impact</Link> },
          { key: '/ai-assistant', label: <Link to="/ai-assistant">AI Assistant</Link> },
          { key: '/profile', label: <Link to="/profile">Profile</Link> },
        ]
      : []),
  ];

  const isHome = location.pathname === '/';
  const navBg = scrolled || !isHome
    ? 'rgba(22, 101, 52, 0.97)'
    : 'transparent';

  return (
    <>
      {/* Government Branding Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1001,
          background: 'linear-gradient(90deg, #052e16 0%, #14532d 50%, #052e16 100%)',
          padding: '4px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          borderBottom: '1px solid rgba(245,158,11,0.4)',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Zimbabwe Tourism Authority
        </span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>|</span>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>
          Ministry of Tourism & Hospitality Industry
        </span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>|</span>
        <span style={{ color: '#22c55e', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          VERIFIED
        </span>
      </div>

      <nav
        style={{
          position: 'fixed',
          top: 28,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: navBg,
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'all 0.3s ease',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: scrolled ? 64 : 72,
            transition: 'height 0.3s ease',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
            }}
          >
            <ZimbabweBird size={scrolled ? 32 : 36} />
            <span
              style={{
                fontSize: scrolled ? 22 : 24,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.5px',
                transition: 'font-size 0.3s ease',
              }}
            >
              Zim
              <span style={{ color: '#f59e0b' }}>Visit</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div
            className="hide-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
            }}
          >
            <Link
              to="/explore"
              style={{
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 500,
                opacity: location.pathname === '/explore' ? 1 : 0.85,
                borderBottom:
                  location.pathname === '/explore'
                    ? '2px solid #f59e0b'
                    : '2px solid transparent',
                paddingBottom: 2,
                transition: 'all 0.2s ease',
              }}
            >
              <CompassOutlined style={{ marginRight: 6 }} />
              Explore
            </Link>
            <a
              href="#destinations"
              style={{
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 500,
                opacity: 0.85,
              }}
            >
              Destinations
            </a>
            <a
              href="#how-it-works"
              style={{
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 500,
                opacity: 0.85,
              }}
            >
              How It Works
            </a>
          </div>

          {/* Desktop Right Section */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isAuthenticated && user ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                <Space
                  style={{
                    cursor: 'pointer',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: 8,
                    transition: 'background 0.2s',
                  }}
                  className="nav-user-dropdown"
                >
                  <Avatar
                    size={34}
                    src={user.avatar}
                    icon={<UserOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      border: '2px solid rgba(255,255,255,0.3)',
                    }}
                  />
                  <span style={{ fontWeight: 500, fontSize: 14 }}>
                    {user.fullName?.split(' ')[0]}
                  </span>
                  <DownOutlined style={{ fontSize: 10 }} />
                </Space>
              </Dropdown>
            ) : (
              <>
                <Button
                  type="text"
                  onClick={() => navigate('/login')}
                  style={{
                    color: '#ffffff',
                    fontWeight: 500,
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: 8,
                  }}
                  icon={<LoginOutlined />}
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  style={{
                    background: '#f59e0b',
                    borderColor: '#f59e0b',
                    color: '#ffffff',
                    fontWeight: 600,
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <Button
            className="hide-desktop"
            type="text"
            icon={<MenuOutlined style={{ fontSize: 22, color: '#ffffff' }} />}
            onClick={() => setMobileOpen(true)}
            style={{ border: 'none' }}
          />
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ZimbabweBird size={28} />
            <span style={{ fontSize: 20, fontWeight: 700 }}>
              Zim<span style={{ color: '#f59e0b' }}>Visit</span>
            </span>
          </div>
        }
        placement="right"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        width={280}
        styles={{
          header: {
            background: '#166534',
            color: '#ffffff',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          },
          body: { padding: 0 },
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={mobileMenuItems}
          style={{ border: 'none', padding: '8px 0' }}
        />
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
          {isAuthenticated && user ? (
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 0',
                }}
              >
                <Avatar
                  size={40}
                  src={user.avatar}
                  icon={<UserOutlined />}
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>{user.fullName}</div>
                  <div style={{ fontSize: 12, color: '#737373' }}>{user.email}</div>
                </div>
              </div>
              <Button
                block
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </Space>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <Button
                block
                onClick={() => navigate('/login')}
                icon={<LoginOutlined />}
              >
                Login
              </Button>
              <Button
                block
                type="primary"
                onClick={() => navigate('/register')}
                style={{ background: '#f59e0b', borderColor: '#f59e0b' }}
              >
                Register
              </Button>
            </Space>
          )}
        </div>
      </Drawer>

      {/* Spacer for fixed navbar */}
      <div style={{ height: 72 }} />
    </>
  );
};

export default Navbar;
