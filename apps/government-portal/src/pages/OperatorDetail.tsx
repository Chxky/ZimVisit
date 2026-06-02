import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Descriptions, Tag, Typography, Row, Col,
  Table, Button, Alert, Space, Tabs, Timeline, Badge, Divider,
} from 'antd';
import {
  ArrowLeftOutlined, WarningOutlined, CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined, TeamOutlined, SafetyOutlined,
  AuditOutlined, FileTextOutlined, ExportOutlined,
  HistoryOutlined, ExclamationCircleOutlined, BankOutlined,
  CalendarOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined,
  KeyOutlined, ArrowUpOutlined, BarChartOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
} from 'recharts';

const { Title, Text } = Typography;

/* ── Data ─────────────────────────────────────────────────── */
const operator = {
  id: 'OP-001',
  name: 'Victoria Falls Travel',
  email: 'info@victoriafallstravel.co.zw',
  phone: '+263 77 123 4567',
  address: '123 Livingstone Way, Victoria Falls, Zimbabwe',
  licenseNumber: 'ZTA-2018-0456',
  status: 'amber' as const,
  complianceRate: 72,
  riskScore: 45,
  totalRevenue: 345000,
  totalLevy: 6900,
  totalBookings: 456,
  agentCount: 12,
  registrationDate: '2018-03-15',
  lastAudit: '2026-02-20',
  bspConnected: true,
  recentFlags: [
    '3 late levy remittances in past 6 months',
    'BSP reference mismatch on 2 bookings',
    'High-velocity booking from new agent (AGT-089)',
  ],
};

const recentBookings = [
  { ref: 'ZV-BK-001', amount: 2450, status: 'confirmed', compliant: true, date: '2026-05-10', customer: 'J. Smith (UK)' },
  { ref: 'ZV-BK-002', amount: 3800, status: 'pending', compliant: false, date: '2026-05-09', customer: 'M. Mueller (DE)' },
  { ref: 'ZV-BK-003', amount: 1200, status: 'confirmed', compliant: true, date: '2026-05-08', customer: 'A. Patel (IN)' },
  { ref: 'ZV-BK-004', amount: 5600, status: 'completed', compliant: false, date: '2026-05-07', customer: 'S. Chen (CN)' },
  { ref: 'ZV-BK-005', amount: 890, status: 'cancelled', compliant: true, date: '2026-05-06', customer: 'R. Davis (US)' },
  { ref: 'ZV-BK-006', amount: 2100, status: 'confirmed', compliant: true, date: '2026-05-05', customer: 'L. Garcia (ES)' },
];

const auditHistory = [
  { date: '2026-02-20', type: 'Follow-up', result: 'Conditional', auditor: 'T. Moyo', notes: 'BSP reconciliation discrepancies noted. 30-day corrective action period initiated. Levy remittance schedule adjusted.', severity: 'medium' },
  { date: '2025-11-10', type: 'Investigation', result: 'Fail', auditor: 'R. Ncube', notes: 'Agent velocity anomaly detected. 3 bookings flagged for manual review. BSP reference mismatch confirmed.', severity: 'high' },
  { date: '2025-08-15', type: 'Routine', result: 'Pass', auditor: 'P. Dlamini', notes: 'All compliance checks passed. Minor documentation update recommended for agent registration records.', severity: 'low' },
  { date: '2025-03-20', type: 'Routine', result: 'Pass', auditor: 'T. Moyo', notes: 'Excellent record keeping. All levy payments on time. BSP connection stable.', severity: 'low' },
];

const monthlyBookingData = [
  { month: 'Jan', bookings: 62, revenue: 48000 },
  { month: 'Feb', bookings: 58, revenue: 44000 },
  { month: 'Mar', bookings: 75, revenue: 58000 },
  { month: 'Apr', bookings: 68, revenue: 52000 },
  { month: 'May', bookings: 82, revenue: 64000 },
  { month: 'Jun', bookings: 91, revenue: 72000 },
];

const complianceHistory = [
  { month: 'Jan', rate: 78 },
  { month: 'Feb', rate: 75 },
  { month: 'Mar', rate: 72 },
  { month: 'Apr', rate: 70 },
  { month: 'May', rate: 72 },
  { month: 'Jun', rate: 74 },
];

