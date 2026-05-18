// ============================================================
// ZimVisit Traveler Portal - AI Travel Assistant
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  Input,
  Button,
  Typography,
  Space,
  Avatar,
  Spin,
  Tag,
} from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  CompassOutlined,
  DollarOutlined,
  SwapOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// ---- Types ----
interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  suggestions?: string[];
  timestamp: number;
}

// ---- AI Response Map ----
const AI_RESPONSES: Record<string, { content: string; suggestions: string[] }> = {
  'plan a trip for me': {
    content: `I'd love to help you plan your Zimbabwe adventure! Let me ask a few questions:

1. How many days are you planning to stay?
2. What's your approximate budget (USD)?
3. Are you interested in: Safari, Adventure, Cultural, or Relaxation?

In the meantime, here's a popular 5-day itinerary:

- **Day 1-2:** Victoria Falls (tours, helicopter, sunset cruise)
- **Day 3:** Hwange National Park (game drive)
- **Day 4:** Great Zimbabwe (historical tour)
- **Day 5:** Lake Kariba (houseboat)

Estimated cost: $800-1,200 per person`,
    suggestions: [
      'I have 7 days and $1,500 budget',
      'I want safari + adventure',
      'What about visa requirements?',
    ],
  },
  'budget optimizer': {
    content: `Tell me your budget and I'll maximize your experience!

| Budget | Package | Highlights |
|--------|---------|------------|
| **$500** | 3-day Victoria Falls | Hotel + 2 tours |
| **$800** | 5-day Falls + Hwange | Combo deal |
| **$1,200** | 7-day Grand Zimbabwe | All highlights |

**Pro tip:** Book during shoulder season (Apr-May, Sep-Nov) for 15-20% savings. EcoCash users get an extra 5% off on select operators!`,
    suggestions: [
      'Show me the $800 package details',
      'What payment methods do you accept?',
      'Any group discounts?',
    ],
  },
  'compare destinations': {
    content: `Here's how Zimbabwe's top destinations compare:

| Destination | Rating | Best For | Cost/Day |
|-------------|--------|----------|----------|
| **Victoria Falls** | ⭐ 4.9 | Adventure & Romance | $120 |
| **Hwange** | ⭐ 4.7 | Big 5 Safari | $150 |
| **Mana Pools** | ⭐ 4.8 | Walking Safari | $180 |
| **Great Zimbabwe** | ⭐ 4.5 | History & Culture | $60 |
| **Lake Kariba** | ⭐ 4.6 | Relaxation | $100 |

Victoria Falls is our most popular destination — 70% of travelers include it in their itinerary!`,
    suggestions: [
      'Tell me more about Victoria Falls',
      'What about Mana Pools?',
      'Plan a trip combining Falls + Hwange',
    ],
  },
  'best time to visit': {
    content: `Zimbabwe is a year-round destination, but here's the seasonal breakdown:

**Dry Season (May-Oct)** — Best for Safari
- Wildlife concentrates around waterholes
- Clear skies, cooler temperatures
- Peak season: Jul-Sep (book early!)

**Green Season (Nov-Apr)** — Best for Budget
- Lush landscapes, migratory birds
- Lower prices (15-20% off)
- Victoria Falls at peak flow (Feb-May)

**Sweet Spots:**
- April-May: Falls at full power + reasonable prices
- September-October: Best game viewing + warm weather

When are you planning to visit?`,
    suggestions: [
      'I want to visit in August',
      'What about rainy season?',
      'Best time for Victoria Falls specifically?',
    ],
  },
  'visa & travel docs': {
    content: `Here's what you need to enter Zimbabwe:

**Visa-Free Countries (90 days):**
South Africa, Botswana, Namibia, Zambia, Mozambique, Kenya, Tanzania, and 40+ more

**Visa on Arrival ($30-55):**
USA ($50), UK ($55), EU ($50), Canada ($50), Australia ($50)

**KAZA UniVisa ($50):**
Covers Zimbabwe + Zambia — perfect for Victoria Falls day trips!

**Required Documents:**
- Valid passport (6+ months validity)
- Return ticket
- Proof of accommodation (your ZimPass QR works!)
- Sufficient funds

**ZimVisit makes it easy:** Your booking confirmation serves as proof of accommodation for visa applications.`,
    suggestions: [
      'I have a US passport',
      'Tell me more about KAZA visa',
      'What about COVID requirements?',
    ],
  },
};

