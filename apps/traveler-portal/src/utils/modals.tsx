import React from 'react';
import { Modal, Typography, Steps } from 'antd';
import { CheckCircleOutlined, SearchOutlined, QrcodeOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

export const showHowItWorksModal = () => {
  Modal.info({
    title: <div style={{ fontSize: 24, fontWeight: 700, color: '#052e16' }}>How ZimVisit Works</div>,
    width: 600,
    icon: null,
    okText: 'Got it!',
    maskClosable: true,
    centered: true,
    okButtonProps: {
      style: { background: '#f59e0b', borderColor: '#f59e0b', borderRadius: 8, fontWeight: 600 }
    },
    content: (
      <div style={{ marginTop: 32 }}>
        <Steps
          direction="vertical"
          current={-1}
          items={[
            {
              title: <span style={{ fontWeight: 600, fontSize: 16 }}>1. Discover & Book</span>,
              description: 'Explore officially verified tours, hotels, and activities across Zimbabwe. Book standard packages or use our "Name Your Budget" feature.',
              icon: <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SearchOutlined style={{ color: '#f59e0b', fontSize: 16 }} /></div>,
            },
            {
              title: <span style={{ fontWeight: 600, fontSize: 16 }}>2. Get Your ZimPass</span>,
              description: 'Every booking automatically generates a unified digital QR code (ZimPass) on your phone. No paper tickets needed.',
              icon: <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><QrcodeOutlined style={{ color: '#166534', fontSize: 16 }} /></div>,
            },
            {
              title: <span style={{ fontWeight: 600, fontSize: 16 }}>3. Scan & Experience</span>,
              description: 'Show your ZimPass at national parks, hotels, and tour operators for instant, secure access.',
              icon: <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircleOutlined style={{ color: '#0ea5e9', fontSize: 16 }} /></div>,
            },
          ]}
        />
        <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <Paragraph style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
            <strong>Official Platform:</strong> ZimVisit is integrated with the Zimbabwe Tourism Authority. All listed operators are verified for safety and compliance.
          </Paragraph>
        </div>
      </div>
    ),
  });
};
