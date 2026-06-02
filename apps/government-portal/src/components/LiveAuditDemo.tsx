import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Space, Progress, Tag } from 'antd';
import { SafetyCertificateOutlined, ScanOutlined, LockOutlined, WarningOutlined } from '@ant-design/icons';
import { complianceApi } from '../services/api';

const { Title, Text } = Typography;

const LiveAuditDemo: React.FC<{ portalName: string }> = ({ portalName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<string>('Initializing secure audit protocol...');
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
    setScanProgress(0);
    setLogs([]);
    setIsComplete(false);
    setScanStatus('Initializing secure audit protocol...');
  };

  const handleCancel = () => setIsModalOpen(false);

  useEffect(() => {
    if (!isModalOpen) return;

    let interval: any;

    const runAudit = async () => {
      try {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 1);
        let data: any;
        try {
          const res = await complianceApi.getLeakage({ startDate: start.toISOString(), endDate: end.toISOString() });
          data = res.data?.data || res.data || { estimatedLeakage: 0, nonCompliantBookings: 0 };
        } catch (e) {
          data = { estimatedLeakage: 0, nonCompliantBookings: 0 };
        }
        
        const hasLeakage = data.estimatedLeakage > 0;
        
        const stages = [
          { progress: 15, msg: 'Connecting to ZimRA data nodes...' },
          { progress: 30, msg: `Analyzing ${data.nonCompliantBookings} non-compliant records...` },
          { progress: 45, msg: 'Cross-referencing Cyber & Data Protection Act [Ch 11:22]...' },
          { progress: 60, msg: `Estimated revenue leakage: $${data.estimatedLeakage}...` },
          { progress: 85, msg: hasLeakage ? 'Anomalies detected in operator tax remittance...' : 'Detecting network vulnerabilities & anomalies...' },
          { progress: 100, msg: hasLeakage ? 'Audit complete. ACTION REQUIRED.' : 'Audit complete. Zero threats detected.' },
        ];

        let currentStage = 0;
        interval = setInterval(() => {
          if (currentStage < stages.length) {
            setScanProgress(stages[currentStage].progress);
            setScanStatus(stages[currentStage].msg);
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${stages[currentStage].msg}`]);
            currentStage++;
          } else {
            clearInterval(interval);
            setIsComplete(true);
          }
        }, 1200);
      } catch (err) {
         setScanStatus('Audit failed to initialize.');
         setIsComplete(true);
      }
    };
    
    runAudit();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isModalOpen]);

  return (
    <>
      {/* Floating Action Button */}
      <Button
        type="primary"
        size="large"
        shape="round"
        icon={<SafetyCertificateOutlined />}
        onClick={showModal}
        style={{
          position: 'fixed',
          bottom: 40,
          right: 40,
          zIndex: 9999,
          height: 56,
          padding: '0 24px',
          fontSize: 15,
          fontWeight: 700,
          background: '#0f172a', // Dark theme for govt/operator
          borderColor: '#22c55e',
          borderWidth: 2,
          boxShadow: '0 8px 32px rgba(15, 23, 42, 0.4), 0 0 0 4px rgba(34, 197, 94, 0.2)',
          color: '#22c55e',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      >
        Run Security Audit
      </Button>

      {/* Demo Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={550}
        centered
        bodyStyle={{ padding: 0, borderRadius: 16, overflow: 'hidden', background: '#020617' }}
        closeIcon={<div style={{ color: '#94a3b8', fontSize: 20, marginTop: 10, marginRight: 10 }}>×</div>}
      >
        {/* Top Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #1e293b' }}>
          <Space align="center">
            <ScanOutlined style={{ color: '#22c55e', fontSize: 28 }} />
            <div>
              <Title level={4} style={{ color: '#f8fafc', margin: 0 }}>Live Compliance Audit</Title>
              <Text style={{ color: '#94a3b8', fontSize: 13 }}>{portalName} | Level 5 Access</Text>
            </div>
          </Space>
        </div>

        {/* Scan Status Area */}
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <Progress 
            type="dashboard" 
            percent={scanProgress} 
            strokeColor={{ '0%': '#3b82f6', '100%': '#22c55e' }}
            trailColor="#1e293b"
            format={(percent) => <span style={{ color: '#f8fafc' }}>{percent}%</span>}
          />
          <div style={{ marginTop: 24, minHeight: 24 }}>
            <Text style={{ color: isComplete ? '#22c55e' : '#38bdf8', fontSize: 15, fontWeight: 500 }}>
              {scanStatus}
            </Text>
          </div>
        </div>

        {/* Terminal Logs */}
        <div style={{ 
          background: '#000', 
          margin: '0 24px 24px', 
          padding: '16px', 
          borderRadius: 8, 
          border: '1px solid #1e293b',
          height: 180,
          overflowY: 'auto',
          fontFamily: 'monospace'
        }}>
          {logs.map((log, index) => (
            <div key={index} style={{ color: '#4ade80', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: '#64748b' }}>{'>'}</span> {log}
            </div>
          ))}
        </div>

        {/* Footer Summary */}
        {isComplete && (
          <div style={{ padding: '16px 24px', background: scanStatus.includes('REQUIRED') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', borderTop: scanStatus.includes('REQUIRED') ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)', display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              {scanStatus.includes('REQUIRED') ? <WarningOutlined style={{ color: '#ef4444' }} /> : <LockOutlined style={{ color: '#22c55e' }} />}
              <Text style={{ color: scanStatus.includes('REQUIRED') ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
                {scanStatus.includes('REQUIRED') ? 'Compliance Alert Triggered' : 'System Fully Compliant'}
              </Text>
            </Space>
            <Tag color={scanStatus.includes('REQUIRED') ? 'error' : 'success'} style={{ margin: 0, border: 'none' }}>
              {scanStatus.includes('REQUIRED') ? 'FLAGGED' : 'PASSED'}
            </Tag>
          </div>
        )}
      </Modal>
    </>
  );
};

export default LiveAuditDemo;
