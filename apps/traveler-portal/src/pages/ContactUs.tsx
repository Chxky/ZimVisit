// ============================================================
// ZimVisit Traveler Portal - Contact Us Page
// ============================================================

import React, { useState } from 'react';
import { Typography, Card, Space, Form, Input, Button, Select, Row, Col, message } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SendOutlined,
  GlobalOutlined,
  MessageOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ContactUs: React.FC = () => {
  const [form] = Form.useForm();
  const [sending, setSending] = useState(false);

  const handleSubmit = async (values: any) => {
    setSending(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1000));
    message.success('Your message has been sent! We will get back to you within 24 hours.');
    form.resetFields();
    setSending(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
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
            backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(245,158,11,0.1) 0%, transparent 50%)',
          }}
        />
        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <MessageOutlined style={{ fontSize: 48, color: '#f59e0b', marginBottom: 16 }} />
          <Title level={2} style={{ color: '#ffffff', marginBottom: 8, fontWeight: 800 }}>
            Contact Us
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
            We'd love to hear from you. Reach out with any questions about ZimVisit.
          </Text>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 64px' }}>
        <Row gutter={[32, 32]}>
          {/* Contact Form */}
          <Col xs={24} lg={14}>
            <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0' }} styles={{ body: { padding: 32 } }}>
              <Title level={3} style={{ marginBottom: 24 }}>Send Us a Message</Title>
              <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark="optional">
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                      <Input size="large" placeholder="Your full name" style={{ borderRadius: 10 }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                      <Input size="large" placeholder="your@email.com" style={{ borderRadius: 10 }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Subject" name="subject" rules={[{ required: true, message: 'Please select a subject' }]}>
                  <Select
                    size="large"
                    placeholder="Select a topic"
                    style={{ borderRadius: 10 }}
                    options={[
                      { value: 'booking', label: 'Booking Inquiry' },
                      { value: 'support', label: 'General Support' },
                      { value: 'operator', label: 'Become an Operator' },
                      { value: 'partnership', label: 'Partnership Opportunity' },
                      { value: 'feedback', label: 'Feedback & Suggestions' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Message" name="message" rules={[{ required: true, message: 'Please enter your message' }]}>
                  <TextArea rows={5} placeholder="How can we help you?" style={{ borderRadius: 10 }} />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={sending}
                    icon={<SendOutlined />}
                    style={{
                      borderRadius: 10,
                      background: '#166534',
                      borderColor: '#166534',
                      fontWeight: 600,
                      height: 48,
                      paddingInline: 32,
                    }}
                  >
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Contact Info */}
          <Col xs={24} lg={10}>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0' }} styles={{ body: { padding: 28 } }}>
                <Title level={4} style={{ marginBottom: 20 }}>Get in Touch</Title>
                <Space direction="vertical" size={18} style={{ width: '100%' }}>
                  <Space align="start" size={14}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <EnvironmentOutlined style={{ color: '#166534', fontSize: 18 }} />
                    </div>
                    <div>
                      <Text style={{ fontWeight: 600, display: 'block' }}>Office Address</Text>
                      <Text style={{ color: '#737373' }}>123 Samora Machel Ave, Harare, Zimbabwe</Text>
                    </div>
                  </Space>
                  <Space align="start" size={14}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PhoneOutlined style={{ color: '#166534', fontSize: 18 }} />
                    </div>
                    <div>
                      <Text style={{ fontWeight: 600, display: 'block' }}>Phone</Text>
                      <Text style={{ color: '#737373' }}>+263 4 123 4567</Text>
                    </div>
                  </Space>
                  <Space align="start" size={14}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MailOutlined style={{ color: '#166534', fontSize: 18 }} />
                    </div>
                    <div>
                      <Text style={{ fontWeight: 600, display: 'block' }}>Email</Text>
                      <Text style={{ color: '#737373' }}>hello@zimvisit.co.zw</Text>
                    </div>
                  </Space>
                  <Space align="start" size={14}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ClockCircleOutlined style={{ color: '#166534', fontSize: 18 }} />
                    </div>
                    <div>
                      <Text style={{ fontWeight: 600, display: 'block' }}>Office Hours</Text>
                      <Text style={{ color: '#737373' }}>Monday - Friday: 8:00 AM - 5:00 PM (CAT)</Text>
                    </div>
                  </Space>
                </Space>
              </Card>

              <Card style={{ borderRadius: 16, background: 'linear-gradient(135deg, #052e16 0%, #166534 100%)', border: 'none' }}>
                <Title level={4} style={{ color: '#ffffff', marginBottom: 8 }}>Emergency Support</Title>
                <Text style={{ color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 16 }}>
                  For urgent travel assistance, our 24/7 helpline is always available.
                </Text>
                <Button
                  size="large"
                  icon={<PhoneOutlined />}
                  href="tel:+263771234567"
                  style={{ borderRadius: 10, fontWeight: 600 }}
                >
                  +263 77 123 4567
                </Button>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContactUs;
