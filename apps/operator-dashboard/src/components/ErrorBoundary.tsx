import { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Typography, Button } from 'antd';

const { Paragraph, Text } = Typography;

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="The application crashed"
          subTitle="An unexpected error occurred in the React component tree."
          extra={[
            <Button type="primary" key="console" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          ]}
        >
          <div className="desc" style={{ textAlign: 'left', background: '#fff1f0', padding: 20, borderRadius: 8 }}>
            <Paragraph>
              <Text strong style={{ fontSize: 16 }}>
                {this.state.error && this.state.error.toString()}
              </Text>
            </Paragraph>
            <Paragraph style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12 }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </Paragraph>
          </div>
        </Result>
      );
    }

    return this.props.children;
  }
}
