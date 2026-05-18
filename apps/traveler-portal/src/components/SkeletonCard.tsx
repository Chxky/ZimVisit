// ============================================================
// ZimVisit Traveler Portal - Skeleton Card Component
// ============================================================

import React from 'react';

interface SkeletonCardProps {
  variant: 'tour' | 'booking' | 'detail';
  count?: number;
}

const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s ease-in-out infinite',
  borderRadius: 6,
};

const SkeletonLine: React.FC<{ width?: string | number; height?: number; style?: React.CSSProperties }> = ({
  width = '100%',
  height = 14,
  style,
}) => (
  <div
    style={{
      ...shimmerStyle,
      width,
      height,
      marginBottom: 8,
      ...style,
    }}
  />
);

const TourSkeleton: React.FC = () => (
  <div
    style={{
      background: '#fff',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}
  >
    <div style={{ ...shimmerStyle, height: 180, borderRadius: 0 }} />
    <div style={{ padding: 16 }}>
      <SkeletonLine width="70%" height={18} />
      <SkeletonLine width="40%" height={12} />
      <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        <div style={{ ...shimmerStyle, width: 60, height: 22, borderRadius: 12 }} />
        <div style={{ ...shimmerStyle, width: 50, height: 22, borderRadius: 12 }} />
      </div>
      <SkeletonLine width="100%" height={12} />
      <SkeletonLine width="80%" height={12} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <SkeletonLine width={80} height={20} />
        <SkeletonLine width={100} height={36} />
      </div>
    </div>
  </div>
);

const BookingSkeleton: React.FC = () => (
  <div
    style={{
      background: '#fff',
      borderRadius: 12,
      padding: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
      <SkeletonLine width={140} height={18} />
      <div style={{ ...shimmerStyle, width: 80, height: 24, borderRadius: 12 }} />
    </div>
    <SkeletonLine width="60%" height={14} />
    <SkeletonLine width="45%" height={14} />
    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
      <div style={{ ...shimmerStyle, flex: 1, height: 80, borderRadius: 8 }} />
      <div style={{ ...shimmerStyle, flex: 1, height: 80, borderRadius: 8 }} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
      <SkeletonLine width={100} height={14} />
      <SkeletonLine width={120} height={36} />
    </div>
  </div>
);

const DetailSkeleton: React.FC = () => (
  <div style={{ padding: 24 }}>
    <div style={{ ...shimmerStyle, height: 300, borderRadius: 12, marginBottom: 24 }} />
    <SkeletonLine width="60%" height={28} />
    <SkeletonLine width="40%" height={16} />
    <div style={{ display: 'flex', gap: 12, margin: '20px 0' }}>
      <div style={{ ...shimmerStyle, width: 100, height: 32, borderRadius: 16 }} />
      <div style={{ ...shimmerStyle, width: 80, height: 32, borderRadius: 16 }} />
      <div style={{ ...shimmerStyle, width: 90, height: 32, borderRadius: 16 }} />
    </div>
    <SkeletonLine width="100%" height={14} />
    <SkeletonLine width="100%" height={14} />
    <SkeletonLine width="90%" height={14} />
    <SkeletonLine width="75%" height={14} />
    <div style={{ marginTop: 24 }}>
      <SkeletonLine width="30%" height={20} />
      {[1, 2, 3].map((i) => (
        <SkeletonLine key={i} width="100%" height={14} />
      ))}
    </div>
  </div>
);

const SkeletonCard: React.FC<SkeletonCardProps> = ({ variant, count = 1 }) => {
  const Component =
    variant === 'tour' ? TourSkeleton :
    variant === 'booking' ? BookingSkeleton :
    DetailSkeleton;

  return (
    <>
      <style>{shimmerKeyframes}</style>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </>
  );
};

export default SkeletonCard;
