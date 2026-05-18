// ============================================================
// ZimVisit Traveler Portal - Payment Modal Component
// ============================================================

import React, { useState } from 'react';
import { Modal, Button, Typography, Space, Spin, Result, message } from 'antd';
import {
  MobileOutlined,
  GlobalOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const { Title, Text, Paragraph } = Typography;

interface PaymentModalProps {
  visible: boolean;
  bookingId: string;
  amount: number;
  currency?: string;
  onClose: () => void;
  onSuccess?: (payment: any) => void;
}

type PaymentProvider = 'ecocash' | 'paynow' | 'stripe';

interface ProviderOption {
  key: PaymentProvider;
  name: string;
  description: string;
  processingTime: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  marketShare: string;
}

const PROVIDERS: ProviderOption[] = [
  {
    key: 'ecocash',
    name: 'EcoCash',
    description: "Zimbabwe's leading mobile money — pay from your phone",
    processingTime: 'Instant via USSD',
    icon: <MobileOutlined style={{ fontSize: 28 }} />,
    color: '#16a34a',
    bgColor: '#f0fdf4',
    borderColor: '#86efac',
    marketShare: '40% of ZW transactions',
  },
  {
    key: 'paynow',
    name: 'Paynow',
    description: 'Local payment gateway — bank transfer & mobile money',
    processingTime: 'Instant confirmation',
    icon: <GlobalOutlined style={{ fontSize: 28 }} />,
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#93c5fd',
    marketShare: '30% of ZW transactions',
  },
  {
    key: 'stripe',
    name: 'Card Payment',
    description: 'Visa, Mastercard — international cards accepted',
    processingTime: '2-3 business days',
    icon: <CreditCardOutlined style={{ fontSize: 28 }} />,
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#c4b5fd',
    marketShare: 'International travelers',
  },
];

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  bookingId,
  amount,
  currency = 'USD',
  onClose,
  onSuccess,
}) => {
  const [selected, setSelected] = useState<PaymentProvider | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [step, setStep] = useState<'select' | 'processing' | 'result'>('select');

  const handleSelect = (provider: PaymentProvider) => {
    setSelected(provider);
  };

  const handlePay = async () => {
    if (!selected) return;
    setStep('processing');
    setLoading(true);

    try {
      const response = await api.post('/payments/initiate', {
        bookingId,
        provider: selected,
      });

      setPaymentResult(response.data);
      setStep('result');

      if (response.data.payment?.status === 'success') {
        onSuccess?.(response.data);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Payment initiation failed');
      setStep('select');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelected(null);
    setPaymentResult(null);
    setStep('select');
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard');
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={520}
      centered
      destroyOnClose
    >
      {step === 'select' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={4} style={{ marginBottom: 4 }}>Complete Your Payment</Title>
            <Text style={{ fontSize: 28, fontWeight: 700, color: '#166534' }}>
              ${amount.toFixed(2)} {currency}
            </Text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {PROVIDERS.map((provider) => (
              <div
                key={provider.key}
                onClick={() => handleSelect(provider.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 20px',
                  background: selected === provider.key ? provider.bgColor : '#fff',
                  border: `2px solid ${selected === provider.key ? provider.color : '#e5e7eb'}`,
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background: provider.bgColor,
                    border: `1px solid ${provider.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: provider.color,
                    flexShrink: 0,
                  }}
                >
                  {provider.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text strong style={{ fontSize: 15 }}>{provider.name}</Text>
                    <span style={{ fontSize: 11, color: '#a3a3a3', background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>
                      {provider.marketShare}
                    </span>
                  </div>
                  <Text style={{ fontSize: 13, color: '#525252' }}>{provider.description}</Text>
                  <div style={{ fontSize: 12, color: '#737373', marginTop: 2 }}>
                    {provider.processingTime}
                  </div>
                </div>
                {selected === provider.key && (
                  <CheckCircleOutlined style={{ fontSize: 22, color: provider.color }} />
                )}
              </div>
            ))}
          </div>

          <Button
            type="primary"
            size="large"
            block
            disabled={!selected}
            onClick={handlePay}
            icon={<ArrowRightOutlined />}
            style={{
              height: 48,
              background: selected ? '#166534' : undefined,
              borderColor: selected ? '#166534' : undefined,
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Pay ${amount.toFixed(2)}
          </Button>
        </div>
      )}

      {step === 'processing' && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Spin size="large" />
          <Title level={4} style={{ marginTop: 24 }}>Processing Payment...</Title>
          <Text style={{ color: '#737373' }}>
            Connecting to {PROVIDERS.find((p) => p.key === selected)?.name}
          </Text>
        </div>
      )}

      {step === 'result' && paymentResult && (
        <div>
          <Result
            status={paymentResult.payment?.status === 'success' ? 'success' : 'info'}
            title={
              paymentResult.payment?.status === 'success'
                ? 'Payment Successful!'
                : 'Payment Instructions'
            }
            subTitle={
              paymentResult.payment?.status === 'success'
                ? `Transaction ${paymentResult.payment?.transactionReference}`
                : 'Follow the instructions below to complete your payment'
            }
          />

          {paymentResult.instructions && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: 10,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Payment Instructions:
              </Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text code style={{ fontSize: 14, flex: 1 }}>
                  {paymentResult.instructions}
                </Text>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(paymentResult.instructions)}
                />
              </div>
            </div>
          )}

          {paymentResult.redirectUrl && (
            <Button
              type="primary"
              block
              size="large"
              href={paymentResult.redirectUrl}
              target="_blank"
              style={{
                background: '#166534',
                borderColor: '#166534',
                height: 48,
                borderRadius: 10,
              }}
            >
              Continue to Payment Gateway
            </Button>
          )}

          <Button
            block
            onClick={handleClose}
            style={{ marginTop: 12, height: 40 }}
          >
            Close
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default PaymentModal;
