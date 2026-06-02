// ============================================================
// ZimVisit Traveler Portal - Explore / Search Page
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Input,
  Row,
  Col,
  Card,
  Tag,
  Rate,
  Select,
  Slider,
  Checkbox,
  Button,
  Space,
  Typography,
  Empty,
  Spin,
  Drawer,
  Skeleton,
  message,
} from 'antd';
import {
  SearchOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  StarFilled,
  DollarOutlined,
  FilterOutlined,
  FireOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  CheckCircleFilled,
  QrcodeOutlined,
} from '@ant-design/icons';
import type { Tour } from '../types';
import { toursApi } from '../services/api';
import { CATEGORY_IMAGES, HERO_IMAGES, DESTINATION_IMAGES } from '../constants/images';

const { Title, Text, Paragraph } = Typography;

// ---- Category Config ----
const CATEGORIES = [
  { key: 'all', label: 'All', icon: '🌍' },
  { key: 'safari', label: 'Safari', icon: '🦁' },
  { key: 'victoria-falls', label: 'Victoria Falls', icon: '🌊' },
  { key: 'hiking', label: 'Hiking', icon: '🥾' },
  { key: 'cultural', label: 'Cultural', icon: '🏛️' },
  { key: 'lake', label: 'Lake', icon: '⛵' },
  { key: 'wildlife', label: 'Wildlife', icon: '🐘' },
];

// ---- Difficulty Colors ----
const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'green',
  moderate: 'gold',
  challenging: 'orange',
  expert: 'red',
};

