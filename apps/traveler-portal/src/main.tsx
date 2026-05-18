// ============================================================
// ZimVisit Traveler Portal - Entry Point
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import App from './App';
import './index.css';

// ---- Ant Design Theme: Forest Green + Zimbabwe Gold ----
const zimVisitTheme = {
  token: {
    // Brand
    colorPrimary: '#166534',
    colorLink: '#166534',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#166534',

    // Typography
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // Colors
    colorBgContainer: '#ffffff',
    colorBgLayout: '#fafafa',
    colorBgElevated: '#ffffff',
    colorText: '#262626',
    colorTextSecondary: '#737373',

    // Border
    borderRadius: 10,
    colorBorder: '#e5e5e5',
    colorBorderSecondary: '#f5f5f5',

    // Spacing
    marginLG: 24,
    paddingLG: 24,

    // Shadows
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    boxShadowSecondary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  },
  components: {
    Button: {
      colorPrimary: '#166534',
      colorPrimaryHover: '#14532d',
      colorPrimaryActive: '#052e16',
      borderRadius: 10,
      controlHeight: 42,
      controlHeightLG: 48,
      controlHeightSM: 34,
      fontWeight: 600,
    },
    Input: {
      controlHeight: 42,
      borderRadius: 10,
      colorBorder: '#d4d4d4',
      activeBorderColor: '#166534',
    },
    Select: {
      controlHeight: 42,
      borderRadius: 10,
    },
    Card: {
      borderRadiusLG: 16,
      boxShadowTertiary: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    Tag: {
      borderRadiusSM: 6,
    },
    Menu: {
      itemSelectedColor: '#166534',
      itemSelectedBg: '#f0fdf4',
    },
    Tabs: {
      inkBarColor: '#166534',
      itemActiveColor: '#166534',
      itemSelectedColor: '#166534',
    },
    Rate: {
      starColor: '#f59e0b',
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={zimVisitTheme}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
