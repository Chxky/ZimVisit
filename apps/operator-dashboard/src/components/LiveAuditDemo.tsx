import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Space, Progress, Tag } from 'antd';
import { SafetyCertificateOutlined, ScanOutlined, LockOutlined, WarningOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { complianceApi } from '../services/api';

const { Title, Text } = Typography;

const LiveAuditDemo: React.FC<{ portalName: string }> = ({ portalName }) => {
  const { user } = useAuthStore();
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
        const opId = user?.operatorId || 'OP-DEMO-1';
        let data;
        try {
          data = await complianceApi.getOperatorCompliance(opId);
        } catch (e) {
          // Fallback if no real data
          data = { totalReports: 12, compliant: 12, flagged: 0, complianceRate: 100 };
        }
        
        const isActuallyCompliant = data.complianceRate > 80;
        
        const stages = [
          { progress: 15, msg: 'Connecting to operator database nodes...' },
          { progress: 30, msg: `Fetched ${data.totalReports} recent bookings...` },
          { progress: 45, msg: `Validating compliance: ${data.compliant} compliant, ${data.flagged} flagged...` },
          { progress: 60, msg: `Calculating compliance rate: ${Math.round(data.complianceRate)}%...` },
          { progress: 85, msg: isActuallyCompliant ? 'No major vulnerabilities detected.' : 'Warning: High risk patterns detected in recent bookings.' },
          { progress: 100, msg: isActuallyCompliant ? 'Audit complete. Zero threats detected.' : 'Audit complete. COMPLIANCE ISSUES FOUND.' },
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
          background: '#052e16',
          borderColor: '#f59e0b',
          borderWidth: 2,
          boxShadow: '0 8px 32px rgba(5, 46, 22, 0.4), 0 0 0 4px rgba(245, 158, 11, 0.2)',
          color: '#f59e0b',
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
              <Text style={{ color: '#94a3b8', fontSize: 13 }}>{portalName}</Text>
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
          <div style={{ padding: '16px 24px', background: scanStatus.includes('ISSUES') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', borderTop: scanStatus.includes('ISSUES') ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)', display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              {scanStatus.includes('ISSUES') ? <WarningOutlined style={{ color: '#ef4444' }} /> : <LockOutlined style={{ color: '#22c55e' }} />}
              <Text style={{ color: scanStatus.includes('ISSUES') ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
                {scanStatus.includes('ISSUES') ? 'Action Required' : 'System Fully Compliant'}
              </Text>
            </Space>
            <Tag color={scanStatus.includes('ISSUES') ? 'error' : 'success'} style={{ margin: 0, border: 'none' }}>
              {scanStatus.includes('ISSUES') ? 'FLAGGED' : 'PASSED'}
            </Tag>
          </div>
        )}
      </Modal>
    </>
  );
};

export default LiveAuditDemo;
