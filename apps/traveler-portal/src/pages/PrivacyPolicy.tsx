// ============================================================
// ZimVisit Traveler Portal - Privacy Policy Page
// ============================================================

import React from 'react';
import { Typography, Layout, Divider, Anchor, Card, Space, Alert } from 'antd';
import {
  SafetyCertificateOutlined,
  MailOutlined,
  LockOutlined,
  GlobalOutlined,
  FileTextOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;

const SECTIONS = [
  { key: 'introduction', title: '1. Introduction' },
  { key: 'data-collected', title: '2. Data We Collect' },
  { key: 'how-we-use', title: '3. How We Use Your Data' },
  { key: 'legal-basis', title: '4. Legal Basis for Processing' },
  { key: 'data-sharing', title: '5. Data Sharing & Third Parties' },
  { key: 'international-transfers', title: '6. International Data Transfers' },
  { key: 'data-security', title: '7. Data Security' },
  { key: 'data-retention', title: '8. Data Retention' },
  { key: 'your-rights', title: '9. Your Rights' },
  { key: 'cookies', title: '10. Cookies & Tracking' },
  { key: 'children', title: "11. Children's Privacy" },
  { key: 'changes', title: '12. Changes to This Policy' },
  { key: 'contact', title: '13. Contact Us' },
];

const PrivacyPolicy: React.FC = () => {
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
            backgroundImage:
              'radial-gradient(circle at 70% 30%, rgba(245,158,11,0.1) 0%, transparent 50%)',
          }}
        />
        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Space align="center" style={{ marginBottom: 12 }}>
            <LockOutlined style={{ fontSize: 28, color: '#f59e0b' }} />
            <Title level={2} style={{ color: '#ffffff', marginBottom: 0, fontWeight: 800 }}>
              Privacy Policy
            </Title>
          </Space>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
            Last updated: May 2026 &middot; Effective immediately upon posting
          </Text>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 64px' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Table of Contents (desktop) */}
          <Card
            style={{
              width: 260,
              borderRadius: 16,
              border: '1px solid #f0f0f0',
              position: 'sticky',
              top: 110,
              flexShrink: 0,
              display: 'none',
            }}
            className="privacy-toc-card"
            styles={{ body: { padding: '16px 12px' } }}
          >
            <Title level={5} style={{ marginBottom: 12, paddingLeft: 8 }}>
              Contents
            </Title>
            <Anchor
              affix={false}
              items={SECTIONS.map((s) => ({
                key: s.key,
                href: `#${s.key}`,
                title: s.title,
              }))}
            />
          </Card>

          {/* Main Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Alert
              message="Your Privacy Matters"
              description="ZimVisit is committed to protecting your personal data in accordance with Zimbabwe's Data Protection Act [Chapter 11:12] and international best practices including the EU General Data Protection Regulation (GDPR)."
              type="info"
              showIcon
              icon={<SafetyCertificateOutlined />}
              style={{ marginBottom: 32, borderRadius: 12 }}
            />

            {/* Section 1: Introduction */}
            <section id="introduction">
              <Title level={3}>1. Introduction</Title>
              <Paragraph>
                ZimVisit ("we", "us", "our") operates the ZimVisit tourism platform, which
                includes the traveler portal, mobile applications, and related services
                (collectively, the "Platform"). This Privacy Policy explains how we collect,
                use, disclose, and safeguard your personal information when you use our Platform.
              </Paragraph>
              <Paragraph>
                We serve as the data controller for personal data processed through our Platform.
                Our Platform facilitates the booking of tours, accommodation, and activities across
                Zimbabwe, working in partnership with the Zimbabwe Tourism Authority (ZTA) and
                licensed tourism operators.
              </Paragraph>
            </section>

            <Divider />

            {/* Section 2: Data We Collect */}
            <section id="data-collected">
              <Title level={3}>
                <FileTextOutlined style={{ marginRight: 8, color: '#166534' }} />
                2. Data We Collect
              </Title>

              <Title level={5}>2.1 Information You Provide Directly</Title>
              <ul style={{ lineHeight: 2 }}>
                <li><Text strong>Account Information:</Text> full name, email address, phone number, password (hashed), profile photo</li>
                <li><Text strong>Booking Information:</Text> travel dates, number of guests, traveler details (names, passport numbers where required), special requirements</li>
                <li><Text strong>Payment Information:</Text> payment method details, billing address. Note: we do not store full credit card numbers; payment processing is handled by our PCI-DSS compliant payment partners (Paynow, EcoCash, Stripe)</li>
                <li><Text strong>Communication Data:</Text> messages sent through our platform, support tickets, feedback and reviews</li>
                <li><Text strong>Identity Verification:</Text> passport or ID copies (only when required for ZTA compliance or border-related bookings)</li>
              </ul>

              <Title level={5}>2.2 Information Collected Automatically</Title>
              <ul style={{ lineHeight: 2 }}>
                <li><Text strong>Device Information:</Text> IP address, browser type and version, operating system, device identifiers</li>
                <li><Text strong>Usage Data:</Text> pages visited, features used, search queries, click patterns, session duration</li>
                <li><Text strong>Location Data:</Text> approximate location derived from IP address (precise location only with your explicit consent)</li>
                <li><Text strong>Cookies & Similar Technologies:</Text> see Section 10 below</li>
              </ul>

              <Title level={5}>2.3 Information from Third Parties</Title>
              <ul style={{ lineHeight: 2 }}>
                <li>Tour operators may share booking confirmation details</li>
                <li>Payment providers share transaction status and reference numbers</li>
                <li>ZTA and ZIMRA provide compliance verification data</li>
              </ul>
            </section>

            <Divider />

            {/* Section 3: How We Use Your Data */}
            <section id="how-we-use">
              <Title level={3}>
                <SettingOutlined style={{ marginRight: 8, color: '#166534' }} />
                3. How We Use Your Data
              </Title>
              <Paragraph>We process your personal data for the following purposes:</Paragraph>
              <ul style={{ lineHeight: 2.2 }}>
                <li><Text strong>Booking Processing:</Text> to facilitate, confirm, and manage your bookings with tourism operators</li>
                <li><Text strong>Payment Processing:</Text> to process payments and issue refunds through our payment partners</li>
                <li><Text strong>Compliance &amp; Legal Obligations:</Text> to comply with Zimbabwe Tourism Authority (ZTA) requirements, ZIMRA tax obligations, and tourism levy collection</li>
                <li><Text strong>Communication:</Text> to send booking confirmations, itinerary updates, and respond to your enquiries</li>
                <li><Text strong>Platform Improvement:</Text> to analyse usage patterns and improve our services (using anonymised or aggregated data where possible)</li>
                <li><Text strong>Security &amp; Fraud Prevention:</Text> to detect and prevent fraudulent activity and protect platform integrity</li>
                <li><Text strong>Marketing (with consent):</Text> to send promotional offers, travel inspiration, and newsletters (only with your explicit opt-in consent)</li>
                <li><Text strong>Analytics (with consent):</Text> to perform detailed analytics on user behaviour to improve user experience (only with your explicit consent)</li>
              </ul>
            </section>

            <Divider />

            {/* Section 4: Legal Basis */}
            <section id="legal-basis">
              <Title level={3}>4. Legal Basis for Processing</Title>
              <Paragraph>Under applicable data protection law, we rely on the following legal bases:</Paragraph>
              <ul style={{ lineHeight: 2.2 }}>
                <li><Text strong>Contractual Necessity:</Text> processing required to fulfil our booking contract with you</li>
                <li><Text strong>Legal Obligation:</Text> processing required by Zimbabwean law (tax records, tourism levies, ZTA compliance)</li>
                <li><Text strong>Legitimate Interest:</Text> fraud prevention, platform security, service improvement</li>
                <li><Text strong>Consent:</Text> marketing communications, analytics tracking, non-essential cookies</li>
              </ul>
            </section>

            <Divider />

            {/* Section 5: Data Sharing */}
            <section id="data-sharing">
              <Title level={3}>
                <TeamOutlined style={{ marginRight: 8, color: '#166534' }} />
                5. Data Sharing &amp; Third Parties
              </Title>
              <Paragraph>We share your data only as described below:</Paragraph>
              <ul style={{ lineHeight: 2.2 }}>
                <li>
                  <Text strong>Tourism Operators:</Text> booking details (traveller names, dates, contact information)
                  are shared with the relevant operator to fulfil your booking.
                </li>
                <li>
                  <Text strong>Zimbabwe Tourism Authority (ZTA):</Text> booking and compliance data is shared
                  as required by the Tourism Act for regulatory oversight and tourism levy collection.
                </li>
                <li>
                  <Text strong>ZIMRA (Zimbabwe Revenue Authority):</Text> financial transaction data is
                  shared for tax compliance purposes as required by law.
                </li>
                <li>
                  <Text strong>Payment Providers:</Text> Paynow, EcoCash, and Stripe receive payment-related
                  information necessary to process transactions. Each provider has its own privacy policy.
                </li>
                <li>
                  <Text strong>Service Providers:</Text> we use trusted third-party providers for hosting,
                  email delivery, and analytics. These providers are contractually bound to protect your data.
                </li>
                <li>
                  <Text strong>Legal Requirements:</Text> we may disclose data when required by court order,
                  or to protect the rights, property, or safety of ZimVisit, our users, or the public.
                </li>
              </ul>
              <Paragraph>
                <Text strong>We do not sell your personal data to any third party.</Text>
              </Paragraph>
            </section>

            <Divider />

            {/* Section 6: International Transfers */}
            <section id="international-transfers">
              <Title level={3}>
                <GlobalOutlined style={{ marginRight: 8, color: '#166534' }} />
                6. International Data Transfers
              </Title>
              <Paragraph>
                Your data is primarily stored and processed within Zimbabwe. Where we use international
                service providers (e.g. Stripe for payment processing, cloud hosting providers), we ensure
                appropriate safeguards are in place, including contractual clauses that provide an adequate
                level of data protection.
              </Paragraph>
              <Paragraph>
                Transfers to countries outside Zimbabwe are made only where adequate data protection
                measures exist or where you have explicitly consented to such transfer.
              </Paragraph>
            </section>

            <Divider />

            {/* Section 7: Data Security */}
            <section id="data-security">
              <Title level={3}>
                <LockOutlined style={{ marginRight: 8, color: '#166534' }} />
                7. Data Security
              </Title>
              <Paragraph>
                We implement industry-standard security measures to protect your personal data, including:
              </Paragraph>
              <ul style={{ lineHeight: 2.2 }}>
                <li>Encryption of data in transit (TLS/SSL) and at rest</li>
                <li>Hashed and salted password storage (bcrypt)</li>
                <li>Role-based access controls for staff accessing personal data</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>JWT-based authentication with token expiration</li>
                <li>Rate limiting and DDoS protection</li>
              </ul>
              <Paragraph>
                While we take all reasonable steps to protect your data, no method of transmission
                over the Internet is 100% secure. If you discover a security vulnerability, please
                report it to security@zimvisit.co.zw.
              </Paragraph>
            </section>

            <Divider />

            {/* Section 8: Data Retention */}
            <section id="data-retention">
              <Title level={3}>
                <ClockCircleOutlined style={{ marginRight: 8, color: '#166534' }} />
                8. Data Retention
              </Title>
              <Paragraph>We retain your data for the following periods:</Paragraph>
              <ul style={{ lineHeight: 2.2 }}>
                <li>
                  <Text strong>Financial Records (bookings, payments):</Text> 7 years from the date of
                  transaction, as required by Zimbabwean tax law and ZIMRA regulations.
                </li>
                <li>
                  <Text strong>Account Data:</Text> for the duration of your active account plus 2 years
                  after account closure or anonymisation.
                </li>
                <li>
                  <Text strong>Consent Records:</Text> retained indefinitely as proof of consent
                  (consent type, timestamp, IP address).
                </li>
                <li>
                  <Text strong>Marketing Data:</Text> until you withdraw consent or unsubscribe.
                </li>
                <li>
                  <Text strong>Analytics Data:</Text> anonymised/aggregated analytics data may be
                  retained indefinitely as it cannot identify you.
                </li>
              </ul>
            </section>

            <Divider />

            {/* Section 9: Your Rights */}
            <section id="your-rights">
              <Title level={3}>
                <SafetyCertificateOutlined style={{ marginRight: 8, color: '#f59e0b' }} />
                9. Your Rights
              </Title>
              <Paragraph>
                Under data protection law, you have the following rights regarding your personal data:
              </Paragraph>
              <ul style={{ lineHeight: 2.2 }}>
                <li>
                  <Text strong>Right of Access:</Text> you may request a copy of all personal data we
                  hold about you. Use the "Export My Data" feature in your profile or contact us.
                </li>
                <li>
                  <Text strong>Right to Rectification:</Text> you may update or correct inaccurate
                  personal data through your profile settings.
                </li>
                <li>
                  <Text strong>Right to Erasure (Anonymisation):</Text> you may request that we
                  anonymise your personal data. Note: financial records are retained in anonymised
                  form for the legally required 7-year period.
                </li>
                <li>
                  <Text strong>Right to Restrict Processing:</Text> you may request that we limit
                  how we use your data in certain circumstances.
                </li>
                <li>
                  <Text strong>Right to Data Portability:</Text> you may export your data in a
                  structured, machine-readable (JSON) format.
                </li>
                <li>
                  <Text strong>Right to Withdraw Consent:</Text> where processing is based on consent,
                  you may withdraw it at any time through your privacy settings or by contacting us.
                  Withdrawal does not affect the lawfulness of processing prior to withdrawal.
                </li>
                <li>
                  <Text strong>Right to Object:</Text> you may object to processing based on legitimate
                  interests, including for direct marketing purposes.
                </li>
              </ul>
              <Paragraph>
                To exercise any of these rights, visit your{' '}
                <Link href="/profile">Profile &amp; Privacy Settings</Link> or contact our
                Data Protection Officer (see Section 13). We will respond to your request within
                30 days.
              </Paragraph>
            </section>

            <Divider />

            {/* Section 10: Cookies */}
            <section id="cookies">
              <Title level={3}>10. Cookies &amp; Tracking</Title>
              <Paragraph>We use the following types of cookies:</Paragraph>
              <ul style={{ lineHeight: 2.2 }}>
                <li>
                  <Text strong>Essential Cookies:</Text> required for the platform to function
                  (authentication, session management, CSRF protection). These cannot be disabled.
                </li>
                <li>
                  <Text strong>Analytics Cookies:</Text> help us understand how visitors use our
                  platform. Only set with your consent.
                </li>
                <li>
                  <Text strong>Marketing Cookies:</Text> used to deliver relevant advertisements
                  and track campaign effectiveness. Only set with your consent.
                </li>
              </ul>
              <Paragraph>
                You can manage your cookie preferences at any time through the cookie settings
                banner or your browser settings.
              </Paragraph>
            </section>

            <Divider />

            {/* Section 11: Children */}
            <section id="children">
              <Title level={3}>11. Children's Privacy</Title>
              <Paragraph>
                Our Platform is not directed at children under the age of 16. We do not knowingly
                collect personal data from children. Bookings made on behalf of minors must be
                completed by a parent or legal guardian who provides their own consent for data
                processing.
              </Paragraph>
            </section>

            <Divider />

            {/* Section 12: Changes */}
            <section id="changes">
              <Title level={3}>12. Changes to This Policy</Title>
              <Paragraph>
                We may update this Privacy Policy from time to time. We will notify you of any
                material changes by posting a notice on the Platform and, where required, by
                sending you an email. Your continued use of the Platform after such changes
                constitutes your acceptance of the updated policy.
              </Paragraph>
            </section>

            <Divider />

            {/* Section 13: Contact */}
            <section id="contact">
              <Title level={3}>
                <MailOutlined style={{ marginRight: 8, color: '#166534' }} />
                13. Contact Us
              </Title>
              <Paragraph>
                If you have any questions about this Privacy Policy or wish to exercise your data
                protection rights, please contact our Data Protection Officer:
              </Paragraph>
              <Card
                style={{
                  borderRadius: 14,
                  border: '1px solid #d9f7be',
                  background: '#f6ffed',
                  maxWidth: 480,
                }}
                styles={{ body: { padding: 24 } }}
              >
                <Space direction="vertical" size={8}>
                  <Text strong style={{ fontSize: 16 }}>Data Protection Officer</Text>
                  <Text>
                    <MailOutlined style={{ marginRight: 8 }} />
                    dpo@zimvisit.co.zw
                  </Text>
                  <Text>
                    <GlobalOutlined style={{ marginRight: 8 }} />
                    www.zimvisit.co.zw
                  </Text>
                  <Text style={{ marginTop: 8 }}>
                    ZimVisit (Pvt) Ltd<br />
                    123 Samora Machel Avenue<br />
                    Harare, Zimbabwe
                  </Text>
                </Space>
              </Card>
              <Paragraph style={{ marginTop: 16 }}>
                If you are not satisfied with our response, you have the right to lodge a
                complaint with the Postal and Telecommunications Regulatory Authority of
                Zimbabwe (POTRAZ) or the relevant supervisory authority in your jurisdiction.
              </Paragraph>
            </section>
          </div>
        </div>
      </div>

      {/* Responsive TOC styles */}
      <style>{`
        @media (min-width: 992px) {
          .privacy-toc-card {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
