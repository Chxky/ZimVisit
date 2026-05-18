import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import App from './App';
import './index.css';

const { defaultAlgorithm } = theme;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          algorithm: defaultAlgorithm,
          token: {
            colorPrimary: '#166534',
            colorSuccess: '#059669',
            colorWarning: '#f59e0b',
            colorError: '#dc2626',
            colorInfo: '#0369a1',
            borderRadius: 10,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            colorBgLayout: '#f8fafc',
            colorBgContainer: '#ffffff',
            colorBgElevated: '#ffffff',
            controlHeight: 40,
            fontSize: 14,
            colorBorder: '#e2e8f0',
            colorBorderSecondary: '#f1f5f9',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
            boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
          },
          components: {
            Button: {
              primaryShadow: '0 2px 4px rgba(22, 101, 52, 0.2)',
              borderRadius: 8,
            },
            Card: {
              borderRadiusLG: 12,
              paddingLG: 24,
            },
            Table: {
              borderRadius: 12,
              headerBg: '#f8fafc',
            },
            Menu: {
              itemBorderRadius: 8,
              subMenuItemBorderRadius: 8,
              itemMarginInline: 8,
              itemHeight: 44,
            },
            Input: {
              borderRadius: 8,
            },
            Select: {
              borderRadius: 8,
            },
            Tag: {
              borderRadiusSM: 6,
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
