import React from 'react';
import {
  Row, Col, Typography, Table, Tag, Alert, Space, Button,
} from 'antd';
import {
  WarningOutlined, RiseOutlined,
  ThunderboltOutlined, EyeOutlined, ClockCircleOutlined,
  DownloadOutlined, FireOutlined, ExclamationCircleOutlined,
  CheckCircleOutlined, RobotOutlined, LineChartOutlined,
  ArrowUpOutlined, ArrowDownOutlined, MinusOutlined,
} from '@ant-design/icons';
import {
  Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area,
  Line, ComposedChart,
} from 'recharts';

const { Title, Text } = Typography;

/* ── Data ─────────────────────────────────────────────────── */
const riskPredictions = [
  { operatorId: 'OP-008', operatorName: 'Mana Pools Expeditions', riskScore: 89, riskLevel: 'critical' as const, predictedLeakage: 124000, confidence: 94, topFactors: ['BSP bypass detected', 'Offshore payments', 'No compliance history'], recommendedAction: 'Immediate audit required', trend: 'up' },
  { operatorId: 'OP-004', operatorName: 'Harare City Breaks', riskScore: 76, riskLevel: 'high' as const, predictedLeakage: 89000, confidence: 88, topFactors: ['Late remittances (3 months)', 'BSP reference mismatch', 'Agent velocity anomaly'], recommendedAction: 'Schedule compliance audit within 14 days', trend: 'up' },
  { operatorId: 'OP-014', operatorName: 'Chimanimani Hiking', riskScore: 68, riskLevel: 'high' as const, predictedLeakage: 45000, confidence: 82, topFactors: ['New operator - no track record', 'Unusual booking patterns'], recommendedAction: 'Enhanced monitoring for 90 days', trend: 'stable' },
  { operatorId: 'OP-010', operatorName: 'Gonarezhou Adventures', riskScore: 55, riskLevel: 'medium' as const, predictedLeakage: 28000, confidence: 76, topFactors: ['Inconsistent reporting', 'Agent trust score declining'], recommendedAction: 'Request updated compliance documentation', trend: 'down' },
  { operatorId: 'OP-006', operatorName: 'Kariba Lakeside Lodge', riskScore: 45, riskLevel: 'medium' as const, predictedLeakage: 12000, confidence: 71, topFactors: ['Seasonal booking gaps'], recommendedAction: 'Standard quarterly review', trend: 'stable' },
  { operatorId: 'OP-012', operatorName: 'Matobo Hills Trekking', riskScore: 32, riskLevel: 'low' as const, predictedLeakage: 5000, confidence: 85, topFactors: ['Minor variance in levy calculation'], recommendedAction: 'No action required', trend: 'down' },
  { operatorId: 'OP-003', operatorName: 'Great Zimbabwe Tours', riskScore: 18, riskLevel: 'low' as const, predictedLeakage: 2000, confidence: 92, topFactors: [], recommendedAction: 'Exemplary compliance - no action', trend: 'stable' },
  { operatorId: 'OP-001', operatorName: 'Victoria Falls Travel', riskScore: 45, riskLevel: 'medium' as const, predictedLeakage: 15000, confidence: 78, topFactors: ['3 late remittances in past year'], recommendedAction: 'Send compliance reminder', trend: 'down' },
];

const riskDistribution = [
  { name: 'Low Risk', value: 18, color: '#059669' },
  { name: 'Medium Risk', value: 15, color: '#f59e0b' },
  { name: 'High Risk', value: 10, color: '#f97316' },
  { name: 'Critical', value: 5, color: '#dc2626' },
];

const quarterlyForecast = [
  { quarter: 'Q3 2026', predictedRevenue: 5200000, predictedLeakage: 480000, confidenceLow: 4400000, confidenceHigh: 6100000 },
  { quarter: 'Q4 2026', predictedRevenue: 5800000, predictedLeakage: 520000, confidenceLow: 4900000, confidenceHigh: 6800000 },
  { quarter: 'Q1 2027', predictedRevenue: 4900000, predictedLeakage: 560000, confidenceLow: 4100000, confidenceHigh: 5800000 },
];

const riskHeatmap = [
  { factor: 'BSP Bypass', operators: 5, severity: 9.2, trend: 'up' },
  { factor: 'Late Remittance', operators: 8, severity: 6.5, trend: 'stable' },
  { factor: 'Offshore Payments', operators: 3, severity: 8.8, trend: 'up' },
  { factor: 'Under-reporting', operators: 12, severity: 7.1, trend: 'down' },
  { factor: 'Agent Anomaly', operators: 6, severity: 5.4, trend: 'up' },
  { factor: 'Doc Non-compliance', operators: 15, severity: 4.2, trend: 'down' },
  { factor: 'Levy Calculation Error', operators: 9, severity: 3.8, trend: 'stable' },
];

