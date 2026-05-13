import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Card, Tag, Table, Typography, Spin, Row, Col, Image } from 'antd';
import { bookingsApi } from '../services/api';
import { Booking } from '../types';

const { Title, Text } = Typography;

export const BookingDetail: React.FC = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    bookingsApi.getById(id).then((res: any) => setBooking(res))
      .catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!booking) return <Text type="danger">Booking not found</Text>;

  const itemColumns = [
    { title: 'Type', dataIndex: 'itemType', key: 'type', render: (v: string) => <Tag>{v}</Tag> },
    { title: 'Name', dataIndex: 'itemName', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Qty', dataIndex: 'quantity', key: 'qty' },
    { title: 'Total', key: 'total', render: (_: any, r: any) => `$${(r.price * r.quantity).toLocaleString()}` },
  ];

  const statusColors: Record<string, string> = { confirmed: 'green', pending: 'orange', pending_payment: 'gold', cancelled: 'red', completed: 'blue' };

  return (
    <div>
      <Title level={4}>Booking: {booking.bookingReference}</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Booking Details" style={{ marginBottom: 16 }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Status">
                <Tag color={statusColors[booking.status]}>{booking.status.replace('_', ' ').toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Compliance">
                <Tag color={booking.isCompliant ? 'green' : 'red'}>{booking.isCompliant ? 'Compliant' : 'Non-Compliant'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">${Number(booking.totalAmount).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Tax">${Number(booking.taxAmount).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Levy">${Number(booking.levyAmount).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Platform Fee">${Number(booking.platformFee).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Net Amount"><strong>${Number(booking.netAmount).toLocaleString()}</strong></Descriptions.Item>
              <Descriptions.Item label="Created">{new Date(booking.createdAt).toLocaleString()}</Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="Items">
            <Table dataSource={booking.items} columns={itemColumns} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          {booking.qrCodeUrl && (
            <Card title="ZimPass QR Code">
              <div style={{ textAlign: 'center' }}>
                <Image src={booking.qrCodeUrl} alt="ZimPass" style={{ width: 200 }} />
                <Text style={{ display: 'block', marginTop: 8 }}><Text strong>{booking.bookingReference}</Text></Text>
                <Text type="secondary">Scan for unified itinerary</Text>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};
