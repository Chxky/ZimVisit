import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Descriptions, Card, Tag, Table, Typography, Spin, Row, Col, Image,
  Button, Space, Steps, Badge, Divider, Progress, Alert,
} from 'antd';
import {
  ArrowLeftOutlined, CheckCircleOutlined, ClockCircleOutlined,
  SafetyOutlined, DollarOutlined, CalendarOutlined,
  QrcodeOutlined, DownloadOutlined, PrinterOutlined, ExclamationCircleOutlined,
  FileTextOutlined, TeamOutlined,
} from '@ant-design/icons';
import { bookingsApi } from '../services/api';
import { Booking } from '../types';

const { Title, Text, Paragraph } = Typography;

export const BookingDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    bookingsApi.getById(id).then((res: any) => setBooking(res))
      .catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <ExclamationCircleOutlined style={{ fontSize: 48, color: '#dc2626', marginBottom: 16 }} />
        <Title level={4} style={{ color: '#dc2626' }}>Booking Not Found</Title>
        <Paragraph type="secondary">The booking you are looking for does not exist or has been removed.</Paragraph>
        <Button type="primary" onClick={() => navigate('/bookings')}>
          Back to Bookings
        </Button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    confirmed: 'green', pending: 'orange', pending_payment: 'gold',
    cancelled: 'red', completed: 'blue', in_progress: 'purple',
  };

  const statusSteps = [
    { title: 'Created', description: new Date(booking.createdAt).toLocaleString(), status: 'finish' as const },
    {
      title: 'Payment',
      description: booking.status === 'pending_payment' ? 'Awaiting payment' : 'Processed',
      status: booking.status === 'pending_payment' ? 'process' as const : 'finish' as const,
    },
    {
      title: 'Confirmed',
      description: booking.status === 'confirmed' || booking.status === 'completed' ? 'Confirmed' : 'Pending',
      status: booking.status === 'confirmed' || booking.status === 'completed' ? 'finish' as const :
              booking.status === 'cancelled' ? 'error' as const : 'wait' as const,
    },
    {
      title: 'Completed',
      description: booking.status === 'completed' ? 'Trip completed' : 'Awaiting completion',
      status: booking.status === 'completed' ? 'finish' as const : 'wait' as const,
    },
  ];

  const itemColumns = [
    {
      title: 'Type',
      dataIndex: 'itemType',
      key: 'type',
      render: (v: string) => {
        const typeColors: Record<string, string> = {
          tour: 'green', hotel: 'blue', activity: 'purple', transfer: 'orange',
        };
        return <Tag color={typeColors[v] || 'default'}>{v ? v.toUpperCase() : 'UNKNOWN'}</Tag>;
      },
    },
    { title: 'Name', dataIndex: 'itemName', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'desc',
      render: (v: string) => <Text type="secondary" style={{ fontSize: 13 }}>{v || '--'}</Text>,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'start',
      render: (v: string) => v ? (
        <Space size={4}>
          <CalendarOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
          <Text style={{ fontSize: 13 }}>{new Date(v).toLocaleDateString()}</Text>
        </Space>
      ) : '--',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (v: number) => <Text style={{ fontWeight: 600 }}>${v.toLocaleString()}</Text>,
    },
    { title: 'Qty', dataIndex: 'quantity', key: 'qty', render: (v: number) => <Text>{v}</Text> },
    {
      title: 'Total',
      key: 'total',
      render: (_: any, r: any) => (
        <Text style={{ fontWeight: 700, color: '#166534' }}>${(r.price * r.quantity).toLocaleString()}</Text>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
      }}>
        <Space align="start">
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => navigate('/bookings')}
            style={{ marginTop: 2 }}
          />
          <div>
            <Space align="center" size={12}>
              <Title level={4} style={{ margin: 0 }}>
                Booking {booking.bookingReference}
              </Title>
              <Tag
                color={statusColors[booking.status]}
                style={{ fontSize: 13, padding: '2px 12px', borderRadius: 6 }}
              >
                {booking.status ? booking.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
              </Tag>
              <Tag
                color={booking.isCompliant ? 'green' : 'red'}
                icon={booking.isCompliant ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                style={{ fontSize: 13, padding: '2px 12px', borderRadius: 6 }}
              >
                {booking.isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
              </Tag>
            </Space>
            <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
              Created on {new Date(booking.createdAt).toLocaleString()}
            </Text>
          </div>
        </Space>

        <Space>
          <Button icon={<PrinterOutlined />}>Print</Button>
          <Button icon={<DownloadOutlined />}>Export</Button>
        </Space>
      </div>

      <Row gutter={[20, 20]}>
        {/* Main Content */}
        <Col xs={24} lg={16}>
          {/* Booking Timeline */}
          <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }}>
            <Title level={5} style={{ margin: '0 0 20px 0' }}>
              <ClockCircleOutlined style={{ marginRight: 8, color: '#166534' }} />
              Booking Timeline
            </Title>
            <Steps
              current={statusSteps.findIndex(s => s.status === 'process') >= 0 ?
                statusSteps.findIndex(s => s.status === 'process') :
                statusSteps.filter(s => s.status === 'finish').length - 1
              }
              items={statusSteps}
              size="small"
            />
          </Card>

          {/* Compliance Alert */}
          {!booking.isCompliant && (
            <Alert
              type="warning"
              showIcon
              message="Compliance Issue Detected"
              description="This booking has been flagged for compliance review. Please ensure all levy and tax payments are properly routed through BSP."
              style={{ marginBottom: 20, borderRadius: 10 }}
              action={
                <Button size="small" type="primary" onClick={() => navigate('/compliance')}>
                  View Details
                </Button>
              }
            />
          )}

          {/* Booking Details */}
          <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }}>
            <Title level={5} style={{ margin: '0 0 16px 0' }}>
              <FileTextOutlined style={{ marginRight: 8, color: '#166534' }} />
              Booking Details
            </Title>
            <Descriptions column={{ xs: 1, sm: 2, lg: 2 }} bordered size="middle">
              <Descriptions.Item label="Booking Reference">
                <Text copyable strong>{booking.bookingReference}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[booking.status]}>{booking.status ? booking.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <Text style={{ fontSize: 18, fontWeight: 700, color: '#166534' }}>
                  ${Number(booking.totalAmount).toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Net Amount (to you)">
                <Text style={{ fontSize: 18, fontWeight: 700 }}>
                  ${Number(booking.netAmount).toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tax Amount">
                <Space>
                  <DollarOutlined style={{ color: '#94a3b8' }} />
                  ${Number(booking.taxAmount).toLocaleString()}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Tourism Levy">
                <Space>
                  <SafetyOutlined style={{ color: '#059669' }} />
                  ${Number(booking.levyAmount).toLocaleString()}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Platform Fee">
                ${Number(booking.platformFee).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Compliance Status">
                <Badge
                  status={booking.isCompliant ? 'success' : 'error'}
                  text={booking.isCompliant ? 'Fully Compliant' : 'Non-Compliant'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                <CalendarOutlined style={{ marginRight: 6, color: '#94a3b8' }} />
                {new Date(booking.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {new Date(booking.updatedAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Booking Items */}
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Title level={5} style={{ margin: '0 0 16px 0' }}>
              <TeamOutlined style={{ marginRight: 8, color: '#166534' }} />
              Booked Items ({booking.items?.length || 0})
            </Title>
            <Table
              dataSource={booking.items}
              columns={itemColumns}
              rowKey="id"
              pagination={false}
              size="middle"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={6}>
                    <Text strong style={{ fontSize: 14 }}>Total</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6}>
                    <Text style={{ fontSize: 16, fontWeight: 800, color: '#166534' }}>
                      ${Number(booking.totalAmount).toLocaleString()}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          {/* QR Code */}
          {booking.qrCodeUrl && (
            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <QrcodeOutlined style={{ fontSize: 20, color: '#166534' }} />
                </div>
                <Title level={5} style={{ margin: '0 0 4px 0' }}>ZimPass QR Code</Title>
                <Text type="secondary" style={{ fontSize: 12 }}>Scan for unified itinerary</Text>
                <div style={{ margin: '16px auto', maxWidth: 200 }}>
                  <Image
                    src={booking.qrCodeUrl}
                    alt="ZimPass QR"
                    style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                    preview={false}
                  />
                </div>
                <Text copyable style={{ fontSize: 13, fontWeight: 600 }}>
                  {booking.bookingReference}
                </Text>
              </div>
            </Card>
          )}

          {/* Payment Breakdown */}
          <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }}>
            <Title level={5} style={{ margin: '0 0 16px 0' }}>
              <DollarOutlined style={{ marginRight: 8, color: '#166534' }} />
              Payment Breakdown
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Subtotal', value: Number(booking.totalAmount) - Number(booking.taxAmount) - Number(booking.levyAmount) - Number(booking.platformFee), color: '#1e293b' },
                { label: 'Tax (15% VAT)', value: Number(booking.taxAmount), color: '#64748b' },
                { label: 'Tourism Levy', value: Number(booking.levyAmount), color: '#059669' },
                { label: 'Platform Fee', value: Number(booking.platformFee), color: '#64748b' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#64748b', fontSize: 13 }}>{item.label}</Text>
                  <Text style={{ fontWeight: 600, color: item.color, fontVariantNumeric: 'tabular-nums' }}>
                    ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </div>
              ))}
              <Divider style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: 700, fontSize: 15 }}>Total</Text>
                <Text style={{ fontWeight: 800, fontSize: 20, color: '#166534' }}>
                  ${Number(booking.totalAmount).toLocaleString()}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#64748b', fontSize: 13 }}>You Receive</Text>
                <Text style={{ fontWeight: 700, fontSize: 16, color: '#059669' }}>
                  ${Number(booking.netAmount).toLocaleString()}
                </Text>
              </div>
            </div>
          </Card>

          {/* Compliance Status */}
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Title level={5} style={{ margin: '0 0 16px 0' }}>
              <SafetyOutlined style={{ marginRight: 8, color: '#166534' }} />
              Compliance Check
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Levy Collected', status: true },
                { label: 'VAT Processed', status: true },
                { label: 'BSP Routed', status: booking.isCompliant },
                { label: 'Documentation Complete', status: booking.items && booking.items.length > 0 },
              ].map((check, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: check.status ? '#f0fdf4' : '#fef2f2',
                }}>
                  <Text style={{ fontSize: 13 }}>{check.label}</Text>
                  {check.status ? (
                    <CheckCircleOutlined style={{ color: '#059669' }} />
                  ) : (
                    <ExclamationCircleOutlined style={{ color: '#dc2626' }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={booking.isCompliant ? 100 : 75}
                strokeColor={booking.isCompliant ? '#059669' : '#f59e0b'}
                format={(p) => `${p}% Complete`}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
