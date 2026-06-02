// ============================================================
// ZimVisit Traveler Portal - Economic Impact Dashboard
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Divider,
  Avatar,
} from 'antd';
import {
  TrophyOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  RiseOutlined,
  BankOutlined,
  HeartOutlined,
  HomeOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const { Title, Text, Paragraph } = Typography;

// ---- Animated Counter Hook ----
const useAnimatedCounter = (target: number, duration = 2000, decimals = 0) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setValue(parseFloat((eased * target).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, decimals]);

  return { value, ref };
};

// ---- Mock Data ----
// TODO: Replace with economic impact API endpoint when available.
// Mock data is acceptable for this display-only government stats page
// until the economic impact API is implemented.
const IMPACT_DATA = {
  totalSpent: 4200,
  taxContributed: 630,       // 15% VAT
  tourismLevy: 84,           // 2% levy
  platformFee: 126,          // 3% platform fee
  tripsCompleted: 7,
  destinationsVisited: 12,
  nightsStayed: 24,
  countriesVisited: 1,
  operators: [
    { name: 'Wild Horizons', city: 'Victoria Falls', complianceRate: 95, trips: 3, spent: 1800 },
    { name: 'Hwange Safari Lodge', city: 'Hwange', complianceRate: 97, trips: 2, spent: 1200 },
    { name: 'Mana Pools Expeditions', city: 'Karoi', complianceRate: 78, trips: 1, spent: 600 },
    { name: 'Kariba Houseboat Co', city: 'Kariba', complianceRate: 90, trips: 1, spent: 600 },
  ],
};

const PLATFORM_IMPACT = {
  totalTaxContributed: 2840000,
  operatorsSupported: 20,
  jobsEstimate: 340,
  travelersServed: 12500,
};

// ---- Chart Colors ----
const PIE_COLORS = ['#166534', '#f59e0b', '#22c55e', '#6366f1'];

const PIE_DATA = [
  { name: 'Operators', value: 80, amount: IMPACT_DATA.totalSpent * 0.8 },
  { name: 'Tax (ZIMRA)', value: 15, amount: IMPACT_DATA.taxContributed },
  { name: 'Tourism Levy', value: 2, amount: IMPACT_DATA.tourismLevy },
  { name: 'Platform Fee', value: 3, amount: IMPACT_DATA.platformFee },
];

// ---- KPI Card Component ----
const KpiCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
  bgColor: string;
  decimals?: number;
}> = ({ icon, label, value, prefix = '', suffix = '', color, bgColor, decimals = 0 }) => {
  const { value: animated, ref } = useAnimatedCounter(value, 2200, decimals);
  const formatted = animated.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div ref={ref}>
      <Card
        style={{
          borderRadius: 16,
          border: '1px solid #f0f0f0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          height: '100%',
        }}
        styles={{ body: { padding: '24px 20px' } }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            fontSize: 22,
            color,
          }}
        >
          {icon}
        </div>
        <Text style={{ fontSize: 13, color: '#737373', display: 'block', marginBottom: 4 }}>
          {label}
        </Text>
        <Title level={3} style={{ margin: 0, color: '#171717', fontWeight: 800 }}>
          {prefix}
          {formatted}
          {suffix}
        </Title>
      </Card>
    </div>
  );
};

// ---- Compliance Badge ----
const ComplianceBadge: React.FC<{ rate: number }> = ({ rate }) => {
  const color = rate >= 90 ? '#166534' : rate >= 75 ? '#f59e0b' : '#ef4444';
  const bg = rate >= 90 ? '#f0fdf4' : rate >= 75 ? '#fffbeb' : '#fef2f2';
  return (
    <Tag
      style={{
        background: bg,
        color,
        border: `1px solid ${color}22`,
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 12,
        padding: '2px 10px',
      }}
    >
      {rate}% Compliant
    </Tag>
  );
};

