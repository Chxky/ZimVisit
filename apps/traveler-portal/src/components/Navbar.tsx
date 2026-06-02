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
  SafetyCertificateOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuthStore } from '../store/authStore';
import { showHowItWorksModal } from '../utils/modals';

// ---- Official Logo Component ----
const ZimbabweBird: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#052e16',
    border: '2px solid #f59e0b',
    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
  }}>
    <img src="/zim-bird-logo.png" alt="Zimbabwe Bird" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
  </div>
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

  // Language Menu
  const languageMenuItems: MenuProps['items'] = [
    { key: 'en', label: 'English (UK)' },
    { key: 'fr', label: 'Français' },
    { key: 'es', label: 'Español' },
    { key: 'zh', label: '中文 (Mandarin)' },
    { key: 'sn', label: 'Shona' },
    { key: 'nd', label: 'Ndebele' },
  ].map(lang => ({
    ...lang,
    onClick: () => {
      import('antd').then(({ message }) => {
        message.success(`Translating portal to ${lang.label}...`);
      });
    }
  }));

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
          background: '#052e16',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          borderBottom: '3px solid #d97706',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(217, 119, 6, 0.4)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 64 64" fill="none">
              <path d="M32 8C24 8 18 14 16 20C14 26 15 32 18 36C14 38 10 42 8 48C10 47 13 46 16 46C18 50 22 54 28 56C30 56 32 56 34 56C40 54 44 50 46 46C49 46 52 47 54 48C52 42 48 38 44 36C47 32 48 26 46 20C44 14 38 8 32 8Z" fill="#052e16"/>
            </svg>
          </div>
          <span style={{ color: '#ffffff', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
            Zimbabwe Tourism Authority
          </span>
        </div>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />
        <span style={{ color: '#e5e5e5', fontSize: 11, letterSpacing: 0.5, fontWeight: 500 }}>
          Ministry of Tourism & Hospitality Industry
        </span>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SafetyCertificateOutlined style={{ color: '#d97706', fontSize: 14 }} />
          <span style={{ color: '#d97706', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>OFFICIAL PLATFORM</span>
        </div>
      </div>

      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 40, /* adjusted for taller branding bar */
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? 'rgba(22, 101, 52, 0.85)' : navBg,
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
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
              aria-current={location.pathname === '/explore' ? 'page' : undefined}
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
            <Link
              to="/#destinations"
              onClick={(e) => {
                // If on landing page, let browser handle the hash
                if (location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/#destinations');
                }
              }}
              style={{
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 500,
                opacity: 0.85,
              }}
            >
              Destinations
            </Link>
            <a
              onClick={(e) => {
                e.preventDefault();
                showHowItWorksModal();
              }}
              style={{
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 500,
                opacity: 0.85,
                cursor: 'pointer'
              }}
            >
              How It Works
            </a>
          </div>

          {/* Desktop Right Section & Translator */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Majestic ZimPass Button */}
            <div
              className="zimpass-majestic-btn"
              onClick={() => navigate('/zimpass')}
              style={{
                height: 48,
                padding: '0 20px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: '2px solid #fcd34d',
                borderRadius: 24,
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.6)';
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.1) rotate(5deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.4)';
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1) rotate(0deg)';
              }}
            >
              <img 
                src="/golden-lion-qr.png" 
                alt="ZimPass Lion" 
                style={{ 
                  width: 32, 
                  height: 32, 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  transition: 'transform 0.3s ease',
                }} 
              />
              Get ZimPass
            </div>

            {/* Native Language Dropdown */}
            <Dropdown menu={{ items: languageMenuItems }} placement="bottomRight" trigger={['click']}>
              <Button 
                type="text" 
                icon={<GlobalOutlined />} 
                style={{ 
                  color: '#ffffff', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 8
                }}
              >
                English
              </Button>
            </Dropdown>

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