function getAIResponse(input: string): { content: string; suggestions: string[] } {
  const lower = input.toLowerCase().trim();

  // Check exact matches first
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key) || key.includes(lower)) {
      return response;
    }
  }

  // Keyword matching
  if (lower.includes('plan') || lower.includes('itinerary') || lower.includes('trip')) {
    return AI_RESPONSES['plan a trip for me'];
  }
  if (lower.includes('budget') || lower.includes('cost') || lower.includes('price') || lower.includes('cheap')) {
    return AI_RESPONSES['budget optimizer'];
  }
  if (lower.includes('compare') || lower.includes('vs') || lower.includes('difference') || lower.includes('which')) {
    return AI_RESPONSES['compare destinations'];
  }
  if (lower.includes('when') || lower.includes('time') || lower.includes('season') || lower.includes('weather')) {
    return AI_RESPONSES['best time to visit'];
  }
  if (lower.includes('visa') || lower.includes('passport') || lower.includes('document') || lower.includes('entry')) {
    return AI_RESPONSES['visa & travel docs'];
  }

  // Default response
  return {
    content: `Great question! Zimbabwe is one of Africa's hidden gems — here's what makes it special:

🌊 **Victoria Falls** — The world's largest curtain of falling water
🦁 **Hwange National Park** — Home to 40,000+ elephants
🏛️ **Great Zimbabwe** — Ancient stone city, UNESCO World Heritage Site
🏖️ **Lake Kariba** — World's largest man-made lake by volume
🌿 **Mana Pools** — Pristine wilderness, walking safari paradise

I can help you with:
- Trip planning & itineraries
- Budget optimization
- Destination comparisons
- Visa & travel requirements
- Best time to visit

What would you like to explore?`,
    suggestions: [
      'Plan a trip for me',
      'Compare destinations',
      "What's the best time to visit?",
    ],
  };
}

// ---- Quick Actions ----
const QUICK_ACTIONS = [
  { label: 'Plan a trip for me', icon: <CompassOutlined />, key: 'plan a trip for me' },
  { label: 'Budget optimizer', icon: <DollarOutlined />, key: 'budget optimizer' },
  { label: 'Compare destinations', icon: <SwapOutlined />, key: 'compare destinations' },
  { label: 'Best time to visit', icon: <CalendarOutlined />, key: 'best time to visit' },
  { label: 'Visa & travel docs', icon: <FileTextOutlined />, key: 'visa & travel docs' },
];