const confidenceTimeline = [
  { month: 'Jul', predicted: 5200000, low: 4400000, high: 6100000, actual: null },
  { month: 'Aug', predicted: 5400000, low: 4500000, high: 6400000, actual: null },
  { month: 'Sep', predicted: 5100000, low: 4200000, high: 6100000, actual: null },
  { month: 'Oct', predicted: 5800000, low: 4900000, high: 6800000, actual: null },
  { month: 'Nov', predicted: 5600000, low: 4700000, high: 6600000, actual: null },
  { month: 'Dec', predicted: 6200000, low: 5200000, high: 7300000, actual: null },
];

/* ── Risk Level Config ────────────────────────────────────── */
const riskLevelConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  critical: { color: '#dc2626', bg: 'rgba(220,38,38,0.08)', icon: <FireOutlined />, label: 'CRITICAL' },
  high: { color: '#f97316', bg: 'rgba(249,115,22,0.08)', icon: <ExclamationCircleOutlined />, label: 'HIGH' },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: <WarningOutlined />, label: 'MEDIUM' },
  low: { color: '#059669', bg: 'rgba(5,150,105,0.08)', icon: <CheckCircleOutlined />, label: 'LOW' },
};

/* ── Risk Forecast Page ───────────────────────────────────── */
export const RiskForecast: React.FC = () => {
  const totalPredictedLeakage = riskPredictions.reduce((sum, r) => sum + r.predictedLeakage, 0);
  const criticalCount = riskPredictions.filter((r) => r.riskLevel === 'critical').length;
  const highCount = riskPredictions.filter((r) => r.riskLevel === 'high').length;
  const avgConfidence = Math.round(riskPredictions.reduce((sum, r) => sum + r.confidence, 0) / riskPredictions.length);

  const columns = [
    {
      title: 'Operator',
      dataIndex: 'operatorName',
      key: 'name',
      width: 200,
      render: (v: string, r: any) => (
        <div>
          <Text strong style={{ fontSize: 13, display: 'block' }}>{v}</Text>
          <Text style={{ fontSize: 11, color: '#94a3b8' }}>{r.operatorId}</Text>
        </div>
      ),
    },
    {
      title: 'Risk Level',
      dataIndex: 'riskLevel',
      key: 'risk',
      width: 110,
      render: (v: string) => {
        const c = riskLevelConfig[v];
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
      title: 'Risk Score',
      dataIndex: 'riskScore',
      key: 'score',
      width: 140,
      render: (v: number) => {
        const color = v > 70 ? '#dc2626' : v > 40 ? '#f59e0b' : '#059669';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${v}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
            </div>
            <Text style={{ fontSize: 12, fontWeight: 700, color, minWidth: 36 }}>{v}/100</Text>
          </div>
        );
      },
    },
    {
      title: 'Predicted Leakage',
      dataIndex: 'predictedLeakage',
      key: 'leakage',
      width: 130,
      render: (v: number) => (
        <Text style={{ fontWeight: 700, fontFamily: "'Inter', monospace", color: '#dc2626' }}>
          ${v.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 90,
      render: (v: number) => {
        const color = v > 85 ? '#059669' : v > 70 ? '#f59e0b' : '#dc2626';
        return (
          <Tag style={{ background: `${color}15`, color, border: 'none', borderRadius: 6, fontWeight: 700 }}>
            {v}%
          </Tag>
        );
      },
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      width: 70,
      render: (v: string) => {
        if (v === 'up') return <ArrowUpOutlined style={{ color: '#dc2626', fontSize: 14 }} />;
        if (v === 'down') return <ArrowDownOutlined style={{ color: '#059669', fontSize: 14 }} />;
        return <MinusOutlined style={{ color: '#94a3b8', fontSize: 14 }} />;
      },
    },
    {
      title: 'Risk Factors',
      dataIndex: 'topFactors',
      key: 'factors',
      width: 220,
      render: (v: string[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {v.slice(0, 2).map((f, i) => (
            <Tag key={i} style={{
              fontSize: 10,
              background: 'rgba(30,27,75,0.06)',
              color: '#312e81',
              border: 'none',
              borderRadius: 4,
              maxWidth: 100,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {f}
            </Tag>
          ))}
          {v.length > 2 && (
            <Tag style={{ fontSize: 10, background: '#f1f5f9', border: 'none', borderRadius: 4 }}>
              +{v.length - 2}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'recommendedAction',
      key: 'action',
      width: 180,
      render: (v: string) => <Text style={{ fontSize: 12, color: '#475569' }}>{v}</Text>,
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="section-header">
        <div>
          <Space align="center">
            <Title level={4} style={{ margin: 0, color: '#1e1b4b', fontWeight: 800 }}>
              Predictive Risk Forecaster
            </Title>
            <span className="badge-ai">AI-POWERED</span>
            <span className="badge-live">LIVE</span>
          </Space>
          <Text style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginTop: 2 }}>
            Machine learning-driven risk assessment and revenue leakage prediction
          </Text>
        </div>
        <Space>
          <Button icon={<DownloadOutlined />} style={{ borderColor: '#e2e8f0' }}>
            Export Report
          </Button>
        </Space>
      </div>

      {/* Critical Alert */}
      {criticalCount > 0 && (
        <div className="animate-fade-in-up stagger-1" style={{ marginBottom: 20 }}>
          <Alert
            type="error"
            showIcon
            icon={<FireOutlined />}
            banner
            message={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space>
                  <span className="badge-ai">AI ALERT</span>
                  <Text style={{ fontSize: 13 }}>
                    {criticalCount} operator(s) flagged as critical risk &mdash; estimated ${totalPredictedLeakage.toLocaleString()} potential leakage
                  </Text>
                </Space>
                <Tag color="red" style={{ marginLeft: 16 }}>Immediate Action</Tag>
              </div>
            }
            description="Recommended: Immediate compliance audits for all critical-risk operators. Pattern analysis suggests systematic BSP bypass in Mana Pools region."
            style={{
              borderRadius: 12,
              border: '1px solid rgba(220,38,38,0.3)',
              background: 'linear-gradient(135deg, rgba(220,38,38,0.04), rgba(220,38,38,0.02))',
            }}
          />
        </div>
      )}

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {[
          {
            label: 'Predicted Leakage (Next Q)',
            value: `$${(totalPredictedLeakage / 1000).toFixed(0)}K`,
            icon: <WarningOutlined />,
            iconBg: 'linear-gradient(135deg, #dc2626, #ef4444)',
            color: '#dc2626',
            change: '+5.7%',
            changeType: 'up',
          },
          {
            label: 'Avg Confidence Score',
            value: `${avgConfidence}%`,
            icon: <RiseOutlined />,
            iconBg: 'linear-gradient(135deg, #059669, #10b981)',
            color: '#059669',
            change: '+3.2%',
            changeType: 'up',
          },
          {
            label: 'High/Critical Risk Operators',
            value: `${criticalCount + highCount}`,
            icon: <FireOutlined />,
            iconBg: 'linear-gradient(135deg, #f97316, #fb923c)',
            color: '#f97316',
            change: '+1',
            changeType: 'up',
          },
          {
            label: 'Model Accuracy (YTD)',
            value: '91%',
            icon: <RobotOutlined />,
            iconBg: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            color: '#1e1b4b',
            change: '+2.4%',
            changeType: 'up',
          },
        ].map((kpi, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <div className={`kpi-card animate-fade-in-up stagger-${idx + 1}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="kpi-label">{kpi.label}</div>
                  <div className="kpi-value" style={{ color: '#1e1b4b', marginTop: 8 }}>{kpi.value}</div>
                  <div className={`kpi-change ${kpi.changeType}`}>
                    {kpi.changeType === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {kpi.change}
                  </div>
                </div>
                <div className="kpi-icon" style={{ background: kpi.iconBg, color: '#ffffff' }}>
                  {kpi.icon}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Risk Distribution */}
        <Col xs={24} lg={8}>
          <div className="gradient-border-card animate-fade-in-up stagger-3" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <Text strong style={{ fontSize: 14, color: '#1e1b4b' }}>Risk Distribution</Text>
            </div>
            <div style={{ padding: 16 }}>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    dataKey="value"
                    paddingAngle={3}
                    label={({ value }) => `${value}`}
                  >
                    {riskDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <RTooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                    formatter={(value: number, name: string) => [`${value} operators`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
                {riskDistribution.map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                    <Text style={{ fontSize: 11, color: '#64748b' }}>{item.name}</Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>

        {/* Quarterly Forecast with Confidence Intervals */}
        <Col xs={24} lg={16}>
          <div className="gradient-border-card animate-fade-in-up stagger-4" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <Text strong style={{ fontSize: 14, color: '#1e1b4b' }}>Quarterly Forecast with Confidence Intervals</Text>
                  <span className="badge-ai">AI-POWERED</span>
                </Space>
                <Tag>95% confidence</Tag>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={quarterlyForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                  <RTooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                    formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="confidenceHigh" stroke="transparent" fill="rgba(30,27,75,0.06)" name="Confidence High" />
                  <Area type="monotone" dataKey="confidenceLow" stroke="transparent" fill="#ffffff" name="Confidence Low" />
                  <Bar dataKey="predictedRevenue" fill="#1e1b4b" radius={[4, 4, 0, 0]} name="Predicted Revenue" />
                  <Bar dataKey="predictedLeakage" fill="#dc2626" radius={[4, 4, 0, 0]} name="Predicted Leakage" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
      </Row>

      {/* Risk Heatmap + Confidence Timeline */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Risk Factor Heatmap */}
        <Col xs={24} lg={10}>
          <div className="gradient-border-card animate-fade-in-up stagger-4" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <Space>
                <ThunderboltOutlined style={{ color: '#f59e0b', fontSize: 16 }} />
                <Text strong style={{ fontSize: 14, color: '#1e1b4b' }}>Risk Factor Heatmap</Text>
              </Space>
            </div>
            <div style={{ padding: 16 }}>
              {riskHeatmap.map((factor, idx) => {
                const severityColor = factor.severity > 8 ? '#dc2626' : factor.severity > 6 ? '#f59e0b' : factor.severity > 4 ? '#f97316' : '#059669';
                const barWidth = (factor.severity / 10) * 100;
                return (
                  <div key={idx} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{factor.factor}</Text>
                      <Space size={8}>
                        <Text style={{ fontSize: 11, color: '#64748b' }}>{factor.operators} operators</Text>
                        <Text style={{ fontSize: 11, fontWeight: 700, color: severityColor }}>{factor.severity}/10</Text>
                      </Space>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        width: `${barWidth}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${severityColor}80, ${severityColor})`,
                        borderRadius: 4,
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                      <Text style={{ fontSize: 10, color: '#94a3b8' }}>
                        {factor.trend === 'up' ? 'Trending up' : factor.trend === 'down' ? 'Trending down' : 'Stable'}
                        {factor.trend === 'up' && <ArrowUpOutlined style={{ fontSize: 10, color: '#dc2626', marginLeft: 4 }} />}
                        {factor.trend === 'down' && <ArrowDownOutlined style={{ fontSize: 10, color: '#059669', marginLeft: 4 }} />}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>

        {/* Forecast Confidence Timeline */}
        <Col xs={24} lg={14}>
          <div className="gradient-border-card animate-fade-in-up stagger-5" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <LineChartOutlined style={{ color: '#1e1b4b', fontSize: 16 }} />
                  <Text strong style={{ fontSize: 14, color: '#1e1b4b' }}>6-Month Forecast with Confidence Band</Text>
                </Space>
                <span className="badge-ai">AI-POWERED</span>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={confidenceTimeline}>
                  <defs>
                    <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e1b4b" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#1e1b4b" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                  <RTooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                    formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="high" stroke="transparent" fill="rgba(30,27,75,0.06)" name="Upper Bound" />
                  <Area type="monotone" dataKey="low" stroke="transparent" fill="#ffffff" name="Lower Bound" />
                  <Line type="monotone" dataKey="predicted" stroke="#1e1b4b" strokeWidth={2.5} dot={{ fill: '#1e1b4b', r: 5, strokeWidth: 2, stroke: '#fff' }} name="Predicted" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
      </Row>

      {/* Operator Risk Table */}
      <div className="gradient-border-card animate-fade-in-up stagger-6" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <EyeOutlined style={{ color: '#1e1b4b', fontSize: 16 }} />
              <Text strong style={{ fontSize: 14, color: '#1e1b4b' }}>Operator Risk Assessment</Text>
              <span className="badge-ai">AI-POWERED</span>
            </Space>
            <Space>
              <ClockCircleOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
              <Text style={{ fontSize: 12, color: '#94a3b8' }}>Model updated: 1 hour ago</Text>
            </Space>
          </div>
        </div>
        <Table
          dataSource={riskPredictions}
          columns={columns}
          rowKey="operatorId"
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '12px 0' }}>
                <Row gutter={[16, 12]}>
                  <Col span={12}>
                    <Text strong style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 8 }}>Risk Factors</Text>
                    {record.topFactors.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {record.topFactors.map((f, i) => (
                          <li key={i} style={{ fontSize: 12, color: '#1e293b', marginBottom: 4 }}>{f}</li>
                        ))}
                      </ul>
                    ) : (
                      <Text style={{ fontSize: 12, color: '#059669' }}>No significant risk factors identified</Text>
                    )}
                  </Col>
                  <Col span={12}>
                    <Text strong style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 8 }}>Recommended Action</Text>
                    <Tag style={{
                      background: riskLevelConfig[record.riskLevel]?.bg,
                      color: riskLevelConfig[record.riskLevel]?.color,
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 12px',
                    }}>
                      {record.recommendedAction}
                    </Tag>
                  </Col>
                </Row>
              </div>
            ),
          }}
          rowClassName={(record) => record.riskLevel === 'critical' ? 'ant-table-row-danger' : ''}
          scroll={{ x: 1100 }}
          size="small"
        />
      </div>
    </div>
  );
};
