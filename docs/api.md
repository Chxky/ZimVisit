# ZimVisit API Documentation

## Overview

Base URL: `https://api.zimvisit.co.zw/api/v1` (production) or `http://localhost:3000/api/v1` (development)

All API responses follow a standard envelope:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-05-11T12:00:00.000Z",
  "path": "/api/v1/bookings"
}
```

Error responses:

```json
{
  "success": false,
  "statusCode": 400,
  "error": "BadRequestException",
  "message": ["Validation error message"],
  "timestamp": "2026-05-11T12:00:00.000Z",
  "path": "/api/v1/bookings"
}
```

## Authentication

### Register a new user

```
POST /auth/register
```

**Request:**
```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "password": "SecurePass123",
  "role": "traveler",
  "phone": "+263771234567"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "traveler"
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

### Login

```
POST /auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "fullName": "...", "role": "traveler" },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

### Refresh Token

```
POST /auth/refresh
```

**Request:**
```json
{
  "refreshToken": "eyJhbGci..."
}
```

## Bookings

### Create Booking

```
POST /bookings
Authorization: Bearer <token>
```

**Request:**
```json
{
  "operatorId": "uuid-optional",
  "checkIn": "2026-06-15",
  "checkOut": "2026-06-20",
  "items": [
    {
      "itemType": "tour",
      "itemId": "uuid",
      "itemName": "Victoria Falls Tour",
      "price": 85.00,
      "quantity": 2
    },
    {
      "itemType": "hotel",
      "itemId": "uuid",
      "itemName": "Meikles Hotel - Deluxe Room",
      "startDate": "2026-06-15",
      "endDate": "2026-06-17",
      "price": 250.00,
      "quantity": 1
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "bookingReference": "ZV-A3B7K2",
    "status": "pending",
    "totalAmount": 420.00,
    "taxAmount": 63.00,
    "levyAmount": 8.40,
    "platformFee": 12.60,
    "netAmount": 336.00,
    "isCompliant": true,
    "qrCodeUrl": "data:image/png;base64,...",
    "items": [...]
  }
}
```

### Get User Bookings

```
GET /bookings?page=1&limit=20
Authorization: Bearer <token>
```

### Get Booking by Reference

```
GET /bookings/reference/ZV-A3B7K2
```

### Get Booking by ID

```
GET /bookings/{id}
```

### Update Booking Status

```
PUT /bookings/{id}
Authorization: Bearer <token>
```

```json
{
  "status": "confirmed"
}
```

### Cancel Booking

```
POST /bookings/{id}/cancel
Authorization: Bearer <token>
```

### Revenue Statistics (Government/Auth Only)

```
GET /bookings/stats/revenue?startDate=2026-01-01&endDate=2026-05-11
Authorization: Bearer <token>  (ZTA, ZIMRA, Admin only)
```

### Compliance Statistics (Government/Auth Only)

```
GET /bookings/stats/compliance
Authorization: Bearer <token>  (ZTA, Admin only)
```

## Payments

### Initiate Payment

```
POST /payments/initiate
Authorization: Bearer <token>
```

```json
{
  "bookingId": "uuid",
  "provider": "paynow"
}
```

Provider options: `paynow`, `ecocash`, `stripe`, `card`

**Response:**
```json
{
  "payment": {
    "id": "uuid",
    "transactionReference": "PAY-A3B7K2",
    "provider": "paynow",
    "status": "pending",
    "amount": 420.00
  },
  "redirectUrl": "https://www.paynow.co.zw/...",
  "instructions": null
}
```

### Get Booking Payments

```
GET /payments/booking/{bookingId}
Authorization: Bearer <token>
```

## Inventory

### List Tours (Public)

```
GET /inventory/tours?category=Safari&location=Victoria+Falls&minPrice=0&maxPrice=500
```

### Get Tour Details (Public)

```
GET /inventory/tours/{id}
```

### Create Tour (Operator Auth Required)

```
POST /inventory/tours
Authorization: Bearer <token>  (Operator/Admin only)
```

```json
{
  "name": "Victoria Falls Sunset Cruise",
  "description": "Experience the magnificent sunset over Victoria Falls...",
  "price": 85.00,
  "location": "Victoria Falls",
  "duration": "3 hours",
  "maxCapacity": 20,
  "categories": ["Tour", "Water", "Sunset"],
  "inclusions": ["Drinks", "Snacks", "Guide"],
  "exclusions": ["Transport to meeting point"]
}
```

### Update Tour (Operator Auth Required)

```
PUT /inventory/tours/{id}
Authorization: Bearer <token>  (Operator/Admin only)
```

### List Hotels (Public)

```
GET /inventory/hotels?city=Harare
```

### Create Hotel (Operator Auth Required)

```
POST /inventory/hotels
Authorization: Bearer <token>  (Operator/Admin only)
```

## Compliance

### Get Operator Compliance

```
GET /compliance/operator/{operatorId}
Authorization: Bearer <token>  (Operator, ZTA, Admin only)
```

### Revenue Leakage Analysis (Government Only)

```
GET /compliance/leakage?startDate=2026-01-01&endDate=2026-05-11
Authorization: Bearer <token>  (ZTA, ZIMRA only)
```

### Review Compliance Report (Government Only)

```
PUT /compliance/{id}/review
Authorization: Bearer <token>  (ZTA, Admin only)
```

```json
{
  "reviewerId": "uuid",
  "notes": "Verified documentation received. Marking as compliant."
}
```

## GDS / Flights

### Search Flights

```
GET /gds/flights/search?origin=HRE&destination=JNB&date=2026-06-15&passengers=2
```

## Notifications

### Get User Notifications

```
GET /notifications?page=1&limit=50
Authorization: Bearer <token>
```

### Get Unread Count

```
GET /notifications/unread-count
Authorization: Bearer <token>
```

### Mark as Read

```
PUT /notifications/{id}/read
Authorization: Bearer <token>
```

### Mark All as Read

```
PUT /notifications/read-all
Authorization: Bearer <token>
```

## Users

### Get Current Profile

```
GET /users/me
Authorization: Bearer <token>
```

### Update Profile

```
PUT /users/me
Authorization: Bearer <token>
```

```json
{
  "fullName": "John Doe Updated",
  "phone": "+263777654321"
}
```

## AI Service Endpoints

The AI microservice runs independently at `http://ai-service:8000`.

### Health Check

```
GET /health
```

### Agent Fingerprinting Analysis

```
POST /api/v1/fingerprinting/analyze
```

```json
{
  "agent_id": "AGT-001",
  "booking_velocity": 3.5,
  "avg_booking_value": 245.00,
  "destinations": ["VFA", "HRE", "BUQ"],
  "booking_hours": [9, 10, 14, 15, 16],
  "session_duration_avg": 180.5,
  "fail_rate": 0.02
}
```

**Response:**
```json
{
  "agent_id": "AGT-001",
  "trust_score": 92.3,
  "anomaly_score": 7.7,
  "risk_factors": [],
  "status": "normal",
  "confidence": 94.1,
  "analyzed_at": "2026-05-11T12:00:00"
}
```

### Batch Agent Analysis

```
POST /api/v1/fingerprinting/batch-analyze
```

### Revenue Forecast

```
POST /api/v1/forecasting/revenue
```

```json
{
  "historical_data": [
    {"month": "2026-01", "revenue": 1450000},
    {"month": "2026-02", "revenue": 1380000}
  ],
  "months_ahead": 3
}
```

### Revenue Leakage Assessment

```
POST /api/v1/forecasting/leakage
```

```json
{
  "operator_ids": ["OP-001", "OP-004", "OP-008"],
  "start_date": "2026-01-01",
  "end_date": "2026-05-11"
}
```

### Check Booking Compliance

```
POST /api/v1/compliance/check-booking
```

```json
{
  "booking_id": "uuid",
  "operator_id": "uuid",
  "amount": 420.00,
  "items": [{"type": "tour", "price": 85.00}]
}
```

## Webhooks

### Payment Callbacks

ZimVisit accepts payment provider callbacks at:

```
POST /api/v1/payments/callback/{provider}
```

Where `{provider}` is one of: `paynow`, `ecocash`, `stripe`

## Rate Limiting

- Default: 100 requests per minute per IP
- Auth endpoints: 20 requests per minute per IP
- Bulk/compliance endpoints: 60 requests per minute

Rate limit headers are returned in every response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1612345678
```

## Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | BadRequestException | Invalid request body/params |
| 401 | UnauthorizedException | Missing/invalid token |
| 403 | ForbiddenException | Insufficient permissions |
| 404 | NotFoundException | Resource not found |
| 409 | ConflictException | Resource already exists |
| 422 | ValidationException | Input validation failed |
| 429 | ThrottlerException | Rate limit exceeded |
| 500 | InternalServerError | Server-side failure |

## WebSocket Events (Real-time)

Connect to `wss://api.zimvisit.co.zw/ws` with JWT token.

| Event | Direction | Payload |
|-------|-----------|---------|
| `booking.created` | Server → Client | `{ bookingId, reference, status }` |
| `booking.updated` | Server → Client | `{ bookingId, reference, status }` |
| `payment.received` | Server → Client | `{ paymentId, bookingId, amount }` |
| `compliance.alert` | Server → Client | `{ operatorId, severity, message }` |
| `notification.new` | Server → Client | `{ notificationId, title, message }` |
