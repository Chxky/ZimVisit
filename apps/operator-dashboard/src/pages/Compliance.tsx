import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Table, Tag, Typography, Progress, Spin } from 'antd';
import { SafetyOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { complianceApi, bookingsApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { ComplianceReport } from '../types';

const { Title } = Typography;

export const Compliance: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: any = await complianceApi.getOperatorCompliance(user?.operatorId || '');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!data) return <Card><Title level={4}>No compliance data available</Title></Card>;

  const columns = [
    { title: 'Booking ID', dataIndex: 'bookingId', key: 'bookingId', render: (v: string) => v.slice(0, 8) + '...' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => {
      const colors: Record<string, string> = { compliant: 'green', non_compliant: 'red', pending_review: 'orange', flagged: 'red' };
      return <Tag color={colors[s] || 'default'}>{s.replace('_', ' ').toUpperCase()}</Tag>;
    }},
    { title: 'Levy', dataIndex: 'levyAmount', key: 'levy', render: (v: number) => `$${Number(v).toFixed(2)}` },
    { title: 'VAT', dataIndex: 'vatAmount', key: 'vat', render: (v: number) => `$${Number(v).toFixed(2)}` },
    { title: 'BSP Routed', dataIndex: 'bspRouted', key: 'bsp', render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? 'Yes' : 'No'}</Tag> },
    { title: 'BSP Ref', dataIndex: 'bspReference', key: 'bspRef' },
    { title: 'Date', dataIndex: 'createdAt', key: 'date', render: (d: string) => new Date(d).toLocaleDateString() },
  ];

  return (
    <div>
      <Title level={4}>BSP / Levy Compliance Engine</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Compliance Rate" value={data.complianceRate || 0} suffix="%" prefix={<SafetyOutlined />} valueStyle={{ color: '#166534' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Compliant" value={data.compliant || 0} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#16a34a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Flagged" value={data.flagged || 0} prefix={<WarningOutlined />} valueStyle={{ color: '#f59e0b' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Total Reports" value={data.totalReports || 0} prefix={<CloseCircleOutlined />} /></Card>
        </Col>
      </Row>
      <Card title="Recent Compliance Reports">
        <Table dataSource={data.recentReports || []} columns={columns} rowKey="id" pagination={false} size="small" />
      </Card>
    </div>
  );
};
