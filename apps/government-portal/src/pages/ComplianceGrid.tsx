import React, { useState, useMemo } from 'react';
import {
  Table, Tag, Typography, Badge, Input, Space, Row, Col,
  Button, Timeline, Modal, Descriptions,
} from 'antd';
import {
  SearchOutlined, SafetyOutlined, CheckCircleOutlined, WarningOutlined,
  CloseCircleOutlined, ExportOutlined, EyeOutlined,
  HistoryOutlined, ClockCircleOutlined, DownloadOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

/* ── Data ─────────────────────────────────────────────────── */
const operatorsGrid = [
  { id: 'OP-001', name: 'Victoria Falls Travel', status: 'compliant', rate: 98, score: 18, bookings: 456, revenue: 345000, levy: 6900, lastAudit: '2026-04-15', agents: 12, bspConnected: true, auditHistory: [{ date: '2026-04-15', type: 'Routine', result: 'Pass', notes: 'All compliance checks passed. Minor documentation update recommended.' }, { date: '2025-12-10', type: 'Routine', result: 'Pass', notes: 'Excellent record keeping.' }] },
  { id: 'OP-002', name: 'Zimbabwe Safari Co', status: 'amber', rate: 72, score: 45, bookings: 312, revenue: 234000, levy: 4680, lastAudit: '2026-01-20', agents: 8, bspConnected: true, auditHistory: [{ date: '2026-01-20', type: 'Follow-up', result: 'Conditional', notes: 'BSP reconciliation discrepancies noted. 30-day corrective action required.' }, { date: '2025-08-15', type: 'Routine', result: 'Pass', notes: 'Minor issues resolved.' }] },
  { id: 'OP-003', name: 'Great Zimbabwe Tours', status: 'compliant', rate: 95, score: 18, bookings: 267, revenue: 189000, levy: 3780, lastAudit: '2026-03-10', agents: 5, bspConnected: true, auditHistory: [{ date: '2026-03-10', type: 'Routine', result: 'Pass', notes: 'Exemplary compliance record.' }] },
  { id: 'OP-004', name: 'Harare City Breaks', status: 'red', rate: 34, score: 76, bookings: 145, revenue: 89000, levy: 1780, lastAudit: '2025-11-05', agents: 15, bspConnected: false, auditHistory: [{ date: '2025-11-05', type: 'Investigation', result: 'Fail', notes: 'Significant BSP bypass detected. Multiple unreported bookings. Enforcement action initiated.' }, { date: '2025-06-20', type: 'Follow-up', result: 'Conditional', notes: 'Partial compliance achieved.' }] },
  { id: 'OP-005', name: 'Eastern Highlands Trek', status: 'compliant', rate: 91, score: 22, bookings: 198, revenue: 167000, levy: 3340, lastAudit: '2026-02-28', agents: 4, bspConnected: true, auditHistory: [{ date: '2026-02-28', type: 'Routine', result: 'Pass', notes: 'All systems connected. Levy up to date.' }] },
  { id: 'OP-006', name: 'Kariba Lakeside Lodge', status: 'amber', rate: 65, score: 45, bookings: 178, revenue: 123000, levy: 2460, lastAudit: '2025-12-12', agents: 6, bspConnected: true, auditHistory: [{ date: '2025-12-12', type: 'Routine', result: 'Conditional', notes: 'Late levy remittance pattern detected. Automated reminders configured.' }] },
  { id: 'OP-007', name: 'Bulawayo Heritage Tours', status: 'compliant', rate: 93, score: 15, bookings: 189, revenue: 145000, levy: 2900, lastAudit: '2026-04-01', agents: 3, bspConnected: true, auditHistory: [{ date: '2026-04-01', type: 'Routine', result: 'Pass', notes: 'Model operator. Used as benchmark for region.' }] },
  { id: 'OP-008', name: 'Mana Pools Expeditions', status: 'red', rate: 28, score: 89, bookings: 89, revenue: 56000, levy: 1120, lastAudit: '2025-08-15', agents: 2, bspConnected: false, auditHistory: [{ date: '2025-08-15', type: 'Investigation', result: 'Fail', notes: 'Critical non-compliance. Offshore payment channels detected. Immediate suspension recommended.' }, { date: '2025-03-10', type: 'Follow-up', result: 'Fail', notes: 'Failed to provide required documentation.' }, { date: '2024-11-20', type: 'Routine', result: 'Conditional', notes: 'Initial compliance concerns raised.' }] },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  compliant: { color: '#059669', bg: 'rgba(5,150,105,0.08)', icon: <CheckCircleOutlined />, label: 'COMPLIANT' },
  amber: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: <WarningOutlined />, label: 'AMBER' },
  red: { color: '#dc2626', bg: 'rgba(220,38,38,0.08)', icon: <CloseCircleOutlined />, label: 'NON-COMPLIANT' },
};