// ---- Category Gradient Map ----
const CATEGORY_GRADIENT: Record<string, string> = {
  safari: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
  'victoria-falls': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  hiking: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
  cultural: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
  lake: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  wildlife: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  adventure: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  historical: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
};

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Fetch tours from API
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await toursApi.getAll();
        const data = Array.isArray(res) ? res : (res as any).data || [];
        setAllTours(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load tours');
        message.error('Failed to load tours. Please try again.');
        setAllTours([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Filter tours
  useEffect(() => {
    let filtered = [...allTours];

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // Price range
    filtered = filtered.filter((t) => t.price >= priceRange[0] && t.price <= priceRange[1]);

    // Difficulty
    if (selectedDifficulty.length > 0) {
      filtered = filtered.filter((t) => selectedDifficulty.includes(t.difficulty));
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    setTours(filtered);
  }, [allTours, searchQuery, selectedCategory, sortBy, priceRange, selectedDifficulty]);

  // Filter sidebar content
  const filterContent = (
    <div style={{ padding: '0 4px' }}>
      <div style={{ marginBottom: 28 }}>
        <Text strong style={{ display: 'block', marginBottom: 14, fontSize: 15 }}>
          Price Range
        </Text>
        <Slider
          range
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onChange={(val) => setPriceRange(val as [number, number])}
          tooltip={{ formatter: (val) => `$${val}` }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text style={{ color: '#737373', fontSize: 13 }}>${priceRange[0]}</Text>
          <Text style={{ color: '#737373', fontSize: 13 }}>${priceRange[1]}</Text>
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <Text strong style={{ display: 'block', marginBottom: 14, fontSize: 15 }}>
          Difficulty
        </Text>
        <Checkbox.Group
          value={selectedDifficulty}
          onChange={(val) => setSelectedDifficulty(val as string[])}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {['easy', 'moderate', 'challenging', 'expert'].map((d) => (
            <Checkbox key={d} value={d} style={{ fontSize: 14, textTransform: 'capitalize' }}>
              <Tag color={DIFFICULTY_COLOR[d]} style={{ margin: 0, textTransform: 'capitalize' }}>
                {d}
              </Tag>
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      <div>
        <Text strong style={{ display: 'block', marginBottom: 14, fontSize: 15 }}>
          Category
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.map((cat) => (
            <Tag
              key={cat.key}
              style={{
                cursor: 'pointer',
                padding: '4px 14px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: selectedCategory === cat.key ? 600 : 400,
                background: selectedCategory === cat.key ? '#166534' : '#f5f5f5',
                color: selectedCategory === cat.key ? '#ffffff' : '#525252',
                border: selectedCategory === cat.key ? '1px solid #166534' : '1px solid #e5e5e5',
              }}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.icon} {cat.label}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* ---- Header ---- */}
      <div
        style={{
          backgroundImage: `url(${HERO_IMAGES.explore})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '48px 24px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(5,46,22,0.95) 0%, rgba(22,101,52,0.9) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 30% 50%, rgba(245,158,11,0.08) 0%, transparent 50%)',
          }}
        />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Title level={2} style={{ color: '#ffffff', marginBottom: 0, fontWeight: 800 }}>
              Explore Zimbabwe
            </Title>
            <Tag
              icon={<SafetyCertificateOutlined />}
              color="success"
              style={{ fontSize: 11, padding: '2px 10px', borderRadius: 100, fontWeight: 600 }}
            >
              ZTA VERIFIED
            </Tag>
          </div>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, display: 'block', marginBottom: 8 }}>
            Discover government-verified tours, safaris, and adventures across the country
          </Text>

          {/* Search Bar */}
          <Input
            size="large"
            placeholder="Search tours, destinations, activities..."
            prefix={<SearchOutlined style={{ color: '#a3a3a3' }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              maxWidth: 600,
              height: 52,
              borderRadius: 14,
              fontSize: 15,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          />
        </div>
      </div>

      {/* Government Compliance Banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, #052e16, #14532d)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          borderBottom: '1px solid rgba(245,158,11,0.3)',
        }}
      >
        <Space size={6}>
          <SafetyCertificateOutlined style={{ color: '#f59e0b', fontSize: 14 }} />
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 600 }}>
            All operators ZTA licensed & verified
          </Text>
        </Space>
        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />
        <Space size={6}>
          <CheckCircleFilled style={{ color: '#22c55e', fontSize: 14 }} />
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 600 }}>
            ZIMRA tax compliant bookings
          </Text>
        </Space>
        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />
        <Space size={6}>
          <QrcodeOutlined style={{ color: '#0ea5e9', fontSize: 14 }} />
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 600 }}>
            Digital ZimPass included
          </Text>
        </Space>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        {/* ---- Featured Destinations Showcase ---- */}
        <div style={{ marginBottom: 48 }}>
          <Title level={3} style={{ marginBottom: 24, fontWeight: 800 }}>
            Iconic Destinations
          </Title>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {Object.entries(DESTINATION_IMAGES)
              .map(([name, imgUrl]) => (
                <div
                  key={name}
                  onClick={() => setSearchQuery(name)}
                  style={{
                    position: 'relative',
                    height: 220,
                    borderRadius: 16,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  className="card-hover"
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(5,46,22,0.85) 0%, rgba(0,0,0,0) 60%)',
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                    <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 700, display: 'block' }}>
                      {name}
                    </Text>
                    <Text style={{ color: '#d97706', fontSize: 13, fontWeight: 600 }}>
                      Explore tours &rarr;
                    </Text>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ---- Category Chips + Sort ---- */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 28,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', overflowX: 'auto', paddingBottom: 4 }}>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.key}
                type={selectedCategory === cat.key ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  borderRadius: 100,
                  fontWeight: selectedCategory === cat.key ? 600 : 400,
                  background: selectedCategory === cat.key ? '#166534' : '#ffffff',
                  borderColor: selectedCategory === cat.key ? '#166534' : '#e5e5e5',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.icon} {cat.label}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterDrawerOpen(true)}
              className="hide-desktop"
              style={{ borderRadius: 10 }}
            >
              Filters
            </Button>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 160 }}
              options={[
                { value: 'popular', label: 'Most Popular' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
                { value: 'rating', label: 'Highest Rated' },
              ]}
              size="large"
            />
          </div>
        </div>

        <Row gutter={[28, 28]}>
          {/* ---- Filter Sidebar (Desktop) ---- */}
          <Col xs={0} lg={6} className="hide-mobile">
            <Card
              style={{
                borderRadius: 18,
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                position: 'sticky',
                top: 90,
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Title level={5} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FilterOutlined /> Filters
              </Title>
              {filterContent}
            </Card>
          </Col>

          {/* ---- Tour Grid ---- */}
          <Col xs={24} lg={18}>
            {/* Results count */}
            <div style={{ marginBottom: 20 }}>
              <Text style={{ color: '#737373', fontSize: 14 }}>
                Showing <strong style={{ color: '#166534' }}>{tours.length}</strong> results
                {searchQuery && (
                  <>
                    {' '}for "<strong>{searchQuery}</strong>"
                  </>
                )}
              </Text>
            </div>

            {loading ? (
              <Row gutter={[24, 24]}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Col xs={24} sm={12} lg={8} key={i}>
                    <Card style={{ borderRadius: 18 }}>
                      <Skeleton.Image style={{ width: '100%', height: 200 }} active />
                      <Skeleton active paragraph={{ rows: 3 }} style={{ marginTop: 16 }} />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : error ? (
              <Card style={{ borderRadius: 18, textAlign: 'center', padding: '60px 24px' }}>
                <Empty
                  description={
                    <Text style={{ color: '#737373', fontSize: 16 }}>
                      {error}
                    </Text>
                  }
                >
                  <Button
                    type="primary"
                    onClick={() => window.location.reload()}
                    style={{ background: '#166534', borderColor: '#166534' }}
                  >
                    Retry
                  </Button>
                </Empty>
              </Card>
            ) : tours.length === 0 ? (
              <Card style={{ borderRadius: 18, textAlign: 'center', padding: '60px 24px' }}>
                <Empty
                  description={
                    <Text style={{ color: '#737373', fontSize: 16 }}>
                      No tours found matching your criteria. Try adjusting your filters.
                    </Text>
                  }
                >
                  <Button
                    type="primary"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setPriceRange([0, 500]);
                      setSelectedDifficulty([]);
                    }}
                  >
                    Clear Filters
                  </Button>
                </Empty>
              </Card>
            ) : (
              <Row gutter={[20, 20]}>
                {tours.map((tour) => (
                  <Col xs={24} sm={12} xl={8} key={tour.id}>
                    <Card
                      hoverable
                      onClick={() => navigate(`/tours/${tour.id}`)}
                      style={{
                        borderRadius: 18,
                        overflow: 'hidden',
                        border: 'none',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        height: '100%',
                      }}
                      styles={{ body: { padding: 0 } }}
                      className="card-hover"
                    >
                      {/* Real Image */}
                      <div
                        style={{
                          height: 180,
                          backgroundImage: `url(${tour.images?.[0] || CATEGORY_IMAGES[tour.category] || CATEGORY_IMAGES.safari})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                        }}
                      >
                        {/* Dark overlay for badges */}
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
                          }}
                        />

                        {/* Featured badge */}
                        {tour.isFeatured && (
                          <Tag
                            style={{
                              position: 'absolute',
                              top: 12,
                              left: 12,
                              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: 8,
                              fontWeight: 600,
                              fontSize: 11,
                              padding: '2px 10px',
                            }}
                            icon={<FireOutlined />}
                          >
                            Featured
                          </Tag>
                        )}

                        {/* Duration badge */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 12,
                            right: 12,
                            background: 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(8px)',
                            color: '#ffffff',
                            padding: '4px 12px',
                            borderRadius: 100,
                            fontSize: 12,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <ClockCircleOutlined /> {tour.duration}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: '18px 20px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <EnvironmentOutlined style={{ color: '#a3a3a3', fontSize: 12 }} />
                          <Text style={{ color: '#a3a3a3', fontSize: 12 }}>{tour.location}</Text>
                        </div>

                        <Title
                          level={5}
                          style={{ marginBottom: 8, fontSize: 16, lineHeight: 1.3 }}
                          ellipsis={{ rows: 2 }}
                        >
                          {tour.name}
                        </Title>

                        <Paragraph
                          style={{ color: '#737373', fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}
                          ellipsis={{ rows: 2 }}
                        >
                          {tour.shortDescription}
                        </Paragraph>

                        {/* Tags */}
                        <Space size={6} style={{ marginBottom: 14 }}>
                          <Tag
                            color={DIFFICULTY_COLOR[tour.difficulty]}
                            style={{ borderRadius: 6, fontSize: 11, textTransform: 'capitalize' }}
                          >
                            {tour.difficulty}
                          </Tag>
                          <Tag style={{ borderRadius: 6, fontSize: 11, background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}>
                            <TeamOutlined style={{ marginRight: 2 }} />
                            Max {tour.maxGroupSize}
                          </Tag>
                        </Space>

                        {/* Footer */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: 14,
                            borderTop: '1px solid #f5f5f5',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                              <StarFilled style={{ color: '#f59e0b', fontSize: 13 }} />
                              <Text strong style={{ fontSize: 14 }}>{tour.rating}</Text>
                              <Text style={{ color: '#a3a3a3', fontSize: 12 }}>({tour.reviewCount})</Text>
                            </div>
                            {tour.operator?.rating >= 4.5 && (
                              <Tag
                                icon={<SafetyCertificateOutlined />}
                                color="success"
                                style={{ fontSize: 10, padding: '0 6px', lineHeight: '18px', marginTop: 4 }}
                              >
                                ZTA Verified
                              </Tag>
                            )}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <Text style={{ color: '#a3a3a3', fontSize: 11, display: 'block' }}>From</Text>
                            <Text strong style={{ color: '#166534', fontSize: 20, fontWeight: 800 }}>
                              ${tour.price}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </div>

      {/* ---- Name Your Budget Floating Card ---- */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 100,
        }}
        className="hide-mobile"
      >
        <div
          onClick={() => navigate('/register')}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#ffffff',
            padding: '16px 24px',
            borderRadius: 18,
            boxShadow: '0 12px 40px rgba(245, 158, 11, 0.35)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            transition: 'transform 0.2s ease',
            animation: 'pulse-glow 3s infinite',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <DollarOutlined style={{ fontSize: 22 }} />
          <div>
            <Text style={{ color: '#ffffff', fontWeight: 700, fontSize: 14, display: 'block' }}>
              Name Your Budget
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Set your price, get offers
            </Text>
          </div>
        </div>
      </div>

      {/* ---- Mobile Filter Drawer ---- */}
      <Drawer
        title="Filters"
        placement="left"
        onClose={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
        width={300}
      >
        {filterContent}
        <div style={{ marginTop: 24 }}>
          <Button
            type="primary"
            block
            onClick={() => setFilterDrawerOpen(false)}
            style={{ height: 44, borderRadius: 10 }}
          >
            Apply Filters
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default Explore;
