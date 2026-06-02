import React, { useState } from 'react';
import { Button, Modal, Typography, Space, Divider } from 'antd';
import { QrcodeOutlined, CheckCircleFilled, SafetyCertificateFilled } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ZimPassDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  return (
    <>
      {/* Floating Action Button */}
      <Button
        type="primary"
        size="large"
        shape="round"
        icon={<QrcodeOutlined />}
        onClick={showModal}
        style={{
          position: 'fixed',
          bottom: 40,
          right: 40,
          zIndex: 9999,
          height: 60,
          padding: '0 24px',
          fontSize: 16,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #052e16 0%, #166534 100%)',
          borderColor: '#f59e0b',
          borderWidth: 2,
          boxShadow: '0 8px 32px rgba(5, 46, 22, 0.4), 0 0 0 4px rgba(245, 158, 11, 0.2)',
          color: '#f59e0b',
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        ZimPass Demo
      </Button>

      {/* Demo Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={400}
        centered
        bodyStyle={{ padding: 0, borderRadius: 20, overflow: 'hidden' }}
        closeIcon={<div style={{ color: '#fff', fontSize: 20, marginTop: 10, marginRight: 10 }}>×</div>}
      >
        {/* Top Header */}
        <div style={{ background: '#052e16', padding: '32px 24px', textAlign: 'center', position: 'relative' }}>
          <SafetyCertificateFilled style={{ color: '#f59e0b', fontSize: 32, marginBottom: 12 }} />
          <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>ZimPass</Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, letterSpacing: 2 }}>OFFICIAL DIGITAL PASS</Text>
        </div>

        {/* QR Code Section */}
        <div style={{ padding: '40px 24px', textAlign: 'center', background: '#fff' }}>
          <div style={{ 
            border: '4px solid #f59e0b', 
            padding: 16, 
            borderRadius: 16, 
            display: 'inline-block',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            {/* Real scannable QR Code using QR Server API */}
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ZimVisit%20ZimPass%3A%20Valid%20for%20Victoria%20Falls%20Access.%20Enjoy%20Zimbabwe!" 
              alt="ZimPass QR Code" 
              style={{ width: 200, height: 200 }}
            />
          </div>
          
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <CheckCircleFilled style={{ color: '#16a34a', fontSize: 20 }} />
            <Text style={{ fontSize: 16, fontWeight: 700, color: '#166534' }}>Valid & Active</Text>
          </div>
          <Text style={{ color: '#737373', fontSize: 13, display: 'block', marginTop: 4 }}>
            Scan with your phone camera!
          </Text>

          <Divider style={{ margin: '24px 0' }} />

          {/* Itinerary Details */}
          <div style={{ textAlign: 'left' }}>
            <Text style={{ fontSize: 12, color: '#a3a3a3', fontWeight: 600, textTransform: 'uppercase' }}>Current Itinerary</Text>
            <div style={{ marginTop: 12 }}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 600, fontSize: 15 }}>Victoria Falls Entry</Text>
                  <Text style={{ color: '#f59e0b', fontWeight: 700 }}>2 Pax</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 600, fontSize: 15 }}>Zambezi Sunset Cruise</Text>
                  <Text style={{ color: '#f59e0b', fontWeight: 700 }}>17:00</Text>
                </div>
              </Space>
            </div>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
           <Text style={{ fontSize: 12, color: '#64748b' }}>Powered by the Ministry of Tourism</Text>
        </div>
      </Modal>
    </>
  );
};

export default ZimPassDemo;
