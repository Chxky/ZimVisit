import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, Table, Tag, Typography, Progress, Spin,
  Button, Space, Alert, Divider, InputNumber, Descriptions, Badge, Tabs,
} from 'antd';
import {
  SafetyOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined,
  DollarOutlined, BankOutlined, FileTextOutlined, InfoCircleOutlined,
  CalculatorOutlined, ReloadOutlined, DownloadOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined, LinkOutlined, ThunderboltOutlined,
} from '@ant-design/icons';
import { complianceApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
const { Title, Text } = Typography;

export const Compliance: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [levyAmount, setLevyAmount] = useState<number>(1000);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await complianceApi.getOperatorCompliance(user?.operatorId || '');
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  // Levy calculator
  const tourismLevy = levyAmount * 0.02;
  const vat = levyAmount * 0.15;
  const bspFee = levyAmount * 0.015;
  const totalDeductions = tourismLevy + vat + bspFee;
  const netAmount = levyAmount - totalDeductions;

  const complianceRate = data?.complianceRate || 87;
  const complianceColor = complianceRate >= 80 ? '#059669' : complianceRate >= 60 ? '#f59e0b' : '#dc2626';

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      render: (v: string) => (
        <Text copyable style={{ fontFamily: 'monospace', fontSize: 12 }}>{v?.slice(0, 8)}...</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const colors: Record<string, string> = {
          compliant: 'green', non_compliant: 'red', pending_review: 'orange', flagged: 'red',
        };
        const icons: Record<string, React.ReactNode> = {
          compliant: <CheckCircleOutlined />,
          non_compliant: <CloseCircleOutlined />,
          pending_review: <ClockCircleOutlined />,
          flagged: <ExclamationCircleOutlined />,
        };
        return (
          <Tag color={colors[s] || 'default'} icon={icons[s]}>
            {s?.replace('_', ' ').toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Levy',
      dataIndex: 'levyAmount',
      key: 'levy',
      render: (v: number) => (
        <Text style={{ fontVariantNumeric: 'tabular-nums' }}>${Number(v).toFixed(2)}</Text>
      ),
    },
    {
      title: 'VAT',
      dataIndex: 'vatAmount',
      key: 'vat',
      render: (v: number) => (
        <Text style={{ fontVariantNumeric: 'tabular-nums' }}>${Number(v).toFixed(2)}</Text>
      ),
    },
    {
      title: 'BSP Fee',
      dataIndex: 'bspFee',
      key: 'bspFee',
      render: (v: number) => (
        <Text style={{ fontVariantNumeric: 'tabular-nums' }}>${Number(v).toFixed(2)}</Text>
      ),
    },
    {
      title: 'BSP Routed',
      dataIndex: 'bspRouted',
      key: 'bsp',
      render: (v: boolean) => (
        <Badge
          status={v ? 'success' : 'error'}
          text={v ? 'Routed' : 'Pending'}
        />
      ),
    },
    {
      title: 'BSP Ref',
      dataIndex: 'bspReference',
      key: 'bspRef',
      render: (v: string) => v ? (
        <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</Text>
      ) : <Text type="secondary">--</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (d: string) => (
        <Text type="secondary">{new Date(d).toLocaleDateString()}</Text>
      ),
    },
  ];

  const remittanceHistory = [
    { id: 1, period: 'May 2026', amount: 12450, status: 'completed', date: '2026-05-01' },
    { id: 2, period: 'Apr 2026', amount: 11280, status: 'completed', date: '2026-04-01' },
    { id: 3, period: 'Mar 2026', amount: 10890, status: 'completed', date: '2026-03-01' },
    { id: 4, period: 'Feb 2026', amount: 9870, status: 'completed', date: '2026-02-01' },
  ];

  const remittanceColumns = [
    { title: 'Period', dataIndex: 'period', key: 'period', render: (v: string) => <Text strong>{v}</Text> },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (v: number) => <Text style={{ fontWeight: 700, color: '#166534' }}>${v.toLocaleString()}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => <Badge status={v === 'completed' ? 'success' : 'processing'} text={v.toUpperCase()} />,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (v: string) => <Text type="secondary">{new Date(v).toLocaleDateString()}</Text>,
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              <SafetyOutlined style={{ marginRight: 8, color: '#166534' }} />
              Compliance Center
            </Title>
            <Text type="secondary">BSP compliance monitoring, levy management, and remittance tracking</Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>Refresh</Button>
            <Button icon={<DownloadOutlined />}>Export Report</Button>
          </Space>
        </div>
      </div>

      {/* Compliance Score Banner */}
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          marginBottom: 24,
          background: `linear-gradient(135deg, ${complianceColor}08, ${complianceColor}04)`,
          border: `1px solid ${complianceColor}20`,
        }}
      >
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Space align="start" size={16}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: `${complianceColor}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Progress
                  type="circle"
                  percent={complianceRate}
                  size={48}
                  strokeColor={complianceColor}
                  strokeWidth={10}
                  format={(p) => `${p}%`}
                />
              </div>
              <div>
                <Text style={{ fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Overall Compliance Score
                </Text>
                <Title level={2} style={{ margin: '4px 0 0 0', color: complianceColor }}>
                  {complianceRate}%
                </Title>
                <Text style={{ fontSize: 13, color: '#64748b' }}>
                  {complianceRate >= 80
                    ? 'Excellent standing with Zimbabwe Tourism Authority'
                    : complianceRate >= 60
                    ? 'Good standing - some items need attention'
                    : 'Action required - compliance issues detected'}
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { label: 'Compliant', value: data?.compliant || 0, color: '#059669', icon: <CheckCircleOutlined /> },
                { label: 'Flagged', value: data?.flagged || 0, color: '#dc2626', icon: <WarningOutlined /> },
                { label: 'Pending', value: data?.pending || 0, color: '#f59e0b', icon: <ClockCircleOutlined /> },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${item.color}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    fontSize: 18,
                    margin: '0 auto 6px',
                  }}>
                    {item.icon}
                  </div>
                  <Text style={{ fontSize: 20, fontWeight: 800, color: item.color, display: 'block' }}>
                    {item.value}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {item.label}
                  </Text>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Compliance Tips */}
      {complianceRate < 80 && (
        <Alert
          type="warning"
          showIcon
          message="Compliance Improvement Needed"
          description="Your compliance score is below the recommended 80% threshold. Review flagged bookings and ensure all levies are remitted within 30 days to avoid penalties."
          style={{ marginBottom: 24, borderRadius: 10 }}
          action={
            <Button size="small" type="primary">
              View Action Items
            </Button>
          }
        />
      )}

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Levy Calculator */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 12, height: '100%' }}
            title={
              <Space>
                <CalculatorOutlined style={{ color: '#166534' }} />
                <Text style={{ fontWeight: 700 }}>Levy Calculator</Text>
              </Space>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <Text style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                Booking Amount (USD)
              </Text>
              <InputNumber
                value={levyAmount}
                onChange={(v) => setLevyAmount(v || 0)}
                min={0}
                style={{ width: '100%' }}
                size="large"
                prefix="$"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Tourism Levy (2%)', value: tourismLevy, color: '#059669' },
                { label: 'VAT (15%)', value: vat, color: '#0369a1' },
                { label: 'BSP Fee (1.5%)', value: bspFee, color: '#64748b' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#64748b', fontSize: 13 }}>{item.label}</Text>
                  <Text style={{ fontWeight: 600, color: item.color, fontVariantNumeric: 'tabular-nums' }}>
                    ${item.value.toFixed(2)}
                  </Text>
                </div>
              ))}
              <Divider style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: 600 }}>Total Deductions</Text>
                <Text style={{ fontWeight: 700, color: '#dc2626', fontSize: 15 }}>
                  ${totalDeductions.toFixed(2)}
                </Text>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: 10,
                background: '#f0fdf4',
              }}>
                <Text style={{ fontWeight: 600, color: '#166534' }}>You Receive</Text>
                <Text style={{ fontWeight: 800, color: '#166534', fontSize: 18 }}>
                  ${netAmount.toFixed(2)}
                </Text>
              </div>
            </div>

            {/* Compliance Tip */}
            <div style={{
              marginTop: 20,
              padding: '12px 14px',
              borderRadius: 10,
              background: '#f0fdf4',
              border: '1px solid #d1fae5',
            }}>
              <Space align="start" size={8}>
                <InfoCircleOutlined style={{ color: '#166534', marginTop: 2 }} />
                <Text style={{ fontSize: 12, color: '#166534', lineHeight: 1.6 }}>
                  All levies must be remitted to ZTA within 30 days. Use the BSP routing for automatic compliance.
                </Text>
              </Space>
            </div>
          </Card>
        </Col>

        {/* BSP Connection Status */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 12, height: '100%' }}
            title={
              <Space>
                <BankOutlined style={{ color: '#166534' }} />
                <Text style={{ fontWeight: 700 }}>BSP Connection</Text>
              </Space>
            }
          >
            <div style={{
              padding: '16px',
              borderRadius: 12,
              background: '#f0fdf4',
              border: '1px solid #d1fae5',
              textAlign: 'center',
              marginBottom: 20,
            }}>
              <CheckCircleOutlined style={{ fontSize: 32, color: '#059669', display: 'block', marginBottom: 8 }} />
              <Text style={{ fontWeight: 700, color: '#059669', fontSize: 16, display: 'block' }}>
                Connected & Active
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                BSP routing is operational
              </Text>
            </div>

            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="BSP Reference">
                <Text copyable style={{ fontFamily: 'monospace' }}>BSP-OP-ZIM-001</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Connection Status">
                <Badge status="success" text="Active" />
              </Descriptions.Item>
              <Descriptions.Item label="Last Sync">
                <Text type="secondary">2 minutes ago</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Auto-Route">
                <Badge status="success" text="Enabled" />
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <Space>
                <Button size="small" icon={<ReloadOutlined />}>Sync Now</Button>
                <Button size="small" icon={<LinkOutlined />}>View BSP Portal</Button>
              </Space>
            </div>
          </Card>
        </Col>

        {/* Quick Stats */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 12, height: '100%' }}
            title={
              <Space>
                <ThunderboltOutlined style={{ color: '#f59e0b' }} />
                <Text style={{ fontWeight: 700 }}>This Month</Text>
              </Space>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Total Revenue', value: '$38,200', change: '+12%', color: '#166534', icon: <DollarOutlined /> },
                { label: 'Levy Collected', value: '$764', change: '+8%', color: '#059669', icon: <SafetyOutlined /> },
                { label: 'VAT Processed', value: '$5,730', change: '+11%', color: '#0369a1', icon: <BankOutlined /> },
                { label: 'Remitted', value: '$6,494', change: '100%', color: '#7c3aed', icon: <CheckCircleOutlined /> },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: '#f8fafc',
                }}>
                  <Space size={10}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: `${item.color}12`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <Text style={{ fontSize: 12, color: '#64748b', display: 'block' }}>{item.label}</Text>
                      <Text style={{ fontWeight: 700, fontSize: 15 }}>{item.value}</Text>
                    </div>
                  </Space>
                  <Tag color="green">{item.change}</Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabs for Reports and Remittance */}
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Tabs
          defaultActiveKey="reports"
          items={[
            {
              key: 'reports',
              label: (
                <Space>
                  <FileTextOutlined />
                  Compliance Reports
                  <Badge count={data?.totalReports || 0} style={{ backgroundColor: '#166534' }} />
                </Space>
              ),
              children: (
                <>
                  <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">
                      Showing compliance reports for all bookings
                    </Text>
                    <Space>
                      <Button size="small" icon={<DownloadOutlined />}>Export</Button>
                    </Space>
                  </div>
                  <Table
                    dataSource={data?.recentReports || []}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showTotal: (total) => <Text type="secondary">{total} reports</Text>,
                    }}
                    size="middle"
                  />
                </>
              ),
            },
            {
              key: 'remittance',
              label: (
                <Space>
                  <BankOutlined />
                  Remittance History
                </Space>
              ),
              children: (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <Alert
                      type="info"
                      showIcon
                      message="All remittances are processed on the 1st of each month via BSP routing."
                      style={{ borderRadius: 10 }}
                    />
                  </div>
                  <Table
                    dataSource={remittanceHistory}
                    columns={remittanceColumns}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                  />
                </>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};
