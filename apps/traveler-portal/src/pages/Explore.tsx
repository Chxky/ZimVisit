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
  Badge,
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
  ArrowRightOutlined,
  FireOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { Tour, TourCategory, SearchFilters } from '../types';
import { toursApi } from '../services/api';

const { Title, Text, Paragraph } = Typography;

// ---- Mock Tour Data ----
const MOCK_TOURS: Tour[] = [
  {
    id: '1',
    name: 'Victoria Falls Grand Adventure',
    slug: 'victoria-falls-grand-adventure',
    description: 'Experience the mighty Victoria Falls from every angle — walk along the rainforest path, take a helicopter flip, and enjoy a sunset cruise on the Zambezi.',
    shortDescription: 'Full-day Victoria Falls experience with helicopter and cruise',
    location: 'Victoria Falls',
    province: 'Matabeleland North',
    category: 'victoria-falls',
    images: [],
    price: 120,
    currency: 'USD',
    duration: 'Full Day',
    durationHours: 10,
    maxGroupSize: 15,
    difficulty: 'easy',
    rating: 4.9,
    reviewCount: 234,
    inclusions: ['Park entry fees', 'Guide', 'Lunch', 'Helicopter flip', 'Sunset cruise'],
    exclusions: ['Accommodation', 'Visa fees'],
    meetingPoint: 'Victoria Falls Rainforest Entrance',
    highlights: ['Helicopter flip over the Falls', 'Walking rainforest tour', 'Zambezi sunset cruise'],
    operator: { id: 'op1', name: 'Falls Adventures Co.', rating: 4.8 },
    isFeatured: true,
    isActive: true,
    availability: [],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    name: 'Hwange Big Five Safari',
    slug: 'hwange-big-five-safari',
    description: "Track Africa's Big Five in Zimbabwe's largest national park. Morning and afternoon game drives with expert guides in open 4x4 vehicles.",
    shortDescription: 'Multi-day safari in Hwange National Park',
    location: 'Hwange National Park',
    province: 'Matabeleland North',
    category: 'safari',
    images: [],
    price: 280,
    currency: 'USD',
    duration: '3 Days',
    durationDays: 3,
    maxGroupSize: 8,
    difficulty: 'easy',
    rating: 4.8,
    reviewCount: 189,
    inclusions: ['Game drives', 'Accommodation', 'Meals', 'Professional guide', 'Park fees'],
    exclusions: ['Flights', 'Travel insurance', 'Tips'],
    meetingPoint: 'Hwange Main Camp',
    highlights: ['Big Five sightings', 'Night game drive', 'Bush dinner experience'],
    operator: { id: 'op2', name: 'Safari Legends Zimbabwe', rating: 4.9 },
    isFeatured: true,
    isActive: true,
    availability: [],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    name: 'Mana Pools Walking Safari',
    slug: 'mana-pools-walking-safari',
    description: 'Explore the UNESCO World Heritage Mana Pools on foot with armed guides. Get closer to nature than you ever thought possible.',
    shortDescription: 'Guided walking safari through pristine wilderness',
    location: 'Mana Pools',
    province: 'Mashonaland West',
    category: 'safari',
    images: [],
    price: 350,
    currency: 'USD',
    duration: '4 Days',
    durationDays: 4,
    maxGroupSize: 6,
    difficulty: 'moderate',
    rating: 4.9,
    reviewCount: 98,
    inclusions: ['Walking safari', 'Canoeing', 'Camping', 'All meals', 'Armed guide'],
    exclusions: ['Sleeping bag', 'Personal items'],
    meetingPoint: 'Mana Pools National Park Gate',
    highlights: ['Walking with elephants', 'Zambezi canoeing', 'Wild camping under stars'],
    operator: { id: 'op3', name: 'Wild Zambezi Safaris', rating: 4.9 },
    isFeatured: true,
    isActive: true,
    availability: [],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    name: 'Great Zimbabwe Heritage Tour',
    slug: 'great-zimbabwe-heritage-tour',
    description: 'Step back in time at the Great Zimbabwe ruins — the largest ancient stone structures in Africa south of the pyramids.',
    shortDescription: 'Guided tour of the ancient Great Zimbabwe ruins',
    location: 'Masvingo',
    province: 'Masvingo',
    category: 'cultural',
    images: [],
    price: 45,
    currency: 'USD',
    duration: 'Half Day',
    durationHours: 5,
    maxGroupSize: 20,
    difficulty: 'easy',
    rating: 4.7,
    reviewCount: 156,
    inclusions: ['Entry fees', 'Expert guide', 'Refreshments'],
    exclusions: ['Transport to site', 'Lunch'],
    meetingPoint: 'Great Zimbabwe Entrance',
    highlights: ['Hill Complex', 'Great Enclosure', 'Valley Ruins'],
    operator: { id: 'op4', name: 'Heritage Trails ZW', rating: 4.7 },
    isFeatured: false,
    isActive: true,
    availability: [],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '5',
    name: 'Lake Kariba Houseboat Escape',
    slug: 'lake-kariba-houseboat',
    description: 'Cruise the vast Lake Kariba on a luxury houseboat. Fish, game view from the water, and watch legendary African sunsets.',
    shortDescription: 'Multi-day luxury houseboat experience on Lake Kariba',
    location: 'Lake Kariba',
    province: 'Mashonaland West',
    category: 'lake',
    images: [],
    price: 200,
    currency: 'USD',
    duration: '2 Days',
    durationDays: 2,
    maxGroupSize: 12,
    difficulty: 'easy',
    rating: 4.6,
    reviewCount: 122,
    inclusions: ['Houseboat accommodation', 'All meals', 'Fishing equipment', 'Game viewing'],
    exclusions: ['Drinks', 'Transport to Kariba'],
    meetingPoint: 'Kariba Harbor',
    highlights: ['Sunset over the lake', 'Tiger fishing', 'Hippo encounters'],
    operator: { id: 'op5', name: 'Kariba Cruises', rating: 4.6 },
    isFeatured: false,
    isActive: true,
    availability: [],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '6',
    name: 'Nyanga Mountain Hiking Trail',
    slug: 'nyanga-mountain-hiking',
    description: "Trek through the misty Eastern Highlands, past waterfalls and ancient ruins, to the peak of Zimbabwe's highest mountain.",
    shortDescription: 'Guided hiking in the beautiful Eastern Highlands',
    location: 'Nyanga',
    province: 'Manicaland',
    category: 'hiking',
    images: [],
    price: 65,
    currency: 'USD',
    duration: 'Full Day',
    durationHours: 8,
    maxGroupSize: 10,
    difficulty: 'challenging',
    rating: 4.7,
    reviewCount: 87,
    inclusions: ['Guide', 'Packed lunch', 'Water', 'First aid'],
    exclusions: ['Hiking gear', 'Transport'],
    meetingPoint: 'Nyanga National Park Office',
    highlights: ['Mount Nyangani summit', 'Mutarazi Falls', 'Ancient terraces'],
    operator: { id: 'op6', name: 'Highland Treks', rating: 4.7 },
    isFeatured: false,
    isActive: true,
    availability: [],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '7',
    name: 'Matobo Hills Rhino Tracking',
    slug: 'matobo-hills-rhino-tracking',
    description: 'Track rhinos on foot in the ancient Matobo Hills, visit Cecil Rhodes grave, and explore San rock art sites.',
    shortDescription: 'Rhino tracking and cultural tour in Matobo Hills',
    location: 'Matobo Hills',
    province: 'Matabeleland South',
    category: 'wildlife',
    images: [],
    price: 90,
    currency: 'USD',
    duration: 'Full Day',
    durationHours: 9,
    maxGroupSize: 8,
    difficulty: 'moderate',
    rating: 4.8,
    reviewCount: 143,
    inclusions: ['Park fees', 'Armed ranger', 'Guide', 'Lunch', 'Transport from Bulawayo'],
    exclusions: ['Accommodation', 'Personal items'],
    meetingPoint: 'Matobo National Park Main Gate',
    highlights: ['Walking with rhinos', 'World View', 'San rock paintings'],
    operator: { id: 'op7', name: 'Matobo Explorer', rating: 4.8 },
    isFeatured: true,
    isActive: true,
    availability: [],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '8',
    name: 'Chimanimani Adventure Trek',
    slug: 'chimanimani-adventure-trek',
    description: 'Multi-day trek through the remote Chimanimani Mountains, crossing rivers and camping in pristine wilderness.',
    shortDescription: 'Multi-day mountain trek in remote wilderness',
    location: 'Chimanimani',
    province: 'Manicaland',
    category: 'hiking',
    images: [],
    price: 180,
    currency: 'USD',
    duration: '3 Days',
    durationDays: 3,
    maxGroupSize: 8,
    difficulty: 'expert',
    rating: 4.9,
    reviewCount: 54,
    inclusions: ['Guide', 'Camping equipment', 'All meals', 'Park fees'],
    exclusions: ['Sleeping bag', 'Hiking boots'],
    meetingPoint: 'Chimanimani Village',
    highlights: ['Bridal Veil Falls', 'Mountain pools', 'Border views into Mozambique'],
    operator: { id: 'op8', name: 'Eastern Highlands Adventures', rating: 4.9 },
    isFeatured: false,
    isActive: true,
    availability: [],
    createdAt: '',
    updatedAt: '',
  },
];

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

