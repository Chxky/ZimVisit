import React from 'react';
import { Button, Typography, Space } from 'antd';
import { ReloadOutlined, HomeOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorId: string;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorId: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `GOV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    return { hasError: true, errorId, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[ErrorBoundary ${this.state.errorId}]`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorId: '', error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #302b63 100%)',
            padding: 24,
          }}
        >
          <div
            style={{
              maxWidth: 480,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 16,
              padding: '48px 40px',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Government Seal */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  border: '2px solid rgba(245,158,11,0.4)',
                }}
              >
                <SafetyCertificateOutlined style={{ fontSize: 32, color: '#f59e0b' }} />
              </div>
              <Title level={3} style={{ color: '#f8fafc', marginBottom: 4, fontWeight: 800 }}>
                System Error Detected
              </Title>
              <Text style={{ color: '#94a3b8', fontSize: 14 }}>
                Republic of Zimbabwe &mdash; Tourism Authority System
              </Text>
            </div>

            {/* Error Details */}
            <div
              style={{
                background: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.2)',
                borderRadius: 10,
                padding: '12px 16px',
                marginBottom: 24,
              }}
            >
              <Text style={{ color: '#fca5a5', fontSize: 12, fontFamily: "'Inter', monospace" }}>
                Error Reference: {this.state.errorId}
              </Text>
              <br />
              <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 4, display: 'block' }}>
                This incident has been logged. Please reference this ID when contacting technical support.
              </Text>
            </div>

            {/* Actions */}
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleReset}
                block
                size="large"
                style={{ height: 44, fontWeight: 600 }}
              >
                Try Again
              </Button>
              <Button
                icon={<HomeOutlined />}
                onClick={() => { window.location.href = '/'; }}
                block
                size="large"
                style={{
                  height: 44,
                  fontWeight: 600,
                  background: 'rgba(255,255,255,0.06)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#e2e8f0',
                }}
              >
                Return to Dashboard
              </Button>
            </Space>

            {/* Footer */}
            <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <Text style={{ color: '#475569', fontSize: 11 }}>
                ZimVisit Government Portal v2.4.1 &bull; 256-bit Encrypted
              </Text>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
