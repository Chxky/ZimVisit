import React from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, Progress, Alert, Space, Tabs } from 'antd';
import { BarChartOutlined, WarningOutlined, SafetyOutlined, RiseOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const { Title, Text } = Typography;

const riskPredictions = [
  { operatorId: 'OP-008', operatorName: 'Mana Pools Expeditions', riskScore: 89, riskLevel: 'critical' as const, predictedLeakage: 124000, confidence: 94, topFactors: ['BSP bypass detected', 'Offshore payments', 'No compliance history'], recommendedAction: 'Immediate audit required' },
  { operatorId: 'OP-004', operatorName: 'Harare City Breaks', riskScore: 76, riskLevel: 'high' as const, predictedLeakage: 89000, confidence: 88, topFactors: ['Late remittances (3 months)', 'BSP reference mismatch', 'Agent velocity anomaly'], recommendedAction: 'Schedule compliance audit within 14 days' },
  { operatorId: 'OP-014', operatorName: 'Chimanimani Hiking', riskScore: 68, riskLevel: 'high' as const, predictedLeakage: 45000, confidence: 82, topFactors: ['New operator - no track record', 'Unusual booking patterns'], recommendedAction: 'Enhanced monitoring for 90 days' },
  { operatorId: 'OP-010', operatorName: 'Gonarezhou Adventures', riskScore: 55, riskLevel: 'medium' as const, predictedLeakage: 28000, confidence: 76, topFactors: ['Inconsistent reporting', 'Agent trust score declining'], recommendedAction: 'Request updated compliance documentation' },
  { operatorId: 'OP-006', operatorName: 'Kariba Lakeside Lodge', riskScore: 45, riskLevel: 'medium' as const, predictedLeakage: 12000, confidence: 71, topFactors: ['Seasonal booking gaps'], recommendedAction: 'Standard quarterly review' },
  { operatorId: 'OP-012', operatorName: 'Matobo Hills Trekking', riskScore: 32, riskLevel: 'low' as const, predictedLeakage: 5000, confidence: 85, topFactors: ['Minor variance in levy calculation'], recommendedAction: 'No action required' },
  { operatorId: 'OP-003', operatorName: 'Great Zimbabwe Tours', riskScore: 18, riskLevel: 'low' as const, predictedLeakage: 2000, confidence: 92, topFactors: [], recommendedAction: 'Exemplary compliance - no action' },
  { operatorId: 'OP-001', operatorName: 'Victoria Falls Travel', riskScore: 45, riskLevel: 'medium' as const, predictedLeakage: 15000, confidence: 78, topFactors: ['3 late remittances in past year'], recommendedAction: 'Send compliance reminder' },
];

const riskDistribution = [
  { name: 'Low Risk', value: 18, color: '#16a34a' },
  { name: 'Medium Risk', value: 15, color: '#f59e0b' },
  { name: 'High Risk', value: 10, color: '#f97316' },
  { name: 'Critical', value: 5, color: '#dc2626' },
];

const quarterlyForecast = [
  { quarter: 'Q3 2026', predictedRevenue: 5200000, predictedLeakage: 480000, confidenceLow: 4400000, confidenceHigh: 6100000 },
  { quarter: 'Q4 2026', predictedRevenue: 5800000, predictedLeakage: 520000, confidenceLow: 4900000, confidenceHigh: 6800000 },
  { quarter: 'Q1 2027', predictedRevenue: 4900000, predictedLeakage: 560000, confidenceLow: 4100000, confidenceHigh: 5800000 },
];

export const RiskForecast: React.FC = () => {
  const columns = [
    { title: 'Operator', dataIndex: 'operatorName', key: 'name' },
    { title: 'Risk Level', dataIndex: 'riskLevel', key: 'risk', render: (v: string) => {
      const colors: Record<string, string> = { low: 'green', medium: 'orange', high: 'red', critical: 'darkred' };
      return <Tag color={colors[v] || 'default'}>{v.toUpperCase()}</Tag>;
    }},
    { title: 'Score', dataIndex: 'riskScore', key: 'score', render: (v: number) => (
      <Progress percent={v} size="small" strokeColor={v > 70 ? '#dc2626' : v > 40 ? '#f59e0b' : '#16a34a'} format={() => `${v}/100`} />
    )},
    { title: 'Predicted Leakage', dataIndex: 'predictedLeakage', key: 'leakage', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Confidence', dataIndex: 'confidence', key: 'confidence', render: (v: number) => <Tag color="blue">{v}%</Tag> },
    { title: 'Risk Factors', dataIndex: 'topFactors', key: 'factors', render: (v: string[]) => v.slice(0, 2).map((f, i) => <Tag key={i} style={{ marginBottom: 2 }}>{f}</Tag>) },
    { title: 'Action', dataIndex: 'recommendedAction', key: 'action' },
  ];

  const totalPredictedLeakage = riskPredictions.reduce((sum, r) => sum + r.predictedLeakage, 0);
  const criticalCount = riskPredictions.filter(r => r.riskLevel === 'critical').length;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <BarChartOutlined style={{ fontSize: 24, color: '#1e3a5f' }} />
        <Title level={4} style={{ margin: 0 }}>Predictive Revenue & Risk Forecaster</Title>
        <Tag color="purple">AI-POWERED</Tag>
      </Space>

      {criticalCount > 0 && (
        <Alert type="error" showIcon icon={<WarningOutlined />} style={{ marginBottom: 16 }}
          message={`${criticalCount} operator(s) flagged as critical risk — estimated $${totalPredictedLeakage.toLocaleString()} potential leakage`}
          description="Recommended: Immediate compliance audits for all critical-risk operators"
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Predicted Leakage (Next Q)" value={totalPredictedLeakage} prefix="$" precision={0} valueStyle={{ color: '#dc2626' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Avg Confidence Score" value={83} suffix="%" prefix={<RiseOutlined />} valueStyle={{ color: '#16a34a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="High/Critical Risk" value={criticalCount + 2} valueStyle={{ color: '#dc2626' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Model Accuracy (YTD)" value={91} suffix="%" valueStyle={{ color: '#16a34a' }} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="Risk Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {riskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="Quarterly Forecast with Confidence Intervals">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={quarterlyForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="predictedRevenue" fill="#1e3a5f" name="Predicted Revenue" />
                <Bar dataKey="predictedLeakage" fill="#dc2626" name="Predicted Leakage" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="Operator Risk Assessment">
        <Table dataSource={riskPredictions} columns={columns} rowKey="operatorId"
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ margin: 0 }}>
                <Text strong>Top Risk Factors:</Text>
                <ul>{record.topFactors.map((f, i) => <li key={i}>{f}</li>)}</ul>
                <Text strong>Recommended: </Text><Text>{record.recommendedAction}</Text>
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
};
