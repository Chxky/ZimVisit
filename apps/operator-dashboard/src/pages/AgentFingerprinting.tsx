import React, { useState } from 'react';
import {
  Card, Row, Col, Table, Tag, Typography, Progress, Space,
  Alert, Button, Badge, Tooltip, Timeline, Divider, Modal,
} from 'antd';
import {
  RobotOutlined, SafetyOutlined, WarningOutlined,
  EyeOutlined, ExclamationCircleOutlined, CheckCircleOutlined,
  RadarChartOutlined, FireOutlined, BulbOutlined,
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar } from 'recharts';
import { AgentFingerprint } from '../types';

const { Title, Text } = Typography;

const mockAgents: AgentFingerprint[] = [
  { agentId: 'AGT-001', agentName: 'Tatenda M.', trustScore: 94, anomalyScore: 6, status: 'normal', recentVelocity: 3, unusualDestinations: [], lastActivity: '2026-05-18T14:30:00Z', riskFactors: [] },
  { agentId: 'AGT-002', agentName: 'Chiedza N.', trustScore: 72, anomalyScore: 28, status: 'suspicious', recentVelocity: 47, unusualDestinations: ['HKG', 'MOW'], lastActivity: '2026-05-18T09:15:00Z', riskFactors: ['High velocity change', 'Unusual destinations'] },
  { agentId: 'AGT-003', agentName: 'Tafara M.', trustScore: 45, anomalyScore: 55, status: 'flagged', recentVelocity: 89, unusualDestinations: ['XYZ-UNREG', 'NOC'], lastActivity: '2026-05-17T22:00:00Z', riskFactors: ['Token registration suspected', 'Offshore booking pattern', 'Velocity anomaly'] },
  { agentId: 'AGT-004', agentName: 'Rumbi S.', trustScore: 88, anomalyScore: 12, status: 'normal', recentVelocity: 5, unusualDestinations: [], lastActivity: '2026-05-18T11:00:00Z', riskFactors: [] },
  { agentId: 'AGT-005', agentName: 'Tanaka K.', trustScore: 61, anomalyScore: 39, status: 'suspicious', recentVelocity: 34, unusualDestinations: ['LHR'], lastActivity: '2026-05-16T16:45:00Z', riskFactors: ['Unusual booking time (22:00-04:00)'] },
];

const velocityData = [
  { hour: '00:00', normal: 2, suspicious: 1, flagged: 0 },
  { hour: '04:00', normal: 1, suspicious: 0, flagged: 1 },
  { hour: '08:00', normal: 12, suspicious: 3, flagged: 0 },
  { hour: '12:00', normal: 18, suspicious: 5, flagged: 2 },
  { hour: '16:00', normal: 15, suspicious: 8, flagged: 3 },
  { hour: '20:00', normal: 8, suspicious: 12, flagged: 5 },
];

const radarData = [
  { metric: 'Trust', value: 72 },
  { metric: 'Velocity', value: 55 },
  { metric: 'Consistency', value: 68 },
  { metric: 'Compliance', value: 85 },
  { metric: 'Geography', value: 42 },
  { metric: 'Timing', value: 60 },
];

