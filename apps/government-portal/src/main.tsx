import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1e1b4b',
            colorSuccess: '#059669',
            colorWarning: '#f59e0b',
            colorError: '#dc2626',
            colorInfo: '#312e81',
            borderRadius: 10,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 14,
            colorBgLayout: '#f8fafc',
            colorBgContainer: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
          },
          components: {
            Card: {
              borderRadiusLG: 12,
              paddingLG: 20,
            },
            Table: {
              borderRadius: 12,
              headerBg: '#f1f5f9',
            },
            Button: {
              borderRadius: 8,
              controlHeight: 40,
            },
            Input: {
              borderRadius: 8,
              controlHeight: 40,
            },
            Menu: {
              darkItemBg: 'transparent',
              darkSubMenuItemBg: 'transparent',
              darkItemSelectedBg: 'rgba(217,119,6,0.15)',
              darkItemSelectedColor: '#d97706',
              darkItemHoverBg: 'rgba(255,255,255,0.06)',
              itemBorderRadius: 8,
              iconSize: 18,
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