const agentList = [
  { id: 'AGT-001', name: 'Tendai Mupfawa', bookings: 89, revenue: 68000, status: 'active', compliance: 92 },
  { id: 'AGT-002', name: 'Chipo Nyamande', bookings: 76, revenue: 58000, status: 'active', compliance: 88 },
  { id: 'AGT-003', name: 'Blessing Mutero', bookings: 65, revenue: 49000, status: 'active', compliance: 75 },
  { id: 'AGT-089', name: 'New Agent (Pending)', bookings: 34, revenue: 28000, status: 'flagged', compliance: 45 },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  compliant: { color: '#059669', bg: 'rgba(5,150,105,0.08)', icon: <CheckCircleOutlined />, label: 'COMPLIANT' },
  amber: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: <WarningOutlined />, label: 'AMBER' },
  red: { color: '#dc2626', bg: 'rgba(220,38,38,0.08)', icon: <CloseCircleOutlined />, label: 'NON-COMPLIANT' },
};

/* ── Compliance Ring ──────────────────────────────────────── */
const ComplianceRing: React.FC<{ percent: number; size?: number; label?: string }> = ({ percent, size = 120, label }) => {
  const color = percent > 80 ? '#059669' : percent > 60 ? '#f59e0b' : '#dc2626';
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{percent}%</div>
        {label && <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{label}</div>}
      </div>
    </div>
  );
};