export const AgentFingerprinting: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentFingerprint | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const flagged = mockAgents.filter(a => a.status !== 'normal').length;
  const avgTrust = Math.round(mockAgents.reduce((sum, a) => sum + a.trustScore, 0) / mockAgents.length);

  const handleViewAgent = (agent: AgentFingerprint) => {
    setSelectedAgent(agent);
    setModalOpen(true);
  };

  const columns = [
    {
      title: 'Agent',
      key: 'agent',
      render: (_: any, r: AgentFingerprint) => (
        <Space size={10}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: r.status === 'normal' ? '#f0fdf4' : r.status === 'suspicious' ? '#fffbeb' : '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <RobotOutlined style={{
              color: r.status === 'normal' ? '#059669' : r.status === 'suspicious' ? '#f59e0b' : '#dc2626',
              fontSize: 16,
            }} />
          </div>
          <div>
            <Text strong style={{ display: 'block', fontSize: 13 }}>{r.agentName}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{r.agentId}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Trust Score',
      dataIndex: 'trustScore',
      key: 'trust',
      sorter: (a: AgentFingerprint, b: AgentFingerprint) => a.trustScore - b.trustScore,
      render: (v: number) => (
        <div style={{ minWidth: 120 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontWeight: 700, color: v > 80 ? '#059669' : v > 60 ? '#f59e0b' : '#dc2626' }}>
              {v}%
            </Text>
          </div>
          <Progress
            percent={v}
            showInfo={false}
            strokeColor={v > 80 ? '#059669' : v > 60 ? '#f59e0b' : '#dc2626'}
            size="small"
            trailColor="#f1f5f9"
          />
        </div>
      ),
    },
    {
      title: 'Anomaly',
      dataIndex: 'anomalyScore',
      key: 'anomaly',
      sorter: (a: AgentFingerprint, b: AgentFingerprint) => a.anomalyScore - b.anomalyScore,
      render: (v: number) => (
        <div style={{ minWidth: 120 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontWeight: 700, color: v > 40 ? '#dc2626' : v > 20 ? '#f59e0b' : '#059669' }}>
              {v}%
            </Text>
          </div>
          <Progress
            percent={v}
            showInfo={false}
            strokeColor={v > 40 ? '#dc2626' : v > 20 ? '#f59e0b' : '#059669'}
            size="small"
            trailColor="#f1f5f9"
          />
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: 'normal' | 'suspicious' | 'flagged') => {
        const config: Record<string, { color: string; icon: React.ReactNode }> = {
          normal: { color: 'green', icon: <CheckCircleOutlined /> },
          suspicious: { color: 'orange', icon: <WarningOutlined /> },
          flagged: { color: 'red', icon: <ExclamationCircleOutlined /> },
        };
        return (
          <Tag color={config[s].color} icon={config[s].icon}>
            {s.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Velocity',
      dataIndex: 'recentVelocity',
      key: 'velocity',
      render: (v: number) => (
        <Tag color={v > 30 ? 'red' : v > 15 ? 'orange' : 'green'}>
          {v} bookings/hr
        </Tag>
      ),
    },
    {
      title: 'Unusual Dests',
      dataIndex: 'unusualDestinations',
      key: 'dests',
      render: (v: string[]) => (
        v.length > 0 ? (
          <Space wrap size={4}>
            {v.map(d => <Tag color="red" key={d} style={{ fontSize: 11 }}>{d}</Tag>)}
          </Space>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>None</Text>
        )
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 48,
      render: (_: any, r: AgentFingerprint) => (
        <Tooltip title="View Details">
          <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => handleViewAgent(r)} />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Space align="center" size={10}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #166534, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <RobotOutlined style={{ color: '#fff', fontSize: 18 }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  "Proof-of-Process" AI Agent Fingerprinting
                </Title>
                <Text type="secondary">AI-powered behavioral analysis and anomaly detection</Text>
              </div>
            </Space>
          </div>
          <Tag
            color="green"
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <BulbOutlined /> Powered by ZimVisit AI
          </Tag>
        </div>
      </div>

      {/* Alert */}
      {flagged > 0 && (
        <Alert
          type="warning"
          showIcon
          message={`${flagged} agent(s) require attention`}
          description="Our AI has detected anomalous behavior patterns that may indicate fraudulent activity. Review flagged agents immediately."
          style={{ marginBottom: 24, borderRadius: 10 }}
          action={
            <Button size="small" type="primary" danger>
              Review Now
            </Button>
          }
        />
      )}

      {/* Stats */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }} className="stagger-children">
        <Col xs={24} sm={8}>
          <div className="card-stat animate-fade-in-up" style={{ position: 'relative' }}>
            <Card bordered={false} style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ color: '#64748b', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Monitored Agents
                  </Text>
                  <Title level={3} style={{ margin: '4px 0 0 0' }}>{mockAgents.length}</Title>
                </div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: '#f0f9ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <RobotOutlined style={{ fontSize: 20, color: '#0369a1' }} />
                </div>
              </div>
            </Card>
          </div>
        </Col>

        <Col xs={24} sm={8}>
          <div className="card-stat animate-fade-in-up" style={{ position: 'relative' }}>
            <Card bordered={false} style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ color: '#64748b', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Avg Trust Score
                  </Text>
                  <Title level={3} style={{ margin: '4px 0 0 0', color: avgTrust > 70 ? '#059669' : '#f59e0b' }}>
                    {avgTrust}%
                  </Title>
                </div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <SafetyOutlined style={{ fontSize: 20, color: '#059669' }} />
                </div>
              </div>
            </Card>
          </div>
        </Col>

        <Col xs={24} sm={8}>
          <div className="card-stat animate-fade-in-up" style={{ position: 'relative' }}>
            <Card bordered={false} style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ color: '#64748b', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Flagged / Suspicious
                  </Text>
                  <Title level={3} style={{ margin: '4px 0 0 0', color: '#dc2626' }}>
                    {flagged}
                  </Title>
                </div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: '#fef2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <WarningOutlined style={{ fontSize: 20, color: '#dc2626' }} />
                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Anomaly Visualization */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            bordered={false}
            style={{ borderRadius: 12 }}
            title={
              <Space>
                <FireOutlined style={{ color: '#f59e0b' }} />
                <Text style={{ fontWeight: 700 }}>Booking Velocity by Hour</Text>
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <RechartsTooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar dataKey="normal" stackId="a" fill="#059669" radius={[0, 0, 0, 0]} />
                <Bar dataKey="suspicious" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="flagged" stackId="a" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8 }}>
              <Space size={6}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: '#059669' }} />
                <Text style={{ fontSize: 12, color: '#64748b' }}>Normal</Text>
              </Space>
              <Space size={6}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: '#f59e0b' }} />
                <Text style={{ fontSize: 12, color: '#64748b' }}>Suspicious</Text>
              </Space>
              <Space size={6}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: '#dc2626' }} />
                <Text style={{ fontSize: 12, color: '#64748b' }}>Flagged</Text>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            bordered={false}
            style={{ borderRadius: 12 }}
            title={
              <Space>
                <RadarChartOutlined style={{ color: '#7c3aed' }} />
                <Text style={{ fontWeight: 700 }}>Risk Profile Radar</Text>
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis tick={false} domain={[0, 100]} />
                <RechartsRadar
                  name="Score"
                  dataKey="value"
                  stroke="#166534"
                  fill="#166534"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Agent Table */}
      <Card
        bordered={false}
        style={{ borderRadius: 12 }}
        title={
          <Space>
            <Text style={{ fontWeight: 700, fontSize: 16 }}>Agent Behavior Analysis</Text>
            <Badge count={mockAgents.length} style={{ backgroundColor: '#166534' }} />
          </Space>
        }
        extra={
          <Tag
            color="green"
            style={{ padding: '4px 12px', borderRadius: 16, fontSize: 11, fontWeight: 600 }}
          >
            <BulbOutlined /> AI Powered
          </Tag>
        }
      >
        <Table
          dataSource={mockAgents}
          columns={columns}
          rowKey="agentId"
          pagination={false}
          size="middle"
          rowClassName={(r) => r.status === 'flagged' ? 'ant-table-row-warning' : ''}
        />
      </Card>

      {/* Agent Detail Modal */}
      <Modal
        title={
          <Space>
            <RobotOutlined style={{ color: '#166534' }} />
            <Text strong>Agent Analysis: {selectedAgent?.agentName}</Text>
          </Space>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setModalOpen(false)}>Close</Button>,
          <Button key="flag" type="primary" danger ghost>Flag Agent</Button>,
        ]}
        width={600}
      >
        {selectedAgent && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col span={8}>
                <Card bodyStyle={{ padding: 14, textAlign: 'center' }}>
                  <Text style={{ fontSize: 11, color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Trust Score</Text>
                  <Progress
                    type="circle"
                    percent={selectedAgent.trustScore}
                    size={60}
                    strokeColor={selectedAgent.trustScore > 80 ? '#059669' : selectedAgent.trustScore > 60 ? '#f59e0b' : '#dc2626'}
                    strokeWidth={8}
                    style={{ margin: '8px 0' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bodyStyle={{ padding: 14, textAlign: 'center' }}>
                  <Text style={{ fontSize: 11, color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Anomaly</Text>
                  <Progress
                    type="circle"
                    percent={selectedAgent.anomalyScore}
                    size={60}
                    strokeColor={selectedAgent.anomalyScore > 40 ? '#dc2626' : selectedAgent.anomalyScore > 20 ? '#f59e0b' : '#059669'}
                    strokeWidth={8}
                    style={{ margin: '8px 0' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bodyStyle={{ padding: 14, textAlign: 'center' }}>
                  <Text style={{ fontSize: 11, color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Velocity</Text>
                  <Title level={3} style={{ margin: '12px 0', color: selectedAgent.recentVelocity > 30 ? '#dc2626' : '#166534' }}>
                    {selectedAgent.recentVelocity}
                  </Title>
                  <Text style={{ fontSize: 11, color: '#94a3b8' }}>bookings/hr</Text>
                </Card>
              </Col>
            </Row>

            <Divider />

            <Title level={5} style={{ marginBottom: 12 }}>Risk Factors</Title>
            {selectedAgent.riskFactors.length > 0 ? (
              <Timeline
                items={selectedAgent.riskFactors.map((f) => ({
                  color: 'red',
                  children: (
                    <div>
                      <Text style={{ fontWeight: 600 }}>{f}</Text>
                    </div>
                  ),
                }))}
              />
            ) : (
              <div style={{
                padding: '16px',
                borderRadius: 10,
                background: '#f0fdf4',
                textAlign: 'center',
              }}>
                <CheckCircleOutlined style={{ fontSize: 24, color: '#059669', marginBottom: 4 }} />
                <Text style={{ display: 'block', color: '#059669', fontWeight: 600 }}>No risk factors detected</Text>
              </div>
            )}

            {selectedAgent.unusualDestinations.length > 0 && (
              <>
                <Title level={5} style={{ margin: '16px 0 12px' }}>Unusual Destinations</Title>
                <Space wrap>
                  {selectedAgent.unusualDestinations.map(d => (
                    <Tag color="red" key={d} style={{ padding: '4px 12px' }}>{d}</Tag>
                  ))}
                </Space>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
