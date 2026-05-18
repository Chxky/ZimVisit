import React, { useState } from 'react';
import { Row, Col, Typography, Tag, Space, Button, Tabs, Table, Select } from 'antd';
import {
  DollarOutlined, FallOutlined, BankOutlined,
  DownloadOutlined, BarChartOutlined, LineChartOutlined,
  ArrowUpOutlined, ArrowDownOutlined,
  ClockCircleOutlined, PercentageOutlined, FundOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, AreaChart, Area, Line,
  PieChart, Pie, Cell, Legend, ComposedChart,
} from 'recharts';

const { Title, Text } = Typography;

/* ── Data ─────────────────────────────────────────────────── */
const monthlyData = [
  { month: 'Jan', platform: 1450000, bsp: 980000, levy: 29000, leakage: 87000, vat: 217500 },
  { month: 'Feb', platform: 1380000, bsp: 920000, levy: 27600, leakage: 96000, vat: 207000 },
  { month: 'Mar', platform: 1620000, bsp: 1100000, levy: 32400, leakage: 102000, vat: 243000 },
  { month: 'Apr', platform: 1580000, bsp: 1050000, levy: 31600, leakage: 84000, vat: 237000 },
  { month: 'May', platform: 1720000, bsp: 1180000, levy: 34400, leakage: 78000, vat: 258000 },
  { month: 'Jun', platform: 1850000, bsp: 1250000, levy: 37000, leakage: 72000, vat: 277500 },
];

const comparisonData = [
  { year: '2022', official: 8200000, estimated: 14500000, capture: 57 },
  { year: '2023', official: 9100000, estimated: 16200000, capture: 56 },
  { year: '2024', official: 10500000, estimated: 17800000, capture: 59 },
  { year: '2025', official: 11200000, estimated: 19000000, capture: 61 },
  { year: '2026', official: 9600000, estimated: 16000000, capture: 68 },
];

const taxBreakdown = [
  { category: 'Tourism Levy (2%)', collected: 192000, expected: 320000, gap: 128000, rate: 60 },
  { category: 'VAT (15%)', collected: 1440000, expected: 2400000, gap: 960000, rate: 60 },
  { category: 'BSP Fees (3%)', collected: 288000, expected: 480000, gap: 192000, rate: 60 },
  { category: 'Corporate Tax', collected: 2150000, expected: 3800000, gap: 1650000, rate: 57 },
];

const waterfallData = [
  { name: 'Gross Revenue', value: 9600000, fill: '#1e1b4b' },
  { name: 'BSP Leakage', value: -4320000, fill: '#dc2626' },
  { name: 'Net Reported', value: 5280000, fill: '#312e81' },
  { name: 'Levy (2%)', value: -192000, fill: '#f59e0b' },
  { name: 'VAT (15%)', value: -1440000, fill: '#f59e0b' },
  { name: 'Corporate Tax', value: -2150000, fill: '#f59e0b' },
  { name: 'Net Operator Revenue', value: 1498000, fill: '#059669' },
];

const revenueByRegion = [
  { name: 'Victoria Falls', value: 3450000, color: '#1e1b4b' },
  { name: 'Harare', value: 2800000, color: '#312e81' },
  { name: 'Bulawayo', value: 1200000, color: '#4338ca' },
  { name: 'Eastern Highlands', value: 980000, color: '#6366f1' },
  { name: 'Kariba', value: 780000, color: '#818cf8' },
  { name: 'Mana Pools', value: 390000, color: '#a5b4fc' },
];

const weeklyComparison = [
  { week: 'W1', current: 320000, previous: 290000 },
  { week: 'W2', current: 345000, previous: 310000 },
  { week: 'W3', current: 380000, previous: 325000 },
  { week: 'W4', current: 365000, previous: 340000 },
  { week: 'W5', current: 410000, previous: 355000 },
  { week: 'W6', current: 395000, previous: 370000 },
  { week: 'W7', current: 425000, previous: 380000 },
  { week: 'W8', current: 450000, previous: 395000 },
];