/* ── Operator Detail Page ─────────────────────────────────── */
export const OperatorDetail: React.FC = () => {
  const navigate = useNavigate();

  const bookingColumns = [
    {
      title: 'Reference',
      dataIndex: 'ref',
      key: 'ref',
      render: (v: string) => <Text strong style={{ fontFamily: "'Inter', monospace", fontSize: 12 }}>{v}</Text>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (v: string) => <Text style={{ fontSize: 12 }}>{v}</Text>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (v: number) => <Text style={{ fontWeight: 600, fontFamily: "'Inter', monospace" }}>${v.toLocaleString()}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const colors: Record<string, string> = { confirmed: '#059669', pending: '#f59e0b', completed: '#1e1b4b', cancelled: '#dc2626' };
        const bg: Record<string, string> = { confirmed: 'rgba(5,150,105,0.08)', pending: 'rgba(245,158,11,0.08)', completed: 'rgba(30,27,75,0.08)', cancelled: 'rgba(220,38,38,0.08)' };
        return (
          <Tag style={{ background: bg[s], color: colors[s], border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 10 }}>
            {s.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Compliant',
      dataIndex: 'compliant',
      key: 'compliant',
      render: (v: boolean) => (
        <Tag
          icon={v ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
          style={{
            background: v ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.08)',
            color: v ? '#059669' : '#dc2626',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 10,
          }}
        >
          {v ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (v: string) => <Text style={{ fontSize: 12, color: '#64748b' }}>{v}</Text>,
    },
  ];

  const agentColumns = [
    {
      title: 'Agent',
      dataIndex: 'name',
      key: 'name',
      render: (v: string, r: any) => (
        <div>
          <Text strong style={{ fontSize: 13, display: 'block' }}>{v}</Text>
          <Text style={{ fontSize: 11, color: '#64748b' }}>{r.id}</Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const colors: Record<string, string> = { active: '#059669', flagged: '#dc2626', inactive: '#64748b' };
        return (
          <Badge status={s === 'active' ? 'success' : s === 'flagged' ? 'error' : 'default'} text={
            <Text style={{ fontSize: 12, color: colors[s], fontWeight: 600 }}>{s.toUpperCase()}</Text>
          } />
        );
      },
    },
    {
      title: 'Bookings',
      dataIndex: 'bookings',
      key: 'bookings',
      render: (v: number) => <Text style={{ fontWeight: 600 }}>{v}</Text>,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (v: number) => <Text style={{ fontWeight: 600, fontFamily: "'Inter', monospace" }}>${v.toLocaleString()}</Text>,
    },
    {
      title: 'Compliance',
      dataIndex: 'compliance',
      key: 'compliance',
      render: (v: number) => {
        const color = v > 80 ? '#059669' : v > 60 ? '#f59e0b' : '#dc2626';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden', maxWidth: 80 }}>
              <div style={{ width: `${v}%`, height: '100%', background: color, borderRadius: 2 }} />
            </div>
            <Text style={{ fontSize: 12, fontWeight: 700, color }}>{v}%</Text>
          </div>
        );
      },
    },
  ];

  const c = statusConfig[operator.status];

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/operators')}
            style={{ borderColor: '#e2e8f0' }}
          >
            Back
          </Button>
          <div>
            <Space align="center">
              <Title level={4} style={{ margin: 0, color: '#1e1b4b', fontWeight: 800 }}>
                {operator.name}
              </Title>
              <Tag
                icon={c?.icon}
                style={{
                  background: c?.bg,
                  color: c?.color,
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 11,
                  padding: '2px 10px',
                }}
              >
                {c?.label}
              </Tag>
            </Space>
            <Text style={{ fontSize: 12, color: '#64748b', display: 'block', marginTop: 2 }}>
              {operator.id} | License: {operator.licenseNumber}
            </Text>
          </div>
        </div>
        <Space>
          <Button icon={<AuditOutlined />} style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
            Schedule Audit
          </Button>
          <Button icon={<ExportOutlined />} style={{ borderColor: '#e2e8f0' }}>
            Export Report
          </Button>
        </Space>
      </div>

      {/* Compliance Flags Alert */}
      {operator.recentFlags.length > 0 && (
        <div className="animate-fade-in-up stagger-1" style={{ marginBottom: 20 }}>
          <Alert
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            message={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space>
                  <span className="badge-ai">AI DETECTED</span>
                  <Text style={{ fontSize: 13 }}>Recent Compliance Flags ({operator.recentFlags.length})</Text>
                </Space>
                <Tag color="orange">Requires Attention</Tag>
              </div>
            }
            description={
              <ul style={{ margin: '8px 0 0', paddingLeft: 16 }}>
                {operator.recentFlags.map((f, i) => (
                  <li key={i} style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>{f}</li>
                ))}
              </ul>
            }
            style={{
              borderRadius: 12,
              border: '1px solid rgba(245,158,11,0.3)',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.04), rgba(245,158,11,0.02))',
            }}
          />
        </div>
      )}

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Revenue', value: `$${(operator.totalRevenue / 1000).toFixed(0)}K`, icon: <DollarOutlined />, bg: 'linear-gradient(135deg, #059669, #10b981)', change: '+12%', changeType: 'up' },
          { label: 'Levy Remitted', value: `$${(operator.totalLevy / 1000).toFixed(1)}K`, icon: <BankOutlined />, bg: 'linear-gradient(135deg, #1e1b4b, #312e81)', change: '+8%', changeType: 'up' },
          { label: 'Total Bookings', value: operator.totalBookings.toString(), icon: <FileTextOutlined />, bg: 'linear-gradient(135deg, #d97706, #b45309)', change: '+15%', changeType: 'up' },
          { label: 'Active Agents', value: operator.agentCount.toString(), icon: <TeamOutlined />, bg: 'linear-gradient(135deg, #312e81, #4338ca)', change: '+2', changeType: 'up' },
        ].map((kpi, idx) => (
          <Col xs={12} sm={6} key={idx}>
            <div className={`kpi-card animate-fade-in-up stagger-${idx + 1}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="kpi-label">{kpi.label}</div>
                  <div className="kpi-value" style={{ color: '#1e1b4b', marginTop: 8 }}>{kpi.value}</div>
                  <div className={`kpi-change ${kpi.changeType}`}>
                    <ArrowUpOutlined /> {kpi.change}
                  </div>
                </div>
                <div className="kpi-icon" style={{ background: kpi.bg, color: '#ffffff' }}>
                  {kpi.icon}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Main Content Tabs */}
      <div className="gradient-border-card animate-fade-in-up stagger-4" style={{ padding: 0, marginBottom: 20 }}>
        <Tabs
          defaultActiveKey="overview"
          style={{ padding: '0 20px' }}
          items={[
            {
              key: 'overview',
              label: (
                <Space>
                  <SafetyOutlined />
                  <span>Overview</span>
                </Space>
              ),
              children: (
                <Row gutter={[20, 20]} style={{ paddingBottom: 20 }}>
                  {/* Compliance & Risk */}
                  <Col xs={24} lg={8}>
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: 24,
                      border: '1px solid #e2e8f0',
                    }}>
                      <Text strong style={{ fontSize: 14, color: '#1e1b4b', display: 'block', marginBottom: 20, textAlign: 'center' }}>
                        Compliance & Risk Assessment
                      </Text>
                      <Row gutter={[16, 24]}>
                        <Col span={12}>
                          <ComplianceRing percent={operator.complianceRate} size={100} label="Compliance" />
                        </Col>
                        <Col span={12}>
                          <ComplianceRing percent={operator.riskScore} size={100} label="Risk Score" />
                        </Col>
                      </Row>
                      <Divider />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ fontSize: 12, color: '#64748b' }}>BSP Status</Text>
                        <Tag
                          icon={operator.bspConnected ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                          style={{
                            background: operator.bspConnected ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.08)',
                            color: operator.bspConnected ? '#059669' : '#dc2626',
                            border: 'none',
                            borderRadius: 6,
                            fontWeight: 600,
                            fontSize: 11,
                          }}
                        >
                          {operator.bspConnected ? 'Connected' : 'Disconnected'}
                        </Tag>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ fontSize: 12, color: '#64748b' }}>Last Audit</Text>
                        <Text style={{ fontSize: 12, fontWeight: 600 }}>{operator.lastAudit}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 12, color: '#64748b' }}>Registered</Text>
                        <Text style={{ fontSize: 12, fontWeight: 600 }}>{operator.registrationDate}</Text>
                      </div>
                    </div>
                  </Col>

                  {/* Operator Details */}
                  <Col xs={24} lg={16}>
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: 24,
                      border: '1px solid #e2e8f0',
                    }}>
                      <Text strong style={{ fontSize: 14, color: '#1e1b4b', display: 'block', marginBottom: 16 }}>
                        Operator Information
                      </Text>
                      <Descriptions column={{ xs: 1, sm: 2 }} size="small" bordered>
                        <Descriptions.Item label={<Space><KeyOutlined style={{ color: '#64748b' }} /> License</Space>}>
                          {operator.licenseNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Space><CalendarOutlined style={{ color: '#64748b' }} /> Registered</Space>}>
                          {operator.registrationDate}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Space><AuditOutlined style={{ color: '#64748b' }} /> Last Audit</Space>}>
                          {operator.lastAudit}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Space><BankOutlined style={{ color: '#64748b' }} /> BSP Status</Space>}>
                          <Badge status={operator.bspConnected ? 'success' : 'error'} text={operator.bspConnected ? 'Connected' : 'Disconnected'} />
                        </Descriptions.Item>
                        <Descriptions.Item label={<Space><MailOutlined style={{ color: '#64748b' }} /> Email</Space>}>
                          <a href={`mailto:${operator.email}`}>{operator.email}</a>
                        </Descriptions.Item>
                        <Descriptions.Item label={<Space><PhoneOutlined style={{ color: '#64748b' }} /> Phone</Space>}>
                          {operator.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Space><EnvironmentOutlined style={{ color: '#64748b' }} /> Address</Space>} span={2}>
                          {operator.address}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'bookings',
              label: (
                <Space>
                  <FileTextOutlined />
                  <span>Booking History</span>
                </Space>
              ),
              children: (
                <Row gutter={[20, 20]} style={{ paddingBottom: 20 }}>
                  <Col xs={24} lg={16}>
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: 20,
                      border: '1px solid #e2e8f0',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Text strong style={{ fontSize: 14, color: '#1e1b4b' }}>Recent Bookings</Text>
                        <Text style={{ fontSize: 12, color: '#64748b' }}>Last 30 days</Text>
                      </div>
                      <Table
                        dataSource={recentBookings}
                        columns={bookingColumns}
                        rowKey="ref"
                        pagination={false}
                        size="small"
                        rowClassName={(r) => !r.compliant ? 'ant-table-row-danger' : ''}
                      />
                    </div>
                  </Col>
                  <Col xs={24} lg={8}>
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: 20,
                      border: '1px solid #e2e8f0',
                    }}>
                      <Text strong style={{ fontSize: 14, color: '#1e1b4b', display: 'block', marginBottom: 16 }}>
                        Monthly Booking Trend
                      </Text>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={monthlyBookingData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <RTooltip
                            contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                            formatter={(value: number, name: string) => [value, name]}
                          />
                          <Bar dataKey="bookings" fill="#1e1b4b" radius={[4, 4, 0, 0]} name="Bookings" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'audit',
              label: (
                <Space>
                  <HistoryOutlined />
                  <span>Audit Trail</span>
                </Space>
              ),
              children: (
                <div style={{ paddingBottom: 20 }}>
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: 12,
                    padding: 24,
                    border: '1px solid #e2e8f0',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <Text strong style={{ fontSize: 14, color: '#1e1b4b' }}>Compliance Audit Timeline</Text>
                      <Button size="small" icon={<ExportOutlined />} style={{ borderColor: '#e2e8f0' }}>
                        Export Audit Log
                      </Button>
                    </div>
                    <Timeline
                      items={auditHistory.map((audit) => {
                        const resultColors: Record<string, string> = { Pass: '#059669', Fail: '#dc2626', Conditional: '#f59e0b' };
                        const severityBg: Record<string, string> = { low: 'rgba(5,150,105,0.06)', medium: 'rgba(245,158,11,0.06)', high: 'rgba(220,38,38,0.06)' };
                        return {
                          color: resultColors[audit.result],
                          children: (
                            <div style={{
                              background: severityBg[audit.severity],
                              borderRadius: 10,
                              padding: 16,
                              border: `1px solid ${resultColors[audit.result]}20`,
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <Space>
                                  <Tag style={{
                                    background: `${resultColors[audit.result]}15`,
                                    color: resultColors[audit.result],
                                    border: 'none',
                                    borderRadius: 6,
                                    fontWeight: 700,
                                    fontSize: 10,
                                  }}>
                                    {audit.type.toUpperCase()}
                                  </Tag>
                                  <Tag style={{
                                    background: `${resultColors[audit.result]}15`,
                                    color: resultColors[audit.result],
                                    border: 'none',
                                    borderRadius: 6,
                                    fontWeight: 700,
                                    fontSize: 10,
                                  }}>
                                    {audit.result.toUpperCase()}
                                  </Tag>
                                </Space>
                                <Text style={{ fontSize: 11, color: '#64748b' }}>{audit.date}</Text>
                              </div>
                              <Text style={{ fontSize: 13, color: '#1e293b', display: 'block', marginBottom: 6 }}>
                                {audit.notes}
                              </Text>
                              <Text style={{ fontSize: 11, color: '#64748b' }}>
                                Auditor: {audit.auditor}
                              </Text>
                            </div>
                          ),
                        };
                      })}
                    />
                  </div>
                </div>
              ),
            },
            {
              key: 'agents',
              label: (
                <Space>
                  <TeamOutlined />
                  <span>Agents ({operator.agentCount})</span>
                </Space>
              ),
              children: (
                <div style={{ paddingBottom: 20 }}>
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: 12,
                    padding: 20,
                    border: '1px solid #e2e8f0',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <Text strong style={{ fontSize: 14, color: '#1e1b4b' }}>Registered Agents</Text>
                      <Tag color="orange" style={{ borderRadius: 6 }}>
                        1 agent flagged for review
                      </Tag>
                    </div>
                    <Table
                      dataSource={agentList}
                      columns={agentColumns}
                      rowKey="id"
                      pagination={false}
                      size="small"
                      rowClassName={(r) => r.status === 'flagged' ? 'ant-table-row-danger' : ''}
                    />
                  </div>
                </div>
              ),
            },
            {
              key: 'trends',
              label: (
                <Space>
                  <BarChartOutlined />
                  <span>Trends</span>
                </Space>
              ),
              children: (
                <Row gutter={[20, 20]} style={{ paddingBottom: 20 }}>
                  <Col xs={24} lg={12}>
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: 20,
                      border: '1px solid #e2e8f0',
                    }}>
                      <Text strong style={{ fontSize: 14, color: '#1e1b4b', display: 'block', marginBottom: 16 }}>
                        Revenue Trend
                      </Text>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={monthlyBookingData}>
                          <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#1e1b4b" stopOpacity={0.2} />
                              <stop offset="100%" stopColor="#1e1b4b" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                          <RTooltip
                            contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#1e1b4b" strokeWidth={2} fill="url(#revGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Col>
                  <Col xs={24} lg={12}>
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: 20,
                      border: '1px solid #e2e8f0',
                    }}>
                      <Text strong style={{ fontSize: 14, color: '#1e1b4b', display: 'block', marginBottom: 16 }}>
                        Compliance Rate Trend
                      </Text>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={complianceHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <RTooltip
                            contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                            formatter={(value: number) => [`${value}%`, 'Compliance Rate']}
                          />
                          <Line
                            type="monotone"
                            dataKey="rate"
                            stroke="#f59e0b"
                            strokeWidth={2.5}
                            dot={{ fill: '#f59e0b', r: 5, strokeWidth: 2, stroke: '#fff' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
