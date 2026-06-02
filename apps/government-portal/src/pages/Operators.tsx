import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Tag, Typography, Input, Space, Badge, Row, Col,
  Button, Select, Tooltip,
} from 'antd';
import {
  SearchOutlined, TeamOutlined, EyeOutlined,
  DownloadOutlined, CheckCircleOutlined,
  WarningOutlined, CloseCircleOutlined,
  AuditOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

/* ── CSV Export Utility ───────────────────────────────────── */
const downloadCSV = (data: Record<string, unknown>[], filename: string) => {
  const headers = ['ID', 'Name', 'Region', 'Status', 'Compliance Rate', 'Risk Score', 'Revenue', 'Bookings', 'Agents', 'BSP Connected', 'Last Active'];
  const rows = data.map((o) => [
    o.id, o.name, o.region, o.status, o.complianceRate, o.riskScore,
    o.totalRevenue, o.totalBookings, o.agents, o.bspConnected ? 'Yes' : 'No', o.lastActive,
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/* ── Data ─────────────────────────────────────────────────── */
const allOperators = Array.from({ length: 48 }, (_, i) => {
  const names = [
    'Victoria Falls Travel', 'Zimbabwe Safari Co', 'Great Zimbabwe Tours', 'Harare City Breaks',
    'Eastern Highlands Trek', 'Kariba Lakeside Lodge', 'Bulawayo Heritage Tours', 'Mana Pools Expeditions',
    'Hwange National Safaris', 'Gonarezhou Adventures', 'Lake Kariba Houseboats', 'Matobo Hills Trekking',
    'Zambezi River Rafting', 'Chimanimani Hiking', 'Bumi Hills Lodge', 'Antelope Park Safari',
  ];
  const statuses: ('compliant' | 'amber' | 'red')[] = ['compliant', 'amber', 'red'];
  const complianceRates = [98, 72, 34, 95, 91, 65, 93, 28, 87, 55, 78, 96, 44, 82, 71, 61];

  return {
    id: `OP-${String(i + 1).padStart(3, '0')}`,
    name: names[i % 16],
    email: `info@operator${i + 1}.co.zw`,
    status: statuses[i % 3],
    complianceRate: complianceRates[i % 16],
    totalRevenue: Math.floor(Math.random() * 500000) + 50000,
    totalBookings: Math.floor(Math.random() * 500) + 50,
    riskScore: Math.floor(Math.random() * 100),
    agents: Math.floor(Math.random() * 15) + 2,
    region: ['Victoria Falls', 'Harare', 'Bulawayo', 'Eastern Highlands', 'Kariba', 'Mana Pools'][i % 6],
    bspConnected: i % 3 !== 2,
    lastActive: ['2 hours ago', '1 day ago', '3 days ago', '1 week ago'][i % 4],
  };
});

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  compliant: { color: '#059669', bg: 'rgba(5,150,105,0.08)', icon: <CheckCircleOutlined />, label: 'COMPLIANT' },
  amber: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: <WarningOutlined />, label: 'AMBER' },
  red: { color: '#dc2626', bg: 'rgba(220,38,38,0.08)', icon: <CloseCircleOutlined />, label: 'NON-COMPLIANT' },
};

/* ── Compliance Ring ──────────────────────────────────────── */
const ComplianceRing: React.FC<{ percent: number; size?: number }> = ({ percent, size = 44 }) => {
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
        fontSize: 11, fontWeight: 700, color,
      }}>
        {percent}
      </span>
    </div>
  );
};