/* ── KPI Card ─────────────────────────────────────────────── */
const RevenueKPI: React.FC<{
  label: string; value: string; change: string; changeType: 'up' | 'down';
  icon: React.ReactNode; iconBg: string; delay: number;
}> = ({ label, value, change, changeType, icon, iconBg, delay }) => (
  <div className={`kpi-card animate-fade-in-up`} style={{ animationDelay: `${delay * 0.05}s`, opacity: 0 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div className="kpi-label">{label}</div>
        <div className="kpi-value" style={{ color: '#1e1b4b', marginTop: 8 }}>{value}</div>
        <div className={`kpi-change ${changeType}`}>
          {changeType === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {change} vs last year
        </div>
      </div>
      <div className="kpi-icon" style={{ background: iconBg, color: '#ffffff' }}>
        {icon}
      </div>
    </div>
  </div>
);

/* ── Revenue Page ─────────────────────────────────────────── */
export const Revenue: React.FC = () => {
  const [period, setPeriod] = useState('ytd');

  const taxColumns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (v: string) => <Text strong style={{ fontSize: 13 }}>{v}</Text>,
    },
    {
      title: 'Collected',
      dataIndex: 'collected',
      key: 'collected',
      render: (v: number) => <Text style={{ fontWeight: 600, fontFamily: "'Inter', monospace" }}>${v.toLocaleString()}</Text>,
    },
    {
      title: 'Expected',
      dataIndex: 'expected',
      key: 'expected',
      render: (v: number) => <Text style={{ fontFamily: "'Inter', monospace" }}>${v.toLocaleString()}</Text>,
    },
    {
      title: 'Gap',
      dataIndex: 'gap',
      key: 'gap',
      render: (v: number) => (
        <Tag style={{
          background: 'rgba(220,38,38,0.08)',
          color: '#dc2626',
          border: 'none',
          borderRadius: 6,
          fontWeight: 700,
          fontFamily: "'Inter', monospace",
        }}>
          -${v.toLocaleString()}
        </Tag>
      ),
    },
    {
      title: 'Capture Rate',
      key: 'rate',
      width: 120,
      render: (_: any, r: any) => {
        const rate = Math.round((r.collected / r.expected) * 100);
        const color = rate > 70 ? '#059669' : rate > 50 ? '#f59e0b' : '#dc2626';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${rate}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
            </div>
            <Text style={{ fontSize: 12, fontWeight: 700, color, minWidth: 36 }}>{rate}%</Text>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="section-header">
        <div>
          <Space align="center">
            <Title level={4} style={{ margin: 0, color: '#1e1b4b', fontWeight: 800 }}>
              Revenue Analytics
            </Title>
            <span className="badge-live">LIVE</span>
          </Space>
          <Text style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginTop: 2 }}>
            Comprehensive tourism revenue tracking and tax collection analysis
          </Text>
        </div>
        <Space>
          <Select value={period} onChange={setPeriod} style={{ width: 140 }} options={[
            { value: 'ytd', label: 'Year to Date' },
            { value: 'q2', label: 'Q2 2026' },
            { value: 'q1', label: 'Q1 2026' },
            { value: '2025', label: 'Full Year 2025' },
          ]} />
          <Button icon={<DownloadOutlined />} style={{ borderColor: '#e2e8f0' }}>
            Export
          </Button>
        </Space>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <RevenueKPI label="Platform Revenue (YTD)" value="$9.6M" change="+12.4%" changeType="up" icon={<DollarOutlined />} iconBg="linear-gradient(135deg, #059669, #10b981)" delay={1} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <RevenueKPI label="BSP Revenue (YTD)" value="$6.48M" change="+8.7%" changeType="up" icon={<BankOutlined />} iconBg="linear-gradient(135deg, #1e1b4b, #312e81)" delay={2} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <RevenueKPI label="Levy Collected" value="$192K" change="+15.2%" changeType="up" icon={<FundOutlined />} iconBg="linear-gradient(135deg, #f59e0b, #fbbf24)" delay={3} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <RevenueKPI label="Revenue Capture Rate" value="68%" change="-2.1%" changeType="down" icon={<PercentageOutlined />} iconBg="linear-gradient(135deg, #dc2626, #ef4444)" delay={4} />
        </Col>
      </Row>

      {/* Charts Tabs */}
      <div className="gradient-border-card animate-fade-in-up stagger-4" style={{ padding: 0, marginBottom: 20 }}>
        <Tabs
          defaultActiveKey="overview"
          style={{ padding: '0 20px' }}
          items={[
            {
              key: 'overview',
              label: (
                <Space>
                  <BarChartOutlined />
                  <span>Revenue Overview</span>
                </Space>
              ),
              children: (
                <Row gutter={[20, 20]} style={{ paddingBottom: 20 }}>
                  <Col xs={24} lg={12}>
                    <div className="chart-title" style={{ marginBottom: 16 }}>
                      <Text strong style={{ color: '#1e1b4b' }}>Platform vs BSP Revenue</Text>
                      <Tag>Monthly</Tag>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                        <RTooltip
                          contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                          formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                        />
                        <Legend />
                        <Bar dataKey="platform" fill="#1e1b4b" radius={[4, 4, 0, 0]} name="Platform Revenue" />
                        <Bar dataKey="bsp" fill="#312e81" radius={[4, 4, 0, 0]} name="Official IATA BSP" opacity={0.7} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Col>
                  <Col xs={24} lg={12}>
                    <div className="chart-title" style={{ marginBottom: 16 }}>
                      <Text strong style={{ color: '#1e1b4b' }}>Revenue by Region</Text>
                      <Tag>Distribution</Tag>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={revenueByRegion}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          dataKey="value"
                          paddingAngle={2}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {revenueByRegion.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <RTooltip
                          contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'trends',
              label: (
                <Space>
                  <LineChartOutlined />
                  <span>Trend Analysis</span>
                </Space>
              ),
              children: (
                <Row gutter={[20, 20]} style={{ paddingBottom: 20 }}>
                  <Col xs={24} lg={12}>
                    <div className="chart-title" style={{ marginBottom: 16 }}>
                      <div>
                        <Text strong style={{ color: '#1e1b4b' }}>Revenue Capture Rate Trend</Text>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Official vs Estimated Total Market</div>
                      </div>
                      <span className="badge-ai">AI ANALYZED</span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={comparisonData}>
                        <defs>
                          <linearGradient id="officialGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#312e81" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#312e81" stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="estGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#dc2626" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#dc2626" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} />
                        <RTooltip
                          contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                          formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="official" stroke="#312e81" strokeWidth={2} fill="url(#officialGrad)" name="Official BSP" />
                        <Area type="monotone" dataKey="estimated" stroke="#dc2626" strokeWidth={2} fill="url(#estGrad)" name="Estimated Total" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Col>
                  <Col xs={24} lg={12}>
                    <div className="chart-title" style={{ marginBottom: 16 }}>
                      <Text strong style={{ color: '#1e1b4b' }}>Week-over-Week Comparison</Text>
                      <Tag>Current vs Previous Period</Tag>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={weeklyComparison}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                        <RTooltip
                          contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                          formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                        />
                        <Legend />
                        <Bar dataKey="previous" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Previous Period" />
                        <Line type="monotone" dataKey="current" stroke="#1e1b4b" strokeWidth={2} dot={{ fill: '#1e1b4b', r: 4 }} name="Current Period" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'waterfall',
              label: (
                <Space>
                  <FundOutlined />
                  <span>Tax Waterfall</span>
                </Space>
              ),
              children: (
                <div style={{ paddingBottom: 20 }}>
                  <div className="chart-title" style={{ marginBottom: 16 }}>
                    <div>
                      <Text strong style={{ color: '#1e1b4b' }}>Revenue Waterfall: Gross to Net</Text>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Shows how gross revenue flows through deductions to net operator revenue</div>
                    </div>
                    <span className="badge-ai">AI-POWERED</span>
                  </div>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                      <RTooltip
                        contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                        formatter={(value: number) => [`$${Math.abs(value).toLocaleString()}`, value < 0 ? 'Deduction' : 'Amount']}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {waterfallData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ),
            },
            {
              key: 'leakage',
              label: (
                <Space>
                  <FallOutlined />
                  <span>Leakage Analysis</span>
                </Space>
              ),
              children: (
                <Row gutter={[20, 20]} style={{ paddingBottom: 20 }}>
                  <Col xs={24} lg={14}>
                    <div className="chart-title" style={{ marginBottom: 16 }}>
                      <div>
                        <Text strong style={{ color: '#1e1b4b' }}>Monthly Revenue Leakage Trend</Text>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Estimated unreported revenue across all operators</div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={monthlyData}>
                        <defs>
                          <linearGradient id="leakGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#dc2626" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#dc2626" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                        <RTooltip
                          contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                          formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="leakage" stroke="#dc2626" strokeWidth={2} fill="url(#leakGrad)" name="Leakage" />
                        <Line type="monotone" dataKey="levy" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669', r: 4 }} name="Levy Collected" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </Col>
                  <Col xs={24} lg={10}>
                    <div className="chart-title" style={{ marginBottom: 16 }}>
                      <Text strong style={{ color: '#1e1b4b' }}>Leakage by Category</Text>
                    </div>
                    <div style={{ padding: 16 }}>
                      {[
                        { label: 'Unreported Bookings', value: '$2.8M', pct: 65, color: '#dc2626' },
                        { label: 'Off-Platform Payments', value: '$0.9M', pct: 21, color: '#f59e0b' },
                        { label: 'BSP Bypass', value: '$0.4M', pct: 9, color: '#312e81' },
                        { label: 'Under-Valuation', value: '$0.2M', pct: 5, color: '#64748b' },
                      ].map((item, idx) => (
                        <div key={idx} style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={{ fontSize: 12, fontWeight: 600 }}>{item.label}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</Text>
                          </div>
                          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 4, transition: 'width 0.8s ease' }} />
                          </div>
                          <Text style={{ fontSize: 10, color: '#94a3b8' }}>{item.pct}% of total leakage</Text>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </div>

      {/* Tax Collection Table */}
      <div className="gradient-border-card animate-fade-in-up stagger-5" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <BankOutlined style={{ color: '#1e1b4b', fontSize: 16 }} />
              <Text strong style={{ fontSize: 14, color: '#1e1b4b' }}>Tax & Levy Collection Gap Analysis</Text>
            </Space>
            <Space>
              <ClockCircleOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
              <Text style={{ fontSize: 12, color: '#94a3b8' }}>Last updated: 15 minutes ago</Text>
            </Space>
          </div>
        </div>
        <Table
          dataSource={taxBreakdown}
          columns={taxColumns}
          rowKey="category"
          pagination={false}
          size="small"
          style={{ margin: 0 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <Text strong style={{ fontSize: 13 }}>Total</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong style={{ fontFamily: "'Inter', monospace" }}>$4,070,000</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text strong style={{ fontFamily: "'Inter', monospace" }}>$7,000,000</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <Tag style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: 'none', borderRadius: 6, fontWeight: 700, fontFamily: "'Inter', monospace" }}>
                  -$2,930,000
                </Tag>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <Text strong style={{ color: '#dc2626' }}>58%</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </div>
    </div>
  );
};