// ---- Zimbabwe Bird Avatar ----
const ZimbabweBirdAvatar: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <Avatar
    size={size}
    style={{
      background: 'linear-gradient(135deg, #166534, #22c55e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    icon={<ThunderboltOutlined style={{ color: '#f59e0b', fontSize: size * 0.5 }} />}
  />
);

// ============================================================
// AI Assistant Component
// ============================================================
const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: `Jambo! I'm your ZimVisit AI Travel Assistant. 🌍

I can help you plan the perfect Zimbabwe adventure — from Victoria Falls to the ancient ruins of Great Zimbabwe.

What would you like to explore today?`,
      suggestions: [
        'Plan a trip for me',
        'Budget optimizer',
        'Compare destinations',
      ],
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const response = getAIResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: response.content,
        suggestions: response.suggestions,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text: string) => {
    sendMessage(text);
  };

  const handleQuickAction = (key: string) => {
    sendMessage(key);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '24px 16px', flex: 1, display: 'flex', gap: 20 }}>
        {/* ---- Sidebar ---- */}
        <div
          style={{
            width: 280,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Header Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #052e16 0%, #166534 100%)',
              borderRadius: 16,
              padding: '24px 20px',
              color: '#fff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <ZimbabweBirdAvatar size={40} />
              <div>
                <Title level={5} style={{ color: '#fff', margin: 0, fontSize: 16 }}>
                  ZimVisit AI
                </Title>
                <Text style={{ color: '#86efac', fontSize: 12 }}>Travel Assistant</Text>
              </div>
            </div>
            <Text style={{ color: '#d4d4d4', fontSize: 13, lineHeight: 1.5 }}>
              Powered by Zimbabwe tourism intelligence. Ask me anything about your trip!
            </Text>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '20px 16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <Text strong style={{ fontSize: 13, color: '#737373', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, display: 'block' }}>
              Quick Actions
            </Text>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.key}
                  block
                  icon={action.icon}
                  onClick={() => handleQuickAction(action.key)}
                  style={{
                    textAlign: 'left',
                    height: 44,
                    borderRadius: 10,
                    justifyContent: 'flex-start',
                    fontSize: 14,
                    borderColor: '#e5e5e5',
                    color: '#262626',
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          </div>

          {/* Stats */}
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '20px 16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <Text strong style={{ fontSize: 13, color: '#737373', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, display: 'block' }}>
              Platform Stats
            </Text>
            <Space direction="vertical" size={4}>
              <Text style={{ fontSize: 13 }}>
                <Tag color="green" style={{ margin: 0 }}>20+</Tag> Verified Operators
              </Text>
              <Text style={{ fontSize: 13 }}>
                <Tag color="gold" style={{ margin: 0 }}>30+</Tag> Tour Experiences
              </Text>
              <Text style={{ fontSize: 13 }}>
                <Tag color="blue" style={{ margin: 0 }}>8</Tag> Destinations
              </Text>
              <Text style={{ fontSize: 13 }}>
                <Tag color="purple" style={{ margin: 0 }}>4</Tag> Payment Methods
              </Text>
            </Space>
          </div>
        </div>

        {/* ---- Chat Area ---- */}
        <div
          style={{
            flex: 1,
            background: '#fff',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <ZimbabweBirdAvatar size={36} />
            <div>
              <Text strong style={{ fontSize: 15 }}>ZimVisit AI Assistant</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#22c55e',
                  }}
                />
                <Text style={{ fontSize: 12, color: '#737373' }}>Online — ready to help</Text>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: '24px',
              overflowY: 'auto',
              background: '#fafafa',
            }}
          >
            {messages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: 4,
                  }}
                >
                  {msg.role === 'ai' && <ZimbabweBirdAvatar size={28} />}
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '12px 16px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.role === 'user' ? '#166534' : '#fff',
                      color: msg.role === 'user' ? '#fff' : '#262626',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                      whiteSpace: 'pre-wrap',
                      fontSize: 14,
                      lineHeight: 1.6,
                      marginLeft: msg.role === 'ai' ? 8 : 0,
                      marginRight: msg.role === 'user' ? 0 : 0,
                    }}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <Avatar
                      size={28}
                      style={{ background: '#d4d4d4', marginLeft: 8 }}
                      icon={<UserOutlined />}
                    />
                  )}
                </div>

                {/* Suggestions */}
                {msg.role === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div style={{ marginLeft: 36, marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {msg.suggestions.map((s, i) => (
                      <Tag
                        key={i}
                        onClick={() => handleSuggestion(s)}
                        style={{
                          cursor: 'pointer',
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontSize: 13,
                          borderColor: '#166534',
                          color: '#166534',
                          background: '#f0fdf4',
                        }}
                      >
                        {s}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <ZimbabweBirdAvatar size={28} />
                <div
                  style={{
                    background: '#fff',
                    borderRadius: '16px 16px 16px 4px',
                    padding: '12px 16px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Spin size="small" />
                  <Text style={{ fontSize: 13, color: '#a3a3a3', marginLeft: 8 }}>Thinking...</Text>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #f0f0f0',
              background: '#fff',
            }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <TextArea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Zimbabwe travel..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  fontSize: 14,
                  padding: '10px 16px',
                  resize: 'none',
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                style={{
                  height: 42,
                  width: 42,
                  borderRadius: 12,
                  background: '#166534',
                  borderColor: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </div>
            <Text style={{ fontSize: 11, color: '#a3a3a3', marginTop: 8, display: 'block' }}>
              ZimVisit AI can help with trip planning, budgets, destinations, and travel requirements.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