// ---- Category Icon Map ----
const CATEGORY_ICON: Record<string, string> = {
  safari: '🦁',
  'victoria-falls': '🌊',
  hiking: '🥾',
  cultural: '🏛️',
  lake: '⛵',
  wildlife: '🐘',
  adventure: '🧗',
  historical: '📜',
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
      try {
        const res = await toursApi.getAll();
        const data = Array.isArray(res) ? res : (res as any).data || [];
        setAllTours(data);
      } catch (err) {
        message.error('Failed to load tours. Using demo data.');
        // Keep empty — will show empty state
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
              'radial-gradient(circle at 30% 50%, rgba(245,158,11,0.08) 0%, transparent 50%)',
          }}
        />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Title level={2} style={{ color: '#ffffff', marginBottom: 8, fontWeight: 800 }}>
            Explore Zimbabwe
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, display: 'block', marginBottom: 28 }}>
            Discover tours, safaris, and adventures across the country
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

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
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
                      {/* Image Placeholder */}
                      <div
                        style={{
                          height: 180,
                          background: CATEGORY_GRADIENT[tour.category] || CATEGORY_GRADIENT.safari,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage:
                              'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 50%)',
                          }}
                        />
                        <span style={{ fontSize: 56, position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
                          {CATEGORY_ICON[tour.category] || '🌍'}
                        </span>

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
