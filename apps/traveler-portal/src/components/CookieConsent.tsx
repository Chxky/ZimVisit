// ============================================================
// ZimVisit Traveler Portal - Cookie Consent Banner
// ============================================================

import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Typography, Switch, Collapse, message } from 'antd';
import {
  SafetyCertificateOutlined,
  SettingOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Text, Paragraph } = Typography;

const COOKIE_CONSENT_KEY = 'zimvisit_cookie_consent';
const CONSENT_API = '/api/data-protection/consent';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  essential: true, // always required
  analytics: false,
  marketing: false,
};

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      // Small delay so the banner doesn't flash on initial render
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsentToApi = async (prefs: CookiePreferences) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Only call API if user is logged in

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // Grant or revoke analytics consent
      if (prefs.analytics) {
        await fetch(CONSENT_API, {
          method: 'POST',
          headers,
          body: JSON.stringify({ consentType: 'analytics' }),
        }).catch(() => {
          // Silently fail - consent is still saved locally
        });
      }

      // Grant or revoke marketing consent
      if (prefs.marketing) {
        await fetch(CONSENT_API, {
          method: 'POST',
          headers,
          body: JSON.stringify({ consentType: 'marketing' }),
        }).catch(() => {
          // Silently fail - consent is still saved locally
        });
      }
    } catch {
      // API failures should not block the user experience
    }
  };

  const savePreferences = (prefs: CookiePreferences) => {
    const record = {
      ...prefs,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
    saveConsentToApi(prefs);
    setVisible(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
    message.success('Cookie preferences saved');
  };

  const handleRejectNonEssential = () => {
    savePreferences(defaultPreferences);
    message.success('Only essential cookies will be used');
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
    message.success('Cookie preferences saved');
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-desc"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        padding: '0 16px 16px',
        pointerEvents: 'none',
      }}
    >
      <Card
        style={{
          maxWidth: 720,
          margin: '0 auto',
          borderRadius: 16,
          boxShadow: '0 -4px 32px rgba(0,0,0,0.15)',
          border: '1px solid #e8e8e8',
          pointerEvents: 'auto',
        }}
        styles={{ body: { padding: '20px 24px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <SafetyCertificateOutlined
            style={{ fontSize: 24, color: '#166534', marginTop: 2, flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 6 }}>
              We value your privacy
            </Text>
            <Paragraph
              id="cookie-desc"
              style={{ fontSize: 13, color: '#595959', marginBottom: 12, lineHeight: 1.6 }}
            >
              We use cookies to enhance your experience, analyse platform usage, and deliver
              relevant content. Essential cookies are required for the platform to function.
              You can customise your preferences below.{' '}
              <Link to="/privacy" style={{ fontSize: 13 }}>
                Read our Privacy Policy
              </Link>
            </Paragraph>

            {/* Customise Panel */}
            {showCustomize && (
              <div
                style={{
                  background: '#fafafa',
                  borderRadius: 10,
                  padding: '14px 16px',
                  marginBottom: 14,
                  border: '1px solid #f0f0f0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <Text strong style={{ fontSize: 13 }}>Essential Cookies</Text>
                    <Text style={{ fontSize: 11, color: '#8c8c8c', display: 'block' }}>
                      Required for the platform to function
                    </Text>
                  </div>
                  <Switch checked disabled size="small" />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                    borderTop: '1px solid #f0f0f0',
                    paddingTop: 10,
                  }}
                >
                  <div>
                    <Text strong style={{ fontSize: 13 }}>Analytics Cookies</Text>
                    <Text style={{ fontSize: 11, color: '#8c8c8c', display: 'block' }}>
                      Help us understand how you use the platform
                    </Text>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, analytics: checked }))
                    }
                    size="small"
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #f0f0f0',
                    paddingTop: 10,
                  }}
                >
                  <div>
                    <Text strong style={{ fontSize: 13 }}>Marketing Cookies</Text>
                    <Text style={{ fontSize: 11, color: '#8c8c8c', display: 'block' }}>
                      Used to deliver relevant travel offers
                    </Text>
                  </div>
                  <Switch
                    checked={preferences.marketing}
                    onChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, marketing: checked }))
                    }
                    size="small"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <Space wrap size={8}>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={handleAcceptAll}
                style={{
                  background: '#166534',
                  borderColor: '#166534',
                  borderRadius: 8,
                  fontWeight: 600,
                }}
              >
                Accept All
              </Button>
              <Button
                size="small"
                icon={<CloseOutlined />}
                onClick={handleRejectNonEssential}
                style={{ borderRadius: 8 }}
              >
                Reject Non-Essential
              </Button>
              {!showCustomize ? (
                <Button
                  size="small"
                  icon={<SettingOutlined />}
                  onClick={() => setShowCustomize(true)}
                  style={{ borderRadius: 8 }}
                >
                  Customise
                </Button>
              ) : (
                <Button
                  size="small"
                  type="primary"
                  onClick={handleSaveCustom}
                  style={{
                    background: '#f59e0b',
                    borderColor: '#f59e0b',
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  Save Preferences
                </Button>
              )}
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;
