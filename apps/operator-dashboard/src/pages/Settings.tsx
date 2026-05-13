import React from 'react';
import { Card, Form, Input, Button, Typography, Divider, Switch, message, Descriptions, Tag } from 'antd';

const { Title, Text } = Typography;

export const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Settings saved:', values);
    message.success('Settings updated');
  };

  return (
    <div>
      <Title level={4}>Settings</Title>
      <Card title="Operator Profile" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="Operator ID">OP-ZIM-001</Descriptions.Item>
          <Descriptions.Item label="Status"><Tag color="green">Active</Tag></Descriptions.Item>
          <Descriptions.Item label="BSP Integration"><Tag color="green">Connected</Tag></Descriptions.Item>
          <Descriptions.Item label="Compliance Score"><Tag color="green">96%</Tag></Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Notification Preferences" style={{ marginBottom: 16 }}>
        <Form layout="vertical">
          <Form.Item label="Email Notifications">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="SMS for New Bookings">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="Compliance Alerts">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Card>
      <Card title="Payment Settings">
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 500 }}>
          <Form.Item label="Paynow Integration Key" name="paynowKey">
            <Input.Password />
          </Form.Item>
          <Form.Item label="EcoCash Merchant ID" name="ecocashMerchant">
            <Input />
          </Form.Item>
          <Form.Item label="Default Commission Rate (%)" name="commission">
            <Input type="number" suffix="%" />
          </Form.Item>
          <Button type="primary" htmlType="submit">Save Settings</Button>
        </Form>
      </Card>
    </div>
  );
};
