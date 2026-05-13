import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Typography, Progress, Statistic, Space, Alert } from 'antd';
import { RobotOutlined, SafetyOutlined, WarningOutlined } from '@ant-design/icons';
import { AgentFingerprint } from '../types';

const { Title, Text } = Typography;

const mockAgents: AgentFingerprint[] = [
  { agentId: 'AGT-001', agentName: 'Tatenda M.', trustScore: 94, anomalyScore: 6, status: 'normal', recentVelocity: 3, unusualDestinations: [], lastActivity: '2026-05-11T14:30:00Z', riskFactors: [] },
  { agentId: 'AGT-002', agentName: 'Chiedza N.', trustScore: 72, anomalyScore: 28, status: 'suspicious', recentVelocity: 47, unusualDestinations: ['HKG', 'MOW'], lastActivity: '2026-05-11T09:15:00Z', riskFactors: ['High velocity change', 'Unusual destinations'] },
  { agentId: 'AGT-003', agentName: 'Tafara M.', trustScore: 45, anomalyScore: 55, status: 'flagged', recentVelocity: 89, unusualDestinations: ['XYZ-UNREG', 'NOC'], lastActivity: '2026-05-10T22:00:00Z', riskFactors: ['Token registration suspected', 'Offshore booking pattern', 'Velocity anomaly'] },
  { agentId: 'AGT-004', agentName: 'Rumbi S.', trustScore: 88, anomalyScore: 12, status: 'normal', recentVelocity: 5, unusualDestinations: [], lastActivity: '2026-05-11T11:00:00Z', riskFactors: [] },
  { agentId: 'AGT-005', agentName: 'Tanaka K.', trustScore: 61, anomalyScore: 39, status: 'suspicious', recentVelocity: 34, unusualDestinations: ['LHR'], lastActivity: '2026-05-09T16:45:00Z', riskFactors: ['Unusual booking time (22:00-04:00)'] },
];

export const AgentFingerprinting: React.FC = () => {
  const columns = [
    { title: 'Agent', dataIndex: 'agentName', key: 'name' },
    { title: 'Trust Score', dataIndex: 'trustScore', key: 'trust', render: (v: number) => (
      <Progress percent={v} size="small" strokeColor={v > 80 ? '#16a34a' : v > 60 ? '#f59e0b' : '#dc2626'} format={() => `${v}%`} />
    )},
    { title: 'Anomaly', dataIndex: 'anomalyScore', key: 'anomaly', render: (v: number) => (
      <Progress percent={v} size="small" strokeColor={v > 40 ? '#dc2626' : v > 20 ? '#f59e0b' : '#16a34a'} format={() => `${v}%`} />
    )},
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: 'normal' | 'suspicious' | 'flagged') => {
      const colors: Record<string, string> = { normal: 'green', suspicious: 'orange', flagged: 'red' };
      return <Tag color={colors[s]}>{s.toUpperCase()}</Tag>;
    }},
    { title: 'Velocity', dataIndex: 'recentVelocity', key: 'velocity', render: (v: number) => (
      <Tag color={v > 30 ? 'red' : v > 15 ? 'orange' : 'green'}>{v} bookings/hr</Tag>
    )},
    { title: 'Unusual Dests', dataIndex: 'unusualDestinations', key: 'dests', render: (v: string[]) => v.length > 0 ? v.map(d => <Tag color="red" key={d}>{d}</Tag>) : <Text type="secondary">None</Text> },
    { title: 'Risk Factors', dataIndex: 'riskFactors', key: 'risks', render: (v: string[]) => v.length > 0 ? v.map((f, i) => <Tag color="warning" key={i}>{f}</Tag>) : <Text type="secondary">None</Text> },
  ];

  const flagged = mockAgents.filter(a => a.status !== 'normal').length;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <RobotOutlined style={{ fontSize: 24, color: '#166534' }} />
        <Title level={4} style={{ margin: 0 }}>"Proof-of-Process" AI Agent Fingerprinting</Title>
      </Space>
      {flagged > 0 && <Alert type="warning" showIcon message={`${flagged} agent(s) flagged for anomalous behavior`} style={{ marginBottom: 16 }} />}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Monitored Agents" value={mockAgents.length} prefix={<RobotOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Normal" value={mockAgents.filter(a => a.status === 'normal').length}
            prefix={<SafetyOutlined />} valueStyle={{ color: '#16a34a' }} /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Flagged / Suspicious" value={flagged}
            prefix={<WarningOutlined />} valueStyle={{ color: '#dc2626' }} /></Card>
        </Col>
      </Row>
      <Card title="Agent Behavior Analysis">
        <Table dataSource={mockAgents} columns={columns} rowKey="agentId" pagination={false} />
      </Card>
    </div>
  );
};
