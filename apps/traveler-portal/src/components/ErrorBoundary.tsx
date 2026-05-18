// ============================================================
// ZimVisit Traveler Portal - Error Boundary Component
// ============================================================

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Typography, Space } from 'antd';
import { ReloadOutlined, HomeOutlined, BugOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ZimVisit ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            background: '#fafafa',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <BugOutlined style={{ fontSize: 36, color: '#d97706' }} />
            </div>

            <Title level={3} style={{ color: '#171717', marginBottom: 8 }}>
              Something went wrong
            </Title>

            <Paragraph style={{ color: '#525252', fontSize: 15, marginBottom: 32 }}>
              We hit an unexpected bump on your Zimbabwe adventure.
              Don't worry — your data is safe. Try refreshing or head back home.
            </Paragraph>

            {this.state.error && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 8,
                  padding: '12px 16px',
                  marginBottom: 24,
                  textAlign: 'left',
                }}
              >
                <Text code style={{ fontSize: 12, color: '#991b1b', wordBreak: 'break-word' }}>
                  {this.state.error.message}
                </Text>
              </div>
            )}

            <Space size={12}>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleReset}
                style={{
                  background: '#166534',
                  borderColor: '#166534',
                  height: 44,
                  paddingLeft: 24,
                  paddingRight: 24,
                  borderRadius: 8,
                }}
              >
                Try Again
              </Button>
              <Button
                icon={<HomeOutlined />}
                onClick={this.handleGoHome}
                style={{ height: 44, paddingLeft: 24, paddingRight: 24, borderRadius: 8 }}
              >
                Go Home
              </Button>
            </Space>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