/* ── Compliance Ring ──────────────────────────────────────── */
const ComplianceRing: React.FC<{ percent: number; size?: number }> = ({ percent, size = 52 }) => {
  const color = percent > 80 ? '#059669' : percent > 60 ? '#f59e0b' : '#dc2626';
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={3} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <span style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 13, fontWeight: 700, color,
      }}>
        {percent}
      </span>
    </div>
  );
};

/* ── Audit Timeline Modal ─────────────────────────────────── */
const AuditTimeline: React.FC<{ operator: any; visible: boolean; onClose: () => void }> = ({ operator, visible, onClose }) => {
  if (!operator) return null;

  return (
    <Modal
      title={
        <Space>
          <HistoryOutlined style={{ color: '#1e1b4b' }} />
          <span>Audit History - {operator.name}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Descriptions column={2} size="small" style={{ marginBottom: 20 }} bordered>
        <Descriptions.Item label="Operator ID">{operator.id}</Descriptions.Item>
        <Descriptions.Item label="Current Status">
          <Tag color={statusConfig[operator.status]?.color}>{statusConfig[operator.status]?.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Compliance Rate">{operator.rate}%</Descriptions.Item>
        <Descriptions.Item label="Risk Score">{operator.score}/100</Descriptions.Item>
      </Descriptions>

      <Timeline
        items={operator.auditHistory?.map((audit: any) => ({
          color: audit.result === 'Pass' ? '#059669' : audit.result === 'Fail' ? '#dc2626' : '#f59e0b',
          children: (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text strong style={{ fontSize: 13 }}>{audit.type} Audit</Text>
                <Tag color={audit.result === 'Pass' ? 'green' : audit.result === 'Fail' ? 'red' : 'orange'}>
                  {audit.result}
                </Tag>
              </div>
              <Text style={{ fontSize: 11, color: '#64748b', display: 'block' }}>{audit.date}</Text>
              <Text style={{ fontSize: 12, color: '#475569', marginTop: 4, display: 'block' }}>{audit.notes}</Text>
            </div>
          ),
        }))}
      />
    </Modal>
  );
};

/* ── Compliance Grid ──────────────────────────────────────── */
export const ComplianceGrid: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<any>(null);
  const [auditModalVisible, setAuditModalVisible] = useState(false);

  const filtered = useMemo(() => {
    return operatorsGrid.filter((o) => {
      const matchesSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const compliantCount = operatorsGrid.filter((o) => o.status === 'compliant').length;
  const amberCount = operatorsGrid.filter((o) => o.status === 'amber').length;
  const redCount = operatorsGrid.filter((o) => o.status === 'red').length;
  const avgCompliance = Math.round(operatorsGrid.reduce((sum, o) => sum + o.rate, 0) / operatorsGrid.length);

  const columns = [
    {
      title: 'Operator',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (v: string, r: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Badge status={r.status === 'compliant' ? 'success' : r.status === 'amber' ? 'warning' : 'error'} />
          <div>
            <Text strong style={{ fontSize: 13, display: 'block' }}>{v}</Text>
            <Text style={{ fontSize: 11, color: '#64748b' }}>{r.id}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (s: string) => {
        const c = statusConfig[s];
        return (
          <Tag
            icon={c?.icon}
            style={{
              background: c?.bg,
              color: c?.color,
              border: 'none',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 10,
              padding: '2px 10px',
            }}
          >
            {c?.label}
          </Tag>
        );
      },
    },
    {
      title: 'Compliance',
      dataIndex: 'rate',
      key: 'rate',
      width: 100,
      render: (v: number) => <ComplianceRing percent={v} />,
    },
    {
      title: 'Risk Score',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      render: (v: number) => {
        const color = v > 60 ? '#dc2626' : v > 30 ? '#f59e0b' : '#059669';
        const bg = v > 60 ? 'rgba(220,38,38,0.08)' : v > 30 ? 'rgba(245,158,11,0.08)' : 'rgba(5,150,105,0.08)';
        return (
          <Tag style={{ background: bg, color: color, border: 'none', borderRadius: 6, fontWeight: 700, fontFamily: "'Inter', monospace" }}>
            {v}/100
          </Tag>
        );
      },
    },
    {
      title: 'Bookings',
      dataIndex: 'bookings',
      key: 'bookings',
      width: 80,
      render: (v: number) => <Text style={{ fontWeight: 600 }}>{v}</Text>,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 110,
      render: (v: number) => <Text style={{ fontWeight: 600, fontFamily: "'Inter', monospace" }}>${v.toLocaleString()}</Text>,
    },
    {
      title: 'Levy',
      dataIndex: 'levy',
      key: 'levy',
      width: 90,
      render: (v: number) => <Text style={{ fontFamily: "'Inter', monospace" }}>${v.toLocaleString()}</Text>,
    },
    {
      title: 'BSP',
      dataIndex: 'bspConnected',
      key: 'bsp',
      width: 100,
      render: (v: boolean) => (
        <Tag
          icon={v ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          style={{
            background: v ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.08)',
            color: v ? '#059669' : '#dc2626',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 11,
          }}
        >
          {v ? 'Connected' : 'Disconnected'}
        </Tag>
      ),
    },
    {
      title: 'Last Audit',
      dataIndex: 'lastAudit',
      key: 'audit',
      width: 110,
      render: (v: string) => (
        <Space size={4}>
          <ClockCircleOutlined style={{ color: '#64748b', fontSize: 12 }} />
          <Text style={{ fontSize: 12, color: '#64748b' }}>{v}</Text>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_: any, record: any) => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedOperator(record);
            setAuditModalVisible(true);
          }}
          style={{ color: '#312e81' }}
        >
          Audit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid #1e1b4b', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -10, left: -20, opacity: 0.1 }}>
          <img src="/zim-bird.svg" alt="" style={{ height: 120 }} />
        </div>
        <Title level={4} style={{ margin: 0, fontFamily: 'Cinzel, serif', fontWeight: 700, letterSpacing: '2px', color: '#64748b' }}>
          REPUBLIC OF ZIMBABWE - MINISTRY OF TOURISM
        </Title>
        <Title level={2} style={{ margin: '8px 0 0 0', fontFamily: 'Cinzel, serif', fontWeight: 800, color: '#1e1b4b' }}>
          COMPLIANCE GRID
        </Title>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 16 }}>
          <Tag color="red" style={{ margin: 0, fontWeight: 700, border: '1px solid #dc2626' }}>CONFIDENTIAL</Tag>
          <Tag color="blue" style={{ margin: 0, fontWeight: 700 }}>SECURE CONNECTION</Tag>
        </div>
      </div>

      {/* Page Header */}
      <div className="section-header">
        <div>
          <Space align="center">
            <Title level={4} style={{ margin: 0, color: '#1e1b4b', fontWeight: 800 }}>
              Operator Compliance Grid
            </Title>
            <span className="badge-live">LIVE</span>
          </Space>
          <Text style={{ fontSize: 12, color: '#64748b', display: 'block', marginTop: 2 }}>
            Real-time compliance monitoring across all registered operators
          </Text>
        </div>
        <Space>
          <Button icon={<DownloadOutlined />} style={{ borderColor: '#e2e8f0' }}>
            Export CSV
          </Button>
          <Button icon={<ExportOutlined />} style={{ borderColor: '#e2e8f0' }}>
            Generate Report
          </Button>
        </Space>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {[
          {
            title: 'Compliant Operators',
            value: compliantCount,
            icon: <CheckCircleOutlined />,
            color: '#059669',
            bg: 'rgba(5,150,105,0.06)',
            border: 'rgba(5,150,105,0.2)',
            filter: 'compliant',
          },
          {
            title: 'Amber (Approaching Issues)',
            value: amberCount,
            icon: <WarningOutlined />,
            color: '#f59e0b',
            bg: 'rgba(245,158,11,0.06)',
            border: 'rgba(245,158,11,0.2)',
            filter: 'amber',
          },
          {
            title: 'Non-Compliant (Red)',
            value: redCount,
            icon: <CloseCircleOutlined />,
            color: '#dc2626',
            bg: 'rgba(220,38,38,0.06)',
            border: 'rgba(220,38,38,0.2)',
            filter: 'red',
          },
          {
            title: 'Average Compliance',
            value: `${avgCompliance}%`,
            icon: <SafetyOutlined />,
            color: '#1e1b4b',
            bg: 'rgba(30,27,75,0.06)',
            border: 'rgba(30,27,75,0.2)',
            filter: null,
          },
        ].map((item, idx) => (
          <Col xs={12} sm={6} key={idx}>
            <div
              className={`kpi-card animate-fade-in-up stagger-${idx + 1}`}
              style={{
                cursor: item.filter ? 'pointer' : 'default',
                border: statusFilter === item.filter ? `2px solid ${item.color}` : '1px solid #e2e8f0',
                background: statusFilter === item.filter ? item.bg : '#fff',
              }}
              onClick={() => setStatusFilter(statusFilter === item.filter ? null : item.filter)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="kpi-label">{item.title}</div>
                  <div className="kpi-value" style={{ color: item.color, marginTop: 8 }}>{item.value}</div>
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.color, fontSize: 18,
                }}>
                  {item.icon}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Table Card */}
      <div className="gradient-border-card animate-fade-in-up stagger-5" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <Space>
              <Input
                prefix={<SearchOutlined style={{ color: '#64748b' }} />}
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 280 }}
                allowClear
              />
              {statusFilter && (
                <Button
                  size="small"
                  onClick={() => setStatusFilter(null)}
                  icon={<CloseCircleOutlined />}
                >
                  Clear filter
                </Button>
              )}
            </Space>
            <Space size={12}>
              <span style={{ fontSize: 11, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircleOutlined /> Compliant
              </span>
              <span style={{ fontSize: 11, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}>
                <WarningOutlined /> Amber
              </span>
              <span style={{ fontSize: 11, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CloseCircleOutlined /> Non-Compliant
              </span>
            </Space>
          </div>
        </div>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 15, showTotal: (t) => `${t} operators` }}
          rowClassName={(record) => record.status === 'red' ? 'ant-table-row-danger' : ''}
          scroll={{ x: 1200 }}
          size="small"
        />
      </div>

      {/* Audit Timeline Modal */}
      <AuditTimeline
        operator={selectedOperator}
        visible={auditModalVisible}
        onClose={() => {
          setAuditModalVisible(false);
          setSelectedOperator(null);
        }}
      />
    </div>
  );
};
