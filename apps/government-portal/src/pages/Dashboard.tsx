import React, { useEffect, useState, useMemo } from 'react';
import { Row, Col, Typography, Progress, Table, Tag, Space, Alert } from 'antd';
import {
  DollarOutlined, TeamOutlined, WarningOutlined,
  ArrowUpOutlined, ArrowDownOutlined, SafetyOutlined,
  ThunderboltOutlined, EyeOutlined, BankOutlined,
  ClockCircleOutlined, CheckCircleOutlined,
  ExclamationCircleOutlined, FireOutlined, RocketOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { bookingsApi, complianceApi } from '../services/api';

const { Title, Text } = Typography;

/* ── Fallback Data ────────────────────────────────────────── */
const fallbackWeeklyData = [
  { day: 'Mon', revenue: 45200, bsp: 32100, leakage: 2100 },
  { day: 'Tue', revenue: 48300, bsp: 34500, leakage: 1800 },
  { day: 'Wed', revenue: 52100, bsp: 37800, leakage: 2400 },
  { day: 'Thu', revenue: 49800, bsp: 35200, leakage: 1900 },
  { day: 'Fri', revenue: 56700, bsp: 40100, leakage: 3200 },
  { day: 'Sat', revenue: 61200, bsp: 43800, leakage: 2800 },
  { day: 'Sun', revenue: 58400, bsp: 41900, leakage: 2100 },
];

const fallbackMonthlyTrend = [
  { month: 'Jan', revenue: 1450000, levy: 29000, leakage: 87000 },
  { month: 'Feb', revenue: 1380000, levy: 27600, leakage: 96000 },
  { month: 'Mar', revenue: 1620000, levy: 32400, leakage: 102000 },
  { month: 'Apr', revenue: 1580000, levy: 31600, leakage: 84000 },
  { month: 'May', revenue: 1720000, levy: 34400, leakage: 78000 },
  { month: 'Jun', revenue: 1850000, levy: 37000, leakage: 72000 },
];

const fallbackOperatorStatus = [
  { name: 'Victoria Falls Travel', status: 'compliant', revenue: 345000, rate: 98, trend: 'up' },
  { name: 'Zimbabwe Safari Co', status: 'amber', revenue: 234000, rate: 72, trend: 'down' },
  { name: 'Great Zimbabwe Tours', status: 'compliant', revenue: 189000, rate: 95, trend: 'up' },
  { name: 'Harare City Breaks', status: 'red', revenue: 89000, rate: 34, trend: 'down' },
  { name: 'Eastern Highlands Trek', status: 'compliant', revenue: 167000, rate: 91, trend: 'up' },
  { name: 'Kariba Lakeside Lodge', status: 'amber', revenue: 123000, rate: 65, trend: 'stable' },
  { name: 'Bulawayo Heritage Tours', status: 'compliant', revenue: 145000, rate: 93, trend: 'up' },
  { name: 'Mana Pools Expeditions', status: 'red', revenue: 56000, rate: 28, trend: 'down' },
];

const sparklineData = [
  [10, 15, 12, 18, 22, 20, 25, 28, 24, 30],
  [30, 28, 25, 22, 20, 18, 16, 15, 14, 13],
  [15, 18, 22, 20, 25, 28, 30, 32, 35, 38],
  [40, 38, 35, 30, 28, 25, 22, 20, 18, 16],
];

const complianceHeatmap = [
  { region: 'Victoria Falls', operators: 12, compliant: 10, amber: 1, red: 1 },
  { region: 'Harare', operators: 18, compliant: 12, amber: 4, red: 2 },
  { region: 'Bulawayo', operators: 8, compliant: 7, amber: 1, red: 0 },
  { region: 'Eastern Highlands', operators: 6, compliant: 5, amber: 0, red: 1 },
  { region: 'Kariba', operators: 10, compliant: 7, amber: 2, red: 1 },
  { region: 'Mana Pools', operators: 4, compliant: 2, amber: 1, red: 1 },
];

const aiInsights = [
  {
    type: 'critical',
    icon: <FireOutlined />,
    title: 'Revenue Leakage Spike Detected',
    description: 'Harare region shows 23% increase in unreported bookings this week. Cross-reference with BSP data indicates potential systematic under-reporting.',
    confidence: 94,
    time: '2 min ago',
  },
  {
    type: 'warning',
    icon: <ExclamationCircleOutlined />,
    title: 'Operator Risk Escalation',
    description: 'Mana Pools Expeditions risk score increased from 76 to 89 in 7 days. Pattern matches pre-audit behavior of previously sanctioned operators.',
    confidence: 88,
    time: '15 min ago',
  },
  {
    type: 'success',
    icon: <RocketOutlined />,
    title: 'Compliance Improvement Trend',
    description: 'Eastern Highlands region compliance rate improved by 8% following targeted outreach campaign. Model predicts sustained improvement.',
    confidence: 91,
    time: '1 hour ago',
  },
  {
    type: 'info',
    icon: <EyeOutlined />,
    title: 'Anomalous Booking Pattern',
    description: 'Detected unusual booking velocity from 3 new agents in Kariba region. Recommend enhanced monitoring for 30-day period.',
    confidence: 76,
    time: '3 hours ago',
  },
];

const recentAlerts = [
  { id: 1, severity: 'critical', message: 'Harare City Breaks: BSP disconnection detected', time: '5 min ago', status: 'active' },
  { id: 2, severity: 'high', message: 'Revenue capture dropped below 65% threshold', time: '22 min ago', status: 'active' },
  { id: 3, severity: 'medium', message: 'Kariba Lakeside Lodge: Late levy remittance (3 days)', time: '1 hour ago', status: 'investigating' },
  { id: 4, severity: 'low', message: 'System backup completed successfully', time: '2 hours ago', status: 'resolved' },
  { id: 5, severity: 'medium', message: 'New operator registration pending review: Zambezi Explorer', time: '3 hours ago', status: 'pending' },
];

/* ── Sparkline Component ──────────────────────────────────── */
const MiniSparkline: React.FC<{ data: number[]; color: string; height?: number; label?: string }> = ({ data, color, height = 32, label }) => {
  const chartData = data.map((v, i) => ({ x: i, y: v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }} role="img" aria-label={label || 'Sparkline trend chart'}>
        <defs>
          <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="y"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace('#', '')})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

/* ── Compliance Ring ──────────────────────────────────────── */
const ComplianceRing: React.FC<{ percent: number; size?: number }> = ({ percent, size = 48 }) => {
  const color = percent > 80 ? '#059669' : percent > 60 ? '#f59e0b' : '#dc2626';
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="score-ring-container" style={{ width: size, height: size }} role="img" aria-label={`Compliance score: ${percent}%`}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="score-text" style={{ color }}>{percent}</span>
    </div>
  );
};

