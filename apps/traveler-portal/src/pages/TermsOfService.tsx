// ============================================================
// ZimVisit Traveler Portal - Terms of Service Page
// ============================================================

import React from 'react';
import { Typography, Divider, Alert, Card, Space } from 'antd';
import {
  FileProtectOutlined,
  MailOutlined,
  GlobalOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;

const TermsOfService: React.FC = () => {
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
            <FileProtectOutlined style={{ fontSize: 28, color: '#f59e0b' }} />
            <Title level={2} style={{ color: '#ffffff', marginBottom: 0, fontWeight: 800 }}>
              Terms of Service
            </Title>
          </Space>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
            Last updated: May 2026 &middot; Effective immediately upon posting
          </Text>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 64px' }}>
        <Alert
          message="Agreement to Terms"
          description="By accessing or using the ZimVisit platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform."
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: 32, borderRadius: 12 }}
        />

        {/* Section 1 */}
        <section>
          <Title level={3}>1. Platform Description &amp; Purpose</Title>
          <Paragraph>
            ZimVisit is a digital tourism platform that connects travellers with licensed tourism
            operators across Zimbabwe. The platform facilitates the discovery, booking, and
            payment for tours, accommodation, activities, and related travel services.
          </Paragraph>
          <Paragraph>
            ZimVisit operates in partnership with the Zimbabwe Tourism Authority (ZTA) and
            complies with the Tourism Act [Chapter 14:20] and all applicable Zimbabwean
            regulations. ZimVisit is not a tour operator itself; it acts as an intermediary
            between travellers and licensed operators.
          </Paragraph>
          <Paragraph>
            The platform also provides a digital travel pass (ZimPass) that consolidates
            booking confirmations, QR codes, and itinerary information for registered travellers.
          </Paragraph>
        </section>

        <Divider />

        {/* Section 2 */}
        <section>
          <Title level={3}>2. User Accounts &amp; Obligations</Title>

          <Title level={5}>2.1 Account Registration</Title>
          <Paragraph>
            To use certain features of the platform, you must create an account. You agree to:
          </Paragraph>
          <ul style={{ lineHeight: 2.2 }}>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and promptly update your account information</li>
            <li>Keep your password secure and not share your account credentials</li>
            <li>Accept responsibility for all activities that occur under your account</li>
            <li>Notify us immediately of any unauthorised use of your account</li>
          </ul>

          <Title level={5}>2.2 Eligibility</Title>
          <Paragraph>
            You must be at least 18 years old, or the age of majority in your jurisdiction,
            to create an account and make bookings. Minors may use the platform under the
            supervision of a parent or legal guardian who accepts these terms on their behalf.
          </Paragraph>

          <Title level={5}>2.3 Prohibited Conduct</Title>
          <Paragraph>You agree not to:</Paragraph>
          <ul style={{ lineHeight: 2.2 }}>
            <li>Use the platform for any unlawful purpose</li>
            <li>Provide false or misleading information</li>
            <li>Attempt to access other users' accounts or data</li>
            <li>Interfere with or disrupt the platform's operation</li>
            <li>Use automated systems (bots, scrapers) without our written consent</li>
            <li>Resell or redistribute bookings without authorisation</li>
            <li>Upload malicious code or attempt to exploit vulnerabilities</li>
            <li>Impersonate any person or entity</li>
          </ul>
        </section>

        <Divider />

        {/* Section 3 */}
        <section>
          <Title level={3}>3. Bookings &amp; Payments</Title>

          <Title level={5}>3.1 Booking Process</Title>
          <Paragraph>
            When you make a booking through ZimVisit, you are entering into a contract directly
            with the relevant tourism operator. ZimVisit facilitates this transaction but is not
            a party to the contract between you and the operator.
          </Paragraph>
          <Paragraph>
            A booking is confirmed only when you receive a confirmation email with a booking
            reference (format: ZV-XXXXXX) and, where applicable, a ZimPass QR code.
          </Paragraph>

          <Title level={5}>3.2 Pricing &amp; Fees</Title>
          <Paragraph>
            All prices displayed on the platform are in US Dollars (USD) unless otherwise stated.
            Prices include:
          </Paragraph>
          <ul style={{ lineHeight: 2.2 }}>
            <li>The operator's listed price for the service</li>
            <li>Value Added Tax (VAT) at the prevailing Zimbabwean rate</li>
            <li>Tourism levy as mandated by the Zimbabwe Tourism Authority</li>
            <li>A platform service fee</li>
          </ul>
          <Paragraph>
            The total price, including all taxes and fees, is displayed before you confirm
            any booking. No hidden charges will be applied.
          </Paragraph>

          <Title level={5}>3.3 Payment Methods</Title>
          <Paragraph>
            We accept payments through the following providers:
          </Paragraph>
          <ul style={{ lineHeight: 2.2 }}>
            <li><Text strong>Paynow:</Text> mobile money and bank transfers (Zimbabwe)</li>
            <li><Text strong>EcoCash:</Text> mobile money (Zimbabwe)</li>
            <li><Text strong>Stripe:</Text> international credit/debit cards (Visa, Mastercard)</li>
          </ul>
          <Paragraph>
            Payment is required at the time of booking. Your booking is not confirmed until
            payment is successfully processed.
          </Paragraph>

          <Title level={5}>3.4 Currency &amp; Exchange Rates</Title>
          <Paragraph>
            All prices are denominated in USD. If your payment method operates in a different
            currency, the conversion will be handled by your payment provider at their
            prevailing exchange rate. ZimVisit is not responsible for exchange rate fluctuations.
          </Paragraph>
        </section>

        <Divider />

        {/* Section 4 */}
        <section>
          <Title level={3}>4. Cancellation &amp; Refund Policy</Title>

          <Title level={5}>4.1 Cancellation by Traveller</Title>
          <Paragraph>Cancellation terms vary by operator and service type:</Paragraph>
          <ul style={{ lineHeight: 2.2 }}>
            <li>
              <Text strong>More than 7 days before start:</Text> full refund minus a 5%
              administrative fee
            </li>
            <li>
              <Text strong>3-7 days before start:</Text> 50% refund
            </li>
            <li>
              <Text strong>Less than 3 days before start:</Text> no refund
            </li>
            <li>
              <Text strong>No-show:</Text> no refund
            </li>
          </ul>
          <Paragraph>
            Some operators may have more flexible or stricter cancellation policies. The
            specific policy for each service is displayed on the booking page before you
            confirm your reservation.
          </Paragraph>

          <Title level={5}>4.2 Cancellation by Operator</Title>
          <Paragraph>
            If an operator cancels a confirmed booking, you are entitled to a full refund
            or, where possible, an alternative arrangement of equal or greater value. ZimVisit
            will facilitate communication between you and the operator in such cases.
          </Paragraph>

          <Title level={5}>4.3 Force Majeure</Title>
          <Paragraph>
            Neither ZimVisit nor operators shall be liable for cancellations or changes caused
            by events beyond reasonable control, including but not limited to natural disasters,
            pandemics, government restrictions, civil unrest, or extreme weather conditions.
            In such cases, we will work to provide a rescheduled booking or a credit voucher.
          </Paragraph>

          <Title level={5}>4.4 Refund Processing</Title>
          <Paragraph>
            Approved refunds will be processed within 14 business days to the original
            payment method. Refunds are processed through the same payment provider used
            for the original transaction.
          </Paragraph>
        </section>

        <Divider />

        {/* Section 5 */}
        <section>
          <Title level={3}>5. ZimPass Digital Travel Pass</Title>
          <Paragraph>
            The ZimPass is a digital travel pass that consolidates your booking confirmations,
            QR codes, and itinerary details. Each ZimPass:
          </Paragraph>
          <ul style={{ lineHeight: 2.2 }}>
            <li>Is unique to you and non-transferable</li>
            <li>Contains a QR code for verification by operators</li>
            <li>Remains valid for the duration of your booked services</li>
            <li>May be required for entry to certain activities or attractions</li>
          </ul>
          <Paragraph>
            Sharing your ZimPass QR code or booking reference with others is prohibited and
            may result in cancellation of your booking without refund.
          </Paragraph>
        </section>

        <Divider />

        {/* Section 6 */}
        <section>
          <Title level={3}>6. User Content &amp; Reviews</Title>
          <Paragraph>
            You may submit reviews, photos, and other content ("User Content") through the
            platform. By submitting User Content, you grant ZimVisit a non-exclusive,
            royalty-free, worldwide licence to use, display, and distribute such content
            in connection with the operation of the platform.
          </Paragraph>
          <Paragraph>
            You represent that your User Content does not infringe any third-party rights,
            is not defamatory, and complies with applicable law. ZimVisit reserves the right
            to remove any User Content at its discretion.
          </Paragraph>
        </section>

        <Divider />

        {/* Section 7 */}
        <section>
          <Title level={3}>7. Liability Limitations</Title>
          <Paragraph>
            <Text strong>ZimVisit acts as an intermediary platform.</Text> We are not responsible
            for the quality, safety, legality, or availability of services offered by operators.
          </Paragraph>
          <Paragraph>To the maximum extent permitted by Zimbabwean law:</Paragraph>
          <ul style={{ lineHeight: 2.2 }}>
            <li>
              ZimVisit's total liability to you shall not exceed the total amount you paid
              for the booking giving rise to the claim
            </li>
            <li>
              ZimVisit shall not be liable for indirect, incidental, consequential, or
              punitive damages
            </li>
            <li>
              ZimVisit does not guarantee the accuracy of information provided by operators
            </li>
            <li>
              ZimVisit is not liable for personal injury, property damage, or loss arising
              from activities booked through the platform, except where caused by our
              gross negligence or wilful misconduct
            </li>
          </ul>
          <Paragraph>
            Nothing in these terms excludes or limits liability that cannot be excluded or
            limited under Zimbabwean law, including liability for fraud or personal injury.
          </Paragraph>
        </section>

        <Divider />

        {/* Section 8 */}
        <section>
          <Title level={3}>8. Intellectual Property</Title>
          <Paragraph>
            All content on the ZimVisit platform, including but not limited to text, graphics,
            logos, software, and design, is the property of ZimVisit or its licensors and is
            protected by Zimbabwean and international intellectual property laws.
          </Paragraph>
          <Paragraph>
            You may not reproduce, distribute, modify, or create derivative works of any
            content from the platform without our prior written consent.
          </Paragraph>
        </section>

        <Divider />

        {/* Section 9 */}
        <section>
          <Title level={3}>9. Indemnification</Title>
          <Paragraph>
            You agree to indemnify and hold harmless ZimVisit, its officers, directors,
            employees, and agents from any claims, losses, damages, liabilities, and expenses
            (including legal fees) arising out of:
          </Paragraph>
          <ul style={{ lineHeight: 2.2 }}>
            <li>Your use of the platform</li>
            <li>Your violation of these terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Any User Content you submit</li>
          </ul>
        </section>

        <Divider />

        {/* Section 10 */}
        <section>
          <Title level={3}>10. Termination</Title>
          <Paragraph>
            We may suspend or terminate your account at any time, with or without notice, for
            conduct that we believe violates these terms or is harmful to other users, operators,
            or the platform. You may also close your account at any time by contacting us or
            using the account deletion feature in your profile.
          </Paragraph>
          <Paragraph>
            Upon termination, your right to use the platform ceases immediately. Sections of
            these terms that by their nature should survive termination will survive, including
            intellectual property, liability limitations, indemnification, and governing law.
          </Paragraph>
        </section>

        <Divider />

        {/* Section 11 */}
        <section>
          <Title level={3}>11. Governing Law &amp; Dispute Resolution</Title>
          <Paragraph>
            These Terms of Service are governed by and construed in accordance with the laws
            of the Republic of Zimbabwe. Any disputes arising from or relating to these terms
            or your use of the platform shall be subject to the exclusive jurisdiction of the
            courts of Zimbabwe.
          </Paragraph>
          <Paragraph>
            Before initiating legal proceedings, the parties agree to attempt to resolve any
            dispute through good-faith negotiation for a period of 30 days from the date of
            written notice of the dispute.
          </Paragraph>
        </section>

        <Divider />

        {/* Section 12 */}
        <section>
          <Title level={3}>12. General Provisions</Title>
          <ul style={{ lineHeight: 2.2 }}>
            <li>
              <Text strong>Entire Agreement:</Text> these terms, together with our Privacy Policy,
              constitute the entire agreement between you and ZimVisit.
            </li>
            <li>
              <Text strong>Severability:</Text> if any provision is found to be unenforceable,
              the remaining provisions shall continue in full force and effect.
            </li>
            <li>
              <Text strong>Waiver:</Text> failure to enforce any provision does not constitute
              a waiver of that provision.
            </li>
            <li>
              <Text strong>Assignment:</Text> you may not assign your rights under these terms.
              ZimVisit may assign its rights to any affiliate or successor.
            </li>
            <li>
              <Text strong>Language:</Text> these terms are provided in English. In the event of
              any translation discrepancy, the English version prevails.
            </li>
          </ul>
        </section>

        <Divider />

        {/* Section 13 */}
        <section>
          <Title level={3}>
            <MailOutlined style={{ marginRight: 8, color: '#166534' }} />
            13. Contact Information
          </Title>
          <Paragraph>
            For questions about these Terms of Service, please contact us:
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
              <Text strong style={{ fontSize: 16 }}>ZimVisit Support</Text>
              <Text>
                <MailOutlined style={{ marginRight: 8 }} />
                legal@zimvisit.co.zw
              </Text>
              <Text>
                <MailOutlined style={{ marginRight: 8 }} />
                support@zimvisit.co.zw
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
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