// ============================================================
// Economic Impact Page
// ============================================================
const EconomicImpact: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* ---- Header ---- */}
      <div
        style={{
          background: 'linear-gradient(135deg, #052e16 0%, #166534 100%)',
          padding: '48px 24px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 70% 30%, rgba(245,158,11,0.12) 0%, transparent 50%)',
          }}
        />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Space align="center" size={12} style={{ marginBottom: 8 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'rgba(245,158,11,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: '#f59e0b',
              }}
            >
              <TrophyOutlined />
            </div>
            <Title level={2} style={{ color: '#ffffff', margin: 0, fontWeight: 800 }}>
              Your Economic Impact
            </Title>
          </Space>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginLeft: 60 }}>
            See how your travel spending drives Zimbabwe&apos;s tourism economy
          </Text>
        </div>
      </div>

      {/* ---- Main Content ---- */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        {/* KPI Cards */}
        <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
          <Col xs={12} sm={6}>
            <KpiCard
              icon={<DollarOutlined />}
              label="Total Spent"
              value={IMPACT_DATA.totalSpent}
              prefix="$"
              color="#166534"
              bgColor="#f0fdf4"
            />
          </Col>
          <Col xs={12} sm={6}>
            <KpiCard
              icon={<BankOutlined />}
              label="Tax Contributed"
              value={IMPACT_DATA.taxContributed}
              prefix="$"
              color="#f59e0b"
              bgColor="#fffbeb"
            />
          </Col>
          <Col xs={12} sm={6}>
            <KpiCard
              icon={<SafetyCertificateOutlined />}
              label="Tourism Levy"
              value={IMPACT_DATA.tourismLevy}
              prefix="$"
              color="#22c55e"
              bgColor="#f0fdf4"
            />
          </Col>
          <Col xs={12} sm={6}>
            <KpiCard
              icon={<RiseOutlined />}
              label="Platform Fee"
              value={IMPACT_DATA.platformFee}
              prefix="$"
              color="#6366f1"
              bgColor="#eef2ff"
            />
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Pie Chart */}
          <Col xs={24} lg={10}>
            <Card
              title={
                <Space>
                  <DollarOutlined style={{ color: '#166534' }} />
                  <span>Where Your Money Goes</span>
                </Space>
              }
              style={{
                borderRadius: 16,
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                height: '100%',
              }}
              styles={{ body: { padding: '12px 16px' } }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {PIE_DATA.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `$${props.payload.amount.toLocaleString()} (${value}%)`,
                      name,
                    ]}
                    contentStyle={{
                      borderRadius: 10,
                      border: '1px solid #e5e5e5',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={10}
                    formatter={(value) => (
                      <span style={{ color: '#525252', fontSize: 13 }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
              <Divider style={{ margin: '8px 0 12px' }} />
              <Text style={{ fontSize: 12, color: '#a3a3a3', textAlign: 'center', display: 'block' }}>
                Every dollar you spend is transparently allocated across the tourism value chain
              </Text>
            </Card>
          </Col>

          {/* Travel Footprint */}
          <Col xs={24} lg={14}>
            <Card
              title={
                <Space>
                  <CompassOutlined style={{ color: '#166534' }} />
                  <span>Your Travel Footprint</span>
                </Space>
              }
              style={{
                borderRadius: 16,
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                height: '100%',
              }}
              styles={{ body: { padding: '24px' } }}
            >
              <Row gutter={[16, 16]}>
                {[
                  { icon: <EnvironmentOutlined />, label: 'Trips Completed', value: IMPACT_DATA.tripsCompleted, color: '#166534' },
                  { icon: <GlobalOutlined />, label: 'Destinations Visited', value: IMPACT_DATA.destinationsVisited, color: '#f59e0b' },
                  { icon: <HomeOutlined />, label: 'Nights Stayed', value: IMPACT_DATA.nightsStayed, color: '#22c55e' },
                  { icon: <TeamOutlined />, label: 'Countries', value: IMPACT_DATA.countriesVisited, color: '#6366f1' },
                ].map((stat, i) => (
                  <Col xs={12} key={i}>
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        background: '#fafafa',
                        border: '1px solid #f0f0f0',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 22, color: stat.color, marginBottom: 8 }}>
                        {stat.icon}
                      </div>
                      <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#171717' }}>
                        {stat.value}
                      </Title>
                      <Text style={{ fontSize: 12, color: '#737373' }}>{stat.label}</Text>
                    </div>
                  </Col>
                ))}
              </Row>

              <Divider style={{ margin: '20px 0 16px' }} />

              {/* Favorite destination highlight */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  borderRadius: 12,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <HeartOutlined style={{ fontSize: 20, color: '#166534' }} />
                <div>
                  <Text style={{ fontSize: 12, color: '#737373', display: 'block' }}>
                    Your favorite destination
                  </Text>
                  <Text strong style={{ fontSize: 15, color: '#166534' }}>
                    Victoria Falls — 3 trips
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Operators You Support */}
        <Card
          title={
            <Space>
              <TeamOutlined style={{ color: '#166534' }} />
              <span>Operators You Support</span>
            </Space>
          }
          style={{
            borderRadius: 16,
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            marginTop: 24,
          }}
          styles={{ body: { padding: '8px 0' } }}
        >
          {IMPACT_DATA.operators.map((op, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: i < IMPACT_DATA.operators.length - 1 ? '1px solid #f0f0f0' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Avatar
                  size={42}
                  style={{
                    background: `linear-gradient(135deg, ${PIE_COLORS[i % PIE_COLORS.length]}, ${PIE_COLORS[(i + 1) % PIE_COLORS.length]})`,
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {op.name.charAt(0)}
                </Avatar>
                <div>
                  <Text strong style={{ display: 'block', fontSize: 14 }}>
                    {op.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#737373' }}>
                    {op.city} &middot; {op.trips} trip{op.trips > 1 ? 's' : ''} &middot; ${op.spent.toLocaleString()} spent
                  </Text>
                </div>
              </div>
              <ComplianceBadge rate={op.complianceRate} />
            </div>
          ))}
        </Card>

        {/* Zimbabwe Aggregate Impact */}
        <Card
          style={{
            borderRadius: 16,
            border: 'none',
            background: 'linear-gradient(135deg, #052e16 0%, #166534 100%)',
            marginTop: 24,
            overflow: 'hidden',
            position: 'relative',
          }}
          styles={{ body: { padding: '36px 32px' } }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at 80% 20%, rgba(245,158,11,0.15) 0%, transparent 50%)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Title level={3} style={{ color: '#ffffff', marginBottom: 8, fontWeight: 800 }}>
              Zimbabwe-Wide Impact
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, display: 'block', marginBottom: 28 }}>
              Together, ZimVisit travelers are transforming Zimbabwe&apos;s tourism economy
            </Text>

            <Row gutter={[24, 24]}>
              {[
                {
                  icon: <DollarOutlined />,
                  value: `$${(PLATFORM_IMPACT.totalTaxContributed / 1000000).toFixed(1)}M`,
                  label: 'Tax Contributed to ZIMRA',
                },
                {
                  icon: <TeamOutlined />,
                  value: PLATFORM_IMPACT.operatorsSupported.toString(),
                  label: 'Verified Operators',
                },
                {
                  icon: <HomeOutlined />,
                  value: PLATFORM_IMPACT.jobsEstimate.toString(),
                  label: 'Jobs Supported',
                },
                {
                  icon: <GlobalOutlined />,
                  value: PLATFORM_IMPACT.travelersServed.toLocaleString(),
                  label: 'Travelers Served',
                },
              ].map((stat, i) => (
                <Col xs={12} sm={6} key={i}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, color: '#f59e0b', marginBottom: 8 }}>
                      {stat.icon}
                    </div>
                    <Title level={2} style={{ color: '#ffffff', margin: 0, fontWeight: 800 }}>
                      {stat.value}
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
                      {stat.label}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EconomicImpact;
