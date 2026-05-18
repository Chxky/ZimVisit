// ============================================================
// ZimVisit Traveler Portal - Compliance Badge Component
// ============================================================

import React from 'react';
import { Tooltip } from 'antd';
import { SafetyCertificateOutlined, BankOutlined, ApiOutlined } from '@ant-design/icons';

interface ComplianceBadgeProps {
  type: 'zta-verified' | 'zimra-compliant' | 'bsp-connected';
  size?: 'small' | 'medium' | 'large';
  complianceRate?: number;
}

const BADGE_CONFIG = {
  'zta-verified': {
    label: 'ZTA Verified',
    description: 'Verified by the Zimbabwe Tourism Authority',
    color: '#166534',
    bgColor: '#dcfce7',
    borderColor: '#86efac',
    Icon: SafetyCertificateOutlined,
  },
  'zimra-compliant': {
    label: 'ZIMRA Compliant',
    description: 'Tax compliant with Zimbabwe Revenue Authority',
    color: '#92400e',
    bgColor: '#fef3c7',
    borderColor: '#fde68a',
    Icon: BankOutlined,
  },
  'bsp-connected': {
    label: 'BSP Connected',
    description: 'Connected to Billing Settlement Plan',
    color: '#1e40af',
    bgColor: '#dbeafe',
    borderColor: '#93c5fd',
    Icon: ApiOutlined,
  },
};

const SIZE_MAP = {
  small: { iconSize: 14, fontSize: 11, padding: '3px 8px', ringSize: 0 },
  medium: { iconSize: 16, fontSize: 12, padding: '4px 10px', ringSize: 28 },
  large: { iconSize: 20, fontSize: 13, padding: '6px 14px', ringSize: 40 },
};

const ComplianceRing: React.FC<{ rate: number; size: number; color: string }> = ({ rate, size, color }) => {
  const strokeWidth = size * 0.15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rate / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
};

const ComplianceBadge: React.FC<ComplianceBadgeProps> = ({ type, size = 'medium', complianceRate }) => {
  const config = BADGE_CONFIG[type];
  const sizeConfig = SIZE_MAP[size];
  const Icon = config.Icon;

  return (
    <Tooltip title={config.description}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: complianceRate !== undefined && sizeConfig.ringSize > 0 ? 6 : 0,
          padding: sizeConfig.padding,
          background: config.bgColor,
          border: `1px solid ${config.borderColor}`,
          borderRadius: 20,
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        <Icon style={{ fontSize: sizeConfig.iconSize, color: config.color }} />
        <span
          style={{
            fontSize: sizeConfig.fontSize,
            fontWeight: 600,
            color: config.color,
            lineHeight: 1,
          }}
        >
          {config.label}
        </span>

        {complianceRate !== undefined && sizeConfig.ringSize > 0 && (
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <ComplianceRing rate={complianceRate} size={sizeConfig.ringSize} color={config.color} />
            <span
              style={{
                position: 'absolute',
                fontSize: size === 'large' ? 9 : 8,
                fontWeight: 700,
                color: config.color,
              }}
            >
              {Math.round(complianceRate)}%
            </span>
          </div>
        )}
      </div>
    </Tooltip>
  );
};

export default ComplianceBadge;