/* ── Operators Page ───────────────────────────────────────── */
export const Operators: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return allOperators.filter((o) => {
      const matchesSearch = o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || o.status === statusFilter;
      const matchesRegion = !regionFilter || o.region === regionFilter;
      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [search, statusFilter, regionFilter]);

  const compliantCount = filtered.filter((o) => o.status === 'compliant').length;
  const amberCount = filtered.filter((o) => o.status === 'amber').length;
  const redCount = filtered.filter((o) => o.status === 'red').length;

  const columns = [
    {
      title: 'Operator',
      dataIndex: 'name',
      key: 'name',
      width: 240,
      render: (v: string, r: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: statusConfig[r.status]?.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: statusConfig[r.status]?.color, fontSize: 14, fontWeight: 700,
            flexShrink: 0,
          }}>
            {r.name.charAt(0)}
          </div>
          <div>
            <a
              onClick={() => navigate(`/operators/${r.id}`)}
              style={{ fontSize: 13, fontWeight: 600, color: '#1e1b4b', cursor: 'pointer' }}
            >
              {v}
            </a>
            <div style={{ fontSize: 11, color: '#64748b' }}>{r.id} | {r.region}</div>
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
      dataIndex: 'complianceRate',
      key: 'compliance',
      width: 100,
      render: (v: number) => <ComplianceRing percent={v} />,
    },
    {
      title: 'Risk Score',
      dataIndex: 'riskScore',
      key: 'risk',
      width: 110,
      render: (v: number) => {
        const color = v > 60 ? '#dc2626' : v > 30 ? '#f59e0b' : '#059669';
        const bg = v > 60 ? 'rgba(220,38,38,0.08)' : v > 30 ? 'rgba(245,158,11,0.08)' : 'rgba(5,150,105,0.08)';
        return (
          <Tag style={{ background: bg, color, border: 'none', borderRadius: 6, fontWeight: 700, fontFamily: "'Inter', monospace" }}>
            {v}/100
          </Tag>
        );
      },
    },
    {
      title: 'Revenue',
      dataIndex: 'totalRevenue',
      key: 'revenue',
      width: 120,
      render: (v: number) => (
        <Text style={{ fontWeight: 600, fontFamily: "'Inter', monospace" }}>${v.toLocaleString()}</Text>
      ),
    },
    {
      title: 'Bookings',
      dataIndex: 'totalBookings',
      key: 'bookings',
      width: 80,
      render: (v: number) => <Text style={{ fontWeight: 600 }}>{v}</Text>,
    },
    {
      title: 'BSP',
      dataIndex: 'bspConnected',
      key: 'bsp',
      width: 90,
      render: (v: boolean) => (
        <Badge status={v ? 'success' : 'error'} text={
          <Text style={{ fontSize: 11, color: v ? '#059669' : '#dc2626' }}>
            {v ? 'Connected' : 'Offline'}
          </Text>
        } />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: any, r: any) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/operators/${r.id}`)} style={{ color: '#312e81' }} />
          </Tooltip>
          <Tooltip title="Schedule Audit">
            <Button type="text" size="small" icon={<AuditOutlined />} style={{ color: '#f59e0b' }} />
          </Tooltip>
        </Space>
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
          OPERATOR REGISTRY
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
              Operator Registry
            </Title>
            <span className="badge-live">LIVE</span>
          </Space>
          <Text style={{ fontSize: 12, color: '#64748b', display: 'block', marginTop: 2 }}>
            {allOperators.length} registered tourism operators across Zimbabwe
          </Text>
        </div>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            style={{ borderColor: '#e2e8f0' }}
            onClick={() => {
              const date = new Date().toISOString().split('T')[0];
              downloadCSV(filtered, `operators-registry-${date}.csv`);
            }}
          >
            Export CSV
          </Button>
        </Space>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {[
          {
            title: 'Total Operators',
            value: filtered.length,
            icon: <TeamOutlined />,
            iconBg: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            color: '#1e1b4b',
          },
          {
            title: 'Compliant',
            value: compliantCount,
            icon: <CheckCircleOutlined />,
            iconBg: 'linear-gradient(135deg, #059669, #10b981)',
            color: '#059669',
            filter: 'compliant',
          },
          {
            title: 'Amber',
            value: amberCount,
            icon: <WarningOutlined />,
            iconBg: 'linear-gradient(135deg, #d97706, #b45309)',
            color: '#f59e0b',
            filter: 'amber',
          },
          {
            title: 'Non-Compliant',
            value: redCount,
            icon: <CloseCircleOutlined />,
            iconBg: 'linear-gradient(135deg, #dc2626, #ef4444)',
            color: '#dc2626',
            filter: 'red',
          },
        ].map((item, idx) => (
          <Col xs={12} sm={6} key={idx}>
            <div
              className={`kpi-card animate-fade-in-up stagger-${idx + 1}`}
              style={{
                cursor: item.filter ? 'pointer' : 'default',
                border: statusFilter === item.filter ? `2px solid ${item.color}` : '1px solid #e2e8f0',
              }}
              onClick={() => item.filter && setStatusFilter(statusFilter === item.filter ? null : item.filter || null)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="kpi-label">{item.title}</div>
                  <div className="kpi-value" style={{ color: item.color, marginTop: 8 }}>{item.value}</div>
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', fontSize: 18,
                }}>
                  {item.icon}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Operator Cards Grid (Top 6) */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {allOperators.slice(0, 6).map((op, idx) => {
          const c = statusConfig[op.status];
          return (
            <Col xs={12} sm={8} lg={4} key={op.id}>
              <div
                className={`kpi-card animate-fade-in-up stagger-${idx + 1}`}
                style={{ cursor: 'pointer', padding: 14 }}
                onClick={() => navigate(`/operators/${op.id}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: c?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: c?.color, fontWeight: 700, fontSize: 13,
                  }}>
                    {op.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ fontSize: 12, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {op.name}
                    </Text>
                    <Text style={{ fontSize: 10, color: '#64748b' }}>{op.id}</Text>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ComplianceRing percent={op.complianceRate} size={36} />
                  <div style={{ textAlign: 'right' }}>
                    <Text style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Inter', monospace", display: 'block' }}>
                      ${(op.totalRevenue / 1000).toFixed(0)}k
                    </Text>
                    <Tag style={{
                      fontSize: 9, background: c?.bg, color: c?.color, border: 'none',
                      borderRadius: 4, padding: '0 6px',
                    }}>
                      {c?.label}
                    </Tag>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Full Table */}
      <div className="gradient-border-card animate-fade-in-up stagger-5" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <Space wrap>
              <Input
                prefix={<SearchOutlined style={{ color: '#64748b' }} />}
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 260 }}
                allowClear
              />
              <Select
                placeholder="Region"
                allowClear
                value={regionFilter}
                onChange={setRegionFilter}
                style={{ width: 160 }}
                options={[
                  { value: 'Victoria Falls', label: 'Victoria Falls' },
                  { value: 'Harare', label: 'Harare' },
                  { value: 'Bulawayo', label: 'Bulawayo' },
                  { value: 'Eastern Highlands', label: 'Eastern Highlands' },
                  { value: 'Kariba', label: 'Kariba' },
                  { value: 'Mana Pools', label: 'Mana Pools' },
                ]}
              />
              {(statusFilter || regionFilter) && (
                <Button
                  size="small"
                  onClick={() => { setStatusFilter(null); setRegionFilter(null); }}
                  icon={<CloseCircleOutlined />}
                >
                  Clear filters
                </Button>
              )}
            </Space>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              Showing {filtered.length} of {allOperators.length} operators
            </Text>
          </div>
        </div>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 15, showTotal: (t) => `${t} operators` }}
          rowClassName={(record) => record.status === 'red' ? 'ant-table-row-danger' : ''}
          scroll={{ x: 1100 }}
          size="small"
        />
      </div>
    </div>
  );
};