/* ── Dashboard ────────────────────────────────────────────── */
export const Dashboard: React.FC = () => {
  const weeklyData = fallbackWeeklyData;
  const monthlyTrend = fallbackMonthlyTrend;
  const operatorStatus = fallbackOperatorStatus;
  const [stats, setStats] = useState({
    totalRevenue: 9600000,
    levyCollected: 192000,
    captureRate: 68,
    leakage: 4320000,
    operators: 128,
    active: 128,
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    Promise.all([
      bookingsApi.getRevenueStats().catch(() => null),
      complianceApi.getLeakage().catch(() => null),
    ]).then(([revenueData, leakageData]) => {
      if (revenueData) {
        const d = revenueData.data || revenueData;
        setStats((prev) => ({ ...prev, totalRevenue: d.totalRevenue ?? prev.totalRevenue }));
      }
      if (leakageData) {
        const d = leakageData.data || leakageData;
        setStats((prev) => ({ ...prev, leakage: d.estimatedLeakage ?? prev.leakage }));
      }
    }).finally(() => {
      setLastUpdated(new Date());
    });
  }, []);

  const timeAgo = useMemo(() => {
    const mins = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins === 1) return '1 minute ago';
    return `${mins} minutes ago`;
  }, [lastUpdated]);

  const opColumns = [
    {
      title: 'Operator',
      dataIndex: 'name',
      key: 'name',
      render: (v: string) => <Text strong style={{ fontSize: 13 }}>{v}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: string) => {
        const config: Record<string, { color: string; bg: string }> = {
          compliant: { color: '#059669', bg: 'rgba(5,150,105,0.1)' },
          amber: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
          red: { color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
        };
        const c = config[s] || config.compliant;
        return (
          <Tag style={{
            background: c.bg,
            color: c.color,
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 10,
            padding: '2px 8px',
          }}>
            {s.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (v: number) => (
        <Text style={{ fontWeight: 600, fontFamily: "'Inter', monospace" }}>
          ${v.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Compliance',
      dataIndex: 'rate',
      key: 'rate',
      width: 140,
      render: (v: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ComplianceRing percent={v} size={36} />
        </div>
      ),
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      width: 60,
      render: (v: string) => {
        if (v === 'up') return <ArrowUpOutlined style={{ color: '#059669', fontSize: 14 }} />;
        if (v === 'down') return <ArrowDownOutlined style={{ color: '#dc2626', fontSize: 14 }} />;
        return <span style={{ color: '#64748b' }}>--</span>;
      },
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="section-header" style={{ marginBottom: 24, borderBottom: '2px solid #1e1b4b', paddingBottom: 12 }}>
        <div>
          <Space align="center" style={{ marginBottom: 4 }}>
            <Title level={3} className="font-cinzel" style={{ margin: 0, color: '#1e1b4b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              REPUBLIC OF ZIMBABWE - MINISTRY OF TOURISM
            </Title>
            <span className="badge-live" style={{ marginLeft: 8 }}>SECURE CONNECTION</span>
          </Space>
          <Text className="font-cinzel" style={{ fontSize: 14, color: '#64748b', display: 'block', fontWeight: 600, letterSpacing: '0.5px' }}>
            NATIONAL COMMAND CENTER &bull; OFFICIAL OVERSIGHT DASHBOARD
          </Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClockCircleOutlined style={{ color: '#64748b', fontSize: 12 }} />
          <Text style={{ fontSize: 12, color: '#64748b' }}>Last updated: {timeAgo}</Text>
          {(() => {
            const mins = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
            const color = mins < 5 ? '#22c55e' : mins < 15 ? '#f59e0b' : '#ef4444';
            const label = mins < 5 ? 'Fresh' : mins < 15 ? 'Aging' : 'Stale';
            return (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                background: `${color}15`,
                borderRadius: 100,
                fontSize: 10,
                fontWeight: 600,
                color,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                {label}
              </span>
            );
          })()}
        </div>
      </div>

      {/* AI Alert Banner */}
      <div className="animate-fade-in-up stagger-1" style={{ marginBottom: 20 }}>
        <Alert
          type="warning"
          showIcon
          icon={<ThunderboltOutlined />}
          banner
          message={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Space>
                <span className="badge-ai">AI-POWERED</span>
                <Text style={{ fontSize: 13 }}>
                  Revenue capture rate at {stats.captureRate}% &mdash; ${(stats.leakage / 1_000_000).toFixed(2)}M estimated leakage this fiscal year
                </Text>
              </Space>
              <Tag color="orange" style={{ marginLeft: 16 }}>Action Required</Tag>
            </div>
          }
          description="72% of travel agencies operate outside official IATA BSP. ZimVisit compliance mandate would recover an estimated $150M+ annually."
          style={{
            borderRadius: 12,
            border: '1px solid rgba(245,158,11,0.3)',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.04), rgba(245,158,11,0.02))',
          }}
        />
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {[
          {
            label: 'Total Revenue (YTD)',
            value: `$${(stats.totalRevenue / 1_000_000).toFixed(1)}M`,
            change: '+12.4%',
            changeType: 'up',
            icon: <DollarOutlined />,
            iconBg: 'linear-gradient(135deg, #059669, #10b981)',
            iconColor: '#ffffff',
            sparkData: sparklineData[0],
            sparkColor: '#059669',
            stamp: 'ZTA VERIFIED',
            stampColor: 'stamp-green'
          },
          {
            label: 'Levy Collected',
            value: `$${(stats.levyCollected / 1_000).toFixed(0)}K`,
            change: '+8.2%',
            changeType: 'up',
            icon: <BankOutlined />,
            iconBg: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            iconColor: '#ffffff',
            sparkData: sparklineData[2],
            sparkColor: '#312e81',
            stamp: 'CONFIDENTIAL',
            stampColor: 'stamp-gold'
          },
          {
            label: 'Revenue Capture Rate',
            value: `${stats.captureRate}%`,
            change: '-2.1%',
            changeType: 'down',
            icon: <SafetyOutlined />,
            iconBg: 'linear-gradient(135deg, #d97706, #b45309)',
            iconColor: '#ffffff',
            sparkData: sparklineData[1],
            sparkColor: '#f59e0b',
            stamp: 'ZIMRA AUDIT',
            stampColor: 'stamp-red'
          },
          {
            label: 'Estimated Leakage',
            value: `$${(stats.leakage / 1_000_000).toFixed(1)}M`,
            change: '+5.7%',
            changeType: 'down',
            icon: <WarningOutlined />,
            iconBg: 'linear-gradient(135deg, #dc2626, #ef4444)',
            iconColor: '#ffffff',
            sparkData: sparklineData[3],
            sparkColor: '#dc2626',
            stamp: 'ACTION REQUIRED',
            stampColor: 'stamp-red'
          },
        ].map((kpi, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <div
              className={`kpi-card animate-fade-in-up stagger-${idx + 1}`}
              role="region"
              aria-label={`${kpi.label}: ${kpi.value}, ${kpi.change} vs last period`}
            >
              {kpi.stamp && (
                <div className={`official-stamp ${kpi.stampColor}`} style={{ top: 20, right: 10, transform: 'rotate(15deg)' }}>
                  {kpi.stamp}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="kpi-label">{kpi.label}</div>
                  <div className="kpi-value" style={{ color: '#1e1b4b', marginTop: 8 }}>{kpi.value}</div>
                  <div className={`kpi-change ${kpi.changeType}`}>
                    {kpi.changeType === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {kpi.change} vs last period
                  </div>
                </div>
                <div className="kpi-icon" style={{ background: kpi.iconBg, color: kpi.iconColor }}>
                  {kpi.icon}
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <MiniSparkline data={kpi.sparkData} color={kpi.sparkColor} height={36} label={`${kpi.label} trend`} />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Secondary KPIs */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <div className="kpi-card animate-fade-in-up stagger-5" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="kpi-label">Registered Operators</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', marginTop: 4 }}>
                  {stats.operators}
                  <Text style={{ fontSize: 13, color: '#64748b', fontWeight: 400 }}> / 480 total</Text>
                </div>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(30,27,75,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TeamOutlined style={{ fontSize: 18, color: '#1e1b4b' }} />
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="kpi-card animate-fade-in-up stagger-6" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="kpi-label">Active on Platform</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#059669', marginTop: 4 }}>
                  {stats.active}
                  <Tag color="green" style={{ marginLeft: 8, fontSize: 10 }}>ONLINE</Tag>
                </div>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(5,150,105,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircleOutlined style={{ fontSize: 18, color: '#059669' }} />
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="kpi-card animate-fade-in-up stagger-6" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="kpi-label">Compliance Rate</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', marginTop: 4 }}>
                  76.8%
                  <div style={{ marginTop: 4 }}>
                    <Progress percent={76.8} showInfo={false} strokeColor="#059669" size="small" />
                  </div>
                </div>
              </div>
              <ComplianceRing percent={77} size={48} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Weekly Revenue */}
        <Col xs={24} lg={12}>
          <div className="chart-container animate-fade-in-up stagger-3">
            <div className="chart-title">
              <Space>
                <Text strong style={{ color: '#1e1b4b' }}>Weekly Revenue vs BSP</Text>
                <span className="badge-live">LIVE</span>
              </Space>
              <Tag>7 days</Tag>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyData} barGap={4} role="img" aria-label="Weekly revenue versus BSP revenue bar chart for the last 7 days">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <RTooltip
                  contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                />
                <Bar dataKey="revenue" fill="#1e1b4b" radius={[4, 4, 0, 0]} name="Platform Revenue" />
                <Bar dataKey="bsp" fill="#312e81" radius={[4, 4, 0, 0]} name="BSP Revenue" opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>

        {/* Monthly Trend */}
        <Col xs={24} lg={12}>
          <div className="chart-container animate-fade-in-up stagger-4">
            <div className="chart-title">
              <Space>
                <Text strong style={{ color: '#1e1b4b' }}>Monthly Revenue & Leakage Trend</Text>
                <span className="badge-ai">AI ANALYZED</span>
              </Space>
              <Tag>6 months</Tag>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyTrend} role="img" aria-label="Monthly revenue and leakage trend area chart for the last 6 months">
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e1b4b" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#1e1b4b" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="leakageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                <RTooltip
                  contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1e1b4b" strokeWidth={2} fill="url(#revenueGrad)" name="Revenue" />
                <Area type="monotone" dataKey="leakage" stroke="#dc2626" strokeWidth={2} fill="url(#leakageGrad)" name="Leakage" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>

      {/* AI Insights + Alerts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* AI Insights */}
        <Col xs={24} lg={14}>
          <div className="gradient-border-card animate-fade-in-up stagger-4" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <Space>
                <ThunderboltOutlined style={{ color: '#f59e0b', fontSize: 16 }} />
                <Text strong style={{ fontSize: 14, color: '#1e1b4b' }}>AI Intelligence Feed</Text>
                <span className="badge-ai">AI-POWERED</span>
              </Space>
            </div>
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {aiInsights.map((insight, idx) => {
                const typeConfig: Record<string, { bg: string; border: string; iconColor: string }> = {
                  critical: { bg: 'rgba(220,38,38,0.04)', border: 'rgba(220,38,38,0.15)', iconColor: '#dc2626' },
                  warning: { bg: 'rgba(245,158,11,0.04)', border: 'rgba(245,158,11,0.15)', iconColor: '#f59e0b' },
                  success: { bg: 'rgba(5,150,105,0.04)', border: 'rgba(5,150,105,0.15)', iconColor: '#059669' },
                  info: { bg: 'rgba(49,46,129,0.04)', border: 'rgba(49,46,129,0.15)', iconColor: '#312e81' },
                };
                const c = typeConfig[insight.type] || typeConfig.info;
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '14px 20px',
                      borderBottom: '1px solid #f8fafc',
                      background: c.bg,
                      transition: 'background 0.2s',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: c.border,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: c.iconColor, fontSize: 14, flexShrink: 0,
                      }}>
                        {insight.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <Text strong style={{ fontSize: 13, color: '#1e293b' }}>{insight.title}</Text>
                          <Space size={8}>
                            <Tag style={{
                              fontSize: 10,
                              background: 'rgba(30,27,75,0.06)',
                              color: '#312e81',
                              border: 'none',
                            }}>
                              {insight.confidence}% conf.
                            </Tag>
                            <Text style={{ fontSize: 11, color: '#64748b' }}>{insight.time}</Text>
                          </Space>
                        </div>
                        <Text style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                          {insight.description}
                        </Text>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>

        {/* Recent Alerts */}
        <Col xs={24} lg={10}>
          <div className="gradient-border-card animate-fade-in-up stagger-5" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <Space>
                <WarningOutlined style={{ color: '#dc2626', fontSize: 16 }} />
                <Text strong style={{ fontSize: 14, color: '#1e1b4b' }}>Active Alerts</Text>
                <Tag color="red" style={{ fontSize: 10, marginLeft: 4 }}>
                  {recentAlerts.filter((a) => a.status === 'active').length} active
                </Tag>
              </Space>
            </div>
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {recentAlerts.map((alert) => {
                const sevConfig: Record<string, { bg: string; dot: string; label: string }> = {
                  critical: { bg: 'rgba(220,38,38,0.06)', dot: '#dc2626', label: 'CRITICAL' },
                  high: { bg: 'rgba(245,158,11,0.06)', dot: '#f59e0b', label: 'HIGH' },
                  medium: { bg: 'rgba(49,46,129,0.06)', dot: '#312e81', label: 'MEDIUM' },
                  low: { bg: 'rgba(5,150,105,0.04)', dot: '#059669', label: 'LOW' },
                };
                const c = sevConfig[alert.severity] || sevConfig.low;
                const statusColors: Record<string, string> = {
                  active: '#dc2626',
                  investigating: '#f59e0b',
                  pending: '#312e81',
                  resolved: '#059669',
                };
                return (
                  <div
                    key={alert.id}
                    role="alert"
                    aria-label={`${alert.severity} alert: ${alert.message}`}
                    style={{
                      padding: '12px 20px',
                      borderBottom: '1px solid #f8fafc',
                      background: alert.status === 'active' ? c.bg : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: c.dot, marginTop: 6, flexShrink: 0,
                      }} />
                      <div style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, color: '#1e293b', display: 'block' }}>{alert.message}</Text>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                          <Text style={{ fontSize: 11, color: '#64748b' }}>{alert.time}</Text>
                          <Tag style={{
                            fontSize: 9,
                            color: statusColors[alert.status] || '#64748b',
                            background: `${statusColors[alert.status] || '#64748b'}15`,
                            border: 'none',
                            padding: '0 6px',
                            borderRadius: 4,
                          }}>
                            {alert.status.toUpperCase()}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>

      {/* Compliance Heatmap + Operator Table */}
      <Row gutter={[16, 16]}>
        {/* Regional Compliance Heatmap */}
        <Col xs={24} lg={10}>
          <div className="gradient-border-card animate-fade-in-up stagger-5" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <Space>
                <SafetyOutlined style={{ color: '#1e1b4b', fontSize: 16 }} />
                <Text strong style={{ fontSize: 14, color: '#1e1b4b' }}>Regional Compliance Heatmap</Text>
              </Space>
            </div>
            <div style={{ padding: 16 }}>
              {complianceHeatmap.map((region) => {
                return (
                  <div key={region.region} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{region.region}</Text>
                      <Text style={{ fontSize: 12, color: '#64748b' }}>
                        {region.compliant}/{region.operators} compliant
                      </Text>
                    </div>
                    <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', background: '#f1f5f9' }}>
                      <div style={{ width: `${(region.compliant / region.operators) * 100}%`, background: '#059669', transition: 'width 0.6s ease' }} />
                      <div style={{ width: `${(region.amber / region.operators) * 100}%`, background: '#f59e0b', transition: 'width 0.6s ease' }} />
                      <div style={{ width: `${(region.red / region.operators) * 100}%`, background: '#dc2626', transition: 'width 0.6s ease' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: '#059669' }}>{region.compliant} ok</span>
                      <span style={{ fontSize: 10, color: '#f59e0b' }}>{region.amber} amber</span>
                      <span style={{ fontSize: 10, color: '#dc2626' }}>{region.red} red</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>

        {/* Operator Status Table */}
        <Col xs={24} lg={14}>
          <div className="gradient-border-card animate-fade-in-up stagger-6" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <TeamOutlined style={{ color: '#1e1b4b', fontSize: 16 }} />
                  <Text strong style={{ fontSize: 14, color: '#1e1b4b' }}>Operator Status Grid</Text>
                </Space>
                <Space>
                  <span style={{ fontSize: 11, color: '#059669' }}>{operatorStatus.filter((o) => o.status === 'compliant').length} compliant</span>
                  <span style={{ fontSize: 11, color: '#f59e0b' }}>{operatorStatus.filter((o) => o.status === 'amber').length} amber</span>
                  <span style={{ fontSize: 11, color: '#dc2626' }}>{operatorStatus.filter((o) => o.status === 'red').length} red</span>
                </Space>
              </div>
            </div>
            <Table
              dataSource={operatorStatus}
              columns={opColumns}
              rowKey="name"
              pagination={false}
              size="small"
              style={{ margin: 0 }}
              rowClassName={(record) =>
                record.status === 'red' ? 'ant-table-row-danger' : ''
              }
              aria-label="Operator compliance status grid"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
